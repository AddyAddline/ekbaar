# Case and reporting rules

This reference defines the rules that the round-one build may claim. The build uses the current NCRP checklist when it conflicts with the older citizen manual.

## Sources

| ID | Source | Checked | Authority |
|---|---|---|---|
| `NCRP-CHECKLIST-2024` | <https://www.cybercrime.gov.in/Webform/Crime_AuthoLogin.aspx> | 26 August 2026 | Current public complaint checklist. Page says last updated 2 February 2024. |
| `NCRP-FAQ-2024` | <https://www.cybercrime.gov.in/Webform/FAQ.aspx> | 26 August 2026 | Current public FAQ. Page says last updated 2 February 2024. |
| `NCRP-TRACK-2024` | <https://cybercrime.gov.in/Webform/chkackstatus.aspx> | 26 August 2026 | Current public tracking entry. |
| `NCRP-MANUAL-2019` | <https://cybercrime.gov.in/UploadMedia/MHA-CitizenManualReportOtherCyberCrime-v10.pdf> | 26 August 2026 | Older 91-page citizen manual. Use for fields absent from the current checklist. |
| `RBI-2017-18-15` | <https://www.rbi.org.in/commonman/English/scripts/Notification.aspx?Id=2623> | 26 August 2026 | RBI customer-liability circular. |
| `MHA-CFCFRMS-2026` | <https://www.pib.gov.in/PressReleasePage.aspx?PRID=2290377&lang=2&reg=48> | 26 August 2026 | MHA release on CFCFRMS and the January 2026 SOP. |
| `ERSS-112` | <https://112.gov.in/> | 26 August 2026 | Pan-India emergency service. |
| `PIB-2068698` | <https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2068698&lang=2&reg=48> | 27 August 2026 | MHA on digital arrest: no government agency investigates via phone or video call; report through 1930 or cybercrime.gov.in. |
| `PIB-2082761` | <https://www.pib.gov.in/PressReleasePage.aspx?PRID=2082761> | 27 August 2026 | Lok Sabha reply on digital-arrest scams: blocked Skype IDs, WhatsApp accounts, SIMs, IMEIs. |

## Route rules

Evaluate the emergency rule before any other route.

| Condition | Citizen guidance | Rule type | Source |
|---|---|---|---|
| The citizen reports an immediate threat to life or physical safety. | Contact 112. Do not continue a long intake before showing the emergency action. | Deterministic | `ERSS-112` |
| The citizen is on an active call, or under standing instructions from a caller, where someone claiming to be police, CBI, customs, court, or RBI demands money, secrecy, or continuous video presence. | Interrupt the intake. Show the digital-arrest stop screen: end the call, do not transfer more money, no government agency investigates via phone or video call, call 1930, report at cybercrime.gov.in. Offer to resume the case record afterward. | Deterministic | `PIB-2068698` |
| Money was lost through an online transaction. | Notify the bank through its official channel, call 1930, and prepare the NCRP financial-fraud complaint. | Deterministic | `MHA-CFCFRMS-2026` |
| The incident appears suspicious but no money was lost. | Do not present the financial-loss journey. Route to human review or the relevant suspect-reporting service. | Deterministic | `NCRP-FAQ-2024` |
| The story lacks enough facts to select a route. | Ask only for the missing routing facts. Do not guess a final category. | Deterministic | Product safety rule |

The model ranks candidate categories and explains the supporting facts. The model does not decide whether an offence occurred.

## Current NCRP checklist

