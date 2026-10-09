# Stepper

Numbered step indicator for multi-step flows like checkout, horizontal or vertical, that never overflows on mobile.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/stepper
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Stepper } from "@/components/ui/stepper"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type StepperStep = {
  id: string
  label: string
  description?: string
}

type StepperProps = Omit<React.ComponentProps<"nav">, "children"> & {
  steps: StepperStep[]
  /** Index or id of the current step. */
  current: number | string
  /** Called when a completed step is clicked. Only completed steps are interactive. */
  onStepClick?: (step: StepperStep, index: number) => void
  orientation?: "horizontal" | "vertical"
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"

const steps = [
  { id: "cart", label: "Cart", description: "Review items" },
  { id: "shipping", label: "Shipping", description: "Address and method" },
  { id: "payment", label: "Payment", description: "Card details" },
  { id: "confirm", label: "Confirm", description: "Place order" },
]

export default function StepperDemo() {
  const [current, setCurrent] = React.useState(1)

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-8">
      <Stepper
        steps={steps}
        current={current}
        onStepClick={(_, i) => setCurrent(i)}
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          Back
        </Button>
        <Button
          size="sm"
          disabled={current === steps.length - 1}
          onClick={() => setCurrent((c) => Math.min(steps.length - 1, c + 1))}
        >
          Continue
        </Button>
      </div>
      <div className="border-t pt-6">
        <p className="mb-4 eyebrow text-muted-foreground">Vertical</p>
        <Stepper steps={steps} current="payment" orientation="vertical" />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/stepper. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
