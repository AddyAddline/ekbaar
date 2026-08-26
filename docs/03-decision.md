# Decision: rebuild the cybercrime journey around the incident

Decided 26 August 2026. Revised 27 August after three grill rounds settled with both teammates' agreement, the competitor case audit, and verification of the official digital-arrest record. This file controls the build.

## The result we are optimizing for

Win Build What Moves India.

Round one is a fast relative judgement across roughly 5,000 submissions. The reviewer must understand our difference within eight seconds and see it work within one minute.

The sentence we want the reviewer to repeat is:

> Every other cybercrime entry helps after the money is gone. This one interrupts the scam while it is happening, then stays with the case until it is finished.

## The change in mental model

The current journey begins with the government's taxonomy. The citizen must know which service, category, and form applies.

Our journey begins with the incident. The citizen explains what happened once. The system builds a verified case file, recommends immediate actions, prepares the official report, and interprets later updates.

The form becomes one output of the case. Filing is one event in the process, not the finish line. And when the system detects active coercion, it recognizes that the form is temporarily the wrong priority.

| Current model | Reworked model |
|---|---|
| Pick a category | Describe what happened |
| Form first, always | Emergency interruption when the scam is still live |
| Fill a form | Build a verified case file |
| Repeat the story to each service | One record produces recipient-specific packets |
| Receive a status label | Understand the official event and next action |
| Submission ends the journey | The case remains active until closure |

## The settled product decisions

These were settled in grill rounds 1 to 3 on 26 and 27 August. Both teammates agreed. Do not reopen them without both.

1. **Positioning.** An independent prototype of how NCRP's citizen experience should work. Not a separate consumer startup, not another intermediary citizens must discover.
2. **Promise.** A complete case and the next verified action. Never "solve your cybercrime" and never a recovery promise.
3. **Default user.** Self-reporting. "Is this for you or someone else?" appears once at the start; helper mode is an option, not the product identity.
4. **Interface.** A conversation beside a case workspace that visibly changes as facts arrive. Not a full-screen chatbot, not a conventional form with autofill.
5. **Breadth.** Accept any story. Show the likely official route for anything. Fully continue only for the demonstrated financial-fraud case, with an explicit "this prototype prepares financial-fraud cases only" boundary.
6. **Guide.** A small, calm guide that points to changes in the case. It disappears during the emergency interruption. If it becomes decorative, cut it.
7. **AI dependence.** Real model extraction and explanation, with a tested deterministic fallback so the judging path never depends on network or model availability.
8. **Honesty.** The demo case is synthetic and labeled synthetic. We audited the live portal and built the case from the official process and documented scam patterns. We never present it as something that happened to us or our family.

## The golden case: an active digital-arrest scam

The competitor audit (26 August) found the generic UPI and fake-KYC lanes already occupied by verified public builds: Sahaay, Jan-Sahayak NCRP 2.0, CyberSahay, Cyber First Response, CyberSaarthi. They collectively cover simulated freezes, officer consoles, evidence extraction, report generation, and trackers. None owns the active digital-arrest journey.

The synthetic case:

> Meera is on a WhatsApp video call with people claiming to be police. They say a parcel linked to her Aadhaar contains drugs. She has already transferred ₹1.2 lakh to a "verification account." They demand another payment and order her not to contact anyone.

The product's first move after her opening message is the question no form asks:

> Are you still on the call?

When she says yes, the intake stops. The emergency screen says, in sourced language: this matches a documented digital-arrest scam pattern. End the call. Do not send more money. No government agency conducts investigations via phone or video calls. It offers three actions: call 1930, notify the bank, tell a trusted person. Wording boundary lives in `docs/research/facts.md`, digital-arrest section. Claim nothing beyond it.

UPI remains one transaction method inside the case. It is not the idea.

## What one case record produces

The same confirmed facts generate recipient-specific packets, not three unrelated forms:

- a bank packet with the transaction details and fraud reference;
- a 1930 call card with the short incident summary read aloud in one breath;
- an NCRP packet with the full narrative, evidence, suspect details, and transaction data mapped to the checklist in `product/rule-matrix.md`.

This is the concrete form of "tell it once," and it demonstrates process redesign rather than form redesign.

## The demo arc

Six beats, one uninterrupted mobile-width journey:

