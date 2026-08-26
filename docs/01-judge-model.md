# The judge model — from Varun Mayya's own mouth

Source: **"Build What Moves India: Rules & How to Participate"**, youtube.com/watch?v=NjKwtdv9WPs (Varun Mayya channel). Transcript pulled 2026-08-23 via `yt-dlp`; platform list read off the on-screen slide at **00:35**. This video is more specific than the website and states things the written brief does not.

## THE 10 OFFICIAL PLATFORMS (slide, "STEP ONE — WHAT TO BUILD / 10 OFFICIAL PLATFORMS TO PICK FROM")

| # | Platform | Full name |
|---|---|---|
| 1 | **IRCTC** | Indian Railway Catering and Tourism Corporation |
| 2 | **Income Tax** | e-Filing Portal |
| 3 | **CPGRAMS** | Centralised Public Grievance Redress and Monitoring System |
| 4 | **GST** | Goods and Services Tax |
| 5 | **EPFO** | Employees' Provident Fund Organisation |
| 6 | **MCA** | Ministry of Corporate Affairs Portal |
| 7 | **National Cyber Crime** | Reporting Portal |
| 8 | **UMANG** | Unified Mobile Application for New-age Governance |
| 9 | **Parivahan Sewa** | — |
| 10 | **RTI** | Right to Information Online |

### The off-list penalty — verbatim, 00:29
> "You can pick one of the 10 public service platforms on the screen. Now, if there is a specific government website you're really frustrated with that's outside of this, and you submit that, that's also okay, but **your chances are a little bit lower** because if the team here who's evaluating these projects, **if we've not had experience using that government platform, then we might not understand your solution as easily** as the rest. We're used to the rest. We know how they work, which is why I recommend working with these 10. But remember, if you make something exceptional, we'll see."

**→ Judge familiarity is an explicit scoring factor.** This is not in the written brief. It kills every off-list idea our landscape research surfaced (death/succession, MGNREGA, RERA, insurance repudiation, PM-JAY) and puts IRCTC back on the table.

## Field size — verbatim
> "we already have over 5,000 entries, and we genuinely didn't expect that" (00:05)
> "it's at minimum 5,000 people who've already applied, and only 10 get on stage. **The likely outcome is that you won't get picked**, but getting in the top 250 is not impossible." (10:31)

**→ ~5,000+ entrants at video time, still growing. Top 250 ≈ 5%. Top 10 ≈ 0.2%.**

## THE THESIS OF THE JUDGE — ideas over code. He says it twice.
> "**Focus on ideas over code.** Look, you can write code anything today. And I think today what public service websites in India need is new ideas… The actual implementation really depends on how the public service website is implemented. We'll do that later if your projects are selected, but right now **put your energy into the interfaces, interactions, try to build something easier, something new**." (01:36)
> "**After AI, the ideas have become more important than the implementation, and the ideas here are the most valuable thing.**" (11:45)

> "**The more unique the idea, but still useful to the end consumer, the better it is.** So you could make a platform that has all the bells and whistles, has crazy 3D content going on, but that might not actually be very valuable for the end consumers. So really think from the end consumers who are busy, they're frustrated with these platforms, they don't have too much time, and they want a solution quickly." (02:09)

## He explicitly BLESSES the obvious moves — 02:03
> "If you want to add in a map, you want to add in a tax calculator, **you want to make a chatbot driven**, just build out your best ideas."

**→ Correction to our earlier position: a chatbot is NOT disqualifying. He named it himself.** The risk is not rule-breaking, it is *crowding* — with 5,000 entries and the judge naming chatbots as an example, conversational UI is the modal submission. Differentiate on the idea, not by avoiding the interface.

## What "comprehensive POC" means — 00:58
> "We're expecting a comprehensive proof of concept, which means **you rebuild it entirely. Mock the data, the back end, and the accounts.**" … "ChatGPT has something today called sites, so even hosting is kind of taken care of. **We're not expecting this to get crazy scale. This is just for us to use.**"

## Consumer side only — 01:19
> "Provide login credentials so we can actually get in and test it. **We only want to see it from the consumer side**, how end users like you and me will use it, and not from the admin side. **The grading here is going to be as a citizen using it. We assume you built the admin side well. We aren't really looking at it.**"

> ⚠️ **Tension with the written brief.** The site lists **"End-to-end thinking — does the solution address the backend, infrastructure and processes, not just the interface?"** as a judging criterion, but the video says they aren't looking at the admin side. Reconciliation: the *build* must be citizen-facing only; the *end-to-end thinking* belongs in **minute 2 of the video and the 250-word summary**, not in built admin screens. **Do not build an admin panel. Do explain the backend.**

## Judging is relative and taste-driven — 06:26
> "We are judging **relative to the other submissions** that are coming in. And we're going to take the top 250 ones that **we like. And everyone will have their different tastes in the team.**"
> "I might end up making mistakes, my team might end up making mistakes. There might be one or two good projects that we miss. Statistically, at the scale we're at, it's very likely."

## Who is judging
Varun's team ("this is run mostly by the VM content team, and we have a limited team") **plus the OpenAI India team**, Aug 28 – Sep 1. Mentors are "engineers for tens of years, people who worked at really really large companies, mentors from Tech Twitter, credible developers, and some people from the OpenAI team."

## His stated goal — 10:56
> "The goal is to **create real dialogue between the tech ecosystem in India, the content ecosystem in India, and government bodies.** And they're more open than ever. We have some soft confirmations already… You're giving the government clear POCs where they can look at something and decide whether that should be in the platform or not."
> On adoption: "these are **legacy code bases**. They may take time. They might have dialogue with you. They might get you involved part-time or full-time."

## Other operational facts from the video
- Email is identity, no exceptions, both rounds. Partner cross-entry is the anti-gaming check.
- Video can be "a Loom or an OBS or a self-recorded video."
- He says "give us **exactly** 250 words" (site says *under* 250 — obey the site, aim ~240).
- Top 250 get a **public honours page** he explicitly pitches as a hiring signal: "if any tech companies in India are looking to hire talent, you'll definitely be on that page."
- No grace period, at all, restated.
- **Codex is not mentioned as mandatory in this video** — only as the prize (Codex Pro / Codex Micro). The FAQ *is* explicit that it's mandatory. Treat the site as authoritative and satisfy it.

## Personal taste signal
Per research (medium confidence, verify before relying): **he is pro-wrapper, not anti-wrapper** — he has publicly defended thin wrappers ("As if React, Python or C++ aren't wrappers themselves… it's actually a surface level take") and called wrappers "a far more sustainable business model compared to the underlying models." His own God in a Box was, in his words, "a dumb simple wrapper over GPT."
**→ Do not apologise for building on OpenAI. Do not hedge about being "just a wrapper."**
No evidence found that he has publicly commented on jugaad, UPI, Aadhaar or DPI — do not assume a position.
