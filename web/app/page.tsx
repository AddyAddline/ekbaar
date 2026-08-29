import Link from "next/link";
import { PortalHeader } from "@/components/PortalChrome";

function Card({
  href,
  tag,
  title,
  body,
  chip,
}: {
  href: string;
  tag: string;
  title: string;
  body: string;
  chip?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-navy hover:shadow-[0_8px_24px_rgba(20,53,127,0.10)]"
    >
      {chip && (
        <span className="absolute right-4 top-4 rounded-full border border-green px-2.5 py-0.5 text-[10px] font-bold text-green">
          {chip}
        </span>
      )}
      <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">{tag}</p>
      <h3 className="mt-2 text-[17px] font-bold leading-snug">{title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-faint">{body}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <PortalHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-11 sm:px-7">
          <h1 className="max-w-2xl text-[clamp(30px,5.5vw,46px)] font-extrabold leading-[1.08] tracking-tight">
            Tell it once.{" "}
            <span className="text-navy">We handle the rest of the journey.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
            One case record carries you from &ldquo;what happened?&rdquo; through the
            bank, the 1930 helpline, the complaint, and every official update
            after it, in your words, not the government&apos;s categories.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-9 gap-y-3 text-[12px] text-ink-faint">
            {[
              ["1", "story you tell"],
              ["3", "reports made from it"],
              ["0", "categories you must know"],
              ["every", "update explained"],
            ].map(([n, l]) => (
              <span key={l}>
                <b className="block text-[19px] font-extrabold text-ink">{n}</b>
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-3.5 px-4 pb-12 pt-6 sm:px-7 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/report"
            className="group relative rounded-xl bg-navy p-6 text-white transition-all hover:-translate-y-0.5 hover:bg-navy-deep hover:shadow-[0_10px_28px_rgba(12,34,88,0.35)] md:col-span-2 lg:row-span-2 lg:col-span-1"
          >
            <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-[#ffd9b0]">
              Report an incident
            </p>
            <h3 className="mt-2.5 text-[22px] font-bold leading-snug">
              Speak or type what happened -{" "}
              <span className="font-devanagari">हिंदी, मराठी</span> or English
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/75">
              No category picker, no form. The system detects live scams and
              interrupts to protect you first, speaking its instructions out
              loud, then builds your complaint from confirmed facts and
              evidence.
            </p>
            <span className="mt-5 inline-block rounded-lg bg-white px-4 py-2.5 text-[13.5px] font-bold text-navy">
              Start, it takes your words, not forms
            </span>
          </Link>
          <Card
            href="/track"
            tag="Track my case"
            title="What the update actually means"
            body="Official messages preserved verbatim, translated into what's established, what isn't, and your next step."
            chip="case-aware"
          />
          <Card
            href="/suspect"
            tag="Check a suspect"
            title="Search before you pay"
            body="Look up a number, UPI ID or website against the reported-suspect registry. Synthetic data, honestly labeled."
          />
          <Card
            href="/learn"
            tag="Learning corner"
            title="Experience the scam, safely"
            body="A 90-second guided simulation of a digital-arrest call. Learn the tells before the phone rings."
            chip="simulator"
          />
          <Card
            href="/contact"
            tag="Contact & escalate"
            title="Your officer, not a table"
            body="Response overdue? Your state's grievance officer, with a ready escalation email built from your case."
          />
        </div>
      </main>
    </>
  );
}
