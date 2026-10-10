# Building Government and civic services products with opendraft

> Public-sector portals for permits, licences, benefits, tax, records requests, case management and civic engagement. Used by everyone, including people in stress, on old phones and with assistive technology, so clarity and access come before polish.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

government, public sector, civic, citizen, permit, licence, benefits, welfare, tax, council, municipal, case management, foi, records request, immigration, public service.

## Principles for this domain

- Write in plain language: short sentences, common words, one idea per paragraph, the action in the button label (`Apply for a parking permit`, not `Submit`). Explain any term of art the first time it appears.
- Design to a high accessibility bar (aim for WCAG 2.2 AA or better, where regulation applies it is often required): visible focus, 4.5:1 text contrast, full keyboard use, errors announced and linked to their fields, no information by color alone, and a tested screen reader path for every form.
- Long forms must be save-and-resume: ask one thing per step, show the steps with a `stepper`, let people leave and return with a reference number, never lose entered data on an error, and offer a final review page before submission.
- Be transparent about status: every application shows its reference number in `font-mono` with a `copy-button`, the current stage in words, what happens next, the expected time, and who to contact. Never leave a person guessing.
- Support many languages and reading directions from the start: text can grow 30 to 40 percent, names and addresses are not a US shape, dates and numbers follow the locale, and the language switcher is always visible and labeled in its own language.
- No dark patterns: no pre-ticked consent, no countdown pressure on benefits, equal prominence for decline and accept. Ask only for data you need and explain why. Assume a poor connection and an old device: keep pages light, show upload progress, retry safely, and always offer a phone, paper or in-person alternative.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Apply for a permit, licence or benefit (multi-step form)

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `stepper` for stages, `field` for label, hint and linked error, `repeater-field` for household members or prior addresses.
- Missing: No built-in save-and-resume or draft persistence (store drafts server side), no address lookup, and no check-your-answers summary page; build the review page from `table` or a definition list.

### Upload supporting documents

- Fit: **Adapt**
- Use: [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `dropzone` with per-file `progress`, accepted types and size shown in the hint, and a `badge` for Uploaded or Needs attention. Always keep a plain file-input path working.
- Missing: No camera or document scan capture and no virus-scan or upload retry logic; those belong to your backend.

### Application status and history tracking

- Fit: **Ready**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `stepper` for the stage, `timeline` for dated events (received, in review, more information needed, decided), `badge` with words for status, `alert` when action is needed from the applicant.

### Sign in and verify identity

- Fit: **Adapt**
- Use: [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `auth-screen` for email and password; `otp-input` for SMS or authenticator codes, with a resend control and a non-SMS route.
- Missing: No digital identity (eID, login.gov style) hand-off flow or knowledge-based verification; wire your identity provider and show its error states in `alert`.

### Case management for caseworkers

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Case queue in `table`, case file in `detail-page` with `tabs` for documents, notes and history, decisions through `approval-card`, and `timeline` as the case history.
- Missing: `filter-table` is task shaped (todo, progress, done); use `table` with your own filters for case states. No assignment board with SLA timers.

### Book an appointment or inspection slot

- Fit: **Gap**
- Use: [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `date-picker` plus a `radio-group` of times can cover a simple booking.
- Missing: No calendar or availability grid showing open and booked slots, and no reschedule or cancel view.

### Pay a fee, fine or tax

- Fit: **Adapt**
- Use: [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md)
- How: `checkout` gives the details, payment and confirmation flow; show amount, due date and what it is for in `stat` and `table`; receipts via `order-confirmation`.
- Missing: Payment methods and wording are retail shaped; relabel for a fine or fee and add instalment-plan and concession options yourself.

### Service notices, closures and emergency banners

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: A persistent, dismissible `alert` at the top for service disruption or deadlines; keep the same severity words across services.

### Find a service, office or document (search and directory)

- Fit: **Adapt**
- Use: [Search List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/search-list.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md)
- How: `search-list` for live results, `accordion` for FAQs, `empty-state` for no results with a next step.
- Missing: No map or location finder, and `catalog` is card shaped and retail oriented so use `search-list` for text-first service lists.

### Civic data and public dashboards (budgets, performance, open data)

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- How: Relabel `analytics-dashboard` for service volumes or spending, and always put a `table` next to each chart as the accessible alternative.
- Missing: No general time-series, bar or map chart with text alternatives built in.

## Libraries and services that pair well

- Translations and locale-aware formatting: next-intl, react-i18next, FormatJS (react-intl). Keep all copy in message files, test with long German and Finnish strings, and set `dir` for right-to-left languages; check each opendraft component in RTL, since some spacing uses left and right classes.
- Digital identity and sign-in: OpenID Connect provider (Keycloak, Auth0), Login.gov, eIDAS-based national eID. Use `auth-screen` for the fallback email path and `otp-input` for codes, and show a clear error and recovery route when identity checks fail.
- Accessibility testing: axe-core, Pa11y, NVDA and VoiceOver manual checks. Automated tools catch only part of the problems; test each form with a keyboard and a screen reader, and test at 200 percent zoom.
- Address lookup and validation: Google Places, Loqate, National address register APIs. Offer manual entry in a `field` group as the fallback and never block submission when lookup fails.
- Document storage and e-signature: S3-compatible storage with virus scanning, DocuSign, Adobe Sign. Pair with `dropzone` for intake; opendraft has no signature pad or PDF viewer, so use the provider's embedded signing and viewing.
- Notifications by email, SMS and letter: GOV.UK Notify, Twilio, Postmark. Mirror each notification as a dated entry in `timeline` so a person can see what was sent without needing the message.

## Typical screens

- **Service start page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Multi-step application**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Check your answers and submit**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Application status**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Caseworker queue and case file**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-government-civic
```

## Known gaps

- Apply for a permit, licence or benefit (multi-step form): No built-in save-and-resume or draft persistence (store drafts server side), no address lookup, and no check-your-answers summary page; build the review page from `table` or a definition list.
- Upload supporting documents: No camera or document scan capture and no virus-scan or upload retry logic; those belong to your backend.
- Sign in and verify identity: No digital identity (eID, login.gov style) hand-off flow or knowledge-based verification; wire your identity provider and show its error states in `alert`.
- Case management for caseworkers: `filter-table` is task shaped (todo, progress, done); use `table` with your own filters for case states. No assignment board with SLA timers.
- Book an appointment or inspection slot: No calendar or availability grid showing open and booked slots, and no reschedule or cancel view.
- Pay a fee, fine or tax: Payment methods and wording are retail shaped; relabel for a fine or fee and add instalment-plan and concession options yourself.
- Find a service, office or document (search and directory): No map or location finder, and `catalog` is card shaped and retail oriented so use `search-list` for text-first service lists.
- Civic data and public dashboards (budgets, performance, open data): No general time-series, bar or map chart with text alternatives built in.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
