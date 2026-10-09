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
