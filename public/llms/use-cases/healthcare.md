# Building Healthcare and patient care products with opendraft

> Clinical and patient-facing health products: EHR views, scheduling, telehealth and patient portals. Clinicians work under time pressure with safety-critical data; patients need calm, plain-language screens.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

healthcare, health, clinical, ehr, emr, patient, patient portal, telehealth, telemedicine, appointment, clinic, hospital, medication, prescription, lab results, care plan, pharmacy, triage.

## Principles for this domain

- Show patient identity on every clinical screen: full name, date of birth and an identifier in `font-mono`, in a header that stays pinned (wrap it in your own `sticky top-0 bg-background` container; `page-header` is not sticky by itself). Wrong-patient errors are the failure to design against.
- Always print units and reference ranges beside a measurement (`5.4 mmol/L, ref 3.9 to 5.6`), and never round or reformat a value without saying so. Do not rely on color alone to mark an abnormal or critical value; pair it with a text flag such as High, Low or Critical.
- Critical values and allergy warnings stay visible until a named user acknowledges them. Never auto-dismiss a clinical alert or put one in a toast. Use a persistent `alert` (it only gets a close button if you pass `dismissible`, so don't) with an acknowledge `button` in `AlertAction`, and have your backend record who acknowledged it and when.
- Privacy by default: mask identifiers and sensitive fields until revealed, keep reveals logged, and avoid showing patient names in browser titles, notifications and URLs.
- Write patient-facing copy in plain language at a low reading level, explain medical terms in place, and say what happens next. Lead with the answer (`Your results are normal`), not the data.
- Confirm irreversible or high-risk actions (sign an order, discharge, cancel a procedure) in a `dialog` that names the patient and the consequence. Where your rules require it, keep an audit trail of who viewed or changed a record.
- opendraft is presentation only. It does not check doses, interactions or reference ranges and it makes no clinical-safety or privacy-law guarantee. Every value, flag and warning must come from your system of record, and you remain responsible for clinical validation.
- State the time zone wherever a time is shown or chosen (`date-picker` has an HH:MM field but no time-zone support), and show when a result was last updated.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Patient banner and chart overview

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: `page-header` (eyebrow, title, description, actions slots) with `avatar` and `badge` for name, age and flags; `stat` tiles for latest vitals (value string with units, `hint` for the reference range or time taken, `delta` with `goodWhen` for trend arrows that also announce the direction in text); `tabs` for Summary, Orders, Notes and Results; a persistent `alert` for allergies; `copy-button` for the identifier.
- Missing: No patient-banner component and `page-header` is not sticky: wrap the banner in your own sticky container so it never scrolls away.

### Lab results and vitals with abnormal flags

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md)
- How: `table` needs a fixed `rowHeight` and a `height` or `maxHeight`, is virtualized, sortable, and scrolls sideways on phones, so keep it to test, value with unit, range, flag and date. Render the value and a text-labelled `badge` (High, Low, Critical) in the `cell` renderer. `status-indicator` can pair a shape with a word if you override `label` and `tone` (its built-in words are system-health ones such as Operational). `stat` for the latest reading. `date-range-picker` filters the period. For a trend line, `insight-cards` also exports `InsightChart`, a small SVG line chart (several lines, optional fill and grid, hover tooltip).
- Missing: No real chart suite. `InsightChart` has no axes or tick labels, only one dashed threshold line (no shaded reference-range band), a pointer-only tooltip (not keyboard reachable) and a fixed plot height, so it is not a sparkline either. `analytics-dashboard` has a metric chart but its ranges are fixed at 7, 30 and 90 days. Always show the values in a `table` beside any chart; use a charting library for bands and axes.

### Critical-value and safety alerts

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md)
- How: `alert` is persistent by default and has info, success, warning and destructive variants, a `banner` mode and an `AlertAction` slot: put an Acknowledge `button` in it and call your backend with the user and time. Use `dialog` when the acknowledgement needs a reason. `approval-card` can also gate an action but its resolved badge always reads Approved or Rejected (it cannot say Acknowledged), so prefer `alert` plus `button`. Do not use `sonner` for clinical alerts.

