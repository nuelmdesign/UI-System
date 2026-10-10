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
- Use: [Search List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/search-list.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Searchable list with `avatar`, role and location, a profile in `detail-page`, jump-to-person with `command-palette`.
- Missing: No org chart tree or reporting-line visualization.

### Employee profile with sensitive fields

- Fit: **Adapt**
- Use: [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md)
- How: Sections as `tabs`, editable details with `field`, a `dialog` to confirm reveal of masked values such as bank details.
- Missing: No masked-field control with reveal and audit hook; build it from `input`, a toggle button and your permission check.

### Time-off requests and approvals

- Fit: **Adapt**
- Use: [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Request with `date-range-picker`, balance in `stat` and `progress`, decision with `approval-card`, approval chain in `timeline`.
- Missing: No team calendar showing who is away and no public-holiday or half-day awareness; add holidays to the date picker logic.

### Recruiting pipeline and candidate review

- Fit: **Adapt**
- Use: [CRM Pipeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/crm-pipeline.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md)
- How: `crm-pipeline` is a stage board with drag and drop; pass your hiring stages and relabel the cards; scorecards in `detail-page` with `tabs`.
- Missing: Its data shape is sales oriented (company, value, contact), and there is no resume or PDF viewer. For fairness, hide fields (name, photo) you do not want in an early-stage blind review.

### Job application form (candidate-facing)

- Fit: **Ready**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md)
- How: Steps in `stepper`, resume upload in `dropzone`, optional diversity questions as `radio-group` options that include Prefer not to say, and a confirmation screen via `order-confirmation`.

### Onboarding and offboarding checklists

- Fit: **Ready**
- Use: [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Task Rows](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/task-rows.md)
- How: Tasks per owner (HR, IT, manager, employee) in `todo-list` or `task-rows`, overall `progress`, and sign-offs with `approval-card`.

### Payroll runs and payslips

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Diff Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/diff-table.md)
- How: Run stages in `stepper` (draft, review, approved, paid), differences against last run in `diff-table`, final approval via `approval-card`.
- Missing: No payslip document viewer and no PDF viewer; link to a generated file. Calculation, tax and legal rules come from your payroll provider.

### Performance reviews and goals

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Review cycle in `stepper`, rating with `radio-group` that has a text label for each level, goals with `progress`, manager sign-off via `approval-card`.
- Missing: No rich text editor for long-form feedback (`textarea` is plain) and no 9-box or calibration grid.

### Audit history of changes

- Fit: **Ready**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Diff Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/diff-table.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `timeline` for who changed what, `diff-table` for old and new values, `date-range-picker` and `table` filters for searching.

### HR analytics (headcount, attrition, time to hire)

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: Relabel `analytics-dashboard` for headcount and attrition; apply minimum group sizes so small teams cannot be identified.
- Missing: No general time-series, funnel or cohort chart, and the dashboard range tabs are fixed at 7, 30 and 90 days.

## Libraries and services that pair well

- Payroll, benefits and tax calculation: Gusto, ADP, Deel. Let the provider own the calculation and show its output in `table` and `stat`; never recompute pay in the browser.
- Applicant tracking and job boards: Greenhouse, Lever, Ashby. Map their stages onto the `crm-pipeline` stages and keep candidate notes in your own detail view rather than copying them.
- Single sign-on, provisioning and directory sync: Okta, Microsoft Entra ID, SCIM. Use SCIM to create and remove accounts at hire and exit, and drive the onboarding `todo-list` from the same events.
- E-signature for contracts and policies: DocuSign, Dropbox Sign, Adobe Sign. opendraft has no signature pad or PDF viewer; embed the provider's signing view and record the result in `timeline`.
- Calendars, holidays and working-time rules: Nager.Date, Google Calendar API, Microsoft Graph. Feed public holidays into the `date-range-picker` logic and sync approved leave to the team calendar.
- Permissions and field-level access control: CASL, Oso, OpenFGA. Evaluate on the server and pass the allowed fields to the UI as props, so hidden data is never sent to the browser.

## Typical screens

- **Employee directory**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Search List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/search-list.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md) + [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- **Employee profile**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Time off and approvals**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Hiring pipeline**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [CRM Pipeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/crm-pipeline.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **New hire onboarding**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-hr-people
```

## Known gaps

- Employee directory and org chart: No org chart tree or reporting-line visualization.
- Employee profile with sensitive fields: No masked-field control with reveal and audit hook; build it from `input`, a toggle button and your permission check.
- Time-off requests and approvals: No team calendar showing who is away and no public-holiday or half-day awareness; add holidays to the date picker logic.
- Recruiting pipeline and candidate review: Its data shape is sales oriented (company, value, contact), and there is no resume or PDF viewer. For fairness, hide fields (name, photo) you do not want in an early-stage blind review.
- Payroll runs and payslips: No payslip document viewer and no PDF viewer; link to a generated file. Calculation, tax and legal rules come from your payroll provider.
- Performance reviews and goals: No rich text editor for long-form feedback (`textarea` is plain) and no 9-box or calibration grid.
- HR analytics (headcount, attrition, time to hire): No general time-series, funnel or cohort chart, and the dashboard range tabs are fixed at 7, 30 and 90 days.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
