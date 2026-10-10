# Building Logistics, supply chain and fleet products with opendraft

> Shipment tracking, dispatch, warehouse and fleet products for operators, drivers and customers who need to know where things are and when they'll arrive.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

logistics, shipping, shipment, freight, carrier, courier, delivery, last mile, fleet, driver, dispatch, warehouse, inventory, supply chain, tracking, 3pl, customs, proof of delivery.

## Principles for this domain

- Every shipment shows three things at a glance: status (as a word), where it is, and when it will arrive (an ETA with a confidence or a delay reason). opendraft has no ETA-confidence component; compose `stat` (value, `hint`) with a `badge`.
- Tracking IDs, container numbers and SKUs go in `font-mono` with a `copy-button`.
- Exceptions come first: delayed, held and failed deliveries sort to the top (sort your data; `tabs` for Exceptions first) and carry the reason and the next action.
- Show dates and times in the location's own time zone, and say which zone. `date-picker` has an HH:MM field but no time zone, so keep the zone in a separate `select` and format with `Intl.DateTimeFormat` and `timeZone`.
- Operators work in bulk: lists need row selection with a bulk action bar (`table` with `selectable` and `onSelectionChange`, plus `Button`s you render), and filters that survive a reload.
- Driver and warehouse screens are used one-handed on a phone: large targets, one primary action per screen, works on a poor connection. `table` scrolls sideways on phones and has no card mode, so use stacked `card`s there.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Track one shipment (customer-facing)

- Fit: **Gap**
- Use: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md), [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `detail-page` is NOT this: it is an event-ticket purchase page (tiers, quantity, total, waitlist). Compose instead: `site-header`, a `card` with the tracking ID plus `copy-button` and a status `badge`; `stepper` for milestones with `description` carrying 'time zone · place' (for example 'CET · Rotterdam hub'); `progress` (with `label` and `valueLabel`) for the journey; `stat` for ETA and carrier; `alert` for a delay or exception. A `timeline` (`time`, ISO `timestamp`, `meta` for the location, `status`) is the better fit for the full scan history.
- Missing: No ready-made tracking page, no ETA-confidence component, no route map.

### Manage a list of shipments or orders

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: `table`: virtualized (set `rowHeight` and `height` or `maxHeight`), sortable, `selectable` with `onSelectionChange(ids)` and `getRowId`, status `badge` and a mono ID with `copy-button` in column `cell`s, `onEndReached` and `loading` for paging. `tabs` for Exceptions, In transit, Delivered (filter your own data). Show a bulk bar of `Button`s while `ids.length > 0`.
- Missing: Not served by `filter-table` (fixed task rows {task, date, status todo|progress|done, owner}) or `selection-actions` (an AI text-rewrite bar over a passage). No saved filters. On phones the table scrolls sideways; there is no card mode.

### Dispatch board

- Fit: **Gap**
- Use: [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: `crm-pipeline` is a sales board: deals with company, contact, USD value, owner and close date, hard-coded USD formatting, and fixed 'Add deal' and 'Value (USD)' copy with no label props. Relabelling is not possible. Build columns yourself: a `card` per job with `badge`, `avatar` for the driver and a `select` to move it between stages; add drag with a drag-and-drop library. For a compact version use `tabs` per stage over a `table`.
- Missing: No generic kanban or board.

### Create a shipment or booking

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Wizard with `stepper`; `FieldGroup` / `FieldSet` for addresses; packages as rows in `repeater-field` (weight, size, quantity with `quantity-stepper`). Pickup window with `date-picker` using `time` and `hourCycle={24}`. Finish with `order-confirmation` relabelled as a booking confirmation (`labels`, `order.lines`, `order.tickets` with `fields` and a `code`).
- Missing: `date-picker` has no time zone: add a `select` for the zone and store it with the value. `order-confirmation` is ticket-shaped with a fixed 3-step stepper (rename only) and a QR per ticket. `checkout` is event-booking shaped (name, email, phone, attendee, card) and does not fit. No address autocomplete.

### Fleet and driver overview

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)
- How: `StatGroup` for utilization and on-time rate (`delta`, `goodWhen`). Driver and vehicle list in `table` with `avatar` and `StatusIndicator` (operational, degraded, down, maintenance) cells. `progress` for hours or fuel. `analytics-dashboard` works if the shape is KPIs, a trend per metric, a ranked list and a share breakdown; relabel via `labels`, `valueColumn` and the format props.
- Missing: No live map of vehicle positions. `analytics-dashboard` ranges are fixed at 7d, 30d and 90d.

### Warehouse inventory and capacity

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `table` with `editable` columns and `onCellEdit` for counts (`editable` is ignored on a column that sets `cell`). Zones as `progress`: the default `tone="auto"` measures consumption, so a nearly full zone turns warning then destructive; for stock remaining set `invert`. A hardware scanner that types like a keyboard can fill an `input`. `records-table` is NOT usable: it is an AI spreadsheet with fixed {name, tags, last, strength, website} rows.
- Missing: No camera barcode scan input and no heat map of locations.

### Proof of delivery

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Recipient name in `field` and `input`; a failure reason in `select`; photos with `dropzone` (`capture="environment"`, `accept="image/*"`, `maxSize`, `maxFiles`, a `files` list with `progress`; it has no upload logic, you upload in `onFiles`). `qr-code` can show a handover code the recipient presents.
- Missing: No signature pad. `qr-code` only generates codes; it does not scan.

### Rates, quotes and invoicing

- Fit: **Gap**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md)
- How: Compose: rate options in a `table` (carrier, service, transit time, price in mono, a select `Button` in a `cell`) or `radio-group` cards, totals in `stat`, invoices in `table` with a status `badge`. `checkout` is NOT a quote flow: it is an event-booking checkout with fixed contact and payment fields.
- Missing: No rate-comparison table and no quote or invoice component.

