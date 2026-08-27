# The submission that gets selected

This document directs the round-one video, public link, and summary. It works backward from the decision a reviewer must make after two minutes. Revised 27 August for the digital-arrest golden case.

## Hold one idea in the reviewer's mind

The reviewer should finish with this belief:

> Every other cybercrime entry helps after the money is gone. This one interrupts the scam while it is happening, then stays with the case until it is finished.

Every shot must support that belief. Cut any shot that does not.

## Win the first eight seconds

Do not show a logo or a presenter.

Show the phone mid-conversation. Meera has just typed what is happening. The product asks:

> Are you still on the call?

She taps yes. The screen changes to the emergency interruption: one red action, "End the call now," and the sourced line "No government agency conducts investigations via phone or video calls."

Put this sentence over the sequence:

> The scam was still happening. The form could wait.

This contrast must work with the sound muted. A reviewer scrubbing 300 submissions has never seen a government-services entry tell the user to stop filling the form.

## Record the two-minute video

### 0:00 to 0:08

The interruption moment, cold. No team, no title card.

### 0:08 to 0:18

Name the problem honestly. Structure:

> Digital-arrest scams keep victims on a video call while the money moves. I4C has blocked over 59,000 WhatsApp accounts used for them. Every reporting tool we found starts working after the loss. We rebuilt the journey to start during it.

Only numbers from `docs/research/facts.md` may appear.

### 0:18 to 1:00

Open on the Cyber Satark portal home for two seconds — the reviewer must register "they rebuilt the whole portal" — then one uninterrupted mobile-width demo of the six beats in `docs/03-decision.md`:

1. Meera describes what is happening; the case workspace fills beside the conversation.
2. "Are you still on the call?" Yes. Emergency interruption. One red action.
3. Danger passed, intake resumes. Upload the two synthetic evidence files. Confirm each extracted fact.
4. Review the case. Show the three recipient packets: bank, 1930 card, NCRP complaint. Simulated filing, labeled on screen.
5. The "Later" transition inside the product.
6. The official message arrives. Original text preserved. "A hold is not a refund." Next action shown.

Keep the pointer still unless the user acts. No decorative cursor movement.

### 1:00 to 1:10

Hold the before-and-after comparison. The reviewer must read it without pausing.

| Today | Reworked process |
|---|---|
| Pick a category before help | "Are you still on the call?" |
| Story repeated to each service | One confirmed case record |
| Three separate reports to prepare | Bank, 1930, and NCRP packets from the same facts |
| Acknowledgement confused with FIR | Official events kept separate |
| "Amount put on hold" | "Not a refund. Here is the next step." |

### 1:10 to 1:24

Six seconds on the learning corner: answer one simulator beat and let the sourced "Tell #1" card appear — the line is "the rules that protect you are the rules that teach you." Then cut to the rest of the portal shell (track, suspect check, case-aware escalation) as three fast beats, two seconds each.

Then show the limitations screen. Read it without apologizing:

> This case is synthetic; we built it from the official process and documented scam patterns, not from a personal incident. NCRP filing and status sync are simulated because there is no public citizen sandbox or tracking API. The model suggests facts and routes; the citizen confirms every statement. Police and courts decide whether an offence occurred. We do not promise recovery.

### 1:24 to 1:44

Show one architecture frame with these boxes:

1. multimodal intake;
2. deterministic rule layer (emergency interruption, routing, NCRP field rules) with the model outside it;
3. fact extraction with evidence references and confirmation;
4. one case record;
5. recipient packets and the official handoff boundary;
6. append-only official events and next actions.

Use arrows to show that the same confirmed case record supplies the emergency actions, the packets, and the tracker. Do not show an admin dashboard.

### 1:44 to 1:54

Show the genuine Codex contribution as an artifact, not a chat transcript:

> Codex read the NCRP citizen manual and the current complaint checklist and turned them into the validation matrix and case schema this build runs on. Every rule carries its source and check date. The digital-arrest interruption is a deterministic rule sourced to an MHA release, not a model decision.

Only say this while `product/rule-matrix.md` and `product/case-schema.json` carry those source tables.

### 1:54 to 2:00

Return to the tracker. End on the next action, not the team or a thank-you slide.

One line:

> Tell it once. Know what to do next.

## Make the public link reliable

The landing page must render the product promise and the first action within two seconds. No account.

Two entry points:

- **See the guided case** loads the synthetic digital-arrest case.
- **Start a blank case** accepts user input but warns against real sensitive data.

The guided demo is the judging path. It must not depend on live AI, telephony, a government endpoint, or a cold server process. If a model call fails, the verified synthetic extraction loads so the judge can finish the journey.

Place **Independent hackathon prototype, not a government service** in the interface footer. No emblem, no implied endorsement.

## Score the build before submission

Score each criterion from zero to three. Do not submit below 15 out of 18.

| Criterion | Three-point evidence |
|---|---|
| Problem | Sourced digital-arrest numbers and the live portal audit appear in the video. |
| Working build | The public link completes the same uninterrupted journey shown in the video. |
| Usability | A non-builder completes the mobile journey without coaching. |
| Product thinking | The interruption, uncertainty display, evidence references, human confirmation, and deliberate cuts are visible. |
| End-to-end thinking | The case record, rule layer, recipient packets, official handoff, and event tracker appear in one architecture frame. |
| Honesty | Every simulation, the synthetic case, data sources, and model boundaries appear on one screen. |

Treat a missing artifact as zero. Do not award points for intent.

## Reject these presentation choices

- Do not introduce the stack before the citizen succeeds.
- Do not call the product an AI lawyer, crime detector, or government assistant.
- Do not say that the product files a real complaint.
- Do not call a hold a recovery.
- Do not claim the case happened to us or our family.
- Do not compare against a weak caricature of NCRP.
- Do not show five languages to prove multilingual support.
- Do not use a phone-call gimmick as the final moment.
- Do not show a roadmap.
- Do not end with "Thank you."

## Draft the summary only after recording

Write the summary from what the video proves. Keep it under 250 words.

Use this order:

1. the documented problem and its scale, sourced;
2. the one decision that defines us: the product interrupts an active scam before it prepares the complaint;
3. the completed citizen journey through filing and tracking;
4. the recipient packets as the "tell it once" proof;
5. the technical path into the existing government process;
6. the exact mocks and limitations, including the synthetic case;
7. the concrete Codex contribution.

Do not claim a number, integration, test result, or user outcome that the repository cannot prove.
