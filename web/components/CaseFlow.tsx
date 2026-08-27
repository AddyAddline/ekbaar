"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CaseFile from "@/components/CaseFile";
import Emergency from "@/components/Emergency";
import Packets from "@/components/Packets";
import { MicButton, SpeakButton } from "@/components/VoiceControls";
import { triage } from "@/lib/rules";
import type {
  ActionItem,
  CaseEvent,
  EvidenceItem,
  Fact,
  Msg,
  Packet,
  WorkflowState,
} from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Guided-demo data. Everything here is synthetic and labeled so.      */
/* ------------------------------------------------------------------ */

const MEERA_STORY =
  "I am on a WhatsApp video call right now. They say they are Mumbai Police and that a parcel with my Aadhaar number has drugs in it. They showed an ID card and an arrest warrant. I already sent ₹1,20,000 to an account they called a verification account. Now they want another payment and they said I cannot hang up or tell anyone.";

const STORY_FACTS: Fact[] = [
  {
    id: "f-channel",
    label: "How they reached you",
    field: "incident.channel",
    value: "WhatsApp video call",
    sourceKind: "statement",
    sourceName: "your account",
    confidence: 0.99,
    status: "candidate",
  },
  {
    id: "f-authority",
    label: "Who they claimed to be",
    field: "incident.claimed_authority",
    value: "Mumbai Police",
    sourceKind: "statement",
    sourceName: "your account",
    confidence: 0.97,
    status: "candidate",
  },
  {
    id: "f-amount-claim",
    label: "Amount you said you sent",
    field: "transaction.amount_inr",
    value: "₹1,20,000 (needs receipt)",
    sourceKind: "statement",
    sourceName: "your account",
    confidence: 0.75,
    status: "candidate",
  },
];

const RECEIPT_FACTS: Fact[] = [
  {
    id: "f-amount",
    label: "Amount transferred",
    field: "transaction.amount_inr",
    value: "₹1,20,000",
    sourceKind: "evidence",
    sourceName: "Synthetic UPI receipt.png",
    locator: "Amount row",
    confidence: 0.99,
    status: "candidate",
  },
  {
    id: "f-utr",
    label: "UPI reference (UTR)",
    field: "transaction.utr",
    value: "228834501277",
    sourceKind: "evidence",
    sourceName: "Synthetic UPI receipt.png",
    locator: "UPI reference row",
    confidence: 0.98,
    status: "candidate",
  },
  {
    id: "f-date",
    label: "Transaction date",
    field: "transaction.date",
    value: "27 Aug 2026, 11:02",
    sourceKind: "evidence",
    sourceName: "Synthetic UPI receipt.png",
    locator: "Date row",
    confidence: 0.98,
    status: "candidate",
  },
  {
    id: "f-suspect-acct",
    label: "Account money went to",
    field: "suspect.bank_account",
    value: "XXXX 4471",
    sourceKind: "evidence",
    sourceName: "Synthetic UPI receipt.png",
    locator: "To row",
    confidence: 0.96,
    status: "candidate",
  },
];

const CHAT_FACTS: Fact[] = [
  {
    id: "f-suspect-num",
    label: "Caller's number",
    field: "suspect.mobile_display",
    value: "+91 98XX XXX 431",
    sourceKind: "evidence",
    sourceName: "Synthetic WhatsApp screenshot.png",
    locator: "Conversation header",
    confidence: 0.95,
    status: "candidate",
  },
  {
    id: "f-demand",
    label: "Further demand recorded",
    field: "incident.further_demand",
    value: "₹80,000 “second installment”",
    sourceKind: "evidence",
    sourceName: "Synthetic WhatsApp screenshot.png",
    locator: "Message at 11:05",
    confidence: 0.94,
    status: "candidate",
  },
];

const PACKETS: Packet[] = [
  {
    id: "pk-bank",
    recipient: "your bank",
    title: "Bank fraud report",
    lines: [
      { label: "Amount", value: "₹1,20,000" },
      { label: "UTR", value: "228834501277" },
      { label: "Date", value: "27 Aug 2026, 11:02" },
      { label: "Sent to", value: "a/c XXXX 4471" },
    ],
    note: "Unauthorized transfer under coercion by callers impersonating police. Ask for an immediate hold attempt and a fraud reference number.",
  },
  {
    id: "pk-1930",
    recipient: "helpline 1930",
    title: "1930 call card",
    lines: [
      { label: "Say this", value: "one breath, below" },
    ],
    note: "“I was held on a WhatsApp video call by people posing as police. I transferred ₹1,20,000 today at 11:02, UTR ending 1277, Example Bank. No further payment was made.”",
  },
  {
    id: "pk-ncrp",
    recipient: "cybercrime.gov.in",
    title: "NCRP complaint",
    lines: [
      { label: "Category", value: "Financial fraud" },
      { label: "Narrative", value: "247 words, editable" },
      { label: "Evidence", value: "2 files attached" },
      { label: "Suspect", value: "+91 98XX XXX 431 · a/c XXXX 4471" },
    ],
    note: "Every field maps to the current cybercrime.gov.in checklist. You review the narrative before anything is filed. Filing here is simulated.",
  },
];

