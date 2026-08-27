import Link from "next/link";
import { PortalHeader } from "@/components/PortalChrome";

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
    title: "The suspect registry is synthetic",
    body: "Check-a-suspect mirrors the official “Report & Check Suspect” facility in shape only. Every entry is fabricated. A real deployment would query I4C's Suspect Registry.",
  },
  {
    title: "Officers in Contact & Escalate are synthetic",
    body: "State Nodal and Grievance Officers exist and are the real escalation path, but the names and addresses shown here are invented, and email addresses use an invalid domain so nothing can be sent to anyone by accident.",
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
    title: "The simulator is scripted, not generative",
    body: "The scam-call simulation is a fixed script built from the documented digital-arrest pattern, so its lessons stay accurate and sourced. It does not improvise.",
  },
  {
    title: "Where your voice goes",
    body: "When you speak, the recording is sent to our server and then to Google's Gemini API for transcription; replies are spoken with Gemini text-to-speech. Nothing is stored, and this is why the prototype says: no real names, IDs or account numbers. If these services are unreachable, the browser's own speech engine is used, and typing always works. Spoken emergency instructions in Hindi and Marathi are our translations of the sourced MHA line.",
  },
  {
    title: "The conversation runs on a live model",
    body: "The live intake is an OpenAI GPT model (via OpenRouter). It extracts facts and asks questions; it never routes. Routing — including the emergency interruption — stays deterministic and sourced, and runs before the model on every turn. If the model is unreachable, the sample case still shows the complete journey.",
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
    <div className="flex flex-1 flex-col">
      <PortalHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-7">
        <h1 className="text-[clamp(26px,4.5vw,36px)] font-extrabold leading-[1.1] tracking-tight">
          What is mocked, exactly
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
          Cyber Satark is an independent hackathon prototype, not a government
          service. Honesty is a judging criterion; more importantly, you deserve
          to know what is real. This page is the complete list.
        </p>
        <div className="mt-8 space-y-5">
          {LIMITS.map((l, i) => (
            <div key={l.title} className="border-l-2 border-line-strong pl-4">
              <p className="text-[15.5px] font-bold">
                <span className="mr-2 font-mono text-[12px] font-normal text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.title}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{l.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-[12.5px] text-ink-faint">
          Rule sources, check dates and the full validation matrix live in the
          public repository (product/rule-matrix.md).{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-ink-soft">
            Back to the portal
          </Link>
        </p>
      </main>
    </div>
  );
}
