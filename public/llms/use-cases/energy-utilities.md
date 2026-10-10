# Building Energy, utilities and EV charging products with opendraft

> Grid operations, smart metering, solar and storage, EV charging networks, field service and customer billing for electricity, gas and water providers. Numbers carry units, time carries a zone, and some actions can hurt people or equipment.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

energy, utility, utilities, grid, smart meter, metering, scada, outage, solar, battery storage, ev charging, ocpp, kwh, tariff, demand response, field service, billing.

## Principles for this domain

- Always show the unit and the magnitude together, in `font-mono` with `tabular-nums`: `4.2 kW`, `18.6 MWh`, `230 V`. Do not auto-switch between W, kW and MW inside one column; pick one unit per column and say it in the header.
- Be honest about time series. Label the interval and aggregation (15-min average, hourly sum, daily peak), mark gaps and estimated reads as such instead of drawing a line through them, and never smooth data without saying so.
- Outage and alarm severity uses a fixed scale with a word and an icon, not color alone (for example Critical, Major, Minor, Advisory). Show start time, affected customers or assets, and estimated restoration time with its source.
- Switching, isolating or energizing equipment is guarded by interlocks: show the current state, the precondition that blocks the action, and require a confirmation that names the asset and consequence. Show who did it and when, and never allow a one-click remote switch.
- Show every timestamp with its zone, and show the asset's own local time beside the operator's. Grids span regions, and daylight saving shifts create 23- and 25-hour days; billing periods and tariffs must follow the meter's zone.
- Separate measured, estimated and forecast values visually and in text (solid, dashed, labeled). A billing or settlement figure always shows its status: actual, estimated or disputed.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Grid and asset status overview

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)
- How: `stat` tiles for load, generation and frequency with the unit inside `value`; `status-indicator` plus a text `badge` per substation or feeder; `alert` for active network notices.
- Missing: `stat` has a change chip but no threshold or limit marking, and there is no single-line diagram or network topology view.

### Live and historical load, generation and consumption charts

- Fit: **Gap**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- How: `analytics-dashboard` and `insight-cards` can show a trend and totals for a coarse range.
- Missing: No general time-series chart with several series, units on two axes, zoom, thresholds, gap rendering and forecast overlays.

### Smart meter list and reads

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- How: Virtualized `table` with sortable columns, a meter ID in `font-mono` with `copy-button`, read quality shown as a text `badge` (Actual, Estimated, Missing), and `selection-actions` for bulk reads or commands.

### Outage management and restoration tracking

- Fit: **Adapt**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Outage list in `table` with severity `badge`; each outage's updates in `timeline`; restoration stages (reported, crew dispatched, repair, restored) in a vertical `stepper`.
- Missing: No outage map and no affected-area polygon view.

### EV charging network and charge point status

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md)
- How: Charge points in `table` with connector status words (Available, Charging, Faulted, Offline); `progress` with `invert` for session state of charge; `stat` for uptime and energy delivered.
- Missing: No station map, and `filter-table` is task shaped (todo, progress, done) so use `table` with your own filter controls for charger statuses.

### Start and monitor a charging session (driver)

- Fit: **Adapt**
- Use: [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: Scan or enter a charger code, show `progress` for charge level, `stat` for kWh, cost and time remaining, and a clear stop `button`. Use `alert` for a faulted connector.
- Missing: No QR scanner (`qr-code` only renders codes) and no payment-method selector built for tap-to-pay.

### Solar and battery site dashboard

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md)
- How: Production, consumption, export and battery level in `stat` and `progress` (use `invert` so a low battery warns); `slider` and `switch` for reserve level and backup mode.
- Missing: No energy-flow diagram (solar to home to battery to grid) and no multi-series time-series chart.

### Field service work orders and technician dispatch

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md)
- How: Work orders in `table`; job detail in `detail-page`; safety and completion checklist in `todo-list` with sign-off through `approval-card`; photo evidence through `dropzone`.
- Missing: No scheduler or map-based dispatch board, no signature pad, and offline sync of work orders is your app's job.

### Customer billing, usage and tariffs

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: Bill summary in `stat`, line items in `table`, budget used in `progress` (consumption tone), payment through `checkout`, receipts through `order-confirmation`.
- Missing: No usage-versus-tariff-band chart (time-of-use bands) and no bill document viewer; render the PDF with an external viewer.

### Demand response, switching and control actions

- Fit: **Ready**
- Use: [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Tool Approval](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tool-approval.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: Use `dialog` with a typed asset name for switching or load shedding, `approval-card` for two-person sign-off, `sonner` for the result, and `timeline` for who did what and when. Interlock rules and permissions still come from your control system.

## Libraries and services that pair well

- Time-series charts for load, generation and meter data: Recharts, Apache ECharts, uPlot. opendraft has no general time-series chart yet; theme the library with opendraft's color tokens, and use uPlot or ECharts when you plot tens of thousands of interval reads.
- Maps of outages, substations, feeders and charge points: MapLibre GL JS, Mapbox GL JS, Leaflet. Put the map beside a `table` or `drawer` from opendraft and encode severity with shape and label as well as color, since map tiles change the contrast.
- Live telemetry and charger status: MQTT over WebSockets, OCPP gateway (for example SteVe), Server-Sent Events. Stream into `table` and `stat` and keep the last-update time visible; show a stale state when the feed drops rather than the last value as if it were current.
- Time zones, daylight saving and interval math: Temporal API, date-fns-tz, Luxon. Do billing and interval aggregation in the meter's zone, and format with the zone abbreviation next to `font-mono` timestamps.
- Payments for charging sessions and bills: Stripe, Adyen. Pair with `checkout` for the form layout and let the provider's hosted fields handle card data.
- Barcode and QR scanning for meters, chargers and assets: html5-qrcode, zxing-js, Barcode Detection API. opendraft's `qr-code` only draws codes; add a scanner component and show a manual-entry `field` as the fallback.

## Typical screens

- **Network operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- **Outage detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Charge point network**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- **Work order and field checklist**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md) + [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md)
- **Customer usage and bill**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-energy-utilities
```

## Known gaps

- Grid and asset status overview: `stat` has a change chip but no threshold or limit marking, and there is no single-line diagram or network topology view.
- Live and historical load, generation and consumption charts: No general time-series chart with several series, units on two axes, zoom, thresholds, gap rendering and forecast overlays.
- Outage management and restoration tracking: No outage map and no affected-area polygon view.
- EV charging network and charge point status: No station map, and `filter-table` is task shaped (todo, progress, done) so use `table` with your own filter controls for charger statuses.
- Start and monitor a charging session (driver): No QR scanner (`qr-code` only renders codes) and no payment-method selector built for tap-to-pay.
- Solar and battery site dashboard: No energy-flow diagram (solar to home to battery to grid) and no multi-series time-series chart.
- Field service work orders and technician dispatch: No scheduler or map-based dispatch board, no signature pad, and offline sync of work orders is your app's job.
- Customer billing, usage and tariffs: No usage-versus-tariff-band chart (time-of-use bands) and no bill document viewer; render the PDF with an external viewer.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
