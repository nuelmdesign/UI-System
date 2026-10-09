"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { DiffTable } from "@/components/agents/diff-table"
import { Button } from "@/components/ui/button"

export default function DiffTableDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <DiffTable key={run} />
      <Button variant="ghost" size="xs" onClick={() => setRun((r) => r + 1)}>
        <RotateCcw />
        Replay
      </Button>
    </div>
  )
}
