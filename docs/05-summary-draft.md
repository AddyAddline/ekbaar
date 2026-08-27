# Summary draft

The video is made (`media/cyber-satark-demo.mp4`, 1:59). Check every number against `docs/research/facts.md`. Target under 250 words. Bracketed items need the final values.

---

Digital-arrest scams hold victims on a video call while their money moves. I4C has blocked over 1,700 Skype IDs and 59,000 WhatsApp accounts used for them. Yet every reporting tool starts after the loss: cybercrime.gov.in asks the citizen to pick a category before anyone helps, and the bank, the 1930 helpline, and the portal each hear the story separately.

Cyber Satark rebuilds the portal around the incident, styled on MeitY's own UX4G design tokens. The citizen speaks or types — Hindi, Marathi, English — and a GPT-5.6 intake (OpenRouter) extracts facts and asks only for what's missing, while Gemini gives the portal ears and a voice. Deterministic rules sourced to MHA documents run before the model on every turn: if the story matches the digital-arrest pattern while the call is live, the intake interrupts itself — end the call, no government agency investigates over video calls — spoken aloud in the citizen's language. Every fact waits for citizen confirmation; one confirmed record becomes the bank report, the 1930 call card, and the NCRP-mapped complaint. The learning corner runs the same rules in reverse: a scam-call simulator whose caller speaks, teaching the three sourced tells. Suspect check, verbatim-plus-meaning tracking, and case-aware escalation complete the portal.

The story then becomes a case file. An OpenAI model extracts candidate facts from the account and evidence; the citizen confirms each one; deterministic rules built by Codex from the NCRP citizen manual and the current complaint checklist control routing and validation. One confirmed record produces a bank report, a 1930 call card, and an NCRP-mapped complaint. After filing, official updates stay verbatim in an append-only record, with what each establishes, what it does not (a hold is not a refund), and the next action.

The demo case is synthetic and labeled so. NCRP filing and status sync are simulated; there is no public citizen API. Live link: https://cyber-satark.vercel.app. Repo: https://github.com/AddyAddline/ekbaar.

---

Word count the final text before pasting into the form. Do not add claims the video does not show.
