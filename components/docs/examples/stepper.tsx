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
          disabled={current >= steps.length}
          onClick={() => setCurrent((c) => Math.min(steps.length, c + 1))}
        >
          {current === steps.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
      <div className="border-t pt-6">
        <p className="mb-4 eyebrow text-muted-foreground">Vertical</p>
        <Stepper steps={steps} current="payment" orientation="vertical" />
      </div>
    </div>
  )
}
