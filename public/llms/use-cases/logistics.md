# Building Logistics, supply chain and fleet products with opendraft

> Shipment tracking, dispatch, warehouse and fleet products for operators, drivers and customers who need to know where things are and when they'll arrive.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

logistics, shipping, shipment, freight, carrier, courier, delivery, last mile, fleet, driver, dispatch, warehouse, inventory, supply chain, tracking, 3pl, customs, proof of delivery.

## Principles for this domain

- Every shipment shows three things at a glance: status (as a word), where it is, and when it will arrive (an ETA with a confidence or a delay reason).
- Tracking IDs, container numbers and SKUs go in `font-mono` with a `copy-button`.
- Exceptions come first: delayed, held and failed deliveries sort to the top and carry the reason and the next action.
- Show dates and times in the location's own time zone, and say which zone.
- Operators work in bulk: every list needs multi-select with bulk actions (`selection-actions`), saved filters and keyboard navigation.
- Driver and warehouse screens are used one-handed on a phone: large targets, one primary action per screen, works on a poor connection.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Track one shipment (customer-facing)

- Fit: **Adapt**
- Use: [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md)
- How: A vertical `stepper` for milestones; `progress` for the journey; show the tracking ID with `copy-button`.
- Missing: No timeline with timestamps and locations per event, and no route map.

### Manage a list of shipments or orders

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md)
- How: Tabs for Exceptions, In transit and Delivered; a virtualized `table` when volumes are large.

### Dispatch board

- Fit: **Adapt**
- Use: [CRM Pipeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/crm-pipeline.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md)
- How: `crm-pipeline` is a stage board with drag and drop; pass your stages (Unassigned, Assigned, En route, Delivered) and relabel the cards.
- Missing: Its data shape is sales-oriented (company, value, contact); there is no generic board.

### Create a shipment or booking

- Fit: **Ready**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- How: A wizard with `stepper`; packages as rows in `repeater-field`; finish with `order-confirmation`.

### Fleet and driver overview

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: Utilization and on-time rate in `stat`; driver list in `table`.
- Missing: No live map of vehicle positions.

### Warehouse inventory and capacity

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md)
- How: Zones as `progress` bars with a warning tone when nearly full.
- Missing: No barcode scan input and no heat map of locations.

### Proof of delivery

- Fit: **Gap**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md), [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md)
- How: A confirmation step with `approval-card` and a recipient `field` works.
- Missing: No signature pad and no photo capture or file dropzone.

### Rates, quotes and invoicing

- Fit: **Adapt**
- Use: [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md)
- How: `checkout` summary pattern for a quote; invoices in `table`.
- Missing: No dedicated quote or rate-comparison table.

### Operations analytics

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: Relabel the dashboard (shipments, on-time rate, cost per delivery) and add a `valueColumn` for cost.
- Missing: The range tabs are fixed at 7, 30 and 90 days, and the table columns are page-analytics shaped.

## Typical screens

- **Public tracking page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- **Shipments list**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md) + [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md)
- **Dispatch board**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [CRM Pipeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/crm-pipeline.md)
- **Create shipment**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-logistics
```

## Known gaps

- Track one shipment (customer-facing): No timeline with timestamps and locations per event, and no route map.
- Dispatch board: Its data shape is sales-oriented (company, value, contact); there is no generic board.
- Fleet and driver overview: No live map of vehicle positions.
- Warehouse inventory and capacity: No barcode scan input and no heat map of locations.
- Proof of delivery: No signature pad and no photo capture or file dropzone.
- Rates, quotes and invoicing: No dedicated quote or rate-comparison table.
- Operations analytics: The range tabs are fixed at 7, 30 and 90 days, and the table columns are page-analytics shaped.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