type Stage =
  | "intro"
  | "asked_call"
  | "emergency"
  | "post_emergency"
  | "evidence"
  | "confirm"
  | "review"
  | "filed"
  | "later"
  | "done";

let idCounter = 0;
const nid = () => `m${++idCounter}`;

/* ------------------------------------------------------------------ */

export default function CaseFlow({
  mode,
  emergencyStart = false,
}: {
  mode: "guided" | "blank";
  emergencyStart?: boolean;
}) {
  const [stage, setStage] = useState<Stage>(emergencyStart ? "emergency" : "intro");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: nid(),
      role: "system",
      text:
        mode === "guided"
          ? "This is the guided demo — a synthetic case, played back exactly as the product handles it. Tap the suggested replies to move through it.\n\nWhat's happening? Tell it once, in your own words. You will not be asked to pick a category."
          : "What's happening? Tell it once, in your own words. You will not be asked to pick a category.\n\nThis is a prototype — do not enter real names, account numbers or ID numbers.",
    },
  ]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowState>(
    emergencyStart ? "urgent action required" : "collecting evidence"
  );
  const [showPackets, setShowPackets] = useState(false);
  const [showLater, setShowLater] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);
  const [guideNote, setGuideNote] = useState<string | null>(null);
  const [blankInput, setBlankInput] = useState("");
  const [blankBusy, setBlankBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, showPackets, showLater, showExplain]);

  const say = (m: Omit<Msg, "id">) => setMsgs((p) => [...p, { ...m, id: nid() }]);
  const note = (t: string) => setGuideNote(t);

  /* ---------------- guided flow ---------------- */

  const sendStory = () => {
    say({ role: "user", text: MEERA_STORY });
    setFacts(STORY_FACTS);
    note("3 facts added to your case file — nothing is final until you confirm it.");
    setTimeout(() => {
      say({
        role: "system",
        text: "This matches a documented digital-arrest scam pattern — callers posing as police over a video call, a payment already made, and an instruction to stay silent.\n\nBefore anything else: are you still on the call?",
        badge: "deterministic rule · MHA PIB-2068698",
      });
      setStage("asked_call");
    }, 900);
  };

  const answerCall = (yes: boolean) => {
    say({ role: "user", text: yes ? "Yes — they are on the line right now." : "No, the call has ended." });
    if (yes) {
      setWorkflow("urgent action required");
      setTimeout(() => setStage("emergency"), 500);
    } else {
      afterEmergency(false);
    }
  };

  const afterEmergency = (wasInterrupted: boolean) => {
    setStage("post_emergency");
    setWorkflow("collecting evidence");
    setActions([
      { id: "a-end", label: "End the call — no more money sent", sourceId: "PIB-2068698", status: "done" },
      { id: "a-1930", label: "Call 1930 and report the transfer", sourceId: "MHA-CFCFRMS-2026", status: "done" },
      { id: "a-bank", label: "Notify the bank's fraud channel", sourceId: "MHA-CFCFRMS-2026", status: "done" },
      { id: "a-ncrp", label: "Prepare the NCRP complaint", sourceId: "NCRP-CHECKLIST-2024", status: "pending" },
    ]);
    setEvents([
      {
        id: "e-interrupt",
        at: "11:06",
        source: "system",
        raw: wasInterrupted
          ? "Intake interrupted: story matched the digital-arrest pattern while the call was active. Call ended, second payment prevented."
          : "Story matched the digital-arrest pattern. Call already ended; no second payment.",
        simulated: false,
      },
    ]);
    note("The emergency came first. The form waited. Your case file kept everything.");
    say({
      role: "system",
      text: "You did the two things that matter most: the call is over and no more money moved.\n\nNow let's make what you already sent recoverable. Do you have the payment receipt, and a screenshot of the chat?",
    });
    setStage("evidence");
  };

  const addEvidence = (kind: "receipt" | "chat") => {
    if (kind === "receipt" && !evidence.some((e) => e.id === "ev-receipt")) {
      say({ role: "user", text: "Adding the UPI receipt." });
      setEvidence((p) => [
        ...p,
        { id: "ev-receipt", name: "Synthetic UPI receipt.png", kind: "transfer_receipt", src: "/evidence/upi-receipt.svg" },
      ]);
      setTimeout(() => {
        setFacts((p) => [...p.filter((f) => f.id !== "f-amount-claim"), ...RECEIPT_FACTS]);
        note("4 facts read from the receipt — each one shows where it came from.");
        say({
          role: "system",
          text: "Read from the receipt: the amount, the UPI reference, the date, and the account the money went to. Each is waiting for your confirmation in the case file — I never file anything you haven't confirmed.",
        });
      }, 700);
    }
    if (kind === "chat" && !evidence.some((e) => e.id === "ev-chat")) {
      say({ role: "user", text: "Adding the WhatsApp screenshot." });
      setEvidence((p) => [
        ...p,
        { id: "ev-chat", name: "Synthetic WhatsApp screenshot.png", kind: "chat_screenshot", src: "/evidence/whatsapp-call.svg" },
      ]);
      setTimeout(() => {
        setFacts((p) => [...p, ...CHAT_FACTS]);
        note("The caller's number and their second demand are now in the record.");
        say({
          role: "system",
          text: "The screenshot adds the caller's number and their demand for a second payment — that demand is evidence, and it stays in the original screenshot untouched.",
        });
      }, 700);
    }
  };

  const bothAdded = evidence.length >= 2;

  const toConfirm = () => {
    setStage("confirm");
    setCaseOpen(true);
    say({
      role: "system",
      text: "Look at the case file and confirm each fact. If anything is wrong, this is the moment it gets fixed — before it reaches the bank, 1930 or the complaint.",
    });
  };

  const confirmFact = (id: string) => {
    setFacts((p) => p.map((f) => (f.id === id ? { ...f, status: "confirmed" } : f)));
  };

  const confirmAll = () => {
    setFacts((p) => p.map((f) => ({ ...f, status: "confirmed" })));
  };

  const allConfirmed = facts.length > 0 && facts.every((f) => f.status === "confirmed");

  useEffect(() => {
    if (stage === "confirm" && allConfirmed) {
      setCaseOpen(false);
      setWorkflow("ready to file");
      note("Every fact is confirmed by you. One record, three recipients.");
      say({
        role: "system",
        text: "Confirmed. You told this story once. From that one record, here is exactly what each place needs — nothing retyped, nothing forgotten:",
      });
      setShowPackets(true);
      setStage("review");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allConfirmed, stage]);

  const simulateFiling = () => {
    say({ role: "user", text: "File the NCRP complaint. (Simulated — nothing is really sent.)" });
    setWorkflow("filed and acknowledged");
    setActions((p) => p.map((a) => (a.id === "a-ncrp" ? { ...a, status: "done" } : a)));
    setEvents((p) => [
      ...p,
      {
        id: "e-ack",
        at: "11:41",
        source: "ncrp",
        raw: "SIMULATED: Complaint acknowledged. Reference DEMO-NCRP-2026-0002.",
        simulated: true,
      },
    ]);
    setTimeout(() => {
      say({
        role: "system",
        text: "Acknowledged — and here is something the form never tells you: this reference number is an acknowledgement, not an FIR. Your case file keeps them separate, because the difference matters later.\n\nMost tools end here. Your case doesn't.",
      });
      setStage("filed");
    }, 800);
  };

  const goLater = () => {
    setShowLater(true);
    setStage("later");
    setTimeout(() => {
      setWorkflow("official update received");
      setEvents((p) => [
        ...p,
        {
          id: "e-hold",
          at: "17:30",
          source: "ncrp",
          raw: "DEMO MESSAGE: An amount of Rs 74000 has been put on hold. Kindly contact the police station named in your complaint record.",
          simulated: true,
        },
      ]);
      note("An official update arrived. The original text is preserved — the explanation is separate.");
      setShowExplain(true);
      setTimeout(() => {
        setWorkflow("citizen action required");
        setActions((p) => [
          ...p,
          {
            id: "a-police",
            label: "Contact the police station named in the update",
            sourceId: "EVENT",
            status: "pending",
          },
        ]);
        setStage("done");
      }, 1200);
    }, 1400);
  };

  /* ---------------- blank mode ---------------- */

  const sendBlank = async () => {
    const story = blankInput.trim();
    if (!story || blankBusy) return;
    setBlankInput("");
    say({ role: "user", text: story });
    setBlankBusy(true);
    const route = triage(story);
    if (route.kind === "digital_arrest_interruption") {
      setWorkflow("urgent action required");
      setTimeout(() => setStage("emergency"), 400);
    } else if (route.kind === "emergency_112") {
      say({
        role: "system",
        text: "If anyone is in physical danger, call 112 now. That comes before any form or report.",
        badge: "deterministic rule · ERSS-112",
      });
    } else if (route.kind === "financial_fraud") {
      say({
        role: "system",
        text: "This reads like financial cyberfraud. The route is: notify your bank's fraud channel, call 1930, then prepare the complaint on cybercrime.gov.in.\n\nThis prototype fully prepares financial-fraud cases only — the guided demo shows that complete journey.",
        badge: "deterministic rule · MHA CFCFRMS",
      });
    } else if (route.kind === "needs_more_facts") {
      say({
        role: "system",
        text: "I don't have enough to route this yet, and I won't guess. What happened, and was any money involved?",
      });
    } else {
      say({
        role: "system",
        text: "No money lost — good. If someone or something feels suspicious, cybercrime.gov.in has a “Report and Check Suspect” search, and reports without financial loss go through the same portal. This prototype fully prepares financial-fraud cases only.",
        badge: "deterministic rule · NCRP FAQ",
      });
    }
    // Model-assisted candidate facts, with a silent deterministic fallback.
    try {
      const r = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await r.json();
      if (data.model && data.facts?.length) {
        const newFacts: Fact[] = data.facts.map(
          (f: { field: string; label: string; value: string; confidence: number }, i: number) => ({
            id: `bf-${Date.now()}-${i}`,
            label: f.label,
            field: f.field,
            value: f.value,
            sourceKind: "model" as const,
            sourceName: "your account (model-suggested)",
            confidence: Math.max(0.3, Math.min(0.99, f.confidence)),
            status: "candidate" as const,
          })
        );
        setFacts((p) => [...p, ...newFacts]);
        note(`${newFacts.length} candidate facts suggested — confirm or ignore each one.`);
      }
    } catch {
      /* fallback: statement-only, no model facts */
    }
    setBlankBusy(false);
  };

  /* ---------------- render ---------------- */

  const chips: { label: string; onTap: () => void; primary?: boolean }[] = [];
  if (mode === "guided") {
    if (stage === "intro") chips.push({ label: "▸ Play Meera's message", onTap: sendStory, primary: true });
    if (stage === "asked_call") {
      chips.push({ label: "Yes — they are on the line", onTap: () => answerCall(true), primary: true });
      chips.push({ label: "No, the call ended", onTap: () => answerCall(false) });
    }
    if (stage === "evidence") {
      if (!evidence.some((e) => e.id === "ev-receipt"))
        chips.push({ label: "Add the UPI receipt", onTap: () => addEvidence("receipt"), primary: true });
      if (!evidence.some((e) => e.id === "ev-chat"))
        chips.push({ label: "Add the WhatsApp screenshot", onTap: () => addEvidence("chat") });
      if (bothAdded) chips.push({ label: "That's everything I have", onTap: toConfirm, primary: true });
    }
    if (stage === "confirm" && !allConfirmed)
      chips.push({ label: "Confirm all facts", onTap: confirmAll, primary: true });
    if (stage === "review")
      chips.push({ label: "Simulate NCRP filing", onTap: simulateFiling, primary: true });
    if (stage === "filed") chips.push({ label: "▸ Later that evening", onTap: goLater, primary: true });
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 pb-6 pt-4 lg:px-8">
      {/* conversation column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {guideNote && stage !== "emergency" && (
          <div className="msg-in mb-3 flex items-start justify-between gap-3 rounded-md border border-navy/20 bg-navy-wash px-3 py-2">
            <p className="text-[12px] leading-snug text-navy">{guideNote}</p>
            <button
              onClick={() => setGuideNote(null)}
              aria-label="Dismiss"
              className="text-[12px] text-navy/50 hover:text-navy"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex-1 space-y-3">
          {msgs.map((m) => (
            <div key={m.id} className={`msg-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-xl px-4 py-3 text-[14px] leading-relaxed ${
                  m.role === "user"
                    ? "rounded-br-sm bg-navy text-white"
                    : "rounded-bl-sm border border-line bg-paper-raised text-ink"
                }`}
              >
                {m.text}
                {m.badge && (
                  <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider opacity-60">
                    {m.badge}
                  </span>
                )}
                {m.role === "system" && (
                  <span className="mt-1.5 block">
                    <SpeakButton text={m.text} />
                  </span>
                )}
              </div>
            </div>
          ))}

          {showPackets && (
            <div className="msg-in max-w-[95%]">
              <Packets packets={PACKETS} />
            </div>
          )}

          {showLater && (
            <div className="time-break py-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              — later that evening —
            </div>
          )}

          {showExplain && (
            <div className="msg-in max-w-[92%] rounded-xl border border-line bg-paper-raised">
              <div className="border-b border-line bg-mono-bg px-4 py-3">
                <p className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                  Official message · preserved exactly <span className="stamp !text-[8px] !px-1.5 !py-0.5">Simulated</span>
                </p>
                <p className="font-mono text-[12.5px] text-ink">
                  “An amount of Rs 74000 has been put on hold. Kindly contact the police station named
                  in your complaint record.”
                </p>
              </div>
              <div className="px-4 py-3 text-[13.5px] leading-relaxed">
                <p className="mb-1.5">
                  <span className="font-semibold text-ok">What this establishes:</span> ₹74,000 of the
                  ₹1,20,000 is held somewhere in the banking chain, and a police station is now named on
                  your case.
                </p>
                <p className="mb-1.5">
                  <span className="font-semibold text-hold">What it does not:</span> a hold is not a
                  refund. It does not say the money is coming back, and it does not close the case.
                </p>
                <p>
                  <span className="font-semibold text-navy">Your next action:</span> contact the named
                  police station with your acknowledgement number. It's already in your case file, with
                  everything they will ask for.
                </p>
              </div>
            </div>
          )}

          {stage === "done" && (
            <div className="msg-in max-w-[85%] rounded-xl rounded-bl-sm border border-line bg-paper-raised px-4 py-3 text-[14px] leading-relaxed">
              This is the whole idea: one case, from the moment the scam was still live to the moment
              an official update needed translating. Told once.
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/limitations"
                  className="rounded border border-navy px-3 py-1.5 text-[12.5px] font-medium text-navy hover:bg-navy hover:text-white transition-colors"
                >
                  What is mocked here
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded border border-line-strong px-3 py-1.5 text-[12.5px] text-ink-soft hover:border-ink-soft transition-colors"
                >
                  Start again
                </button>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* input row */}
        <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-paper via-paper to-transparent pb-1 pt-3">
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={c.onTap}
                  className={`msg-in rounded-full px-4 py-2.5 text-[13.5px] font-medium transition-colors ${
                    c.primary
                      ? "bg-navy text-white hover:bg-navy-deep"
                      : "border border-line-strong bg-paper-raised text-ink hover:border-navy"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          {mode === "blank" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendBlank();
              }}
              className="flex items-center gap-2"
            >
              <MicButton onFinal={(t) => setBlankInput(t)} onInterim={(t) => setBlankInput(t)} />
              <input
                value={blankInput}
                onChange={(e) => setBlankInput(e.target.value)}
                placeholder="Speak or type — हिंदी · मराठी · English. No real names or numbers."
                className="min-w-0 flex-1 rounded-lg border border-line-strong bg-paper-raised px-4 py-3 text-[14px] outline-none placeholder:text-ink-faint focus:border-navy"
              />
              <button
                type="submit"
                disabled={blankBusy}
                className="rounded-lg bg-navy px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-navy-deep disabled:opacity-50"
              >
                {blankBusy ? "…" : "Send"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* case file column (desktop) */}
      <aside className="hidden w-[380px] shrink-0 lg:block">
        <div className="sticky top-4">
          <CaseFile
            workflowState={workflow}
            facts={facts}
            evidence={evidence}
            actions={actions}
            events={events}
            onConfirmFact={stage === "confirm" ? confirmFact : undefined}
          />
        </div>
      </aside>

      {/* case file sheet (mobile) */}
      <div className="lg:hidden">
        {!caseOpen && (facts.length > 0 || events.length > 0) && (
          <button
            onClick={() => setCaseOpen(true)}
            className="fixed bottom-16 right-4 z-40 rounded-full border border-line-strong bg-paper-raised px-4 py-2.5 text-[13px] font-medium text-navy shadow-lg"
          >
            Case file · {facts.length} facts
          </button>
        )}
        {caseOpen && (
          <div className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/30" onClick={() => setCaseOpen(false)}>
            <div
              className="msg-in max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-paper p-3 pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCaseOpen(false)}
                className="mx-auto mb-2 block h-1.5 w-10 rounded-full bg-line-strong"
                aria-label="Close case file"
              />
              <CaseFile
                workflowState={workflow}
                facts={facts}
                evidence={evidence}
                actions={actions}
                events={events}
                onConfirmFact={stage === "confirm" ? confirmFact : undefined}
              />
            </div>
          </div>
        )}
      </div>

      {stage === "emergency" && <Emergency onResolved={() => afterEmergency(true)} />}
    </div>
  );
}
