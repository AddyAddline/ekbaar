"use client";

import { useState } from "react";
import Link from "next/link";
import { PortalHeader } from "@/components/PortalChrome";

const DEMO_ACK = "DEMO-NCRP-2026-0002";

const EVENTS = [
  {
    at: "27 Aug, 11:06",
    source: "system",
    raw: "Emergency interruption shown: story matched the digital-arrest pattern while the call was active. Call ended, second payment prevented.",
    simulated: false,
  },
  {
    at: "27 Aug, 11:41",
    source: "ncrp",
    raw: "SIMULATED: Complaint acknowledged. Reference DEMO-NCRP-2026-0002.",
    simulated: true,
    explain: {
      establishes: "Your complaint exists in the system with a reference number.",
      not: "An acknowledgement is not an FIR. No officer is assigned yet.",
      next: "Keep the reference safe — every later step quotes it.",
    },
  },
  {
    at: "27 Aug, 17:30",
    source: "ncrp",
    raw: "DEMO MESSAGE: An amount of Rs 74000 has been put on hold. Kindly contact the police station named in your complaint record.",
    simulated: true,
    explain: {
      establishes:
        "₹74,000 of the ₹1,20,000 is held somewhere in the banking chain, and a police station is now named on your case.",
      not: "A hold is not a refund. It does not say the money is coming back, and it does not close the case.",
      next: "Contact the named police station with your acknowledgement number — everything they'll ask for is in your case file.",
    },
  },
];

export default function TrackPage() {
  const [ack, setAck] = useState(DEMO_ACK);
  const [shown, setShown] = useState(false);
  const [error, setError] = useState(false);

  const run = () => {
    if (ack.trim().toUpperCase() === DEMO_ACK) {
      setShown(true);
      setError(false);
    } else {
      setShown(false);
      setError(true);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader active="/track" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-7">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">
          Track my case
        </p>
        <h1 className="mt-2 text-[clamp(26px,4.5vw,36px)] font-extrabold leading-[1.1] tracking-tight">
          Updates in their words. Meaning in yours.
        </h1>
        <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
          Every official message is preserved exactly as it arrived, then
          translated: what it establishes, what it doesn&apos;t, and your next
          action. No OTP maze — one reference number.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className="mt-6 flex gap-2"
        >
          <input
            value={ack}
            onChange={(e) => setAck(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-line-strong bg-card px-4 py-3 font-mono text-[13.5px] outline-none focus:border-navy"
            aria-label="Acknowledgement number"
          />
          <button
            type="submit"
            className="rounded-lg bg-navy px-5 py-3 text-[14px] font-bold text-white hover:bg-navy-deep"
          >
            Track
          </button>
        </form>
        <p className="mt-2 text-[11.5px] text-ink-faint">
          The demo acknowledgement is prefilled. Real NCRP tracking needs OTP +
          CAPTCHA and has no public API — sync here is simulated and labeled.
        </p>

        {error && (
          <div className="msg-in mt-6 rounded-xl border border-line bg-card p-5 text-[13.5px] text-ink-soft">
            Only the demo case <span className="font-mono">{DEMO_ACK}</span> exists in this
            prototype.
          </div>
        )}

        {shown && (
          <div className="mt-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-[11px] tracking-wider text-ink-faint">
                  CASE DEMO-0002 · Meera D. (synthetic)
                </p>
                <p className="text-[15px] font-bold text-navy">
                  Where things stand: citizen action required
                </p>
              </div>
              <span className="stamp">Synthetic demo</span>
            </div>
            <div className="space-y-3">
              {EVENTS.map((ev) => (
                <div key={ev.at} className="msg-in overflow-hidden rounded-xl border border-line bg-card">
                  <div className="border-b border-line bg-mono-bg px-4 py-3">
                    <p className="mb-1 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                      {ev.source} · {ev.at}
                      {ev.simulated && <span className="stamp !px-1.5 !py-0.5 !text-[8px]">Simulated</span>}
                    </p>
                    <p className="font-mono text-[12.5px] leading-snug">{ev.raw}</p>
                  </div>
                  {ev.explain && (
                    <div className="px-4 py-3 text-[13px] leading-relaxed">
                      <p>
                        <b className="text-green">Establishes:</b> {ev.explain.establishes}
                      </p>
                      <p className="mt-1">
                        <b className="text-hold">Does not:</b> {ev.explain.not}
                      </p>
                      <p className="mt-1">
                        <b className="text-navy">Next:</b> {ev.explain.next}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Link
                href="/contact"
                className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-bold text-white hover:bg-navy-deep"
              >
                Response overdue? Escalate →
              </Link>
              <Link
                href="/report"
                className="rounded-lg border border-line-strong px-4 py-2.5 text-[13px] font-semibold text-ink-soft hover:border-navy"
              >
                See how this case was built
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
