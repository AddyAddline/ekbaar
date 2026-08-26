# Sourced fact sheet

Rule: nothing goes in the video, summary or on stage unless it appears here with a URL.
`(soft)` = credible secondary reporting of a primary document we have not read.
`(inference)` = our reasoning, not a sourced claim.

## Why "AI chatbot over the portal" is the trap

- **GOV.UK Chat** — the most serious government chatbot in the world. Published Algorithmic Transparency Record: Claude Sonnet 4 on AWS Bedrock, ~700,000 chunks / 36.9 GB in OpenSearch, source content pre-filtered to strip likely-personal-data doc types, system prompt instructing the model to ignore its own training data, regex that **rejects** any query containing a phone number/email/card number, output guardrails, LLM-as-judge groundedness metrics, adversarial red-teaming with the AI Security Institute, 12-month audit retention — and it still concedes it cannot guarantee no successful jailbreak. Beta was capped at **2,000 users for 4 weeks**. <https://www.gov.uk/algorithmic-transparency-records/dsit-gov-dot-uk-chat>
- Public launch 2026-05-14. Justification was **call-centre deflection against a measured baseline**: government call centres take **100,000 calls/day**, and research suggested up to half were answerable from GOV.UK's 80,000+ pages. <https://www.gov.uk/government/news/millions-to-get-faster-easier-access-to-government-support-with-new-ai-tool>
- The live product still warns users it can hallucinate and to double-check answers. <https://www.gov.uk/guidance/about-govuk-chat>
- **Code for America / GetCalFresh** cut a SNAP benefits application from **~110 minutes to ~12** — with **no chatbot**. Fewer questions, plain language, mobile-first. Their Feb 2026 work-requirements screener is deliberately **deterministic rules, not AI**. <https://codeforamerica.org/news/> · <https://codeforamerica.org/news/a-human-centered-snap-work-requirements-screener/>
  - The wins were linguistic: "chronically homeless" → "Do not have a regular place to sleep or shower".
- **Stanford RegLab** on commercial legal-AI built specifically on retrieval: hallucination >**17%** (Lexis+ AI, Ask Practical Law AI), >**34%** (Westlaw AI-Assisted Research). Counts *misgrounded* answers too — law stated correctly but the cited source does not support it. **RAG + citations does not solve grounding; it relocates the error where users won't check.** <https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf>

## Rules-as-code precedent (the "don't put the model in the middle" argument)

**OpenFisca** is a decade-old, boring, mature movement almost no hackathon entry will name: France's mes-aides.org and mesdroitssociaux.gouv.fr, the French Parliament's LexImpact, Barcelona's Les meves ajudes, New Zealand's Rapu Ture, plus a Japanese version. <https://openfisca.org/en/showcase/> · **PolicyEngine** is open source with a public API (US/UK) <https://policyengine.org/us>

Human-in-the-loop precedent: UK's **Consult** analysed 50,000+ consultation responses in ~2 hours "matching human accuracy", claimed 75,000 person-days/yr saved. Note the shape — **AI does triage and volume, humans keep the decision.** Code open at <https://github.com/i-dot-ai> · <https://www.gov.uk/government/news/ground-breaking-use-of-ai-saves-taxpayers-money-and-delivers-greater-government-efficiency>

UK has **143** published algorithmic transparency records. Shipping one for our own prototype is cheap, unusual and very credible to officials. <https://www.gov.uk/algorithmic-transparency-records>

## India Stack — what is actually reachable by a hackathon team

