# NCRP walked section by section, 27 August 2026

Read-only browser walk of cybercrime.gov.in, screenshots taken at every step. Nothing was submitted, no login attempted. This file is the before/after map for the demo and video: each row is a real screen we saw, what it demands from the citizen, and the Cyber Satark answer.

## What the real portal offers, and in what medium

| Section | What is actually there | Medium |
|---|---|---|
| Homepage | Politician banner carousel, three crime-category tiles with scary stock photos (Women/Children, Financial Fraud, Other), "What's new" box | Images, links |
| Register a Complaint | Interstitial: "Learn about cyber crime" vs "File a complaint," warning that accurate details are "imperative." Then citizen login: mobile + OTP + CAPTCHA, beside a "CHECK LIST FOR COMPLAINANT" | Forms |
| The checklist (verbatim demands) | Incident date/time; details **minimum 200 characters** with special characters banned (`# $ @ ^ * ` " ~ | !`); national ID soft copy ≤5 MB jpeg/png; for financial fraud: bank name, **12-digit transaction/UTR**, date, amount; evidence ≤10 MB each; optional suspect details | Homework before help |
| Track your Complaint | Acknowledgement number + OTP + CAPTCHA, returns a status label | Form |
| Report & Check Suspect | Radio buttons to pick identifier type (Mobile/Email/Bank/Social/UPI), "Do not add +91" warning in red, CAPTCHA, disclaimer that the database is incomplete | Form |
| Learning Corner | FAQ (static Q&A with legal sections), Citizen Manual (a document about how to use the portal), Cyber Safety Tips (static list), Cyber Awareness (PDF booklets: RBI's "Raju and 40 thieves" comic, Cyber Hygiene EN/HI, Financial/Job/Matrimonial fraud), Daily Digest (I4C PDF), Media Gallery (photos, videos, **radio jingles**), Training Resources | PDFs, galleries, audio jingles |
| Contact Us | "Report at 1930" note plus the State/UT Nodal & Grievance Officer table with emails written as [at]/[dot]; the page itself says to contact them "if the response has not been appropriate" | Static table |

## The AI-native map: how people work today → what we do instead

1. **Classify me?** Three scary tiles ask the victim to diagnose their own crime. → Tell the story once; deterministic rules classify, the model only extracts.
2. **A manual before mercy.** Citizen Manual + checklist demand 200 sanitized characters, a 12-digit UTR and a ≤5 MB ID while the victim is panicking. → The narrative is drafted from confirmed facts and validated against those exact rules; the UTR comes off the receipt; the system asks only for what is missing.
3. **The urgent case has no lane.** Nothing on the homepage interrupts for a scam in progress. → "Are you still on the call?" comes before any field.
4. **Status without meaning.** OTP + CAPTCHA to see a status label. → One reference; updates verbatim plus establishes / does-not / next.
5. **Suspect search with sharp edges.** Identifier radio buttons, +91 warnings, CAPTCHA. → One box, any identifier, normalized.
6. **Learning = reading.** PDFs and radio jingles. → Take the scam call in a sandbox; the rules that protect are the rules that teach.
7. **Their audio is a jingle; ours is a conversation.** The portal's only audio medium is one-way radio jingles. → The portal itself listens and speaks — Hindi, Marathi, English — including spoken emergency instructions.
8. **Contact = homework.** A 36-row officer table with obfuscated emails is the escalation path. → Case-aware escalation with a prepared draft.

## Video shot pairs (real screen left, ours right, works muted)

- Three scary tiles → "What happened? Tell it once."
- The 200-character/no-specials checklist → the auto-drafted, validated narrative.
- Track's OTP+CAPTCHA form → the explained update ("a hold is not a refund").
- The PDF learning corner → the simulator mid-call.
- The [at]/[dot] officer table → the prepared escalation draft.

Screenshots live in the session scratchpad (`ncrp/`); re-capture any time with the script there. When shown in the video, frame them as "the current journey" — factual comparison, no mockery, no implication of endorsement.
