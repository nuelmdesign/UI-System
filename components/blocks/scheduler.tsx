"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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

export const DEFAULT_SCHEDULER_LABELS: SchedulerLabels = {
  schedule: "Schedule",
  resource: "Resource",
  previous: "Previous",
  next: "Next",
  today: "Today",
  view: "View",
  day: "Day",
  week: "Week",
  now: "Now",
  conflict: "Conflict",
  conflicts: "{count} conflicts",
  noResources: "No resources to show.",
  noEvents: "No events",
  addEvent: "Add to {resource}",
  moveHint:
    "Press Space to pick up. Arrow keys change time or resource, Shift moves by an hour, Page Up and Page Down by a day. Enter drops, Escape cancels.",
  pickedUp: "Picked up {title}. {resource}, {start} to {end}.",
  moving: "{resource}, {start} to {end}.",
  dropped: "Moved {title} to {resource}, {start} to {end}.",
  cancelled: "Move cancelled.",
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

/* -------------------------------------------------------------------------- */
/* Sample data                                                                */
/* -------------------------------------------------------------------------- */

export const SAMPLE_SCHEDULER_RESOURCES: SchedulerResource[] = [
  { id: "r1", label: "Resource 1", meta: "Group A" },
  { id: "r2", label: "Resource 2", meta: "Group A" },
  { id: "r3", label: "Resource 3", meta: "Group B" },
  { id: "r4", label: "Resource 4", meta: "Group B" },
]

export const SAMPLE_SCHEDULER_EVENTS: SchedulerEvent[] = [
  {
    id: "e1",
    resourceId: "r1",
    start: "2026-03-10T08:30:00Z",
    end: "2026-03-10T11:00:00Z",
    title: "Item 1",
    status: "Confirmed",
    tone: "brand",
  },
  {
    id: "e2",
    resourceId: "r1",
    start: "2026-03-10T10:00:00Z",
    end: "2026-03-10T12:00:00Z",
    title: "Item 2",
    status: "Pending",
    tone: "warning",
  },
  {
    id: "e3",
    resourceId: "r2",
    start: "2026-03-10T09:00:00Z",
    end: "2026-03-10T13:00:00Z",
    title: "Item 3",
    status: "Confirmed",
    tone: "success",
  },
  {
    id: "e4",
    resourceId: "r3",
    start: "2026-03-10T13:00:00Z",
    end: "2026-03-10T16:30:00Z",
    title: "Item 4",
    status: "Draft",
  },
  {
    id: "e5",
    resourceId: "r4",
    start: "2026-03-10T08:00:00Z",
    end: "2026-03-10T10:00:00Z",
    title: "Item 5",
    status: "Confirmed",
    tone: "brand",
  },
]

/* -------------------------------------------------------------------------- */
/* Time helpers (wall-clock arithmetic in an IANA zone, no dependencies)      */
/* -------------------------------------------------------------------------- */

const MIN = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

const zoneFormatters = new Map<string, Intl.DateTimeFormat>()

function validZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone })
    return timeZone
  } catch {
    return "UTC"
  }
}

function zoneFormatter(timeZone: string) {
  let f = zoneFormatters.get(timeZone)
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
    zoneFormatters.set(timeZone, f)
  }
  return f
}

function zonedParts(ms: number, timeZone: string) {
  const out = { y: 0, m: 0, d: 0, h: 0, min: 0 }
  for (const p of zoneFormatter(timeZone).formatToParts(new Date(ms))) {
    const v = Number(p.value)
    if (p.type === "year") out.y = v
    else if (p.type === "month") out.m = v
    else if (p.type === "day") out.d = v
    else if (p.type === "hour") out.h = v % 24
    else if (p.type === "minute") out.min = v
  }
  return out
}

function zoneOffset(ms: number, timeZone: string) {
  const p = zonedParts(ms, timeZone)
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - Math.floor(ms / MIN) * MIN
}

/** The instant at which the wall clock in `timeZone` reads y-m-d h:min. */
function zonedToUtc(
  y: number,
  m: number,
  d: number,
  h: number,
  min: number,
  timeZone: string
) {
  const guess = Date.UTC(y, m - 1, d, h, min)
  const first = zoneOffset(guess, timeZone)
  const second = zoneOffset(guess - first, timeZone)
  return guess - second
}

