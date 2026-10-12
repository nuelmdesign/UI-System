# Building Aviation and travel operations products with opendraft

> Airline and airport operations, flight information, booking and check-in, crew and maintenance tools. Safety-critical context: clarity and correctness beat flourish.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

aviation, airline, airport, flight, aircraft, pilot, crew, boarding, check-in, mro, maintenance, notam, metar, air traffic, charter, fbo, ground handling.

## Principles for this domain

- State times with an explicit zone. Use 24-hour time, mark UTC as `Z`, and show the airport's local time beside it. Never leave a time ambiguous. `date-time-picker` picks a date and time in a named IANA `timeZone` (with DST gap and overlap handling and an other-zone readout); `eta-indicator`, `time-series-chart` and `scheduler` also take a `timeZone`. Store the zone with every time you save.
- Flight status is always a word first (On time, Delayed, Boarding, Departed, Cancelled) with a color second (`badge` with `dot`). Show the reason and the new time for any delay.
- Use IATA or ICAO codes in `font-mono` with the full name on hover or beneath, for example `LIS` and Lisbon.
- On safety-critical screens (maintenance sign-off, checklists, weather) avoid decorative motion (skip `text-scramble` and `animated-number`), show who signed and when, and require an explicit confirm. Prefer `approval-card` over a quiet toggle. These screens record a sign-off; they do not replace your approved maintenance or operational records system.
- Design for tablets, gloves and bright light: large touch targets, high contrast, no hover-only information.
- A live board updates in place without shifting the layout under a user's cursor. Highlight what changed, then settle. No component does the highlight for you.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Departures and arrivals board

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Filter Bar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-bar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Text Scramble](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/text-scramble.md)
- How: `data-table` with a sortable time column, mono code and flight-number cells (`mono`), a status `badge` (`dot`) in a column `cell`, `views` for Departures and Arrivals, `filters` for airline, terminal and status, and a card layout on narrow screens. `text-scramble` can resolve a changed gate or time to its new text. `alert` for a disruption banner. For a very long board use the virtualized `table` with `filter-bar` instead.
- Missing: No split-flap display. No built-in highlight when a row changes: flash the changed cell yourself, then settle.

### Flight detail and itinerary

