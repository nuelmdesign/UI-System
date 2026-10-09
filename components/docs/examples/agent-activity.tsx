"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import {
  AgentActivity,
  type AgentActivityItem,
} from "@/components/agents/agent-activity"

const BRIEF: AgentActivityItem = {
  id: "brief",
  type: "step",
  label: "Reading the launch brief",
  status: "active",
}
const SEARCH: AgentActivityItem = {
  id: "search",
  type: "search",
  query: "design systems with motion tokens",
  results: [],
}
const SEARCH_DONE: AgentActivityItem = {
  ...SEARCH,
  results: [
    { id: "linear", title: "Linear Method", domain: "linear.app" },
    { id: "vercel", title: "Geist Design System", domain: "vercel.com" },
    { id: "stripe", title: "Stripe Sessions UI", domain: "stripe.com" },
  ],
  moreCount: 4,
}
const READ: AgentActivityItem = {
  id: "read",
  type: "tool",
  action: "read",
  target: "lib/motion.ts",
}
const FRAMES: AgentActivityItem[][] = [
  [BRIEF],
  [{ ...BRIEF, status: "complete" }, SEARCH],
  [{ ...BRIEF, status: "complete" }, SEARCH_DONE],
  [{ ...BRIEF, status: "complete" }, SEARCH_DONE, READ],
  [
    { ...BRIEF, status: "complete" },
    SEARCH_DONE,
    READ,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "components/ui/tabs.tsx",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "pnpm build" },
    {
      id: "verify",
      type: "step",
      label: "Checking both themes",
      status: "complete",
    },
  ],
]

export default function AgentActivityDemo() {
  const reduce = useReducedMotion() ?? false
  const [frame, setFrame] = React.useState(0)
  const [complete, setComplete] = React.useState(false)

  React.useEffect(() => {
    if (reduce) return
    const timers = FRAMES.slice(1).map((_, i) =>
      window.setTimeout(() => setFrame(i + 1), 850 + i * 1050)
    )
    timers.push(
      window.setTimeout(
        () => setComplete(true),
        850 + (FRAMES.length - 2) * 1050 + 900
      )
    )
    return () => timers.forEach(window.clearTimeout)
  }, [reduce])

  const done = reduce || complete
  return (
    <AgentActivity
      items={FRAMES[reduce ? FRAMES.length - 1 : frame]}
      status={done ? "complete" : "working"}
      duration={5.1}
      defaultOpen={reduce}
      collapseOnComplete={!reduce}
      maxHeight={220}
    />
  )
}
