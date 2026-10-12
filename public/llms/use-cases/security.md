# Building Security and compliance products with opendraft

> Security operations, threat detection, access control and audit products. Used by analysts under pressure: dense data, fast triage, irreversible actions.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

security, soc, siem, threat, incident response, vulnerability, edr, iam, access control, audit log, compliance, soc 2, firewall, fraud, zero trust, pentest.

## Principles for this domain

- Never show severity by color alone. Pair every severity color with a text label (Critical, High, Medium, Low) and use the same scale everywhere.
- Show times as absolute UTC in `font-mono` with a relative hint (for example `14:02:09Z · 3 min ago`). Analysts compare timestamps across systems. `timeline` renders `time` in mono and takes an ISO `timestamp`.
- Make destructive or far-reaching actions (isolate a host, revoke a session, delete a key) require a confirmation that names the consequence, and show who did it and when afterward. Do not offer 'Always allow' (`tool-approval`'s optional `onAlwaysAllow`) for these.
- Mask secrets by default (tokens, keys, hashes). Use `secret-input` for entering or showing a secret (masked, with reveal, copy and optional auto-hide) and never log or echo the value.
- Favor dense tables and a `command-palette` (Cmd/Ctrl+K) for jumping to an entity. Default these products to the dark theme (add the `dark` class), but keep both themes working.
- Every state change should leave an audit trail the user can see. Plan for an audit-log screen from the start. Record who and when in your backend; the UI components only display it.
- Show what the system knows, not what it concludes: label automated or AI verdicts as such and link the evidence. Do not state or imply that the product makes anyone compliant with a standard.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Triage a stream of alerts

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Filter Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-bar.md), [Bulk Action Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/bulk-action-bar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: Start with the `data-table` block: `columns`, `rows`, `getRowId`, `searchable`, `filters` (a `filter-bar` config with chips and clear-all), `views` (tabs such as Open, Acknowledged, Closed), `selectable` with `bulkActions` (Acknowledge, Close, Assign receive the selected rows) and a card layout when narrow. Render severity and status as `badge` (with `dot`) in a column `cell`. For a very large live stream use the virtualized `table` (pass `rowHeight` and `height` or `maxHeight`) with `filter-bar` above and `bulk-action-bar` shown when ids are selected.
- Missing: `data-table` pages its rows rather than virtualizing them, so it suits thousands of rows, not an unbounded stream. There is no four-level severity component (use `badge`: Critical to `destructive`, High and Medium to `warning`, Low to `secondary`, always with the word) and no saved-filter control: store the `filter-bar` value yourself.

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
- Use: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Permission Matrix](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/permission-matrix.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md)
- How: `settings-page` with `sections={["team"]}` gives a member list, invite (`onInvite`) and role change. Use `permission-matrix` for the custom-roles screen: `roles` by `groups` of permissions, select-all per role, row and group, read-only built-in roles and a change summary to review before saving (`onValueChange`). Long user lists belong in `data-table`. `repeater-field` edits rule lists such as allowed IP ranges.
- Missing: `settings-page` roles are fixed to owner, admin, member and viewer; use `permission-matrix` for anything custom. The matrix edits grants only: who may change roles, and enforcement, come from your backend.