| Rail | Sandbox reality |
|---|---|
| **Aadhaar Paperless Offline eKYC** | Citizen downloads a share-code-protected signed XML; verification needs **no licence**. Most defensible identity story for a prototype *(inference)* |
| Aadhaar auth / eKYC (online) | Needs AUA/KUA licensing via an ASA. **Not available to us.** Mock everything, synthetic Aadhaar-shaped IDs only |
| **DigiLocker** | **70+ crore users, 900+ crore documents** <https://www.digilocker.gov.in/>. Issuer/Requester onboarding is org-gated; `partners.digitallocker.gov.in` **no longer resolves**. Mock the API, keep the consent artefact real in shape |
| Account Aggregator / DEPA | **1,076 FIUs, 17 AAs** live; RBI designated Sahamati the SRO <https://sahamati.org.in/>. No free public sandbox found. Model the consent artefact — that's the interesting part |
| **Bhashini / ULCA** | Public APIs, but docs state usage **"for the purposes of PoC only"** <https://bhashini.gitbook.io/bhashini-apis> — quote that line in the submission, it *is* the honesty judges want |
| **AI4Bharat** | Open self-hostable Indic models (IndicTrans2, IndicWhisper, Airavata), 22 scheduled languages, IIT Madras <https://ai4bharat.iitm.ac.in/> — real offline fallback story |
| **AIKosh** | **15,040+ datasets, 338 models, 632 orgs** — best source of legitimate non-synthetic Indian data <https://aikosh.indiaai.gov.in/> |
| **GIGW 3.0** | Mandatory guidelines for Indian government sites/apps, manual refreshed July 2026 <https://guidelines.india.gov.in/>. **Officials know this document and almost no entry will cite it.** |
| eSign / UPI / NPCI | Licensed-entity only. Commercial aggregators (Setu et al.) have genuinely self-serve sandboxes <https://docs.setu.co/> — say plainly we used a sandbox, not live rails |
| CPGRAMS | **No published API.** Any grievance-status prototype must be fully synthetic <https://pgportal.gov.in/> |
| GST e-invoice | Real sandbox: `https://einv-apisandbox.nic.in` |
| ABDM / ABHA | `sandbox.abdm.gov.in` resolves but returned 503 on check |
| X-Road (Estonia, for contrast) | 52,000 orgs, 2.2bn transactions/yr, 3,000+ e-services — the "once-only" benchmark <https://e-estonia.com/solutions/interoperability-services/x-road/> |

## Codex — verified capabilities worth showing

Source: <https://learn.chatgpt.com/codex> (`developers.openai.com/codex` now 308-redirects here).
Surfaces: CLI, web, desktop, IDE extension, Remote mode, cloud environments, GitHub + Slack integrations, SDK, Skills, Plugins, Computer Use. Model ids visible in current docs: `gpt-5.6-sol`, `gpt-5.6-terra`.

- **`AGENTS.md` is the artifact to show, not the code.** Instruction chain from Codex home dir down to working dir, checking `AGENTS.override.md` then `AGENTS.md` at each level, concatenated root-first so **closer files win**, up to `project_doc_max_bytes` (32 KiB default). <https://learn.chatgpt.com/codex/agent-configuration/agents-md>
  - Putting governance rules in there ("never call a live government endpoint", "all eligibility logic lives in `rules/`, never in a prompt", "every extracted field carries a confidence score") turns policy into an executable constraint. 15-second shot, enormous signal.
- **`@codex review` / `@codex security review` / `@codex fix`** on GitHub PRs, honouring `AGENTS.md`. <https://learn.chatgpt.com/codex/third-party/github> — Codex as the *adversary that audited us*, not the intern that typed for us.
- **`codex exec`** non-interactive for CI. <https://learn.chatgpt.com/codex/cli> — wire a check that fails the build if a rules-engine file changes without a test.
- Cloud env: state cached up to 12h; **internet access off by default during the agent phase**, traffic via HTTP(S) proxy; secrets available only to setup scripts and **removed before the agent phase starts**. <https://learn.chatgpt.com/codex/environments/cloud-environment> → the checkable claim: *"the agent never had network access to anything resembling a government system, by construction."*

> Minute 2 should not be "Codex wrote this." It should be **"here is the rule I wrote once, and here is Codex enforcing it on me 40 times."**

## Indian public-service pain — sourced numbers

### The under-served cluster: after the state says no, and after someone dies

