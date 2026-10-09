# Animated Number

Spring-animated number with Intl formatting.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/animated-number
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { AnimatedNumber } from "@/components/motion/animated-number"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
type AnimatedNumberProps = {
  value: number
  /** Intl.NumberFormat options, e.g. { style: "currency", currency: "USD" }. */
  format?: Intl.NumberFormatOptions
  locale?: string
  spring?: SpringOptions
  /** Start counting from 0 the first time the number scrolls into view. */
  countOnView?: boolean
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { AnimatedNumber } from "@/components/motion/animated-number"
import { Button } from "@/components/ui/button"

export default function AnimatedNumberDemo() {
  const [value, setValue] = React.useState(128_430.52)

  return (
    <div className="flex flex-wrap items-end gap-6">
      <AnimatedNumber
        value={value}
        format={{ style: "currency", currency: "USD" }}
        className="heading text-5xl"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setValue((v) => Math.max(0, v + (Math.random() - 0.4) * 20_000))
        }
      >
        Randomize
      </Button>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/animated-number. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
