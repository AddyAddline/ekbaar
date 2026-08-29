import { NextRequest, NextResponse } from "next/server";

// Speech in: the browser records (MediaRecorder, webm/opus) and we
// transcribe with Gemini, Hindi, Marathi, Tamil, Bengali, Hinglish,
// anything. Verbatim, same language, no embellishment.

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "stt_unconfigured" }, { status: 503 });

  let audio = "", mime = "audio/webm";
  try {
    const b = await req.json();
    audio = String(b.audio ?? "");
    mime = String(b.mime ?? "audio/webm").slice(0, 40);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  // ~6 MB base64 cap ≈ 90s of opus, plenty for one turn.
  if (!audio || audio.length > 6_000_000) {
    return NextResponse.json({ error: "bad_audio" }, { status: 400 });
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Transcribe this speech verbatim in the language it is spoken (Devanagari for Hindi/Marathi, native script otherwise). Output ONLY the transcript text. If the audio is silent, noise, or unintelligible, output exactly: [unintelligible]",
                },
                { inlineData: { mimeType: mime, data: audio } },
              ],
            },
          ],
          generationConfig: { temperature: 0 },
        }),
        signal: AbortSignal.timeout(45000),
      }
    );
    if (!r.ok) return NextResponse.json({ error: "stt_failed" }, { status: 502 });
    const d = await r.json();
    const text = (d.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();
    if (!text || text.includes("[unintelligible]")) {
      return NextResponse.json({ text: "" });
    }
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "stt_failed" }, { status: 502 });
  }
}
