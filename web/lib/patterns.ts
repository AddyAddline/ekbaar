// The six scam patterns: the shared reference for the Learn page cards,
// the scam-checker verdicts (the model may only pick an id from here; the
// card the citizen sees renders from THIS data, never from model prose),
// and the rules-only fallback matcher.

import type { Lang } from "@/lib/i18n";

export type PatternId =
  | "digital-arrest"
  | "fake-kyc"
  | "parcel"
  | "job-task"
  | "investment"
  | "refund";

interface L10n {
  en: string;
  hi: string;
  mr: string;
}

export interface Pattern {
  id: PatternId;
  name: L10n;
  starts: L10n;
  tell: L10n;
  move: L10n;
  match: RegExp; // deterministic fallback matcher, English + Devanagari
}

export const PATTERNS: Pattern[] = [
  {
    id: "digital-arrest",
    name: { en: "Digital arrest", hi: "डिजिटल अरेस्ट", mr: "डिजिटल अरेस्ट" },
    starts: {
      en: "A video call from “police / CBI / customs”: a parcel or account in your name is linked to a crime. You are told you are under arrest and must stay on camera.",
      hi: "“पुलिस / सीबीआई / कस्टम्स” का वीडियो कॉल: आपके नाम का पार्सल या खाता किसी अपराध से जुड़ा बताया जाता है। कहा जाता है कि आप गिरफ़्तार हैं और कैमरे पर बने रहिए।",
      mr: "“पोलीस / सीबीआय / कस्टम्स” चा व्हिडिओ कॉल: तुमच्या नावाचे पार्सल किंवा खाते गुन्ह्याशी जोडलेले सांगितले जाते. तुम्ही अटकेत आहात आणि कॅमेऱ्यासमोर राहा असे सांगितले जाते.",
    },
    tell: {
      en: "No government agency investigates over video calls, and “digital arrest” does not exist in law.",
      hi: "कोई भी सरकारी एजेंसी वीडियो कॉल पर जांच नहीं करती, और “डिजिटल अरेस्ट” कानून में है ही नहीं।",
      mr: "कोणतीही सरकारी यंत्रणा व्हिडिओ कॉलवर चौकशी करत नाही, आणि “डिजिटल अरेस्ट” कायद्यात अस्तित्वातच नाही.",
    },
    move: {
      en: "Hang up. You cannot be arrested by phone. Then call 1930 if any money moved.",
      hi: "कॉल काटिए। फ़ोन से कोई गिरफ़्तारी नहीं होती। पैसा गया हो तो 1930 पर कॉल कीजिए।",
      mr: "कॉल बंद करा. फोनवरून अटक होत नाही. पैसे गेले असतील तर 1930 वर कॉल करा.",
    },
    match: /digital arrest|video call.*(police|cbi|customs|arrest)|(police|cbi|customs).*video call|under arrest|arrest warrant|डिजिटल अरेस्ट|गिरफ़्तार|गिरफ्तार|अटक|वारंट/i,
  },
  {
    id: "fake-kyc",
    name: { en: "Fake KYC / bank call", hi: "फ़र्ज़ी KYC / बैंक कॉल", mr: "बनावट KYC / बँक कॉल" },
    starts: {
      en: "An SMS or call says your account or KYC expires today. A link or app takes over from there.",
      hi: "SMS या कॉल आता है कि आपका खाता या KYC आज ही बंद हो जाएगा। आगे का काम एक लिंक या ऐप करता है।",
      mr: "SMS किंवा कॉल येतो की तुमचे खाते किंवा KYC आजच बंद होईल. पुढचे काम एक लिंक किंवा अ‍ॅप करते.",
    },
    tell: {
      en: "Banks block accounts through their own app and branches, never through urgency links.",
      hi: "बैंक खाते अपनी ऐप और शाखा से बंद करते हैं, जल्दबाज़ी वाले लिंक से कभी नहीं।",
      mr: "बँका खाती स्वतःच्या अ‍ॅप आणि शाखेतून बंद करतात, घाईच्या लिंकमधून कधीही नाही.",
    },
    move: {
      en: "Open your bank's app yourself. Never a link from a message.",
      hi: "बैंक की ऐप खुद खोलिए। मैसेज वाले लिंक से कभी नहीं।",
      mr: "बँकेचे अ‍ॅप स्वतः उघडा. मेसेजमधल्या लिंकवरून कधीही नाही.",
    },
    match: /kyc|know your customer|account.*(expir|block|suspend)|(expir|block|suspend).*account|केवाईसी|खाता बंद|खाते बंद/i,
  },
  {
    id: "parcel",
    name: { en: "Parcel / courier scam", hi: "पार्सल / कूरियर ठगी", mr: "पार्सल / कुरिअर फसवणूक" },
    starts: {
      en: "A “courier company” says your parcel contains illegal items, then transfers you to fake police.",
      hi: "“कूरियर कंपनी” कहती है कि आपके पार्सल में गैर-कानूनी सामान है, फिर कॉल फ़र्ज़ी पुलिस को दे देती है।",
      mr: "“कुरिअर कंपनी” सांगते की तुमच्या पार्सलमध्ये बेकायदेशीर वस्तू आहेत, मग कॉल बनावट पोलिसांकडे देते.",
    },
    tell: {
      en: "Real customs issues go through written notices, not conference calls with police.",
      hi: "असली कस्टम्स का काम लिखित नोटिस से होता है, पुलिस के साथ कॉन्फ्रेंस कॉल से नहीं।",
      mr: "खऱ्या कस्टम्सचे काम लेखी नोटिशीतून होते, पोलिसांसोबतच्या कॉन्फरन्स कॉलमधून नाही.",
    },
    move: {
      en: "End the call. Check any consignment number on the courier's real site.",
      hi: "कॉल काटिए। कंसाइनमेंट नंबर कूरियर की असली साइट पर जांचिए।",
      mr: "कॉल बंद करा. कन्साइनमेंट नंबर कुरिअरच्या खऱ्या साइटवर तपासा.",
    },
    match: /parcel|courier|fedex|consignment|customs.*(parcel|package)|पार्सल|कूरियर|कुरिअर/i,
  },
  {
    id: "job-task",
    name: { en: "Job-task fraud", hi: "जॉब-टास्क ठगी", mr: "जॉब-टास्क फसवणूक" },
    starts: {
      en: "Easy money for liking videos or rating hotels. Small payouts arrive first, then a “deposit” is needed to unlock bigger earnings.",
      hi: "वीडियो लाइक करने या होटल रेट करने के आसान पैसे। पहले छोटी रकम मिलती है, फिर बड़ी कमाई के लिए “डिपॉज़िट” मांगा जाता है।",
      mr: "व्हिडिओ लाइक करण्याचे किंवा हॉटेल रेट करण्याचे सोपे पैसे. आधी छोटी रक्कम मिळते, मग मोठ्या कमाईसाठी “डिपॉझिट” मागितले जाते.",
    },
    tell: {
      en: "The early payouts are the bait. Real work never needs you to pay to get paid.",
      hi: "शुरुआती पैसे ही चारा हैं। असली काम में कमाने के लिए पैसे नहीं देने पड़ते।",
      mr: "सुरुवातीचे पैसे हेच आमिष आहे. खऱ्या कामात कमावण्यासाठी पैसे द्यावे लागत नाहीत.",
    },
    move: {
      en: "Stop before the first deposit. Report the numbers on the portal's suspect registry.",
      hi: "पहले डिपॉज़िट से पहले रुक जाइए। नंबर पोर्टल की सस्पेक्ट रजिस्ट्री में रिपोर्ट कीजिए।",
      mr: "पहिल्या डिपॉझिटआधी थांबा. नंबर पोर्टलच्या सस्पेक्ट रजिस्ट्रीत नोंदवा.",
    },
    match: /like.*(video|youtube)|rating.*(hotel|product)|task.*(earn|money|payment)|part.?time.*(earn|job)|टास्क|कमाई.*(टास्क|लाइक)|लाइक.*कमाई/i,
  },
  {
    id: "investment",
    name: { en: "Investment group scam", hi: "निवेश ग्रुप ठगी", mr: "गुंतवणूक ग्रुप फसवणूक" },
    starts: {
      en: "A WhatsApp or Telegram “trading group” with screenshots of profits. An app shows your money growing, until withdrawal day.",
      hi: "WhatsApp या Telegram का “ट्रेडिंग ग्रुप”, मुनाफ़े के स्क्रीनशॉट के साथ। ऐप में पैसा बढ़ता दिखता है, निकालने के दिन तक।",
      mr: "WhatsApp किंवा Telegram चा “ट्रेडिंग ग्रुप”, नफ्याच्या स्क्रीनशॉटसह. अ‍ॅपमध्ये पैसे वाढताना दिसतात, काढण्याच्या दिवसापर्यंत.",
    },
    tell: {
      en: "The app's balance is a picture, not money. Withdrawal fees that grow are the trap closing.",
      hi: "ऐप का बैलेंस तस्वीर है, पैसा नहीं। बढ़ती “विदड्रॉल फ़ीस” यानी जाल बंद हो रहा है।",
      mr: "अ‍ॅपमधला बॅलन्स चित्र आहे, पैसे नाहीत. वाढणारी “विथड्रॉल फी” म्हणजे सापळा बंद होतोय.",
    },
    move: {
      en: "Check any adviser on SEBI's registry. Never move savings into an app a stranger sent.",
      hi: "किसी भी सलाहकार को SEBI रजिस्ट्री में जांचिए। अनजान के भेजे ऐप में बचत कभी मत डालिए।",
      mr: "कोणत्याही सल्लागाराला SEBI रजिस्ट्रीत तपासा. अनोळखी व्यक्तीने पाठवलेल्या अ‍ॅपमध्ये बचत कधीही टाकू नका.",
    },
    match: /trading group|invest.*(group|app|profit)|profit.*(guarantee|daily)|telegram.*(trade|invest)|stock tips|ट्रेडिंग|निवेश|गुंतवणूक|मुनाफ़ा|नफा/i,
  },
  {
    id: "refund",
    name: { en: "Wrong-payment refund", hi: "गलत-पेमेंट रिफंड", mr: "चुकीच्या-पेमेंटचा रिफंड" },
    starts: {
      en: "“I sent you money by mistake, please return it.” The incoming payment is fake or reversed later.",
      hi: "“गलती से आपको पैसे भेज दिए, वापस कर दीजिए।” आया हुआ पेमेंट नकली होता है या बाद में पलट जाता है।",
      mr: "“चुकून तुम्हाला पैसे पाठवले, परत करा.” आलेले पेमेंट बनावट असते किंवा नंतर उलटवले जाते.",
    },
    tell: {
      en: "Real wrong payments are reversed by the bank, never by you paying someone back.",
      hi: "असली गलत पेमेंट बैंक पलटाता है, आप किसी को वापस पैसे भेजकर नहीं।",
      mr: "खरे चुकीचे पेमेंट बँक उलटवते, तुम्ही कोणाला परत पैसे पाठवून नाही.",
    },
    move: {
      en: "Don't return anything. Tell your bank and let them handle the reversal.",
      hi: "कुछ भी वापस मत भेजिए। बैंक को बताइए, पलटाने का काम बैंक करेगा।",
      mr: "काहीही परत पाठवू नका. बँकेला सांगा, उलटवण्याचे काम बँक करेल.",
    },
    match: /sent.*(you|money).*(mistake|wrongly|accident)|wrong.*(payment|transfer)|return.*(money|payment)|गलती से.*(पैसे|भेज)|चुकून.*पैसे/i,
  },
];

export const patternById = (id: string | null | undefined): Pattern | null =>
  PATTERNS.find((p) => p.id === id) ?? null;

/* Deterministic fallback when the model is unreachable: first pattern whose
   matcher fires. Labeled as rules-only by the caller. */
export function matchPattern(text: string): Pattern | null {
  return PATTERNS.find((p) => p.match.test(text)) ?? null;
}

export function patternText(p: Pattern, lang: Lang) {
  return { name: p.name[lang], starts: p.starts[lang], tell: p.tell[lang], move: p.move[lang] };
}
