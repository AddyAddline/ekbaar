// Deterministic triage rules. Source of truth: product/rule-matrix.md.
// The model never decides these routes; it only extracts candidate facts.

export type Route =
  | { kind: "emergency_112"; sourceId: "ERSS-112" }
  | { kind: "digital_arrest_interruption"; sourceId: "PIB-2068698" }
  | { kind: "financial_fraud"; sourceId: "MHA-CFCFRMS-2026" }
  | { kind: "no_loss_suspicious"; sourceId: "NCRP-FAQ-2024" }
  | { kind: "needs_more_facts"; sourceId: "product-safety-rule" };

const LIFE_THREAT = /\b(kill|hurt|weapon|attack|suicide|self[- ]harm|physical danger)\b/i;

const IMPERSONATION =
  /\b(police|cbi|customs|court|judge|rbi|narcotics|ncb|ed|income tax officer|officer|crime branch)\b/i;

const LIVE_CALL =
  /\b(still on|on a video call|on the call|on a whatsapp call|video call right now|calling me right now|keeps? calling|won'?t let me hang up|can'?t hang up|cannot hang up|not allowed to hang up|stay on the call|skype call)\b/i;

const COERCION =
  /\b(arrest|warrant|digital arrest|verification account|do not tell|don'?t tell anyone|cannot tell anyone|keep it secret|secrecy|threaten(ed|ing)?|demand(ed|ing)?( another)? payment|pay (now|immediately)|more money)\b/i;

const MONEY_LOST =
  /\b(transferred|sent|paid|debited|deducted|lost|upi|imps|neft|rtgs)\b[\s\S]*?\b(rs\.?|rupees?|inr|₹|\d{3,})\b|\b(rs\.?|rupees?|inr|₹)\s?[\d,]+/i;

export function triage(story: string): Route {
  // The emergency rules are evaluated before every other route.
  if (LIFE_THREAT.test(story)) return { kind: "emergency_112", sourceId: "ERSS-112" };
  if (IMPERSONATION.test(story) && (LIVE_CALL.test(story) || COERCION.test(story))) {
    return { kind: "digital_arrest_interruption", sourceId: "PIB-2068698" };
  }
  if (MONEY_LOST.test(story)) return { kind: "financial_fraud", sourceId: "MHA-CFCFRMS-2026" };
  if (story.trim().length < 40) return { kind: "needs_more_facts", sourceId: "product-safety-rule" };
  return { kind: "no_loss_suspicious", sourceId: "NCRP-FAQ-2024" };
}

export const SOURCES: Record<string, { label: string; url?: string }> = {
  "PIB-2068698": {
    label: "MHA, 27 Oct 2024: no government agency investigates via phone or video call",
    url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2068698&lang=2&reg=48",
  },
  "MHA-CFCFRMS-2026": {
    label: "MHA on CFCFRMS and the 1930 helpline",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2290377&lang=2&reg=48",
  },
  "NCRP-CHECKLIST-2024": {
    label: "cybercrime.gov.in complaint checklist, checked 26 Aug 2026",
    url: "https://www.cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx",
  },
  "NCRP-FAQ-2024": {
    label: "cybercrime.gov.in FAQ, checked 26 Aug 2026",
    url: "https://www.cybercrime.gov.in/Webform/FAQ.aspx",
  },
  "ERSS-112": { label: "Emergency Response Support System", url: "https://112.gov.in/" },
  "product-safety-rule": { label: "Product safety rule: never guess a final category" },
};
