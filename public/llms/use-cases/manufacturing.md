# Building Manufacturing and industrial operations products with opendraft

> Manufacturing execution (MES), shop-floor terminals, quality control, maintenance and industrial IoT dashboards. Used by operators on a feet-and-gloves schedule and by engineers and managers reviewing lines, lots and downtime.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

manufacturing, mes, shop floor, factory, production line, oee, downtime, quality control, inspection, cmms, maintenance, work order, andon, batch, traceability.

## Principles for this domain

- Make state glanceable from across the room. Line, machine and order status uses large type, a word (Running, Idle, Down, Changeover) plus an icon, and high contrast; a wall display needs no reading beyond the status and one number.
- Design for gloves and noise: touch targets of at least 56 px on shop-floor terminals, generous spacing, no hover-only or drag-only actions, and confirmations that do not rely on sound alone.
- Every unit of product has traceability: lot, batch, serial, shift, operator and machine appear on the record, in `font-mono` with a `copy-button` and a scannable code, and corrections add a new entry rather than overwrite an old one.
- Rank alarms by priority, not arrival time: Critical (stop and act), Warning (act this shift), Info. Keep alarm text specific (what, where, what to do), require acknowledgement with a name and time, and avoid alarm floods by grouping repeats.
- Show shift and time context everywhere: the current shift, shift start, counts since shift start, and timestamps in the plant's local zone. Handovers between shifts need a visible notes and open-issues summary.
- Tolerate offline and flaky networks: queue entries locally, show an explicit Saved locally, Syncing and Synced state, never lose a count or a quality reading, and show how stale a displayed value is.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Line and machine status wall display (andon)

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Animated Number](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-number.md)
- How: Large `stat` tiles for output, target and OEE with a `status-indicator` and status `badge` per machine; `progress` for output against target; `alert` for stoppages.
- Missing: No large-format kiosk or full-screen display mode, and no auto-rotating screen layout; build it with a scaled container.

### Production order execution on a terminal

- Fit: **Adapt**
- Use: [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- How: Work instructions as a vertical `stepper` or `todo-list`, `quantity-stepper` for good and scrap counts, `approval-card` to confirm completion.
- Missing: Default control sizes are desktop sized; set larger button and stepper sizes through classes and verify 56 px targets. No barcode scan input or numeric keypad.

### Quality inspection and checklists

- Fit: **Adapt**
- Use: [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: Inspection steps in `todo-list`, pass or fail in `radio-group`, defect photos in `dropzone`, sign-off in `approval-card`, and history in `records-table`.
- Missing: No statistical process control chart (X-bar, control limits) and no measurement-instrument input.

### Alarm and event management

- Fit: **Adapt**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: Alarm list in `table` sorted by priority with a text `badge`, `selection-actions` for bulk acknowledge, `timeline` for the event history, `alert` for the active critical banner.
- Missing: No alarm-shelving or suppression workflow and no audible alarm control; those are logic you build around `table`.

### Downtime and OEE analysis

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- How: OEE, availability, performance and quality in `stat` and `progress`; downtime reasons in `table`; `analytics-dashboard` relabeled for machines.
- Missing: No Pareto chart, no stacked shift-by-shift time-series chart, and the dashboard range tabs are fixed at 7, 30 and 90 days.

### Maintenance work orders and preventive schedules

- Fit: **Gap**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: Work orders in `table` and `detail-page`, checklists in `todo-list`, history in `timeline`.
- Missing: No scheduler, calendar or Gantt for planned maintenance and no meter-based trigger view.

### Lot, batch and serial traceability

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Search a lot with `command-palette`, show genealogy in `table`, record history in `timeline`, and print a label with `qr-code`.
- Missing: No tree or graph view for forward and backward genealogy, and no barcode formats other than QR (Code 128, DataMatrix).

### Equipment and sensor live data

- Fit: **Gap**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md)
- How: Current readings in `stat` and `table` with unit and last-update time.
- Missing: No live time-series trend chart, no gauge or dial, and no P&ID or floor-plan view. `slider` and `switch` are fine for setpoints, but writes to a PLC need your own interlocks and confirmation.

### Inventory, materials and shift handover

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md)
- How: Stock levels as `progress` with `invert` so low stock warns; handover notes in `textarea` and `timeline`.
- Missing: No barcode scan input and no pick list or kanban board for material requests.

## Libraries and services that pair well

- Machine and sensor data over industrial protocols: OPC UA, MQTT with Sparkplug B, Node-RED. Bridge to the browser through a gateway or WebSocket and show the timestamp from the source, not the browser's receive time, so stale data is obvious.
- Time-series storage and trend charts: InfluxDB or TimescaleDB with Grafana, Apache ECharts, uPlot. Grafana panels can be embedded beside opendraft `stat` tiles; opendraft has no native time-series chart yet, so a library must draw trends.
- Barcode and QR scanning on the floor: Hardware scanners that act as keyboards, Zebra DataWedge, zxing-js. Most scanners type into a focused field; keep one large focused `input` ready and show the scanned value back clearly. `qr-code` only renders codes.
- ERP, MES and quality system connections: SAP, Oracle NetSuite, ISA-95 based middleware. Keep the order, lot and BOM data read through your API and write corrections as new records, which matches the audit trail the UI shows.
- Offline-first data and sync on terminals: PowerSync, RxDB, Workbox with IndexedDB. Surface the Saved locally, Syncing and Synced state with a `badge` and use `sonner` only for failures that need action.
- Label and document printing: Zebra Browser Print, ZPL over a print server. Render the on-screen label with `qr-code` and `font-mono` text, then send the matching ZPL to the printer.

## Typical screens

- **Line status wall display**: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Operator work order terminal**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Quality inspection**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Alarm console**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Plant performance overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-manufacturing
```

## Known gaps

- Line and machine status wall display (andon): No large-format kiosk or full-screen display mode, and no auto-rotating screen layout; build it with a scaled container.
- Production order execution on a terminal: Default control sizes are desktop sized; set larger button and stepper sizes through classes and verify 56 px targets. No barcode scan input or numeric keypad.
- Quality inspection and checklists: No statistical process control chart (X-bar, control limits) and no measurement-instrument input.
- Alarm and event management: No alarm-shelving or suppression workflow and no audible alarm control; those are logic you build around `table`.
- Downtime and OEE analysis: No Pareto chart, no stacked shift-by-shift time-series chart, and the dashboard range tabs are fixed at 7, 30 and 90 days.
- Maintenance work orders and preventive schedules: No scheduler, calendar or Gantt for planned maintenance and no meter-based trigger view.
- Lot, batch and serial traceability: No tree or graph view for forward and backward genealogy, and no barcode formats other than QR (Code 128, DataMatrix).
- Equipment and sensor live data: No live time-series trend chart, no gauge or dial, and no P&ID or floor-plan view. `slider` and `switch` are fine for setpoints, but writes to a PLC need your own interlocks and confirmation.
- Inventory, materials and shift handover: No barcode scan input and no pick list or kanban board for material requests.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
