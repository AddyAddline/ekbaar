"use client";

import { speak as browserSpeak, stopSpeaking as browserStop, type VoiceLang } from "@/lib/voice";

// Client-side "say it aloud": Gemini voice via /api/tts, falling back to the
// browser's speech engine, falling back to silence. Voice is a layer, never
// a dependency.

let current: HTMLAudioElement | null = null;

// One audio channel for the whole app: anything starting to speak stops
// whatever else was speaking, and interested buttons get told.
const subs = new Set<() => void>();
export function onSayInterrupt(cb: () => void): () => void {
  subs.add(cb);
  return () => subs.delete(cb);
}
function notify() {
  subs.forEach((cb) => cb());
}

export function stopSaying() {
  current?.pause();
  current = null;
  browserStop();
  notify();
}

/* Play a pre-generated static clip through the single audio channel -
   instant start, no API wait. Used where the script is fixed (onboarding
   demo, simulator caller). */
export function sayClip(url: string, opts: { onStart?: () => void; onEnd?: () => void } = {}) {
  current?.pause();
  current = null;
  browserStop();
  notify();
  const a = new Audio(url);
  current = a;
  a.onended = () => opts.onEnd?.();
  opts.onStart?.();
  a.play().catch(() => opts.onEnd?.());
}

/* Fetch the voice first, play later: lets the caller reveal text and audio
   in one arrival. Resolves null on failure/timeout, the caller reveals
   silently; the text is never held hostage to the voice. */
export async function prepareSaying(
  text: string,
  opts: { voice?: string; style?: string; onStart?: () => void; onEnd?: () => void } = {}
): Promise<(() => void) | null> {
  try {
    const r = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 850), voice: opts.voice ?? "Kore", style: opts.style ?? "" }),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) return null;
    const url = URL.createObjectURL(await r.blob());
    return () => {
      current?.pause();
      current = null;
      browserStop();
      notify();
      const a = new Audio(url);
      current = a;
      a.onended = () => {
        URL.revokeObjectURL(url);
        opts.onEnd?.();
      };
      opts.onStart?.();
      a.play().catch(() => opts.onEnd?.());
    };
  } catch {
    return null;
  }
}

export async function sayAloud(
  text: string,
  opts: {
    voice?: string;
    style?: string;
    fallbackLang?: VoiceLang;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}
): Promise<void> {
  current?.pause();
  current = null;
  browserStop();
  notify();
  try {
    const r = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.slice(0, 850), voice: opts.voice ?? "Kore", style: opts.style ?? "" }),
      signal: AbortSignal.timeout(20000),
    });
    if (r.ok) {
      const url = URL.createObjectURL(await r.blob());
      const a = new Audio(url);
      current = a;
      a.onended = () => {
        URL.revokeObjectURL(url);
        opts.onEnd?.();
      };
      opts.onStart?.();
      await a.play();
      return;
    }
  } catch {
    /* fall through to browser voice */
  }
  opts.onStart?.();
  const ok = browserSpeak(text, opts.fallbackLang ?? "en-IN", { onEnd: opts.onEnd });
  if (!ok) opts.onEnd?.();
}