type CalendarDay = { y: number; m: number; d: number }

function addDays(day: CalendarDay, n: number): CalendarDay {
  const t = new Date(Date.UTC(day.y, day.m - 1, day.d + n))
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }
}

function toMs(value: SchedulerDate | undefined) {
  if (value === undefined) return NaN
  return value instanceof Date ? value.getTime() : Date.parse(value)
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m
  )
}

type Segment = CalendarDay & { start: number; end: number }

/** Time to a 0-1 position across all segments, or null when outside every window. */
function positionOf(segments: Segment[], ms: number) {
  const n = segments.length
  for (let i = 0; i < n; i++) {
    const g = segments[i]
    if (ms >= g.start && ms <= g.end)
      return (i + (ms - g.start) / (g.end - g.start)) / n
  }
  return null
}

/** A 0-1 position across all segments back to a time. */
function timeAt(segments: Segment[], fraction: number) {
  const n = segments.length
  const f = clamp(fraction, 0, 1) * n
  const i = Math.min(n - 1, Math.floor(f))
  const g = segments[i]
  return g.start + (f - i) * (g.end - g.start)
}

function piecesOf(segments: Segment[], s: number, t: number) {
  const n = segments.length
  const out: { x0: number; x1: number }[] = []
  segments.forEach((g, i) => {
    const a = Math.max(s, g.start)
    const b = Math.min(t, g.end)
    if (b <= a) return
    const len = g.end - g.start
    out.push({
      x0: (i + (a - g.start) / len) / n,
      x1: (i + (b - g.start) / len) / n,
    })
  })
  return out
}

/* -------------------------------------------------------------------------- */
/* Styling                                                                    */
/* -------------------------------------------------------------------------- */

const toneClass: Record<SchedulerTone, string> = {
  default: "border-border border-l-foreground bg-muted",
  brand: "border-brand/25 border-l-brand bg-brand/10",
  success: "border-success/25 border-l-success bg-success/10",
  warning: "border-warning/30 border-l-warning bg-warning/12",
  destructive: "border-destructive/25 border-l-destructive bg-destructive/10",
}

const LANE_H = 40
const LANE_GAP = 4
const ROW_PAD = 6

type Item = {
  id: string
  resourceId: string
  title: string
  status?: string
  tone: SchedulerTone
  s: number
  t: number
}

