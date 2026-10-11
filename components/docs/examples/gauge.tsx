"use client"

import * as React from "react"

import { Gauge, type GaugeThreshold } from "@/components/ui/gauge"
import { Slider } from "@/components/ui/slider"

const riskBands: GaugeThreshold[] = [
  { at: 0, tone: "success", label: "Low risk" },
  { at: 40, tone: "warning", label: "Elevated" },
  { at: 70, tone: "destructive", label: "Critical" },
]

const heartRateBands: GaugeThreshold[] = [
  { at: 30, tone: "warning", label: "Low" },
  { at: 60, tone: "success", label: "Normal" },
  { at: 100, tone: "warning", label: "Elevated" },
  { at: 140, tone: "destructive", label: "High" },
]

export default function GaugeDemo() {
  const [risk, setRisk] = React.useState(72)

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="flex flex-col gap-3">
        <span className="eyebrow text-muted-foreground">
          Security posture: risk score ring
        </span>
        <div className="flex flex-wrap items-start gap-8">
          <Gauge
            label="Account risk"
            value={risk}
            thresholds={riskBands}
            hint="Scored from 128 signals"
          />
          <div className="w-56 pt-8">
            <Slider
              aria-label="Risk score"
              min={0}
              max={100}
              value={[risk]}
              onValueChange={(v) => setRisk(v[0])}
            />
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-3">
        <span className="eyebrow text-muted-foreground">
          Vitals: arc with units
        </span>
        <div className="flex flex-wrap items-start gap-8">
          <Gauge
            variant="arc"
            label="Heart rate"
            value={88}
            min={30}
            max={180}
            unit="bpm"
            thresholds={heartRateBands}
            hint="Resting, last 5 min"
          />
          <Gauge
            variant="arc"
            size="sm"
            label="Grid load"
            value={0.64}
            min={0}
            max={1}
            unit="of capacity"
            formatValue={(v) =>
              new Intl.NumberFormat("en", { style: "percent" }).format(v)
            }
          />
        </div>
      </section>
    </div>
  )
}
