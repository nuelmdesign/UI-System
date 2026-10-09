# Progress

Horizontal progress bar with a label row and a tone that follows how full or empty it is, for quotas and stock.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/progress
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Progress } from "@/components/ui/progress"
```

## Dependencies

- npm: `motion`, `class-variance-authority`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
type ProgressTone = "auto" | "brand" | "success" | "warning" | "destructive"

type ProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Current value, clamped to 0..max. */
  value: number
  /** Value that represents a full bar. Defaults to 100. */
  max?: number
  /** Accessible name. Falls back to `label` when that is a string. */
  "aria-label"?: string
  /** Left text of the label row. */
  label?: React.ReactNode
  /**
   * Right text of the label row. Defaults to "n of max" when `label` is set.
   * Pass `false` to hide it.
   */
  valueLabel?: React.ReactNode | false
  size?: "sm" | "default" | "lg"
  /**
   * Fill color. `auto` picks by how much headroom is left: brand normally,
   * warning once the remaining fraction drops below `lowThreshold`, destructive
   * below `criticalThreshold`.
   */
  tone?: ProgressTone
  /**
   * For `tone="auto"`. By default the bar measures consumption (a full bar is
   * bad, like quota used). Set `invert` when the value is what remains
   * (stock, availability, battery) so a low value is bad.
   */
  invert?: boolean
  /** Remaining fraction (0..1) below which auto tone turns warning. */
  lowThreshold?: number
  /** Remaining fraction (0..1) at or below which auto tone turns destructive. */
  criticalThreshold?: number
}
```

## Variants

- `size`: `sm`, `default` (default), `lg`

## Example

```tsx
"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export default function ProgressDemo() {
  const [stock, setStock] = React.useState(18)

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Progress aria-label="Upload" value={64} />
      <Progress
        label="Storage used"
        value={6.2}
        max={10}
        valueLabel="6.2 / 10 GB"
      />
      <div className="flex flex-col gap-3">
        <Progress
          label="Remaining"
          value={stock}
          max={24}
          tone="auto"
          invert
          lowThreshold={0.25}
        />
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setStock((s) => Math.max(0, s - 4))}
          >
            Use 4
          </Button>
          <Button size="xs" variant="outline" onClick={() => setStock(24)}>
            Reset
          </Button>
        </div>
      </div>
      <Progress
        label="Quota"
        value={92}
        tone="auto"
        size="lg"
        valueLabel="92%"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Progress size="sm" tone="success" label="Done" value={100} />
        <Progress size="sm" tone="warning" label="Slow" value={40} />
        <Progress size="sm" tone="destructive" label="Failed" value={15} />
        <Progress size="sm" label="Brand" value={55} />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/progress. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
