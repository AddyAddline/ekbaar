"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CaseFile from "@/components/CaseFile";
import Emergency from "@/components/Emergency";
import Packets from "@/components/Packets";
import { SpeakButton } from "@/components/VoiceControls";
import { triage } from "@/lib/rules";
import type { Fact, Msg, Packet, WorkflowState, CaseEvent } from "@/lib/types";

// The live intake: speak or type in any language. Deterministic rules guard
// every turn; the model (OpenRouter) understands, extracts, and asks for the
// next missing fact; Gemini gives it ears (STT) and a voice (TTS).

const VOICES = [
  { id: "Kore", label: "Kore · calm" },
  { id: "Achernar", label: "Achernar · warm" },
  { id: "Charon", label: "Charon · steady" },
  { id: "Aoede", label: "Aoede · light" },
  { id: "Puck", label: "Puck · bright" },
  { id: "Leda", label: "Leda · clear" },
  { id: "Orus", label: "Orus · deep" },
  { id: "Zephyr", label: "Zephyr · soft" },
];

const STARTERS = [
  "मेरे साथ UPI फ्रॉड हुआ है, पैसे कट गए",
  "I paid a seller on Instagram and got blocked",
  "मला एका अनोळखी नंबरवरून धमकी आली आहे",
];

let idc = 0;
const nid = () => `lm${++idc}`;

