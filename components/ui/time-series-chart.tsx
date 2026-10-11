"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ── types ── */

type TimeSeriesPoint = {
  /** Timestamp: epoch milliseconds, a Date, or an ISO string. */
  t: number | Date | string
  /** `null` (or NaN) is a gap: the line breaks, nothing is interpolated. */
  v: number | null
}

type TimeSeries = {
  id: string
  label: string
  points: TimeSeriesPoint[]
  /** Overrides the chart-level `unit` for this series. */
  unit?: string
  /** Any CSS color value or token, e.g. `var(--brand)`. Defaults by order. */
  color?: string
  /** SVG dash pattern, e.g. "6 3". Defaults by order so lines differ without color. */
  dash?: string
}

type ThresholdTone = "neutral" | "warning" | "destructive" | "success" | "brand"

type TimeSeriesThreshold = {
  id: string
  /** Visible text on the chart, e.g. "Limit 80%". Always shown. */
  label: string
  /** Line position, or the lower edge of a band. */
  value: number
  /** When set, draws a band between `value` and `to` instead of a line. */
  to?: number
  tone?: ThresholdTone
}

type TimeSeriesLabels = {
  legend: string
  resetZoom: string
  dataTable: string
  time: string
  noData: string
  /** Screen reader hint for the focusable plot. */
  instructions: string
  zoomed: string
  empty: string
  /** Builds the live readout text. */
  readout: (time: string, parts: { label: string; value: string }[]) => string
}

type TimeSeriesChartProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onChange"
> & {
  series?: TimeSeries[]
  /** IANA time zone used for every axis, tooltip and table label. Defaults to UTC. */
  timeZone?: string
  /** BCP 47 locale for date and number formatting. */
  locale?: string
  /** Suffix for values, e.g. "%" or "MW". Ignored when `formatValue` is set. */
  unit?: string
  formatValue?: (value: number, series: TimeSeries) => string
  thresholds?: TimeSeriesThreshold[]
  /** Fixed y bounds; leave a side undefined to fit the data. */
  yDomain?: [number | undefined, number | undefined]
  /** Plot height in px. */
  height?: number
  /** Accessible name of the chart. */
  title?: string
  labels?: Partial<TimeSeriesLabels>
  onZoomChange?: (range: [number, number] | null) => void
}

const DEFAULT_LABELS: TimeSeriesLabels = {
  legend: "Series",
  resetZoom: "Reset zoom",
  dataTable: "Data table",
  time: "Time",
  noData: "No data",
  instructions:
    "Use left and right arrow keys to step through points. Hold Shift and press Enter to zoom to the range. Press Escape to reset.",
  zoomed: "Zoomed",
  empty: "No data to show",
  readout: (time, parts) =>
    `${time}. ${parts.map((p) => `${p.label} ${p.value}`).join(", ")}.`,
}

/** Series colors by order; text never uses them, and dashes repeat the identity. */
const SERIES_COLORS = [
  "var(--brand)",
  "var(--foreground)",
  "var(--blue-300)",
  "var(--muted-foreground)",
  "var(--blue-700)",
  "var(--blue-500)",
]
const SERIES_DASHES = ["", "7 4", "2 3", "10 3 2 3", "1 4", "14 4"]

const TONE_VAR: Record<ThresholdTone, string> = {
  neutral: "var(--muted-foreground)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  success: "var(--success)",
  brand: "var(--brand)",
}

const MARGIN = { top: 12, right: 14, bottom: 26 }

/* ── sample data (deterministic, generic) ── */

const SAMPLE_START = Date.UTC(2025, 0, 6, 0, 0, 0)
const HOUR = 3_600_000

function sampleSeries(
  id: string,
  label: string,
  base: number,
  amp: number,
  phase: number,
  gap: [number, number] | null
): TimeSeries {
  return {
    id,
    label,
    points: Array.from({ length: 49 }, (_, i) => {
      const inGap = gap !== null && i >= gap[0] && i <= gap[1]
      const v = base + amp * Math.sin(i / 5 + phase) + (i % 7) * 0.8
      return {
        t: SAMPLE_START + i * HOUR,
        v: inGap ? null : Math.round(v * 10) / 10,
      }
    }),
  }
}

