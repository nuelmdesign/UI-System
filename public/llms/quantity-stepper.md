# Quantity Stepper

Minus, value and plus control with min, max and step, controlled or uncontrolled, with optional press-and-hold repeat.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/quantity-stepper
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { QuantityStepper } from "@/components/ui/quantity-stepper"
```

## Dependencies

- npm: `lucide-react`, `class-variance-authority`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`

## Props and types

```ts
type QuantityStepperProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Controlled value. */
  value?: number
  /** Initial value when uncontrolled. */
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: "sm" | "default"
  disabled?: boolean
  /** Hold a button to keep stepping. */
  repeat?: boolean
  /** Accessible name of the group. */
  "aria-label"?: string
  /** Spoken names of the two buttons. */
  decrementLabel?: string
  incrementLabel?: string
}
```

## Variants

- `size`: `sm`, `default` (default)

## Example

```tsx
"use client"

import * as React from "react"

import { QuantityStepper } from "@/components/ui/quantity-stepper"

export default function QuantityStepperDemo() {
  const [qty, setQty] = React.useState(2)

  return (
    <div className="flex flex-wrap items-end gap-x-8 gap-y-5">
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Controlled · 1–10</span>
        <QuantityStepper
          aria-label="Quantity"
          value={qty}
          onValueChange={setQty}
          min={1}
          max={10}
          repeat
        />
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          value = {qty}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Small · step 5</span>
        <QuantityStepper
          aria-label="Seats"
          size="sm"
          defaultValue={10}
          min={0}
          max={50}
          step={5}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="eyebrow">Disabled</span>
        <QuantityStepper
          aria-label="Locked quantity"
          defaultValue={3}
          disabled
        />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/quantity-stepper. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
