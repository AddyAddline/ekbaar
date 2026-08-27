import Link from "next/link";

export function PortalHeader({ active }: { active?: string }) {
  const nav = [
    { href: "/report", label: "Report" },
    { href: "/track", label: "Track" },
    { href: "/suspect", label: "Check suspect" },
    { href: "/learn", label: "Learn" },
    { href: "/contact", label: "Contact & escalate" },
  ];
  return (
    <>
      <div className="tricolor" />
      <div className="flex items-center justify-between border-b border-line bg-card px-4 py-1.5 text-[11.5px] text-ink-faint sm:px-7">
        <span>An independent hackathon prototype — not a government service</span>
        <span className="hidden sm:block">
          <span className="font-devanagari">हिन्दी</span> | English · A− A+
        </span>
      </div>
      <header className="border-b border-line bg-card">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-7">
          <Link href="/" className="flex items-center gap-3">
            <span className="shield flex h-10 w-9 items-center justify-center bg-navy text-[19px] font-bold text-white">
              <span className="font-devanagari">स</span>
            </span>
            <span>
              <span className="block text-[19px] font-bold leading-tight tracking-tight">
                Cyber Satark <span className="font-devanagari font-semibold text-navy">· साइबर सतर्क</span>
              </span>
              <span className="block text-[11px] text-ink-faint">
                The cyber crime portal, rebuilt around the citizen
              </span>
            </span>
          </Link>
          <nav className="ml-auto hidden gap-6 text-[13.5px] font-semibold text-ink-soft lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={
                  active === n.href
                    ? "border-b-2 border-navy pb-0.5 text-navy"
                    : "hover:text-navy"
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-2.5 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
                active === n.href
                  ? "bg-navy text-white"
                  : "border border-line-strong text-ink-soft"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

export function EmergencyStrip() {
  return (
    <div className="bg-navy-deep px-4 py-2.5 text-white sm:px-7">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px]">
        <span aria-hidden>⚠</span>
        <span>
          On a call with someone claiming to be{" "}
          <b className="text-[#ffd9b0]">police, CBI or customs</b> demanding money?
        </span>
        <span className="flex items-center gap-3 sm:ml-auto">
          <Link
            href="/report?emergency=1"
            className="rounded-md bg-red px-4 py-1.5 text-[13px] font-bold text-white hover:bg-red-deep transition-colors"
          >
            Get help right now
          </Link>
          <span className="text-white/75">
            or call <b className="text-white">1930</b>
          </span>
        </span>
      </div>
    </div>
  );
}

export function PortalFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-card px-5 py-3 text-center">
      <p className="text-[11px] tracking-wide text-ink-faint">
        Independent hackathon prototype · All data synthetic · Not affiliated with MHA or I4C ·{" "}
        <Link href="/limitations" className="underline underline-offset-2 hover:text-ink-soft">
          what is mocked
        </Link>
      </p>
    </footer>
  );
}