const SAMPLE_TIME_SERIES: TimeSeries[] = [
  sampleSeries("a", "Series A", 52, 22, 0, null),
  sampleSeries("b", "Series B", 38, 14, 1.6, [20, 24]),
]

const SAMPLE_THRESHOLDS: TimeSeriesThreshold[] = [
  { id: "limit", label: "Limit 80", value: 80, tone: "destructive" },
]

/* ── time helpers ── */

function toMs(t: TimeSeriesPoint["t"]): number {
  return t instanceof Date ? t.getTime() : typeof t === "number" ? t : Date.parse(t)
}

function tzOffsetMs(ms: number, timeZone: string, locale: string) {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).formatToParts(new Date(ms))
    const get = (type: string) =>
      Number(parts.find((p) => p.type === type)?.value ?? 0)
    const asUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour"),
      get("minute"),
      get("second")
    )
    return asUtc - Math.floor(ms / 1000) * 1000
  } catch {
    return 0
  }
}

const MIN = 60_000
const STEPS = [
  MIN,
  5 * MIN,
  15 * MIN,
  30 * MIN,
  HOUR,
  3 * HOUR,
  6 * HOUR,
  12 * HOUR,
  24 * HOUR,
  2 * 24 * HOUR,
  7 * 24 * HOUR,
  30 * 24 * HOUR,
  90 * 24 * HOUR,
]

function timeTicks(
  t0: number,
  t1: number,
  count: number,
  timeZone: string,
  locale: string
) {
  const span = t1 - t0
  const step = STEPS.find((s) => span / s <= count) ?? STEPS[STEPS.length - 1]
  const off = tzOffsetMs(t0, timeZone, locale)
  const first = Math.ceil((t0 + off) / step) * step - off
  const out: number[] = []
  for (let t = first; t <= t1; t += step) out.push(t)
  return { ticks: out, step }
}

function niceTicks(min: number, max: number, count: number) {
  if (min === max) {
    min -= 1
    max += 1
  }
  const raw = (max - min) / count
  const pow = 10 ** Math.floor(Math.log10(raw))
  const f = raw / pow
  const step = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow
  const lo = Math.floor(min / step) * step
  const hi = Math.ceil(max / step) * step
  const ticks: number[] = []
  for (let v = lo; v <= hi + step / 2; v += step) {
    ticks.push(Math.round(v / step) * step)
  }
  return { lo, hi, ticks }
}

/* ── component ── */

type Prepared = TimeSeries & {
  index: number
  color: string
  dash: string
  pts: { t: number; v: number | null }[]
}

