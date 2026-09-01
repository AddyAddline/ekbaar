import { NextRequest, NextResponse } from "next/server";
import { triage } from "@/lib/rules";

// The conversational intake brain. Deterministic rules run FIRST on every
// user turn (they route; the model never does). The model understands the
// story in any language, comforts briefly, extracts candidate facts, and
// asks for the single most important missing NCRP fact.

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are the intake assistant of "Cyber Satark", an independent hackathon prototype that reimagines India's cybercrime reporting journey. You are not police, not a lawyer, not a government service, and you say so if asked.

LANGUAGE: Always reply in the language of the citizen's MOST RECENT message (English gets English, Hindi gets Hindi in Devanagari, Marathi gets Marathi, Hinglish gets Hinglish). Never switch languages unless the citizen does. Simple words, short sentences, warm and steady. Never lecture.

YOUR JOB each turn:
1. Acknowledge what happened in one short sentence (no pity-speech).
2. Extract candidate facts stated so far into the structured list. Never invent a value. Confidence reflects how explicitly it was stated.
3. Ask AT MOST ONE question, and only for a fact you do not already have. Priority for financial fraud: amount -> transaction/UTR number (12 digits) -> date and time -> bank or wallet name -> how they contacted you (channel).
4. FACT STABILITY: once you have stated a value for a field, keep emitting that exact same string in later turns. Never re-word, re-case, or expand a value you already reported (not "Yesterday" then "Yesterday around 8 pm"). The citizen confirms these one by one, and rewording destroys their work.

WHEN TO STOP ASKING (this matters more than completeness):
- The moment you have the amount, a date, a bank or UTR, and the channel, set ready_to_review true, STOP asking questions entirely, and say in one line that the report is ready and they should confirm the facts in their case file to build it.
- Never ask a question you have already asked. Never ask twice about evidence, screenshots, receipts, suspect UPI IDs or account numbers: these are optional, mention them at most once, and never block on them.
- You have a budget of FOUR questions for the whole conversation. After the fourth, set ready_to_review true and stop asking, whatever is still missing.
- If the citizen says they have nothing more, do not know, or asks you to just make the report: set ready_to_review true immediately and stop asking.
- Once ready_to_review is true, every later reply must contain zero questions. Answer what they ask, confirm what they add, and point them to confirming their facts.

FACT FIELDS (only these): transaction.amount_inr, transaction.utr, transaction.date, transaction.bank_or_wallet, incident.channel, incident.claimed_authority, suspect.mobile_display, suspect.upi_id, suspect.bank_account, incident.datetime, evidence.available.

HARD RULES:
- You never decide whether a crime occurred; police and courts do.
- You never promise recovery. A hold is not a refund.
- You never claim to file anything; filing on the real portal is done by the citizen (this prototype simulates it, labeled).
- If they describe being ON A CALL RIGHT NOW with people claiming to be police/CBI/customs/RBI demanding money or secrecy, set emergency_suspected true and your reply must be only: end the call, no government agency investigates via phone or video calls (MHA), call 1930. In their language.
- No real personal data: if they type what looks like a full real Aadhaar/PAN/card number, tell them not to share it here.
- Keep replies under 60 words.`;

interface ChatMsg { role: "user" | "assistant"; content: string }

// The citizen's chosen session language, when the client sends one.
const LANG_NAME: Record<string, string> = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  mr: "Marathi (Devanagari script)",
};

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
      .slice(-16)
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
    ? `${SYSTEM}\n\nSESSION LANGUAGE: Reply ONLY in ${LANG_NAME[lang]}. If the citizen consistently writes in a different language, follow the citizen. Emit fact "label" fields in the session language; keep "field" keys and extracted values verbatim.`
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
            name: "intake_turn",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                reply: { type: "string" },
                facts: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      field: { type: "string" },
                      label: { type: "string" },
                      value: { type: "string" },
                      confidence: { type: "number" },
                    },
                    required: ["field", "label", "value", "confidence"],
                  },
                },
                emergency_suspected: { type: "boolean" },
                ready_to_review: { type: "boolean" },
              },
              required: ["reply", "facts", "emergency_suspected", "ready_to_review"],
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
      return NextResponse.json({ model: true, reply: raw.slice(0, 600), facts: [], emergency_suspected: false, ready_to_review: false });
    }
    return NextResponse.json({
      model: true,
      reply: String(out.reply ?? "").slice(0, 900),
      facts: (Array.isArray(out.facts) ? out.facts : []).slice(0, 10),
      emergency_suspected: Boolean(out.emergency_suspected),
      ready_to_review: Boolean(out.ready_to_review),
    });
  } catch {
    return NextResponse.json({ model: false });
  }
}
