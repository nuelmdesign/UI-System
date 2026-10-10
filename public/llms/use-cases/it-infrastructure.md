# Building IT, DevOps and infrastructure products with opendraft

> Monitoring, incident management, deployments, logs and internal tools for engineers and IT teams.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

devops, sre, infrastructure, monitoring, observability, uptime, status page, deployment, ci/cd, pipeline, logs, kubernetes, cloud, helpdesk, it service, on-call, incident, internal tool, admin panel.

## Principles for this domain

- Status needs a word and a shape, not just a color: Operational, Degraded, Down, Maintenance. Keep one status vocabulary across the product.
- Show times in UTC with `font-mono`, and let the user switch to local time in one place.
- Numbers that change should use `tabular-nums` so columns don't jitter; use `animated-number` sparingly on dashboards, never in tables or logs.
- Long-running work (deploys, migrations) shows progress, current step and a way to cancel. Never leave a spinner with no step.
- Provide a copy button next to every ID, command, hash and URL.
- Treat logs and code as data: monospaced, wrap toggle, selectable, searchable.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Service health overview

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)
- How: `stat` tiles with a status `badge` per service; `analytics-dashboard` for the trend.
- Missing: No status-indicator or uptime-bar component (the 90-day colored bars).

### Incident management and on-call

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md)
- How: Incident list in a `table`; response steps in `todo-list`.
- Missing: No timeline component for incident updates.

### Browse and search logs

- Fit: **Adapt**
- Use: [Code Panel](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-panel.md), [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: A virtualized `table` handles very long lists; `code-block` for a single entry.
- Missing: No log viewer with live tail, level filtering and highlight.

### Metrics dashboards

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: Relabel `analytics-dashboard`; `insight-cards` has chart cards.
- Missing: No general time-series chart with several series, zoom and thresholds.

### Deployments and pipelines

- Fit: **Ready**
- Use: [Flowchart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/flowchart.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Task Rows](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/task-rows.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Pipeline stages in `flowchart` or a vertical `stepper`; gate a production deploy with `approval-card`; show the change with `file-diff`.

### Configuration, environment variables and secrets

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- How: `repeater-field` for key and value rows; mask values and reveal on demand.
- Missing: No dedicated masked key-value editor.

### Inventory of servers, services or assets

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md)
- How: Virtualized `table` for thousands of rows; `records-table` for editable records.

### Command or terminal-style tools

- Fit: **Adapt**
- Use: [Code Panel](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-panel.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Agent Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/agent-screen.md)
- How: `command-palette` for actions; `code-panel` for output.
- Missing: No real terminal emulator.

### Team, access and settings

- Fit: **Ready**
- Use: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: Pass the real workspace name, members and billing.

### AI assistant for operations

- Fit: **Ready**
- Use: [Agent Workspace](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/agent-workspace.md), [Thinking Trace](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/thinking-trace.md), [Tool Chips](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-chips.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Ask for approval before any action that changes production.

## Libraries and services that pair well

- Metrics and time-series dashboards: Recharts, uPlot, Apache ECharts. Wrap the chart so colors come from CSS variables, and show a table fallback for accessibility.
- Log search at scale: TanStack Virtual, OpenSearch, Loki. The Table is already virtualized; for millions of lines the work belongs server-side.
- Pipeline and dependency graphs: React Flow, Dagre layout. Use flowchart for simple flows and a graph library when users must pan, zoom and edit.
- Live updates: Server-sent events, WebSockets, Ably. Update rows in place and highlight what changed without moving the layout under the cursor.

## Typical screens

- **Status overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)
- **Incident list and detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md)
- **Deployments**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Flowchart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/flowchart.md) + [Task Rows](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/task-rows.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Logs**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md) + [Code Panel](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-panel.md)
- **Settings and access**: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-it-infrastructure
```

## Known gaps

- Service health overview: No status-indicator or uptime-bar component (the 90-day colored bars).
- Incident management and on-call: No timeline component for incident updates.
- Browse and search logs: No log viewer with live tail, level filtering and highlight.
- Metrics dashboards: No general time-series chart with several series, zoom and thresholds.
- Configuration, environment variables and secrets: No dedicated masked key-value editor.
- Command or terminal-style tools: No real terminal emulator.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
