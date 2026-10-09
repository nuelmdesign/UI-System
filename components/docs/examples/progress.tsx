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