- **Deaths:** 89.38 lakh registered in 2024, each triggering 6–12 institutional journeys. <https://www.thehindu.com/sci-tech/health/latest-crs-data-shows-improving-civil-registration-of-births-and-deaths-and-better-sex-ratio-at-birth/article71170783.ece>
- **Unclaimed money** — the receipt for the failure:
  - ₹86,917 cr in RBI's DEAF (unclaimed bank deposits), Finance Ministry to Parliament 2026 <https://www.business-standard.com/finance/news/86-917-cr-in-unclaimed-deposits-with-rbi-fund-finmin-tells-parliament-126081101859_1.html>
  - ₹20,062 cr unclaimed with life insurers, end-FY24 <https://www.business-standard.com/amp/finance/personal-finance/over-rs-20k-cr-of-unclaimed-amounts-lie-with-life-insurers-at-end-of-fy24-124122300989_1.html>
  - ₹9,330 cr in inoperative EPF accounts, 31-Mar-2026 <https://www.businesstoday.in/personal-finance/news/story/rs-9330-crore-unclaimed-how-to-claim-money-from-inoperative-epf-accounts-544143-2026-07-21>
  - ₹3,811 cr unclaimed in mutual funds <https://www.business-standard.com/markets/mutual-fund/explained-3-811-cr-unclaimed-in-mfs-here-s-how-to-check-and-claim-money-126082000256_1.html>
  - Root cause: **72.48% of 13.6 crore single-holder demat accounts have no nominee** <https://mas360.moneylife.in/article/sebi-report-flags-alarming-lack-of-nominations-in-demat-accounts/4525.html>
- **RBI direction, 2025-09-26:** 15-day settlement, no succession certificate required up to ₹15 lakh where there is no nominee. **Citizens don't know this rule exists, and neither do many branch staff.** That gap is a product problem. <https://www.indialawoffices.com/legal-articles/settlement-of-claims-in-respect-of-deceased-account-holders-rbi-guidelines-2025>

### EPFO — the rejection you learn about after 20 days
- **8.31 crore claims settled FY2025-26**; ~29 crore subscribers <https://www.tribuneindia.com/news/business/record-8-31-crore-claims-settled-by-epfo-in-2025-26-mandaviya/amp/>
- **26% of 623 lakh claims rejected in 2023-24** (~160 lakh) <https://factly.in/epfo-claim-rejection-rate-at-26-in-2023-24/>
- Final-settlement rejection rose **13% (2017-18) → 34% (2022-23)** <https://trak.in/stories/final-epf-claims-rejection-rises-to-34-from-13/>
- **17.54 lakh EPFiGMS + 2.33 lakh CPGRAMS grievances in 2025** (Lok Sabha Q.2680, 2026-03-09) <https://www.govtstaff.com/2026/03/issues-faced-in-pension-claims-government-to-improve-speed-and-claim-settlement-through-epfo-servers.html>
- **Labour Ministry was the #1 grievance filer across all central ministries in 2025**; EPFO = 29.3% of its complaints <https://www.business-standard.com/industry/news/labour-ministry-sees-highest-filing-of-grievances-in-2025-shows-data-126011800515_1.html>
- Root cause: name/DOB/date-of-exit mismatch across UAN, Aadhaar and employer records — surfaced to the citizen as an opaque one-line rejection. **Data plumbing, presented as the citizen's fault.**

### EPS-95 pension
- **~72% of higher-pension applications rejected** (11,01,582 of ~15.24 lakh); Chennai/Puducherry rejected **87.5%** (63,026 of 72,040) <https://www.businesstoday.in/personal-finance/news/story/epfo-higher-pension-applications-processed-high-rejection-rates-chennai-puducherry-486420-2025-07-25>
- **47.04 lakh EPS-95 pensioners get under ₹9,000/month** (MoS Karandlaje, Lok Sabha 2026-02-10) <https://upstox.com/news/personal-finance/latest-updates/47-lakh-eps-95-pensioners-epfo-get-less-than-9-000-monthly-govt-data/article-189208/>

