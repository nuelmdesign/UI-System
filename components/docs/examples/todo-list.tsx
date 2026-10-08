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
