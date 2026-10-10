# Building IT, DevOps and infrastructure products with opendraft

> Monitoring, incident management, deployments, logs and internal tools for engineers and IT teams.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

devops, sre, infrastructure, monitoring, observability, uptime, status page, deployment, ci/cd, pipeline, logs, kubernetes, cloud, helpdesk, it service, on-call, incident, internal tool, admin panel.

## Principles for this domain

- Status needs a word and a shape, not just a color: Operational, Degraded, Down, Maintenance. `status-indicator` already uses exactly this vocabulary (plus Unknown) with a distinct shape per state; keep one vocabulary across the product.
- Show times in UTC with `font-mono`, and let the user switch to local time in one place (a single setting or toggle that every screen reads; `settings-page` has a timezone select in its profile section).
- Numbers that change should use `tabular-nums` so columns don't jitter; use `animated-number` sparingly on dashboards, never in tables or logs.
- Long-running work (deploys, migrations) shows progress, current step and a way to cancel. Never leave a spinner with no step. Cancel is a `Button` you add; none of the progress components includes one.
- Provide a copy button next to every ID, command, hash and URL.
- Treat logs and code as data: monospaced, wrap toggle, selectable, searchable. `code-block` has a `wrap` prop and line numbers; search and filtering are yours to build.
- Never put real secrets in props that end up in client bundles or logs; show masked values and fetch reveals on demand.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Service health overview

- Fit: **Ready**
- Use: [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: `StatusIndicator` (`status` operational, degraded, down, maintenance, unknown; optional `pulse`) next to each service name, and `UptimeBar` for the 90-day bars: pass `segments` (one `{status, label}` per day), `uptime` text and `name` for the accessible summary. `stat` tiles for headline numbers, `progress` for quota use, `alert` (info or warning, `banner`) for planned maintenance.

### Public status page

- Fit: **Ready**
- Use: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: `alert` banner for the current incident, `StatusIndicator` and `UptimeBar` per component, and `timeline` for past incident updates (newest first, `collapsible` with `max`).

### Incident management and on-call

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md)
- How: Incident list in `table` (severity and status as `badge` cells, `tabs` for Open, Mitigated, Resolved). Incident updates in `timeline` (`status` warning, destructive, current, success; expandable `children` for notes). Lifecycle stages (Investigating, Identified, Monitoring, Resolved) in `stepper`. Runbook steps as `checkbox` rows. `todo-list` is a read-only display of an agent's task plan with no check-off, so it does not fit a human runbook.
- Missing: No on-call schedule or rota view and no paging or acknowledge control; build the rota as a `table` with `avatar` and `badge`.

### Browse and search logs

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: Use the virtualized `table` with fixed `rowHeight`, mono cells, a level `badge` column, `onEndReached` and `loading` for paging, and `input`, `select` and `tabs` above it for search and level filters. `code-block` (`showLineNumbers`, `highlightLines`, `wrap`, `maxHeight`, `copyable`, `status="streaming"`) shows one entry's full payload or a stack trace. `code-panel` is not suited: it is a small sample-shaped card capped at about 420px wide.
- Missing: No log viewer. There is no follow or live-tail mode, so you append rows to `data` and manage scroll position yourself; no match highlighting; columns hide into a sideways scroll on phones.

### Metrics dashboards

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: `analytics-dashboard` gives KPI cards with deltas, a per-metric trend chart, a ranked table and a share breakdown; relabel it through `labels` and feed it `data` per range. `InsightChart` is exported from the `insight-cards` file: it plots several lines (`lines` of `{id, values, tone}`), an optional dashed `threshold`, hover cursor and `tooltip`, which suits a latency or error-rate chart with an alert threshold. `date-range-picker` takes YYYY-MM-DD dates.
- Missing: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are name, visitors, conversion and duration (swap the last for `valueColumn`). `InsightChart` has no axes, zoom or legend; it needs your own wrapper (it is also driven by controlled `index` and `onIndexChange`). For real time-series work use a chart library.

