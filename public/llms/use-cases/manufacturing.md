# Building Manufacturing and industrial operations products with opendraft

> Manufacturing execution (MES), shop-floor terminals, quality control, maintenance and industrial IoT dashboards. Used by operators on a feet-and-gloves schedule and by engineers and managers reviewing lines, lots and downtime.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

manufacturing, mes, shop floor, factory, production line, oee, downtime, quality control, inspection, cmms, maintenance, work order, andon, batch, traceability.

## Principles for this domain

- Make state glanceable from across the room. Line, machine and order status uses large type, a word (Running, Idle, Down, Changeover) plus an icon, and high contrast; a wall display needs no reading beyond the status and one number.
- Design for gloves and noise: touch targets of at least 56 px on shop-floor terminals, generous spacing, no hover-only or drag-only actions, and confirmations that do not rely on sound alone. opendraft's largest button (`size="xl"`) is 48 px tall and `checkbox`, `radio-group` and `switch` are 16 to 20 px, so enlarge them with classes or wrap each in a full-width 56 px row that carries the click.
- Every unit of product has traceability: lot, batch, serial, shift, operator and machine appear on the record, in `font-mono` with a `copy-button` and a scannable code, and corrections add a new entry rather than overwrite an old one.
- Rank alarms by priority, not arrival time: Critical (stop and act), Warning (act this shift), Info. Keep alarm text specific (what, where, what to do), require acknowledgement with a name and time, and avoid alarm floods by grouping repeats.
- Show shift and time context everywhere: the current shift, shift start, counts since shift start, and timestamps in the plant's local zone. Handovers between shifts need a visible notes and open-issues summary.
- Tolerate offline and flaky networks: queue entries locally, show an explicit Saved locally, Syncing and Synced state, never lose a count or a quality reading, and show how stale a displayed value is.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Line and machine status wall display (andon)

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Animated Number](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-number.md)
- How: `stat` tiles for output, target and OEE (`value` takes any node, so wrap the number in a large span or `animated-number`; `delta` with `goodWhen` for against-target), a `status-indicator` per machine (relabel with `label`, `tone`, `shape` for Running, Idle, Down, Changeover), `progress` (`size="lg"`) for output against target, `alert` for stoppages.
- Missing: No large-format kiosk or full-screen display mode and no auto-rotating screen layout; build it with a scaled container. `stat` renders its value at a fixed `text-3xl`, so check it reads from across the room and enlarge the node you pass as `value`.

### Production order execution on a terminal

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- How: Work instructions as a vertical `stepper` (each step has a `description` for the instruction text) or as `checkbox` rows. `todo-list` is a read-only plan display with no tick action, and `detail-page` is an event-ticket page, so neither fits. `quantity-stepper` (`min`, `max`, `step`, hold-to-repeat) for good and scrap counts, `progress` for count against order quantity, `approval-card` or a `dialog` to confirm completion.
- Missing: Controls are desktop sized (`button` tops out at 48 px, `quantity-stepper` has only `sm` and default), so set larger sizes through classes and verify 56 px targets. `stepper` only makes completed steps clickable. No barcode scan input or numeric keypad (use an `input` with `inputMode="numeric"`).

### Quality inspection and checklists

- Fit: **Adapt**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: One `radio-group` (Pass, Fail, N/A) per inspection step inside a `field`, a measured value in `input`, notes in `textarea`, defect photos in `dropzone` (`capture="environment"` opens the camera), sign-off in `approval-card`, and past inspections in `table`. `todo-list` is a read-only plan and `records-table` is a fixed contact-list grid (name, tags, last, strength), so neither fits.
- Missing: No statistical process control chart (X-bar, control limits; `InsightChart` in `insight-cards` draws only one dashed threshold) and no measurement-instrument input.

### Alarm and event management

- Fit: **Adapt**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: Alarm list in `table` sorted by priority with a text `badge`; `selectable` with `getRowId` and `onSelectionChange` (selected ids) plus a bar of `button`s for bulk acknowledge (`selection-actions` is an AI text-rewrite bar, not a bulk bar); `tabs` for Active and Acknowledged; `timeline` for the event history; `alert` for the active critical banner.
- Missing: No alarm-shelving or suppression workflow and no audible alarm control; those are logic you build around `table`.

### Downtime and OEE analysis

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- How: OEE, availability, performance and quality in `stat` and `progress`. `analytics-dashboard` can be relabelled for machines: each row is `name` (machine), `visitors` (a count, such as stops), `conversion` (a 0 to 1 rate, such as availability) and `duration` (seconds, such as downtime), with `valueColumn` for one custom number; the share bar can show downtime reasons by percent. The chart plots one metric at a time with no axes. `date-range-picker` for custom periods.
- Missing: No Pareto chart (the share bar has no cumulative line), no stacked shift-by-shift time-series chart, the chart smooths curves below 24 points, and the range tabs are fixed to the keys 7d, 30d and 90d (relabel them with `labels.ranges` and supply your own data per key).

### Maintenance work orders and preventive schedules

