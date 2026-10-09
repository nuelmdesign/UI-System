"use client"

import * as React from "react"

import {
  ThinkingTrace,
  type ThinkingTraceVariant,
} from "@/components/agents/thinking-trace"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const VARIANTS: ThinkingTraceVariant[] = [
  "steps",
  "reasoning",
  "search",
  "coding",
]

export default function ThinkingTraceDemo() {
  const [variant, setVariant] = React.useState<ThinkingTraceVariant>("steps")

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as ThinkingTraceVariant)}
      >
        <TabsList>
          {VARIANTS.map((v) => (
            <TabsTrigger key={v} value={v} className="capitalize">
              {v}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* keyed so each switch replays the trace */}
      <ThinkingTrace key={variant} variant={variant} />
    </div>
  )
}
