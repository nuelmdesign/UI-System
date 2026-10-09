"use client"

import * as React from "react"

import {
  AgentScreen,
  type AgentScreenVariant,
} from "@/components/agents/agent-screen"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AgentScreenDemo() {
  const [variant, setVariant] = React.useState<AgentScreenVariant>("Default")
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as AgentScreenVariant)}
      >
        <TabsList>
          <TabsTrigger value="Default">Default</TabsTrigger>
          <TabsTrigger value="Loading">Loading</TabsTrigger>
        </TabsList>
      </Tabs>
      <AgentScreen key={variant} agentName="Scout" variant={variant} />
    </div>
  )
}
