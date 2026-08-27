import Link from "next/link";
import CaseFlow from "@/components/CaseFlow";
import LiveCase from "@/components/LiveCase";
import { PortalHeader } from "@/components/PortalChrome";

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; emergency?: string }>;
}) {
  const { mode, emergency } = await searchParams;
  const emergencyStart = emergency === "1";
  const m = emergencyStart ? "live" : mode === "sample" || mode === "guided" ? "sample" : "live";
  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader active="/report" />
      <div className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2 sm:px-7">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-faint">
            Report an incident
          </span>
          <div className="ml-auto flex gap-1.5">
            <Link
              href="/report"
              className={`rounded-full px-3.5 py-1 text-[12px] font-semibold ${
                m === "live"
                  ? "bg-navy text-white"
                  : "border border-line-strong text-ink-soft hover:border-navy"
              }`}
            >
              Start your case — talk or type
            </Link>
            <Link
              href="/report?mode=sample"
              className={`rounded-full px-3.5 py-1 text-[12px] font-semibold ${
                m === "sample"
                  ? "bg-navy text-white"
                  : "border border-line-strong text-ink-soft hover:border-navy"
              }`}
            >
              Watch the sample case
            </Link>
          </div>
        </div>
      </div>
      {m === "live" ? (
        <LiveCase emergencyStart={emergencyStart} />
      ) : (
        <CaseFlow mode="guided" />
      )}
    </div>
  );
}