### Appointment booking and scheduling

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md)
- How: `stepper` (steps accept a `description`, e.g. the chosen clinician and time) for reason, clinician, time and confirm. `date-picker` picks a day: use `min`, `max` and `isDateDisabled` to grey out days with no availability. Time slots are a `radio-group` you style yourself. For the confirmation, `order-confirmation` works if you relabel it (`labels.steps`, `title`, `tickets`, `ticketsHeading`, `admitOne`) and put the visit details in the `fields` of one ticket whose `code` is an opaque booking reference for check-in; you need the `onAddToCalendar` callback.
- Missing: No calendar, week view or slot grid, and `date-picker` has no time-zone support (its optional HH:MM field is a plain local time, so print the zone in text). `order-confirmation` is ticket-shaped: it always prints the email sentence, a Total in money format (a free visit shows 0.00), an order summary of priced lines and a QR ticket. For free visits compose a `ticket-pass`, a `stat` row and `button`s instead. Clinic staff schedules need a scheduler library.

### Medication list and orders

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Active medications in a `table` (dose, route, frequency columns and a status `badge`); `repeater-field` edits multi-line prescriptions, each row built with `field`, `input` and `select` in `renderRow`. Confirm signing in a `dialog` that names the patient and drug. `approval-card` can wrap an order summary with `approveLabel` set to the action, but its resolved badge always says Approved, so use it only where that wording is acceptable.
- Missing: No drug-interaction or dose-check UI, and no medication-specific component; interaction warnings come from your clinical decision support service and are shown with a persistent `alert`.

### Telehealth visit

- Fit: **Gap**
- Use: [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Tooltip](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tooltip.md)
- How: Controls (mute, camera, leave) are icon `button`s with `tooltip`s, a waiting-room state is a `badge`, connection quality is a `status-indicator` with a label override, and a connection warning is an `alert`. `avatar` fills a tile when the camera is off.
- Missing: No video surface, tile grid or device check; embed a video SDK and lay out the tiles yourself. For an in-visit text chat compose `message`, `message-bubble` and `prompt-input` (leave `models` empty).

### Patient intake forms and consent

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Question Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/question-card.md)
- How: `stepper` (with step `description`) splits a long form into short steps; `field` and `FieldGroup` give labels, hints and inline errors; `repeater-field` for medications and allergies; `dropzone` accepts insurance card and ID images with `accept`, `maxSize` and `capture="environment"` to open the phone camera (it has no upload logic, you pass `files` and progress). `question-card` suits a short screening questionnaire: one question at a time, single choice auto-advances, `onSubmitted` returns the answers by index.
- Missing: No signature pad and no rich text editor. For date of birth use three `input`/`select` fields: `date-picker` only has previous and next month buttons, so going back decades is slow. `question-card` always shows a Skip action and a free-text 'Something else' option and has no scoring or branching.

### Care plan and visit history

- Fit: **Adapt**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md)
- How: `timeline` is a strong fit for encounters and events: statuses (success, warning, destructive, current, upcoming) never rely on color alone, mono timestamps, an `items` array, expandable detail for notes or attachments, and collapsible long lists. `progress` with `label` and `valueLabel` for goals (`3 of 5 sessions`). `todo-list` shows plan items with status and optional per-item progress.
- Missing: `todo-list` is a read-only live plan display (it has no toggle callback). For tasks the patient ticks off, use `checkbox` rows.

### Secure messaging with the care team

- Fit: **Adapt**
- Use: [Chat App](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/chat-app.md), [Message](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message.md), [Message Bubble](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message-bubble.md), [Message Scroller](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/message-scroller.md), [Prompt Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/prompt-input.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Sidebar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-sidebar.md)
- How: `message` rows (`from` is `user` or `assistant`, mapped to patient and clinician) with `avatar`, a header for name and time, and a footer for 'Read 14:02' text; `message-bubble` variants; `message-scroller` for the transcript; `prompt-input` as the composer (omit `models` to hide the model picker). `chat-app` is the shell with a folding sidebar, and the thread list is built with `animated-sidebar`. Keep an `alert` visible saying messages are not for emergencies.
- Missing: No attachment preview, read-receipt logic, thread list data model or clinician routing (only the slots to render them); only two sides (`user`/`assistant`). Keep the thread data on your own secure backend.

### Sign in with MFA and a proxy or caregiver

