# Time Series Chart

Multi-series time chart with time zones, brush zoom, thresholds, gaps, keyboard stepping and a data-table fallback.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/time-series-chart
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { TimeSeriesChart } from "@/components/ui/time-series-chart"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`

## Props and types

```ts
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
```

## Example

```tsx
"use client"

import {
  TimeSeriesChart,
  type TimeSeries,
  type TimeSeriesThreshold,
} from "@/components/ui/time-series-chart"

const START = Date.UTC(2025, 2, 10, 0, 0, 0)
const MINUTE = 60_000

function build(
  id: string,
  label: string,
  count: number,
  step: number,
  fn: (i: number) => number,
  gap?: [number, number]
): TimeSeries {
  return {
    id,
    label,
    points: Array.from({ length: count }, (_, i) => ({
      t: START + i * step,
      v: gap && i >= gap[0] && i <= gap[1] ? null : Math.round(fn(i) * 10) / 10,
    })),
  }
}

const serverSeries: TimeSeries[] = [
  build(
    "cpu",
    "CPU",
    97,
    15 * MINUTE,
    (i) => 38 + 30 * Math.sin(i / 9) ** 2 + (i % 5)
  ),
  build(
    "mem",
    "Memory",
    97,
    15 * MINUTE,
    (i) => 55 + i / 8 + 4 * Math.sin(i / 4),
    [40, 47]
  ),
  build("disk", "Disk", 97, 15 * MINUTE, (i) => 24 + i / 20),
]
const serverThresholds: TimeSeriesThreshold[] = [
  { id: "warn", label: "Warning 70%", value: 70, tone: "warning" },
  { id: "crit", label: "Critical 90%", value: 90, tone: "destructive" },
]

const loadSeries: TimeSeries[] = [
  build(
    "grid",
    "Grid import",
    48,
    60 * MINUTE,
    (i) => 310 + 120 * Math.sin((i - 6) / 3.8)
  ),
  build("solar", "Solar", 48, 60 * MINUTE, (i) =>
    Math.max(0, 260 * Math.sin((((i % 24) - 6) / 12) * Math.PI))
  ),
]
const loadThresholds: TimeSeriesThreshold[] = [
  {
    id: "peak",
    label: "Peak tariff band",
    value: 380,
    to: 450,
    tone: "warning",
  },
  { id: "cap", label: "Contract cap 450 kW", value: 450, tone: "destructive" },
]

export default function TimeSeriesChartDemo() {
  return (
    <div className="grid w-full gap-10">
      <section className="grid gap-3">
        <h3 className="heading text-xl">Server metrics</h3>
        <TimeSeriesChart
          title="Server utilisation, 24 hours"
          series={serverSeries}
          thresholds={serverThresholds}
          unit="%"
          yDomain={[0, 100]}
          timeZone="Europe/Berlin"
        />
      </section>
      <section className="grid gap-3">
        <h3 className="heading text-xl">Energy load</h3>
        <TimeSeriesChart
          title="Site power, 48 hours"
          series={loadSeries}
          thresholds={loadThresholds}
          unit="kW"
          timeZone="America/New_York"
          formatValue={(v) => `${Math.round(v)} kW`}
          labels={{ legend: "Sources", resetZoom: "Show full range" }}
        />
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/time-series-chart. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
