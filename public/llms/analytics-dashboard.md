# Analytics Dashboard

Analytics screen with range tabs, KPI cards, a metric chart, a sortable top-pages table and a channel breakdown.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/analytics-dashboard
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { AnalyticsDashboard } from "@/components/blocks/analytics-dashboard"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/insight-cards`, `@opendraft/animated-number`, `@opendraft/badge`, `@opendraft/button`, `@opendraft/tabs`

## Props and types

```ts
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

export type AnalyticsDashboardProps = {
  data?: Record<AnalyticsRange, AnalyticsRangeData>
  /** Controlled range. Uncontrolled when omitted. */
  range?: AnalyticsRange
  defaultRange?: AnalyticsRange
  onRangeChange?: (range: AnalyticsRange) => void
  onExport?: (range: AnalyticsRange) => void
  title?: string
  className?: string
}
```

## Example

```tsx
"use client"

import { AnalyticsDashboard } from "@/components/blocks/analytics-dashboard"

export default function AnalyticsDashboardDemo() {
  return (
    <div className="h-[680px] overflow-hidden rounded-lg border bg-background">
      <AnalyticsDashboard />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/analytics-dashboard. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