### Deployments and pipelines

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Stages in a `stepper` (use `description` for the commit, duration or environment). `todo-list` can show live step progress for a running deploy (`items` with `status` pending, in-progress, completed, cancelled, per-item `progress` and `detail`), but it is styled as an agent plan. Deploy history in `timeline`. Gate production with `approval-card`; show the change with `file-diff`. Add your own Cancel `Button`.
- Missing: No pipeline or dependency graph. `flowchart` is NOT a status graph: it is an editable Trigger and If/Else workflow canvas with draggable cards and condition chips. `task-rows` is payment-shaped (label, amount, details) and does not fit.

### Configuration, environment variables and secrets

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md)
- How: `repeater-field` (`value`, `renderRow`, `createItem`, `min`, `max`) for key and value rows, with an `input` pair per row. Show a config change before saving with `file-diff`. Use `dialog` to confirm changes to production.
- Missing: No masked key-value editor. Use `input type="password"` plus your own show button for values.

### Inventory of servers, services or assets

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md)
- How: Virtualized `table` for thousands of rows: sortable, resizable and reorderable columns, `selectable` with `onSelectionChange`, inline `editable` cells with `onCellEdit`. Show a bulk bar of `Button`s when rows are selected. Filter your own data. `records-table` is NOT a general grid: it is an AI spreadsheet with fixed {name, tags, last, strength, website} rows.

### Command or terminal-style tools

- Fit: **Gap**
- Use: [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Kbd](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/kbd.md)
- How: `command-palette` runs actions (items with `onSelect`, groups, hints and keywords). `code-block` can show command output, appended as it streams (`status="streaming"`). `agent-screen` is NOT a terminal: it is a card that views an agent's remote screen image or video.
- Missing: No terminal emulator (no PTY, ANSI colors or input line). Embed one such as xterm.js if users need a real shell.

### Team, access and settings

- Fit: **Ready**
- Use: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: Pass the real workspace name, members and billing; `sections` chooses which tabs show. Team roles are fixed to owner, admin, member and viewer.

### AI assistant for operations

- Fit: **Ready**
- Use: [Agent Workspace](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/agent-workspace.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Tool Approval](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-approval.md), [Citations](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/citations.md)
- How: Supply `conversations`, `messages` and an `onSend` that returns the reply. Ask for approval (`approval-card` or `tool-approval`) before any action that changes production.

## Libraries and services that pair well

- Metrics and time-series dashboards: Recharts, uPlot, Apache ECharts. Wrap the chart so colors come from CSS variables, and show a table fallback for accessibility.
- Log search at scale: OpenSearch, Loki, Elasticsearch. The Table is already virtualized; for millions of lines the filtering and paging belong server-side (feed it with onEndReached).
- Pipeline and dependency graphs: React Flow, Dagre layout. Use stepper or timeline for linear pipelines and a graph library when stages branch or users must pan and zoom.
- Terminal emulator: xterm.js. opendraft has no terminal; theme xterm.js with the code font and background tokens.
- Live updates: Server-sent events, WebSockets, Ably. Update rows in place and highlight what changed without moving the layout under the cursor.

## Typical screens

- **Status overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- **Incident list and detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md)
- **Deployments**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Logs**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md)
- **Public status page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Settings and access**: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-it-infrastructure
```

## Known gaps

- Incident management and on-call: No on-call schedule or rota view and no paging or acknowledge control; build the rota as a `table` with `avatar` and `badge`.
- Browse and search logs: No log viewer. There is no follow or live-tail mode, so you append rows to `data` and manage scroll position yourself; no match highlighting; columns hide into a sideways scroll on phones.
- Metrics dashboards: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are name, visitors, conversion and duration (swap the last for `valueColumn`). `InsightChart` has no axes, zoom or legend; it needs your own wrapper (it is also driven by controlled `index` and `onIndexChange`). For real time-series work use a chart library.
- Deployments and pipelines: No pipeline or dependency graph. `flowchart` is NOT a status graph: it is an editable Trigger and If/Else workflow canvas with draggable cards and condition chips. `task-rows` is payment-shaped (label, amount, details) and does not fit.
- Configuration, environment variables and secrets: No masked key-value editor. Use `input type="password"` plus your own show button for values.
- Command or terminal-style tools: No terminal emulator (no PTY, ANSI colors or input line). Embed one such as xterm.js if users need a real shell.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