### IRCTC — the evidence *against* building the booking flow
- **3.39 crore passengers could not travel in FY2025-26** because waitlisted tickets never confirmed; **2.19 crore PNRs auto-cancelled**; sleeper class alone 1.68 crore (RTI reply to Chandra Shekhar Gaur, 2026-05-12) <https://dailypioneer.com/news/indias-rail-waitlist-crisis-over-3-crore-passengers-missed-train-travel-in-20252026>
- Tatkal: **29% of respondents have never once succeeded; 73% say seats vanish within the first minute** (LocalCircles, 55,000+ responses, 396 districts) <https://www.localcircles.com/a/press/page/tatkal-booking-survey>
- **60 billion bot requests blocked Jul–Dec 2025.**
- → Root cause is **seat scarcity and a scripted 10-second auction**. No prototype increases supply. A prettier booking screen is the shallowest possible answer to "is this problem real and important?" **Crowdedness: extreme.**

### Other candidates (see docs/research/landscape.md for full detail)
- **MGNREGA:** 63% of payments delayed beyond the mandated 7 days, 42% beyond 15 (soft); total statutory delay compensation actually paid = **₹1.74 crore** across FY25–26 against a >60% delay rate <https://www.business-standard.com/economy/news/mgnrega-workers-delay-compensation-rural-development-ministry-states-126080300499_1.html>; 27.4% of workers (~6.7 cr) were ineligible for ABPS when it became mandatory <https://theprint.in/india/around-27-of-total-mgnregs-workers-still-ineligible-for-abps-says-report/2633207/>
- **RERA:** 4.12 lakh stressed units worth ₹4.08 lakh cr, 60% already sold = **₹1.9 lakh cr of homebuyer money** (Amitabh Kant Committee) <https://www.gktoday.in/report-on-stalled-real-estate-projects/>; **>75% of state RERAs never published or stopped publishing annual reports; seven states never published one** <https://dailypioneer.com/news/regulate-not-merely-adjudicate>
- **Consumer commissions:** 5.15 lakh cases pending, **average disposal 647 days**, 90 of 775 districts have no forum, 32% of district president posts vacant <https://www.moneylife.in/article/90-districts-without-a-consumer-forum-35-percentage-cases-pending-over-3-years-india-justice-report-2026/79985.html>; Supreme Court flagged a "quality crisis" Aug 2026 <https://www.livelaw.in/top-stories/quality-crisis-in-consumer-commissions-supreme-court-flags-arrears-seeks-ncdrc-president-report-545622>
- **Insurance repudiation:** 52,575 Ombudsman complaints FY23-24, 12,855 dismissed as non-entertainable <https://cioins.co.in/annualreports/AnnualReport2023-2024.pdf>; health claim rejections up **19.10%** in FY24 <https://www.business-standard.com/amp/finance/personal-finance/health-insurance-claims-rejection-up-19-10-in-fy24-irdai-report-124122700754_1.html>
- **Income tax:** 5.02 lakh appeals pending at CIT(A) with **₹14.18 lakh cr** of disputed tax locked up <https://factly.in/data-as-of-march-2022-nearly-5-02-lakh-cases-remained-unresolved-at-commissioner-of-income-tax-appeals-amounting-to-%E2%82%B914-18-lakh-crores/>; refunds fell 18.82% YoY, **24.64 lakh ITRs pending past 90 days** <https://www.caalley.com/news-updates/indian-news/income-tax-refund-delay-as-refunds-fall-19-in-fy25-26-minister-reveals-reasons-in-parliament>
- **PM-JAY (CAG Report No. 11 of 2023):** 7,49,820 beneficiaries registered against the single mobile number 9999999999; ₹6.97 cr paid on 3,903 claims for patients already recorded dead <https://cag.gov.in/uploads/download_audit_report/2023/Report-No.-11-of-2023_PA-on-PMJAY_English-PDF-A-064d22bab2b83b5.38721048.pdf>

