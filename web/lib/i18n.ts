// Session-language strings for the live intake. The citizen picks (or
// implies) a language once; every surface they touch speaks it.
// Field keys, source citations and the event log stay English by design.

import type { VoiceLang } from "@/lib/voice";

export type Lang = "en" | "hi" | "mr";

export const VOICE_OF: Record<Lang, VoiceLang> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

export const LANG_LABEL: Record<Lang, string> = { en: "English", hi: "हिंदी", mr: "मराठी" };

// Devanagari with Marathi markers → mr; Devanagari → hi; else en.
export function inferLang(text: string): Lang {
  if (!/[ऀ-ॿ]/.test(text)) return "en";
  if (/(आहे|नाही|झाल|कर(a|ा|ू)? |मला|तुम|पैसे गेले|कॉलवर)/.test(text)) return "mr";
  return "hi";
}

interface Strings {
  langNote: string;
  voiceQuestion: string;
  voiceYes: string;
  voiceNo: string;
  welcome: string;
  placeholder: string;
  statusSpeakType: string;
  send: string;
  thinking: [string, string, string];
  didYouKnow: string;
  tips: { text: string; source: string }[];
  sttRecording: string; // {s} seconds
  sttUnderstanding: string;
  sttRetry: string;
  micDenied: string;
  speaking: string;
  repliesAloud: string;
  repliesMuted: string;
  caseBar: string; // {n} {c}
  openSheet: string;
  confirm: string;
  confirmedYou: string;
  unconfirmed: string;
  factsHeader: string; // {c} {n}
  preparePackets: string;
  confirmHint: string;
  factsAwait: string; // {n}
  simulateFiling: string;
  filedMsg: string;
  emergencyResume: string;
  aiDown: string;
  draftStamp: string;
  changeLang: string;
  starters: string[]; // starters[0] MUST deterministically trip the digital-arrest rule
}

