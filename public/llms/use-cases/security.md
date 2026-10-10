# Building Security and compliance products with opendraft

> Security operations, threat detection, access control and audit products. Used by analysts under pressure: dense data, fast triage, irreversible actions.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

security, soc, siem, threat, incident response, vulnerability, edr, iam, access control, audit log, compliance, soc 2, firewall, fraud, zero trust, pentest.

## Principles for this domain

- Never show severity by color alone. Pair every severity color with a text label (Critical, High, Medium, Low) and use the same scale everywhere.
- Show times as absolute UTC in `font-mono` with a relative hint (for example `14:02:09Z · 3 min ago`). Analysts compare timestamps across systems.
- Make destructive or far-reaching actions (isolate a host, revoke a session, delete a key) require confirmation that names the consequence, and show who did it and when afterward.
- Mask secrets by default (tokens, keys, hashes) with an explicit reveal and a `copy-button`. Never log or echo them.
- Favor dense, keyboard-first tables and a `command-palette` for jumping to an entity. Default these products to the dark theme, but keep both themes working.
- Every state change should leave an audit trail the user can see. Plan for an audit-log screen from the start.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Triage a stream of alerts

- Fit: **Adapt**
- Use: [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md)
- How: Use `badge` variants for severity and status; `table` for large live queues, `filter-table` for filtered lists, `selection-actions` for bulk acknowledge or close.
- Missing: No four-level severity scale component; map Critical to `destructive`, High and Medium to `warning`, Low to `secondary`, always with text.

### Investigate an incident: timeline of events and evidence

- Fit: **Gap**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Agent Activity](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/agent-activity.md), [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: A vertical `stepper` covers response stages; `code-block` shows raw events.
- Missing: No timeline or activity-feed component for a chronological event stream.

### Confirm and run response actions

- Fit: **Ready**
- Use: [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Tool Approval](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-approval.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: `approval-card` for an action that needs sign-off, `dialog` with a typed confirmation for the dangerous ones (the settings-page danger zone is the pattern), `sonner` to report the result.

### Manage users, roles and permissions

- Fit: **Adapt**
- Use: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md)
- How: The `settings-page` team section covers invite and role change; `repeater-field` edits rule lists.
- Missing: No permission-matrix (roles by permissions grid) component.

### Search and review an audit log

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Diff Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/diff-table.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- How: Filters plus `date-range-picker`; show what changed with `diff-table` or `file-diff`.

### Show security posture and compliance coverage

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md)
- How: `analytics-dashboard` takes `labels` and `valueColumn` so it can show findings by severity; `progress` for control coverage.
- Missing: No gauge or risk-score ring.

### Sign in with SSO and MFA

- Fit: **Adapt**
- Use: [Auth Screen](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/auth-screen.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md)
- How: `auth-screen` handles email, password and provider buttons.
- Missing: No one-time-code (OTP) input for MFA.

### Ask an AI analyst to summarize or investigate

- Fit: **Ready**
- Use: [Agent Workspace](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/agent-workspace.md), [Thinking Trace](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/thinking-trace.md), [Tool Chips](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-chips.md), [Citations](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/citations.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Pass your own conversations and tasks; have the assistant cite evidence with `citations` and ask before acting with `approval-card`.

### Show assets or attack paths on a map or graph

- Fit: **Gap**
- Use: [Flowchart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/flowchart.md)
- How: `flowchart` draws simple flows.
- Missing: No network graph or geographic map component.

## Libraries and services that pair well

- Network or attack-path graph: React Flow, Cytoscape.js. Draw nodes and edges with our tokens for color and type; keep the severity text labels.
- Geographic threat or asset map: MapLibre GL JS, deck.gl. Style markers with status tokens and always give each marker a text label for assistive technology.
- Event volume and trend charts: Recharts, uPlot. uPlot copes with very large series; Recharts is quicker to theme.
- Single sign-on and MFA: Clerk, Auth0, WorkOS. Put the provider's flow behind the auth-screen block and use otp-input for codes.

## Typical screens

- **Security operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md)
- **Alert queue**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md) + [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- **Incident detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Code Block](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/code-block.md)
- **Access management**: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md)
- **Audit log**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Diff Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/diff-table.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-security
```

## Known gaps

- Triage a stream of alerts: No four-level severity scale component; map Critical to `destructive`, High and Medium to `warning`, Low to `secondary`, always with text.
- Investigate an incident: timeline of events and evidence: No timeline or activity-feed component for a chronological event stream.
- Manage users, roles and permissions: No permission-matrix (roles by permissions grid) component.
- Show security posture and compliance coverage: No gauge or risk-score ring.
- Sign in with SSO and MFA: No one-time-code (OTP) input for MFA.
- Show assets or attack paths on a map or graph: No network graph or geographic map component.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