## Traps — good-looking picks that are bad
- **IRCTC Tatkal** — crowded to death; root cause is supply, not UI.
- **NSP scholarships** — frozen over a ₹144 cr fraud (830 of 1,572 sampled institutions fake, CBI FIR). A better form is irrelevant to why money isn't moving. <https://www.thenewsminute.com/news/cbi-registers-fir-rs-14433-crore-minority-scholarship-scam-181698>
- **Aadhaar/PDS biometric exclusion** — most severe pain on the list; the fix is policy. A slick demo over documented starvation deaths reads as exploitative.
- **Traffic challan disputes** — under-built and appealing, but there is **no verifiable national number** for erroneous challans. You will be asked and won't have it.
- **eCourts e-filing** — the Supreme Court's e-Committee owns this turf and the room will know it.
- **Agentic form-filling on a live government portal** — impersonating a citizen in an authenticated session, ToS breach, CAPTCHA evasion, no audit trail. Violates the hackathon's own rules and reads as reckless.

---

## How submissions actually get judged

> Provenance note: our judging-psychology agent initially fabricated several citations, then self-audited and retracted them. **Only the verified survivors are recorded here.** Retracted and not to be used: DocSend "3:44", Ladders "7.4 seconds", MadHacks 114/33, Gallo et al. figures as originally stated, Graves/Barnett/Clarke "29%", and the "disfluency improves reasoning" literature (failed replications). Wistia engagement data is vendor marketing with no published methodology.

### Triage is brutal and shallow
- **MLH's own judging plan**: "4 mins per project. 2 minutes for presentation + demo, 1 minute for questions from judges and score compilations, and 1 minute for judge travel." Formula `J = ⌈(P·n·t)/T⌉`, 3 rounds per project recommended; their table scales to **80 judges for 1200 attendees in 45 min**. <https://guide.mlh.com/general-information/judging-and-submissions/judging-plan.md>
- **HackMIT**: "the average judge looked at only 5% of the projects." <https://www.anishathalye.com/2015/03/07/designing-a-better-judging-system/>
- **Paul Graham on YC applications**: "If we get 1000 applications and have 10 days to read them, we have to read about 100 a day" … "After spending 20 seconds or so trying to understand the idea, I skip down to look at the founders."
- **Simonsohn & Gino 2013**, *Psychological Science*, "Daily Horizons": >9,000 MBA interviews, narrow bracketing confirmed — reviewers unconsciously ration high scores within a session. **Being reviewed after a run of strong entries costs you.** We cannot control this; we can only be unmissable.
- **Anchoring is one of the most replicable effects in psychology** — Many Labs 1 (N=6,344), all four anchoring items d ≈ 1.27–2.60, while priming failed at d ≈ 0.01. → the first number stated frames every later judgement.
- Thin-slice judgement is real but **cite it honestly**: pooled r = .59 (Ambady & Rosenthal 1993, but n=13 per sample — wide intervals), meta-analytic r = .39 (1992), r = .43 (Borkenau et al. 2004, *JPSP*, N=600).

### The single most actionable finding: the visual channel carries the verdict
**Tsay 2013**, *PNAS* — 7 experiments, 1,164 participants, **6-second clips** of music competitions. Task: pick the real winner (chance = 33%).
| Condition | Novices | Professional musicians |
|---|---|---|
| **Silent video** | **52.5%** | **46.6%** |
| Sound only | 25.5% (below chance) | 20.5% |

Audiovisual was **not** significantly better than video alone. <https://doi.org/10.1073/pnas.1221454110>

> **Design rule: the video must deliver its verdict with the sound off.** Narration is not the carrier. Every claim that matters must be *visible* — on-screen numbers, the side-by-side, the working journey. Assume a reviewer scrubbing muted through 300 submissions.

### Peak-end has real RCT support
**Redelmeier, Katz & Kahneman 2003**, *Pain*, **682 patients**: appending a painless interval cut remembered unpleasantness (4.4 vs 4.9, p=0.006) and **raised return rates for repeat procedure (OR = 1.41, p = 0.038)**. → Engineer the final 8 seconds deliberately. End on the citizen's success state, never a thank-you slide.

### Honesty is empirically safe — and concealment is not
- **John, Barasz & Norton** — there is a measurable *concealment penalty*: being caught withholding costs more than the disclosed flaw would have.
- **Buell, Porter & Norton** — **showing unresolved backlogs did not diminish trust.** Direct operational licence to show the ugly queue, the pending state, the thing that isn't done.
- **Ein-Gar, Shiv & Tormala** — the blemishing effect works only under specific moderators (low effort / peripheral processing, and the negative must be minor and come *after* the positives). → Dose rule: **three bounded disclosures, placed after the demo, never on the core claim.**
- **Gompers et al.** (885 VCs) — team primacy in investor decisions.

