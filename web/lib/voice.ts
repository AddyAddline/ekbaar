// Browser-native voice: Web Speech API for listening, speechSynthesis for
// speaking. Deliberately no server dependency, voice can never take the
// public link down. Everything degrades to text (feature-detected).

export type VoiceLang = "en-IN" | "hi-IN" | "mr-IN";

export const VOICE_LANGS: { code: VoiceLang; label: string; native: string }[] = [
  { code: "hi-IN", label: "Hindi", native: "हिंदी" },
  { code: "mr-IN", label: "Marathi", native: "मराठी" },
  { code: "en-IN", label: "English", native: "English" },
];

/* ---------------- speech to text ---------------- */

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}

export function sttSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function createRecognizer(
  lang: VoiceLang,
  onInterim: (text: string) => void,
  onFinal: (text: string) => void,
  onStop: () => void
): { stop: () => void } | null {
  if (!sttSupported()) return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w.SpeechRecognition || w.webkitSpeechRecognition) as new () => SpeechRecognitionLike;
  const rec = new Ctor();
  rec.lang = lang;
  rec.continuous = true;
  rec.interimResults = true;
  let finalText = "";
  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript + " ";
      else interim += r[0].transcript;
    }
    onInterim((finalText + interim).trim());
  };
  rec.onend = () => {
    if (finalText.trim()) onFinal(finalText.trim());
    onStop();
  };
  rec.onerror = () => {
    /* onend fires after; degrade silently to typing */
  };
  try {
    rec.start();
  } catch {
    return null;
  }
  return { stop: () => rec.stop() };
}

/* ---------------- text to speech ---------------- */

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: VoiceLang): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(lang.slice(0, 2))) ||
    null
  );
}

export function speak(
  text: string,
  lang: VoiceLang = "en-IN",
  opts: { rate?: number; pitch?: number; onEnd?: () => void } = {}
): boolean {
  if (!ttsSupported()) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const v = pickVoice(lang);
  if (v) u.voice = v;
  u.rate = opts.rate ?? 0.98;
  u.pitch = opts.pitch ?? 1;
  if (opts.onEnd) u.onend = opts.onEnd;
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}
