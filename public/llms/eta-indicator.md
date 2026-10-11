# ETA Indicator

Estimated time with a range bar, confidence word and icon, and stale and past-window states.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/eta-indicator
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { EtaIndicator } from "@/components/ui/eta-indicator"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`, `@opendraft/motion`

## Props and types

```ts
type EtaConfidenceLevel = "high" | "medium" | "low"

type EtaLabels = {
  eta: string
  earliest: string
  latest: string
  confidence: string
  high: string
  medium: string
  low: string
  stale: string
  late: string
  unknown: string
  /** "Updated 12 min ago" */
  updated: (ago: string) => string
}

type DateInput = string | number | Date

type EtaIndicatorProps = Omit<React.ComponentProps<"div">, "children"> & {
  eta: DateInput
  /** Start of the plausible window. Pair with `latest` to show the range bar. */
  earliest?: DateInput
  latest?: DateInput
  /** 0 to 1. */
  confidence?: number
  /** `confidence` at or above these values reads as high / medium. */
  confidenceLevels?: { high: number; medium: number }
  /** When the estimate was last refreshed. */
  updatedAt?: DateInput
  /** Current time. Pass it for tests and stories; otherwise it ticks each minute. */
  now?: DateInput
  /** Estimates older than this are marked stale. Defaults to 15 minutes. */
  staleAfterMs?: number
  /** IANA zone, e.g. "Europe/Berlin". Defaults to the viewer's zone. */
  timeZone?: string
  locale?: string
  /** Show the zone abbreviation next to times. Defaults to true. */
  showTimeZone?: boolean
  /** What is being estimated, e.g. "Delivery", "Doctor arrives". */
  title?: React.ReactNode
  labels?: Partial<EtaLabels>
}
```

## Example

```tsx
"use client"

import { EtaIndicator } from "@/components/ui/eta-indicator"

const NOW = "2026-03-14T14:00:00Z"

export default function EtaIndicatorDemo() {
  return (
    <div className="grid w-full max-w-[720px] gap-4 min-[600px]:grid-cols-2">
      <EtaIndicator
        title="Parcel delivery"
        now={NOW}
        eta="2026-03-14T15:20:00Z"
        earliest="2026-03-14T14:50:00Z"
        latest="2026-03-14T16:30:00Z"
        confidence={0.82}
        updatedAt="2026-03-14T13:56:00Z"
        timeZone="Europe/Berlin"
      />
      <EtaIndicator
        title="Clinician arrival"
        now={NOW}
        eta="2026-03-14T14:35:00Z"
        earliest="2026-03-14T14:20:00Z"
        latest="2026-03-14T15:30:00Z"
        confidence={0.41}
        updatedAt="2026-03-14T13:20:00Z"
        timeZone="America/New_York"
        labels={{ eta: "Expected on site", stale: "Out of date" }}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/eta-indicator. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
