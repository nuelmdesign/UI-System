# Todo List

Live task plan with per-item progress and a rolling completed count.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/todo-list
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { TodoList } from "@/components/agents/todo-list"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/agent-disclosure`, `@opendraft/action-swap`

## Props and types

```ts
export type TodoItemStatus =
  "pending" | "in-progress" | "completed" | "cancelled"

export interface TodoItem {
  id: string
  title: ReactNode
  status?: TodoItemStatus
  progress?: number
  detail?: ReactNode
}

export interface TodoListProps {
  items: TodoItem[]
  title?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  collapseOnComplete?: boolean
  maxHeight?: number
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { TodoList, type TodoItem } from "@/components/agents/todo-list"

const TASKS = [
  "Inspect the current data flow",
  "Update the response schema",
  "Add coverage for edge cases",
  "Run checks and prepare the result",
]
const TICKS = 4

export default function TodoListDemo() {
  const reduce = useReducedMotion() ?? false
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    if (reduce || tick >= TASKS.length * TICKS) return
    const t = window.setTimeout(() => setTick((v) => v + 1), 280)
    return () => window.clearTimeout(t)
  }, [tick, reduce])

  const step = reduce ? TASKS.length * TICKS : tick
  const items: TodoItem[] = TASKS.map((title, i) => {
    const active = step >= i * TICKS && step < (i + 1) * TICKS
    const pct = ((step % TICKS) + 1) * 25
    return {
      id: `task-${i}`,
      title,
      status:
        step >= (i + 1) * TICKS
          ? "completed"
          : active
            ? "in-progress"
            : "pending",
      progress: active ? pct : undefined,
      detail: active ? `${pct}%` : undefined,
    }
  })

  return <TodoList items={items} title="Implementation plan" />
}
```

Live docs: https://opendraft-ui.vercel.app/docs/todo-list. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
