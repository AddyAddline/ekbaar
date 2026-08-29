"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SIM_BEATS, SIM_DEBRIEF } from "@/lib/simulator";
import { sayClip, stopSaying } from "@/lib/say";

type Phase = "ringing" | "beat" | "feedback" | "debrief";

export default function Simulator() {
  const [phase, setPhase] = useState<Phase>("ringing");
  const [beat, setBeat] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [safeCount, setSafeCount] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => () => stopSaying(), []);

  const current = SIM_BEATS[beat];

  // The caller speaks the instant his lines appear — pre-generated clips,
  // no API wait, so the voice can never start late or "at random".
  const speakBeat = (idx: number) => {
    if (voiceOn) sayClip(`/sim/beat${idx + 1}.mp3`);
  };

  const answer = () => {
    setPhase("beat");
    speakBeat(0);
  };
  const choose = (i: number) => {
    stopSaying();
    setPicked(i);
    if (current.choices[i].safe) setSafeCount((c) => c + 1);
    setPhase("feedback");
  };
  const next = () => {
    setPicked(null);
    if (beat + 1 < SIM_BEATS.length) {
      setBeat(beat + 1);
      setPhase("beat");
      speakBeat(beat + 1);
    } else {
      setPhase("debrief");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* phone frame */}
      <div className="overflow-hidden rounded-3xl border border-line-strong bg-navy-deep shadow-[0_18px_50px_rgba(12,34,88,0.35)]">
        <div className="flex items-center justify-between px-5 py-2.5 text-[10px] text-white/50">
          <span className="font-mono uppercase tracking-[0.14em]">Simulation — no real call</span>
          <span className="flex items-center gap-2">
            <button
              onClick={() => {
                if (voiceOn) stopSaying();
                setVoiceOn(!voiceOn);
              }}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                voiceOn ? "border-saffron/70 text-saffron" : "border-white/30 text-white/50"
              }`}
            >
              {voiceOn ? "🔊 caller voice on" : "🔇 caller voice off"}
            </button>
            <span className="stamp !border-white/40 !bg-transparent !text-white/60">synthetic</span>
          </span>
        </div>

        {phase === "ringing" && (
          <div className="takeover flex flex-col items-center px-6 pb-8 pt-10 text-white">
            <div className="ring flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-[34px]">
              📞
            </div>
            <p className="mt-5 text-[19px] font-bold">&ldquo;Mumbai Cyber Cell&rdquo;</p>
            <p className="mt-1 font-mono text-[12px] text-white/60">+91 98XX XXX 431 · WhatsApp video</p>
            <p className="mt-6 max-w-[260px] text-center text-[12.5px] leading-relaxed text-white/70">
              You are about to take a scam call in a safe sandbox. Your job:
              spot the three tells.
            </p>
            <div className="mt-7 flex gap-3">
              <button
                onClick={answer}
                className="rounded-full bg-green px-7 py-3 text-[14px] font-bold text-white hover:brightness-110"
              >
                Answer
              </button>
              <Link
                href="/learn"
                className="rounded-full border border-white/25 px-6 py-3 text-[14px] font-semibold text-white/80 hover:bg-white/10"
              >
                Not now
              </Link>
            </div>
          </div>
        )}

        {(phase === "beat" || phase === "feedback") && (
          <div className="px-5 pb-6 pt-2 text-white">
            <div className="mb-3 flex items-center gap-2">
              {SIM_BEATS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i <= beat ? "bg-saffron" : "bg-white/15"}`}
                />
              ))}
              <span className="ml-1 font-mono text-[10px] text-white/50">
                {beat + 1}/{SIM_BEATS.length}
              </span>
            </div>

            <div className="space-y-2">
              {current.caller.map((line) => (
                <p
                  key={line}
                  className="msg-in max-w-[92%] rounded-xl rounded-bl-sm bg-white/12 px-3.5 py-2.5 text-[13.5px] leading-relaxed"
                >
                  {line}
                </p>
              ))}
              {current.pressure && phase === "beat" && (
                <p className="pt-1 font-mono text-[10.5px] uppercase tracking-wider text-saffron/90">
                  ▲ pressure: {current.pressure}
                </p>
              )}
            </div>

            {phase === "beat" && (
              <div className="mt-4 space-y-2">
                {current.choices.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => choose(i)}
                    className="msg-in block w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-left text-[13.5px] font-medium hover:border-white/50 hover:bg-white/10"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {phase === "feedback" && picked !== null && (
              <div className="msg-in mt-4">
                <div
                  className={`rounded-lg border px-4 py-3 text-[13px] leading-relaxed ${
                    current.choices[picked].safe
                      ? "border-green/60 bg-green/15"
                      : "border-red/60 bg-red/15"
                  }`}
                >
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-white/60">
                    {current.choices[picked].safe ? "✓ Satark move" : "✕ this is how it happens"}
                  </p>
                  {current.choices[picked].feedback}
                </div>
                <div className="mt-2.5 rounded-lg border border-saffron/50 bg-saffron/10 px-4 py-3">
                  <p className="text-[13px] font-bold text-saffron">{current.tell.title}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/85">
                    {current.tell.detail}
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] text-white/50">{current.tell.source}</p>
                </div>
                <button
                  onClick={next}
                  className="mt-3.5 w-full rounded-lg bg-white px-4 py-3 text-[14px] font-bold text-navy-deep hover:bg-white/90"
                >
                  {beat + 1 < SIM_BEATS.length ? "The caller pushes on →" : "End the call →"}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "debrief" && (
          <div className="takeover px-6 pb-8 pt-6 text-white">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/50">
              Call ended · you kept your money
            </p>
            <p className="mt-3 text-[26px] font-extrabold leading-tight">
              Satark score: {safeCount}/{SIM_BEATS.length}
            </p>
            <p className="mt-1 text-[13px] text-white/70">
              {safeCount === SIM_BEATS.length
                ? "You saw through every move. Most victims are smart people caught at a bad moment — now the tells are yours for life."
                : "The choices that felt safest were the scam working. That is the point of practicing here."}
            </p>
            <div className="mt-5 rounded-xl border border-white/20 bg-white/5 p-4">
              <p className="font-devanagari text-[19px] font-bold text-saffron">
                {SIM_DEBRIEF.mantra}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-white/50">{SIM_DEBRIEF.mantraSource}</p>
              <ul className="mt-3 space-y-1.5 text-[13px] text-white/85">
                {SIM_DEBRIEF.actions.map((a) => (
                  <li key={a}>· {a}</li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                href="/report"
                className="rounded-lg bg-white px-4 py-3 text-center text-[14px] font-bold text-navy-deep hover:bg-white/90"
              >
                This happened to me or someone I know — report it
              </Link>
              <button
                onClick={() => {
                  setBeat(0);
                  setSafeCount(0);
                  setPicked(null);
                  setPhase("ringing");
                }}
                className="rounded-lg border border-white/25 px-4 py-2.5 text-[13px] font-semibold text-white/80 hover:bg-white/10"
              >
                Take the call again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
