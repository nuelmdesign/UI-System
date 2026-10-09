"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react"

import {
  InsightChart,
  type InsightTone,
} from "@/components/agents/insight-cards"
import { AnimatedNumber } from "@/components/motion/animated-number"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/* ── types ── */

export type AnalyticsRange = "7d" | "30d" | "90d"

export type AnalyticsMetric = {
  id: string
  label: string
  value: number
  /** Percent change versus the previous period, e.g. 12.4 or -3.1. */
  delta: number
  /** Intl.NumberFormat options for the value. */
  format?: Intl.NumberFormatOptions
  tone?: InsightTone
}

export type AnalyticsRow = {
  id: string
  /** Page path or traffic source. */
  name: string
  visitors: number
  /** 0-1 */
  conversion: number
  /** Seconds. */
  duration: number
  /** Custom number for the optional `valueColumn` (revenue, orders, ...). Used for sorting and as the default display. */
  value?: number
}

export type AnalyticsChannel = {
  id: string
  label: string
  /** Share of traffic, 0-100. */
  share: number
  tone: InsightTone
}

export type AnalyticsRangeData = {
  metrics: AnalyticsMetric[]
  /** Axis labels, one per point. */
  labels: string[]
  /** Chart values per metric id, one per label. */
  series: Record<string, number[]>
  rows: AnalyticsRow[]
  channels: AnalyticsChannel[]
}

/** Every fixed piece of text, so the screen can describe any product. */
export type AnalyticsLabels = {
  /** Small line above the title. A string is static; a function receives the selected range. */
  eyebrow: string | ((range: AnalyticsRange) => string)
  export: string
  channels: string
  channelsAria: string
  /** Heading and accessible name of the table. */
  table: string
  /** Table column headings. The row fields stay name / visitors / conversion / duration. */
  columns: {
    name: string
    visitors: string
    conversion: string
    duration: string
  }
}

const RANGE_LONG: Record<AnalyticsRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
}

export const DEFAULT_ANALYTICS_LABELS: AnalyticsLabels = {
  eyebrow: (range) => RANGE_LONG[range],
  export: "Export",
  channels: "Channels",
  channelsAria: "Traffic by channel",
  table: "Top pages and sources",
  columns: {
    name: "Page / source",
    visitors: "Visitors",
    conversion: "Conv.",
    duration: "Avg. time",
  },
}

export type AnalyticsDashboardProps = {
  data?: Record<AnalyticsRange, AnalyticsRangeData>
  /** Controlled range. Uncontrolled when omitted. */
  range?: AnalyticsRange
  defaultRange?: AnalyticsRange
  onRangeChange?: (range: AnalyticsRange) => void
  onExport?: (range: AnalyticsRange) => void
  title?: string
  /** Override any fixed text, for example to relabel the table for events. */
  labels?: Partial<Omit<AnalyticsLabels, "columns">> & {
    columns?: Partial<AnalyticsLabels["columns"]>
  }
  /** Replaces the "Avg. time" column with a custom one (money, orders, ...). Reads `row.value` unless `format` is given. */
  valueColumn?: { label: string; format?: (row: AnalyticsRow) => string }
  className?: string
}

/* ── sample data (deterministic) ── */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]
const END = Date.UTC(2026, 9, 8)

function makeLabels(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(END - (days - 1 - i) * 86_400_000)
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
  })
}

function wave(
  days: number,
  base: number,
  amp: number,
  growth: number,
  seed: number
) {
  return Array.from({ length: days }, (_, i) => {
    const t = i / Math.max(1, days - 1)
    const weekly =
      Math.sin((i + seed) * 0.9) * 0.5 + Math.sin((i + seed) * 0.31) * 0.5
    return Math.round(base * (1 + growth * t + amp * weekly))
  })
}

const FORMAT_INT: Intl.NumberFormatOptions = { maximumFractionDigits: 0 }
const FORMAT_PCT: Intl.NumberFormatOptions = {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}
const FORMAT_USD: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}

