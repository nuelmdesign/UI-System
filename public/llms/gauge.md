# Gauge

SVG gauge and risk-score ring with threshold bands and a text status, for posture, vitals, utilization and energy.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/gauge
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Gauge } from "@/components/ui/gauge"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`, `@opendraft/motion`

## Props and types

```ts
type GaugeTone = "neutral" | "brand" | "success" | "warning" | "destructive"

type GaugeThreshold = {
  /** The band starts at this value and runs to the next threshold's `at`. */
  at: number
  tone: GaugeTone
  /** Status word shown beside the number, so state never relies on color. */
  label: string
}

type GaugeLabels = {
  /** Screen-reader prefix for the status, e.g. "Status". */
  status: string
}

type GaugeProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: number
  /** Scale start. Defaults to 0. */
  min?: number
  /** Scale end. Defaults to 100. */
  max?: number
  /**
   * Bands of the scale, in any order. The band whose `at` is the highest one
   * not above `value` is the current status. Defaults to low / medium / high
   * thirds-ish bands (0, 50%, 80% of the scale).
   */
  thresholds?: GaugeThreshold[]
  /** `ring` is a full circle, `arc` an open 240 degree dial. */
  variant?: "ring" | "arc"
  size?: keyof typeof sizeClass
  /** What the gauge measures. Also its accessible name. */
  label: string
  /** Small text under the status, e.g. a timestamp or a target. */
  hint?: React.ReactNode
  /** Unit shown next to the number, e.g. "%", "bpm", "kW". */
  unit?: React.ReactNode
  /** Format the number in the center and in the accessible value text. */
  formatValue?: (value: number) => string
  /** Replace the center content entirely. */
  center?: React.ReactNode
  /** Draw thin ticks where the bands change. Defaults to true. */
  showTicks?: boolean
  labels?: Partial<GaugeLabels>
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/gauge. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
