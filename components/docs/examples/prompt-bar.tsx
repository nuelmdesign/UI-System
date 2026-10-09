"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  PromptBar,
  type PromptBarVariant,
} from "@/components/agents/prompt-bar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const VARIANTS: PromptBarVariant[] = ["Rounded", "Pill"]

export default function PromptBarDemo() {
  const [variant, setVariant] = React.useState<PromptBarVariant>("Rounded")

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as PromptBarVariant)}
      >
        <TabsList>
          {VARIANTS.map((name) => (
            <TabsTrigger key={name} value={name}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* Remount on switch so the self-running demo restarts. */}
      <PromptBar
        key={variant}
        variant={variant}
        onSend={(text) => toast("Prompt sent", { description: text })}
      />
    </div>
  )
}
