"use client";

import { useState } from "react";

// The one place in the product where red exists.
// Wording boundary: docs/research/facts.md, digital-arrest section (PIB sources).

export default function Emergency({ onResolved }: { onResolved: () => void }) {
  const [ended, setEnded] = useState(false);

  return (
    <div className="takeover fixed inset-0 z-50 flex flex-col bg-navy-deep text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
          Pause — before anything else
        </p>
        <h1 className="font-display text-[34px] font-semibold leading-[1.1]">
          This matches a documented digital-arrest scam pattern.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-white/85">
          Real police, CBI, customs and RBI do not investigate over video calls,
          and they do not ask for money.{" "}
          <span className="text-white">
            No government agency conducts investigations via phone or video
            calls.
          </span>
        </p>
        <p className="mt-2 text-[12px] text-white/50">
          Ministry of Home Affairs, Oct 2024 · pib.gov.in
        </p>

        {!ended ? (
          <button
            onClick={() => setEnded(true)}
            className="mt-8 w-full rounded-lg bg-stop px-6 py-4 text-[17px] font-semibold text-white shadow-lg transition-colors hover:bg-stop-deep"
          >
            End the call. Do not send more money.
          </button>
        ) : (
          <div className="msg-in mt-8 space-y-2.5">
            <p className="mb-3 text-[14px] font-medium text-white/90">
              Good. You are not in trouble for hanging up. Now, in this order:
            </p>
            <a
              href="tel:1930"
              className="block rounded-lg border border-white/25 bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
            >
              <span className="block text-[15px] font-semibold">Call 1930</span>
              <span className="text-[12px] text-white/65">
                National cybercrime helpline — report the transfer you already made
              </span>
            </a>
            <div className="rounded-lg border border-white/25 bg-white/10 px-4 py-3">
              <span className="block text-[15px] font-semibold">Tell your bank</span>
              <span className="text-[12px] text-white/65">
                Use the fraud number on the back of your card or the bank&apos;s app
              </span>
            </div>
            <div className="rounded-lg border border-white/25 bg-white/10 px-4 py-3">
              <span className="block text-[15px] font-semibold">Tell one person you trust</span>
              <span className="text-[12px] text-white/65">
                The scam depends on your silence
              </span>
            </div>
            <button
              onClick={onResolved}
              className="mt-4 w-full rounded-lg bg-white px-6 py-3.5 text-[15px] font-semibold text-navy-deep transition-colors hover:bg-white/90"
            >
              The call has ended — continue my case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