export const STR: Record<Lang, Strings> = {
  en: {
    langNote: "You can always speak or type in any language, this only sets how I talk to you.",
    voiceQuestion: "I can also speak my replies aloud, like this. Want that?",
    voiceYes: "Yes, speak aloud",
    voiceNo: "Text only",
    welcome:
      "Tell me what happened, in your own words, just once. Your case file builds as you speak.\n\n(Prototype, no real names, IDs or account numbers.)",
    placeholder: "Speak, or type here…",
    statusSpeakType: "Speak or type, any language",
    send: "Send",
    thinking: [
      "Reading your words…",
      "Checking against known scam patterns…",
      "Working out the one thing to ask next…",
    ],
    didYouKnow: "Did you know?",
    tips: [
      { text: "No government agency conducts investigations via phone or video calls.", source: "MHA, Oct 2024" },
      { text: "An amount “put on hold” is not a refund.", source: "NCRP FAQ" },
      { text: "Banks never ask for your OTP or PIN.", source: "RBI awareness" },
      { text: "Report fast, call 1930 as soon as money moves.", source: "MHA · CFCFRMS" },
      { text: "A complaint acknowledgement is not an FIR.", source: "NCRP manual" },
    ],
    sttRecording: "● Recording {s}s, tap the mic to finish",
    sttUnderstanding: "Understanding your words…",
    sttRetry: "I couldn't catch that, try once more, closer to the phone, or type it.",
    micDenied: "Microphone was blocked, typing works just the same.",
    speaking: "Speaking…",
    repliesAloud: "🔊 replies aloud",
    repliesMuted: "🔇 replies muted",
    caseBar: "Case file · {n} facts · {c} confirmed by you",
    openSheet: "open ▸",
    confirm: "Confirm",
    confirmedYou: "✓ you",
    unconfirmed: "unconfirmed",
    factsHeader: "Facts · {c} confirmed of {n}",
    preparePackets: "Prepare my packets, bank · 1930 · NCRP",
    confirmHint: "Confirm the facts in your case file to unlock the packets, nothing unconfirmed is ever used.",
    factsAwait: "{n} facts are waiting for your confirmation →",
    simulateFiling: "Simulate NCRP filing, nothing is really sent",
    filedMsg:
      "Simulated filing recorded, reference DEMO-NCRP-2026-1001. Remember: an acknowledgement is not an FIR, and your case stays live here. Track it any time from the Track section.",
    emergencyResume:
      "You did the two things that matter most: the call is over and no more money moved. When you're ready, tell me about the transfer you already made, amount first, and we'll make it recoverable.",
    aiDown:
      "Live AI isn't reachable right now, so I can't hold a conversation, but nothing is lost. The sample case shows the complete journey, and the emergency guard still works: it doesn't need AI.",
    draftStamp: "Draft · this device only",
    changeLang: "भाषा · change",
    starters: [
      "Someone saying they are police has me on a video call and wants money",
      "I paid a seller on Instagram and got blocked",
      "My card was charged for something I never bought",
    ],
  },
  hi: {
    langNote: "आप कभी भी किसी भी भाषा में बोल या लिख सकते हैं, यह सिर्फ़ तय करता है कि मैं आपसे कैसे बात करूँ।",
    voiceQuestion: "मैं अपने जवाब बोलकर भी सुना सकती हूँ, ऐसे। सुनाऊँ?",
    voiceYes: "हाँ, बोलकर बताइए",
    voiceNo: "सिर्फ़ लिखकर",
    welcome:
      "बताइए क्या हुआ, अपने शब्दों में, बस एक बार। जैसे-जैसे आप बताएँगे, आपकी केस फ़ाइल बनती जाएगी।\n\n(प्रोटोटाइप, असली नाम, ID या खाता नंबर न लिखें।)",
    placeholder: "बोलिए, या यहाँ लिखिए…",
    statusSpeakType: "बोलिए या लिखिए, कोई भी भाषा",
    send: "भेजें",
    thinking: [
      "आपकी बात पढ़ रही हूँ…",
      "जानी-पहचानी ठगी के पैटर्न से मिला रही हूँ…",
      "अगला ज़रूरी सवाल सोच रही हूँ…",
    ],
    didYouKnow: "क्या आप जानते हैं?",
    tips: [
      { text: "कोई भी सरकारी एजेंसी फ़ोन या वीडियो कॉल पर जांच नहीं करती।", source: "गृह मंत्रालय, अक्टू. 2024" },
      { text: "“होल्ड” हुआ पैसा वापस मिला पैसा नहीं होता।", source: "NCRP FAQ" },
      { text: "बैंक कभी आपका OTP या PIN नहीं मांगता।", source: "RBI जागरूकता" },
      { text: "जल्दी रिपोर्ट करना ज़रूरी है, पैसा जाते ही 1930 पर कॉल करें।", source: "गृह मंत्रालय · CFCFRMS" },
      { text: "शिकायत की पावती FIR नहीं होती।", source: "NCRP मैनुअल" },
    ],
    sttRecording: "● रिकॉर्डिंग {s} से., पूरा होने पर माइक दबाइए",
    sttUnderstanding: "आपकी आवाज़ समझ रही हूँ…",
    sttRetry: "सुनाई नहीं दिया, एक बार फिर, फ़ोन के पास बोलिए, या लिख दीजिए।",
    micDenied: "माइक की अनुमति नहीं मिली, लिखकर भी सब वैसा ही चलेगा।",
    speaking: "बोल रही हूँ…",
    repliesAloud: "🔊 बोलकर जवाब",
    repliesMuted: "🔇 सिर्फ़ लिखकर",
    caseBar: "केस फ़ाइल · {n} तथ्य · {c} आपने पुष्टि किए",
    openSheet: "खोलें ▸",
    confirm: "पुष्टि करें",
    confirmedYou: "✓ आप",
    unconfirmed: "अपुष्ट",
    factsHeader: "तथ्य · {n} में से {c} पुष्ट",
    preparePackets: "मेरे पैकेट तैयार करें, बैंक · 1930 · NCRP",
    confirmHint: "पैकेट के लिए केस फ़ाइल में तथ्यों की पुष्टि करें, बिना आपकी पुष्टि कुछ भी इस्तेमाल नहीं होता।",
    factsAwait: "{n} तथ्य आपकी पुष्टि का इंतज़ार कर रहे हैं →",
    simulateFiling: "NCRP फाइलिंग सिम्युलेट करें, असल में कुछ नहीं भेजा जाता",
    filedMsg:
      "सिम्युलेटेड फाइलिंग दर्ज, संदर्भ DEMO-NCRP-2026-1001। याद रखिए: पावती FIR नहीं होती, और आपका केस यहाँ चालू रहता है। Track सेक्शन से कभी भी देखिए।",
    emergencyResume:
      "आपने सबसे ज़रूरी दो काम कर लिए: कॉल कट गया और अब और पैसा नहीं गया। जब तैयार हों, तो जो पैसा जा चुका है उसके बारे में बताइए, पहले रकम, ताकि उसे वापस पाने की कोशिश हो सके।",
    aiDown:
      "लाइव AI अभी उपलब्ध नहीं है, इसलिए बातचीत नहीं हो पा रही, लेकिन कुछ खोया नहीं है। Sample case में पूरा सफ़र दिखता है, और आपातकालीन सुरक्षा अब भी काम करती है: उसे AI की ज़रूरत नहीं।",
    draftStamp: "ड्राफ्ट · सिर्फ़ इस डिवाइस पर",
    changeLang: "भाषा · बदलें",
    starters: [
      "“सीबीआई अफ़सर” वीडियो कॉल पर हैं, कहते हैं गिरफ्तार करेंगे, पैसे मांग रहे हैं",
      "मैंने Instagram पर एक विक्रेता को पैसे भेजे और उसने ब्लॉक कर दिया",
      "मेरे खाते से ऐसी चीज़ के पैसे कटे जो मैंने खरीदी ही नहीं",
    ],
  },
  mr: {
    langNote: "तुम्ही कधीही कोणत्याही भाषेत बोलू किंवा लिहू शकता, हे फक्त मी तुमच्याशी कसं बोलू ते ठरवतं.",
    voiceQuestion: "मी माझी उत्तरं बोलूनही सांगू शकते, अशी. सांगू का?",
    voiceYes: "हो, बोलून सांगा",
    voiceNo: "फक्त लिहून",
    welcome:
      "काय झालं ते सांगा, तुमच्या शब्दांत, फक्त एकदा. तुम्ही सांगाल तशी तुमची केस फाईल तयार होत जाईल.\n\n(प्रोटोटाइप, खरी नावं, ID किंवा खाते क्रमांक लिहू नका.)",
    placeholder: "बोला, किंवा इथे लिहा…",
    statusSpeakType: "बोला किंवा लिहा, कोणतीही भाषा",
    send: "पाठवा",
    thinking: [
      "तुमचे शब्द वाचत आहे…",
      "ओळखीच्या फसवणूक पॅटर्नशी तपासत आहे…",
      "पुढचा महत्त्वाचा प्रश्न ठरवत आहे…",
    ],
    didYouKnow: "तुम्हाला माहीत आहे का?",
    tips: [
      { text: "कोणतीही सरकारी यंत्रणा फोन किंवा व्हिडिओ कॉलवर चौकशी करत नाही.", source: "गृह मंत्रालय, ऑक्टो. 2024" },
      { text: "“होल्ड” झालेली रक्कम म्हणजे परत मिळालेली रक्कम नाही.", source: "NCRP FAQ" },
      { text: "बँक कधीही तुमचा OTP किंवा PIN विचारत नाही.", source: "RBI जागरूकता" },
      { text: "लवकर तक्रार करणं महत्त्वाचं, पैसे गेल्यावर लगेच 1930 वर कॉल करा.", source: "गृह मंत्रालय · CFCFRMS" },
      { text: "तक्रारीची पोच म्हणजे FIR नाही.", source: "NCRP मॅन्युअल" },
    ],
    sttRecording: "● रेकॉर्डिंग {s} से., झाल्यावर माइक दाबा",
    sttUnderstanding: "तुमचा आवाज समजून घेत आहे…",
    sttRetry: "ऐकू आलं नाही, पुन्हा एकदा, फोनजवळ बोला, किंवा लिहा.",
    micDenied: "माइकची परवानगी मिळाली नाही, लिहूनही सगळं तसंच चालेल.",
    speaking: "बोलत आहे…",
    repliesAloud: "🔊 बोलून उत्तर",
    repliesMuted: "🔇 फक्त लिहून",
    caseBar: "केस फाईल · {n} तथ्यं · {c} तुम्ही निश्चित केली",
    openSheet: "उघडा ▸",
    confirm: "निश्चित करा",
    confirmedYou: "✓ तुम्ही",
    unconfirmed: "अनिश्चित",
    factsHeader: "तथ्यं · {n} पैकी {c} निश्चित",
    preparePackets: "माझी पॅकेट्स तयार करा, बँक · 1930 · NCRP",
    confirmHint: "पॅकेट्ससाठी केस फाईलमधील तथ्यं निश्चित करा, तुमच्या निश्चितीशिवाय काहीही वापरलं जात नाही.",
    factsAwait: "{n} तथ्यं तुमच्या निश्चितीची वाट पाहत आहेत →",
    simulateFiling: "NCRP फायलिंग सिम्युलेट करा, प्रत्यक्षात काहीही पाठवलं जात नाही",
    filedMsg:
      "सिम्युलेटेड फायलिंग नोंदवली, संदर्भ DEMO-NCRP-2026-1001. लक्षात ठेवा: पोच म्हणजे FIR नाही, आणि तुमची केस इथे चालू राहते. Track विभागातून कधीही पाहा.",
    emergencyResume:
      "सगळ्यात महत्त्वाच्या दोन गोष्टी तुम्ही केल्या: कॉल बंद झाला आणि आणखी पैसे गेले नाहीत. तयार असाल तेव्हा, गेलेल्या पैशांबद्दल सांगा, आधी रक्कम, म्हणजे ते परत मिळवण्याचा प्रयत्न करता येईल.",
    aiDown:
      "लाइव्ह AI सध्या उपलब्ध नाही, म्हणून संवाद होऊ शकत नाही, पण काहीही हरवलेलं नाही. Sample case मध्ये पूर्ण प्रवास दिसतो, आणि आपत्कालीन संरक्षण अजूनही चालू आहे: त्याला AI ची गरज नाही.",
    draftStamp: "ड्राफ्ट · फक्त या डिव्हाइसवर",
    changeLang: "भाषा · बदला",
    starters: [
      "“पोलीस” म्हणणारे व्हिडिओ कॉलवर आहेत, पैसे मागत आहेत, अटक करू म्हणतात",
      "मी Instagram वरील विक्रेत्याला पैसे पाठवले आणि त्याने ब्लॉक केलं",
      "मी न घेतलेल्या वस्तूचे पैसे खात्यातून कापले गेले",
    ],
  },
};

export function fmt(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
