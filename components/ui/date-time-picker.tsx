"use client"

import * as React from "react"
import {
  CalendarClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* -------------------------------------------------------------------------- */
/*  DateTimePicker: pick a wall-clock date and time in a NAMED time zone.      */
/*                                                                            */
/*  The value is always an instant (UTC ISO string). The zone only decides how */
/*  that instant is read and written. Everything uses Intl, no dependency.     */
/*                                                                            */
/*  DST behaviour (documented, tested against America/New_York 2026):          */
/*  - Gap (spring forward, 02:30 on 2026-03-08 does not exist): the wall time  */
/*    is moved forward by the length of the gap (to 03:30) and a notice says   */
/*    so. onChange reports `adjusted: "gap"`.                                  */
/*  - Overlap (fall back, 01:30 on 2026-11-01 happens twice): the earlier      */
/*    occurrence is used by default (`overlap="later"` flips it) and a          */
/*    First / Second toggle appears so the person can choose. The instant in   */
/*    `value` is what disambiguates, so it survives a round trip.              */
/*  - Changing the zone keeps the same instant and re-reads it in the new zone.*/
/* -------------------------------------------------------------------------- */

type Wall = { y: number; mo: number; d: number; hh: number; mm: number }
type Zoned = Wall & { offset: number }

const pad = (n: number, len = 2) => String(n).padStart(len, "0")

/* ------------------------------ Intl helpers ------------------------------ */

const zoneFmtCache = new Map<string, Intl.DateTimeFormat>()

function zoneFmt(tz: string): Intl.DateTimeFormat {
  let f = zoneFmtCache.get(tz)
  if (!f) {
    try {
      f = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hourCycle: "h23",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })
    } catch {
      f = zoneFmt("UTC")
    }
    zoneFmtCache.set(tz, f)
  }
  return f
}

function safeZone(tz: string): string {
  try {
    return zoneFmt(tz).resolvedOptions().timeZone
  } catch {
    return "UTC"
  }
}

/** Wall-clock parts of an instant in a zone, plus its UTC offset in minutes. */
function zoned(ms: number, tz: string): Zoned {
  const p: Record<string, number> = {}
  for (const part of zoneFmt(tz).formatToParts(ms)) {
    if (part.type !== "literal") p[part.type] = Number(part.value)
  }
  const hh = (p.hour ?? 0) % 24
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, hh, p.minute, p.second)
  return {
    y: p.year,
    mo: p.month - 1,
    d: p.day,
    hh,
    mm: p.minute,
    offset: Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000),
  }
}

type Resolved = {
  ms: number
  kind: "normal" | "gap" | "overlap"
  /** Every instant that shows this wall time (2 in an overlap, 0 in a gap). */
  candidates: number[]
}

/** Turn a wall time in a zone into an instant, handling gaps and overlaps. */
function resolveWall(w: Wall, tz: string, preferLater: boolean): Resolved {
  const guess = Date.UTC(w.y, w.mo, w.d, w.hh, w.mm)
  const day = 86_400_000
  const offsets = new Set([
    zoned(guess - day, tz).offset,
    zoned(guess, tz).offset,
    zoned(guess + day, tz).offset,
  ])
  const valid = [...offsets]
    .map((o) => ({ o, t: guess - o * 60000 }))
    .filter(({ o, t }) => zoned(t, tz).offset === o)
    .map(({ t }) => t)
    .sort((a, b) => a - b)
  if (valid.length === 0) {
    // Gap: read the wall time with the offset from before the gap, which lands
    // after it (02:30 EST becomes 03:30 EDT).
    const before = zoned(guess - day, tz).offset
    return { ms: guess - before * 60000, kind: "gap", candidates: [] }
  }
  if (valid.length > 1) {
    return {
      ms: preferLater ? valid[valid.length - 1] : valid[0],
      kind: "overlap",
      candidates: valid,
    }
  }
  return { ms: valid[0], kind: "normal", candidates: valid }
}

const OFFSET_RE = /(?:[zZ]|[+-]\d{2}(?::?\d{2})?)$/
const ISO_LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/

