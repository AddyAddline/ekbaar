import Link from "next/link";

const LIMITS: { title: string; body: string }[] = [
  {
    title: "The demo case is synthetic",
    body: "Meera is not a real person and this did not happen to us. We audited the live reporting journey and built the case from the official process and documented scam patterns in Ministry of Home Affairs releases. We never present it as a personal story.",
  },
  {
    title: "NCRP filing is simulated",
    body: "Nothing is ever sent to cybercrime.gov.in. There is no public citizen sandbox or filing API, and the hackathon rules forbid touching live government systems. Every simulated acknowledgement is labeled on screen and uses an obviously fake reference number.",
  },
  {
    title: "Status updates are simulated",
    body: "The “amount put on hold” message is a demo message. Real NCRP status checking requires an acknowledgement number, OTP and CAPTCHA, and no public tracking API exists. Automatic sync is an integration requirement, not a working feature.",
  },
  {
    title: "The bank and 1930 are not integrated",
    body: "The bank packet and the 1930 call card prepare you to contact them; they do not contact anyone on your behalf. No telephony, no bank API.",
  },
  {
    title: "The model suggests; you decide; rules route",
    body: "AI (an OpenAI model) extracts candidate facts from your words. Every fact waits for your confirmation. Routing — including the digital-arrest interruption — is deterministic rules sourced to official documents, never a model decision. If the model is unavailable, the journey still works.",
  },
  {
    title: "We do not decide crimes or promise recovery",
    body: "Police and courts decide whether an offence occurred. A hold is not a refund. This product never claims otherwise.",
  },
  {
    title: "Evidence files are synthetic",
    body: "The UPI receipt and WhatsApp screenshot are fabricated artifacts, watermarked as such. No real bank, number, or person appears in them.",
  },
];

export default function LimitationsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <Link href="/" className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink">
        ← EkBaar
      </Link>
      <h1 className="mt-4 font-display text-[34px] font-semibold leading-tight text-ink">
        What is mocked, exactly
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        This is an independent hackathon prototype, not a government service.
        Honesty is a judging criterion; more importantly, you deserve to know
        what is real. This page is the complete list.
      </p>
      <div className="mt-8 space-y-5">
        {LIMITS.map((l, i) => (
          <div key={l.title} className="border-l-2 border-line-strong pl-4">
            <p className="font-display text-[16px] font-semibold text-ink">
              <span className="mr-2 font-mono text-[12px] text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              {l.title}
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-soft">{l.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 text-[12.5px] text-ink-faint">
        Rule sources, check dates and the full validation matrix live in the public
        repository (product/rule-matrix.md).
      </p>
    </main>
  );
}
