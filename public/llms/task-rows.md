# Task Rows

Task rows with progress rings, status pills and expandable details, run through a failed, retry, done sequence.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/task-rows
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { TaskRows } from "@/components/agents/task-rows"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
export type TaskRowsVariant = "capsules" | "list"

/** One detail line shown when a task row is expanded. */
export type TaskDetail = { label: string; meta: string }

/**
 * A single task row.
 *  - "done"     → check badge + completed pill (static)
 *  - "running"  → active spinner showing `step`, no pill (static)
 *  - "sequence" → animation-driven: pending spinner → failed → completed
 */
export type TaskRow = {
  key: string
  label: string
  amount: string
  status: "done" | "running" | "sequence"
  step?: number
  details: TaskDetail[]
}

export type TaskRowsLabels = {
  completed: string
  failed: string
}

export interface TaskRowsProps {
  variant?: TaskRowsVariant
  rows?: TaskRow[]
  labels?: Partial<TaskRowsLabels>
  className?: string
  onToggleRow?: (key: string, open: boolean) => void
}
```

## Example

```tsx
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
```

Live docs: https://opendraft-ui.vercel.app/docs/task-rows. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
