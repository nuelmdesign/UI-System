# Building Energy, utilities and EV charging products with opendraft

> Grid operations, smart metering, solar and storage, EV charging networks, field service and customer billing for electricity, gas and water providers. Numbers carry units, time carries a zone, and some actions can hurt people or equipment.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

energy, utility, utilities, grid, smart meter, metering, scada, outage, solar, battery storage, ev charging, ocpp, kwh, tariff, demand response, field service, billing.

## Principles for this domain

- Always show the unit and the magnitude together, in `font-mono` with `tabular-nums`: `4.2 kW`, `18.6 MWh`, `230 V`. `stat` takes any node as `value`, so wrap the number and unit in a `font-mono` span. Do not auto-switch between W, kW and MW inside one column; pick one unit per column and say it in the header.
- Be honest about time series. Label the interval and aggregation (15-min average, hourly sum, daily peak), mark gaps and estimated reads as such instead of drawing a line through them, and never smooth data without saying so.
- Outage and alarm severity uses a fixed scale with a word and an icon, not color alone (for example Critical, Major, Minor, Advisory). Show start time, affected customers or assets, and estimated restoration time with its source.
- Switching, isolating or energizing equipment is guarded by interlocks: show the current state, the precondition that blocks the action, and require a confirmation that names the asset and consequence. Show who did it and when, and never allow a one-click remote switch.
- Show every timestamp with its zone, and show the asset's own local time beside the operator's. Grids span regions, and daylight saving shifts create 23- and 25-hour days; billing periods and tariffs must follow the meter's zone. `date-picker` and `date-range-picker` work on plain calendar dates (and an HH:MM time) with no zone support, so keep the zone in your own data and print it next to the value.
- Separate measured, estimated and forecast values visually and in text (solid, dashed, labeled). A billing or settlement figure always shows its status: actual, estimated or disputed.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Grid and asset status overview

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md)
- How: `stat` tiles for load, generation and frequency (unit inside `value`, `delta` with `goodWhen` for the change chip). `status-indicator` gives a shape plus a word; its five built-in statuses are operational, degraded, down, maintenance and unknown, and `label`, `tone` and `shape` override them for words like Energized or Islanded. `progress` with `tone="auto"` shows headroom against a limit (a full bar turns warning, then destructive). `alert` for active network notices, `badge` for a text severity.
- Missing: `stat` has no threshold or limit marking (use `progress` beside it), and there is no single-line diagram or network topology view.

### Live and historical load, generation and consumption charts

- Fit: **Gap**
- Use: [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: Two partial building blocks exist. `InsightChart` (exported by `insight-cards`) is a small SVG line chart: several lines, optional fill and grid, one dashed `threshold` line (a capacity limit), a hover cursor and a tooltip you fill with your own rows. It draws no axis labels or units, and it smooths lines through Catmull-Rom curves when a line has fewer than 24 points, so pass 24 or more real points to avoid drawn-in curves. `analytics-dashboard` charts one metric at a time (switch metrics with tabs) over fixed 7d, 30d and 90d tabs (relabel with `labels.ranges`, supply your own daily totals), with a table and a share bar underneath. Use a `table` as the text alternative.
- Missing: No real time-series chart: no axes with units, no two-axis view, no zoom, no gap rendering (missing reads cannot be left blank), no dashed forecast series and no intraday range under 7d. Use a charting library for interval data.

### Smart meter list and reads

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Virtualized `table` (needs a pixel `rowHeight`, plus `height` or `maxHeight`) with sortable columns, a meter ID in `font-mono` with `copy-button`, and read quality as a text `badge` (Actual, Estimated, Missing). `selectable` with `getRowId` and `onSelectionChange` (selected ids) lets you show a bulk bar of `button`s for bulk reads or commands. The table has no built-in filter, so add `tabs` or `select` and filter your own data. On phones it scrolls sideways or drops columns, so keep the first column to the meter ID.

### Outage management and restoration tracking

- Fit: **Adapt**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md)
- How: Outage list in `table` with a severity `badge`; each outage's updates in `timeline` (`timestamp`, `status`, and `meta` for the author); restoration stages (reported, crew dispatched, repair, restored) in a vertical `stepper` where each step's `description` can carry the time and the estimated restoration source.
- Missing: No outage map and no affected-area polygon view. `stepper` only makes completed steps clickable.

### EV charging network and charge point status

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Charge points in `table` with a `status-indicator` per connector (use `label`, `tone` and `shape` for Available, Charging, Faulted, Offline since the built-in kinds are service-status words). `progress` for session state of charge: set `tone="brand"` because `tone="auto"` with `invert` would paint a half-charged car as a warning. `stat` for uptime and energy delivered. Filter charger status with `tabs` or `select` over your own data.
- Missing: No station map. `filter-table` is a task table (rows are task, date, status todo|progress|done, owner) and cannot show chargers.

### Start and monitor a charging session (driver)

