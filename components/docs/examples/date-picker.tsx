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
