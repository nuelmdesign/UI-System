"use client"

import * as React from "react"

import { TaskRows, type TaskRowsVariant } from "@/components/agents/task-rows"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TaskRowsDemo() {
  const [variant, setVariant] = React.useState<TaskRowsVariant>("capsules")

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as TaskRowsVariant)}
      >
        <TabsList>
          <TabsTrigger value="capsules">Capsules</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* keyed so each switch replays the status run */}
      <TaskRows key={variant} variant={variant} />
    </div>
  )
}