### Search and review an audit log

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Filter Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-bar.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Date Time Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-time-picker.md), [Description List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/description-list.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- How: `data-table` with `searchable`, `filters` (actor, action, outcome as select or multi-select), sortable mono columns for IDs and times, and `onRowOpen` to show one entry in a `description-list` (actor, target, IP, request ID with `copyable`). Show a change with `file-diff` and one entity's history with `timeline`. Use `date-range-picker` for the day range and `date-time-picker` (with a named `timeZone`, UTC by default here) for exact from and to bounds.
- Missing: No dedicated audit-log viewer with live tail, saved queries or export; assemble it from `data-table` and `filter-bar`, and page from your backend. `date-range-picker` itself has no time of day, which is why the exact bounds use `date-time-picker`.

### Show security posture and compliance coverage

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Gauge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/gauge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Time Series Chart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/time-series-chart.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `stat` and `StatGroup` for headline numbers, with `delta` and `goodWhen="down"` for counts where fewer is better. `gauge` shows a posture or risk score with `thresholds` bands and a text status (never color alone). `progress` for control coverage: set `invert` with `tone="auto"` where a low value is bad. `time-series-chart` plots findings over time with `thresholds`, brush zoom and a data-table fallback. `analytics-dashboard` can still frame a findings overview through `labels`, `metrics`, `rows` and `channels`; pass `fill={false}` inside a scrolling page.
- Missing: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are fixed to name, visitors, conversion and duration (relabel or replace the last with `valueColumn`). Prefer `time-series-chart` when you need your own series. Do not present a score as proof of compliance with a standard.

### Sign in with SSO and MFA

- Fit: **Adapt**
- Use: [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [MFA Step](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/mfa-step.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `auth-screen` handles email and password, remember me, forgot password and provider buttons (`providers`, `onProvider`); `onSubmit` may throw to show an error. After it succeeds, show `mfa-step` for the second factor: `methods` (authenticator app, SMS, security key), `onVerify` (async, returns the result), `onResend` with a countdown, and verifying, error and `locked` states. Use an `alert` for session-expired or lockout notices.
- Missing: `mfa-step` collects and submits a code but the verification, rate limits and lockout come from your auth provider or backend. There is no passkey enrolment screen or SSO-by-domain flow.

### Manage API keys and secrets

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Secret Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/secret-input.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: List keys in `data-table` with created, last used and a `badge` for status (never show the full secret in a row). Reveal a new key once in a `dialog` with `secret-input` (masked, reveal, `copyable`, `autoHideMs`), a `copy-button` and an `alert` that it will not be shown again. Revoke with a type-to-confirm `dialog`.

### Show active incidents and degraded feeds

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `alert` has variants default, info, success, warning and destructive, a `banner` mode for full-width notices, an `AlertAction` slot for a button and optional `dismissible`.

### Ask an AI analyst to summarize or investigate

- Fit: **Ready**
- Use: [Agent Workspace](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/agent-workspace.md), [Citations](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/citations.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Tool Approval](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-approval.md)
- How: `agent-workspace` takes your `conversations`, `messages`, `tasks` and an async `onSend` that returns the reply (thinking rows, tool steps, streamed `answer` tokens, `sources`, `followUps`). Show evidence with `citations` and gate any action behind `approval-card` or `tool-approval`.

### Show assets or attack paths on a map

- Fit: **Adapt**
- Use: [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `map-view` is a token-styled MapLibre GL map: pass `markers` (each with a text `label` and a `status`), `routes` and `areas`, and use `selectedId` with `onSelect` to sync it with a `data-table` of assets. It includes a keyboard-reachable list of the same locations, so the map is never the only view.
- Missing: `map-view` is geographic only. There is no network or attack-path graph (`flowchart` is a workflow canvas). Use a graph library (see integrations) for nodes and edges and keep the entity list in `data-table` beside it.

## Libraries and services that pair well

- Network or attack-path graph: React Flow, Cytoscape.js. Draw nodes and edges with our tokens for color and type; keep the severity text labels.
- Geographic threat or asset map: MapLibre GL JS, deck.gl. map-view is already built on MapLibre GL JS; reach for deck.gl only for very dense layers. Always give each marker a text label for assistive technology.
- Event volume and trend charts: Recharts, uPlot. Use time-series-chart for multi-series trends with thresholds and zoom. uPlot copes with very large series; the chart inside analytics-dashboard is fixed to its own metrics.
- Single sign-on and MFA: Clerk, Auth0, WorkOS. Put the provider's flow behind the auth-screen block (onSubmit and onProvider) and use mfa-step for the second factor, wiring onVerify to the provider.

## Typical screens

- **Security operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Gauge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/gauge.md) + [Time Series Chart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/time-series-chart.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md)
- **Alert queue**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- **Incident detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- **Access management**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md) + [Permission Matrix](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/permission-matrix.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md) + [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- **Audit log**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md) + [Filter Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-bar.md) + [Date Time Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-time-picker.md) + [Description List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/description-list.md) + [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-security
```

## Known gaps

- Triage a stream of alerts: `data-table` pages its rows rather than virtualizing them, so it suits thousands of rows, not an unbounded stream. There is no four-level severity component (use `badge`: Critical to `destructive`, High and Medium to `warning`, Low to `secondary`, always with the word) and no saved-filter control: store the `filter-bar` value yourself.
- Confirm and run response actions: No built-in typed-confirmation or two-person approval component: assemble it from `dialog` + `input` + `button`. Who approved and when comes from your backend.
- Manage users, roles and permissions: `settings-page` roles are fixed to owner, admin, member and viewer; use `permission-matrix` for anything custom. The matrix edits grants only: who may change roles, and enforcement, come from your backend.
- Search and review an audit log: No dedicated audit-log viewer with live tail, saved queries or export; assemble it from `data-table` and `filter-bar`, and page from your backend. `date-range-picker` itself has no time of day, which is why the exact bounds use `date-time-picker`.
- Show security posture and compliance coverage: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are fixed to name, visitors, conversion and duration (relabel or replace the last with `valueColumn`). Prefer `time-series-chart` when you need your own series. Do not present a score as proof of compliance with a standard.
- Sign in with SSO and MFA: `mfa-step` collects and submits a code but the verification, rate limits and lockout come from your auth provider or backend. There is no passkey enrolment screen or SSO-by-domain flow.
- Show assets or attack paths on a map: `map-view` is geographic only. There is no network or attack-path graph (`flowchart` is a workflow canvas). Use a graph library (see integrations) for nodes and edges and keep the entity list in `data-table` beside it.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
