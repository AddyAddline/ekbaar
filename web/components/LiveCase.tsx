"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CaseFile from "@/components/CaseFile";
import Emergency from "@/components/Emergency";
import Packets from "@/components/Packets";
import { SpeakButton } from "@/components/VoiceControls";
import { onSayInterrupt, prepareSaying, sayClip, stopSaying } from "@/lib/say";
import { triage } from "@/lib/rules";
import { fmt, inferLang, LANG_LABEL, STR, VOICE_OF, type Lang } from "@/lib/i18n";
import type { Fact, Msg, Packet, WorkflowState, CaseEvent } from "@/lib/types";

// The live intake: speak or type in any language. Deterministic rules guard
// every turn; the model (OpenRouter) understands, extracts, and asks for the
// next missing fact; Gemini gives it ears (STT) and a voice (TTS).
//
// The session language is picked (or implied) once and every surface the
// citizen touches speaks it. Onboarding beats are ui-only bubbles: they are
// never sent to the model.

type LMsg = Msg & { uiOnly?: boolean };

const VOICE = "Kore";

// Beat 1 is deliberately trilingual and deterministic, it must work with no
// model and before any language is known.
const LANG_PICK =
  "आपका केस यहीं शुरू होता है, मैं किस भाषा में बात करूँ?\nमी कोणत्या भाषेत बोलू? · Which language should I talk to you in?";

const isLang = (v: string | null): v is Lang => v === "en" || v === "hi" || v === "mr";

const lsGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const lsSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* storage unavailable, session still works */
  }
};
const lsDel = (k: string) => {
  try {
    localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
};

let idc = 0;
const nid = () => `lm${++idc}`;

/* The waiting moment says what is actually happening, staged over time.
   After 2.5s a flat "did you know" card joins it, clearly not the reply. */
function Thinking({ lang }: { lang: Lang }) {
  const s = STR[lang];
  const [stage, setStage] = useState(0);
  const [tip, setTip] = useState<number | null>(null);
  useEffect(() => {
    let rot: ReturnType<typeof setInterval> | undefined;
    const t1 = setTimeout(() => setStage(1), 2600);
    const t2 = setTimeout(() => setStage(2), 5600);
    const t3 = setTimeout(() => {
      setTip(0);
      rot = setInterval(() => setTip((v) => ((v ?? 0) + 1) % s.tips.length), 5000);
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (rot) clearInterval(rot);
    };
  }, [s.tips.length]);
  return (
    <div className="msg-in space-y-2">
      <div className="flex justify-start">
        <div className="flex items-center gap-2.5 rounded-xl rounded-bl-sm border border-line bg-paper-raised px-4 py-3">
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy/50"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
          <span className="text-[12.5px] text-ink-faint">{s.thinking[stage]}</span>
        </div>
      </div>
      {tip !== null && (
        <div className="max-w-[85%] border border-line bg-mono-bg px-3.5 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">{s.didYouKnow}</p>
          <p className="mt-1 text-[12px] leading-snug text-ink-soft">{s.tips[tip].text}</p>
          <p className="mt-0.5 font-mono text-[10px] text-ink-faint">{s.tips[tip].source}</p>
        </div>
      )}
    </div>
  );
}

export default function LiveCase({ emergencyStart = false }: { emergencyStart?: boolean }) {
  const [lang, setLang] = useState<Lang | null>(null);
  const [phase, setPhase] = useState<"boot" | "lang" | "voice" | "done">("boot");
  const [msgs, setMsgs] = useState<LMsg[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowState>("collecting evidence");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [emergency, setEmergency] = useState(emergencyStart);
  const [recState, setRecState] = useState<"idle" | "recording" | "transcribing">("idle");
  const [recSecs, setRecSecs] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [aiDown, setAiDown] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPackets, setShowPackets] = useState(false);
  const [filed, setFiled] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Strings for every surface: the session language, English until one is set.
  const t = STR[lang ?? "en"];

  // Session language + voice preference live on this device only. Read after
  // mount, the component prerenders on the server where window is absent.
  useEffect(() => {
    const storedLang = lsGet("cs-lang");
    if (lsGet("cs-voice") === "0") setVoiceOn(false);
    if (isLang(storedLang)) {
      setLang(storedLang);
      setPhase("done");
      setMsgs([{ id: nid(), role: "system", text: STR[storedLang].welcome, uiOnly: true }]);
    } else {
      setPhase("lang");
      setMsgs([{ id: nid(), role: "system", text: LANG_PICK, uiOnly: true }]);
    }
  }, []);

  // Any playback interruption (another message, another button) clears the
  // speaking indicator.
  useEffect(() => onSayInterrupt(() => setSpeaking(false)), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, showPackets, phase, recState]);

  useEffect(
    () => () => {
      stopSaying();
      recRef.current?.stream.getTracks().forEach((tr) => tr.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      if (flashRef.current) clearTimeout(flashRef.current);
    },
    []
  );

  const say = (m: Omit<LMsg, "id">) => setMsgs((p) => [...p, { ...m, id: nid() }]);

  /* -------- onboarding beats -------- */

  const pickLang = (l: Lang) => {
    setLang(l);
    lsSet("cs-lang", l);
    setPhase("voice");
    say({ role: "system", text: STR[l].voiceQuestion, uiOnly: true });
    // The chip tap is the user gesture; the demo clip is pre-generated.
    try {
      new Audio(`/onboard/voice-demo-${l}.mp3`).play().catch(() => {});
    } catch {
      /* no audio, the question still reads fine as text */
    }
  };

  const answerVoice = (yes: boolean) => {
    if (!yes) stopSaying();
    setVoiceOn(yes);
    lsSet("cs-voice", yes ? "1" : "0");
    setPhase("done");
    say({ role: "system", text: STR[lang ?? "en"].welcome, uiOnly: true });
    // They just said "speak aloud" - the very next message must keep that
    // promise. Pre-generated clip, so it starts instantly.
    if (yes) sayClip(`/onboard/welcome-${lang ?? "en"}.mp3`);
  };

  const resetLang = () => {
    lsDel("cs-lang");
    setLang(null);
    setPhase("lang");
    say({ role: "system", text: LANG_PICK, uiOnly: true });
  };

  /* -------- conversation -------- */

  // Voice mode reveals the reply once: the thinking state runs until the
  // audio is ready, then text and voice arrive together.

  const mergeFacts = (
    incoming: { field: string; label: string; value: string; confidence: number }[]
  ) => {
    if (!incoming.length) return;
    // Flash the newest genuinely-new fact in the mobile case bar for ~2s.
    const fresh = [...incoming]
      .reverse()
      .find((f) => f.field && f.value && facts.find((x) => x.field === f.field)?.value !== String(f.value));
    if (fresh) {
      setFlash(`${fresh.label || fresh.field}: ${fresh.value}`);
      if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 2000);
    }
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
    stopSaying();

    // Skip-by-doing: writing (or speaking) during onboarding sets the session
    // language from the words themselves; voice stays on by default, unasked.
    let sessLang = lang;
    if (sessLang === null) {
      sessLang = inferLang(text);
      setLang(sessLang);
      lsSet("cs-lang", sessLang);
      setVoiceOn(true);
      setPhase("done");
    } else if (phase !== "done") {
      setPhase("done");
    }
    const T = STR[sessLang];

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
      // Real conversation turns only: every ui-only bubble stays out.
      const history = [...msgs, { id: "x", role: "user" as const, text }]
        .filter((m) => !m.uiOnly)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang: sessLang }),
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
        say({ role: "system", text: T.aiDown, uiOnly: true });
        return;
      }
      const reveal = () => {
        say({ role: "system", text: d.reply });
        mergeFacts(d.facts ?? []);
        if (d.ready_to_review) setReady(true);
      };
      if (voiceOn && d.reply) {
        // One arrival: hold the thinking state while the voice is made
        // (10s cap inside prepareSaying), then show and speak together.
        const play = await prepareSaying(d.reply, {
          voice: VOICE,
          onStart: () => setSpeaking(true),
          onEnd: () => setSpeaking(false),
        });
        reveal();
        play?.();
      } else {
        reveal();
      }
    } catch {
      setAiDown(true);
      say({ role: "system", text: T.aiDown, uiOnly: true });
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
        stream.getTracks().forEach((tr) => tr.stop());
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
            say({ role: "system", text: STR[lang ?? "en"].sttRetry, uiOnly: true });
          }
        } catch {
          say({ role: "system", text: STR[lang ?? "en"].sttRetry, uiOnly: true });
        } finally {
          setRecState("idle");
        }
      };
      rec.start();
      recRef.current = rec;
      setRecState("recording");
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000);
      autoStopRef.current = setTimeout(() => stopRec(), 60000);
    } catch {
      say({ role: "system", text: STR[lang ?? "en"].micDenied, uiOnly: true });
    }
  };

  const stopRec = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
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
        { label: "Amount", value: fv("transaction.amount_inr") ?? "-" },
        { label: "UTR", value: fv("transaction.utr") ?? "-" },
        { label: "Date", value: fv("transaction.date") ?? fv("incident.datetime") ?? "-" },
        { label: "Bank/wallet", value: fv("transaction.bank_or_wallet") ?? "-" },
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
        { label: "Suspect", value: fv("suspect.mobile_display") ?? fv("suspect.upi_id") ?? fv("suspect.bank_account") ?? "-" },
      ],
      note: "Mapped to the current cybercrime.gov.in checklist. Filing here is simulated and labeled.",
    },
  ];

  const confirmedCount = facts.filter((f) => f.status === "confirmed").length;
  const candidateCount = facts.filter((f) => f.status === "candidate").length;
  const hasUserTurn = msgs.some((m) => m.role === "user");
  const lastSystemId = [...msgs].reverse().find((m) => m.role === "system")?.id;

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
    say({ role: "system", text: t.filedMsg });
  };

  /* -------- render -------- */

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 pb-6 pt-4 lg:px-8">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 space-y-3">
          {lang && (
            <div className="flex justify-end">
              <button
                onClick={resetLang}
                className="rounded-full border border-line-strong bg-card px-2.5 py-1 text-[11px] font-semibold text-ink-soft hover:border-navy hover:text-navy"
              >
                {LANG_LABEL[lang]} · {t.changeLang}
              </button>
            </div>
          )}

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
                {speaking && m.id === lastSystemId && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-navy align-middle" aria-hidden />
                )}
                {m.badge && (
                  <span className="mt-2 block font-mono text-[10px] uppercase tracking-wider opacity-60">{m.badge}</span>
                )}
                {m.role === "system" && (
                  <span className="mt-1.5 block">
                    <SpeakButton text={m.text} voice={VOICE} lang={VOICE_OF[lang ?? "en"]} />
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* beat 1: pick a language, or just start talking, either works */}
          {phase === "lang" && (
            <div className="msg-in space-y-2.5 pt-1">
              <div className="flex flex-wrap gap-2">
                {(["hi", "mr", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => pickLang(l)}
                    className="rounded-full border border-line-strong bg-paper-raised px-6 py-3 text-[16px] font-semibold text-ink hover:border-navy hover:text-navy"
                  >
                    {LANG_LABEL[l]}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-ink-faint">{STR.en.langNote}</p>
            </div>
          )}

          {/* beat 2: hear the voice once, then choose */}
          {phase === "voice" && lang && (
            <div className="msg-in flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => answerVoice(true)}
                className="rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-navy-deep"
              >
                {STR[lang].voiceYes}
              </button>
              <button
                onClick={() => answerVoice(false)}
                className="rounded-full border border-line-strong bg-paper-raised px-5 py-2.5 text-[13.5px] font-semibold text-ink-soft hover:border-navy hover:text-navy"
              >
                {STR[lang].voiceNo}
              </button>
            </div>
          )}

          {recState === "transcribing" && (
            <div className="msg-in flex justify-end">
              <div className="max-w-[85%] animate-pulse rounded-xl rounded-br-sm bg-navy/60 px-4 py-3 text-[14px] text-white/90">
                {t.sttUnderstanding}
              </div>
            </div>
          )}

          {busy && <Thinking lang={lang ?? "en"} />}

          {ready && confirmedCount >= 3 && !showPackets && (
            <button
              onClick={() => setShowPackets(true)}
              className="msg-in rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-navy-deep"
            >
              {t.preparePackets}
            </button>
          )}
          {ready && confirmedCount < 3 && facts.length > 0 && (
            <div className="msg-in space-y-1.5">
              <button
                onClick={() => setCaseOpen(true)}
                className="block rounded-xl rounded-bl-sm border border-navy bg-navy-wash px-4 py-3 text-left text-[13.5px] font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
              >
                {fmt(t.factsAwait, { n: candidateCount })}
              </button>
              <p className="text-[12px] text-ink-faint">{t.confirmHint}</p>
            </div>
          )}

          {showPackets && (
            <div className="msg-in max-w-[95%] space-y-3">
              <Packets packets={livePackets} />
              {!filed && (
                <button
                  onClick={simulateFiling}
                  className="rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-navy-deep"
                >
                  {t.simulateFiling}
                </button>
              )}
            </div>
          )}

          {phase === "done" && !hasUserTurn && (
            <div className="flex flex-wrap gap-2 pt-1">
              {t.starters.map((s) => (
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

        {/* composer, fully active from the first frame, onboarding included */}
        <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-paper via-paper to-transparent pb-1 pt-3">
          {facts.length > 0 && (
            <button
              onClick={() => setCaseOpen(true)}
              className="mb-2 flex w-full items-center justify-between rounded-lg border border-line-strong bg-card px-3 py-2 shadow-sm lg:hidden"
            >
              <span className={`text-[12.5px] font-semibold ${flash ? "text-green" : "text-navy"}`}>
                {flash ?? fmt(t.caseBar, { n: facts.length, c: confirmedCount })}
              </span>
              <span className="text-[12px] text-ink-faint">{t.openSheet}</span>
            </button>
          )}
          <div className="mb-1.5 flex items-center justify-between px-1">
            <p className="text-[11px] text-ink-faint">
              {recState === "recording" && (
                <span className="font-semibold text-red">{fmt(t.sttRecording, { s: recSecs })}</span>
              )}
              {recState === "transcribing" && <span className="font-semibold text-navy">{t.sttUnderstanding}</span>}
              {recState === "idle" && speaking && <span className="text-navy">{t.speaking}</span>}
              {recState === "idle" && !speaking && t.statusSpeakType}
            </p>
            <button
              onClick={() => {
                if (voiceOn) stopSaying();
                setVoiceOn(!voiceOn);
                lsSet("cs-voice", voiceOn ? "0" : "1");
              }}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                voiceOn ? "border-navy bg-navy-wash text-navy" : "border-line-strong text-ink-faint"
              }`}
            >
              {voiceOn ? t.repliesAloud : t.repliesMuted}
            </button>
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
              placeholder={t.placeholder}
              className="min-w-0 flex-1 rounded-lg border border-line-strong bg-paper-raised px-4 py-3 text-[14px] outline-none placeholder:text-ink-faint focus:border-navy"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-lg bg-navy px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-navy-deep disabled:opacity-40"
            >
              {t.send}
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
            lang={lang ?? "en"}
            variant="draft"
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
                lang={lang ?? "en"}
                variant="draft"
                onConfirmFact={(id) => setFacts((p) => p.map((f) => (f.id === id ? { ...f, status: "confirmed" } : f)))}
              />
            </div>
          </div>
        )}
      </div>

      {emergency && (
        <Emergency
          sessionLang={VOICE_OF[lang ?? "en"]}
          onResolved={() => {
            setEmergency(false);
            setWorkflow("collecting evidence");
            say({ role: "system", text: t.emergencyResume });
          }}
        />
      )}
    </div>
  );
}
