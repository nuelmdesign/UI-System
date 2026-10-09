"use client"

import * as React from "react"
import { RotateCw } from "lucide-react"

import { ToolChips } from "@/components/agents/tool-chips"
import { Button } from "@/components/ui/button"

export default function ToolChipsDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ToolChips key={run} />
      <Button variant="ghost" size="xs" onClick={() => setRun((r) => r + 1)}>
        <RotateCw />
        Replay
      </Button>
    </div>
  )
}