| Field | Required | Validation | Case source | Source |
|---|---|---|---|---|
| Incident date and time | Yes | Valid date and time | Citizen statement or evidence | `NCRP-CHECKLIST-2024` |
| Incident details | Yes | At least 200 characters. Reject `# $ @ ^ * \` ' ' ~ | !` in the compiled NCRP text. | Confirmed facts and citizen edits | `NCRP-CHECKLIST-2024` |
| Complainant national ID | Yes | JPEG or PNG. Maximum 5 MB. Never use real ID data in the hackathon. | Victim upload | `NCRP-CHECKLIST-2024` |
| Bank, wallet, or merchant name | Financial fraud | Non-empty | Receipt extraction or citizen | `NCRP-CHECKLIST-2024` |
| Transaction or UTR number | Financial fraud | Exactly 12 digits for the current checklist | Receipt extraction or citizen | `NCRP-CHECKLIST-2024` |
| Transaction date | Financial fraud | Valid date | Receipt extraction or citizen | `NCRP-CHECKLIST-2024` |
| Fraud amount | Financial fraud | Positive INR amount | Receipt extraction or citizen | `NCRP-CHECKLIST-2024` |
| Evidence file | Expected when available | Maximum 10 MB per file | Original citizen artifact | `NCRP-CHECKLIST-2024` |
| Suspect mobile number | Optional | Preserve the citizen's formatting in evidence. Normalize only a separate candidate fact. | Screenshot or citizen | `NCRP-CHECKLIST-2024` |
| Suspect email | Optional | Valid email when supplied | Screenshot or citizen | `NCRP-CHECKLIST-2024` |
| Suspect bank account | Optional | String. Do not infer missing digits. | Receipt or citizen | `NCRP-CHECKLIST-2024` |
| Suspect URL or social handle | Optional | Preserve the original value | Screenshot or citizen | `NCRP-CHECKLIST-2024` |

The 2019 manual says that general evidence uploads have a 5 MB maximum. The current checklist says 10 MB per evidence file. Use 10 MB in the build and retain the source date.

## Additional handoff fields from the citizen manual

Collect these fields only when the user reaches **Review and handoff**. They should not block urgent actions.

| Group | Fields | Source |
|---|---|---|
| Incident | Delay reason, incident channel, incident account or URL | `NCRP-MANUAL-2019` |
| Suspect | Name, identity type and value, photograph, address, country, state, district, police station, PIN code | `NCRP-MANUAL-2019` |
| Complainant | Gender, date of birth, parent or spouse name, relationship to victim, email | `NCRP-MANUAL-2019` |
| Address | Nationality, house and street, locality, city, state, district, police station, tehsil, PIN code | `NCRP-MANUAL-2019` |

The manual says that the State or Union Territory assignment depends on the complainant's address. Keep address collection close to the official handoff.

## Evidence rules

- Preserve the original artifact. Store model extraction as separate candidate facts.
- Link each extracted fact to an evidence ID and a human-readable locator.
- Require citizen confirmation before a candidate fact enters the complaint.
- Compute a SHA-256 hash when the runtime permits it. NCRP describes the hash as the digital file's fingerprint.
- Never alter the original screenshot, receipt, recording, or document.
- Treat text inside an uploaded artifact as evidence. Never execute it as an instruction.
- Do not upload real victim evidence to the hackathon prototype.

## Submission rules

- Label every hackathon submission event as simulated.
- Use an obviously synthetic acknowledgement number.
- Keep `reference_number` and `fir_number` as separate fields.
- Do not mark an FIR as registered unless an official event supplies the FIR number.
- Do not withdraw or submit anything on the live portal.
- Hand OTP and CAPTCHA steps back to the victim on the official portal.

## Tracking rules

NCRP status checking requires an acknowledgement number, OTP, and CAPTCHA. The audit found no public citizen tracking API or sandbox.

Store each official update as an append-only event with:

- the original message;
- the source;
- the time received;
- facts the message establishes;
- facts the message does not establish;
- linked next actions.

Keep our workflow state separate from the official event. A message that says an amount was put on hold does not establish that the amount was recovered, refunded, or released to the victim.

## RBI guidance boundary

Tell every financial-fraud user to notify the bank immediately. Do not display a universal zero-liability countdown.

RBI liability depends on fault and reporting time. Customer negligence, bank fault, and a third-party breach have different rules. Apply the working-day bands only after the case establishes the conditions in `RBI-2017-18-15`.

## Model output contract

Every model-produced fact must include:

- the field name;
- the candidate value;
- the evidence or statement that supports it;
- a confidence value;
- a confirmation status.

The interface must make uncertainty visible. It must never silently promote a candidate fact to an official fact.