/** Parse an ISO instant, or a bare local ISO string read in `tz`. */
function parseValue(value: string | undefined, tz: string): number | null {
  if (!value) return null
  if (OFFSET_RE.test(value) && value.length > 10) {
    const t = Date.parse(value)
    return Number.isNaN(t) ? null : t
  }
  const m = ISO_LOCAL_RE.exec(value)
  if (!m) return null
  return resolveWall(
    {
      y: Number(m[1]),
      mo: Number(m[2]) - 1,
      d: Number(m[3]),
      hh: Number(m[4] ?? 0),
      mm: Number(m[5] ?? 0),
    },
    tz,
    false
  ).ms
}

function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "-" : "+"
  const abs = Math.abs(minutes)
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}

function zoneAbbreviation(ms: number, tz: string, locale?: string): string {
  try {
    return (
      new Intl.DateTimeFormat(locale, { timeZone: tz, timeZoneName: "short" })
        .formatToParts(ms)
        .find((p) => p.type === "timeZoneName")?.value ?? tz
    )
  } catch {
    return tz
  }
}

function cityOf(tz: string) {
  return (tz.split("/").pop() ?? tz).replace(/_/g, " ")
}

function detectCycle(locale?: string): 12 | 24 {
  try {
    const c = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
    }).resolvedOptions().hourCycle
    return c === "h11" || c === "h12" ? 12 : 24
  } catch {
    return 24
  }
}

const wallDay = (w: Pick<Wall, "y" | "mo" | "d">) =>
  `${pad(w.y, 4)}-${pad(w.mo + 1)}-${pad(w.d)}`

const wallLocal = (w: Wall) => `${wallDay(w)}T${pad(w.hh)}:${pad(w.mm)}`

/* ------------------------------ Day arithmetic ------------------------------ */

const daysInMonth = (y: number, mo: number) =>
  new Date(Date.UTC(y, mo + 1, 0)).getUTCDate()

function parseDay(day: string) {
  const [y, m, d] = day.split("-").map(Number)
  return { y, mo: m - 1, d }
}

function addDays(day: string, n: number) {
  const p = parseDay(day)
  const t = new Date(Date.UTC(p.y, p.mo, p.d + n))
  return wallDay({
    y: t.getUTCFullYear(),
    mo: t.getUTCMonth(),
    d: t.getUTCDate(),
  })
}

function addMonths(day: string, n: number) {
  const p = parseDay(day)
  const total = p.y * 12 + p.mo + n
  const y = Math.floor(total / 12)
  const mo = total - y * 12
  return wallDay({ y, mo, d: Math.min(p.d, daysInMonth(y, mo)) })
}

const utcDate = (y: number, mo: number, d: number, hh = 0, mm = 0) =>
  new Date(Date.UTC(y, mo, d, hh, mm))

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "")
}

function subscribeNever() {
  return () => {}
}

/* --------------------------------- Labels ---------------------------------- */

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

const DEFAULT_LABELS: DateTimePickerLabels = {
  placeholder: "Pick date and time",
  chooseDate: "Choose date and time",
  time: "Time",
  hours: "Hours",
  minutes: "Minutes",
  am: "AM",
  pm: "PM",
  amPm: "AM or PM",
  timeZone: "Time zone",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  alsoShowing: "Same moment in",
  gap: "{time} does not exist on this date in {zone} because clocks skip forward. Moved to {adjusted}.",
  clamped: "Outside the allowed range. Set to {time}.",
  ambiguous:
    "This time happens twice in {zone} because clocks go back. Which one?",
  earlier: "First",
  later: "Second",
}

/* -------------------------------- Calendar --------------------------------- */