### Live-stage findings
- **Bruine de Bruin 2006**: despite randomised order, later performers scored better in both rounds. Corroborated by practitioner advice: *"Don't go first. Going first in most any presentation sucks. Judges have no idea what to expect… Try to go second or third."* — HN 3218012
- Same source, two more: *"The judges and people in the audience are going to want to try your demo out. Give them a working URL that shows off the functionality you promise."* and *"List your challenges."*
- **Rejection trigger we'd have missed**: *"Avoid talking about Version 2… When you show a slide with your Version 2 roadmap on it you look disingenuous."* → **No roadmap slide. No "what's next."**
- **Premature closure** is the dominant error mode in expert rapid judgement — Graber et al. 2005, *Arch Intern Med*, 100 diagnostic errors incl. 33 deaths: "premature closure… was the single most common cause." → The first 8 seconds don't just create an impression, they close the reviewer's inquiry.
- The *"Pitchathon"* critique is real and widely felt among engineers: "If you are evaluating a project in 2 minutes, you aren't evaluating anything except a team's ability to pitch." — HN 4901503. Judges know this about themselves; a submission that is *verifiably* working defuses it.

### Our live link is part of the judgement
**Krishnan & Sitaraman**: abandonment begins past **2 s** of startup delay, **+5.8% per additional second**. → The live link must be fast and must land on something legible in under two seconds. A cold-start serverless spin-up is a scoring event.

### We will be checked for cheating
**MLH's Cheating Check** is a published, real procedure — it flags "Is a solo hacker making a really advanced project in a single weekend?" and inspects **demo-video timestamps**. <https://guide.mlh.com> → Our Codex trace, commit history and `AGENTS.md` diff history are not just the "how we built it" story; they are the *alibi*. Keep the git history honest and public.

---

## The cyber-fraud "golden hour": it does not exist as a documented rule

Checked against primary sources. **Do not claim a documented golden hour. A judge who checks will find nothing behind it.**

- PIB's October 2025 backgrounder "Curbing Cyber Frauds in Digital India" was downloaded and the full text grepped. The string "golden" **does not appear**. MHA and I4C language is consistently *"immediate reporting of financial frauds and to stop siphoning off funds by the fraudsters"*. No hours, no deadline. <https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/oct/doc2025108660701.pdf>
- Same "immediate reporting" phrasing across ~15 PIB releases and Parliament answers. CFCFRMS launched 2021 under I4C; 1930 (formerly 155260) is the intake channel. **Never a stated window.**
- "Golden hour" *does* appear on state police pages without a duration, e.g. Malkajgiri Police Commissionerate, Telangana: *"Prompt action during the golden hour can help stop fraudulent transactions, freeze bank accounts, and prevent further loss."* <https://malkajgiripolice.telangana.gov.in/know-your-police-station/dcp-cybercrime.html>
- Media definitions conflict: India Today (Jan 2024) says "the first 24 hours"; The420.in (Apr 2021) quotes Mumbai Police on a post-transaction window with >90% recovery. Law-firm blogs say "the first few hours."

> ⚠️ **Tooling warning.** WebFetch's summarizer *asserted* that the PIB PDF discussed "Golden Hour" as a critical timeframe. It does not. That was a hallucination, caught only by extracting the PDF text and grepping it. **Grep the primary document before citing anything from a fetched summary.**

### RBI liability depends on fault and reporting time

**RBI/2017-18/15, DBR.No.Leg.BC.78/09.07.005/2017-18, 6 July 2017** <https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040>

The circular grants zero liability when the bank caused the unauthorized transaction. It also grants zero liability for a third-party breach, where neither the bank nor the customer caused the breach, if the customer reports within three working days of the bank's communication.

For a qualifying third-party breach, the time bands are:

