"use client";

import { useEffect, useRef, useState } from "react";
import {
  createRecognizer,
  sttSupported,
  VOICE_LANGS,
  type VoiceLang,
} from "@/lib/voice";
import { onSayInterrupt, sayAloud, stopSaying } from "@/lib/say";

/* A speaker button that reads one message aloud — same Gemini voice and the
   same single audio channel as everything else (browser voice only as a
   fallback inside sayAloud). Starting any other playback resets this one. */
export function SpeakButton({
  text,
  lang = "en-IN",
  light = false,
  voice = "Kore",
}: {
  text: string;
  lang?: VoiceLang;
  light?: boolean;
  voice?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  useEffect(() => onSayInterrupt(() => setState("idle")), []);
  return (
    <button
      aria-label={state !== "idle" ? "Stop reading aloud" : "Read aloud"}
      onClick={() => {
        if (state !== "idle") {
          stopSaying();
        } else {
          setState("loading");
          sayAloud(text, {
            voice,
            fallbackLang: lang,
            onStart: () => setState("playing"),
            onEnd: () => setState("idle"),
          });
        }
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${
        light
          ? "text-white/60 hover:bg-white/10 hover:text-white"
          : "text-ink-faint hover:bg-navy-wash hover:text-navy"
      }`}
    >
      {state === "loading" && (
        <>
          <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border border-current border-t-transparent" />
          preparing voice…
        </>
      )}
      {state === "playing" && "◼ stop"}
      {state === "idle" && "🔊 listen"}
    </button>
  );
}

/* The mic experience: language chips, a pulsing listen state, live transcript. */
export function MicButton({
  onFinal,
  onInterim,
}: {
  onFinal: (text: string, lang: VoiceLang) => void;
  onInterim?: (text: string) => void;
}) {
  const [ok, setOk] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<VoiceLang>("hi-IN");
  const [interim, setInterim] = useState("");
  const recRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => setOk(sttSupported()), []);
  useEffect(() => () => recRef.current?.stop(), []);

  if (!ok) return null;

  const start = () => {
    setInterim("");
    setListening(true);
    recRef.current = createRecognizer(
      lang,
      (t) => {
        setInterim(t);
        onInterim?.(t);
      },
      (t) => onFinal(t, lang),
      () => setListening(false)
    );
    if (!recRef.current) setListening(false);
  };

  const stop = () => recRef.current?.stop();

  return (
    <div className="relative">
      {listening && (
        <div className="msg-in absolute bottom-full left-1/2 z-10 mb-3 w-[min(78vw,330px)] -translate-x-1/2 rounded-xl border border-navy/25 bg-card p-3.5 shadow-[0_10px_30px_rgba(20,53,127,0.18)]">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-navy">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red" />
            </span>
            Listening · {VOICE_LANGS.find((l) => l.code === lang)?.native}
          </p>
          <p className="mt-1.5 min-h-[20px] text-[13.5px] italic leading-snug text-ink-soft">
            {interim || "बोलिए…"}
          </p>
          <button
            onClick={stop}
            className="mt-2 w-full rounded-lg bg-navy px-3 py-2 text-[12.5px] font-bold text-white hover:bg-navy-deep"
          >
            Done speaking
          </button>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        {!listening && (
          <div className="hidden gap-1 sm:flex">
            {VOICE_LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`rounded-full px-2 py-1 text-[10.5px] font-semibold ${
                  lang === l.code
                    ? "bg-navy-wash text-navy"
                    : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={listening ? stop : start}
          aria-label={listening ? "Stop listening" : "Speak instead of typing"}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all ${
            listening
              ? "border-red bg-red text-white"
              : "border-line-strong bg-card text-navy hover:border-navy"
          }`}
        >
          {listening ? "◼" : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
