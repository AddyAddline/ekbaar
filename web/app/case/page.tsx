import { Suspense } from "react";
import Link from "next/link";
import CaseFlow from "@/components/CaseFlow";

export default async function CasePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const m = mode === "blank" ? "blank" : "guided";
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <Link href="/" className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink">
          ← EkBaar
        </Link>
        <span className="stamp">{m === "guided" ? "Guided synthetic case" : "Blank case · synthetic data only"}</span>
      </header>
      <Suspense>
        <CaseFlow mode={m} />
      </Suspense>
    </div>
  );
}
