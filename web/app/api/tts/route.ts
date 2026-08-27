import { NextRequest, NextResponse } from "next/server";
import { pcmToWav } from "@/lib/wav";

// Speech out: Gemini TTS (any language the text is in — Hindi, Marathi,
// Tamil, Bengali, English and more). Returns a WAV the browser can play.
// No audio or key ever touches the client.

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_VOICES = new Set([
  "Kore", "Charon", "Achernar", "Puck", "Aoede", "Leda", "Orus", "Zephyr",
]);

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "tts_unconfigured" }, { status: 503 });

  let text = "", voice = "Kore", style = "";
  try {
    const b = await req.json();
    text = String(b.text ?? "").slice(0, 900);
    voice = ALLOWED_VOICES.has(b.voice) ? b.voice : "Kore";
    style = String(b.style ?? "").slice(0, 200);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!text.trim()) return NextResponse.json({ error: "empty" }, { status: 400 });

  const preamble =
    style ||
    "Calm, steady, reassuring helper. Natural pace, clear diction, speak in the language of the text.";

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${preamble}\n\nText to read aloud:\n${text}` }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
          },
        }),
        signal: AbortSignal.timeout(45000),
      }
    );
    if (!r.ok) return NextResponse.json({ error: "tts_failed" }, { status: 502 });
    const d = await r.json();
    const b64 = d.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!b64) return NextResponse.json({ error: "no_audio" }, { status: 502 });
    const wav = pcmToWav(Buffer.from(b64, "base64"));
    return new NextResponse(new Uint8Array(wav), {
      headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "tts_failed" }, { status: 502 });
  }
}