function PickerCalendar({
  value,
  onSelect,
  today,
  minDay,
  maxDay,
  locale,
  weekStartsOn,
  initialFocus,
  labels,
}: {
  value?: string
  onSelect: (day: string) => void
  today: string
  minDay?: string
  maxDay?: string
  locale?: string
  weekStartsOn: number
  initialFocus: string
  labels: DateTimePickerLabels
}) {
  const [focused, setFocused] = React.useState(initialFocus)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const moveFocus = React.useRef(false)

  const fp = parseDay(focused)
  const first = wallDay({ ...fp, d: 1 })
  const offset = (utcDate(fp.y, fp.mo, 1).getUTCDay() - weekStartsOn + 7) % 7

  const fmt = React.useMemo(
    () => ({
      month: new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      weekdayShort: new Intl.DateTimeFormat(locale, {
        weekday: "short",
        timeZone: "UTC",
      }),
      weekdayLong: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        timeZone: "UTC",
      }),
      full: new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeZone: "UTC",
      }),
    }),
    [locale]
  )

  const weekdays = React.useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const dow = (weekStartsOn + i) % 7
        const d = utcDate(2023, 0, 1 + dow) // 2023-01-01 was a Sunday
        return {
          short: fmt.weekdayShort.format(d),
          long: fmt.weekdayLong.format(d),
        }
      }),
    [fmt, weekStartsOn]
  )

  React.useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-day="${focused}"]`)
      ?.focus()
  }, [focused])

  function go(next: string, focus = true) {
    moveFocus.current = focus
    setFocused(next)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const col = (offset + fp.d - 1) % 7
    const map: Record<string, string> = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7),
      ArrowDown: addDays(focused, 7),
      PageUp: addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: addMonths(focused, e.shiftKey ? 12 : 1),
      Home: addDays(focused, -col),
      End: addDays(focused, 6 - col),
    }
    const next = map[e.key]
    if (!next) return
    e.preventDefault()
    go(next)
  }

  const navButton =
    "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring"
  const monthLabel = fmt.month.format(utcDate(fp.y, fp.mo, 1))

  return (
    <div data-slot="date-time-picker-calendar" className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          className={navButton}
          aria-label={labels.previousMonth}
          onClick={() => go(addMonths(focused, -1), false)}
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <div
          aria-live="polite"
          className="heading text-sm font-medium tabular-nums"
        >
          {monthLabel}
        </div>
        <button
          type="button"
          className={navButton}
          aria-label={labels.nextMonth}
          onClick={() => go(addMonths(focused, 1), false)}
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-label={monthLabel}
        onKeyDown={onKeyDown}
      >
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((w) => (
            <div
              key={w.long}
              role="columnheader"
              aria-label={w.long}
              className="py-1 text-center eyebrow"
            >
              {w.short.slice(0, 2)}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} role="row" className="grid grid-cols-7">
            {Array.from({ length: 7 }, (_, col) => {
              const day = addDays(first, row * 7 + col - offset)
              const dp = parseDay(day)
              const outside = dp.mo !== fp.mo
              const selected = value === day
              const disabled =
                (!!minDay && day < minDay) || (!!maxDay && day > maxDay)
              const isToday = today === day
              return (
                <div
                  key={day}
                  role="gridcell"
                  aria-selected={selected || undefined}
                  className="flex justify-center p-px"
                >
                  <button
                    type="button"
                    data-day={day}
                    data-today={isToday || undefined}
                    data-selected={selected || undefined}
                    data-outside={outside || undefined}
                    tabIndex={day === focused ? 0 : -1}
                    aria-disabled={disabled || undefined}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={fmt.full.format(utcDate(dp.y, dp.mo, dp.d))}
                    onClick={() => {
                      if (!disabled) onSelect(day)
                    }}
                    onFocus={() => {
                      if (day !== focused) setFocused(day)
                    }}
                    className={cn(
                      "relative inline-flex size-8 items-center justify-center rounded-md font-mono text-xs tabular-nums transition-colors outline-none",
                      "hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring",
                      "data-[outside]:text-muted-foreground/60",
                      "data-[today]:font-semibold data-[today]:text-brand",
                      "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary",
                      "aria-disabled:pointer-events-none aria-disabled:opacity-35"
                    )}
                  >
                    {dp.d}
                    {isToday && !selected && (
                      <span
                        aria-hidden
                        className="absolute bottom-0.5 size-[3px] rounded-full bg-brand"
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------- Time field -------------------------------- */

function TimeField({
  hh,
  mm,
  cycle,
  step,
  onChange,
  disabled,
  labels,
}: {
  hh: number
  mm: number
  cycle: 12 | 24
  step: number
  onChange: (hh: number, mm: number) => void
  disabled?: boolean
  labels: DateTimePickerLabels
}) {
  const shownHour = cycle === 12 ? hh % 12 || 12 : hh
  const [hourDraft, setHourDraft] = React.useState(pad(shownHour))
  const [minDraft, setMinDraft] = React.useState(pad(mm))
  const pm = hh >= 12

  // Re-sync drafts when the committed value changes from outside.
  const [prev, setPrev] = React.useState({ hh, mm, cycle })
  if (prev.hh !== hh || prev.mm !== mm || prev.cycle !== cycle) {
    setPrev({ hh, mm, cycle })
    setHourDraft(pad(shownHour))
    setMinDraft(pad(mm))
  }

  const snap = (m: number) =>
    Math.min(Math.round(m / step) * step, Math.floor(59 / step) * step)

  function commit(hourText: string, minText: string, nextPm = pm) {
    const mmNum = snap(
      Math.min(59, Math.max(0, Number.parseInt(minText, 10) || 0))
    )
    let hNum = Number.parseInt(hourText, 10)
    if (Number.isNaN(hNum)) hNum = shownHour
    let h24: number
    if (cycle === 12) {
      h24 = (Math.min(12, Math.max(1, hNum)) % 12) + (nextPm ? 12 : 0)
    } else {
      h24 = Math.min(23, Math.max(0, hNum))
    }
    setHourDraft(pad(cycle === 12 ? h24 % 12 || 12 : h24))
    setMinDraft(pad(mmNum))
    onChange(h24, mmNum)
  }

  function onKey(kind: "h" | "m") {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        commit(hourDraft, minDraft)
        return
      }
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
      e.preventDefault()
      const dir = e.key === "ArrowUp" ? 1 : -1
      if (kind === "h") {
        const next = (hh + dir + 24) % 24
        setHourDraft(pad(cycle === 12 ? next % 12 || 12 : next))
        onChange(next, mm)
      } else {
        const next = snap((((mm + dir * step) % 60) + 60) % 60)
        setMinDraft(pad(next))
        onChange(hh, next)
      }
    }
  }

  const field = "w-12 px-0 text-center font-mono tabular-nums"

  return (
    <div
      role="group"
      aria-label={labels.time}
      className="flex items-center gap-1.5"
      data-slot="date-time-picker-time"
    >
      <span className="mr-auto eyebrow">{labels.time}</span>
      <Input
        inputMode="numeric"
        maxLength={2}
        aria-label={labels.hours}
        disabled={disabled}
        className={field}
        value={hourDraft}
        onChange={(e) => setHourDraft(e.target.value.replace(/\D/g, ""))}
        onBlur={() => commit(hourDraft, minDraft)}
        onKeyDown={onKey("h")}
        onFocus={(e) => e.currentTarget.select()}
      />
      <span aria-hidden className="font-mono text-muted-foreground">
        :
      </span>
      <Input
        inputMode="numeric"
        maxLength={2}
        aria-label={labels.minutes}
        disabled={disabled}
        className={field}
        value={minDraft}
        onChange={(e) => setMinDraft(e.target.value.replace(/\D/g, ""))}
        onBlur={() => commit(hourDraft, minDraft)}
        onKeyDown={onKey("m")}
        onFocus={(e) => e.currentTarget.select()}
      />
      {cycle === 12 && (
        <div
          role="group"
          aria-label={labels.amPm}
          className="ml-1 inline-flex h-9 overflow-hidden rounded-md border border-input"
        >
          {(["am", "pm"] as const).map((half) => {
            const active = (half === "pm") === pm
            return (
              <button
                key={half}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => commit(hourDraft, minDraft, half === "pm")}
                className={cn(
                  "px-2 font-mono text-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {labels[half]}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ----------------------------- DateTimePicker ------------------------------ */

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

const SAMPLE_TIME_ZONES: ZoneOption[] = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Kolkata", label: "Kolkata" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
]

function DateTimePicker({
  className,
  value,
  defaultValue,
  onChange,
  timeZone,
  defaultTimeZone = "UTC",
  onTimeZoneChange,
  timeZones,
  alsoShow,
  locale,
  hourCycle,
  minuteStep = 1,
  min,
  max,
  weekStartsOn = 0,
  defaultTime = "09:00",
  overlap = "earlier",
  labels: labelsProp,
  placeholder,
  disabled = false,
  invalid = false,
  align = "start",
  ...props
}: DateTimePickerProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const noticeId = React.useId()
  const [internal, setInternal] = React.useState(defaultValue)
  const [internalZone, setInternalZone] = React.useState(defaultTimeZone)
  const [open, setOpen] = React.useState(false)
  const [session, setSession] = React.useState(0)
  const [notice, setNotice] = React.useState<string | null>(null)

  const tz = safeZone(timeZone ?? internalZone)
  const current = value !== undefined ? value : internal
  const ms = parseValue(current, tz)
  const minMs = parseValue(min, tz)
  const maxMs = parseValue(max, tz)
  const z = ms === null ? null : zoned(ms, tz)
  const cycle = hourCycle ?? detectCycle(locale)
  const step = Math.max(1, Math.min(30, Math.floor(minuteStep) || 1))

  // "Today" in the working zone; empty during SSR and hydration.
  const today = React.useSyncExternalStore(
    subscribeNever,
    () => wallDay(zoned(Date.now(), tz)),
    () => ""
  )

  const fmt = React.useMemo(() => {
    const base = { timeZone: tz }
    return {
      full: new Intl.DateTimeFormat(locale, {
        ...base,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: cycle === 12,
      }),
      wall: new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        hour: "numeric",
        minute: "2-digit",
        hour12: cycle === 12,
      }),
    }
  }, [locale, tz, cycle])

  const wallText = (w: Wall) =>
    fmt.wall.format(utcDate(w.y, w.mo, w.d, w.hh, w.mm))

  function emit(t: number, adjusted?: "gap" | "clamped", message?: string) {
    const iso = new Date(t).toISOString()
    const zz = zoned(t, tz)
    if (value === undefined) setInternal(iso)
    setNotice(message ?? null)
    onChange?.(iso, {
      timeZone: tz,
      local: wallLocal(zz),
      offset: formatOffset(zz.offset),
      abbreviation: zoneAbbreviation(t, tz, locale),
      adjusted,
    })
  }

  function apply(w: Wall) {
    const r = resolveWall(w, tz, overlap === "later")
    let t = r.ms
    let adjusted: "gap" | "clamped" | undefined
    let message: string | undefined
    if (r.kind === "gap") {
      adjusted = "gap"
      message = fill(labels.gap, {
        time: wallText(w),
        adjusted: wallText(zoned(t, tz)),
        zone: cityOf(tz),
      })
    }
    if (minMs !== null && t < minMs) t = minMs
    else if (maxMs !== null && t > maxMs) t = maxMs
    if (t !== r.ms) {
      adjusted = "clamped"
      message = fill(labels.clamped, { time: wallText(zoned(t, tz)) })
    }
    emit(t, adjusted, message)
  }

  function chooseZone(next: string) {
    if (timeZone === undefined) setInternalZone(next)
    setNotice(null)
    onTimeZoneChange?.(next)
  }

  const defaults = React.useMemo(() => {
    const [dh, dm] = defaultTime.split(":").map(Number)
    return {
      hh: Number.isFinite(dh) ? dh : 9,
      mm: Number.isFinite(dm) ? dm : 0,
    }
  }, [defaultTime])
  const time = z ? { hh: z.hh, mm: z.mm } : defaults

  const selectedDay = z ? wallDay(z) : undefined
  const minDay = minMs === null ? undefined : wallDay(zoned(minMs, tz))
  const maxDay = maxMs === null ? undefined : wallDay(zoned(maxMs, tz))

  const overlapChoices =
    z && ms !== null ? resolveWall(z, tz, false).candidates : []

  const abbr = ms === null ? null : zoneAbbreviation(ms, tz, locale)
  const triggerText = ms === null ? null : `${fmt.full.format(ms)} ${abbr}`

  const zoneOptions = (timeZones ?? []).map((o) =>
    typeof o === "string"
      ? { value: o, label: cityOf(o) }
      : { value: o.value, label: o.label ?? cityOf(o.value) }
  )

  return (
    <div
      data-slot="date-time-picker"
      className={cn("flex w-full min-w-0 flex-col gap-2", className)}
    >
      {zoneOptions.length > 0 && (
        <Select value={tz} onValueChange={chooseZone} disabled={disabled}>
          <SelectTrigger
            aria-label={labels.timeZone}
            className="w-full font-mono text-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {zoneOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
                {ms !== null && (
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {zoneAbbreviation(ms, o.value, locale)}
                  </span>
                )}
              </SelectItem>
            ))}
            {!zoneOptions.some((o) => o.value === tz) && (
              <SelectItem value={tz}>{cityOf(tz)}</SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (next) {
            setSession((s) => s + 1)
            setNotice(null)
          }
          setOpen(next)
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            data-slot="date-time-picker-trigger"
            data-invalid={invalid || undefined}
            data-empty={!triggerText || undefined}
            aria-haspopup="dialog"
            aria-describedby={notice ? noticeId : undefined}
            className={cn(
              "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-left text-sm shadow-xs dark:bg-input/20",
              "transition-[border-color,box-shadow] duration-150 ease-out outline-none",
              "focus-visible:border-brand/60 focus-visible:ring-[3px] focus-visible:ring-ring",
              "data-[invalid]:border-destructive data-[invalid]:ring-destructive/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-[empty]:text-muted-foreground"
            )}
            {...props}
          >
            <span className="truncate tabular-nums" suppressHydrationWarning>
              {triggerText ?? placeholder ?? labels.placeholder}
            </span>
            <CalendarClockIcon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className="w-[min(19rem,calc(100vw-2rem))] p-3"
          aria-label={labels.chooseDate}
        >
          <PickerCalendar
            key={session}
            value={selectedDay}
            today={today}
            minDay={minDay}
            maxDay={maxDay}
            locale={locale}
            weekStartsOn={weekStartsOn}
            initialFocus={selectedDay ?? (today || "2000-01-01")}
            labels={labels}
            onSelect={(day) => apply({ ...parseDay(day), ...time })}
          />
          <div className="mt-3 border-t pt-3">
            <TimeField
              hh={time.hh}
              mm={time.mm}
              cycle={cycle}
              step={step}
              labels={labels}
              disabled={!selectedDay}
              onChange={(hh, mm) => {
                if (z) apply({ y: z.y, mo: z.mo, d: z.d, hh, mm })
              }}
            />
            {z && overlapChoices.length > 1 && (
              <div
                role="group"
                aria-label={fill(labels.ambiguous, { zone: cityOf(tz) })}
                className="mt-3 flex flex-col gap-1.5"
              >
                <p className="text-xs text-muted-foreground">
                  {fill(labels.ambiguous, { zone: cityOf(tz) })}
                </p>
                <div className="grid grid-cols-2 overflow-hidden rounded-md border border-input">
                  {overlapChoices.map((c, i) => {
                    const o = zoned(c, tz).offset
                    const active = o === z.offset
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={active}
                        onClick={() => emit(c)}
                        className={cn(
                          "px-2 py-1.5 text-left font-mono text-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {i === 0 ? labels.earlier : labels.later}
                        <span className="block opacity-80">
                          {zoneAbbreviation(c, tz, locale)} {formatOffset(o)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <div aria-live="polite" id={noticeId}>
        {notice && (
          <p
            data-slot="date-time-picker-notice"
            className="border-l-2 border-warning pl-2 text-xs text-muted-foreground"
          >
            {notice}
          </p>
        )}
      </div>
      {z && ms !== null && (
        <p
          data-slot="date-time-picker-zone"
          className="font-mono text-xs text-muted-foreground tabular-nums"
        >
          <span className="text-foreground">{abbr}</span> · UTC
          {formatOffset(z.offset)} · {tz}
        </p>
      )}
      {ms !== null && alsoShow && alsoShow.length > 0 && (
        <div data-slot="date-time-picker-also" className="flex flex-col gap-1">
          <span className="eyebrow">{labels.alsoShowing}</span>
          <ul className="flex flex-col gap-1">
            {alsoShow.map((entry) => {
              const zone = safeZone(
                typeof entry === "string" ? entry : entry.timeZone
              )
              const label =
                typeof entry === "string"
                  ? cityOf(zone)
                  : (entry.label ?? cityOf(zone))
              const o = zoned(ms, zone).offset
              const text = new Intl.DateTimeFormat(locale, {
                timeZone: zone,
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: cycle === 12,
              }).format(ms)
              return (
                <li
                  key={zone}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm"
                >
                  <span>{label}</span>
                  <span
                    className="font-mono text-xs tabular-nums"
                    suppressHydrationWarning
                  >
                    {text}{" "}
                    <span className="text-muted-foreground">
                      {zoneAbbreviation(ms, zone, locale)} {formatOffset(o)}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export { DateTimePicker, SAMPLE_TIME_ZONES }
export type {
  AlsoShowZone,
  DateTimeChangeMeta,
  DateTimePickerLabels,
  DateTimePickerProps,
  ZoneOption,
}
