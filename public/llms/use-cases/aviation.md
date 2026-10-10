# Building Aviation and travel operations products with opendraft

> Airline and airport operations, flight information, booking and check-in, crew and maintenance tools. Safety-critical context: clarity and correctness beat flourish.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

aviation, airline, airport, flight, aircraft, pilot, crew, boarding, check-in, mro, maintenance, notam, metar, air traffic, charter, fbo, ground handling.

## Principles for this domain

- State times with an explicit zone. Use 24-hour time, mark UTC as `Z`, and show the airport's local time beside it. Never leave a time ambiguous. `date-picker` has a 24-hour time field (`time`, `hourCycle={24}`) but no time-zone support, so store the zone yourself and format with `Intl.DateTimeFormat` and a `timeZone`.
- Flight status is always a word first (On time, Delayed, Boarding, Departed, Cancelled) with a color second (`badge` with `dot`). Show the reason and the new time for any delay.
- Use IATA or ICAO codes in `font-mono` with the full name on hover or beneath, for example `LIS` and Lisbon.
- On safety-critical screens (maintenance sign-off, checklists, weather) avoid decorative motion (skip `text-scramble` and `animated-number`), show who signed and when, and require an explicit confirm. Prefer `approval-card` over a quiet toggle. These screens record a sign-off; they do not replace your approved maintenance or operational records system.
- Design for tablets, gloves and bright light: large touch targets, high contrast, no hover-only information.
- A live board updates in place without shifting the layout under a user's cursor. Highlight what changed, then settle. No component does the highlight for you.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Departures and arrivals board

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Text Scramble](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/text-scramble.md)
- How: `table` is virtualized (set `rowHeight` and `height`) with a sortable time column, mono code and flight-number cells, and a status `badge` (`dot`) in a column `cell`. `tabs` switch Departures and Arrivals. `text-scramble` can resolve a changed gate or time to its new text. `alert` for a disruption banner.
- Missing: No split-flap display. No built-in highlight when a row changes. On phones the table scrolls sideways (it does not reflow); there is no card mode, so build a `card` list for small screens.

### Flight detail and itinerary

- Fit: **Gap**
- Use: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: `detail-page` is NOT this: it is an event-ticket purchase page (hero image, tiers with quantity and capacity, running total, waitlist, schedule and FAQ tabs). Compose instead: `page-header` with a status `badge`; `stat` tiles for scheduled and estimated times, gate and aircraft; `progress` (label and `valueLabel`) for flight progress; and the legs as a `timeline` (`time`, ISO `timestamp`, `meta` for terminal or gate, `status` current or upcoming) or a vertical `stepper` whose `description` carries 'local time · airport'. `alert` for delay reasons.
- Missing: No ready-made flight detail page and no route or flight-path map.

### Search for a flight

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: Form built from `field` / `FieldGroup`: origin and destination, one date with `date-picker` or an outbound and return range with `date-range-picker` (YYYY-MM-DD, no time of day), passengers with `quantity-stepper`, cabin with `radio-group` or `select`. For an airport picker, a controlled `command-palette` (`open`, `onOpenChange`, items with IATA codes in `keywords`, `onSelect` sets the field) is a workable hack. Render results as a `table` with a select `Button` in a `cell`.
- Missing: No airport or route picker and no fare comparison grid. `catalog` is NOT a flight list: its items are events {title, host, location, category, date, price, capacity, remaining}, with no origin, destination or times.

### Passenger details and payment

- Fit: **Gap**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `checkout` is event-booking shaped: fixed fields (name, email, phone, an optional attendee, delivery by email or desk, pay by card or later) and a cart of items with quantity, fees and discount codes. It cannot collect per-passenger details such as date of birth or travel documents. Build a `stepper` wizard with one `FieldSet` per passenger (`repeater-field` for several, or a loop), `date-picker` for dates of birth, `select` for title and nationality, `checkbox` for consents. Take payment with your provider's hosted fields.
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

- Fit: **Gap**
- Use: [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tooltip](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tooltip.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md)
- How: Nothing renders a seat map. Build a grid of `button`s (with `aria-pressed` and a text seat label such as 14A) and mark taken, extra-legroom and selected states with text as well as color, with a `badge` legend and `tooltip` for price. `radio-group` fits the choice among a few options, not a cabin grid.
- Missing: No seat map component.

