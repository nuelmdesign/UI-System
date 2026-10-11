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
