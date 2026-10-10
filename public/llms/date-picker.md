# Date Picker

Single-date picker in a popover with an accessible month grid and an optional HH:MM time field (12h or 24h), using ISO string values. Data shape: A single date with an optional HH:MM field; no time zone.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/date-picker
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DatePicker } from "@/components/ui/date-picker"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/input`, `@opendraft/popover`

## Props and types

```ts
type HourCycle = 12 | 24

type DatePickerProps = Omit<
  React.ComponentProps<"button">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  /** Controlled ISO value: `2026-11-21` or `2026-11-21T19:30`. */
  value?: string
  /** Initial ISO value when uncontrolled. */
  defaultValue?: string
  /** Called with an ISO string, or `undefined` when cleared. */
  onValueChange?: (value: string | undefined) => void
  /** Adds an HH:MM field; value becomes `YYYY-MM-DDTHH:MM`. */
  time?: boolean
  /** 12 or 24 hour display and entry for the time field. */
  hourCycle?: HourCycle
  placeholder?: string
  /** BCP 47 locale for formatting. Defaults to the runtime locale. */
  locale?: string
  /** Earliest selectable day (ISO). */
  min?: string
  /** Latest selectable day (ISO). */
  max?: string
  /** Extra per-day rule; receives `YYYY-MM-DD`. */
  isDateDisabled?: (day: string) => boolean
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  disabled?: boolean
  invalid?: boolean
  /** Time used when a day is picked and no time is set yet. */
  defaultTime?: string
  align?: "start" | "center" | "end"
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<string | undefined>("2026-11-21")
  const [start, setStart] = React.useState<string | undefined>(
    "2026-11-21T19:30"
  )

  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="dp-date">Event date</Label>
        <DatePicker
          id="dp-date"
          value={date}
          onValueChange={setDate}
          min="2026-01-01"
          max="2027-12-31"
        />
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          value = {date ?? "undefined"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="dp-start">Doors open</Label>
        <DatePicker
          id="dp-start"
          time
          hourCycle={12}
          value={start}
          onValueChange={setStart}
          placeholder="Pick date and time"
        />
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          value = {start ?? "undefined"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="dp-weekdays">Weekdays only (24h)</Label>
        <DatePicker
          id="dp-weekdays"
          time
          weekStartsOn={1}
          isDateDisabled={(d) => {
            const [y, m, day] = d.split("-").map(Number)
            const dow = new Date(Date.UTC(y, m - 1, day)).getUTCDay()
            return dow === 0 || dow === 6
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="dp-invalid">Invalid</Label>
        <DatePicker id="dp-invalid" invalid placeholder="Required" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="dp-disabled">Disabled</Label>
        <DatePicker id="dp-disabled" disabled defaultValue="2026-12-01" />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/date-picker. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
