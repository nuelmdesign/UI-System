# Scheduler

Resource scheduler for rosters, dispatch and appointments: day and week views, drag and keyboard moves, conflicts, agenda on narrow widths.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/scheduler
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Scheduler } from "@/components/blocks/scheduler"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`, `@opendraft/button`

## Props and types

```ts
export type SchedulerDate = string | Date

export type SchedulerView = "day" | "week"

export type SchedulerTone =
  "default" | "brand" | "success" | "warning" | "destructive"

/** A row: a crew member, room, vehicle, engineer, machine, on-call slot... */
export type SchedulerResource = {
  id: string
  label: string
  /** Second line under the label (role, capacity, plate number...). */
  meta?: string
}

export type SchedulerEvent = {
  id: string
  resourceId: string
  start: SchedulerDate
  end: SchedulerDate
  title: string
  /** Shown as text on the bar and in the agenda, never colour alone. */
  status?: string
  tone?: SchedulerTone
}

export type SchedulerMove = {
  resourceId: string
  start: Date
  end: Date
}

/**
 * Fixed copy. Every string can be replaced through the `labels` prop.
 * Placeholders in braces are filled in: {count} {title} {resource} {start} {end}.
 */
export type SchedulerLabels = {
  schedule: string
  resource: string
  previous: string
  next: string
  today: string
  view: string
  day: string
  week: string
  now: string
  conflict: string
  /** Uses {count}. */
  conflicts: string
  noResources: string
  noEvents: string
  /** Uses {resource}. */
  addEvent: string
  /** Read out for draggable events. */
  moveHint: string
  /** Uses {title} {resource} {start} {end}. */
  pickedUp: string
  /** Uses {title} {resource} {start} {end}. */
  moving: string
  /** Uses {title} {resource} {start} {end}. */
  dropped: string
  cancelled: string
}

export type SchedulerProps = {
  resources?: SchedulerResource[]
  events?: SchedulerEvent[]
  view?: SchedulerView
  defaultView?: SchedulerView
  onViewChange?: (view: SchedulerView) => void
  /** Any instant inside the visible day or week. */
  date?: SchedulerDate
  defaultDate?: SchedulerDate
  onDateChange?: (date: Date) => void
  /** IANA zone used for day boundaries and every formatted time. Default "UTC". */
  timeZone?: string
  /** BCP 47 locale for formatted dates and times. */
  locale?: string
  /** First visible hour of each day (0-23). Default 8. */
  startHour?: number
  /** Last visible hour of each day, exclusive (1-24). Default 18. */
  endHour?: number
  /** 0 = Sunday, 1 = Monday. Default 1. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** Move and slot snapping in minutes. Default 15. */
  snapMinutes?: number
  /** Current time for the now-line and the Today button. Passed in, never read from the clock. */
  now?: SchedulerDate
  onEventClick?: (event: SchedulerEvent) => void
  onSlotClick?: (resourceId: string, start: Date) => void
  /** Enables drag and keyboard moves. Receives the new resource and times. */
  onEventMove?: (id: string, move: SchedulerMove) => void
  labels?: Partial<SchedulerLabels>
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  Scheduler,
  type SchedulerEvent,
  type SchedulerMove,
  type SchedulerResource,
  type SchedulerView,
} from "@/components/blocks/scheduler"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Domain = "roster" | "clinic"

const CREW: SchedulerResource[] = [
  { id: "c1", label: "Ana Torres", meta: "Crew lead" },
  { id: "c2", label: "Ben Okafor", meta: "Electrician" },
  { id: "c3", label: "Chen Wei", meta: "Electrician" },
  { id: "c4", label: "Dana Cole", meta: "Apprentice" },
  { id: "c5", label: "Eli Brandt", meta: "Driver" },
]

const SHIFTS: SchedulerEvent[] = [
  {
    id: "s1",
    resourceId: "c1",
    start: "2026-10-12T06:00:00Z",
    end: "2026-10-12T14:00:00Z",
    title: "Site A",
    status: "Confirmed",
    tone: "brand",
  },
  {
    id: "s2",
    resourceId: "c1",
    start: "2026-10-13T06:00:00Z",
    end: "2026-10-13T14:00:00Z",
    title: "Site A",
    status: "Confirmed",
    tone: "brand",
  },
  {
    id: "s3",
    resourceId: "c1",
    start: "2026-10-14T10:00:00Z",
    end: "2026-10-14T18:00:00Z",
    title: "Site B",
    status: "Pending",
    tone: "warning",
  },
  {
    id: "s4",
    resourceId: "c2",
    start: "2026-10-12T14:00:00Z",
    end: "2026-10-12T22:00:00Z",
    title: "Late shift",
    status: "Confirmed",
    tone: "brand",
  },
  {
    id: "s5",
    resourceId: "c2",
    start: "2026-10-13T14:00:00Z",
    end: "2026-10-13T22:00:00Z",
    title: "Late shift",
    status: "Confirmed",
    tone: "brand",
  },
  {
    id: "s6",
    resourceId: "c2",
    start: "2026-10-13T20:00:00Z",
    end: "2026-10-14T00:00:00Z",
    title: "Call-out",
    status: "On call",
    tone: "destructive",
  },
  {
    id: "s7",
    resourceId: "c3",
    start: "2026-10-12T06:00:00Z",
    end: "2026-10-12T14:00:00Z",
    title: "Site A",
    status: "Confirmed",
    tone: "brand",
  },
  {
    id: "s8",
    resourceId: "c3",
    start: "2026-10-15T06:00:00Z",
    end: "2026-10-15T14:00:00Z",
    title: "Site C",
    status: "Confirmed",
    tone: "success",
  },
  {
    id: "s9",
    resourceId: "c4",
    start: "2026-10-13T06:00:00Z",
    end: "2026-10-13T12:00:00Z",
    title: "Training",
    status: "Draft",
  },
  {
    id: "s10",
    resourceId: "c5",
    start: "2026-10-14T06:00:00Z",
    end: "2026-10-14T14:00:00Z",
    title: "Deliveries",
    status: "Confirmed",
    tone: "success",
  },
  {
    id: "s11",
    resourceId: "c5",
    start: "2026-10-16T06:00:00Z",
    end: "2026-10-16T14:00:00Z",
    title: "Deliveries",
    status: "Pending",
    tone: "warning",
  },
]

