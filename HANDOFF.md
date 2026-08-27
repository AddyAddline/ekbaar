# Handoff: Build What Moves India

Written 2026-08-24 by the session that did the research. Two audiences: the two humans on this team, and whatever coding agent picks the work up next. Read the whole thing before you build anything. It is short by design and the reasoning behind it lives in `docs/`.

> **Current decision, 27 August.** The team chose NCRP, and three grill rounds settled the product: the golden demo case is an active digital-arrest scam, the intake interrupts when coercion is live, one case record produces bank, 1930, and NCRP packets, and the demo continues through a later official update. The credibility gate is closed the honest way: the case is synthetic and labeled synthetic, anchored in the live portal audit and PIB-sourced numbers, never presented as personal. Read `docs/03-decision.md` before acting on the historical options in this file. Read `docs/04-winning-submission.md` before building or recording.

## The clock

Submissions close **28 August 2026 at 20:00 IST**. No grace period, restated twice on the site and once on camera. That is four days from when this was written.

Then it goes in two stages. Round one cuts roughly 5,000 entries to 250 between 28 August and 1 September. The 250 get a week of mentorship in a WhatsApp group with five mentors from engineering and the OpenAI team, then **resubmit on 7 September** in the same format. Top 10 announced between 8 and 12 September, and they present live in Bengaluru on 12 September to founders, creators, the mentors, and invited government officials.

The strategic consequence matters more than any build decision. **Round one is a filter, not the prize.** Build something that survives a fast skim by 28 August and deliberately leave the hard parts for mentorship week. He says so himself on camera: "we actually understand that the first submission you put in is going to be a little rough."

> **Updated 24 August.** Crowding data and the cyber-fraud research landed after the first draft of this document. Two conclusions changed. Read "known gaps" before you trust any crowding claim, and read the golden-hour entry in `docs/research/facts.md` before you build anything on the cyber crime portal.

## Read this if you are an agent

The user is Advit. He is entering with one partner. Both are generalist builders. Available time before the round one deadline is 15 to 25 hours total, because they have day jobs. Codex is available and both have used it.

The direction is chosen. Build the whole incident-to-resolution process for one active digital-arrest case, self-reported, with UPI as a transaction method inside it. Do not restore the old voice-concierge scope, the family-assisted UPI framing, or broaden the build to every cybercrime category.

## What is decided

1. **Team of two.** Both must register separately with their own email addresses, and each must enter the other's registered email on the submission form. Email is identity, no exceptions, and it must be the same email in both rounds.
2. **Round one posture is lean and unmissable, not maximum effort.** One journey, complete, narrow. Disproportionate share of the budget goes to the idea, the first eight seconds of the video, and the 250 word summary.
3. **No admin panel.** He said on camera they are not looking at it. The end-to-end thinking criterion gets satisfied in the video and the summary, not in built screens.
4. **A chatbot is allowed.** We initially thought it was a trap. It is not. He names it himself as a fine option. The risk is that it is the most crowded choice, not that it breaks a rule.
5. **Stay on the list of ten platforms.** Off-list is permitted but explicitly penalised.

## The incident question, resolved 27 August

The brief asks for a problem the team faced. Neither teammate has a personal cybercrime incident, and the team decided not to invent one. The submission says so plainly: the demo case is synthetic, built from the official process, the live portal audit, and documented scam patterns. Honesty is a scored criterion and this is the honest position. Do not reopen this, and do not let any script imply the case happened to the team.

## Ground truth, do not get this wrong

### The ten official platforms

IRCTC. Income Tax e-Filing. CPGRAMS. GST. EPFO. MCA. National Cyber Crime Reporting Portal. UMANG. Parivahan Sewa. RTI Online.

Read off the slide at 00:35 of his rules video. The slide image is saved at `docs/research/10-platforms-slide.png`. Off-list submissions are allowed, and in his words have "lower chances" because "if we've not had experience using that government platform, then we might not understand your solution as easily."

That one sentence rules out every exotic idea our problem research surfaced, including death and succession paperwork, MGNREGA wage delays, RERA order execution, and insurance claim repudiation. All off-list. Do not go back to them.

### The six judging criteria

Problem. Working build. Usability. Product thinking. End-to-end thinking, meaning backend and infrastructure and process rather than just interface. Honesty, meaning limitations and mock data disclosed.

Three of those six are narrative rather than code. Most of the field will score near zero on end-to-end thinking and honesty. That is the opening.

### What you submit

A live public browser link that opens without requesting access, with mock login credentials if login is needed. Reviewers will not download a mobile app. One video, two minutes maximum, first minute demoing as a citizen and second minute explaining how you built it and why. A summary under 250 words. Your partner's registered email.

### Hard rules

