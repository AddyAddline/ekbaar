"use client";

import type { Packet } from "@/lib/types";

// One case record, three recipient-specific packets. The "tell it once" proof.

export default function Packets({ packets }: { packets: Packet[] }) {
  return (
    <div className="space-y-3">
      {packets.map((p) => (
        <div key={p.id} className="msg-in rounded-lg border border-line-strong bg-paper-raised">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <span className="font-display text-[14px] font-semibold text-ink">{p.title}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              {p.recipient}
            </span>
          </div>
          <dl className="px-4 py-2.5">
            {p.lines.map((l) => (
              <div key={l.label} className="flex items-baseline justify-between gap-3 py-[3px]">
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">{l.label}</dt>
                <dd className="text-right font-mono text-[12.5px] text-ink">{l.value}</dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-line px-4 py-2 text-[12px] leading-snug text-ink-soft">
            {p.note}
          </p>
        </div>
      ))}
    </div>
  );
}
