# Building Government and civic services products with opendraft

> Public-sector portals for permits, licences, benefits, tax, records requests, case management and civic engagement. Used by everyone, including people in stress, on old phones and with assistive technology, so clarity and access come before polish.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

government, public sector, civic, citizen, permit, licence, benefits, welfare, tax, council, municipal, case management, foi, records request, immigration, public service.

## Principles for this domain

- Write in plain language: short sentences, common words, one idea per paragraph, the action in the button label (`Apply for a parking permit`, not `Submit`). Explain any term of art the first time it appears.
- Design to a high accessibility bar (aim for WCAG 2.2 AA or better; in many places public bodies are legally required to): visible focus, 4.5:1 text contrast, full keyboard use, errors announced and linked to their fields (`field` wires the ids and ARIA), no information by color alone, and a tested screen reader path for every form. opendraft's components do not make a page compliant by themselves, so test the finished screen.
- Long forms must be save-and-resume: ask one thing per step, show the steps with a `stepper`, let people leave and return with a reference number, never lose entered data on an error, and offer a final review page before submission. Neither `stepper` nor `field` stores anything, so draft saving is your backend's job.
- Be transparent about status: every application shows its reference number in `font-mono` with a `copy-button`, the current stage in words, what happens next, the expected time, and who to contact. Never leave a person guessing.
- Support many languages and reading directions from the start: text can grow 30 to 40 percent, names and addresses are not a US shape, dates and numbers follow the locale, and the language switcher is always visible and labeled in its own language.
- No dark patterns: no pre-ticked consent, no countdown pressure on benefits, equal prominence for decline and accept. Ask only for data you need and explain why. Assume a poor connection and an old device: keep pages light, show upload progress, retry safely, and always offer a phone, paper or in-person alternative.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Apply for a permit, licence or benefit (multi-step form)

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `stepper` for stages (each step takes a `description`, and only completed steps are clickable), `field` for label, hint and linked error (`FieldSet` for a legend around radio groups), `repeater-field` for household members or prior addresses (`min`, `max`, `renderRow`, `createItem`). `date-picker` takes ISO dates with `min`, `max`, `locale` and `isDateDisabled`.
- Missing: No built-in save-and-resume or draft persistence (store drafts server side), no address lookup, and no check-your-answers page; build the review page from a plain definition list (`dl`) grouped by step, with a change link per group. `table` is virtualized and needs a fixed `rowHeight`, so it is a poor fit for a short summary.

### Upload supporting documents

