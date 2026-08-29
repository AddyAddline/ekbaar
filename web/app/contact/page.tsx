"use client";

import { useMemo, useState } from "react";
import { PortalHeader } from "@/components/PortalChrome";

// The real portal's Contact Us is a static table of State/UT Nodal and
// Grievance Officers with obfuscated emails, plus a note that they are the
// escalation path. Here, contact knows your case. All officers synthetic.

const STATES: Record<string, { nodal: string; grievance: string; email: string }> = {
  Maharashtra: {
    nodal: "Nodal Cyber Officer, Maharashtra (synthetic)",
    grievance: "Grievance Officer, Maharashtra Cyber (synthetic)",
    email: "grievance.mh@example.gov.invalid",
  },
  Delhi: {
    nodal: "Nodal Cyber Officer, Delhi (synthetic)",
    grievance: "Grievance Officer, Delhi Cyber Cell (synthetic)",
    email: "grievance.dl@example.gov.invalid",
  },
  Karnataka: {
    nodal: "Nodal Cyber Officer, Karnataka (synthetic)",
    grievance: "Grievance Officer, Karnataka CID Cyber (synthetic)",
    email: "grievance.ka@example.gov.invalid",
  },
  "Uttar Pradesh": {
    nodal: "Nodal Cyber Officer, Uttar Pradesh (synthetic)",
    grievance: "Grievance Officer, UP Cyber (synthetic)",
    email: "grievance.up@example.gov.invalid",
  },
};

const DRAFT = (state: string) => `To: Grievance Officer, ${state}

Subject: Escalation, no actionable response on complaint DEMO-NCRP-2026-0002

Respected Sir/Madam,

I filed complaint DEMO-NCRP-2026-0002 (financial fraud, digital-arrest
pattern, ₹1,20,000, transaction UTR 228834501277) on 27 August 2026.
The last update, received the same day at 17:30, asked me to contact the
police station named in my complaint record; no station response has been
received since.

As advised on the National Cyber Crime Reporting Portal, I am escalating
to you as the state Grievance Officer. My case file with the complaint,
evidence list and all official updates is attached.

Complainant (synthetic demo): Meera D.

[SYNTHETIC DEMO, this draft is generated from the demo case record.
Nothing is sent by this prototype.]`;

export default function ContactPage() {
  const [state, setState] = useState("Maharashtra");
  const [copied, setCopied] = useState(false);
  const officer = STATES[state];
  const draft = useMemo(() => DRAFT(state), [state]);

  return (
    <div className="flex flex-1 flex-col">
      <PortalHeader active="/contact" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-7">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-navy">
          Contact &amp; escalate
        </p>
        <h1 className="mt-2 text-[clamp(26px,4.5vw,36px)] font-extrabold leading-[1.1] tracking-tight">
          &ldquo;Contact us&rdquo; should know your case.
        </h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
          On the current portal, escalation is a 36-row table of officers with
          emails written as [at] and [dot]. Here, your case record already knows
          your state, your reference and your timeline, so escalation is one
          prepared email, not homework.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              who: "1930",
              when: "Money moved in an online fraud",
              how: "Call immediately, fast reporting helps banks attempt a hold.",
              hot: true,
            },
            {
              who: "112",
              when: "Any threat to physical safety",
              how: "Before any portal, any form, anything.",
              hot: true,
            },
            {
              who: "cybercrime.gov.in",
              when: "Filing the formal complaint",
              how: "Our Report section prepares everything the form asks for.",
            },
            {
              who: "Grievance officer",
              when: "Complaint filed, no response",
              how: "Your state's escalation path, the tool below writes the letter.",
            },
          ].map((c) => (
            <div
              key={c.who}
              className={`rounded-xl border p-4 ${c.hot ? "border-navy/30 bg-navy-wash" : "border-line bg-card"}`}
            >
              <p className={`text-[17px] font-extrabold ${c.hot ? "text-navy" : "text-ink"}`}>{c.who}</p>
              <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">{c.when}</p>
              <p className="mt-1 text-[12px] leading-snug text-ink-faint">{c.how}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-[280px_1fr]">
          <div className="space-y-3">
            <div className="rounded-xl border border-line bg-card p-4">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                Your state (from the demo case)
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line-strong bg-card px-3 py-2.5 text-[14px] outline-none focus:border-navy"
              >
                {Object.keys(STATES).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div className="mt-3 space-y-2 text-[12.5px] leading-snug text-ink-soft">
                <p>
                  <b className="text-ink">{officer.grievance}</b>
                  <br />
                  <span className="font-mono text-[11.5px]">{officer.email}</span>
                </p>
                <p className="text-ink-faint">{officer.nodal}</p>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-card p-4 text-[13px] leading-relaxed text-ink-soft">
              <p className="font-bold text-ink">Always available</p>
              <p className="mt-1">
                Helpline <b className="text-navy">1930</b>, financial cyber fraud
                <br />
                Emergency <b className="text-navy">112</b>, any threat to safety
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-card">
            <div className="flex items-center justify-between border-b border-line bg-mono-bg px-4 py-2.5">
              <p className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint">
                Escalation draft · built from case DEMO-0002
              </p>
              <span className="stamp !px-1.5 !py-0.5 !text-[8px]">Synthetic</span>
            </div>
            <pre className="whitespace-pre-wrap px-4 py-4 font-mono text-[12px] leading-relaxed text-ink">
              {draft}
            </pre>
            <div className="border-t border-line px-4 py-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(draft).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="rounded-lg bg-navy px-4 py-2.5 text-[13px] font-bold text-white hover:bg-navy-deep"
              >
                {copied ? "Copied" : "Copy the draft"}
              </button>
              <span className="ml-3 text-[11.5px] text-ink-faint">
                Nothing is sent by this prototype.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
