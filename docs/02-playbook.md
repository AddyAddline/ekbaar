# Execution playbook

Derived from research on how hackathon submissions get judged, plus the books on problem-finding and persuasion. Every rule here has a reason attached. If you disagree with the reason, break the rule.

## The five-day shape

Fixed time, variable scope. If a day runs over, cut scope, never extend the day.

**Day 1.** Choose the platform and the single journey. Run the candidate through the selection filter below. Do the validation moves. Write the scope down and freeze it.
**Day 2.** Build the happy path end to end, ugly, all mocked. The journey must complete by end of day. If it does not, cut the journey shorter rather than taking another day.
**Day 3.** Build the two things that actually score. First, the status and reassurance surface, because opacity is the real complaint in every government journey. Second, the low-bandwidth path.
**Day 4.** Two usability tests on people who are not builders. Fix the two places they hesitate. Write the limitations list. Deploy the live link and open it on a cheap Android over mobile data.
**Day 5.** Video, then the 250 words. Submit by 18:00 IST. Everyone submits in the last hour and forms get flaky.

## Problem selection filter

Two hard gates first. Fail either and discard the candidate regardless of how good it looks.

- **Gate A.** Someone on the team personally hit this failure and can produce a screenshot, a recording, or a receipt of their own attempt.
- **Gate B.** Two generalists can make the full journey complete with mocked data in under three build days.

Then score 0 to 3 on each. Below 26 out of 36, keep looking.

| Criterion | 0 | 3 |
|---|---|---|
| Forced usage, no alternative path | nice to have | legally mandatory |
| Volume of people in this exact flow | thousands | tens of millions |
| Acute struggling moment with a datable "right before" | vague annoyance | "rejected three days before the deadline" |
| Consequence of failure | mild delay | lost wages, lost admission, lost pension |
| Quantifiable burden you can state as fields, docs, days, trips | cannot measure | full before and after table |
| Anxiety load, fear of rejection or silence | none | dominant |
| Hits low-bandwidth users | affluent English speakers | the tunnelling user |
| Repeat or renewal flow | once ever | annual for forty years |
| Public evidence exists | none findable | dozens of complaints in an hour |
| A stranger understands the win in ten seconds | needs explaining | self-evident |
| A real backend hook exists | pure fantasy | live sandbox available |
| You can explain why the form is like this without insulting anyone | "they're lazy" | audit and legibility rationale |

The most common way a good build dies is scoring 3 on demoability and 0 on volume. A beautiful fix to a rare problem loses.

## Cheapest credible validation

Ranked by evidence per hour. Each produces an artifact the submission can use.

1. **Your own timed attempt, 60 to 90 minutes.** Do the real task on the real portal with a stopwatch and a screen recorder. Produces a twenty second before clip and a line like "seven attempts, two rejections, forty-one minutes." Cannot be argued with.
2. **A burden audit, 60 minutes.** Count on the live portal: screens, fields, mandatory documents, uploads, external lookups, error messages that do not say how to fix the error, calendar days to outcome. Produces a before and after table with identical rows. This one table serves four of the six judging criteria at once.
3. **Five WhatsApp voice notes, 90 minutes.** Past behaviour questions only. "Walk me through the last time you tried. What happened right before you gave up? Who did you call? What did you pay?" Never "would you use an app that". Produces three verbatim quotes with age, city and occupation.
4. **Interview one cyber cafe or CSC operator, 30 minutes.** They run this flow forty times a day and get paid for it. Ask what they charge and which field they get wrong most often. What they charge is the market price of the burden, which is the closest thing to hard evidence available in a day.
5. **Public complaint mining, 45 minutes.** Reddit, portal Twitter replies, Play Store reviews of the official app. Produces a screenshot grid of nine complaints about the same step.
6. **Two five-minute usability tests, 40 minutes.** Hand the prototype to a relative who does not build software. Record the screen. Do not help. One hesitation you acted on beats five compliments.

Skip surveys. A survey produces opinions about a hypothetical, which is the exact thing to throw away.

## The two minute video, second by second

