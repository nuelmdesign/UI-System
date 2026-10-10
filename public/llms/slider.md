# Slider

Single or range slider on Radix with a label row, formatted value and marks.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/slider
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Slider } from "@/components/ui/slider"
```

## Dependencies

- npm: `radix-ui`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type SliderMark = { value: number; label?: React.ReactNode }

type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange" | "onValueCommit" | "children"
> & {
  /** Controlled value. Two entries make a range slider. */
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  /** Left text of the label row. */
  label?: React.ReactNode
  /** Right text of the label row. Defaults to the formatted value. Pass `false` to hide. */
  valueLabel?: React.ReactNode | false
  /** Formats each value for the value label. Range values are joined with an en dash. */
  formatValue?: (value: number) => React.ReactNode
  /** Show min and max labels under the track. Pass `marks` for custom ticks. */
  showRange?: boolean
  marks?: SliderMark[]
  "aria-label"?: string
  "aria-labelledby"?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { Slider } from "@/components/ui/slider"

export default function SliderDemo() {
  const [volume, setVolume] = React.useState([70])

  return (
    <div className="grid w-full max-w-md gap-8">
      <Slider
        label="Playback volume"
        value={volume}
        onValueChange={setVolume}
        formatValue={(v) => `${v}%`}
        showRange
      />
      <Slider
        label="Speaking rate"
        defaultValue={[1]}
        min={0.5}
        max={2}
        step={0.1}
        formatValue={(v) => `${v.toFixed(1)}x`}
        marks={[
          { value: 0.5, label: "Slow" },
          { value: 1.25, label: "Natural" },
          { value: 2, label: "Fast" },
        ]}
      />
      <Slider
        label="Pitch range"
        defaultValue={[20, 65]}
        formatValue={(v) => `${v}`}
        showRange
      />
      <Slider aria-label="Noise reduction" defaultValue={[40]} disabled />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/slider. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
