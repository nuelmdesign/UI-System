# Building Logistics, supply chain and fleet products with opendraft

> Shipment tracking, dispatch, warehouse and fleet products for operators, drivers and customers who need to know where things are and when they'll arrive.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

logistics, shipping, shipment, freight, carrier, courier, delivery, last mile, fleet, driver, dispatch, warehouse, inventory, supply chain, tracking, 3pl, customs, proof of delivery.

## Principles for this domain

- Every shipment shows three things at a glance: status (as a word), where it is, and when it will arrive (an ETA with a confidence or a delay reason). `eta-indicator` shows the estimate as a range with a confidence word and a stale state; `map-view` shows where.
- Tracking IDs, container numbers and SKUs go in `font-mono` with a `copy-button`.
- Exceptions come first: delayed, held and failed deliveries sort to the top (sort your data; `tabs` for Exceptions first) and carry the reason and the next action.
- Show dates and times in the location's own time zone, and say which zone. `date-time-picker` picks a time in a named IANA `timeZone` and can show the same moment in other zones; `eta-indicator` and `scheduler` take a `timeZone` too. Store the zone with the instant.
- Operators work in bulk: lists need row selection with a bulk action bar and filters that survive a reload. `data-table` has `selectable` with `bulkActions`, and `bulk-action-bar` and `filter-bar` stand alone for other layouts; persist the filter value yourself.
- Driver and warehouse screens are used one-handed on a phone: large targets, one primary action per screen, works on a poor connection. `data-table` switches to a card layout when narrow; the virtualized `table` still scrolls sideways, so avoid it on driver screens.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Track one shipment (customer-facing)

- Fit: **Adapt**
- Use: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md), [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md), [ETA Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/eta-indicator.md), [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Description List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/description-list.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `detail-page` is NOT this: it is an event-ticket purchase page. Compose: `site-header`, a `card` with the tracking ID plus `copy-button` and a status `badge`; `eta-indicator` for the estimate (range, confidence word, stale and past-window states, destination `timeZone`); `map-view` for the last known position and route (with a text list of the same stops); `stepper` for milestones with `description` carrying 'time zone · place'; `description-list` for carrier, service and weight; `alert` for a delay or exception. A `timeline` (`time`, ISO `timestamp`, `meta` for the location, `status`) is the better fit for the full scan history. For an internal view of one shipment use the `record-page` block.
- Missing: No ready-made tracking page; compose it from the pieces. Position and ETA values come from your carrier or telematics data; `map-view` does not animate live movement.

### Manage a list of shipments or orders

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Filter Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-bar.md), [Bulk Action Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/bulk-action-bar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: `data-table` block: `columns` (status `badge` and a mono ID with `copy-button` in column `cell`s), `searchable`, `filters` (`filter-bar` chips for carrier, lane, date), `views` for Exceptions, In transit, Delivered, `selectable` with `bulkActions` (Reassign, Hold, Export receive the selected rows), paging and a card layout on phones. Sort exceptions first in your data. For tens of thousands of rows use the virtualized `table` with `filter-bar` and `bulk-action-bar`.
- Missing: No saved filters: keep the `filter-bar` value in your own state or URL.

### Dispatch board

- Fit: **Adapt**
- Use: [Scheduler](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/scheduler.md), [Stage Board](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stage-board.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md)
- How: Two views of the same jobs. `scheduler` block: `resources` are drivers or vehicles, `events` are jobs on a day or week axis, with conflict marking, drag or keyboard reassignment (`onEventMove`) and an agenda on narrow widths. `stage-board` block: columns for Unassigned, Assigned, In transit, Delivered with drag or keyboard moves, WIP `limit`s, per-stage totals and a detail panel. Show unassigned jobs in a `data-table` beside the scheduler.
- Missing: Neither does route optimisation or capacity checks; the UI marks time overlaps only, and assignment rules and ETAs come from your dispatch system.

### Create a shipment or booking

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Address Form](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/address-form.md), [Date Time Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-time-picker.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Wizard with `stepper`; `address-form` for pickup and delivery addresses (per-country rules, postal validation, autocomplete tokens); packages as rows in `repeater-field` (weight, size, quantity with `quantity-stepper`). Pickup window with `date-time-picker` in the pickup location's `timeZone`. Finish with `order-confirmation` relabelled as a booking confirmation (`labels`, `order.lines`, `order.tickets` with `fields` and a `code`).
- Missing: `order-confirmation` is ticket-shaped with a fixed 3-step stepper (rename only) and a QR per ticket. `checkout` is event-booking shaped (name, email, phone, attendee, card) and does not fit. `address-form` does not look up or autocomplete addresses from a provider.

### Fleet and driver overview

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Gauge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/gauge.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)
- How: `StatGroup` for utilization and on-time rate (`delta`, `goodWhen`). `map-view` for vehicle positions: `markers` with a text `label` and `status`, `selectedId` synced to a `data-table` of drivers and vehicles with `avatar` and `StatusIndicator` cells. `gauge` or `progress` for hours or fuel. `analytics-dashboard` works if the shape is KPIs, a trend per metric, a ranked list and a share breakdown; relabel via `labels`, `valueColumn` and the format props.
- Missing: `map-view` shows the positions you pass; it has no live tracking, clustering of thousands of vehicles or geofencing. `analytics-dashboard` ranges are fixed at 7d, 30d and 90d.