The single most important research finding shaping this: Tsay 2013 in PNAS, seven experiments, 1,164 participants, six second clips. Novices picked the real competition winner 52.5 percent of the time from **silent video** and 25.5 percent from **sound only**, which is below chance. Audiovisual was no better than video alone. **The picture carries the verdict. Narration does not.** Assume a reviewer scrubbing muted through hundreds of submissions.

| Time | Shot | Why |
|---|---|---|
| 0:00 to 0:04 | Cold open on the real portal at the moment of failure. The red error, the session expired, the blank status page. One sentence of overlay text. No logo, no title card, no music sting. | The first frame decides which question the reviewer spends the next 115 seconds answering. Also, expert reviewers close their inquiry early. Graber 2005 found premature closure the single most common cause of diagnostic error. |
| 0:04 to 0:10 | The number, on screen as text, not just spoken. "14 fields. 3 documents. 22 days. 2 rejections." | Anchoring is one of the most replicable effects in psychology. Many Labs 1, N=6,344, all four anchoring items at d of 1.27 to 2.60. The first number frames every later judgement. |
| 0:10 to 0:18 | The named human. One line, one face or one photo of the real context. | An identified person moves people in a way a statistic does not. |
| 0:18 to 0:55 | One unbroken take, phone width viewport, real thumb, cold start to success, ending on the confirmation screen. Narrate only what a citizen sees. | This is the working build criterion. Every cut reads as a hidden failure. If you must compress, put "3x speed" on screen. |
| 0:55 to 1:05 | The peak. Hard side by side, both states on screen at once. Then the reassurance screen: "You are third in queue. Decision by 4 September. Track with this number." | Contrast creates the strongest single moment, and the status screen kills the anxiety that actually drives the complaint. |
| 1:05 to 1:20 | The disclosure list, on screen, read flat. What is mocked, what is real, what would break. | Covered below. |
| 1:20 to 1:45 | One architecture frame. Where data really comes from, what the department runs, what changes in the officer's queue, where the statutory clock starts. | End-to-end thinking is the criterion most of the field will fail. Twenty five seconds of infrastructure reality separates you from hundreds of prettier front ends. |
| 1:45 to 1:55 | The Codex trace, specific. "Codex read the department's own instruction PDF and generated the forty case validation matrix. I reviewed it and cut six wrong rules." | Satisfies the mandatory rule with something provable. |
| 1:55 to 2:00 | Last frame is the citizen's success state, still on screen, plus one sentence. Nothing else. | Peak-end has real trial evidence. Redelmeier, Katz and Kahneman 2003 in Pain, 682 patients: appending a better final interval cut remembered unpleasantness and raised return rates, odds ratio 1.41. A credits slide spends your most valuable five seconds on nothing. |

Two rules from a practitioner who has judged these, both of which we would otherwise have got wrong. Give judges a working URL that does what the video promises, because they will try it. And **no version two roadmap**. Quote: "When you show a slide with your Version 2 roadmap on it you look disingenuous."

## The 250 word summary

Aim for about 240. Each block targets one criterion.

- Problem, 25 words. On [portal], a [persona] trying to [task] must [the specific failure]. I hit this myself on [date] and [outcome].
- Problem quantified, 20 words. The current journey imposes [N] fields, [N] documents, [N] screens, [N] days. Learning, compliance and psychological costs, measured in an audit of the live portal.
- Problem scale, 25 words. This flow runs [N] times a year, disproportionately for [group], and failure costs [wages, admission, pension, a second trip].
- Working build, 35 words. [Name] completes the same journey in [N] steps and [N] minutes. The live link starts cold and finishes at a tracked receipt. Nothing inside the journey is stubbed.
- Usability, 25 words. Designed for a [low-end Android, 3G, non-English, low-literacy] user. [One specific decision], because a stressed applicant has no spare attention at exactly this moment.
- End to end, 30 words. The department receives the identical structured payload it receives today. Identity via [x], signature via [y], language via [z]. Officer-side change: [one thing]. Marginal cost: [rupees].
- Honesty, 35 words. Mocked: [list]. Real: [list]. Untested: [list]. It breaks at [condition]. Templates and open source used: [list plus licence].
- Product thinking, 20 words. I cut [feature] because [reason], and moved [step] after [step] after watching two users hesitate there.
- Rules, 15 words. Built with Codex: [one concrete thing Codex did].

