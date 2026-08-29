"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Emergency from "@/components/Emergency";
import { SpeakButton } from "@/components/VoiceControls";
import { triage } from "@/lib/rules";
import { fmt, STR, VOICE_OF, type Lang } from "@/lib/i18n";
import { matchPattern, patternById, patternText, type Pattern } from "@/lib/patterns";

// The scam checker: paste the SMS or say what happened, get a verdict card
// rendered entirely from the six documented patterns (lib/patterns.ts),
// never from model prose. The deterministic triage guard runs before any
// network call, and the rules-only matcher keeps the panel alive when the
// model is unreachable.

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

type Verdict =
  | { kind: "model"; pattern: Pattern | null; reply: string; risk: string | null; handoff: string | null }
  | { kind: "fallback"; pattern: Pattern | null };

const MAX_TURNS = 6;

export default function ScamCheck({
  lang,
  seed,
}: {
  lang: Lang;
  // A pattern card's "check a message like this" seeds the input; a fresh
  // object per click re-fires the effect even for the same text.
  seed?: { text: string; n: number };
}) {
  const t = STR[lang];
  const dev = lang !== "en" ? "font-devanagari" : "";

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [checking, setChecking] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [postEmergency, setPostEmergency] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [tip, setTip] = useState(0);
  const [recState, setRecState] = useState<"idle" | "recording" | "transcribing">("idle");
  const [recSecs, setRecSecs] = useState(0);

  // A new seed from the pattern cards lands in the input as derived state.
  const [seedTaken, setSeedTaken] = useState(0);
  if (seed && seed.n !== seedTaken) {
    setSeedTaken(seed.n);
    setInput(seed.text);
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // One rotating sourced tip keeps the empty state alive.
  useEffect(() => {
    const rot = setInterval(() => setTip((v) => (v + 1) % t.tips.length), 6000);
    return () => clearInterval(rot);
  }, [t.tips.length]);

  useEffect(() => {
    if (seed?.text) inputRef.current?.focus();
  }, [seed]);

  useEffect(
    () => () => {
      recRef.current?.stream.getTracks().forEach((tr) => tr.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
    },
    []
  );

  const atCap = messages.length >= MAX_TURNS;

  const reset = () => {
    setMessages([]);
    setVerdict(null);
    setPostEmergency(false);
    setNotice(null);
    setInput("");
  };

  const send = async (textRaw?: string) => {
    const text = (textRaw ?? input).trim();
    if (!text || checking || atCap) return;
    setInput("");
    setNotice(null);

    // Deterministic guard first: the emergency screen never waits for the
    // network, and works when the model is down.
    const route = triage(text);
    if (route.kind === "digital_arrest_interruption" || route.kind === "emergency_112") {
      setMessages((p) => [...p, { role: "user", content: text }]);
      setEmergency(true);
      return;
    }

    const history: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setChecking(true);
    try {
      const r = await fetch("/api/learn-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, lang }),
      });
      const d = await r.json();
      if (d.emergency === "digital_arrest_interruption" || d.emergency === "emergency_112") {
        setEmergency(true);
        return;
      }
      if (!d.model) {
        // Rules-only fallback: same verdict card, labeled as such.
        setVerdict({ kind: "fallback", pattern: matchPattern(text) });
        return;
      }
      const reply = String(d.reply ?? "");
      if (reply) setMessages((p) => [...p, { role: "assistant", content: reply }]);
      setVerdict({
        kind: "model",
        pattern: patternById(d.pattern_id),
        reply,
        risk: d.risk ?? null,
        handoff: d.handoff ?? null,
      });
    } catch {
      setVerdict({ kind: "fallback", pattern: matchPattern(text) });
    } finally {
      setChecking(false);
    }
  };

  /* -------- push-to-talk, same flow as the live intake -------- */

  const startRec = async () => {
    if (recState !== "idle" || checking) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
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
          if (d.text) send(d.text);
          else setNotice(t.sttRetry);
        } catch {
          setNotice(t.sttRetry);
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
      setNotice(t.micDenied);
    }
  };

  const stopRec = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    recRef.current?.stop();
  };

  /* -------- render -------- */

  const showEmpty = messages.length === 0 && !checking && !postEmergency;
  const curTip = t.tips[tip];
  const moneyBanner =
    postEmergency ||
    (verdict?.kind === "model" && (verdict.risk === "money_moved" || verdict.handoff === "report"));

  const verdictPattern = verdict?.pattern ? patternText(verdict.pattern, lang) : null;

  return (
    <section
      id="checker"
      className="flex h-full scroll-mt-6 flex-col rounded-xl border border-line bg-card p-5 sm:p-6"
    >
      <h2 className={`text-[clamp(20px,3vw,26px)] font-extrabold leading-tight tracking-tight ${dev}`}>
        {t.checkerTitle}
      </h2>
      <p className={`mt-1 text-[12px] leading-snug text-ink-faint ${dev}`}>{t.checkerDisambig}</p>

      <div className="mt-4 flex-1 space-y-3">
        {showEmpty && (
          <>
            <p className={`text-[13px] leading-relaxed text-ink-soft ${dev}`}>{t.checkerBoundary}</p>
            <div key={tip} className="fact-arrive max-w-[92%] border border-line bg-mono-bg px-3.5 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">{t.didYouKnow}</p>
              <p className={`mt-1 text-[12px] leading-snug text-ink-soft ${dev}`}>{curTip.text}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-faint">{curTip.source}</p>
            </div>
          </>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="msg-in flex justify-end">
              <div className="max-w-[90%] rounded-xl rounded-br-sm bg-navy px-4 py-2.5 text-[13.5px] leading-relaxed text-white">
                {m.content}
              </div>
            </div>
          ) : null
        )}

        {recState === "transcribing" && (
          <div className="msg-in flex justify-end">
            <div className="max-w-[85%] animate-pulse rounded-xl rounded-br-sm bg-navy/60 px-4 py-2.5 text-[13.5px] text-white/90">
              {t.sttUnderstanding}
            </div>
          </div>
        )}

        {checking && (
          <div className="msg-in flex justify-start">
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
              <span className={`text-[12.5px] text-ink-faint ${dev}`}>{t.checkerChecking}</span>
            </div>
          </div>
        )}

        {verdict && !checking && (
          <div className="msg-in space-y-2">
            {verdict.kind === "fallback" && (
              <p className="font-mono text-[10.5px] uppercase tracking-wider text-hold">
                {t.checkerFallback}
              </p>
            )}

            {verdictPattern ? (
              <div className="rounded-xl border border-navy/25 bg-navy-wash p-4">
                <h3 className={`text-[16px] font-bold ${dev}`}>{verdictPattern.name}</h3>
                <p className={`mt-2 text-[13px] leading-relaxed text-ink-soft ${dev}`}>
                  <b className="font-semibold text-red">{t.theTell} · </b>
                  {verdictPattern.tell}
                </p>
                <p className={`mt-2 text-[13px] leading-relaxed text-ink-soft ${dev}`}>
                  <b className="font-semibold text-green">{t.firstMove} · </b>
                  {verdictPattern.move}
                </p>
                <div className="mt-2.5">
                  <SpeakButton
                    text={`${verdictPattern.name}. ${verdictPattern.tell}. ${verdictPattern.move}`}
                    lang={VOICE_OF[lang]}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-line-strong bg-paper-raised p-4">
                <p className={`text-[13px] leading-relaxed text-ink-soft ${dev}`}>{t.checkerUnknown}</p>
                <a
                  href="tel:1930"
                  className="mt-2 inline-block text-[13px] font-bold text-navy underline underline-offset-2"
                >
                  1930 →
                </a>
              </div>
            )}

            {verdict.kind === "model" && verdict.reply && (
              <div className="rounded-lg border border-line bg-mono-bg px-3.5 py-2.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                  {t.checkerWhy}
                </p>
                <p className={`mt-1 whitespace-pre-line text-[12.5px] leading-relaxed text-ink-soft ${dev}`}>
                  {verdict.reply}
                </p>
              </div>
            )}

            {verdict.kind === "model" && verdict.handoff === "suspect" && (
              <p className="text-[12.5px] text-ink-faint">
                <Link href="/suspect" className="font-semibold text-navy underline underline-offset-2">
                  Check suspect →
                </Link>
              </p>
            )}
          </div>
        )}

        {moneyBanner && (
          <Link
            href="/report"
            className={`msg-in block rounded-lg border border-red/40 bg-red-wash px-4 py-3 text-[13.5px] font-bold leading-snug text-red-deep hover:brightness-95 ${dev}`}
          >
            {t.checkerMoney}
          </Link>
        )}

        {notice && <p className={`msg-in text-[12.5px] text-ink-soft ${dev}`}>{notice}</p>}
      </div>

      <div className="mt-4">
        {((verdict && !checking) || atCap) && (
          <button
            onClick={reset}
            className={`mb-2.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[12px] font-semibold text-ink-soft hover:border-navy hover:text-navy ${dev}`}
          >
            {t.checkerAgain}
          </button>
        )}
        {!atCap && (
          <>
            <p className="mb-1.5 px-1 text-[11px] text-ink-faint">
              {recState === "recording" && (
                <span className="font-semibold text-red">{fmt(t.sttRecording, { s: recSecs })}</span>
              )}
              {recState === "transcribing" && (
                <span className="font-semibold text-navy">{t.sttUnderstanding}</span>
              )}
              {recState === "idle" && t.statusSpeakType}
            </p>
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
                disabled={recState === "transcribing" || checking}
                aria-label={recState === "recording" ? "Finish speaking" : "Speak instead of typing"}
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all disabled:opacity-40 ${
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                  </svg>
                )}
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.checkerPlaceholder}
                className="min-w-0 flex-1 rounded-lg border border-line-strong bg-paper-raised px-4 py-3 text-[14px] outline-none placeholder:text-ink-faint focus:border-navy"
              />
              <button
                type="submit"
                disabled={checking || !input.trim()}
                className="rounded-lg bg-navy px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-navy-deep disabled:opacity-40"
              >
                {t.send}
              </button>
            </form>
          </>
        )}
      </div>

      {emergency && (
        <Emergency
          sessionLang={VOICE_OF[lang]}
          onResolved={() => {
            setEmergency(false);
            setPostEmergency(true);
          }}
        />
      )}
    </section>
  );
}