### Warehouse inventory and capacity

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Filter Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-bar.md), [Gauge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/gauge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `table` with `editable` columns and `onCellEdit` for counts (`editable` is ignored on a column that sets `cell`), `filter-bar` for zone and SKU. Zones as `progress` or `gauge`: the default `tone="auto"` measures consumption, so a nearly full zone turns warning then destructive; for stock remaining set `invert`. A hardware scanner that types like a keyboard can fill an `input`.
- Missing: No camera barcode scan input and no heat map of locations.

### Proof of delivery

- Fit: **Ready**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Signature Pad](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/signature-pad.md), [Photo Capture](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/photo-capture.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Recipient name in `field` and `input`; a signature with `signature-pad` (drawn or typed name; `onSign` returns the result); photos of the parcel with `photo-capture` (camera or file, `max`, optional captions; `onChange` gives the files); a failure reason in `select`. `qr-code` can show a handover code the recipient presents. Upload the files and stamp time, location and driver from your backend. `qr-code` only generates codes; scanning is a device job.

### Rates, quotes and invoicing

- Fit: **Gap**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md)
- How: Compose: rate options in `data-table` (carrier, service, transit time, price in mono, a select `Button` in a `cell`) or `radio-group` cards, totals in `stat`, invoices in `data-table` with a status `badge`. `checkout` is NOT a quote flow: it is an event-booking checkout with fixed contact and payment fields.
- Missing: No rate-comparison table and no quote or invoice component.

### ETA with confidence or delay reason

- Fit: **Ready**
- Use: [ETA Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/eta-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `eta-indicator` takes `eta`, optional `earliest` and `latest` (drawn as a range bar), a numeric `confidence` mapped to a high, medium or low word with an icon (never color alone), `updatedAt` with a stale state after `staleAfterMs`, a past-window state, and a `timeZone`. Add a `badge` for On time, At risk or Delayed and an `alert` with the reason for a delay. The estimate and confidence are computed by your backend.

### Operations analytics

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Time Series Chart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/time-series-chart.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md)
- How: Relabel `analytics-dashboard` (shipments, on-time rate, cost per delivery) through `labels`, `data` per range, the format props and `valueColumn` for cost. For your own series (volume per hour, on-time rate against a target) use `time-series-chart`: several series, `thresholds`, brush zoom, a named `timeZone` and a data-table fallback.
- Missing: `analytics-dashboard` range tabs are fixed at 7d, 30d and 90d (so no `date-range-picker` link) and its table columns are page-analytics shaped (name, visitors, conversion, duration).

## Libraries and services that pair well

- Live fleet and route map: MapLibre GL JS, Google Maps Platform, HERE. map-view is built on MapLibre GL JS and draws markers, routes and areas. For clustering, geofencing or traffic layers reach for the library directly; keep ETA and status in opendraft components.
- Carrier and tracking data: Shippo, EasyPost, project44. Map each carrier's status codes to one status vocabulary before it reaches the UI.
- Barcode scanning: zxing-js, Dynamsoft, Scandit. Scanning is a device capability; opendraft's qr-code only generates codes and photo-capture takes pictures.
- Signature capture: signature_pad, react-signature-canvas. signature-pad and photo-capture cover proof of delivery; use a library only for exotic needs such as vector signature export.
- Drag and drop for a dispatch board: dnd-kit. stage-board has drag and keyboard moves built in; add dnd-kit only for cross-board or multi-select dragging.
- Time zones: Temporal API, Luxon, date-fns-tz. date-time-picker handles a named zone; use one of these to convert and format stored instants elsewhere.

## Typical screens

- **Public tracking page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md) + [ETA Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/eta-indicator.md) + [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Description List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/description-list.md) + [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Shipments list**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md) + [Filter Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-bar.md) + [Bulk Action Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/bulk-action-bar.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Dispatch board**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Scheduler](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/scheduler.md) + [Stage Board](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stage-board.md) + [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Create shipment**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Address Form](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/address-form.md) + [Date Time Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-time-picker.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md) + [Time Series Chart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/time-series-chart.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-logistics
```

## Known gaps

- Track one shipment (customer-facing): No ready-made tracking page; compose it from the pieces. Position and ETA values come from your carrier or telematics data; `map-view` does not animate live movement.
- Manage a list of shipments or orders: No saved filters: keep the `filter-bar` value in your own state or URL.
- Dispatch board: Neither does route optimisation or capacity checks; the UI marks time overlaps only, and assignment rules and ETAs come from your dispatch system.
- Create a shipment or booking: `order-confirmation` is ticket-shaped with a fixed 3-step stepper (rename only) and a QR per ticket. `checkout` is event-booking shaped (name, email, phone, attendee, card) and does not fit. `address-form` does not look up or autocomplete addresses from a provider.
- Fleet and driver overview: `map-view` shows the positions you pass; it has no live tracking, clustering of thousands of vehicles or geofencing. `analytics-dashboard` ranges are fixed at 7d, 30d and 90d.
- Warehouse inventory and capacity: No camera barcode scan input and no heat map of locations.
- Rates, quotes and invoicing: No rate-comparison table and no quote or invoice component.
- Operations analytics: `analytics-dashboard` range tabs are fixed at 7d, 30d and 90d (so no `date-range-picker` link) and its table columns are page-analytics shaped (name, visitors, conversion, duration).

Docs: https://ui-system-virid.vercel.app/docs/use-cases
