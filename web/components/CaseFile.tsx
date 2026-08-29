"use client";

import type {
  ActionItem,
  CaseEvent,
  EvidenceItem,
  Fact,
  WorkflowState,
} from "@/lib/types";
import { type Lang, STR, fmt } from "@/lib/i18n";

function ConfidenceDots({ value }: { value: number }) {
  const filled = value >= 0.95 ? 3 : value >= 0.8 ? 2 : 1;
  return (
    <span className="inline-flex items-center gap-[3px]" title={`confidence ${Math.round(value * 100)}%`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-[5px] w-[5px] rounded-full ${i < filled ? "bg-navy" : "bg-line-strong"}`}
        />
      ))}
    </span>
  );
}

export function FactRow({
  fact,
  onConfirm,
  lang = "en",
  variant = "demo",
}: {
  fact: Fact;
  onConfirm?: (id: string) => void;
  lang?: Lang;
  variant?: "demo" | "draft";
}) {
  // The guided sample stays English by design; only the live draft localizes.
  const t = variant === "draft" ? STR[lang] : STR.en;
  return (
    <div className="fact-arrive rounded-md px-2 py-1.5 -mx-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wider text-ink-faint">{fact.label}</span>
        <ConfidenceDots value={fact.confidence} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[13px] text-ink">{fact.value}</span>
        {fact.status === "candidate" ? (
          onConfirm ? (
            <button
              onClick={() => onConfirm(fact.id)}
              className="shrink-0 rounded border border-navy px-2 py-0.5 text-[11px] font-medium text-navy hover:bg-navy hover:text-white transition-colors"
            >
              {t.confirm}
            </button>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-hold">{t.unconfirmed}</span>
          )
        ) : (
          <span className="text-[11px] text-ok" title="Confirmed by you">
            {t.confirmedYou}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-[11px] text-ink-faint">
        from {fact.sourceName}
        {fact.locator ? ` · ${fact.locator}` : ""}
      </p>
    </div>
  );
}

export default function CaseFile({
  workflowState,
  facts,
  evidence,
  actions,
  events,
  onConfirmFact,
  lang = "en",
  variant = "demo",
}: {
  workflowState: WorkflowState;
  facts: Fact[];
  evidence: EvidenceItem[];
  actions: ActionItem[];
  events: CaseEvent[];
  onConfirmFact?: (id: string) => void;
  lang?: Lang;
  variant?: "demo" | "draft";
}) {
  // Localize only the live draft; the guided sample stays English by design.
  const t = variant === "draft" ? STR[lang] : STR.en;
  return (
    <div className="dossier rounded-lg border border-line-strong shadow-[0_2px_12px_rgba(33,29,24,0.07)]">
      <div className="flex items-start justify-between border-b border-line-strong px-4 py-3">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-ink-faint">
            {variant === "draft" ? "DRAFT" : "CASE DEMO-0002"}
          </p>
          <p className="font-display text-[15px] font-semibold text-ink">Your case file</p>
        </div>
        {/* The live case is real user input, not synthetic demo data. */}
        <span className="stamp">{variant === "draft" ? t.draftStamp : "Synthetic demo"}</span>
      </div>

      <div className="border-b border-line px-4 py-2.5">
        <p className="text-[11px] uppercase tracking-wider text-ink-faint">Where things stand</p>
        <p className="text-[13px] font-medium text-navy">{workflowState}</p>
      </div>

      <div className="border-b border-line px-4 py-3">
        <p className="mb-1.5 text-[11px] uppercase tracking-wider text-ink-faint">
          {fmt(t.factsHeader, {
            c: facts.filter((f) => f.status === "confirmed").length,
            n: facts.length,
          })}
        </p>
        {facts.length === 0 ? (
          <p className="text-[12px] italic text-ink-faint">
            Nothing yet. Tell what happened and facts will collect here.
          </p>
        ) : (
          <div className="space-y-1.5">
            {facts.map((f) => (
              <FactRow key={f.id} fact={f} onConfirm={onConfirmFact} lang={lang} variant={variant} />
            ))}
          </div>
        )}
      </div>

      {evidence.length > 0 && (
        <div className="border-b border-line px-4 py-3">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-ink-faint">
            Evidence · originals preserved
          </p>
          <div className="flex gap-2">
            {evidence.map((e) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <a key={e.id} href={e.src} target="_blank" className="block w-16">
                <img
                  src={e.src}
                  alt={e.name}
                  className="fact-arrive w-16 rounded border border-line-strong"
                />
                <span className="mt-0.5 block truncate text-[9px] text-ink-faint">{e.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {actions.length > 0 && (
        <div className="border-b border-line px-4 py-3">
          <p className="mb-1.5 text-[11px] uppercase tracking-wider text-ink-faint">Actions</p>
          <ul className="space-y-1">
            {actions.map((a) => (
              <li key={a.id} className="fact-arrive flex items-start gap-2 text-[12.5px]">
                <span
                  className={`mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                    a.status === "done"
                      ? "border-ok bg-ok text-white"
                      : "border-line-strong text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={a.status === "done" ? "text-ink-faint line-through decoration-line-strong" : "text-ink"}>
                  {a.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {events.length > 0 && (
        <div className="px-4 py-3">
          <p className="mb-2 text-[11px] uppercase tracking-wider text-ink-faint">
            Official record · never rewritten
          </p>
          <div className="space-y-2">
            {events.map((ev) => (
              <div key={ev.id} className="fact-arrive rounded border border-line-strong bg-mono-bg p-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    {ev.source} · {ev.at}
                  </span>
                  {ev.simulated && <span className="stamp !text-[8px] !px-1.5 !py-0.5">Simulated</span>}
                </div>
                <p className="font-mono text-[11.5px] leading-snug text-ink">{ev.raw}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
