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
3. Ask for the SINGLE most useful missing fact next (one question only). Priority order for financial fraud: amount → transaction/UTR number (12 digits) → date and time → bank or wallet name → how they contacted (channel) → suspect number/UPI/account → whether evidence (receipt/screenshot) exists.
4. When amount, UTR or bank, date, and channel are known, set ready_to_review true and tell them you can prepare the bank packet, the 1930 call card, and the NCRP complaint from this one record.

FACT FIELDS (only these): transaction.amount_inr, transaction.utr, transaction.date, transaction.bank_or_wallet, incident.channel, incident.claimed_authority, suspect.mobile_display, suspect.upi_id, suspect.bank_account, incident.datetime, evidence.available.

HARD RULES:
- You never decide whether a crime occurred; police and courts do.
- You never promise recovery. A hold is not a refund.
- You never claim to file anything; filing on the real portal is done by the citizen (this prototype simulates it, labeled).
- If they describe being ON A CALL RIGHT NOW with people claiming to be police/CBI/customs/RBI demanding money or secrecy, set emergency_suspected true and your reply must be only: end the call, no government agency investigates via phone or video calls (MHA), call 1930. In their language.
- No real personal data: if they type what looks like a full real Aadhaar/PAN/card number, tell them not to share it here.
- Keep replies under 60 words.`;

interface ChatMsg { role: "user" | "assistant"; content: string }

export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.OPENAI_MODEL || "openai/gpt-5.6-terra";

  let messages: ChatMsg[] = [];
  try {
    const b = await req.json();
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

  try {
    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
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