Codex must be meaningfully involved and the submission must explain how. Every feature you demo has to work. All data mocked or synthetic, no real Aadhaar or PAN or OTP or payment details. Do not touch, test, scrape or reverse engineer any live government system. Do not present it as official or use government logos in a way that implies endorsement. Label it an independent hackathon prototype. Disclose templates and open source with licences.

## The judge, in his own words

Everything here is verbatim from "Build What Moves India: Rules & How to Participate", youtube.com/watch?v=NjKwtdv9WPs. Full transcript saved at `docs/research/rules-video.vtt`.

On what matters most, and he says it twice:

> "Focus on ideas over code. Look, you can write code anything today. And I think today what public service websites in India need is new ideas."

> "After AI, the ideas have become more important than the implementation, and the ideas here are the most valuable thing."

On what a good idea looks like:

> "The more unique the idea, but still useful to the end consumer, the better it is. So you could make a platform that has all the bells and whistles, has crazy 3D content going on, but that might not actually be very valuable for the end consumers. So really think from the end consumers who are busy, they're frustrated with these platforms, they don't have too much time, and they want a solution quickly."

On the field size, which is the number that should set your expectations:

> "It's at minimum 5,000 people who've already applied, and only 10 get on stage. The likely outcome is that you won't get picked, but getting in the top 250 is not impossible."

On how it gets judged, which tells you it is relative and taste-driven rather than rubric-precise:

> "We are judging relative to the other submissions that are coming in. And we're going to take the top 250 ones that we like. And everyone will have their different tastes in the team."

On scope:

> "We're expecting a comprehensive proof of concept, which means you rebuild it entirely. Mock the data, the back end, and the accounts."

One more thing worth knowing about his taste, at medium confidence and worth verifying. He appears to be pro-wrapper rather than anti-wrapper, having publicly defended thin wrappers and described his own product as "a dumb simple wrapper over GPT". So do not apologise for building on OpenAI, and do not hedge about being a wrapper.

## What the research established

Full detail with source URLs in `docs/research/facts.md`. The load-bearing findings:

**The picture carries the verdict, not the narration.** Tsay 2013 in PNAS, seven experiments, 1,164 participants, six second clips. Viewers picked the real competition winner 52.5 percent of the time from silent video and 25.5 percent from sound only, which is below chance. Audiovisual was no better than video alone. Design the two minute video so it works muted, because a reviewer on submission 400 is scrubbing.

**A chatbot on a government portal is expensive to do properly.** GOV.UK Chat, the most serious example in the world, ships with 700,000 indexed chunks, red-teaming with the UK AI Security Institute, a regex that rejects any query containing a phone number, and a user-facing warning that it can hallucinate. Meanwhile Code for America cut a US benefits application from about 110 minutes to about 12 with no chatbot at all, just fewer questions and plainer language. And Stanford RegLab measured hallucination above 17 percent in commercial legal AI built specifically on retrieval, counting answers where the law was stated correctly but the citation did not support it. Retrieval plus citations does not fix grounding, it moves the error somewhere users will not check.

**The strongest architectural signal you can send is refusing to use a model somewhere.** Compute eligibility with a deterministic rules engine and use the LLM only to translate the question in and the reason out. Rules-as-code is a mature movement, OpenFisca runs live services for France, Barcelona and New Zealand, and almost nobody in this hackathon will name it.

**Honesty is empirically safe and concealment is not.** Being caught withholding costs more than the disclosed flaw. Showing unresolved backlogs did not reduce trust in the study that tested it. But dose and placement matter, so put one disclosure block after the demo rather than threading it through.

**You will be checked.** MLH's published cheating procedure inspects demo video timestamps and flags implausibly advanced solo builds. Keep the git history honest and public, because the Codex trace doubles as the alibi.

## What we ruled out, so you do not redo it

- Every off-list problem, for the judge familiarity reason above.
- The IRCTC booking form and Tatkal specifically. RTI data shows 3.39 crore passengers could not travel in FY2025-26 because waitlists never confirmed, and a 55,000 response survey found 29 percent have never once succeeded at Tatkal. But the root cause is seat scarcity and a ten second auction won by scripts. No prototype increases supply, and a prettier booking screen is the shallowest possible answer to "is this problem real and important".
- EPFO claim pre-flight rejection prediction. It was the strongest single idea our problem research produced. A public repo called `claim-ready` is already building exactly it, described as "know your PF claim will clear before you file it".
- Agentic form filling against a live portal. It breaks the hackathon rules, and impersonating a citizen in an authenticated session with no audit trail reads as reckless.
- Building an admin panel.
- The generic "all of government, one friendly front door" wrapper. Public repos named `janseva`, `Sahaayak` and similar suggest this is a common instinct rather than a distinctive one. The naming register everyone lands in is saarthi, sahaayak, sewa, jan-anything. Ours should not.

