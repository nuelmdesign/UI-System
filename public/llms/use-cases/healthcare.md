# Building Healthcare and patient care products with opendraft

> Clinical and patient-facing health products: EHR views, scheduling, telehealth and patient portals. Clinicians work under time pressure with safety-critical data; patients need calm, plain-language screens.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

healthcare, health, clinical, ehr, emr, patient, patient portal, telehealth, telemedicine, appointment, clinic, hospital, medication, prescription, lab results, care plan, pharmacy, triage.

## Principles for this domain

- Show patient identity on every clinical screen: full name, date of birth and an identifier in `font-mono`, pinned in a header that never scrolls away. Wrong-patient errors are the failure to design against.
- Always print units and reference ranges beside a measurement (`5.4 mmol/L, ref 3.9 to 5.6`), and never round or reformat a value without saying so. Do not rely on color alone to mark an abnormal or critical value; pair it with a text flag such as High, Low or Critical.
- Critical values and allergy warnings stay visible until a named user acknowledges them. Never auto-dismiss a clinical alert or put one in a toast; use a persistent `alert` and record who acknowledged it and when.
- Privacy by default: mask identifiers and sensitive fields until revealed, keep reveals logged, and avoid showing patient names in browser titles, notifications and URLs.
- Write patient-facing copy in plain language at a low reading level, explain medical terms in place, and say what happens next. Lead with the answer (`Your results are normal`), not the data.
- Confirm irreversible or high-risk actions (sign an order, discharge, cancel a procedure) in a `dialog` that names the patient and the consequence. Where regulation applies, keep an audit trail of who viewed or changed a record.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Patient banner and chart overview

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `page-header` plus `avatar` and `badge` for name, age and flags; `stat` tiles for latest vitals; `tabs` for Summary, Orders, Notes and Results; a persistent `alert` for allergies.
- Missing: No dedicated pinned patient-banner component; build it from page-header and badge and keep it sticky.

### Lab results and vitals with abnormal flags

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: `table` with a value, unit, range and a text-labelled `badge` per row; `stat` for the latest reading.
- Missing: No time-series chart for trends of a vital or lab value over time (with reference-range band) and no sparkline.

### Critical-value and safety alerts

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- How: `alert` is persistent and severity-aware; require acknowledgement with `approval-card` or a `dialog` and keep who and when. Do not use `sonner` for clinical alerts.

### Appointment booking and scheduling

- Fit: **Adapt**
- Use: [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- How: `stepper` for reason, clinician, time and confirm; `radio-group` for time slots; `order-confirmation` can confirm the booking if relabelled.
- Missing: No calendar or day/week schedule view and no slot-grid component; clinic staff schedules need a scheduler.

### Medication list and orders

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md)
- How: Active medications in a `table` with dose, route and frequency columns; sign orders with `approval-card`; `repeater-field` edits multi-line prescriptions.
- Missing: No drug-interaction or dose-check UI; this comes from your clinical decision support service and needs a custom alert.

### Telehealth visit

- Fit: **Gap**
- Use: [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Prompt Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/prompt-input.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Controls (mute, camera, leave) can be buttons and a waiting-room status can be a `badge`.
- Missing: No video call surface or device check; embed a video SDK and build the tile grid yourself.

### Patient intake forms and consent

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md)
- How: `stepper` splits a long form into short steps; `dropzone` accepts insurance card and ID photos.
- Missing: No signature pad for consent and no rich text editor for notes.

### Care plan and visit history

- Fit: **Ready**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `timeline` for encounters and events, `todo-list` for care-plan tasks, `progress` for goal tracking.

### Secure messaging with the care team

- Fit: **Adapt**
- Use: [Chat App](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/chat-app.md), [Message Bubble](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message-bubble.md), [Prompt Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/prompt-input.md), [Message Scroller](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message-scroller.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: The chat components give threads, bubbles and an input; show a clear note that messages are not for emergencies.
- Missing: No attachment preview, read receipts or clinician-routing; add them and keep the thread data on your own secure backend.

### Sign in with MFA and a proxy or caregiver

- Fit: **Ready**
- Use: [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md)
- How: `auth-screen` for sign in, `otp-input` for the verification code; caregiver access can sit in the `settings-page` team section relabelled.

## Libraries and services that pair well

- Clinical data exchange (patients, observations, medications): HL7 FHIR (SMART on FHIR), Epic FHIR APIs, Medplum. opendraft is presentation only; map FHIR resources to the props of `table`, `stat` and `timeline` in a thin adapter and keep PHI out of client logs.
- Telehealth video: Twilio Video, Daily, Zoom Video SDK. The SDK renders the video; use opendraft buttons, badges and `alert` for controls, waiting-room state and connection warnings around it.
- Vitals and lab trend charts: Recharts, visx, Apache ECharts. No time-series chart ships yet; style the chart with the `--blue-*` and semantic tokens and draw the reference range as a shaded band with a text legend.
- Scheduling and calendar: FullCalendar, react-big-calendar, Cal.com. Use for clinician schedules; keep opendraft `date-picker` and `radio-group` for the patient-facing booking path.
- Consent signatures and identity verification: react-signature-canvas, DocuSign, Persona. No signature pad is included; capture the signature as an image and store it with a timestamp and the consent text version.

## Typical screens

- **Patient chart**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Results review**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Book an appointment**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Patient portal home**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Intake and consent**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-healthcare
```

## Known gaps

- Patient banner and chart overview: No dedicated pinned patient-banner component; build it from page-header and badge and keep it sticky.
- Lab results and vitals with abnormal flags: No time-series chart for trends of a vital or lab value over time (with reference-range band) and no sparkline.
- Appointment booking and scheduling: No calendar or day/week schedule view and no slot-grid component; clinic staff schedules need a scheduler.
- Medication list and orders: No drug-interaction or dose-check UI; this comes from your clinical decision support service and needs a custom alert.
- Telehealth visit: No video call surface or device check; embed a video SDK and build the tile grid yourself.
- Patient intake forms and consent: No signature pad for consent and no rich text editor for notes.
- Secure messaging with the care team: No attachment preview, read receipts or clinician-routing; add them and keep the thread data on your own secure backend.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
