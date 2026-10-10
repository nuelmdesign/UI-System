# Building HR and people operations products with opendraft

> HRIS, recruiting, onboarding, payroll, performance and time-off products used by employees, managers and HR teams. The data is personal and sensitive, so who can see what, and who changed what, is part of the design.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

human resources, hris, people ops, recruiting, applicant, candidate, onboarding, offboarding, payroll, payslip, performance review, time off, leave, timesheet, employee directory.

## Principles for this domain

- Make views permission-aware: show each person only the fields their role allows, and say so (`Visible to HR only`) rather than leaving a blank. Managers see their reports, employees see themselves, and a view-as preview helps admins check it.
- Mask sensitive data by default (salary, national ID, bank details, health and leave reasons, performance ratings) with an explicit reveal that is logged. Never put such values in URLs, toasts, page titles or exports without a clear warning.
- Approval flows show the whole chain: who requested, who must approve now, who is next, what was decided and when. Give every request a status word (Pending, Approved, Declined, Withdrawn) and always allow the requester to withdraw or edit before a decision.
- Use inclusive language and flexible data: do not require a binary gender field, allow preferred and legal names, support names that do not fit first and last, and keep pronouns optional. Dates, currencies and working weeks follow the person's country.
- Make changes auditable: every edit to pay, title, manager, status or personal data records who, when, old value and new value, visible in a history view. Keep effective dates separate from edit dates so retroactive changes are clear.
- Treat people-related decisions with care: show the reason and next step on rejections, avoid ranking people by a single score, label AI-generated summaries or suggestions as such, and keep a human decision-maker on hiring, pay and performance outcomes.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Employee directory and org chart

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: A searchable `table` whose name cell renders an `avatar`, role and location, filtered by an `input` over your data; a profile in a `drawer` (or its own page built from `page-header` and `tabs`); jump-to-person with `command-palette` (`label`, `group`, `hint`, `badge` per item, filtered in memory, so it suits a few thousand people at most). `search-list` takes plain strings only, so it cannot show avatars or roles.
- Missing: No org chart tree or reporting-line visualization. `detail-page` is an event-ticket purchase page, not a person profile.

### Employee profile with sensitive fields

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: Sections as `tabs`, editable details with `field` and `input`, a `badge` such as Visible to HR only, and a `dialog` that asks for confirmation before revealing masked values such as bank details. A `timeline` tab can show the change history.
- Missing: No masked-field control with reveal and audit hook; build it from `input`, a toggle `button` and your permission check. `settings-page` has fixed profile fields (name, email, bio, timezone) and a SaaS team and billing layout, and `detail-page` is an event-ticket page, so neither fits.

### Time-off requests and approvals

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: Request with `date-range-picker` (ISO `{from, to}` dates, `min`, `max`, `presets`), balance in `stat` and `progress` (`valueLabel` such as 12 of 25 days), decision with `approval-card` (Approve, Request changes, Reject; put a `textarea` for a decision note in its `children`), approval chain in `timeline` using `current` and `upcoming` statuses, requests in `table`.
- Missing: No team calendar showing who is away and no half-day support. Do not mark public holidays or weekends with `isDateDisabled`: the range picker refuses any range that spans a disabled day, so people could not book leave across a holiday. Count working days in your own code and show the result next to the range.

### Recruiting pipeline and candidate review

- Fit: **Gap**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md)
- How: Build the board as a stage list instead: a clickable `StatGroup` (each `stat` takes `onClick` and `selected`) or `tabs` for the stages and counts, a `table` of candidates with `avatar` and `badge` cells and a stage `select` per row to move them, and a `drawer` for the candidate with `tabs`, `timeline` for activity, `textarea` for scorecard notes and `approval-card` for an offer decision. You decide which columns exist, so blind early-stage review is easy.
- Missing: `crm-pipeline` is a sales board and cannot be relabelled: it has no `labels` prop, hard-codes the Sales eyebrow, Pipeline title, an Add deal form (Company, Contact, Value in USD, Stage) and a Close date, shows a USD value on every card and a USD total in the header, and takes only `stages`, `deals` (company, contact, value, owner, due), `onMove`, `onAdd` and `onSelect`. Its drag and drop uses mouse drag events (a menu move exists for other input). No resume or PDF viewer.

### Job application form (candidate-facing)

- Fit: **Ready**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: Steps in `stepper`, fields in `field`, resume upload in `dropzone` (`accept`, `maxSize`, and you run the upload), optional diversity questions as `radio-group` options that include Prefer not to say, an unticked consent `checkbox`, and a confirmation built from `alert` (success), a `stepper` marked `complete` and a `copy-button` reference. `order-confirmation` is ticket-shaped and does not fit.

### Onboarding and offboarding checklists

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md)
- How: Tasks per owner (HR, IT, manager, employee) as `checkbox` rows with an owner `badge` and a due `date-picker`, grouped in an `accordion`, overall `progress` with a label, phases in `stepper`, sign-offs with `approval-card`, and completions posted to `timeline`.
- Missing: `todo-list` is a read-only display of an agent's plan (statuses are set by data, rows cannot be ticked) and `task-rows` plays a fixed failed, retry, done animation, so neither works as an interactive checklist; you hold the checked state.

