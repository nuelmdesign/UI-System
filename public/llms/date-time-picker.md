# Date Time Picker

Pick a date and time in a named time zone, with DST gap and overlap handling and other-zone display.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/date-time-picker
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DateTimePicker } from "@/components/ui/date-time-picker"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/input`, `@opendraft/popover`, `@opendraft/select`

## Props and types

```ts
type Wall = { y: number; mo: number; d: number; hh: number; mm: number }

type DateTimePickerLabels = {
  placeholder: string
  chooseDate: string
  time: string
  hours: string
  minutes: string
  am: string
  pm: string
  amPm: string
  timeZone: string
  previousMonth: string
  nextMonth: string
  alsoShowing: string
  /** Placeholders: {time} (requested), {adjusted} (used), {zone}. */
  gap: string
  /** Placeholders: {time} (the allowed time used). */
  clamped: string
  /** Placeholder: {zone}. */
  ambiguous: string
  earlier: string
  later: string
}

type ZoneOption = string | { value: string; label?: string }

type AlsoShowZone = string | { timeZone: string; label?: string }

type DateTimeChangeMeta = {
  /** IANA zone the person was working in. */
  timeZone: string
  /** Wall-clock time in that zone, `YYYY-MM-DDTHH:mm`. */
  local: string
  /** UTC offset at that instant, `+HH:mm`. */
  offset: string
  /** Short zone name as Intl renders it for the locale (EDT, GMT+1, ...). */
  abbreviation: string
  /** Set when the requested time was moved: skipped by DST, or out of range. */
  adjusted?: "gap" | "clamped"
}

type DateTimePickerProps = Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  /** Instant as an ISO string with an offset (`2026-03-08T07:30:00Z`). A bare local ISO string is read in `timeZone`. */
  value?: string
  defaultValue?: string
  /** Called with the UTC instant (`toISOString()`) and the zone-local detail. */
  onChange?: (isoUtc: string, meta: DateTimeChangeMeta) => void
  /** IANA zone the date and time are written in. Controlled when set. */
  timeZone?: string
  /** Initial zone when `timeZone` is not controlled. */
  defaultTimeZone?: string
  onTimeZoneChange?: (timeZone: string) => void
  /** Zones offered in a selector. Omit to lock the picker to one zone. */
  timeZones?: ZoneOption[]
  /** Show the same instant in these other zones. */
  alsoShow?: AlsoShowZone[]
  /** BCP 47 locale. Also decides 12 or 24 hour unless `hourCycle` is set. */
  locale?: string
  hourCycle?: 12 | 24
  /** Minute increment for the time field and arrow keys. */
  minuteStep?: number
  /** Earliest allowed instant (ISO with offset). */
  min?: string
  /** Latest allowed instant (ISO with offset). */
  max?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Wall time used when a day is picked and no time is set. `HH:MM`. */
  defaultTime?: string
  /** Which occurrence to use when a wall time happens twice (clocks go back). */
  overlap?: "earlier" | "later"
  labels?: Partial<DateTimePickerLabels>
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  align?: "start" | "center" | "end"
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  DateTimePicker,
  SAMPLE_TIME_ZONES,
  type DateTimeChangeMeta,
} from "@/components/ui/date-time-picker"
import { Label } from "@/components/ui/label"

export default function DateTimePickerDemo() {
  // Domain 1: a departure time, written in the departure airport's zone.
  const [departure, setDeparture] = React.useState<string | undefined>(
    "2026-11-21T14:40:00Z"
  )
  // Domain 2: a clinic appointment, with a selectable zone and a DST-day value.
  const [visit, setVisit] = React.useState<string | undefined>(
    "2026-03-08T14:30:00Z"
  )
  const [meta, setMeta] = React.useState<DateTimeChangeMeta | null>(null)

  return (
    <div className="grid w-full max-w-3xl gap-8 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="dtp-departure">Scheduled departure</Label>
        <DateTimePicker
          id="dtp-departure"
          value={departure}
          onChange={(iso) => setDeparture(iso)}
          timeZone="Europe/London"
          alsoShow={[
            { timeZone: "America/New_York", label: "Arrival city" },
            "UTC",
          ]}
          locale="en-GB"
          minuteStep={5}
          min="2026-11-01T00:00:00Z"
          max="2027-03-31T23:59:00Z"
        />
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          value = {departure ?? "undefined"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="dtp-visit">Appointment</Label>
        <DateTimePicker
          id="dtp-visit"
          value={visit}
          onChange={(iso, m) => {
            setVisit(iso)
            setMeta(m)
          }}
          defaultTimeZone="America/New_York"
          timeZones={SAMPLE_TIME_ZONES}
          alsoShow={["Europe/Berlin"]}
          locale="en-US"
          minuteStep={15}
          defaultTime="10:00"
        />
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          local = {meta?.local ?? "-"} {meta?.offset ?? ""}
        </span>
        <span className="text-xs text-muted-foreground">
          Try 02:30 on 8 March (skipped by DST) or 01:30 on 1 November (happens
          twice).
        </span>
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/date-time-picker. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