- Fit: **Ready**
- Use: [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `dropzone` validates `accept`, `maxSize` and `maxFiles`, reports `onReject` reasons (file-too-large, file-invalid-type, too-many-files), opens the phone camera with `capture="environment"`, and renders a file list from `files` with per-file `progress`, `error` and `onRemove`. Show accepted types and size in a `field` hint, and a `badge` for Uploaded or Needs attention. It has no upload logic: you run the upload and feed `progress` back. Always keep a plain file-input path working.

### Application status and history tracking

- Fit: **Ready**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `stepper` (vertical, with `description` for the expected date) for the stage, `timeline` for dated events (received, in review, more information needed, decided; `timestamp`, `status`, `meta` for who), `badge` with words for status, `copy-button` for the reference number, `alert` when action is needed from the applicant. `detail-page` is an event-ticket purchase page, so compose the page from `page-header` and these parts.

### Sign in and verify identity

- Fit: **Adapt**
- Use: [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `auth-screen` is email and password with sign-in and sign-up tabs, a remember checkbox, a forgot-password callback, optional `providers` buttons (use one per identity provider) and a brand panel. `otp-input` for SMS or authenticator codes; add your own resend `button` and a non-SMS route.
- Missing: No digital identity (eID, login.gov style) hand-off flow, no knowledge-based verification and no built-in resend or lockout; wire your identity provider and show its error states in `alert`.

### Case management for caseworkers

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: Case queue in `table` (`selectable` with `getRowId` and `onSelectionChange` for bulk assign buttons), filtered with `tabs` or `select` over your own data. The case file is composed from `page-header`, `tabs` for documents, notes and history, and `timeline` as the case history. Decisions go through `approval-card` (put a `textarea` for the reason in its `children`; it has Approve, Request changes and Reject but no reason field or decision log of its own). `drawer` for a quick preview.
- Missing: `filter-table` is a task table (todo, progress, done rows) and `selection-actions` is an AI text-rewrite bar, so neither fits a case queue. `detail-page` is an event-ticket page. No assignment board with SLA timers.

### Book an appointment or inspection slot

- Fit: **Gap**
- Use: [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `date-picker` (ISO value, optional `time` entry, `min`, `max`, `isDateDisabled` for closed days) plus a `radio-group` of times, with a booked slot's item `disabled`, covers a simple booking. `ticket-pass` makes a confirmation pass with a QR `code`, fields and a status (valid, used, expired, void).
- Missing: No calendar or availability grid showing open and booked slots, no reschedule or cancel view, and no time-zone support in `date-picker`. `order-confirmation` is ticket-shaped with a fixed three-step stepper.

### Pay a fee, fine or tax

- Fit: **Gap**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md)
- How: Show amount, due date and what it is for in `stat` and a short line-item `table`. Build the payment form from `field`, `input` and `radio-group` with the provider's hosted card fields, and a receipt from `stat`, a `stepper` marked `complete` and a `copy-button` reference.
- Missing: `checkout` is an event-ticket flow (quantity steppers, attendee, front-desk delivery, pay later, ticket passes) and `order-confirmation` renders ticket passes, so neither fits a fine or tax. Add instalment-plan and concession options yourself.

### Service notices, closures and emergency banners

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `alert` with `banner` for a full-width, dismissible (`dismissible`, `onDismiss`) notice at the top for service disruption or deadlines, with an `AlertAction` button; keep the same severity words across services. `site-header` for the page frame.

### Find a service, office or document (search and directory)

- Fit: **Adapt**
- Use: [Search List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/search-list.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md)
- How: `search-list` filters a plain list of strings with a live result list and an empty message; `accordion` for FAQs; `empty-state` (`live`) for no results with a next step. For results that need a description or link, use `input` and filter your own data into a list.
- Missing: `search-list` takes strings only. No map or location finder. `catalog` is event shaped (date, price, capacity, places left) and not a service directory. `command-palette` is a keyboard action menu over in-memory items.

### Civic data and public dashboards (budgets, performance, open data)

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- How: `analytics-dashboard` already pairs a chart with a sortable table: rows are `name`, `visitors` (a count), `conversion` (a 0 to 1 rate) and `duration` (seconds), or a custom `valueColumn` for money. Relabel it with `labels` and the format props for service volumes or spending, and its tabs are the fixed keys 7d, 30d and 90d (relabel with `labels.ranges`). The chart shows one metric at a time, so put the same numbers in the table as the accessible alternative.
- Missing: Only a single smoothed line chart (smoothing applies below 24 points), a share bar and a table: no bar or map chart, no fiscal-year ranges beyond 90 days of points, and the chart's data is only readable by hover, so keep the table.

## Libraries and services that pair well

- Translations and locale-aware formatting: next-intl, react-i18next, FormatJS (react-intl). Keep all copy in message files, test with long German and Finnish strings, and set `dir` for right-to-left languages; check each opendraft component in RTL, since some spacing uses left and right classes.
- Digital identity and sign-in: OpenID Connect provider (Keycloak, Auth0), Login.gov, eIDAS-based national eID. Use `auth-screen`'s `providers` buttons for the identity provider hand-off and its email form as the fallback path, `otp-input` for codes, and show a clear error and recovery route when identity checks fail.
- Accessibility testing: axe-core, Pa11y, NVDA and VoiceOver manual checks. Automated tools catch only part of the problems; test each form with a keyboard and a screen reader, and test at 200 percent zoom.
- Address lookup and validation: Google Places, Loqate, National address register APIs. Offer manual entry in a `field` group as the fallback and never block submission when lookup fails.
- Document storage and e-signature: S3-compatible storage with virus scanning, DocuSign, Adobe Sign. Pair with `dropzone` for intake (it has no upload logic); opendraft has no signature pad or PDF viewer, so use the provider's embedded signing and viewing.
- Notifications by email, SMS and letter: GOV.UK Notify, Twilio, Postmark. Mirror each notification as a dated entry in `timeline` so a person can see what was sent without needing the message.

## Typical screens

- **Service start page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Multi-step application**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Check your answers and submit**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Application status**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Caseworker queue and case file**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-government-civic
```

## Known gaps

- Apply for a permit, licence or benefit (multi-step form): No built-in save-and-resume or draft persistence (store drafts server side), no address lookup, and no check-your-answers page; build the review page from a plain definition list (`dl`) grouped by step, with a change link per group. `table` is virtualized and needs a fixed `rowHeight`, so it is a poor fit for a short summary.
- Sign in and verify identity: No digital identity (eID, login.gov style) hand-off flow, no knowledge-based verification and no built-in resend or lockout; wire your identity provider and show its error states in `alert`.
- Case management for caseworkers: `filter-table` is a task table (todo, progress, done rows) and `selection-actions` is an AI text-rewrite bar, so neither fits a case queue. `detail-page` is an event-ticket page. No assignment board with SLA timers.
- Book an appointment or inspection slot: No calendar or availability grid showing open and booked slots, no reschedule or cancel view, and no time-zone support in `date-picker`. `order-confirmation` is ticket-shaped with a fixed three-step stepper.
- Pay a fee, fine or tax: `checkout` is an event-ticket flow (quantity steppers, attendee, front-desk delivery, pay later, ticket passes) and `order-confirmation` renders ticket passes, so neither fits a fine or tax. Add instalment-plan and concession options yourself.
- Find a service, office or document (search and directory): `search-list` takes strings only. No map or location finder. `catalog` is event shaped (date, price, capacity, places left) and not a service directory. `command-palette` is a keyboard action menu over in-memory items.
- Civic data and public dashboards (budgets, performance, open data): Only a single smoothed line chart (smoothing applies below 24 points), a share bar and a table: no bar or map chart, no fiscal-year ranges beyond 90 days of points, and the chart's data is only readable by hover, so keep the table.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