| Reporting delay | Customer liability |
|---|---|
| Within 3 working days | Zero |
| 4 to 7 working days | Transaction amount or the applicable account cap, whichever is lower |
| More than 7 working days | The bank's board-approved policy |

If customer negligence caused the loss, such as sharing payment credentials, the customer bears the loss until notifying the bank. The bank bears qualifying losses after notification. The circular requires a shadow credit within 10 working days for zero-liability or limited-liability cases and resolution within 90 days. Do not turn these conditional rules into a universal countdown.

### Cyber fraud scale (sourced)
- CFCFRMS lifetime through 30 June 2026: **over ₹11,158 crore saved across more than 32.80 lakh complaints**. The same MHA release says the January 2026 SOP covers complaint processing, bank coordination, grievance redressal, lien removal, and restoration of funds. <https://www.pib.gov.in/PressReleasePage.aspx?PRID=2290377&lang=2&reg=48>
- The older verified figure was **over ₹5,489 crore saved across over 17.82 lakh complaints** (PIB PRID 2158408). Use the June 2026 figure in the submission.
- Trend: ₹3,431 crore saved across 9.94 lakh complaints (PIB, 18 Dec 2024); earlier, ₹2,400 crore across 7.6 lakh complaints
- Cybersecurity incidents: **10.29 lakh (2022) → 22.68 lakh (2024)** (PIB PRID 2153524)
- 9.42 lakh SIM cards and 2,63,348 IMEIs blocked for cyber-fraud links
- **Recovery rate: could not be sourced.** Rupees saved is published; total rupees lost over the same period is not. A "₹6,256 crore lost / ₹1,748 crore frozen / 27.84%" set came only from the hallucinating summarizer. **Unverified, do not use.**
- The PDF's own line "cyber frauds amounting to ₹36.45 lakh reported on the NCRP as of 28 February 2025" is **garbled in the source**; it is almost certainly 36.45 lakh *complaints*, not rupees. Do not quote as a rupee figure.

### What cybercrime.gov.in makes a victim do today
Verified by fetching the homepage read-only, nothing submitted.
- Three top-level buttons force **self-classification before anything else**: Women/Children Related Crime (with anonymous vs track options), FINANCIAL FRAUD, OTHER CYBER CRIME.
- **No urgency messaging anywhere on the homepage.** No countdown, no "report within X". A `1930.png` image is present with no explanatory text.
- Then mobile plus OTP, then a sub-category pick (UPI / Internet Banking / Card / Wallet / E-Commerce / Other). *Sub-category list from a secondary guide, not verified against the live portal.*

### What official case tracking does and does not prove

- NCRP says complaints go to the selected State or UT police authority. Report-and-Track users can check status on the portal and receive the complaint reference through SMS or email. <https://www.cybercrime.gov.in/Webform/FAQ.aspx>
- The public status check requires an acknowledgement number, OTP, and CAPTCHA. No public citizen tracking API or sandbox was found during the 26 August audit. Describe automatic sync as an integration requirement, not as a working feature.
- The citizen manual distinguishes a complaint acknowledgement from an FIR number. Do not convert one into the other in product copy.
- The official materials do not publish a stable citizen-facing status ontology. Store the original official message, then keep our workflow state separate.
- "Amount put on hold" does not prove that money has been refunded or restored. Show the original text and explain the limit of what it establishes.

**The defensible framing** is not "the golden hour gives you N hours." Tell the citizen to notify the bank and 1930 immediately because prompt reporting may help stop the movement of funds. Explain RBI liability only after the system has established the relevant fault and reporting conditions.

### Digital arrest: the official record (verified 27 August)

The demo's golden case is an active digital-arrest scam, so every on-screen claim in the emergency interruption must come from this list.