- Fit: **Adapt**
- Use: [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: Enter the charger code with `otp-input` (set `length` and `pattern="alphanumeric"`), show `progress` (brand tone) for charge level, `stat` for kWh, cost and time remaining, and a clear stop `button`. Use `alert` for a faulted connector.
- Missing: No QR scanner (`qr-code` only renders codes, it cannot read them) and no payment-method selector built for tap-to-pay. `checkout` is an event-ticket flow and does not fit a session payment.

### Solar and battery site dashboard

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Production, consumption, export and battery level in `stat` and `progress` (`invert` so a low battery warns, and pass `valueLabel` such as `64%`). `slider` (with `label`, `formatValue`, `marks` and `onValueCommit` so you save on release) and `switch` for reserve level and backup mode. A day curve can use `InsightChart` from `insight-cards` with 24 or more points.
- Missing: No energy-flow diagram (solar to home to battery to grid) and no multi-axis time-series chart.

### Field service work orders and technician dispatch

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: Work orders in `table`; job detail composed from `page-header`, `tabs`, `stepper` and `timeline` (`detail-page` is an event-ticket purchase page and does not fit). Safety and completion checklist as `checkbox` rows with `progress`; `todo-list` is a read-only display of a plan, not a tickable list. Sign-off through `approval-card` (put a `textarea` for notes in its `children`); photo evidence through `dropzone`, whose `capture="environment"` opens the phone camera.
- Missing: No scheduler or map-based dispatch board, no signature pad, and offline sync of work orders is your app's job.

### Customer billing, usage and tariffs

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Bill summary in `stat`, line items in `table`, budget used in `progress` (consumption tone), a statement period chosen with `date-range-picker`, bill status as a `badge` (Paid, Open, Disputed). Build the payment form from `field`, `input` and `radio-group`, with the provider's hosted card fields.
- Missing: `checkout` and `order-confirmation` are event-ticket shaped (attendee, front-desk delivery, ticket passes) and `settings-page` billing is a SaaS plan panel with a fixed Change plan button, so none fit a utility bill. No usage-versus-tariff-band chart and no bill document viewer; link to the PDF.

### Demand response, switching and control actions

- Fit: **Adapt**
- Use: [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Build the typed-name confirmation yourself in a `dialog` with an `input` that must match the asset name before the confirm `button` enables. `approval-card` shows the parameters in its `children` with Approve, Request changes and Reject (`approveLabel` is relabelable) for one decision; `sonner` for the result; `timeline` for who did what and when; `table` for the pending requests.
- Missing: `approval-card` is a single decision with no approver identity, time or reason field, so two-person sign-off (two cards or two statuses) and the recorded actor come from your code. Interlock rules and permissions come from your control system.

## Libraries and services that pair well

- Time-series charts for load, generation and meter data: Recharts, Apache ECharts, uPlot. opendraft has no general time-series chart (only the small `InsightChart` line chart); theme the library with opendraft's color tokens, and use uPlot or ECharts when you plot tens of thousands of interval reads.
- Maps of outages, substations, feeders and charge points: MapLibre GL JS, Mapbox GL JS, Leaflet. Put the map beside a `table` or `drawer` from opendraft and encode severity with shape and label as well as color, since map tiles change the contrast.
- Live telemetry and charger status: MQTT over WebSockets, OCPP gateway (for example SteVe), Server-Sent Events. Stream into `table` and `stat` and keep the last-update time visible; show a stale state when the feed drops rather than the last value as if it were current.
- Time zones, daylight saving and interval math: Temporal API, date-fns-tz, Luxon. Do billing and interval aggregation in the meter's zone, and format with the zone abbreviation next to `font-mono` timestamps.
- Payments for charging sessions and bills: Stripe, Adyen. Build the payment form with `field` and `input` (opendraft's `checkout` is an event-ticket flow) and let the provider's hosted fields handle card data.
- Barcode and QR scanning for meters, chargers and assets: html5-qrcode, zxing-js, Barcode Detection API. opendraft's `qr-code` only draws codes; add a scanner component and show a manual-entry `field` as the fallback.

## Typical screens

- **Network operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- **Outage detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Charge point network**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- **Work order and field checklist**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Customer usage and bill**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-energy-utilities
```

## Known gaps

- Grid and asset status overview: `stat` has no threshold or limit marking (use `progress` beside it), and there is no single-line diagram or network topology view.
- Live and historical load, generation and consumption charts: No real time-series chart: no axes with units, no two-axis view, no zoom, no gap rendering (missing reads cannot be left blank), no dashed forecast series and no intraday range under 7d. Use a charting library for interval data.
- Outage management and restoration tracking: No outage map and no affected-area polygon view. `stepper` only makes completed steps clickable.
- EV charging network and charge point status: No station map. `filter-table` is a task table (rows are task, date, status todo|progress|done, owner) and cannot show chargers.
- Start and monitor a charging session (driver): No QR scanner (`qr-code` only renders codes, it cannot read them) and no payment-method selector built for tap-to-pay. `checkout` is an event-ticket flow and does not fit a session payment.
- Solar and battery site dashboard: No energy-flow diagram (solar to home to battery to grid) and no multi-axis time-series chart.
- Field service work orders and technician dispatch: No scheduler or map-based dispatch board, no signature pad, and offline sync of work orders is your app's job.
- Customer billing, usage and tariffs: `checkout` and `order-confirmation` are event-ticket shaped (attendee, front-desk delivery, ticket passes) and `settings-page` billing is a SaaS plan panel with a fixed Change plan button, so none fit a utility bill. No usage-versus-tariff-band chart and no bill document viewer; link to the PDF.
- Demand response, switching and control actions: `approval-card` is a single decision with no approver identity, time or reason field, so two-person sign-off (two cards or two statuses) and the recorded actor come from your code. Interlock rules and permissions come from your control system.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