- Fit: **Gap**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md)
- How: Work orders in `table` (status `badge`, due date from `date-picker` in ISO form), job page composed from `page-header`, `tabs`, `checkbox` rows and `stepper`, history in `timeline`, sign-off in `approval-card`. `detail-page` is an event-ticket page and `todo-list` is read-only, so they do not fit.
- Missing: No scheduler, calendar or Gantt for planned maintenance, no recurrence rules in `date-picker`, and no meter-based trigger view.

### Lot, batch and serial traceability

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md)
- How: Search a lot with an `input` that queries your API (`command-palette` filters only an in-memory `items` list, with no query callback, so it suits a small set), show genealogy rows in `table`, record history in `timeline`, ID in `font-mono` with `copy-button`, and a label preview with `qr-code`. `records-table` is a fixed contact-list grid and does not fit.
- Missing: No tree or graph view for forward and backward genealogy (`flowchart` is a two-card trigger and if-else canvas), and no barcode formats other than QR (Code 128, DataMatrix).

### Equipment and sensor live data

- Fit: **Gap**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- How: Current readings in `stat` and `table` with unit and last-update time; `progress` as a linear gauge against a limit. A short trend can use `InsightChart` from `insight-cards` (several lines and one dashed threshold, 24 or more points to avoid smoothing). `slider` (`onValueCommit`) and `switch` can drive setpoints, behind a `dialog` confirmation.
- Missing: No gauge or dial, no full time-series trend chart with axes and units, and no P&ID or floor-plan view. Writes to a PLC need your own interlocks and confirmation.

### Inventory, materials and shift handover

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md)
- How: Stock levels as `progress` with `invert` so low stock warns (the bar measures what remains), counts with `quantity-stepper`, handover notes in `textarea` and posted to a `timeline`, open issues in `table`.
- Missing: No barcode scan input and no pick list or kanban board for material requests (`crm-pipeline` is a sales board with a USD value on every card).

## Libraries and services that pair well

- Machine and sensor data over industrial protocols: OPC UA, MQTT with Sparkplug B, Node-RED. Bridge to the browser through a gateway or WebSocket and show the timestamp from the source, not the browser's receive time, so stale data is obvious.
- Time-series storage and trend charts: InfluxDB or TimescaleDB with Grafana, Apache ECharts, uPlot. Grafana panels can be embedded beside opendraft `stat` tiles; opendraft has no native time-series chart yet, so a library must draw trends.
- Barcode and QR scanning on the floor: Hardware scanners that act as keyboards, Zebra DataWedge, zxing-js. Most scanners type into a focused field; keep one large focused `input` ready and show the scanned value back clearly. `qr-code` only renders codes.
- ERP, MES and quality system connections: SAP, Oracle NetSuite, ISA-95 based middleware. Keep the order, lot and BOM data read through your API and write corrections as new records, which matches the audit trail the UI shows.
- Offline-first data and sync on terminals: PowerSync, RxDB, Workbox with IndexedDB. Surface the Saved locally, Syncing and Synced state with a `badge` and use `sonner` only for failures that need action.
- Label and document printing: Zebra Browser Print, ZPL over a print server. Render the on-screen label with `qr-code` and `font-mono` text, then send the matching ZPL to the printer.

## Typical screens

- **Line status wall display**: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Operator work order terminal**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Quality inspection**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Alarm console**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Plant performance overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-manufacturing
```

## Known gaps

- Line and machine status wall display (andon): No large-format kiosk or full-screen display mode and no auto-rotating screen layout; build it with a scaled container. `stat` renders its value at a fixed `text-3xl`, so check it reads from across the room and enlarge the node you pass as `value`.
- Production order execution on a terminal: Controls are desktop sized (`button` tops out at 48 px, `quantity-stepper` has only `sm` and default), so set larger sizes through classes and verify 56 px targets. `stepper` only makes completed steps clickable. No barcode scan input or numeric keypad (use an `input` with `inputMode="numeric"`).
- Quality inspection and checklists: No statistical process control chart (X-bar, control limits; `InsightChart` in `insight-cards` draws only one dashed threshold) and no measurement-instrument input.
- Alarm and event management: No alarm-shelving or suppression workflow and no audible alarm control; those are logic you build around `table`.
- Downtime and OEE analysis: No Pareto chart (the share bar has no cumulative line), no stacked shift-by-shift time-series chart, the chart smooths curves below 24 points, and the range tabs are fixed to the keys 7d, 30d and 90d (relabel them with `labels.ranges` and supply your own data per key).
- Maintenance work orders and preventive schedules: No scheduler, calendar or Gantt for planned maintenance, no recurrence rules in `date-picker`, and no meter-based trigger view.
- Lot, batch and serial traceability: No tree or graph view for forward and backward genealogy (`flowchart` is a two-card trigger and if-else canvas), and no barcode formats other than QR (Code 128, DataMatrix).
- Equipment and sensor live data: No gauge or dial, no full time-series trend chart with axes and units, and no P&ID or floor-plan view. Writes to a PLC need your own interlocks and confirmation.
- Inventory, materials and shift handover: No barcode scan input and no pick list or kanban board for material requests (`crm-pipeline` is a sales board with a USD value on every card).

Docs: https://ui-system-virid.vercel.app/docs/use-cases