const CHANNELS: Record<AnalyticsRange, AnalyticsChannel[]> = {
  "7d": [
    { id: "organic", label: "Organic search", share: 41, tone: "brand" },
    { id: "direct", label: "Direct", share: 27, tone: "blue" },
    { id: "social", label: "Social", share: 17, tone: "warning" },
    { id: "referral", label: "Referral", share: 15, tone: "success" },
  ],
  "30d": [
    { id: "organic", label: "Organic search", share: 38, tone: "brand" },
    { id: "direct", label: "Direct", share: 29, tone: "blue" },
    { id: "social", label: "Social", share: 19, tone: "warning" },
    { id: "referral", label: "Referral", share: 14, tone: "success" },
  ],
  "90d": [
    { id: "organic", label: "Organic search", share: 35, tone: "brand" },
    { id: "direct", label: "Direct", share: 30, tone: "blue" },
    { id: "social", label: "Social", share: 21, tone: "warning" },
    { id: "referral", label: "Referral", share: 14, tone: "success" },
  ],
}

function makeRows(scale: number, shift: number): AnalyticsRow[] {
  const base: [string, number, number, number][] = [
    ["/", 9200, 0.031, 74],
    ["/pricing", 5400, 0.082, 112],
    ["/blog/getting-started", 4300, 0.024, 205],
    ["/docs", 3900, 0.047, 188],
    ["/features", 3100, 0.058, 96],
    ["google.com", 2800, 0.039, 131],
    ["news.ycombinator.com", 1900, 0.027, 88],
    ["x.com", 1500, 0.019, 61],
  ]
  return base.map(([name, visitors, conversion, duration], i) => ({
    id: name,
    name,
    visitors: Math.round(visitors * scale * (1 + ((i * shift) % 7) / 40)),
    conversion: conversion * (1 + ((i + shift) % 5) / 30),
    duration: duration + ((i * shift) % 9),
  }))
}

function makeRange(
  days: number,
  scale: number,
  deltas: number[],
  key: AnalyticsRange
): AnalyticsRangeData {
  const visitors = wave(days, 1800 * scale, 0.14, 0.18, 1)
  const pageviews = wave(days, 5200 * scale, 0.12, 0.15, 3)
  const conv = wave(days, 340, 0.1, 0.08, 5).map((v) => v / 10000)
  const revenue = wave(days, 4100 * scale, 0.2, 0.22, 7)
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0)
  return {
    labels: makeLabels(days),
    series: { visitors, pageviews, conversion: conv, revenue },
    metrics: [
      {
        id: "visitors",
        label: "Visitors",
        value: sum(visitors),
        delta: deltas[0],
        format: FORMAT_INT,
        tone: "brand",
      },
      {
        id: "pageviews",
        label: "Page views",
        value: sum(pageviews),
        delta: deltas[1],
        format: FORMAT_INT,
        tone: "blue",
      },
      {
        id: "conversion",
        label: "Conversion rate",
        value: sum(conv) / days,
        delta: deltas[2],
        format: FORMAT_PCT,
        tone: "success",
      },
      {
        id: "revenue",
        label: "Revenue",
        value: sum(revenue),
        delta: deltas[3],
        format: FORMAT_USD,
        tone: "warning",
      },
    ],
    rows: makeRows(scale, days),
    channels: CHANNELS[key],
  }
}

export const SAMPLE_ANALYTICS: Record<AnalyticsRange, AnalyticsRangeData> = {
  "7d": makeRange(7, 1, [8.4, 5.1, 0.6, 12.3], "7d"),
  "30d": makeRange(30, 1.05, [14.2, 9.8, -1.2, 18.7], "30d"),
  "90d": makeRange(90, 1.1, [31.5, 22.4, 3.9, 27.1], "90d"),
}

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
]

/* ── helpers ── */

type SortKey = "name" | "visitors" | "conversion" | "duration" | "value"
type SortDir = "asc" | "desc"

const TONE_BG: Record<InsightTone, string> = {
  brand: "bg-brand",
  blue: "bg-blue-300",
  warning: "bg-warning",
  destructive: "bg-destructive",
  success: "bg-success",
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}

function DeltaBadge({ delta }: { delta: number }) {
  const up = delta >= 0
  return (
    <Badge variant={up ? "success" : "destructive"}>
      {up ? <ArrowUp aria-hidden /> : <ArrowDown aria-hidden />}
      <span className="sr-only">{up ? "Up" : "Down"} </span>
      {Math.abs(delta).toFixed(1)}%
    </Badge>
  )
}

