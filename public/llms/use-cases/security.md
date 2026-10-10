# Building Security and compliance products with opendraft

> Security operations, threat detection, access control and audit products. Used by analysts under pressure: dense data, fast triage, irreversible actions.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

security, soc, siem, threat, incident response, vulnerability, edr, iam, access control, audit log, compliance, soc 2, firewall, fraud, zero trust, pentest.

## Principles for this domain

- Never show severity by color alone. Pair every severity color with a text label (Critical, High, Medium, Low) and use the same scale everywhere.
- Show times as absolute UTC in `font-mono` with a relative hint (for example `14:02:09Z · 3 min ago`). Analysts compare timestamps across systems. `timeline` renders `time` in mono and takes an ISO `timestamp`.
- Make destructive or far-reaching actions (isolate a host, revoke a session, delete a key) require a confirmation that names the consequence, and show who did it and when afterward. Do not offer 'Always allow' (`tool-approval`'s optional `onAlwaysAllow`) for these.
- Mask secrets by default (tokens, keys, hashes). opendraft has no masked input, so render the masked value yourself, add an explicit reveal button and a `copy-button`, and never log or echo the value.
- Favor dense tables and a `command-palette` (Cmd/Ctrl+K) for jumping to an entity. Default these products to the dark theme (add the `dark` class), but keep both themes working.
- Every state change should leave an audit trail the user can see. Plan for an audit-log screen from the start. Record who and when in your backend; the UI components only display it.
- Show what the system knows, not what it concludes: label automated or AI verdicts as such and link the evidence. Do not state or imply that the product makes anyone compliant with a standard.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Triage a stream of alerts

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `table` is virtualized (pass `rowHeight` and `height` or `maxHeight`), sortable, and has `selectable` with `onSelectionChange(ids)` and `getRowId`. Render severity and status as `badge` (with `dot`) in a column `cell`. Build the bulk bar yourself: when `ids.length > 0` show `Button`s (Acknowledge, Close, Assign) above the table. Filter your own data with `tabs` (status), `select` (severity) and `input` (search) and pass the filtered rows in.
- Missing: `filter-table` is NOT for this: its rows are fixed task rows {task, date, status todo|progress|done, owner}. `selection-actions` is NOT a bulk bar: it is an AI text-rewrite bar over a passage. There is no four-level severity component (use `badge`: Critical to `destructive`, High and Medium to `warning`, Low to `secondary`, always with the word) and no saved-filter control. On phones the table scrolls sideways; there is no card mode.

### Investigate an incident: timeline of events and evidence

- Fit: **Ready**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: `timeline` is the event feed: per item `time` (mono), ISO `timestamp`, `title`, `description`, `meta` (actor or source), `status` (default, success, warning, destructive, current, upcoming; markers are never color only) and expandable `children` for raw evidence. Use `align="right-time"` for a time column, `collapsible` with `max` for long lists, and pass events newest first yourself (`newestFirst` only changes the label). `code-block` shows a raw event or command, `file-diff` a config change, `stepper` (horizontal or vertical) the response stages.

### Confirm and run response actions

- Fit: **Adapt**
- Use: [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Tool Approval](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-approval.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: `approval-card` takes a `title`, body `children` and `onApprove`, `onRequestChanges`, `onReject` (the last two render only when passed), a controlled `status` and a `result` slot where you put 'Approved by X at 14:02:09Z'. Use `tool-approval` when an AI agent proposes an action: it lists `parameters` and has allow once and deny. For the dangerous ones, build a `dialog` with an `input` the user types the host name into, and keep the confirm `Button` disabled until it matches (the type-to-confirm in `settings-page`'s danger zone does this). `sonner` reports the result.
- Missing: No built-in typed-confirmation or two-person approval component: assemble it from `dialog` + `input` + `button`. Who approved and when comes from your backend.

### Manage users, roles and permissions

- Fit: **Adapt**
- Use: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md)
- How: `settings-page` with `sections={["team"]}` gives a member list, invite (`onInvite`) and role change. For long user lists use `table` with `selectable`. A small permission matrix can be a `table` whose column `cell` renders a `checkbox` per role and permission. `repeater-field` edits rule lists such as allowed IP ranges.
- Missing: `settings-page` roles are fixed to owner, admin, member and viewer. No permission-matrix component: build it from `table` + `checkbox`; it will not collapse well on phones.

### Search and review an audit log

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- How: `table` with sortable columns, `onEndReached` plus `loading` for paging, and mono cells for IDs and times. Filters are your own `date-range-picker`, `select` and `input`. Show a change with `file-diff` (lines typed added, removed, context) and one entity's history with `timeline`.
- Missing: `date-range-picker` values are calendar dates (YYYY-MM-DD) with no time of day, so narrow by time with your own fields. `diff-table` is NOT usable here: it is a fixed 3-column {id, dept, email} proposed-edit widget with keep or drop and Apply. `records-table` is NOT usable: it is an AI spreadsheet with fixed {name, tags, last, strength, website} rows. `filter-table` is task-shaped.

### Show security posture and compliance coverage

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `stat` and `StatGroup` for headline numbers, with `delta` and `goodWhen="down"` for counts where fewer is better. `progress` for control coverage: for coverage where low is bad, set `invert` with `tone="auto"` so a low value turns warning or destructive. `analytics-dashboard` can show findings: relabel through `labels` (including `columns`), supply `metrics`, per-metric `series`, `rows` and `channels` (share bars, usable for a severity breakdown) and set `valueColumn`. Pass `fill={false}` inside a scrolling page.
- Missing: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are fixed to name, visitors, conversion and duration (relabel or replace the last with `valueColumn`). No gauge or risk-score ring.

### Sign in with SSO and MFA

- Fit: **Adapt**
- Use: [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `auth-screen` handles email and password, remember me, forgot password and provider buttons (`providers`, `onProvider`). `onSubmit` may throw to show an error. After it succeeds, show your own second screen with `otp-input` (`length`, `pattern`, `onComplete`, `invalid`) inside a `field`, and an `alert` for lockout or error states.
- Missing: `auth-screen` has no built-in MFA step, passkey or SSO-by-domain flow; the code step is a screen you build and the provider supplies the verification.

### Manage API keys and secrets

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: List keys in a `table` with created, last used and a `badge` for status. Reveal a new key once in a `dialog` with a `copy-button` and an `alert` that it will not be shown again. Revoke with a type-to-confirm `dialog`.
- Missing: No masked or reveal input; use `input type="password"` and your own show button.

### Show active incidents and degraded feeds

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `alert` has variants default, info, success, warning and destructive, a `banner` mode for full-width notices, an `AlertAction` slot for a button and optional `dismissible`.

### Ask an AI analyst to summarize or investigate

- Fit: **Ready**
- Use: [Agent Workspace](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/agent-workspace.md), [Citations](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/citations.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Tool Approval](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-approval.md)
- How: `agent-workspace` takes your `conversations`, `messages`, `tasks` and an async `onSend` that returns the reply (thinking rows, tool steps, streamed `answer` tokens, `sources`, `followUps`). Show evidence with `citations` and gate any action behind `approval-card` or `tool-approval`.

### Show assets or attack paths on a map or graph

- Fit: **Gap**
- Use: 
- How: Nothing in opendraft draws a graph or a map. `flowchart` is a Trigger and If/Else workflow canvas with condition chips, not a network or attack-path graph.
- Missing: No network graph or geographic map. Use a graph or map library (see integrations) and keep the entity list in a `table` beside it.

## Libraries and services that pair well

- Network or attack-path graph: React Flow, Cytoscape.js. Draw nodes and edges with our tokens for color and type; keep the severity text labels.
- Geographic threat or asset map: MapLibre GL JS, deck.gl. Style markers with status tokens and always give each marker a text label for assistive technology.
- Event volume and trend charts: Recharts, uPlot. uPlot copes with very large series; Recharts is quicker to theme. The chart inside analytics-dashboard is fixed to its own metrics.
- Single sign-on and MFA: Clerk, Auth0, WorkOS. Put the provider's flow behind the auth-screen block (onSubmit and onProvider) and use otp-input for codes.

## Typical screens

- **Security operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- **Alert queue**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md) + [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- **Incident detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- **Access management**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- **Audit log**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-security
```

## Known gaps

- Triage a stream of alerts: `filter-table` is NOT for this: its rows are fixed task rows {task, date, status todo|progress|done, owner}. `selection-actions` is NOT a bulk bar: it is an AI text-rewrite bar over a passage. There is no four-level severity component (use `badge`: Critical to `destructive`, High and Medium to `warning`, Low to `secondary`, always with the word) and no saved-filter control. On phones the table scrolls sideways; there is no card mode.
- Confirm and run response actions: No built-in typed-confirmation or two-person approval component: assemble it from `dialog` + `input` + `button`. Who approved and when comes from your backend.
- Manage users, roles and permissions: `settings-page` roles are fixed to owner, admin, member and viewer. No permission-matrix component: build it from `table` + `checkbox`; it will not collapse well on phones.
- Search and review an audit log: `date-range-picker` values are calendar dates (YYYY-MM-DD) with no time of day, so narrow by time with your own fields. `diff-table` is NOT usable here: it is a fixed 3-column {id, dept, email} proposed-edit widget with keep or drop and Apply. `records-table` is NOT usable: it is an AI spreadsheet with fixed {name, tags, last, strength, website} rows. `filter-table` is task-shaped.
- Show security posture and compliance coverage: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are fixed to name, visitors, conversion and duration (relabel or replace the last with `valueColumn`). No gauge or risk-score ring.
- Sign in with SSO and MFA: `auth-screen` has no built-in MFA step, passkey or SSO-by-domain flow; the code step is a screen you build and the provider supplies the verification.
- Manage API keys and secrets: No masked or reveal input; use `input type="password"` and your own show button.
- Show assets or attack paths on a map or graph: No network graph or geographic map. Use a graph or map library (see integrations) and keep the entity list in a `table` beside it.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