- Fit: **Adapt**
- Use: [Record Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/record-page.md), [ETA Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/eta-indicator.md), [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: `record-page` is the flight detail: `title` (flight number), `status` (a word first), `summary` stats for scheduled and estimated times, gate and aircraft, `fields`, `activity` as the leg-by-leg `timeline` and `related` for connecting flights. `eta-indicator` shows the estimated arrival as a range with a confidence word and a stale state, in a named `timeZone`. `map-view` can draw the route as a `routes` line between airports. Put `alert` above for the delay reason and new time. `detail-page` is NOT this: it is an event-ticket purchase page.
- Missing: `map-view` draws straight routes between coordinates on a street-style basemap; it does not animate a live aircraft position or great-circle arcs, and you supply flight data from your provider.

### Search for a flight

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Date Time Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-time-picker.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: Form built from `field` / `FieldGroup`: origin and destination, one date with `date-picker` or an outbound and return range with `date-range-picker` (YYYY-MM-DD, no time of day), passengers with `quantity-stepper`, cabin with `radio-group` or `select`. Use `date-time-picker` where a departure time in a named zone matters. For an airport picker, a controlled `command-palette` (`open`, `onOpenChange`, items with IATA codes in `keywords`, `onSelect` sets the field) is a workable hack. Render results in `data-table` with a select `Button` in a `cell`.
- Missing: No airport or route picker and no fare comparison grid. `catalog` is NOT a flight list: its items are events {title, host, location, category, date, price, capacity, remaining}, with no origin, destination or times.

### Passenger details and payment

- Fit: **Gap**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Address Form](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/address-form.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `checkout` is event-booking shaped: fixed fields (name, email, phone, an optional attendee, delivery by email or desk, pay by card or later) and a cart of items with quantity, fees and discount codes. It cannot collect per-passenger details such as date of birth or travel documents. Build a `stepper` wizard with one `FieldSet` per passenger (`repeater-field` for several, or a loop), `date-picker` for dates of birth, `select` for title and nationality, `checkbox` for consents, and `address-form` for a billing or contact address. Take payment with your provider's hosted fields.
- Missing: No passenger form and no payment step that fits a flight booking; do not push passenger data through `checkout`.

### Booking confirmation

- Fit: **Adapt**
- Use: [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- How: `order-confirmation` can be relabelled as a booking confirmation through `labels` (title, order number, buttons) and `order` (lines with price, `tickets` with `fields` and a `code`). It shows one `ticket-pass` per ticket.
- Missing: It is ticket-shaped with a fixed 3-step stepper (`labels.steps` renames the three steps, you cannot add or remove one), a stat row for date, tickets and total, and a QR code per ticket.

### Boarding pass

- Fit: **Adapt**
- Use: [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md), [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md)
- How: `ticket-pass` takes `title`, `eyebrow`, free-form `fields` (Gate, Seat, Group, Boards at, Terminal), `code`, `status` (valid, used, expired, void), `dark`, `tone` and an `actions` slot. The QR drawn is real and encodes `code`.
- Missing: It draws only a QR code. Airline boarding passes use a PDF417, Aztec or QR code carrying data formatted and issued by the airline's system; encode only what your airline system gives you, and use a barcode library for other symbologies. Treat this as a display of the pass, not the credential.

### Seat selection

- Fit: **Ready**
- Use: [Seat Map](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/seat-map.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `seat-map` is a keyboard-navigable grid picker: `layout` (rows and aisles, `rowLabels`, `columnLabels`), per-seat `seats` with state (available, occupied, blocked, premium), optional `price` and `tier`, `value` / `onChange` for the selection, `max` for the passenger count, a legend and a running total. Every state has a text label as well as a shape. Load the cabin layout and availability from your reservation system and re-check at payment.

### Crew and roster scheduling

- Fit: **Adapt**
- Use: [Scheduler](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/scheduler.md), [Gantt](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/gantt.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: `scheduler` block for the roster: `resources` are crew members, `events` are duties and rest periods (`status` word plus `tone`), day and week views, conflict marking, drag or keyboard moves (`onEventMove`) and an agenda on narrow widths. Give it the airport zone through `timeZone`. `gantt` suits a multi-day pairing or rotation plan with groups. `data-table` lists the crew with a duty `badge` per day.
- Missing: `scheduler` marks overlaps only; duty-time limits, rest rules and qualification checks must come from your crew-planning system, never from the UI.

### Maintenance logs and pre-flight checklists

- Fit: **Adapt**
- Use: [Checklist](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checklist.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Photo Capture](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/photo-capture.md), [Signature Pad](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/signature-pad.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md)
- How: `checklist` for pre-flight and maintenance items: tickable rows with `notes`, progress, `onComplete` and a sign-off step that stays disabled until every item is done. Capture photos with `photo-capture` (camera or file, optional captions) and documents with `dropzone`. `signature-pad` takes a drawn or typed signature; `approval-card` records the sign-off (its `result` slot can show 'Signed by X at 08:14Z'). History in `timeline` and `data-table`. `todo-list` is NOT a checklist: it is a read-only display of an agent's task plan.
- Missing: Who signed and when must come from your authenticated backend and be written by it; a captured signature image is not a credential. These screens record a sign-off, they do not replace your approved maintenance records system.

### Disruption, weather and NOTAM notices

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `alert` has info, warning and destructive variants, a `banner` mode and an `AlertAction` slot (for example a View affected flights button). Pass bulletin text as supplied by your data source, with its issue and validity times in UTC, and link to the source.

### Operations control overview

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Gauge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/gauge.md), [Time Series Chart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/time-series-chart.md), [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- How: On-time performance and disruption counts in `StatGroup` tiles (`delta` with `goodWhen`). `StatusIndicator` for airport or system status, `gauge` for stand or gate utilisation, `time-series-chart` for movements per hour in the airport zone with a capacity `threshold`, `map-view` for an airport or network status map (status markers with text labels), and `data-table` for the exceptions list.
- Missing: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are name, visitors, conversion and duration; prefer `time-series-chart` here. `map-view` is not a radar or live-traffic display.

## Libraries and services that pair well

- Flight path and airport maps: MapLibre GL JS, deck.gl, Mapbox GL JS. map-view draws routes as straight lines between coordinates; great-circle arcs, tracks and live traffic are a map-library job (deck.gl). Keep times and codes in the table beside it.
- Flight data: FlightAware AeroAPI, OpenSky Network, AviationStack. Normalize to UTC and show local airport time beside it.
- Time zones: Temporal API, Luxon, date-fns-tz. date-time-picker picks and displays a time in a named IANA zone (DST gaps and overlaps handled). Use one of these to convert and format stored instants elsewhere.
- Barcodes for passes: bwip-js. qr-code only draws QR. bwip-js can render PDF417 and Aztec; scanning is a separate job, for example with zxing-js.
- Crew and maintenance scheduling: FullCalendar, DHTMLX Gantt, Bryntum. scheduler (resource day and week views) and gantt (task bars with dependencies) cover rosters and maintenance plans. Embed one of these only for what they lack, such as recurrence rules or very large resource timelines.

## Typical screens

- **Departures board**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Flight detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Record Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/record-page.md) + [ETA Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/eta-indicator.md) + [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Search and booking**: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Date Time Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-time-picker.md) + [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md) + [Seat Map](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/seat-map.md) + [Address Form](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/address-form.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Boarding pass**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md) + [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md)
- **Maintenance sign-off**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Checklist](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checklist.md) + [Photo Capture](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/photo-capture.md) + [Signature Pad](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/signature-pad.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Gauge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/gauge.md) + [Time Series Chart](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/time-series-chart.md) + [Map View](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/map-view.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/data-table.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-aviation
```

## Known gaps

- Departures and arrivals board: No split-flap display. No built-in highlight when a row changes: flash the changed cell yourself, then settle.
- Flight detail and itinerary: `map-view` draws straight routes between coordinates on a street-style basemap; it does not animate a live aircraft position or great-circle arcs, and you supply flight data from your provider.
- Search for a flight: No airport or route picker and no fare comparison grid. `catalog` is NOT a flight list: its items are events {title, host, location, category, date, price, capacity, remaining}, with no origin, destination or times.
- Passenger details and payment: No passenger form and no payment step that fits a flight booking; do not push passenger data through `checkout`.
- Booking confirmation: It is ticket-shaped with a fixed 3-step stepper (`labels.steps` renames the three steps, you cannot add or remove one), a stat row for date, tickets and total, and a QR code per ticket.
- Boarding pass: It draws only a QR code. Airline boarding passes use a PDF417, Aztec or QR code carrying data formatted and issued by the airline's system; encode only what your airline system gives you, and use a barcode library for other symbologies. Treat this as a display of the pass, not the credential.
- Crew and roster scheduling: `scheduler` marks overlaps only; duty-time limits, rest rules and qualification checks must come from your crew-planning system, never from the UI.
- Maintenance logs and pre-flight checklists: Who signed and when must come from your authenticated backend and be written by it; a captured signature image is not a credential. These screens record a sign-off, they do not replace your approved maintenance records system.
- Operations control overview: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are name, visitors, conversion and duration; prefer `time-series-chart` here. `map-view` is not a radar or live-traffic display.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