- **PIB PRID 2068698, MHA, 27 Oct 2024** (Mann Ki Baat coverage). Fraudsters "pose as police, CBI, anti-narcotics or RBI officers and threaten unsuspecting citizens over a video call." The release states that "no government agency conducts investigations via phone or video calls" and tells citizens to report immediately through **1930** or **cybercrime.gov.in**. The PM's mantra in the release is "Ruko, Socho aur Action Lo" (stop, think, take action). <https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2068698&lang=2&reg=48>
- **PIB PRID 2082761, MHA, 10 Dec 2024** (Lok Sabha written reply, MoS Home Affairs Bandi Sanjay Kumar). I4C "proactively identify and blocked more than 1700 Skype IDs and 59,000 Whatsapp accounts used for Digital Arrest." Till 15.11.2024, more than 6.69 lakh SIM cards and 1,32,000 IMEIs blocked. International spoofed calls displaying Indian numbers are used in "fake digital arrests, FedEx scams, impersonation as government and police officials"; TSPs directed to block them. NCRB keeps **no separate statistics** on digital-arrest scams. <https://www.pib.gov.in/PressReleasePage.aspx?PRID=2082761>
- **PIB PRID 2077948, MHA, 27 Nov 2024** (parliament reply). Cyber Fraud Mitigation Centre (CFMC) at I4C seats banks, payment aggregators, TSPs and state police together "for immediate action and seamless cooperation." Suspect Registry launched 10.09.2024. A public "Report and Check Suspect" search runs on cybercrime.gov.in. <https://www.pib.gov.in/PressReleasePage.aspx?PRID=2077948&reg=3&lang=2>
- `(soft)` "Digital arrest has no provision in law." Widely reported as the substance of the I4C advisory (Business Standard, 4 Nov 2024 <https://www.business-standard.com/finance/personal-finance/explained-no-legal-basis-for-digital-arrests-anywhere-124110400462_1.html>), but the phrase does not appear in the three PIB releases we grepped. For on-screen copy use the verified line "no government agency conducts investigations via phone or video calls" and attribute the no-legal-basis point to reporting on the advisory, or drop it.

Emergency screen copy this supports: end the call. Do not transfer more money. Real police, CBI, customs and RBI do not investigate over video calls or demand payment. Call 1930. Report at cybercrime.gov.in. Nothing beyond that wording is sourced.

## Crowding: actual data, 24 August

63 unique repos created after 2026-08-10 across six GitHub query variants, READMEs hand-verified.

| Platform | Distinct projects | Note |
|---|---|---|
| **EPFO** | ~8 | most contested |
| **NCRP / cyber crime** | **7** | includes `Rok`, tagline *"stop the money before the paperwork starts"* |
| **Parivahan** | ~6 | |
| **IRCTC** | ~5 | far less than predicted |
| **CPGRAMS** | 2–3 | |
| **UMANG** | 2 | |
| **RTI** | 2 | |
| **Income Tax** | 1 | surprisingly low for such an obvious pick; treat as possible sampling noise |
| **GST** | **0** | |
| **MCA** | **0** | |
| Off the ten-platform list | ~18 | Passport Seva, NTA, NSP, courts, tenders, PM-KISAN, marriage registry, waste management, emergency response |

**Confidence: low on absolute numbers, moderate on relative ordering.** 63 repos against ~5,000 entrants is a 1.3% sample, self-selected toward people who publish early. A gap between "1 repo" and "5 repos" is within noise. **A count of exactly zero across 63 repos is a stronger signal than any ranking among the small numbers.**

Two channels were checked and produced almost nothing, reported rather than padded: YouTube comments on the rules video (116 comments, 25,429 views) gave 2 IRCTC mentions and 1 GST mention, so nobody announces picks there. Reddit, X, LinkedIn, Peerlist, dev.to and Hashnode returned only rules reposts.

> **Correction to an earlier inference in this project.** The previous session predicted IRCTC would take 25–40% of the field and that cyber crime was under-picked. The data contradicts both. IRCTC is mid-pack at ~5 and cyber crime is the second most contested lane at 7. Any strategy note relying on "cyber crime is under-picked" is void.

> **On whether the ten platforms are a closed set:** they are not a hard eligibility rule, and the website's brief does describe open categories ("travel, taxes, pensions, certificates, payments, grievances or any other public need"). But the slide of ten platforms was read directly off the rules video at 00:35 and is saved at `docs/research/10-platforms-slide.png`, and the off-list penalty is a verbatim quote. Both things are true: any portal is allowed, and off-list costs you.
