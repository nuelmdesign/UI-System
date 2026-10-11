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