/* ── block ── */

function AnalyticsDashboard({
  data = SAMPLE_ANALYTICS,
  range: rangeProp,
  defaultRange = "30d",
  onRangeChange,
  onExport,
  title = "Analytics",
  valueColumn,
  labels: labelsProp,
  className,
}: AnalyticsDashboardProps) {
  const labels: AnalyticsLabels = {
    ...DEFAULT_ANALYTICS_LABELS,
    ...labelsProp,
    columns: { ...DEFAULT_ANALYTICS_LABELS.columns, ...labelsProp?.columns },
  }
  const [internalRange, setInternalRange] =
    React.useState<AnalyticsRange>(defaultRange)
  const range = rangeProp ?? internalRange
  const current = data[range]

  const [metricId, setMetricId] = React.useState<string>(
    () => current.metrics[0]?.id ?? ""
  )
  const [hover, setHover] = React.useState<number | null>(null)
  const [sort, setSort] = React.useState<{ key: SortKey; dir: SortDir }>({
    key: "visitors",
    dir: "desc",
  })

  const metric =
    current.metrics.find((m) => m.id === metricId) ?? current.metrics[0]
  const values = (metric && current.series[metric.id]) ?? []

  const handleRange = (next: string) => {
    const r = next as AnalyticsRange
    setInternalRange(r)
    setHover(null)
    onRangeChange?.(r)
  }

  const rows = React.useMemo(() => {
    const sorted = [...current.rows].sort((a, b) =>
      sort.key === "name"
        ? a.name.localeCompare(b.name)
        : sort.key === "value"
          ? (a.value ?? 0) - (b.value ?? 0)
          : a[sort.key] - b[sort.key]
    )
    return sort.dir === "asc" ? sorted : sorted.reverse()
  }, [current.rows, sort])

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" ? "asc" : "desc" }
    )

  const formatter = React.useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        ...metric?.format,
        notation: metric?.format?.style === "percent" ? undefined : "compact",
        maximumFractionDigits: metric?.format?.style === "percent" ? 1 : 1,
      }),
    [metric]
  )

  const columns: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "name", label: labels.columns.name },
    { key: "visitors", label: labels.columns.visitors, align: "right" },
    { key: "conversion", label: labels.columns.conversion, align: "right" },
    valueColumn
      ? { key: "value", label: valueColumn.label, align: "right" }
      : { key: "duration", label: labels.columns.duration, align: "right" },
  ]
  const eyebrow =
    typeof labels.eyebrow === "function"
      ? labels.eyebrow(range)
      : labels.eyebrow

  return (
    <div
      data-slot="analytics-dashboard"
      className={cn(
        "@container/analytics h-full min-h-0 w-full overflow-auto bg-background text-foreground",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-5 p-4 @lg/analytics:p-6">
        {/* header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-muted-foreground">{eyebrow}</p>
            <h2 className="heading text-2xl @lg/analytics:text-3xl">{title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={range} onValueChange={handleRange}>
              <TabsList aria-label="Date range" className="w-fit">
                {RANGES.map((r) => (
                  <TabsTrigger key={r.value} value={r.value} className="px-3">
                    <span className="@lg/analytics:hidden">{r.value}</span>
                    <span className="hidden @lg/analytics:inline">
                      {r.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="outline" onClick={() => onExport?.(range)}>
              <Download aria-hidden />
              {labels.export}
            </Button>
          </div>
        </header>

        {/* KPIs */}
        <section
          aria-label="Key metrics"
          className="grid grid-cols-1 gap-3 @md/analytics:grid-cols-2 @3xl/analytics:grid-cols-4"
        >
          {current.metrics.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={m.id === metric?.id}
              onClick={() => setMetricId(m.id)}
              className={cn(
                "flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-colors outline-none",
                "hover:border-foreground/25 focus-visible:ring-[3px] focus-visible:ring-ring",
                m.id === metric?.id && "border-brand"
              )}
            >
              <span className="eyebrow text-muted-foreground">{m.label}</span>
              <span className="flex flex-wrap items-end justify-between gap-2">
                <AnimatedNumber
                  value={m.value}
                  format={m.format}
                  className="heading text-3xl"
                />
                <DeltaBadge delta={m.delta} />
              </span>
            </button>
          ))}
        </section>

        {/* chart + breakdown */}
        <div className="grid min-w-0 gap-3 @3xl/analytics:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <section
            aria-label="Trend"
            className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4"
          >
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <h3 className="min-w-0 heading text-lg">
                {metric?.label} over time
              </h3>
              <Tabs
                value={metric?.id}
                onValueChange={setMetricId}
                className="scrollbar-hide max-w-full min-w-0 overflow-x-auto"
              >
                <TabsList aria-label="Chart metric" className="h-8 w-max">
                  {current.metrics.map((m) => (
                    <TabsTrigger
                      key={m.id}
                      value={m.id}
                      className="shrink-0 px-2.5 text-xs"
                    >
                      {m.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            {metric && values.length > 1 && (
              <>
                <div className="min-w-0">
                  <InsightChart
                    lines={[
                      { id: metric.id, values, tone: metric.tone ?? "brand" },
                    ]}
                    fill
                    grid
                    index={hover}
                    onIndexChange={setHover}
                    label={`${metric.label}, ${current.labels[0]} to ${current.labels[current.labels.length - 1]}`}
                    className="h-[220px]"
                    tooltip={(i) => [
                      {
                        label: metric.label,
                        value: `${current.labels[i]} · ${formatter.format(values[i])}`,
                        tone: metric.tone ?? "brand",
                      },
                    ]}
                  />
                </div>
                <div className="flex justify-between font-mono text-xs text-muted-foreground tabular-nums">
                  <span>{current.labels[0]}</span>
                  <span>{current.labels[current.labels.length - 1]}</span>
                </div>
              </>
            )}
          </section>

          <section
            aria-label={labels.channelsAria}
            className="flex min-w-0 flex-col gap-4 rounded-lg border bg-card p-4"
          >
            <h3 className="heading text-lg">{labels.channels}</h3>
            <div className="flex h-2 w-full min-w-0 gap-px overflow-hidden rounded-sm bg-muted">
              {current.channels.map((c) => (
                <span
                  key={c.id}
                  className={cn("h-full min-w-px", TONE_BG[c.tone])}
                  style={{ width: `${c.share}%` }}
                />
              ))}
            </div>
            <ul className="flex flex-col gap-2.5">
              {current.channels.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm">
                  <span
                    aria-hidden
                    className={cn("size-2 rounded-full", TONE_BG[c.tone])}
                  />
                  <span className="min-w-0 flex-1 truncate">{c.label}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                    {c.share}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* table */}
        <section
          aria-label={labels.table}
          className="rounded-lg border bg-card"
        >
          <div className="border-b px-4 py-3">
            <h3 className="heading text-lg">{labels.table}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b">
                  {columns.map((c) => {
                    const active = sort.key === c.key
                    return (
                      <th
                        key={c.key}
                        scope="col"
                        aria-sort={
                          active
                            ? sort.dir === "asc"
                              ? "ascending"
                              : "descending"
                            : "none"
                        }
                        className={cn(
                          "px-4 py-2 font-normal",
                          c.align === "right" && "text-right"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(c.key)}
                          className={cn(
                            "inline-flex items-center gap-1 eyebrow text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
                            active && "text-foreground"
                          )}
                        >
                          {c.label}
                          {active ? (
                            sort.dir === "asc" ? (
                              <ArrowUp aria-hidden className="size-3" />
                            ) : (
                              <ArrowDown aria-hidden className="size-3" />
                            )
                          ) : (
                            <ArrowUpDown
                              aria-hidden
                              className="size-3 opacity-50"
                            />
                          )}
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <td className="max-w-[220px] truncate px-4 py-2.5">
                      {r.name}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {r.visitors.toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {(r.conversion * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">
                      {valueColumn
                        ? (valueColumn.format?.(r) ??
                          (r.value ?? 0).toLocaleString("en-US"))
                        : formatDuration(r.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export { AnalyticsDashboard }