const ROOMS: SchedulerResource[] = [
  { id: "m1", label: "Room 1", meta: "Consultation" },
  { id: "m2", label: "Room 2", meta: "Consultation" },
  { id: "m3", label: "Room 3", meta: "Procedure" },
  { id: "m4", label: "Dr. Rivera", meta: "Practitioner" },
]

// Times are New York wall-clock (UTC-4 in October).
const APPOINTMENTS: SchedulerEvent[] = [
  {
    id: "a1",
    resourceId: "m1",
    start: "2026-10-13T09:00:00-04:00",
    end: "2026-10-13T09:30:00-04:00",
    title: "Check-up",
    status: "Arrived",
    tone: "success",
  },
  {
    id: "a2",
    resourceId: "m1",
    start: "2026-10-13T10:00:00-04:00",
    end: "2026-10-13T11:00:00-04:00",
    title: "Follow-up",
    status: "Booked",
    tone: "brand",
  },
  {
    id: "a3",
    resourceId: "m2",
    start: "2026-10-13T09:30:00-04:00",
    end: "2026-10-13T10:30:00-04:00",
    title: "New patient",
    status: "Booked",
    tone: "brand",
  },
  {
    id: "a4",
    resourceId: "m3",
    start: "2026-10-13T13:00:00-04:00",
    end: "2026-10-13T15:00:00-04:00",
    title: "Minor procedure",
    status: "Confirmed",
    tone: "warning",
  },
  {
    id: "a5",
    resourceId: "m4",
    start: "2026-10-13T09:00:00-04:00",
    end: "2026-10-13T10:15:00-04:00",
    title: "Rounds",
    status: "Booked",
  },
  {
    id: "a6",
    resourceId: "m4",
    start: "2026-10-13T10:00:00-04:00",
    end: "2026-10-13T11:00:00-04:00",
    title: "Consult",
    status: "Booked",
    tone: "brand",
  },
  {
    id: "a7",
    resourceId: "m2",
    start: "2026-10-13T14:00:00-04:00",
    end: "2026-10-13T14:45:00-04:00",
    title: "Review",
    status: "Booked",
    tone: "brand",
  },
]

export default function SchedulerDemo() {
  const [domain, setDomain] = React.useState<Domain>("roster")
  const [view, setView] = React.useState<SchedulerView>("week")
  const [shifts, setShifts] = React.useState(SHIFTS)
  const [appointments, setAppointments] = React.useState(APPOINTMENTS)
  const [picked, setPicked] = React.useState("")

  const apply =
    (set: React.Dispatch<React.SetStateAction<SchedulerEvent[]>>) =>
    (id: string, move: SchedulerMove) =>
      set((list) => list.map((e) => (e.id === id ? { ...e, ...move } : e)))

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={domain} onValueChange={(v) => setDomain(v as Domain)}>
          <TabsList>
            <TabsTrigger value="roster">Crew roster</TabsTrigger>
            <TabsTrigger value="clinic">Clinic appointments</TabsTrigger>
          </TabsList>
        </Tabs>
        <p
          className="font-mono text-xs text-muted-foreground"
          aria-live="polite"
        >
          {picked}
        </p>
      </div>
      <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
        {domain === "roster" ? (
          <Scheduler
            key="roster"
            resources={CREW}
            events={shifts}
            view={view}
            onViewChange={setView}
            defaultDate="2026-10-13T12:00:00Z"
            now="2026-10-13T10:20:00Z"
            timeZone="UTC"
            startHour={6}
            endHour={24}
            onEventMove={apply(setShifts)}
            onEventClick={(e) => setPicked(`${e.title} (${e.status})`)}
            onSlotClick={(resourceId, start) =>
              setPicked(`New shift: ${resourceId} at ${start.toISOString()}`)
            }
            labels={{
              resource: "Crew",
              conflict: "Double-booked",
              noEvents: "No shifts",
            }}
          />
        ) : (
          <Scheduler
            key="clinic"
            resources={ROOMS}
            events={appointments}
            defaultView="day"
            defaultDate="2026-10-13T12:00:00-04:00"
            now="2026-10-13T10:20:00-04:00"
            timeZone="America/New_York"
            startHour={8}
            endHour={17}
            snapMinutes={15}
            onEventMove={apply(setAppointments)}
            onEventClick={(e) => setPicked(`${e.title} (${e.status})`)}
            onSlotClick={(resourceId, start) =>
              setPicked(
                `New appointment: ${resourceId} at ${start.toISOString()}`
              )
            }
            labels={{
              resource: "Room / practitioner",
              conflict: "Overlap",
              noEvents: "No appointments",
            }}
          />
        )}
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/scheduler. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