## Known gaps and where this research is weak

Be skeptical of these specific things.

1. **Crowding now has data, and it contradicted the earlier guess.** 63 public repos created after 10 August were classified by platform. Ranking, most to least contested: EPFO ~8, cyber crime 7, Parivahan ~6, IRCTC ~5, CPGRAMS 2 to 3, UMANG 2, RTI 2, Income Tax 1, **GST 0, MCA 0**. The earlier prediction that IRCTC would take 25 to 40 percent of the field and that cyber crime was under-picked was **wrong on both counts**. Confidence is low on the absolute numbers, a 1.3 percent self-selected sample, and moderate on the ordering. A gap between 1 and 5 is noise. A count of exactly zero across 63 repos is not. Full table in `docs/research/facts.md`.
2. **The intermediary thesis is unverified.** The claim that India runs on paid intermediaries and that the state institutionalised this through the Common Service Centre network is plausible and probably right, but the agent researching it died before confirming the CSC numbers, the fees citizens actually pay, the legal limits on acting for a citizen, or whether Haqdarshak already occupies this space. **Do not state a CSC count or a rupee figure on stage until someone sources it.**
3. **One research agent fabricated citations**, then caught itself and retracted. `docs/research/facts.md` records only the verified survivors, and names the retracted items so nobody reintroduces them. Treat that file as the allowlist. If a number is not in it with a URL, it does not go in the video or the summary.
4. **We never verified what happened to Jugalbandi, myScheme or UMANG adoption**, which matters if the direction chosen is anything intermediary-shaped.

## Do these next, in order

1. Close the authentic-incident gate in `docs/03-decision.md`.
2. Register both teammates with the emails they will use in both rounds.
3. Build the five-screen journey in `docs/03-decision.md` with synthetic data.
4. Test the journey on a phone and with one non-builder.
5. Follow the recording plan and scorecard in `docs/04-winning-submission.md`.

## Suggested skills, and what to do without them

Advit's session had these. Your partner's may not. If a skill is missing, the fallback is in brackets.

- `unslop` for anything written that a human reads, including the 250 word summary. This document was written under it. [Fallback: no em dashes, sentence case headings, no decorative emoji, active voice, cut adverbs, and delete any sentence that would read the same in another project's docs.]
- `mattpocock-skills:grilling` to stress-test the direction before building. We were mid-grill when this session ended. [Fallback: for each candidate, write down the strongest argument that it loses, then answer it.]
- `frontend-design` for the citizen-facing journey, since usability is a named criterion and design quality is visible in six muted seconds. [Fallback: build mobile-first at 390px, one action per screen, and test on a real cheap Android over mobile data.]
- `vercel:nextjs` and `vercel:deploy` if hosting on Vercel. He also explicitly offers ChatGPT Sites as a hosting option, which removes deployment work entirely. [Fallback: any host, but the link must open with no auth wall and load fast. Abandonment starts past two seconds of delay and rises about 5.8 percent per additional second, and a cold serverless start is a scoring event.]
- `dataviz` if the submission shows a before and after comparison as a chart. [Fallback: a plain two column table beats a bad chart.]

## Files in this repo

- `HANDOFF.md`, this file.
- `web/`, the product: **Cyber Satark**, a Next.js app rebuilding the whole NCRP citizen experience. Portal home, `/report` (the deep guided digital-arrest journey plus blank cases with deterministic triage and OpenAI-optional extraction), `/track`, `/suspect`, `/learn` (scam-call simulator), `/contact` (case-aware escalation), `/limitations`, and an unlinked `/architecture` frame for minute two of the video. `npm run dev` inside `web/`.
- `product/rule-matrix.md` and `product/case-schema.json`, the Codex-built validation matrix and schema the app's rules encode. `product/fixtures/demo-digital-arrest-case.json` is the guided case.
- `docs/05-summary-draft.md`, the 250-word summary skeleton to finalize after recording.
- `docs/00-brief.md`, the hackathon ground truth pulled from the site on 23 August, including all deadlines, rules and deliverables.
- `docs/01-judge-model.md`, everything from the rules video with timestamps, the ten platform list, the off-list penalty quote, and the tension between the website's end-to-end criterion and the video saying they do not look at the admin side.
- `docs/02-playbook.md`, the five day shape, the problem selection filter, the validation moves ranked by evidence per hour, the video shot list second by second, the 250 word template, the administrative burden vocabulary, and the anti-patterns.
- `docs/research/facts.md`, every sourced number with a URL. The allowlist for anything said publicly.
- `docs/research/10-platforms-slide.png`, the slide, as proof.
- `docs/research/rules-video.vtt`, the full transcript.

One last thing. He is explicit that the top 250 get a public honours page, and he pitches it as a hiring signal. Even the round one cut is worth having.