### Crew and roster scheduling

- Fit: **Gap**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md)
- How: A `table` (crew rows, a column per day with a duty `badge` in each `cell`) lists a roster. `timeline` shows one person's duties for a day in order, with `meta` for the airport. `date-range-picker` chooses the period.
- Missing: No scheduler, Gantt or calendar timeline, and no drag to reassign.

### Maintenance logs and pre-flight checklists

- Fit: **Adapt**
- Use: [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md)
- How: `todo-list` is NOT a checklist: it is a read-only display of an agent's task plan with no way to tick items. Use `checkbox` rows with a `field` for the finding, `textarea` for notes and `dropzone` (with `capture`) for photos. Sign off with `approval-card` (`title`, body `children`, `onApprove`; its `result` slot can show 'Signed by X at 08:14Z'). Show the history in `timeline` and a sortable `table`. `records-table` is NOT usable: it is an AI spreadsheet with fixed {name, tags, last, strength, website} rows.
- Missing: No signature or credential step; who signed and when must come from your authenticated backend and be written by it.

### Disruption, weather and NOTAM notices

- Fit: **Ready**
- Use: [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `alert` has info, warning and destructive variants, a `banner` mode and an `AlertAction` slot (for example a View affected flights button). Pass bulletin text as supplied by your data source, with its issue and validity times in UTC, and link to the source.

### Operations control overview

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Command Palette](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/command-palette.md)
- How: On-time performance and disruption counts in `StatGroup` tiles (`delta` with `goodWhen`). `StatusIndicator` for airport or system status. `progress` for stand or gate utilisation. `analytics-dashboard` can be relabelled (`labels`, `valueColumn`, formatters) for flights per hour.
- Missing: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are name, visitors, conversion and duration. No map.

## Libraries and services that pair well

- Flight path and airport maps: MapLibre GL JS, deck.gl, Mapbox GL JS. Great-circle arcs and tracks are a map-library job; keep times and codes in the table beside it.
- Flight data: FlightAware AeroAPI, OpenSky Network, AviationStack. Normalize to UTC and show local airport time beside it.
- Time zones: Temporal API, Luxon, date-fns-tz. date-picker has no time-zone support; keep the zone as a separate field and convert with one of these.
- Barcodes for passes: bwip-js. qr-code only draws QR. bwip-js can render PDF417 and Aztec; scanning is a separate job, for example with zxing-js.
- Crew and maintenance scheduling: FullCalendar, DHTMLX Gantt, Bryntum. opendraft has no scheduler; embed one and theme it with the CSS variables.

## Typical screens

- **Departures board**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Flight detail**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Search and booking**: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Date Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-picker.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Boarding pass**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md) + [QR Code](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/qr-code.md)
- **Maintenance sign-off**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- **Operations overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-aviation
```

## Known gaps

- Departures and arrivals board: No split-flap display. No built-in highlight when a row changes. On phones the table scrolls sideways (it does not reflow); there is no card mode, so build a `card` list for small screens.
- Flight detail and itinerary: No ready-made flight detail page and no route or flight-path map.
- Search for a flight: No airport or route picker and no fare comparison grid. `catalog` is NOT a flight list: its items are events {title, host, location, category, date, price, capacity, remaining}, with no origin, destination or times.
- Passenger details and payment: No passenger form and no payment step that fits a flight booking; do not push passenger data through `checkout`.
- Booking confirmation: It is ticket-shaped with a fixed 3-step stepper (`labels.steps` renames the three steps, you cannot add or remove one), a stat row for date, tickets and total, and a QR code per ticket.
- Boarding pass: It draws only a QR code. Airline boarding passes use a PDF417, Aztec or QR code carrying data formatted and issued by the airline's system; encode only what your airline system gives you, and use a barcode library for other symbologies. Treat this as a display of the pass, not the credential.
- Seat selection: No seat map component.
- Crew and roster scheduling: No scheduler, Gantt or calendar timeline, and no drag to reassign.
- Maintenance logs and pre-flight checklists: No signature or credential step; who signed and when must come from your authenticated backend and be written by it.
- Operations control overview: `analytics-dashboard` ranges are fixed at 7d, 30d and 90d and its table columns are name, visitors, conversion and duration. No map.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