### ETA with confidence or delay reason

- Fit: **Gap**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Tooltip](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tooltip.md)
- How: Show the ETA in `stat` (`value`), the confidence or window in its `hint` (for example 'Likely 16:00 to 18:00 CET'), a `badge` for On time, At risk or Delayed, and an `alert` with the reason for a delay.
- Missing: No ETA-confidence primitive.

### Operations analytics

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md)
- How: Relabel `analytics-dashboard` (shipments, on-time rate, cost per delivery) through `labels`, `data` per range, the format props and `valueColumn` for cost. `InsightChart`, exported from the `insight-cards` file, plots several lines with a `threshold` and hover tooltip.
- Missing: Range tabs are fixed at 7d, 30d and 90d (so no `date-range-picker` link), and the table columns are page-analytics shaped (name, visitors, conversion, duration). `InsightChart` has no axes.

## Libraries and services that pair well

- Live fleet and route map: MapLibre GL JS, Google Maps Platform, HERE. Use a map library for positions and routes; keep ETA and status in opendraft components.
- Carrier and tracking data: Shippo, EasyPost, project44. Map each carrier's status codes to one status vocabulary before it reaches the UI.
- Barcode scanning: zxing-js, Dynamsoft, Scandit. Scanning is a device capability; opendraft's qr-code only generates codes.
- Signature capture: signature_pad, react-signature-canvas. Pair with dropzone for photos to make proof of delivery.
- Drag and drop for a dispatch board: dnd-kit. opendraft has no board component; build columns from card and add dragging with a library.
- Time zones: Temporal API, Luxon, date-fns-tz. date-picker has no time-zone support; keep the zone as its own field.

## Typical screens

- **Public tracking page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Shipments list**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Dispatch board**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Create shipment**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-logistics
```

## Known gaps

- Track one shipment (customer-facing): No ready-made tracking page, no ETA-confidence component, no route map.
- Manage a list of shipments or orders: Not served by `filter-table` (fixed task rows {task, date, status todo|progress|done, owner}) or `selection-actions` (an AI text-rewrite bar over a passage). No saved filters. On phones the table scrolls sideways; there is no card mode.
- Dispatch board: No generic kanban or board.
- Create a shipment or booking: `date-picker` has no time zone: add a `select` for the zone and store it with the value. `order-confirmation` is ticket-shaped with a fixed 3-step stepper (rename only) and a QR per ticket. `checkout` is event-booking shaped (name, email, phone, attendee, card) and does not fit. No address autocomplete.
- Fleet and driver overview: No live map of vehicle positions. `analytics-dashboard` ranges are fixed at 7d, 30d and 90d.
- Warehouse inventory and capacity: No camera barcode scan input and no heat map of locations.
- Proof of delivery: No signature pad. `qr-code` only generates codes; it does not scan.
- Rates, quotes and invoicing: No rate-comparison table and no quote or invoice component.
- ETA with confidence or delay reason: No ETA-confidence primitive.
- Operations analytics: Range tabs are fixed at 7d, 30d and 90d (so no `date-range-picker` link), and the table columns are page-analytics shaped (name, visitors, conversion, duration). `InsightChart` has no axes.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