- Fit: **Adapt**
- Use: [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `auth-screen` handles email and password (and optional provider buttons); after its `onSubmit` resolves, show your own step with `otp-input` (`onComplete`, `invalid`) inside `field` and `button`. Caregiver access can use the `team` section of `settings-page` (members with an invite by email and a role).
- Missing: `auth-screen` has no MFA step and `otp-input` has no resend timer; compose them. `settings-page` roles are fixed to owner, admin, member and viewer (viewer is the nearest to a read-only proxy), and the section has no consent scope or expiry, so build those with `switch`, `date-picker` and a `table`.

## Libraries and services that pair well

- Clinical data exchange (patients, observations, medications): HL7 FHIR (SMART on FHIR), Epic FHIR APIs, Medplum. opendraft is presentation only; map FHIR resources to the props of `table`, `stat` and `timeline` in a thin adapter and keep PHI out of client logs.
- Telehealth video: Twilio Video, Daily, Zoom Video SDK. The SDK renders the video; use opendraft buttons, badges and `alert` for controls, waiting-room state and connection warnings around it.
- Vitals and lab trend charts: Recharts, visx, Apache ECharts. Only a basic line chart ships (`InsightChart` in `insight-cards`: no axes, one dashed threshold, pointer-only tooltip). For axes, a shaded reference-range band and keyboard access use a charting library styled with the `--blue-*` and semantic tokens, with a text legend and a `table` of the values.
- Scheduling and calendar: FullCalendar, react-big-calendar, Cal.com. No calendar or week view ships. Use one of these for clinician schedules; keep opendraft `date-picker` and `radio-group` for the patient-facing booking path.
- Consent signatures and identity verification: react-signature-canvas, DocuSign, Persona. No signature pad is included; capture the signature as an image and store it with a timestamp and the consent text version.

## Typical screens

- **Patient chart**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Results review**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md) + [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md)
- **Book an appointment**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Patient portal home**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Intake and consent**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Question Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/question-card.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-healthcare
```

## Known gaps

- Patient banner and chart overview: No patient-banner component and `page-header` is not sticky: wrap the banner in your own sticky container so it never scrolls away.
- Lab results and vitals with abnormal flags: No real chart suite. `InsightChart` has no axes or tick labels, only one dashed threshold line (no shaded reference-range band), a pointer-only tooltip (not keyboard reachable) and a fixed plot height, so it is not a sparkline either. `analytics-dashboard` has a metric chart but its ranges are fixed at 7, 30 and 90 days. Always show the values in a `table` beside any chart; use a charting library for bands and axes.
- Appointment booking and scheduling: No calendar, week view or slot grid, and `date-picker` has no time-zone support (its optional HH:MM field is a plain local time, so print the zone in text). `order-confirmation` is ticket-shaped: it always prints the email sentence, a Total in money format (a free visit shows 0.00), an order summary of priced lines and a QR ticket. For free visits compose a `ticket-pass`, a `stat` row and `button`s instead. Clinic staff schedules need a scheduler library.
- Medication list and orders: No drug-interaction or dose-check UI, and no medication-specific component; interaction warnings come from your clinical decision support service and are shown with a persistent `alert`.
- Telehealth visit: No video surface, tile grid or device check; embed a video SDK and lay out the tiles yourself. For an in-visit text chat compose `message`, `message-bubble` and `prompt-input` (leave `models` empty).
- Patient intake forms and consent: No signature pad and no rich text editor. For date of birth use three `input`/`select` fields: `date-picker` only has previous and next month buttons, so going back decades is slow. `question-card` always shows a Skip action and a free-text 'Something else' option and has no scoring or branching.
- Care plan and visit history: `todo-list` is a read-only live plan display (it has no toggle callback). For tasks the patient ticks off, use `checkbox` rows.
- Secure messaging with the care team: No attachment preview, read-receipt logic, thread list data model or clinician routing (only the slots to render them); only two sides (`user`/`assistant`). Keep the thread data on your own secure backend.
- Sign in with MFA and a proxy or caregiver: `auth-screen` has no MFA step and `otp-input` has no resend timer; compose them. `settings-page` roles are fixed to owner, admin, member and viewer (viewer is the nearest to a read-only proxy), and the section has no consent scope or expiry, so build those with `switch`, `date-picker` and a `table`.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