function TimeSeriesChart({
  series = SAMPLE_TIME_SERIES,
  timeZone = "UTC",
  locale = "en-US",
  unit = "",
  formatValue,
  thresholds = SAMPLE_THRESHOLDS,
  yDomain,
  height = 280,
  title = "Time series chart",
  labels: labelsProp,
  onZoomChange,
  className,
  ...props
}: TimeSeriesChartProps) {
  const labels = React.useMemo(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  )
  const uid = React.useId()
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(640)
  const [hidden, setHidden] = React.useState<ReadonlySet<string>>(new Set())
  const [zoom, setZoom] = React.useState<[number, number] | null>(null)
  const [cursor, setCursor] = React.useState<number | null>(null)
  const [anchor, setAnchor] = React.useState<number | null>(null)
  const [viaKeyboard, setViaKeyboard] = React.useState(false)
  const [brush, setBrush] = React.useState<[number, number] | null>(null)

  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.max(240, Math.round(entry.contentRect.width)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const prepared: Prepared[] = React.useMemo(
    () =>
      series.map((s, index) => ({
        ...s,
        index,
        color: s.color ?? SERIES_COLORS[index % SERIES_COLORS.length],
        dash: s.dash ?? SERIES_DASHES[index % SERIES_DASHES.length],
        pts: s.points
          .map((p) => ({
            t: toMs(p.t),
            v: p.v !== null && Number.isFinite(p.v) ? p.v : null,
          }))
          .filter((p) => Number.isFinite(p.t))
          .sort((a, b) => a.t - b.t),
      })),
    [series]
  )

  const visible = prepared.filter((s) => !hidden.has(s.id))

  const fullDomain = React.useMemo<[number, number]>(() => {
    let lo = Infinity
    let hi = -Infinity
    for (const s of prepared)
      for (const p of s.pts) {
        lo = Math.min(lo, p.t)
        hi = Math.max(hi, p.t)
      }
    return Number.isFinite(lo) ? [lo, hi === lo ? lo + HOUR : hi] : [0, 1]
  }, [prepared])

  const [t0, t1] = zoom ?? fullDomain

  const fmtNumber = React.useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }),
    [locale]
  )
  const fmtValue = React.useCallback(
    (v: number, s: TimeSeries) => {
      if (formatValue) return formatValue(v, s)
      const u = s.unit ?? unit
      return `${fmtNumber.format(v)}${u ? (u === "%" ? "" : " ") + u : ""}`
    },
    [formatValue, fmtNumber, unit]
  )

  // y scale from visible series within the window.
  const { yLo, yHi, yTicks } = React.useMemo(() => {
    let lo = Infinity
    let hi = -Infinity
    for (const s of visible)
      for (const p of s.pts)
        if (p.v !== null && p.t >= t0 && p.t <= t1) {
          lo = Math.min(lo, p.v)
          hi = Math.max(hi, p.v)
        }
    for (const th of thresholds) {
      lo = Math.min(lo, th.value, th.to ?? th.value)
      hi = Math.max(hi, th.value, th.to ?? th.value)
    }
    if (!Number.isFinite(lo)) {
      lo = 0
      hi = 1
    }
    if (yDomain?.[0] !== undefined) lo = yDomain[0]
    else if (lo > 0 && lo < (hi - lo) * 2) lo = 0
    if (yDomain?.[1] !== undefined) hi = yDomain[1]
    const n = niceTicks(lo, hi, 4)
    return {
      yLo: yDomain?.[0] ?? n.lo,
      yHi: yDomain?.[1] ?? n.hi,
      yTicks: n.ticks.filter(
        (v) => v >= (yDomain?.[0] ?? n.lo) && v <= (yDomain?.[1] ?? n.hi)
      ),
    }
  }, [visible, thresholds, t0, t1, yDomain])

  const tickLabelChars = Math.max(
    ...yTicks.map((v) => (prepared[0] ? fmtValue(v, prepared[0]).length : 3)),
    3
  )
  const left = Math.min(96, 14 + tickLabelChars * 6.6)
  const plotW = Math.max(40, width - left - MARGIN.right)
  const plotH = Math.max(60, height - MARGIN.top - MARGIN.bottom)
  const x = (t: number) => left + ((t - t0) / (t1 - t0 || 1)) * plotW
  const y = (v: number) =>
    MARGIN.top + (1 - (v - yLo) / (yHi - yLo || 1)) * plotH

  const xTicks = React.useMemo(
    () => timeTicks(t0, t1, Math.max(2, Math.floor(plotW / 90)), timeZone, locale),
    [t0, t1, plotW, timeZone, locale]
  )

  const fmtTick = React.useMemo(() => {
    const short = xTicks.step < 24 * HOUR
    const o: Intl.DateTimeFormatOptions = short
      ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }
      : { month: "short", day: "numeric" }
    return new Intl.DateTimeFormat(locale, { ...o, timeZone })
  }, [xTicks.step, locale, timeZone])
  const fmtFull = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        timeZone,
        dateStyle: "medium",
        timeStyle: "short",
        hourCycle: "h23",
        timeZoneName: "short",
      } as Intl.DateTimeFormatOptions),
    [locale, timeZone]
  )

  // x positions that exist in the visible window (union of all series).
  const stops = React.useMemo(() => {
    const set = new Set<number>()
    for (const s of visible)
      for (const p of s.pts) if (p.t >= t0 && p.t <= t1) set.add(p.t)
    return [...set].sort((a, b) => a - b)
  }, [visible, t0, t1])

  const activeCursor =
    cursor !== null && stops.includes(cursor) ? cursor : null

  const valueAt = (s: Prepared, t: number) =>
    s.pts.find((p) => p.t === t)?.v ?? null

  const readout =
    viaKeyboard && activeCursor !== null
      ? labels.readout(
          fmtFull.format(activeCursor),
          visible.map((s) => {
            const v = valueAt(s, activeCursor)
            return {
              label: s.label,
              value: v === null ? labels.noData : fmtValue(v, s),
            }
          })
        )
      : ""

  function nearestStop(t: number) {
    let best: number | null = null
    let d = Infinity
    for (const s of stops) {
      const dd = Math.abs(s - t)
      if (dd < d) {
        d = dd
        best = s
      }
    }
    return best
  }

  function applyZoom(a: number, b: number) {
    const range: [number, number] = [Math.min(a, b), Math.max(a, b)]
    if (range[1] - range[0] <= 0) return
    setZoom(range)
    setCursor(null)
    setAnchor(null)
    onZoomChange?.(range)
  }
  function resetZoom() {
    setZoom(null)
    setAnchor(null)
    onZoomChange?.(null)
  }

  /* pointer */
  function timeFromEvent(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
    return t0 + (px / (rect.width || 1)) * (t1 - t0)
  }
  function onPointerDown(e: React.PointerEvent<SVGRectElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    const t = timeFromEvent(e)
    setBrush([t, t])
  }
  function onPointerMove(e: React.PointerEvent<SVGRectElement>) {
    const t = timeFromEvent(e)
    setViaKeyboard(false)
    setCursor(nearestStop(t))
    if (brush) setBrush([brush[0], t])
  }
  function onPointerUp(e: React.PointerEvent<SVGRectElement>) {
    if (!brush) return
    const t = timeFromEvent(e)
    const [a] = brush
    setBrush(null)
    if (Math.abs(x(t) - x(a)) > 8) applyZoom(a, t)
  }

  /* keyboard */
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!stops.length) return
    const i = activeCursor === null ? -1 : stops.indexOf(activeCursor)
    let next: number | null = null
    if (e.key === "ArrowRight") next = Math.min(stops.length - 1, i + 1)
    else if (e.key === "ArrowLeft")
      next = i === -1 ? 0 : Math.max(0, i - 1)
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = stops.length - 1
    else if (e.key === "Escape") {
      setAnchor(null)
      setCursor(null)
      if (zoom) resetZoom()
      return
    } else if (e.key === "Enter" && e.shiftKey) {
      if (anchor !== null && activeCursor !== null && anchor !== activeCursor) {
        e.preventDefault()
        applyZoom(anchor, activeCursor)
      }
      return
    } else return
    e.preventDefault()
    setViaKeyboard(true)
    if (e.shiftKey && anchor === null && activeCursor !== null)
      setAnchor(activeCursor)
    if (!e.shiftKey) setAnchor(null)
    setCursor(stops[next])
  }

  /* paths: break at gaps, never interpolate across null */
  function segments(s: Prepared) {
    const segs: { t: number; v: number }[][] = []
    let cur: { t: number; v: number }[] = []
    for (const p of s.pts) {
      if (p.v === null) {
        if (cur.length) segs.push(cur)
        cur = []
      } else cur.push({ t: p.t, v: p.v })
    }
    if (cur.length) segs.push(cur)
    return segs
  }

  const cursorX = activeCursor !== null ? x(activeCursor) : null
  const tipRight = cursorX !== null && cursorX > left + plotW / 2
  const clipId = `${uid}-clip`
  const hasData = prepared.some((s) => s.pts.some((p) => p.v !== null))
  const tableStops = React.useMemo(() => {
    const set = new Set<number>()
    for (const s of prepared) for (const p of s.pts) set.add(p.t)
    return [...set].sort((a, b) => a - b)
  }, [prepared])

  return (
    <div
      data-slot="time-series-chart"
      className={cn("@container/tsc flex w-full min-w-0 flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div
          role="group"
          aria-label={labels.legend}
          data-slot="time-series-legend"
          className="flex flex-wrap gap-1"
        >
          {prepared.map((s) => {
            const off = hidden.has(s.id)
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={!off}
                onClick={() =>
                  setHidden((prev) => {
                    const next = new Set(prev)
                    if (next.has(s.id)) next.delete(s.id)
                    else next.add(s.id)
                    return next
                  })
                }
                className={cn(
                  "flex items-center gap-2 rounded-sm border px-2 py-1 text-xs transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring",
                  off && "text-muted-foreground line-through"
                )}
              >
                <svg width="22" height="8" aria-hidden className="shrink-0">
                  <line
                    x1="0"
                    x2="22"
                    y1="4"
                    y2="4"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeDasharray={s.dash || undefined}
                    opacity={off ? 0.35 : 1}
                  />
                </svg>
                {s.label}
              </button>
            )
          })}
        </div>
        {zoom && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetZoom}
          >
            <RotateCcw aria-hidden />
            {labels.resetZoom}
          </Button>
        )}
      </div>

      <div ref={wrapRef} className="relative w-full min-w-0">
        <div
          role="group"
          tabIndex={0}
          aria-label={title}
          aria-describedby={`${uid}-help`}
          data-slot="time-series-plot"
          onKeyDown={onKeyDown}
          onBlur={() => {
            setViaKeyboard(false)
            setAnchor(null)
          }}
          onPointerLeave={() => !brush && !viaKeyboard && setCursor(null)}
          className="block rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          style={{ height }}
        >
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="block touch-pan-y select-none"
            aria-hidden
          >
            <defs>
              <clipPath id={clipId}>
                <rect x={left} y={MARGIN.top} width={plotW} height={plotH} />
              </clipPath>
            </defs>

            {yTicks.map((v) => (
              <g key={v}>
                <line
                  x1={left}
                  x2={left + plotW}
                  y1={y(v)}
                  y2={y(v)}
                  className="stroke-border"
                />
                <text
                  x={left - 8}
                  y={y(v)}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="fill-muted-foreground font-mono text-[11px]"
                >
                  {prepared[0] ? fmtValue(v, prepared[0]) : v}
                </text>
              </g>
            ))}
            {xTicks.ticks.map((t) => (
              <text
                key={t}
                x={x(t)}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[11px]"
              >
                {fmtTick.format(t)}
              </text>
            ))}
            <line
              x1={left}
              x2={left + plotW}
              y1={MARGIN.top + plotH}
              y2={MARGIN.top + plotH}
              className="stroke-border"
            />

            <g clipPath={`url(#${clipId})`}>
              {thresholds
                .filter((th) => th.to !== undefined)
                .map((th) => {
                  const a = y(Math.max(th.value, th.to!))
                  const b = y(Math.min(th.value, th.to!))
                  return (
                    <rect
                      key={th.id}
                      x={left}
                      y={a}
                      width={plotW}
                      height={Math.max(0, b - a)}
                      style={{
                        fill: `color-mix(in oklch, ${TONE_VAR[th.tone ?? "neutral"]} 14%, transparent)`,
                      }}
                    />
                  )
                })}
              {thresholds
                .filter((th) => th.to === undefined)
                .map((th) => (
                  <line
                    key={th.id}
                    x1={left}
                    x2={left + plotW}
                    y1={y(th.value)}
                    y2={y(th.value)}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    style={{ stroke: TONE_VAR[th.tone ?? "neutral"] }}
                  />
                ))}
              {visible.map((s) =>
                segments(s).map((seg, k) =>
                  seg.length === 1 ? (
                    <circle
                      key={`${s.id}-${k}`}
                      cx={x(seg[0].t)}
                      cy={y(seg[0].v)}
                      r="3"
                      fill={s.color}
                    />
                  ) : (
                    <path
                      key={`${s.id}-${k}`}
                      d={seg
                        .map(
                          (p, j) => `${j ? "L" : "M"}${x(p.t)} ${y(p.v)}`
                        )
                        .join("")}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={s.dash || undefined}
                    />
                  )
                )
              )}
            </g>

            {thresholds.map((th) => {
              const yy = y(th.to !== undefined ? Math.max(th.value, th.to) : th.value)
              return (
                <text
                  key={th.id}
                  x={left + plotW - 6}
                  y={yy - 5}
                  textAnchor="end"
                  className="fill-foreground font-mono text-[11px]"
                  style={{
                    paintOrder: "stroke",
                    stroke: "var(--background)",
                    strokeWidth: 3,
                  }}
                >
                  {th.label}
                </text>
              )
            })}

            {brush && (
              <rect
                x={Math.min(x(brush[0]), x(brush[1]))}
                y={MARGIN.top}
                width={Math.abs(x(brush[1]) - x(brush[0]))}
                height={plotH}
                className="stroke-brand"
                style={{
                  fill: "color-mix(in oklch, var(--brand) 12%, transparent)",
                }}
              />
            )}
            {anchor !== null && activeCursor !== null && (
              <rect
                x={Math.min(x(anchor), x(activeCursor))}
                y={MARGIN.top}
                width={Math.abs(x(activeCursor) - x(anchor))}
                height={plotH}
                className="stroke-brand"
                style={{
                  fill: "color-mix(in oklch, var(--brand) 12%, transparent)",
                }}
              />
            )}

            {cursorX !== null && (
              <g>
                <line
                  x1={cursorX}
                  x2={cursorX}
                  y1={MARGIN.top}
                  y2={MARGIN.top + plotH}
                  className="stroke-foreground/40"
                />
                {visible.map((s) => {
                  const v = valueAt(s, activeCursor!)
                  return v === null ? null : (
                    <circle
                      key={s.id}
                      cx={cursorX}
                      cy={y(v)}
                      r="4"
                      fill={s.color}
                      className="stroke-background"
                      strokeWidth="2"
                    />
                  )
                })}
              </g>
            )}

            <rect
              data-slot="time-series-overlay"
              x={left}
              y={MARGIN.top}
              width={plotW}
              height={plotH}
              fill="transparent"
              className="cursor-crosshair"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => setBrush(null)}
            />
          </svg>
        </div>

        {cursorX !== null && activeCursor !== null && (
          <div
            data-slot="time-series-tooltip"
            aria-hidden
            className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-md border bg-popover px-2.5 py-2 text-xs text-popover-foreground"
            style={{
              left: tipRight ? undefined : cursorX + 12,
              right: tipRight ? width - cursorX + 12 : undefined,
            }}
          >
            <div className="mb-1.5 font-mono tabular-nums">
              {fmtFull.format(activeCursor)}
            </div>
            <table className="w-full border-separate border-spacing-y-0.5">
              <tbody>
                {visible.map((s) => {
                  const v = valueAt(s, activeCursor)
                  return (
                    <tr key={s.id}>
                      <td className="pr-3">
                        <span className="flex items-center gap-2">
                          <svg width="16" height="6" aria-hidden>
                            <line
                              x1="0"
                              x2="16"
                              y1="3"
                              y2="3"
                              stroke={s.color}
                              strokeWidth="2"
                              strokeDasharray={s.dash || undefined}
                            />
                          </svg>
                          {s.label}
                        </span>
                      </td>
                      <td className="text-right font-mono tabular-nums">
                        {v === null ? (
                          <span className="text-muted-foreground">
                            {labels.noData}
                          </span>
                        ) : (
                          fmtValue(v, s)
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!hasData && (
          <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            {labels.empty}
          </p>
        )}
      </div>

      <p id={`${uid}-help`} className="sr-only">
        {labels.instructions}
      </p>
      <div role="status" aria-live="polite" className="sr-only">
        {readout}
      </div>

      <details data-slot="time-series-table" className="group text-sm">
        <summary className="eyebrow cursor-pointer rounded-sm text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
          {labels.dataTable}
        </summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-md border">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th scope="col" className="px-2 py-1.5 font-medium">
                  {labels.time}
                </th>
                {prepared.map((s) => (
                  <th key={s.id} scope="col" className="px-2 py-1.5 font-medium">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableStops.map((t) => (
                <tr key={t} className="border-t">
                  <th
                    scope="row"
                    className="px-2 py-1 font-mono font-normal whitespace-nowrap tabular-nums"
                  >
                    {fmtFull.format(t)}
                  </th>
                  {prepared.map((s) => {
                    const v = valueAt(s, t)
                    return (
                      <td
                        key={s.id}
                        className="px-2 py-1 font-mono whitespace-nowrap tabular-nums"
                      >
                        {v === null ? labels.noData : fmtValue(v, s)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

export { TimeSeriesChart, SAMPLE_TIME_SERIES, SAMPLE_THRESHOLDS }
export type {
  TimeSeries,
  TimeSeriesPoint,
  TimeSeriesThreshold,
  TimeSeriesChartProps,
  TimeSeriesLabels,
  ThresholdTone,
}
