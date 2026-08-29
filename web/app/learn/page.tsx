"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { PortalHeader } from "@/components/PortalChrome";
import ScamCheck from "@/components/ScamCheck";
import Simulator from "@/components/Simulator";
import { STR, type Lang } from "@/lib/i18n";
import { PATTERNS, patternText } from "@/lib/patterns";

// The learning corner: two doors (take the call in a sandbox, or check a
// real message), one MHA-sourced rules engine behind both, and the six
// documented patterns underneath. The session language is owned by Report;
// here it is only read back from this device.

const isLang = (v: string | null): v is Lang => v === "en" || v === "hi" || v === "mr";

// Split at the first sentence boundary, English "." or Devanagari "।":
// powers the split-color title and the seeded checker examples.
function splitFirst(s: string): [string, string] {
  const m = s.match(/^([\s\S]*?[.।”])\s+([\s\S]*)$/);
  return m ? [m[1], m[2]] : [s, ""];
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

// SSR-safe read of the session language this device already picked in
// Report; the server (and a device with no pick) stays English.
const noSub = () => () => {};
const readLang = (): Lang => {
  try {
    const v = localStorage.getItem("cs-lang");
    return isLang(v) ? v : "en";
  } catch {
    return "en";
  }
};

export default function LearnPage() {
  const lang = useSyncExternalStore(noSub, readLang, () => "en" as Lang);
  const [seed, setSeed] = useState<{ text: string; n: number } | undefined>(undefined);

  const t = STR[lang];
  const dev = lang !== "en" ? "font-devanagari" : "";
  const [titleA, titleB] = splitFirst(t.learnTitle);
  const facts = [t.tips[0], t.tips[3], t.tips[4]];

  const checkLike = (starts: string) => {
    setSeed((s) => ({ text: splitFirst(starts)[0], n: (s?.n ?? 0) + 1 }));
    scrollTo("checker");
  };

  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader active="/learn" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-7">
        {/* 1 · hero */}
        <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">
          Learning corner
        </p>
        <h1
          className={`mt-2 max-w-3xl text-[clamp(26px,4.5vw,38px)] font-extrabold leading-[1.1] tracking-tight ${dev}`}
        >
          {titleA}
          {titleB && <span className="text-navy"> {titleB}</span>}
        </h1>
        <p className={`mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-soft ${dev}`}>
          {t.learnSub}
        </p>

        {/* 2 · two doors: the call, and the doubt */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-8">
          <div id="simulator" className="scroll-mt-6">
            <Simulator lang={lang} />
          </div>
          <ScamCheck lang={lang} seed={seed} />
        </div>

        {/* 3 · the engine strip */}
        <div className="mt-10 rounded-xl border border-navy/25 bg-navy-wash p-5 sm:p-6">
          <h2 className={`text-[17px] font-bold text-navy ${dev}`}>{t.engineTitle}</h2>
          <p className={`mt-1.5 max-w-3xl text-[13.5px] leading-relaxed text-navy/80 ${dev}`}>
            {t.engineBody}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] font-semibold text-navy">
            <Link href="/report" className="underline underline-offset-2 hover:text-navy-deep">
              Report →
            </Link>
            <button
              onClick={() => scrollTo("simulator")}
              className={`underline underline-offset-2 hover:text-navy-deep ${dev}`}
            >
              {t.practiceThis} ↑
            </button>
            <button
              onClick={() => scrollTo("checker")}
              className={`underline underline-offset-2 hover:text-navy-deep ${dev}`}
            >
              {t.checkerTitle} ↑
            </button>
          </div>
        </div>

        {/* 4 · the facts strip */}
        <div className="mt-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-ink-faint">
            The facts behind all of it, every claim sourced
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {facts.map((f) => (
              <div key={f.text} className="rounded-xl border border-line bg-card px-4 py-3.5">
                <p className={`text-[13px] leading-snug text-ink-soft ${dev}`}>{f.text}</p>
                <p className="mt-1.5 font-mono text-[10.5px] text-ink-faint">{f.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5 · the six patterns */}
        <div id="patterns" className="mt-14 scroll-mt-6">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">
            Know the pattern
          </p>
          <h2
            className={`mt-2 max-w-2xl text-[clamp(22px,3.5vw,30px)] font-extrabold leading-tight tracking-tight ${dev}`}
          >
            {t.patternsTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PATTERNS.map((p) => {
              const x = patternText(p, lang);
              return (
                <div key={p.id} className="flex flex-col rounded-xl border border-line bg-card p-5">
                  <h3 className={`text-[16.5px] font-bold ${dev}`}>{x.name}</h3>
                  <p className={`mt-2 text-[13px] leading-relaxed text-ink-soft ${dev}`}>
                    <b className="font-semibold text-ink-faint">{t.howStarts} · </b>
                    {x.starts}
                  </p>
                  <p className={`mt-2 text-[13px] leading-relaxed text-ink-soft ${dev}`}>
                    <b className="font-semibold text-red">{t.theTell} · </b>
                    {x.tell}
                  </p>
                  <p className={`mt-2 text-[13px] leading-relaxed text-ink-soft ${dev}`}>
                    <b className="font-semibold text-green">{t.firstMove} · </b>
                    {x.move}
                  </p>
                  <div className="mt-auto pt-3.5">
                    {p.id === "digital-arrest" ? (
                      <button
                        onClick={() => scrollTo("simulator")}
                        className={`rounded-full border border-navy px-3.5 py-1.5 text-[12px] font-bold text-navy transition-colors hover:bg-navy hover:text-white ${dev}`}
                      >
                        {t.practiceThis} ↑
                      </button>
                    ) : (
                      <button
                        onClick={() => checkLike(x.starts)}
                        className={`rounded-full border border-line-strong px-3.5 py-1.5 text-[12px] font-semibold text-ink-soft transition-colors hover:border-navy hover:text-navy ${dev}`}
                      >
                        {t.checkLike} ↑
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-[12.5px] text-ink-faint">
            Caught mid-pattern, or already paid?{" "}
            <Link
              href="/report"
              className="font-semibold text-navy underline underline-offset-2"
            >
              Report it now
            </Link>{" "}
            , the same rules will walk you through it. And check any number or UPI ID in{" "}
            <Link
              href="/suspect"
              className="font-semibold text-navy underline underline-offset-2"
            >
              the suspect registry
            </Link>{" "}
            before you pay a stranger.
          </p>
        </div>
      </main>
    </div>
  );
}