### Payroll runs and payslips

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md)
- How: Run stages in `stepper` (draft, review, approved, paid), differences against the last run as a `table` with old and new values in custom `cell` renderers (struck-through old, new beside it), final approval via `approval-card`, a `dialog` before submitting, and `dropzone` for imports. `diff-table` is a one-shot demo of an email-directory edit (rows of id, dept, email) and does not take payroll data.
- Missing: No payslip document viewer and no PDF viewer; link to a generated file. Calculation, tax and legal rules come from your payroll provider.

### Performance reviews and goals

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Review cycle in `stepper`, rating with `radio-group` or a `slider` with text `marks` for each level, goals with `progress`, sections in `tabs`, manager sign-off via `approval-card`. `detail-page` is an event-ticket page and does not fit.
- Missing: No rich text editor for long-form feedback (`textarea` is plain) and no 9-box or calibration grid.

### Audit history of changes

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md)
- How: `timeline` for who changed what (`timestamp`, `meta` for the actor, expandable `children` for the old and new value), and a searchable log in `table` (sortable, with `cell` renderers that show old and new values; virtualized for long histories). Filter by `date-range-picker`, `tabs` or an `input` over your own data, because `table` has no built-in filter. `diff-table` and `filter-table` do not fit: one is a fixed demo shape and the other lists task rows.

### HR analytics (headcount, attrition, time to hire)

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: Relabel `analytics-dashboard` for headcount and attrition: metrics each carry a series per range, rows are `name` (department), `visitors` (a count such as headcount), `conversion` (a 0 to 1 rate such as retention) and `duration` (seconds, or use `valueColumn`), and the share bar suits composition. Apply minimum group sizes in your data so small teams cannot be identified.
- Missing: No general time-series, funnel or cohort chart; the chart is a single smoothed line without axes, and the range tabs are fixed to the keys 7d, 30d and 90d (relabel with `labels.ranges` and supply your own data under each key).

## Libraries and services that pair well

- Payroll, benefits and tax calculation: Gusto, ADP, Deel. Let the provider own the calculation and show its output in `table` and `stat`; never recompute pay in the browser.
- Applicant tracking and job boards: Greenhouse, Lever, Ashby. Map their stages onto your own stage list (the `tabs` or `stat` filters of the hiring screen) and keep candidate notes in your own drawer rather than copying them.
- Single sign-on, provisioning and directory sync: Okta, Microsoft Entra ID, SCIM. Use SCIM to create and remove accounts at hire and exit, and drive the onboarding checklist from the same events.
- E-signature for contracts and policies: DocuSign, Dropbox Sign, Adobe Sign. opendraft has no signature pad or PDF viewer; embed the provider's signing view and record the result in `timeline`.
- Calendars, holidays and working-time rules: Nager.Date, Google Calendar API, Microsoft Graph. Compute working days and holidays in your own code and show them beside the `date-range-picker`; do not disable holiday dates in the picker, because it rejects ranges that span disabled days. Sync approved leave to the team calendar.
- Permissions and field-level access control: CASL, Oso, OpenFGA. Evaluate on the server and pass the allowed fields to the UI as props, so hidden data is never sent to the browser.

## Typical screens

- **Employee directory**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md) + [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md)
- **Employee profile**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Time off and approvals**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Hiring pipeline**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **New hire onboarding**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-hr-people
```

## Known gaps

- Employee directory and org chart: No org chart tree or reporting-line visualization. `detail-page` is an event-ticket purchase page, not a person profile.
- Employee profile with sensitive fields: No masked-field control with reveal and audit hook; build it from `input`, a toggle `button` and your permission check. `settings-page` has fixed profile fields (name, email, bio, timezone) and a SaaS team and billing layout, and `detail-page` is an event-ticket page, so neither fits.
- Time-off requests and approvals: No team calendar showing who is away and no half-day support. Do not mark public holidays or weekends with `isDateDisabled`: the range picker refuses any range that spans a disabled day, so people could not book leave across a holiday. Count working days in your own code and show the result next to the range.
- Recruiting pipeline and candidate review: `crm-pipeline` is a sales board and cannot be relabelled: it has no `labels` prop, hard-codes the Sales eyebrow, Pipeline title, an Add deal form (Company, Contact, Value in USD, Stage) and a Close date, shows a USD value on every card and a USD total in the header, and takes only `stages`, `deals` (company, contact, value, owner, due), `onMove`, `onAdd` and `onSelect`. Its drag and drop uses mouse drag events (a menu move exists for other input). No resume or PDF viewer.
- Onboarding and offboarding checklists: `todo-list` is a read-only display of an agent's plan (statuses are set by data, rows cannot be ticked) and `task-rows` plays a fixed failed, retry, done animation, so neither works as an interactive checklist; you hold the checked state.
- Payroll runs and payslips: No payslip document viewer and no PDF viewer; link to a generated file. Calculation, tax and legal rules come from your payroll provider.
- Performance reviews and goals: No rich text editor for long-form feedback (`textarea` is plain) and no 9-box or calibration grid.
- HR analytics (headcount, attrition, time to hire): No general time-series, funnel or cohort chart; the chart is a single smoothed line without axes, and the range tabs are fixed to the keys 7d, 30d and 90d (relabel with `labels.ranges` and supply your own data under each key).

Docs: https://ui-system-virid.vercel.app/docs/use-cases
