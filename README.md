# Cyber Satark · साइबर सतर्क

**The cyber crime portal, rebuilt around the citizen.** An independent prototype for the Build What Moves India hackathon — not a government service, not affiliated with MHA or I4C. All data synthetic.

**Live:** https://cyber-satark.vercel.app · **Video:** [`media/cyber-satark-demo.mp4`](media/cyber-satark-demo.mp4)

## The idea

Digital-arrest scams keep victims on a video call while their money moves. Every reporting tool starts working after the loss. This one starts during it: describe what's happening — typed or spoken, Hindi, Marathi, English, switched mid-sentence — and if the story matches the documented digital-arrest pattern *while the call is live*, the intake interrupts itself and speaks the official advisory aloud in your language. The form can wait; the scam can't.

After that, reporting is a conversation, not a checklist. Every fact the AI extracts waits for your confirmation; one confirmed case record produces the bank report, the 1930 call card, and the NCRP-mapped complaint. The learning corner runs the same rules in reverse — a scam-call simulator that teaches the tells. Track translates officialese (a hold is not a refund). Contact & Escalate knows your case.

## What is real, exactly

The complete list ships in the product at [/limitations](https://cyber-satark.vercel.app/limitations). The short version: the demo case is synthetic and labeled; NCRP filing and status updates are simulated (there is no public citizen API, and the rules forbid touching the live portal); AI suggests, deterministic sourced rules route, the citizen confirms; no recovery promises, ever.

## How it's built

- **Codex** read the NCRP citizen manual and the live complaint checklist and produced [`product/rule-matrix.md`](product/rule-matrix.md) and [`product/case-schema.json`](product/case-schema.json) — the validation rules this app runs on, each carrying its source and check date.
- **Deterministic rules first** (`web/lib/rules.ts`): the emergency interruption, 112, and financial-fraud routing fire before any model, in English and Devanagari.
- **An OpenAI GPT model** (via OpenRouter) runs the live intake: understands any language, extracts candidate facts, asks the next question. It never routes.
- **Gemini** is the ears and voice: speech-to-text for the mic, text-to-speech for replies, the emergency screen, and the simulator's caller. Voice is optional by design; typing always works.
- Styled with MeitY's **UX4G** design-token grammar and GIGW-style bilingual chrome.

Research provenance lives in [`docs/research/facts.md`](docs/research/facts.md) (every public claim with a URL) and [`docs/research/ncrp-audit.md`](docs/research/ncrp-audit.md) (the section-by-section read-only walk of the real portal).

## Run it

```bash
cd web
npm install
cp .env.example .env.local   # add keys, or run without — the sample case works fully offline from AI
npm run dev
```

## Team

Advit, solo, with AI doing the field work. Strategy, build history, and every decision are in this repo's commits and `docs/` — kept honest on purpose.