1. Meera types or speaks what is happening. The case workspace starts filling beside the conversation.
2. "Are you still on the call?" Yes. The intake interrupts. The emergency screen appears. One red action: end the call. The guide disappears.
3. Danger passed, the case resumes. She uploads a synthetic UPI receipt and a synthetic WhatsApp screenshot. The system extracts amount, date, UTR, number, and message sequence as candidate facts. She confirms each one.
4. Review: the confirmed facts map to the NCRP fields. She sees the three recipient packets. Filing is simulated and labeled simulated on screen.
5. A visible "Later" transition inside the product, not a video cut.
6. A synthetic official message arrives: an amount was put on hold, contact the named police station. The tracker shows the original text unchanged, explains that a hold is not a refund, and shows the next action.

The emotional tone is calm authority. One red stop action during the emergency, restrained motion everywhere else. Digital arrest already creates panic; the interface lowers cognitive load.

## The honesty position, settled

There is no personal victim story and we do not invent one. The problem is anchored in:

- our live NCRP portal audit (26 August): self-classification before anything else, no urgency messaging on the homepage, no public tracking API;
- the official record: I4C blocked more than 1,700 Skype IDs and 59,000 WhatsApp accounts used for digital arrest; CFCFRMS has saved over ₹11,158 crore across 32.80 lakh complaints;
- documented scam patterns from MHA and PIB releases.

Say "we audited the process and built this synthetic case from documented failure patterns." Never say it happened to us. The limitations screen names every mock.

## What the AI does

The model may:

- transcribe and translate the story;
- extract candidate facts from text and images;
- rank likely reporting routes;
- ask for missing NCRP fields;
- draft the complaint narrative;
- explain an official message in plain language.

Rules, not free-form generation, control the emergency interruption, urgent routes, required fields, allowed file types, warnings, and the distinction between an acknowledgement and an FIR. The rule matrix in `product/rule-matrix.md` is the authority, and the digital-arrest interruption is a deterministic rule with a PIB source.

The user confirms every fact and generated statement. The product does not decide whether a crime occurred. It does not promise recovery.

## Case tracking rules

Keep official events separate from our workflow state.

An official event stores the original message, source, date, reference number, and any amount or authority named in the message. Never rewrite the stored event.

Our workflow can use these states:

- urgent action required;
- collecting evidence;
- ready to file;
- filed and acknowledged;
- official update received;
- citizen action required;
- awaiting authority;
- escalation available;
- closed or withdrawn.

Do not claim that funds were recovered because an amount was put on hold. Do not claim that an FIR exists because NCRP issued an acknowledgement number. Do not invent a police assignment, hearing, deadline, or visit.

## Cuts

Do not build or mention these items in round one:

- proactive telephone calls;
- police-visit rescheduling;
- a generic RBI liability countdown;
- real NCRP submission;
- automatic portal monitoring;
- more than one fraud journey;
- deepfake, harassment, sextortion, or non-financial flows;
- an admin panel;
- a roadmap screen;
- broad claims about recovery rates;
- a playful mascot animation system;
- red alarms, countdowns, or sirens during the emergency screen.

Voice remains only if it works without weakening the recorded demo or the public link. Text is the reliable fallback. The guide remains only if the product still works when the user dismisses it.

## Proof required before recording

The team must have these artifacts:

- one NCRP burden audit with fields, screens, uploads, and tracking checkpoints counted;
- two synthetic evidence files that the product parses correctly;
- one synthetic official status message with a fact-versus-inference explanation;
- one non-builder completing the journey without coaching;
- one limitations screen that names every mock;
- one public URL tested on a phone and a slow connection;
- one genuine Codex trace tied to code or rules that appear in the demo (the case schema and rule matrix were produced by Codex from the NCRP citizen manual and current checklist on 26 August).

If an artifact is missing, cut the claim that depends on it.

## Timing

- **27 August.** Build the full synthetic journey. Cut scope until the whole journey works. Test on a phone. Run one non-builder test. Deploy.
- **28 August, morning.** Record the video and write the summary. Test every submitted link in a signed-out browser.
- **28 August, 18:00 IST.** Submit. The official form closes at 20:00 IST.

The generic video guidance remains in `docs/02-playbook.md`. The submission-specific script and scorecard live in `docs/04-winning-submission.md`.
