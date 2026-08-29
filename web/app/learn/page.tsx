import Link from "next/link";
import { PortalHeader } from "@/components/PortalChrome";
import SimulatorEmbed from "@/components/Simulator";

const PATTERNS = [
  {
    name: "Digital arrest",
    starts: "A video call from “police / CBI / customs”: a parcel or account in your name is linked to a crime. You are told you are under arrest and must stay on camera.",
    tell: "No government agency investigates over video calls, and “digital arrest” does not exist in law.",
    move: "Hang up. You cannot be arrested by phone. Then call 1930 if any money moved.",
  },
  {
    name: "Fake KYC / bank call",
    starts: "An SMS or call says your account or KYC expires today. A link or app takes over from there.",
    tell: "Banks block accounts through their own app and branches, never through urgency links.",
    move: "Open your bank's app yourself. Never a link from a message.",
  },
  {
    name: "Parcel / courier scam",
    starts: "A “courier company” says your parcel contains illegal items, then transfers you to fake police.",
    tell: "Real customs issues go through written notices, not conference calls with police.",
    move: "End the call. Check any consignment number on the courier's real site.",
  },
  {
    name: "Job-task fraud",
    starts: "Easy money for liking videos or rating hotels. Small payouts arrive first, then a “deposit” is needed to unlock bigger earnings.",
    tell: "The early payouts are the bait. Real work never needs you to pay to get paid.",
    move: "Stop before the first deposit. Report the numbers on the portal's suspect registry.",
  },
  {
    name: "Investment group scam",
    starts: "A WhatsApp or Telegram “trading group” with screenshots of profits. An app shows your money growing, until withdrawal day.",
    tell: "The app's balance is a picture, not money. Withdrawal fees that grow are the trap closing.",
    move: "Check any adviser on SEBI's registry. Never move savings into an app a stranger sent.",
  },
  {
    name: "Wrong-payment refund",
    starts: "“I sent you money by mistake, please return it.” The incoming payment is fake or reversed later.",
    tell: "Real wrong payments are reversed by the bank, never by you paying someone back.",
    move: "Don't return anything. Tell your bank and let them handle the reversal.",
  },
];

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
    body: "A complaint acknowledgement number is not an FIR. An “amount put on hold” is not money returned. Knowing the difference is how you know what to do next, our tracker spells it out on every update.",
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
          the call in a sandbox, feel the pressure, and learn the three tells -
          taught by the same rules that power our reporting journey.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div>
            <SimulatorEmbed />
          </div>
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.09em] text-ink-faint">
              The facts behind the simulator, every claim sourced
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

        <div className="mt-14">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">
            Know the pattern
          </p>
          <h2 className="mt-2 max-w-2xl text-[clamp(22px,3.5vw,30px)] font-extrabold leading-tight tracking-tight">
            Six scripts scammers reuse. Read them once, own them for life.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PATTERNS.map((p) => (
              <div key={p.name} className="flex flex-col rounded-xl border border-line bg-card p-5">
                <h3 className="text-[16.5px] font-bold">{p.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  <b className="text-ink-faint font-semibold">How it starts · </b>
                  {p.starts}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  <b className="text-red font-semibold">The tell · </b>
                  {p.tell}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  <b className="text-green font-semibold">First move · </b>
                  {p.move}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[12.5px] text-ink-faint">
            Caught mid-pattern, or already paid?{" "}
            <Link href="/report" className="font-semibold text-navy underline underline-offset-2">
              Report it now
            </Link>{" "}
           , the same rules will walk you through it. And check any number or UPI ID in{" "}
            <Link href="/suspect" className="font-semibold text-navy underline underline-offset-2">
              the suspect registry
            </Link>{" "}
            before you pay a stranger.
          </p>
        </div>
      </main>
    </div>
  );
}
