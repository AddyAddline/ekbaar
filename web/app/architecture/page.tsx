// Unlinked route used as the architecture frame in minute two of the video.
// One idea: the same confirmed case record supplies the emergency actions,
// the recipient packets and the tracker.

const BOX = "rounded-lg border border-line-strong bg-paper-raised px-4 py-3";
const LABEL = "font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint";

export const metadata = { robots: { index: false } };

export default function ArchitecturePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-8 py-10">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
        EkBaar · how it works
      </p>
      <h1 className="mb-8 font-display text-[30px] font-semibold text-ink">
        One case record. Everything else is made from it.
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {/* column 1: in */}
        <div className="space-y-4">
          <div className={BOX}>
            <p className={LABEL}>1 · Intake</p>
            <p className="mt-1 text-[14px] font-medium">Tell it once</p>
            <p className="mt-1 text-[12px] leading-snug text-ink-soft">
              Free text or voice, any words. No category picker. An OpenAI model
              transcribes and proposes candidate facts.
            </p>
          </div>
          <div className={`${BOX} border-navy bg-navy-wash`}>
            <p className={`${LABEL} !text-navy/70`}>2 · Deterministic rule layer</p>
            <p className="mt-1 text-[14px] font-medium text-navy">
              Rules route. The model never does.
            </p>
            <p className="mt-1 text-[12px] leading-snug text-navy/80">
              Digital-arrest interruption (MHA-sourced), 112, financial-fraud
              route, NCRP field validation. Every rule carries its source and
              check date — this matrix was built by Codex from the official
              manual and checklist.
            </p>
          </div>
          <div className={BOX}>
            <p className={LABEL}>3 · Citizen confirmation</p>
            <p className="mt-1 text-[14px] font-medium">You approve every fact</p>
            <p className="mt-1 text-[12px] leading-snug text-ink-soft">
              Extracted facts stay candidates — with evidence reference and
              confidence — until confirmed. Nothing unconfirmed is filed.
            </p>
          </div>
        </div>

        {/* column 2: the record */}
        <div className="flex flex-col justify-center">
          <div className="dossier rounded-lg border-2 border-navy px-4 py-5 shadow-[0_4px_20px_rgba(29,53,87,0.15)]">
            <p className={`${LABEL} !text-navy/70`}>The product</p>
            <p className="mt-1 font-display text-[20px] font-semibold text-navy">
              One confirmed case record
            </p>
            <ul className="mt-2 space-y-1 text-[12px] leading-snug text-ink-soft">
              <li>· confirmed facts, each tied to evidence</li>
              <li>· originals preserved, never rewritten</li>
              <li>· workflow state separate from official state</li>
            </ul>
          </div>
          <div className="mx-auto my-3 h-8 w-px bg-line-strong" />
          <p className="text-center text-[12px] italic text-ink-faint">
            written once, read by everything around it
          </p>
        </div>

        {/* column 3: out */}
        <div className="space-y-4">
          <div className={`${BOX} border-stop/40`}>
            <p className={`${LABEL} !text-stop/70`}>Out · during the scam</p>
            <p className="mt-1 text-[14px] font-medium">Emergency actions</p>
            <p className="mt-1 text-[12px] leading-snug text-ink-soft">
              End the call, 1930, bank — shown before any form, from sourced
              official guidance.
            </p>
          </div>
          <div className={BOX}>
            <p className={LABEL}>Out · reporting</p>
            <p className="mt-1 text-[14px] font-medium">Recipient packets</p>
            <p className="mt-1 text-[12px] leading-snug text-ink-soft">
              Bank report, 1930 call card, NCRP complaint — same facts, three
              shapes. Filing is simulated at the official handoff boundary; the
              citizen files on the real portal.
            </p>
          </div>
          <div className={BOX}>
            <p className={LABEL}>Out · after filing</p>
            <p className="mt-1 text-[14px] font-medium">Append-only tracker</p>
            <p className="mt-1 text-[12px] leading-snug text-ink-soft">
              Official messages kept verbatim, with what each establishes, what
              it does not, and the next action.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-[11.5px] text-ink-faint">
        No admin panel. No live government integration — there is no public
        citizen API, and the boundary is drawn exactly where one would plug in.
      </p>
    </main>
  );
}