export default function LiveCase({ emergencyStart = false }: { emergencyStart?: boolean }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: nid(),
      role: "system",
      text: "What's happening? बोलिए या लिखिए — कोई भी भाषा.\nTell it once, in your own words. Your case file builds as you speak.\n\n(Prototype — no real names, IDs or account numbers.)",
    },
  ]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowState>("collecting evidence");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [emergency, setEmergency] = useState(emergencyStart);
  const [recState, setRecState] = useState<"idle" | "recording" | "transcribing">("idle");
  const [recSecs, setRecSecs] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [voice, setVoice] = useState("Kore");
  const [speaking, setSpeaking] = useState(false);
  const [aiDown, setAiDown] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPackets, setShowPackets] = useState(false);
  const [filed, setFiled] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, showPackets]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      recRef.current?.stream.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  const say = (m: Omit<Msg, "id">) => setMsgs((p) => [...p, { ...m, id: nid() }]);

  const playReply = async (text: string) => {
    if (!voiceOn) return;
    try {
      const r = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 800), voice }),
      });
      if (!r.ok) return;
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      audioRef.current?.pause();
      const a = new Audio(url);
      audioRef.current = a;
      setSpeaking(true);
      a.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(url);
      };
      await a.play().catch(() => setSpeaking(false));
    } catch {
      /* silent: voice is a layer, never a dependency */
    }
  };

  const mergeFacts = (
    incoming: { field: string; label: string; value: string; confidence: number }[]
  ) => {
    if (!incoming.length) return;
    setFacts((prev) => {
      const next = [...prev];
      for (const f of incoming) {
        if (!f.field || !f.value) continue;
        const i = next.findIndex((x) => x.field === f.field);
        const fact: Fact = {
          id: `lf-${f.field}`,
          field: f.field,
          label: f.label || f.field,
          value: String(f.value),
          sourceKind: "model",
          sourceName: "your account (model-suggested)",
          confidence: Math.max(0.3, Math.min(0.99, f.confidence ?? 0.7)),
          status: next[i]?.status === "confirmed" && next[i]?.value === String(f.value) ? "confirmed" : "candidate",
        };
        if (i >= 0) next[i] = fact;
        else next.push(fact);
      }
      return next;
    });
  };

  const send = async (textRaw?: string) => {
    const text = (textRaw ?? input).trim();
    if (!text || busy) return;
    setInput("");
    audioRef.current?.pause();
    setSpeaking(false);
    say({ role: "user", text });

    // Deterministic guard before anything else.
    const route = triage(text);
    if (route.kind === "digital_arrest_interruption") {
      setWorkflow("urgent action required");
      setTimeout(() => setEmergency(true), 350);
      return;
    }
    if (route.kind === "emergency_112") {
      say({
        role: "system",
        text: "If anyone is in physical danger, call 112 now. That comes before any form or report.",
        badge: "deterministic rule · ERSS-112",
      });
      return;
    }

    setBusy(true);
    try {
      const history = [...msgs, { id: "x", role: "user" as const, text }]
        .filter((m) => m.role === "user" || m.role === "system")
        .slice(1) // drop the welcome
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const d = await r.json();
      if (d.emergency === "digital_arrest_interruption" || d.emergency_suspected) {
        setWorkflow("urgent action required");
        setEmergency(true);
        return;
      }
      if (d.emergency === "emergency_112") {
        say({ role: "system", text: "If anyone is in physical danger, call 112 now.", badge: "deterministic rule · ERSS-112" });
        return;
      }
      if (!d.model) {
        setAiDown(true);
        say({
          role: "system",
          text: "Live AI isn't reachable right now, so I can't hold a conversation — but nothing is lost. The sample case shows the complete journey, and the deterministic route still applies: bank fraud channel, 1930, then the complaint.",
        });
        return;
      }
      say({ role: "system", text: d.reply });
      mergeFacts(d.facts ?? []);
      if (d.ready_to_review) setReady(true);
      playReply(d.reply);
    } catch {
      setAiDown(true);
      say({ role: "system", text: "Something interrupted the connection. Your case file is untouched — try again, or open the sample case." });
    } finally {
      setBusy(false);
    }
  };

  /* -------- push-to-talk -------- */

  const startRec = async () => {
    if (recState !== "idle" || busy) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecState("transcribing");
        try {
          const blob = new Blob(chunksRef.current, { type: mime });
          const buf = await blob.arrayBuffer();
          let bin = "";
          const bytes = new Uint8Array(buf);
          for (let i = 0; i < bytes.length; i += 8192) {
            bin += String.fromCharCode(...bytes.subarray(i, i + 8192));
          }
          const r = await fetch("/api/stt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: btoa(bin), mime }),
          });
          const d = await r.json();
          if (d.text) {
            send(d.text);
          } else {
            say({ role: "system", text: "I couldn't catch that — try once more, a little closer to the phone, or type it." });
          }
        } catch {
          say({ role: "system", text: "Couldn't reach the transcription service. Typing still works." });
        } finally {
          setRecState("idle");
        }
      };
      rec.start();
      recRef.current = rec;
      setRecState("recording");
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000);
    } catch {
      say({ role: "system", text: "Microphone permission was blocked — typing works just the same." });
    }
  };

  const stopRec = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recRef.current?.stop();
  };

  /* -------- packets from live facts -------- */

  const fv = (field: string) => facts.find((f) => f.field === field && f.status === "confirmed")?.value;
  const livePackets: Packet[] = [
    {
      id: "lp-bank",
      recipient: "your bank",
      title: "Bank fraud report",
      lines: [
        { label: "Amount", value: fv("transaction.amount_inr") ?? "—" },
        { label: "UTR", value: fv("transaction.utr") ?? "—" },
        { label: "Date", value: fv("transaction.date") ?? fv("incident.datetime") ?? "—" },
        { label: "Bank/wallet", value: fv("transaction.bank_or_wallet") ?? "—" },
      ],
      note: "Ask for an immediate hold attempt and a fraud reference number.",
    },
    {
      id: "lp-1930",
      recipient: "helpline 1930",
      title: "1930 call card",
      lines: [{ label: "Say this", value: "one breath, below" }],
      note: `"${fv("incident.channel") ?? "Online"} fraud. I lost ${fv("transaction.amount_inr") ?? "an amount"} on ${fv("transaction.date") ?? "the date"}, reference ${fv("transaction.utr") ?? "in my receipt"}. No further payment made."`,
    },
    {
      id: "lp-ncrp",
      recipient: "cybercrime.gov.in",
      title: "NCRP complaint",
      lines: [
        { label: "Category", value: "Financial fraud" },
        { label: "Facts", value: `${facts.filter((f) => f.status === "confirmed").length} confirmed` },
        { label: "Suspect", value: fv("suspect.mobile_display") ?? fv("suspect.upi_id") ?? fv("suspect.bank_account") ?? "—" },
      ],
      note: "Mapped to the current cybercrime.gov.in checklist. Filing here is simulated and labeled.",
    },
  ];

  const confirmedCount = facts.filter((f) => f.status === "confirmed").length;

  const simulateFiling = () => {
    setFiled(true);
    setWorkflow("filed and acknowledged");
    setEvents((p) => [
      ...p,
      {
        id: "le-ack",
        at: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        source: "ncrp",
        raw: "SIMULATED: Complaint acknowledged. Reference DEMO-NCRP-2026-1001.",
        simulated: true,
      },
    ]);
    say({
      role: "system",
      text: "Simulated filing recorded — reference DEMO-NCRP-2026-1001. Remember: an acknowledgement is not an FIR, and your case stays live here. Track it any time from the Track section.",
    });
  };

  /* -------- render -------- */

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 pb-6 pt-4 lg:px-8">
      <div className="flex min-w-0 flex-1 flex-col">
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
                  <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider opacity-60">{m.badge}</span>
                )}
                {m.role === "system" && (
                  <span className="mt-1.5 block">
                    <SpeakButton text={m.text} />
                  </span>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="msg-in flex justify-start">
              <div className="flex items-center gap-1.5 rounded-xl rounded-bl-sm border border-line bg-paper-raised px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/50"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {ready && confirmedCount >= 3 && !showPackets && (
            <button
              onClick={() => setShowPackets(true)}
              className="msg-in rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-navy-deep"
            >
              Prepare my packets — bank · 1930 · NCRP
            </button>
          )}
          {ready && confirmedCount < 3 && facts.length > 0 && (
            <p className="msg-in text-[12px] text-ink-faint">
              Confirm the facts in your case file to unlock the packets — nothing unconfirmed is ever used.
            </p>
          )}

          {showPackets && (
            <div className="msg-in max-w-[95%] space-y-3">
              <Packets packets={livePackets} />
              {!filed && (
                <button
                  onClick={simulateFiling}
                  className="rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-navy-deep"
                >
                  Simulate NCRP filing — nothing is really sent
                </button>
              )}
            </div>
          )}

          {msgs.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-line-strong bg-paper-raised px-3.5 py-2 text-[12.5px] text-ink-soft hover:border-navy hover:text-navy"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {aiDown && (
            <Link
              href="/report?mode=sample"
              className="msg-in inline-block rounded-lg border border-navy px-4 py-2 text-[13px] font-semibold text-navy hover:bg-navy hover:text-white"
            >
              Open the sample case instead →
            </Link>
          )}
          <div ref={endRef} />
        </div>

        {/* composer */}
        <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-paper via-paper to-transparent pb-1 pt-3">
          {facts.length > 0 && (
            <button
              onClick={() => setCaseOpen(true)}
              className="mb-2 flex w-full items-center justify-between rounded-lg border border-line-strong bg-card px-3 py-2 shadow-sm lg:hidden"
            >
              <span className="text-[12.5px] font-semibold text-navy">
                Case file · {facts.length} facts · {confirmedCount} confirmed by you
              </span>
              <span className="text-[12px] text-ink-faint">open ▸</span>
            </button>
          )}
          <div className="mb-1.5 flex items-center justify-between px-1">
            <p className="text-[11px] text-ink-faint">
              {recState === "recording" && (
                <span className="font-semibold text-red">● Recording {recSecs}s — tap the mic to finish</span>
              )}
              {recState === "transcribing" && <span className="font-semibold text-navy">Understanding your words…</span>}
              {recState === "idle" && speaking && <span className="text-navy">Speaking…</span>}
              {recState === "idle" && !speaking && "Speak or type — any language"}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (voiceOn) audioRef.current?.pause();
                  setVoiceOn(!voiceOn);
                }}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                  voiceOn ? "border-navy bg-navy-wash text-navy" : "border-line-strong text-ink-faint"
                }`}
              >
                {voiceOn ? "🔊 replies aloud" : "🔇 replies muted"}
              </button>
              {voiceOn && (
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  aria-label="Reply voice"
                  className="rounded-full border border-line-strong bg-card px-2 py-1 text-[11px] text-ink-soft outline-none focus:border-navy"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={recState === "recording" ? stopRec : startRec}
              disabled={recState === "transcribing" || busy}
              aria-label={recState === "recording" ? "Finish speaking" : "Speak instead of typing"}
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all disabled:opacity-40 ${
                recState === "recording"
                  ? "border-red bg-red text-white"
                  : "border-line-strong bg-card text-navy hover:border-navy"
              }`}
            >
              {recState === "recording" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-30" />
              )}
              {recState === "recording" ? (
                "◼"
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                </svg>
              )}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="बोलिए, या यहाँ लिखिए…"
              className="min-w-0 flex-1 rounded-lg border border-line-strong bg-paper-raised px-4 py-3 text-[14px] outline-none placeholder:text-ink-faint focus:border-navy"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-lg bg-navy px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-navy-deep disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* case file: desktop */}
      <aside className="hidden w-[380px] shrink-0 lg:block">
        <div className="sticky top-4">
          <CaseFile
            workflowState={workflow}
            facts={facts}
            evidence={[]}
            actions={[]}
            events={events}
            onConfirmFact={(id) => setFacts((p) => p.map((f) => (f.id === id ? { ...f, status: "confirmed" } : f)))}
          />
        </div>
      </aside>

      {/* case file: mobile sheet */}
      <div className="lg:hidden">
        {caseOpen && (
          <div className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/30" onClick={() => setCaseOpen(false)}>
            <div className="msg-in max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-paper p-3 pb-6" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setCaseOpen(false)}
                className="mx-auto mb-2 block h-1.5 w-10 rounded-full bg-line-strong"
                aria-label="Close case file"
              />
              <CaseFile
                workflowState={workflow}
                facts={facts}
                evidence={[]}
                actions={[]}
                events={events}
                onConfirmFact={(id) => setFacts((p) => p.map((f) => (f.id === id ? { ...f, status: "confirmed" } : f)))}
              />
            </div>
          </div>
        )}
      </div>

      {emergency && (
        <Emergency
          onResolved={() => {
            setEmergency(false);
            setWorkflow("collecting evidence");
            say({
              role: "system",
              text: "You did the two things that matter most: the call is over and no more money moved. When you're ready, tell me about the transfer you already made — amount first — and we'll make it recoverable.",
            });
          }}
        />
      )}
    </div>
  );
}
