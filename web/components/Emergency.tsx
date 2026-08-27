"use client";

import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/VoiceControls";
import type { VoiceLang } from "@/lib/voice";
import { sayAloud, stopSaying } from "@/lib/say";

// The one place in the product where red exists.
// Wording boundary: docs/research/facts.md, digital-arrest section (PIB
// sources). Hindi and Marathi are faithful translations of the same lines,
// spoken aloud because a panicking caller may not be able to read calmly.

const COPY: Record<
  VoiceLang,
  { headline: string; body: string; law: string; action: string; spoken: string }
> = {
  "en-IN": {
    headline: "This matches a documented digital-arrest scam pattern.",
    body: "Real police, CBI, customs and RBI do not investigate over video calls, and they do not ask for money.",
    law: "No government agency conducts investigations via phone or video calls.",
    action: "End the call. Do not send more money.",
    spoken:
      "Please listen carefully. This matches a known digital arrest scam. End the call now. Do not send more money. No government agency conducts investigations via phone or video calls. You are safe. Call 1930.",
  },
  "hi-IN": {
    headline: "यह एक ज्ञात “डिजिटल अरेस्ट” धोखाधड़ी का तरीका है।",
    body: "असली पुलिस, सीबीआई, कस्टम्स या आरबीआई वीडियो कॉल पर जांच नहीं करते, और पैसे नहीं मांगते।",
    law: "कोई भी सरकारी एजेंसी फ़ोन या वीडियो कॉल पर जांच नहीं करती।",
    action: "कॉल काटिए। और पैसे मत भेजिए।",
    spoken:
      "ध्यान से सुनिए। यह एक ज्ञात डिजिटल अरेस्ट धोखाधड़ी है। कॉल तुरंत काटिए। और पैसे मत भेजिए। कोई भी सरकारी एजेंसी फ़ोन या वीडियो कॉल पर जांच नहीं करती। आप सुरक्षित हैं। 1930 पर कॉल कीजिए।",
  },
  "mr-IN": {
    headline: "हा एक ओळखीचा “डिजिटल अरेस्ट” फसवणुकीचा प्रकार आहे.",
    body: "खरी पोलीस, सीबीआय, कस्टम्स किंवा आरबीआय व्हिडिओ कॉलवर चौकशी करत नाहीत, आणि पैसे मागत नाहीत.",
    law: "कोणतीही सरकारी यंत्रणा फोन किंवा व्हिडिओ कॉलवर चौकशी करत नाही.",
    action: "कॉल बंद करा. आणखी पैसे पाठवू नका.",
    spoken:
      "काळजीपूर्वक ऐका. ही एक ओळखीची डिजिटल अरेस्ट फसवणूक आहे. कॉल लगेच बंद करा. आणखी पैसे पाठवू नका. कोणतीही सरकारी यंत्रणा फोन किंवा व्हिडिओ कॉलवर चौकशी करत नाही. तुम्ही सुरक्षित आहात. 1930 वर कॉल करा.",
  },
};

const LANGS: { code: VoiceLang; native: string }[] = [
  { code: "en-IN", native: "English" },
  { code: "hi-IN", native: "हिंदी" },
  { code: "mr-IN", native: "मराठी" },
];

export default function Emergency({ onResolved }: { onResolved: () => void }) {
  const [ended, setEnded] = useState(false);
  const [lang, setLang] = useState<VoiceLang>("en-IN");
  const c = COPY[lang];

  // The screen appears after a user tap, so audio is permitted. Speak the
  // instructions once per language selection (Gemini voice, browser
  // fallback); a panicking caller may not be able to read calmly.
  useEffect(() => {
    sayAloud(c.spoken, {
      voice: "Kore",
      style: "Calm, unhurried, protective. Speak like a trusted family elder keeping someone safe. Language of the text.",
      fallbackLang: lang,
    });
    return () => stopSaying();
  }, [lang, c.spoken]);

  return (
    <div className="takeover fixed inset-0 z-50 flex flex-col overflow-y-auto bg-navy-deep text-white">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
            Pause — before anything else
          </p>
          <div className="flex gap-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  lang === l.code ? "bg-white text-navy-deep" : "text-white/60 hover:bg-white/10"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        <h1 className={`font-display text-[30px] font-semibold leading-[1.15] ${lang !== "en-IN" ? "font-devanagari" : ""}`}>
          {c.headline}
        </h1>
        <p className={`mt-4 text-[15px] leading-relaxed text-white/85 ${lang !== "en-IN" ? "font-devanagari" : ""}`}>
          {c.body} <span className="text-white">{c.law}</span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-[12px] text-white/50">
          Ministry of Home Affairs, Oct 2024 · pib.gov.in
          <SpeakButton text={c.spoken} lang={lang} light />
        </p>

        {!ended ? (
          <button
            onClick={() => setEnded(true)}
            className={`mt-8 w-full rounded-lg bg-stop px-6 py-4 text-[17px] font-semibold text-white shadow-lg transition-colors hover:bg-stop-deep ${lang !== "en-IN" ? "font-devanagari" : ""}`}
          >
            {c.action}
          </button>
        ) : (
          <div className="msg-in mt-8 space-y-2.5">
            <p className="mb-3 text-[14px] font-medium text-white/90">
              Good. You are not in trouble for hanging up. Now, in this order:
            </p>
            <a
              href="tel:1930"
              className="block rounded-lg border border-white/25 bg-white/10 px-4 py-3 transition-colors hover:bg-white/15"
            >
              <span className="block text-[15px] font-semibold">Call 1930</span>
              <span className="text-[12px] text-white/65">
                National cybercrime helpline — report the transfer you already made
              </span>
            </a>
            <div className="rounded-lg border border-white/25 bg-white/10 px-4 py-3">
              <span className="block text-[15px] font-semibold">Tell your bank</span>
              <span className="text-[12px] text-white/65">
                Use the fraud number on the back of your card or the bank&apos;s app
              </span>
            </div>
            <div className="rounded-lg border border-white/25 bg-white/10 px-4 py-3">
              <span className="block text-[15px] font-semibold">Tell one person you trust</span>
              <span className="text-[12px] text-white/65">The scam depends on your silence</span>
            </div>
            <button
              onClick={onResolved}
              className="mt-4 w-full rounded-lg bg-white px-6 py-3.5 text-[15px] font-semibold text-navy-deep transition-colors hover:bg-white/90"
            >
              The call has ended — continue my case
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
