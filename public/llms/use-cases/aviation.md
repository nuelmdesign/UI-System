# Building Aviation and travel operations products with opendraft

> Airline and airport operations, flight information, booking and check-in, crew and maintenance tools. Safety-critical context: clarity and correctness beat flourish.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

aviation, airline, airport, flight, aircraft, pilot, crew, boarding, check-in, mro, maintenance, notam, metar, air traffic, charter, fbo, ground handling.

## Principles for this domain

- State times with an explicit zone. Use 24-hour time, mark UTC as `Z`, and show the airport's local time beside it. Never leave a time ambiguous.
- Flight status is always a word first (On time, Delayed, Boarding, Departed, Cancelled) with a color second. Show the reason and the new time for any delay.
- Use IATA or ICAO codes in `font-mono` with the full name on hover or beneath, for example `LIS` and Lisbon.
- On safety-critical screens (maintenance sign-off, checklists, weather) turn motion off, show who signed and when, and require an explicit confirm. Prefer `approval-card` over a quiet toggle.
- Design for tablets, gloves and bright light: large touch targets, high contrast, no hover-only information.
- A live board updates in place without shifting the layout under a user's cursor. Highlight what changed, then settle.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Departures and arrivals board

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Text Scramble](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/text-scramble.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Animated Number](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-number.md)
- How: A virtualized `table` with a status `badge`; `text-scramble` can animate a changed gate or time.
- Missing: No split-flap display.

### Flight detail and itinerary

- Fit: **Adapt**
- Use: [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: A vertical `stepper` for legs and connections; `progress` for the flight's progress.
- Missing: No route or flight-path map.

### Search and book a flight

- Fit: **Adapt**
- Use: [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md)
- How: `catalog` can list fares if you relabel it and pass `layout="compact"`; passengers with `quantity-stepper`.
- Missing: No origin and destination airport picker, and no fare comparison grid.

### Passenger details, payment and confirmation

- Fit: **Ready**
- Use: [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md)
- How: `checkout` is a three-step flow; pass your own labels and `ticketFields`.

### Boarding pass

- Fit: **Ready**
- Use: [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md)
- How: `ticket-pass` with gate, seat and boarding group as `fields`. The QR is real, but airlines encode a standard barcode (PDF417 or Aztec) that `qr-code` does not produce.
- Missing: No PDF417 or Aztec barcode.

### Seat selection

- Fit: **Gap**
- Use: [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md)
- How: Nothing fits.
- Missing: No seat map.

### Crew and roster scheduling

- Fit: **Gap**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: A table works for lists of duties.
- Missing: No scheduler, Gantt or calendar timeline.

### Maintenance logs and pre-flight checklists

- Fit: **Ready**
- Use: [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md), [File Diff](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/file-diff.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md)
- How: Each item signed with `approval-card`; keep the record in `records-table` with who and when.

### Operations control overview

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: On-time performance and disruption counts in `stat` tiles.
- Missing: No map and no alert banner for weather or NOTAM bulletins.

## Typical screens

- **Departures board**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Flight detail**: [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- **Booking and check-in**: [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md) + [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md)
- **Maintenance sign-off**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Todo List](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/todo-list.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md)
- **Operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-aviation
```

## Known gaps

- Departures and arrivals board: No split-flap display.
- Flight detail and itinerary: No route or flight-path map.
- Search and book a flight: No origin and destination airport picker, and no fare comparison grid.
- Boarding pass: No PDF417 or Aztec barcode.
- Seat selection: No seat map.
- Crew and roster scheduling: No scheduler, Gantt or calendar timeline.
- Operations control overview: No map and no alert banner for weather or NOTAM bulletins.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