type Active = {
  mode: "drag" | "key"
  id: string
  resourceId: string
  s: number
  t: number
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function Scheduler({
  resources = SAMPLE_SCHEDULER_RESOURCES,
  events = SAMPLE_SCHEDULER_EVENTS,
  view: viewProp,
  defaultView = "week",
  onViewChange,
  date: dateProp,
  defaultDate,
  onDateChange,
  timeZone = "UTC",
  locale,
  startHour = 8,
  endHour = 18,
  weekStartsOn = 1,
  snapMinutes = 15,
  now,
  onEventClick,
  onSlotClick,
  onEventMove,
  labels: labelsProp,
  className,
}: SchedulerProps) {
  const labels = React.useMemo(
    () => ({ ...DEFAULT_SCHEDULER_LABELS, ...labelsProp }),
    [labelsProp]
  )
  const zone = React.useMemo(() => validZone(timeZone), [timeZone])
  const sh = clamp(Math.floor(startHour), 0, 23)
  const eh = clamp(Math.floor(endHour), sh + 1, 24)
  const snapMs = Math.max(1, snapMinutes) * MIN
  const hintId = React.useId()

  /* View + date: controlled or uncontrolled ------------------------------- */
  const [viewState, setViewState] = React.useState<SchedulerView>(defaultView)
  const view = viewProp ?? viewState
  const [dateState, setDateState] = React.useState<number>(() => {
    const candidates = [
      toMs(defaultDate),
      toMs(now),
      ...events.map((e) => toMs(e.start)),
    ]
    // Fixed fallback so render never reads the clock.
    return candidates.find(Number.isFinite) ?? Date.UTC(2026, 0, 5, 12)
  })
  const dateMs = dateProp !== undefined ? toMs(dateProp) : dateState
  const safeDateMs = Number.isFinite(dateMs) ? dateMs : Date.UTC(2026, 0, 5, 12)
  const nowMs = toMs(now)

  const setView = (v: SchedulerView) => {
    if (viewProp === undefined) setViewState(v)
    onViewChange?.(v)
  }
  const setDate = (ms: number) => {
    if (dateProp === undefined) setDateState(ms)
    onDateChange?.(new Date(ms))
  }

  /* Visible window --------------------------------------------------------- */
  const segments = React.useMemo<Segment[]>(() => {
    const p = zonedParts(safeDateMs, zone)
    let first: CalendarDay = { y: p.y, m: p.m, d: p.d }
    if (view === "week") {
      const dow = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()
      first = addDays(first, -((dow - weekStartsOn + 7) % 7))
    }
    return Array.from({ length: view === "week" ? 7 : 1 }, (_, i) => {
      const day = addDays(first, i)
      return {
        ...day,
        start: zonedToUtc(day.y, day.m, day.d, sh, 0, zone),
        end: zonedToUtc(day.y, day.m, day.d, eh, 0, zone),
      }
    })
  }, [safeDateMs, zone, view, weekStartsOn, sh, eh])

  const fmt = React.useMemo(() => {
    const make = (o: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, { timeZone: zone, ...o })
    return {
      time: make({ hour: "numeric", minute: "2-digit" }),
      hour: make({ hour: "numeric" }),
      weekday: make({ weekday: "short" }),
      dayNum: make({ day: "numeric" }),
      dateTime: make({
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      dayTitle: make({
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      short: make({ month: "short", day: "numeric" }),
      year: make({ year: "numeric" }),
    }
  }, [locale, zone])

  const noonOf = (g: Segment) => zonedToUtc(g.y, g.m, g.d, 12, 0, zone)

  const rangeLabel =
    view === "day"
      ? fmt.dayTitle.format(noonOf(segments[0]))
      : `${fmt.short.format(noonOf(segments[0]))} - ${fmt.short.format(
          noonOf(segments[segments.length - 1])
        )}, ${fmt.year.format(noonOf(segments[segments.length - 1]))}`

  const step = (dir: -1 | 1) => {
    const p = zonedParts(safeDateMs, zone)
    const next = addDays(
      { y: p.y, m: p.m, d: p.d },
      dir * (view === "week" ? 7 : 1)
    )
    setDate(zonedToUtc(next.y, next.m, next.d, 12, 0, zone))
  }

  /* Events: normalise, apply live move preview, detect conflicts ----------- */
  const [active, setActive] = React.useState<Active | null>(null)
  const [announcement, setAnnouncement] = React.useState("")

  const items = React.useMemo<Item[]>(() => {
    const known = new Set(resources.map((r) => r.id))
    return events.flatMap((e) => {
      const s = toMs(e.start)
      const t = toMs(e.end)
      if (!Number.isFinite(s) || !Number.isFinite(t) || t <= s) return []
      if (!known.has(e.resourceId)) return []
      const base: Item = {
        id: e.id,
        resourceId: e.resourceId,
        title: e.title,
        status: e.status,
        tone: e.tone ?? "default",
        s,
        t,
      }
      return [
        active && active.id === e.id
          ? { ...base, resourceId: active.resourceId, s: active.s, t: active.t }
          : base,
      ]
    })
  }, [events, resources, active])

  const { rows, conflicts } = React.useMemo(() => {
    const conflictIds = new Set<string>()
    const built = resources.map((resource) => {
      const own = items
        .filter((i) => i.resourceId === resource.id)
        .sort((a, b) => a.s - b.s || a.t - b.t)
      const laneEnds: number[] = []
      const placed = own.map((item) => {
        let lane = laneEnds.findIndex((end) => end <= item.s)
        if (lane === -1) lane = laneEnds.length
        laneEnds[lane] = item.t
        return { item, lane, pieces: piecesOf(segments, item.s, item.t) }
      })
      for (let a = 0; a < own.length; a++) {
        for (let b = a + 1; b < own.length; b++) {
          if (own[b].s >= own[a].t) break
          conflictIds.add(own[a].id)
          conflictIds.add(own[b].id)
        }
      }
      const lanes = Math.max(1, laneEnds.length)
      return {
        resource,
        placed: placed.filter((p) => p.pieces.length > 0),
        height: ROW_PAD * 2 + lanes * LANE_H + (lanes - 1) * LANE_GAP,
      }
    })
    return { rows: built, conflicts: conflictIds }
  }, [resources, items, segments])

  const resourceLabel = (id: string) =>
    resources.find((r) => r.id === id)?.label ?? id

  /* Pointer drag ------------------------------------------------------------ */
  const latest = React.useRef({ segments, snapMs, onEventMove, labels })
  React.useEffect(() => {
    latest.current = { segments, snapMs, onEventMove, labels }
  })
  const suppressClick = React.useRef(false)
  const refocus = React.useRef<string | null>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const stopDrag = React.useRef<(() => void) | null>(null)

  React.useEffect(() => () => stopDrag.current?.(), [])

  // Keep keyboard focus on a moved event after it re-mounts in another row.
  React.useEffect(() => {
    const id = refocus.current
    if (!id || !rootRef.current) return
    const el = Array.from(
      rootRef.current.querySelectorAll<HTMLElement>("[data-event-id]")
    ).find((n) => n.dataset.eventId === id && n.dataset.piece === "0")
    if (el) {
      el.focus()
      refocus.current = null
    }
  })

  const startDrag = (
    e: React.PointerEvent<HTMLElement>,
    item: Item,
    track: HTMLElement
  ) => {
    if (!onEventMove || e.button !== 0) return
    const rect = track.getBoundingClientRect()
    if (rect.width <= 0) return
    const segs = latest.current.segments
    const grab = timeAt(segs, (e.clientX - rect.left) / rect.width)
    const ctx = {
      moved: false,
      resourceId: item.resourceId,
      s: item.s,
      t: item.t,
    }
    const startX = e.clientX
    const startY = e.clientY

    const move = (pe: PointerEvent) => {
      if (
        !ctx.moved &&
        Math.hypot(pe.clientX - startX, pe.clientY - startY) < 4
      )
        return
      ctx.moved = true
      const here = timeAt(segs, (pe.clientX - rect.left) / rect.width)
      const snap = latest.current.snapMs
      const delta = Math.round((here - grab) / snap) * snap
      const row = document
        .elementFromPoint(pe.clientX, pe.clientY)
        ?.closest<HTMLElement>("[data-resource-id]")
      if (row?.dataset.resourceId) ctx.resourceId = row.dataset.resourceId
      ctx.s = item.s + delta
      ctx.t = item.t + delta
      setActive({
        mode: "drag",
        id: item.id,
        resourceId: ctx.resourceId,
        s: ctx.s,
        t: ctx.t,
      })
    }
    const end = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", cancel)
      stopDrag.current = null
    }
    const up = () => {
      end()
      if (ctx.moved) {
        suppressClick.current = true
        window.setTimeout(() => {
          suppressClick.current = false
        }, 0)
        refocus.current = item.id
        latest.current.onEventMove?.(item.id, {
          resourceId: ctx.resourceId,
          start: new Date(ctx.s),
          end: new Date(ctx.t),
        })
      }
      setActive(null)
    }
    const cancel = () => {
      end()
      setActive(null)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    window.addEventListener("pointercancel", cancel)
    stopDrag.current = end
  }

  /* Keyboard move ------------------------------------------------------------ */
  const describeMove = (template: string, a: Active, title: string) =>
    fill(template, {
      title,
      resource: resourceLabel(a.resourceId),
      start: fmt.dateTime.format(a.s),
      end: fmt.time.format(a.t),
    })

  const onBarKeyDown = (e: React.KeyboardEvent<HTMLElement>, item: Item) => {
    if (!onEventMove) return
    const holding = active?.mode === "key" && active.id === item.id
    if (!holding) {
      if (e.key === " ") {
        e.preventDefault()
        const next: Active = {
          mode: "key",
          id: item.id,
          resourceId: item.resourceId,
          s: item.s,
          t: item.t,
        }
        setActive(next)
        setAnnouncement(describeMove(labels.pickedUp, next, item.title))
      }
      return
    }
    const a = active
    let next: Active | null = null
    const unit = e.shiftKey ? HOUR : snapMs
    switch (e.key) {
      case "ArrowLeft":
        next = { ...a, s: a.s - unit, t: a.t - unit }
        break
      case "ArrowRight":
        next = { ...a, s: a.s + unit, t: a.t + unit }
        break
      case "PageUp":
        next = { ...a, s: a.s - DAY, t: a.t - DAY }
        break
      case "PageDown":
        next = { ...a, s: a.s + DAY, t: a.t + DAY }
        break
      case "ArrowUp":
      case "ArrowDown": {
        const i = resources.findIndex((r) => r.id === a.resourceId)
        const j = clamp(
          i + (e.key === "ArrowUp" ? -1 : 1),
          0,
          resources.length - 1
        )
        next = { ...a, resourceId: resources[j].id }
        break
      }
      case "Enter":
      case " ":
        e.preventDefault()
        refocus.current = item.id
        onEventMove(item.id, {
          resourceId: a.resourceId,
          start: new Date(a.s),
          end: new Date(a.t),
        })
        setActive(null)
        setAnnouncement(describeMove(labels.dropped, a, item.title))
        return
      case "Escape":
        e.preventDefault()
        setActive(null)
        setAnnouncement(labels.cancelled)
        return
      case "Tab":
        setActive(null)
        return
      default:
        return
    }
    e.preventDefault()
    if (next.resourceId !== a.resourceId) refocus.current = item.id
    setActive(next)
    setAnnouncement(describeMove(labels.moving, next, item.title))
  }

  /* Derived bits for rendering ---------------------------------------------- */
  const n = segments.length
  const hours = eh - sh
  const nowPos = Number.isFinite(nowMs) ? positionOf(segments, nowMs) : null
  const todayIndex = Number.isFinite(nowMs)
    ? segments.findIndex(
        (g) => nowMs >= g.start - sh * HOUR && nowMs < g.start - sh * HOUR + DAY
      )
    : -1
  const minTrack = view === "week" ? 7 * 128 : hours * 56
  const canMove = Boolean(onEventMove)

  const describe = (item: Item) => {
    const conflict = conflicts.has(item.id)
    return [
      item.title,
      resourceLabel(item.resourceId),
      `${fmt.dateTime.format(item.s)} - ${fmt.time.format(item.t)}`,
      item.status,
      conflict ? labels.conflict : undefined,
    ]
      .filter(Boolean)
      .join(", ")
  }

  const agendaRows = rows.map((row) => ({
    resource: row.resource,
    items: row.placed.map((p) => p.item),
  }))

  return (
    <div
      data-slot="scheduler"
      className={cn(
        "@container/scheduler flex h-full min-h-0 w-full flex-col bg-background text-foreground",
        className
      )}
    >
      {/* Toolbar */}
      <div
        data-slot="scheduler-toolbar"
        className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2"
      >
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={labels.previous}
            onClick={() => step(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={labels.next}
            onClick={() => step(1)}
          >
            <ChevronRight />
          </Button>
          {Number.isFinite(nowMs) && (
            <Button variant="outline" size="sm" onClick={() => setDate(nowMs)}>
              {labels.today}
            </Button>
          )}
        </div>
        <h2
          className="min-w-0 flex-1 truncate heading text-lg"
          aria-live="polite"
        >
          {rangeLabel}
        </h2>
        <div className="flex items-center gap-2">
          {conflicts.size > 0 && (
            <Badge variant="destructive">
              <TriangleAlert aria-hidden />
              {fill(labels.conflicts, { count: conflicts.size })}
            </Badge>
          )}
          <div
            role="group"
            aria-label={labels.view}
            className="inline-flex items-center gap-0.5 rounded-md border p-0.5"
          >
            {(["day", "week"] as const).map((v) => (
              <Button
                key={v}
                size="xs"
                variant={view === v ? "secondary" : "ghost"}
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                {labels[v]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {canMove && (
        <p id={hintId} className="sr-only">
          {labels.moveHint}
        </p>
      )}

      {/* Timeline (from @md) */}
      <div
        ref={rootRef}
        data-slot="scheduler-timeline"
        className="hidden min-h-0 flex-1 overflow-auto @md/scheduler:block"
      >
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            {labels.noResources}
          </p>
        ) : (
          <div
            role="group"
            aria-label={labels.schedule}
            style={{ minWidth: `calc(9rem + ${minTrack}px)` }}
          >
            {/* Time axis */}
            <div className="sticky top-0 z-30 flex border-b bg-background">
              <div className="sticky left-0 z-40 flex w-36 shrink-0 items-center border-r bg-background px-3 eyebrow text-muted-foreground">
                {labels.resource}
              </div>
              <div className="relative flex h-10 flex-1">
                {view === "day"
                  ? Array.from({ length: hours }, (_, i) => (
                      <div
                        key={i}
                        className="flex flex-1 items-center border-l px-1.5 font-mono text-xs text-muted-foreground first:border-l-0"
                      >
                        {fmt.hour.format(segments[0].start + i * HOUR)}
                      </div>
                    ))
                  : segments.map((g, i) => (
                      <div
                        key={g.start}
                        aria-current={i === todayIndex ? "date" : undefined}
                        className={cn(
                          "flex flex-1 items-center gap-1.5 border-l px-2 text-xs first:border-l-0",
                          i === todayIndex
                            ? "font-medium text-brand"
                            : "text-muted-foreground"
                        )}
                      >
                        <span className="eyebrow">
                          {fmt.weekday.format(noonOf(g))}
                        </span>
                        <span className="font-mono">
                          {fmt.dayNum.format(noonOf(g))}
                        </span>
                      </div>
                    ))}
                {nowPos !== null && (
                  <span
                    className="pointer-events-none absolute top-0 -translate-x-1/2 bg-brand px-1 eyebrow text-brand-foreground"
                    style={{ left: `${nowPos * 100}%` }}
                  >
                    {labels.now}
                  </span>
                )}
              </div>
            </div>

            {/* Rows */}
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 left-36"
              >
                {Array.from(
                  { length: (view === "day" ? hours : n) - 1 },
                  (_, i) => (
                    <div
                      key={i}
                      className="absolute inset-y-0 border-l"
                      style={{
                        left: `${((i + 1) / (view === "day" ? hours : n)) * 100}%`,
                      }}
                    />
                  )
                )}
              </div>
              {rows.map(({ resource, placed, height }) => (
                <div
                  key={resource.id}
                  role="group"
                  aria-label={resource.label}
                  data-slot="scheduler-row"
                  className="relative flex border-b"
                >
                  <div className="sticky left-0 z-20 flex w-36 shrink-0 items-start justify-between gap-1 border-r bg-background px-3 py-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {resource.label}
                      </div>
                      {resource.meta && (
                        <div className="truncate text-xs text-muted-foreground">
                          {resource.meta}
                        </div>
                      )}
                    </div>
                    {onSlotClick && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={fill(labels.addEvent, {
                          resource: resource.label,
                        })}
                        onClick={() =>
                          onSlotClick(resource.id, new Date(segments[0].start))
                        }
                      >
                        <Plus />
                      </Button>
                    )}
                  </div>
                  <div
                    data-slot="scheduler-track"
                    data-resource-id={resource.id}
                    className={cn(
                      "relative flex-1",
                      onSlotClick && "cursor-cell"
                    )}
                    style={{ height }}
                    onClick={(e) => {
                      if (e.target !== e.currentTarget || !onSlotClick) return
                      const rect = e.currentTarget.getBoundingClientRect()
                      const t = timeAt(
                        segments,
                        (e.clientX - rect.left) / rect.width
                      )
                      onSlotClick(
                        resource.id,
                        new Date(Math.floor(t / snapMs) * snapMs)
                      )
                    }}
                  >
                    {nowPos !== null && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 z-[5] w-px bg-brand"
                        style={{ left: `${nowPos * 100}%` }}
                      />
                    )}
                    {placed.flatMap(({ item, lane, pieces }) =>
                      pieces.map((piece, idx) => {
                        const conflict = conflicts.has(item.id)
                        const moving = active?.id === item.id
                        const first = idx === 0
                        return (
                          <button
                            key={`${item.id}:${idx}`}
                            type="button"
                            data-slot="scheduler-event"
                            data-event-id={item.id}
                            data-piece={idx}
                            data-conflict={conflict || undefined}
                            data-moving={moving || undefined}
                            aria-label={describe(item)}
                            aria-describedby={canMove ? hintId : undefined}
                            aria-hidden={first ? undefined : true}
                            tabIndex={first ? 0 : -1}
                            title={describe(item)}
                            className={cn(
                              "absolute z-10 flex flex-col justify-center gap-0.5 overflow-hidden rounded-sm border border-l-[3px] px-1.5 text-left text-xs text-foreground outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring",
                              toneClass[item.tone],
                              conflict && "ring-1 ring-destructive",
                              canMove && "cursor-grab touch-none",
                              moving && "z-20 cursor-grabbing ring-2 ring-ring"
                            )}
                            style={{
                              left: `${piece.x0 * 100}%`,
                              width: `max(${(piece.x1 - piece.x0) * 100}%, 1.25rem)`,
                              top: ROW_PAD + lane * (LANE_H + LANE_GAP),
                              height: LANE_H,
                            }}
                            onPointerDown={(e) => {
                              const track =
                                e.currentTarget.closest<HTMLElement>(
                                  "[data-slot='scheduler-track']"
                                )
                              if (track) startDrag(e, item, track)
                            }}
                            onKeyDown={(e) => onBarKeyDown(e, item)}
                            onKeyUp={(e) => {
                              if (e.key === " " && canMove) e.preventDefault()
                            }}
                            onClick={() => {
                              if (suppressClick.current) return
                              const original = events.find(
                                (ev) => ev.id === item.id
                              )
                              if (original) onEventClick?.(original)
                            }}
                          >
                            <span className="truncate leading-tight font-medium">
                              {item.title}
                            </span>
                            <span className="flex items-center gap-1 truncate leading-tight text-muted-foreground">
                              {conflict && (
                                <Badge
                                  variant="destructive"
                                  className="h-4 gap-0.5 px-1 py-0 text-[10px] [&>svg]:size-2.5"
                                >
                                  <TriangleAlert aria-hidden />
                                  {labels.conflict}
                                </Badge>
                              )}
                              <span className="truncate">
                                {item.status ?? fmt.time.format(item.s)}
                              </span>
                            </span>
                          </button>
                        )
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Agenda (below @md) */}
      <div
        data-slot="scheduler-agenda"
        className="min-h-0 flex-1 overflow-y-auto @md/scheduler:hidden"
      >
        {agendaRows.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            {labels.noResources}
          </p>
        )}
        {agendaRows.map(({ resource, items: list }) => (
          <section
            key={resource.id}
            aria-label={resource.label}
            className="border-b"
          >
            <div className="flex items-baseline justify-between gap-2 px-4 pt-3 pb-1">
              <h3 className="truncate heading text-base">{resource.label}</h3>
              {resource.meta && (
                <span className="truncate eyebrow text-muted-foreground">
                  {resource.meta}
                </span>
              )}
            </div>
            {list.length === 0 ? (
              <p className="px-4 pb-3 text-sm text-muted-foreground">
                {labels.noEvents}
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5 px-3 pb-3">
                {list.map((item) => {
                  const conflict = conflicts.has(item.id)
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-label={describe(item)}
                        onClick={() => {
                          const original = events.find(
                            (ev) => ev.id === item.id
                          )
                          if (original) onEventClick?.(original)
                        }}
                        className={cn(
                          "flex w-full flex-col gap-1 rounded-sm border border-l-[3px] px-3 py-2 text-left text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                          toneClass[item.tone],
                          conflict && "ring-1 ring-destructive"
                        )}
                      >
                        <span className="font-medium">{item.title}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {fmt.dateTime.format(item.s)} -{" "}
                          {fmt.time.format(item.t)}
                        </span>
                        {(item.status || conflict) && (
                          <span className="flex flex-wrap items-center gap-1.5">
                            {conflict && (
                              <Badge variant="destructive">
                                <TriangleAlert aria-hidden />
                                {labels.conflict}
                              </Badge>
                            )}
                            {item.status && (
                              <Badge variant="outline">{item.status}</Badge>
                            )}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

export { Scheduler }
