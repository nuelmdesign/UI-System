"use client"

import * as React from "react"

import {
  CodePanel,
  type CodePanelVariant,
} from "@/components/agents/code-panel"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CodePanelDemo() {
  const [view, setView] = React.useState<CodePanelVariant>("Code")
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Tabs value={view} onValueChange={(v) => setView(v as CodePanelVariant)}>
        <TabsList>
          <TabsTrigger value="Code">Code</TabsTrigger>
          <TabsTrigger value="Diff">Diff</TabsTrigger>
        </TabsList>
      </Tabs>
      <CodePanel variant={view} />
    </div>
  )
}