## Vocabulary that makes this read like policy work

Use these precisely. Most of the field will not use any of them.

- **Administrative burden** (Herd and Moynihan). The citizen's experienced cost of dealing with the state, split into three costs. Name all three for your flow in one sentence.
- **Learning costs.** Working out that the thing exists, whether you qualify, and what the process is.
- **Compliance costs.** Paperwork, uploads, fees, travel, waiting. This is your fields and documents and trips count.
- **Psychological costs.** Stigma, fear of rejection, dread of the counter. Almost nobody will name this. Naming it is a differentiator, and it justifies the status tracker.
- **Take-up rate.** The share of eligible people who actually get the thing. Say "this is a take-up problem, not a UI problem."
- **Sludge** (Sunstein). Friction that is excessive or unjustified, as distinct from friction that does a job. This is the word that lets you keep the fraud check and delete the re-upload.
- **Sludge audit.** A documented count of the burdens in a process, in time, money and psychological cost. A real published technique, so naming it beats saying "I made a spreadsheet."
- **Gulf of evaluation** (Norman). The citizen submitted something and cannot tell what happened. Six weeks of nothing.
- **Legibility** (Scott). Why the form has fourteen fields. The state needs auditable standardised records. Use this to explain that you wrapped the process rather than replacing it.
- **Last mile failure** (Banerjee and Duflo). The scheme works. The final hundred metres of the form is where take-up dies.

## Honesty as a scoring weapon

Honesty is one of the six criteria, so treat it as a feature to build rather than a tone to adopt.

The evidence says this is safe. John, Barasz and Norton found a measurable penalty for being caught withholding, larger than the cost of the flaw itself. Buell, Porter and Norton found that showing unresolved backlogs did not reduce trust. But dose matters. Ein-Gar, Shiv and Tormala found the effect works only when the negative is minor and comes after the positives, so put the disclosure after the demo, not woven through it.

Reviewers looking at hundreds of prototypes have one recurring suspicion, that this is a pretty shell over fake data. Say it first and you remove the weapon. Wait and they find it themselves, and then they distrust your numbers too.

Sentences that work, close to verbatim:

- "You are going to assume this is a pretty shell over fake data. Here is exactly which parts are fake."
- "Three things are mocked. The claim status endpoint, because there is no public sandbox. The SMS gateway. The officer's approval queue, which is a JSON file. Everything the citizen touches is real code."
- "I tested with two users, not two hundred. Both finished unaided. That is enough to find a hesitation, not enough to claim a completion rate, so I am not claiming one."
- "The four minute figure is my own timed run on a 4G phone. The twenty two day figure is from my actual application receipt, not an average."
- "This breaks the moment two officers act on the same application. I have no locking, and a real deployment needs it."
- "I have not solved the hard part, which is the department's data entry contract and the consent artefact. I specified them. I did not build them."

One disclosure block, six to eight specific lines, flat delivery, placed at 1:05. Not an apology, and not at the end, because the end is your strongest real estate.

## Anti-patterns

- Do not ask anyone "would you use this". Hypotheticals and compliments are not data. Ask what they did last time and what it cost them.
- Do not pitch the mechanism. "An AI powered multilingual assistant for public services" is a mechanism. "Your PF money in your account this week" is the outcome.
- Do not redesign the whole portal. Breadth reads as having chosen no problem.
- Do not insult the bureaucracy. "Why is this so stupid" tells a room that contains people who know why the field exists that you do not.
- Do not open on your logo, your name, or your stack.
- Do not cut inside the demo take.
- Do not add a second feature. "Does the journey work" is binary. "Has more features" is not scored.
- Do not end on a thank you slide, and do not show a roadmap.
- Do not build an admin panel. He said on camera they are not looking at it.
- Do not scrape or touch a live government system. That converts an honesty win into a disqualification.
- Do not promise outcomes the department controls, like guaranteed approval. Someone in the room will know you cannot deliver it.
