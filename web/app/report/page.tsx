import Link from "next/link";
import CaseFlow from "@/components/CaseFlow";
import { PortalHeader } from "@/components/PortalChrome";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; emergency?: string }>;
}) {
  const { mode, emergency } = await searchParams;
  const m = mode === "blank" ? "blank" : "guided";
  const emergencyStart = emergency === "1";
  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader active="/report" />
      <div className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:px-7">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
            Report an incident
          </span>
          <div className="ml-auto flex gap-1.5">
            <Link
              href="/report"
              className={`rounded-full px-3.5 py-1 text-[12px] font-semibold ${
                m === "guided"
                  ? "bg-navy text-white"
                  : "border border-line-strong text-ink-soft hover:border-navy"
              }`}
            >
              Guided synthetic case
            </Link>
            <Link
              href="/report?mode=blank"
              className={`rounded-full px-3.5 py-1 text-[12px] font-semibold ${
                m === "blank"
                  ? "bg-navy text-white"
                  : "border border-line-strong text-ink-soft hover:border-navy"
              }`}
            >
              Start a blank case
            </Link>
          </div>
        </div>
      </div>
      <CaseFlow mode={emergencyStart ? "blank" : m} emergencyStart={emergencyStart} />
    </div>
  );
}
