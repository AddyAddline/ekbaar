"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalHeader } from "@/components/PortalChrome";
import { searchRegistry, type RegistryEntry } from "@/lib/registry";

export default function SuspectPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<RegistryEntry[] | null>(null);

  const run = () => {
    if (q.trim().length < 3) return;
    setResults(searchRegistry(q));
  };

  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader active="/suspect" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-7">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">
          Check a suspect
        </p>
        <h1 className="mt-2 text-[clamp(26px,4.5vw,36px)] font-extrabold leading-[1.1] tracking-tight">
          Search before you pay.
        </h1>
        <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
          A number, UPI ID, account or website that has already been reported
          shows up here. Checked against a <b>synthetic registry</b>, this
          prototype mirrors the official &ldquo;Report &amp; Check Suspect&rdquo; facility
          in shape, not in data.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="mt-6 flex gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try: 98431 · quickkyc · parcel-clearance · 4471"
            className="min-w-0 flex-1 rounded-lg border border-line-strong bg-card px-4 py-3 text-[14px] outline-none placeholder:text-ink-faint focus:border-navy"
          />
          <button
            type="submit"
            className="rounded-lg bg-navy px-5 py-3 text-[14px] font-bold text-white hover:bg-navy-deep"
          >
            Check
          </button>
        </form>

        {results !== null && (
          <div className="mt-6 space-y-3">
            {results.length === 0 ? (
              <div className="msg-in rounded-xl border border-line bg-card p-5">
                <p className="text-[15px] font-bold">No reports found.</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  Important: this is <b>not proof of safety</b>. New scam numbers
                  and accounts appear daily. If something feels wrong, it
                  probably is -{" "}
                  <Link href="/learn" className="text-navy underline underline-offset-2">
                    learn the tells
                  </Link>{" "}
                  or{" "}
                  <Link href="/report" className="text-navy underline underline-offset-2">
                    report it
                  </Link>
                  .
                </p>
              </div>
            ) : (
              results.map((r) => (
                <div key={r.id} className="msg-in rounded-xl border border-red/40 bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[14px] font-medium">{r.value}</p>
                    <span className="rounded-full bg-red-wash px-3 py-1 text-[11px] font-bold text-red">
                      reported {r.reports} times
                    </span>
                  </div>
                  <p className="mt-2 text-[13.5px] font-semibold text-ink">{r.pattern}</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">
                    {r.kind} · first reported {r.firstReported} · status: {r.status} ·{" "}
                    <span className="uppercase">synthetic record</span>
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/report"
                      className="rounded-md bg-navy px-3.5 py-1.5 text-[12px] font-bold text-white hover:bg-navy-deep"
                    >
                      I dealt with this, report it
                    </Link>
                    <Link
                      href="/learn"
                      className="rounded-md border border-line-strong px-3.5 py-1.5 text-[12px] font-semibold text-ink-soft hover:border-navy"
                    >
                      How this scam works
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
