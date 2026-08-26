import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-12">
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        EkBaar <span className="text-ink-soft">· एक बार</span> — an independent prototype
      </p>

      <h1 className="font-display text-[clamp(34px,7vw,58px)] font-semibold leading-[1.05] text-ink">
        Tell it once.
        <br />
        Know what to do next.
      </h1>

      <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-soft">
        Reporting a cybercrime in India means picking a category before anyone
        helps, retelling your story to the bank, the helpline and the portal,
        and decoding official updates alone. This prototype rebuilds that
        journey around <span className="text-ink font-medium">your incident</span>
        {" "}— it even knows when to interrupt the form, because the scam is
        still on the line.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/case?mode=guided"
          className="rounded-lg bg-navy px-6 py-4 text-center text-[16px] font-semibold text-white transition-colors hover:bg-navy-deep"
        >
          See the guided case
          <span className="mt-0.5 block text-[12px] font-normal text-white/70">
            A synthetic digital-arrest scam, start to finish · 2 minutes
          </span>
        </Link>
        <Link
          href="/case?mode=blank"
          className="rounded-lg border border-line-strong bg-paper-raised px-6 py-4 text-center text-[16px] font-medium text-ink transition-colors hover:border-navy"
        >
          Start a blank case
          <span className="mt-0.5 block text-[12px] font-normal text-ink-faint">
            Type anything — no real names or numbers
          </span>
        </Link>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {[
          {
            k: "Interrupts",
            v: "If the scam is still live, the form waits. One question — “are you still on the call?” — comes before everything.",
          },
          {
            k: "One record",
            v: "Your story becomes confirmed facts with evidence attached. The bank report, the 1930 call and the complaint are all made from it.",
          },
          {
            k: "Stays with you",
            v: "Official updates arrive in their original words, with what they establish — and what they don't — spelled out.",
          },
        ].map((c) => (
          <div key={c.k} className="bg-paper-raised px-5 py-4">
            <p className="font-display text-[15px] font-semibold text-navy">{c.k}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{c.v}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-[12px] leading-relaxed text-ink-faint">
        Built for the Build What Moves India hackathon on the National Cyber
        Crime Reporting Portal journey. Everything simulated is labeled —{" "}
        <Link href="/limitations" className="underline decoration-line-strong underline-offset-2 hover:text-ink-soft">
          see exactly what is mocked
        </Link>
        .
      </p>
    </main>
  );
}
