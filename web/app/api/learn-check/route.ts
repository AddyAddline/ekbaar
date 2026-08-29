import { NextRequest, NextResponse } from "next/server";
import { triage } from "@/lib/rules";
import { PATTERNS, type PatternId } from "@/lib/patterns";

// The Learn corner's "Is this a scam?" checker. Deterministic rules run
// FIRST on every check (they route; the model never does). The model matches
// the citizen's message against the sourced corpus embedded below and may
// explain the match — the verdict card itself renders from lib/patterns.ts
// by id, never from model prose. If the model can't ground an answer in the
// sheet, it says so and points to 1930 / cybercrime.gov.in.

export const runtime = "nodejs";
export const maxDuration = 60;

// The entire grounded corpus, built at module load from the same data the
// UI renders. English is the model's reference text; it replies in the
// citizen's language.
const CORPUS = PATTERNS.map(
  (p) =>
    `[${p.id}] ${p.name.en}\n  How it starts: ${p.starts.en}\n  The tell: ${p.tell.en}\n  First move: ${p.move.en}`
).join("\n\n");

const FACTS = [
  "No government agency conducts investigations via phone or video calls (MHA, Oct 2024).",
  "An amount 'put on hold' is not a refund (NCRP FAQ).",
  "Banks never ask for your OTP or PIN (RBI awareness).",
  "Report fast: call 1930 as soon as money moves; complaints go to cybercrime.gov.in (MHA/CFCFRMS).",
  "A complaint acknowledgement is not an FIR (NCRP manual).",
  "There is no documented 'golden hour' window in official sources; the official language is 'immediate reporting'.",
  "RBI customer liability depends on fault and reporting time; it is conditional, never promise zero liability (RBI 2017-18/15).",
].join("\n- ");

const SYSTEM = `You are the scam-message checker of "Cyber Satark", an independent hackathon prototype that reimagines India's cybercrime reporting journey. You are not police, not a lawyer, not a government service, and you say so if asked.

The citizen pastes a suspicious SMS or describes a situation. You check it ONLY against the sourced sheet below. Every factual claim in your reply must come from this sheet — nothing else.

THE SIX DOCUMENTED SCAM PATTERNS:

${CORPUS}

SOURCED FACTS:
- ${FACTS}

HARD RULES:
- Every factual claim must come from the sheet above. If the question goes beyond it, say plainly that it is outside your documented sources and point to 1930 / cybercrime.gov.in.
- Never invent statistics, numbers, laws, or section names.
- Never say whether a crime occurred; police and courts decide that.
- Never predict or promise recovery. A hold is not a refund.
- No legal advice beyond the conditional RBI liability framing in the sheet.
- If the message includes what looks like a real full Aadhaar, PAN, or card number, tell them not to share it here.
- LANGUAGE: reply in the citizen's language — the language of their most recent message (English gets English, Hindi gets Hindi in Devanagari, Marathi gets Marathi in Devanagari).
- Keep the reply under 80 words. Warm, steady, simple words. Never lecture.

VERDICT DISCIPLINE:
- pattern_id: pick one of the six ids ONLY if the message genuinely matches that pattern's script. If nothing matches cleanly, use null with risk "suspicious" or "unknown". Never force a match.
- risk: "live_coercion" if the story suggests an active call or coercion happening right now; "money_moved" if money already left; "suspicious" if it smells wrong but no loss yet; else "unknown".
- handoff: "report" when money moved or an incident actually happened to them; "suspect" when they mainly have a number, UPI ID, or website to look up; else "none".`;

interface ChatMsg { role: "user" | "assistant"; content: string }

const LANG_NAME: Record<string, string> = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  mr: "Marathi (Devanagari script)",
};

const PATTERN_IDS: readonly PatternId[] = [
  "digital-arrest",
  "fake-kyc",
  "parcel",
  "job-task",
  "investment",
  "refund",
];

const RISKS = ["live_coercion", "money_moved", "suspicious", "unknown"] as const;
type Risk = (typeof RISKS)[number];

const HANDOFFS = ["report", "suspect", "none"] as const;
type Handoff = (typeof HANDOFFS)[number];

const asPatternId = (v: unknown): PatternId | null =>
  PATTERN_IDS.find((id) => id === v) ?? null;

const asRisk = (v: unknown): Risk => RISKS.find((r) => r === v) ?? "unknown";

const asHandoff = (v: unknown): Handoff => HANDOFFS.find((h) => h === v) ?? "none";

export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "openai/gpt-5.6-terra";

  let messages: ChatMsg[] = [];
  let lang: string | undefined;
  try {
    const b = await req.json();
    if (typeof b.lang === "string" && LANG_NAME[b.lang]) lang = b.lang;
    messages = (Array.isArray(b.messages) ? b.messages : [])
      .slice(-8)
      .map((m: ChatMsg) => ({
        role: m.role === "assistant" ? "assistant" as const : "user" as const,
        content: String(m.content ?? "").slice(0, 2500),
      }));
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return NextResponse.json({ error: "empty" }, { status: 400 });

  // Rules first, always.
  const route = triage(last.content);
  if (route.kind === "digital_arrest_interruption" || route.kind === "emergency_112") {
    return NextResponse.json({ emergency: route.kind, sourceId: route.sourceId });
  }

  if (!key) return NextResponse.json({ model: false });

  const system = lang
    ? `${SYSTEM}\n\nSESSION LANGUAGE: Reply ONLY in ${LANG_NAME[lang]}. If the citizen consistently writes in a different language, follow the citizen. The pattern_id, risk, and handoff fields stay in English verbatim.`
    : SYSTEM;

  try {
    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, ...messages],
        max_tokens: 6000,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "scam_check",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                reply: { type: "string" },
                pattern_id: { type: ["string", "null"] },
                risk: { type: "string", enum: [...RISKS] },
                handoff: { type: "string", enum: [...HANDOFFS] },
              },
              required: ["reply", "pattern_id", "risk", "handoff"],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(50000),
    });
    if (!r.ok) return NextResponse.json({ model: false, status: r.status });
    const d = await r.json();
    const raw = d.choices?.[0]?.message?.content ?? "{}";
    let out;
    try {
      out = JSON.parse(raw);
    } catch {
      return NextResponse.json({ model: false });
    }
    return NextResponse.json({
      model: true,
      reply: String(out.reply ?? "").slice(0, 600),
      pattern_id: asPatternId(out.pattern_id),
      risk: asRisk(out.risk),
      handoff: asHandoff(out.handoff),
    });
  } catch {
    return NextResponse.json({ model: false });
  }
}
