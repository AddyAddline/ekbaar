import { NextRequest, NextResponse } from "next/server";

// Model-assisted candidate-fact extraction for blank cases.
// The model never routes and never confirms: routing is deterministic
// (lib/rules.ts) and every fact returned here stays a candidate until
// the citizen confirms it. If no key is configured, the client falls
// back to statement-only facts and says so.

export const runtime = "nodejs";
export const maxDuration = 30;

interface ExtractedFact {
  field: string;
  label: string;
  value: string;
  confidence: number;
}

export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ model: false, facts: [] });
  }

  let story = "";
  try {
    const body = await req.json();
    story = String(body.story ?? "").slice(0, 4000);
  } catch {
    return NextResponse.json({ model: false, facts: [] }, { status: 400 });
  }
  if (story.trim().length < 10) {
    return NextResponse.json({ model: false, facts: [] });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        messages: [
          {
            role: "system",
            content:
              "You extract candidate facts from a citizen's account of a suspected cybercrime incident in India. Return only facts stated in the text. Never invent amounts, names, numbers, or dates. Confidence reflects how explicitly the text states the fact. Fields you may use: transaction.amount_inr, transaction.date, transaction.utr, transaction.bank_or_wallet, incident.channel, suspect.mobile_display, suspect.bank_account, incident.claimed_authority.",
          },
          { role: "user", content: story },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "candidate_facts",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
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
              },
              required: ["facts"],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      return NextResponse.json({ model: false, facts: [] });
    }
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
    const facts: ExtractedFact[] = Array.isArray(parsed.facts)
      ? parsed.facts.slice(0, 12)
      : [];
    return NextResponse.json({ model: true, facts });
  } catch {
    // Deterministic fallback path: the client continues without the model.
    return NextResponse.json({ model: false, facts: [] });
  }
}
