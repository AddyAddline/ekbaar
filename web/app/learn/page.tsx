import Link from "next/link";
import { PortalHeader } from "@/components/PortalChrome";
import SimulatorEmbed from "@/components/Simulator";

const LESSONS = [
  {
    title: "Digital arrest is not a thing",
    body: "No government agency conducts investigations via phone or video calls. Police, CBI, customs and RBI do not demand payment for “verification.” I4C has blocked 1,700+ Skype IDs and 59,000 WhatsApp accounts used for this scam.",
    source: "MHA · pib.gov.in, Oct–Dec 2024",
  },
  {
    title: "What 1930 actually does",
    body: "The helpline feeds the Citizen Financial Cyber Fraud Reporting and Management System, where banks and police work one queue. Reporting fast matters: over ₹11,158 crore has been saved across 32.80 lakh complaints.",
    source: "MHA · CFCFRMS release, June 2026",
  },
  {
    title: "Acknowledgement ≠ FIR. Hold ≠ refund.",
    body: "A complaint acknowledgement number is not an FIR. An “amount put on hold” is not money returned. Knowing the difference is how you know what to do next — our tracker spells it out on every update.",
    source: "NCRP citizen manual & FAQ, checked Aug 2026",
  },
];

export default function LearnPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader active="/learn" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-7">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">
          Learning corner
        </p>
        <h1 className="mt-2 max-w-2xl text-[clamp(26px,4.5vw,38px)] font-extrabold leading-[1.1] tracking-tight">
          The scam works because it&apos;s a surprise.
          <span className="text-navy"> Take the surprise away.</span>
        </h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
          The portal&apos;s learning corner is a pile of PDFs. Ours is practice: take
          the call in a sandbox, feel the pressure, and learn the three tells —
          taught by the same rules that power our reporting journey.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div>
            <SimulatorEmbed />
          </div>
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-ink-faint">
              The facts behind the simulator — every claim sourced
            </p>
            {LESSONS.map((l) => (
              <div key={l.title} className="rounded-xl border border-line bg-card p-5">
                <h3 className="text-[16px] font-bold">{l.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{l.body}</p>
                <p className="mt-2 font-mono text-[10.5px] text-ink-faint">{l.source}</p>
              </div>
            ))}
            <div className="rounded-xl border border-navy/25 bg-navy-wash p-5">
              <h3 className="text-[15px] font-bold text-navy">
                One engine, two jobs
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-navy/80">
                The deterministic rules that interrupt a live scam in{" "}
                <Link href="/report" className="underline underline-offset-2">
                  Report
                </Link>{" "}
                are the same rules this simulator teaches. What protects you is
                what trains you.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
