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
        className="font-display text-5xl font-light tracking-[-0.02em]"
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
