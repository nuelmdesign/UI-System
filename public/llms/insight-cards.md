# Insight Cards

Insights carousel with comparison, anomaly and allocation mini-charts and a blurred page crossfade.

Category: Data & Workflows

## Install

```bash
npx shadcn@latest add @opendraft/insight-cards
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { InsightCards, InsightChart } from "@/components/agents/insight-cards"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/motion`

## Props and types

```ts
export type InsightTone =
  "brand" | "blue" | "warning" | "destructive" | "success"

type ChartLine = { id: string; values: number[]; tone: InsightTone }

type TooltipRow = { label: string; value: string; tone: InsightTone }

/** content shape for the return-comparison card's two plotted series */
export type CompareSeries = {
  name: string
  values: number[]
  sub: string
  /** Text tone for the delta. */
  tone: "destructive" | "success"
  /** Line, legend dot and tooltip color. */
  color: InsightTone
}

/** content shape for the anomaly card's two toggled metric series */
export type AnomalyData = {
  spend: number[]
  usage: number[]
  /** Dashed threshold per metric. */
  threshold: { spend: number; usage: number }
}

/** content shape for one allocation segment */
export type AllocationSegment = {
  name: string
  label: string
  pct: number
  amount: string
  /** Bar and legend dot fill class, e.g. `bg-primary`. */
  cls: string
  /** Label text class, e.g. `text-brand`. */
  tone: string
}

/** content shape for one insight page in the carousel */
export type InsightPage = {
  key: string
  prose: React.ReactNode
  Card: React.ComponentType
  pill: string
}

export type InsightCardsLabels = {
  /** carousel heading shown before the page count */
  title: string
  previous: string
  next: string
}

export type InsightCardsProps = {
  pages?: InsightPage[]
  labels?: Partial<InsightCardsLabels>
  /** Called with the follow-up prompt when its pill is pressed. */
  onAsk?: (pill: string, page: InsightPage) => void
  onPageChange?: (index: number) => void
  className?: string
}

function InsightChart(props: {
  lines: ChartLine[]
  fill?: boolean
  grid?: boolean
  threshold?: number
  index: number | null
  onIndexChange: (index: number | null) => void
  tooltip: (index: number) => TooltipRow[]
  label: string
  className?: string
})
```

## Example

```tsx
"use client"

import { InsightCards } from "@/components/agents/insight-cards"

export default function InsightCardsDemo() {
  return (
    <div className="flex w-full justify-center">
      <InsightCards />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/insight-cards. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
