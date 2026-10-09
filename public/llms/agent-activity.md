# Agent Activity

Collapsible run log of steps, web searches and tool calls.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/agent-activity
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { AgentActivity } from "@/components/agents/agent-activity"
```

Files added to the project:

- `components/agents/agent-activity/index.tsx`
- `components/agents/agent-activity/activity-row.tsx`
- `components/agents/agent-activity/types.ts`

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/agent-disclosure`, `@opendraft/loading-states`

## Props and types

```ts
export type AgentActivityStatus = "working" | "complete"

export type AgentStepStatus = "pending" | "active" | "complete"

export interface AgentActivityStep {
  id: string
  type: "step"
  label: ReactNode
  status?: AgentStepStatus
  meta?: ReactNode
}

export interface AgentActivityText {
  id: string
  type: "text"
  content: ReactNode
}

export interface AgentSearchResult {
  id: string
  title: ReactNode
  domain?: ReactNode
  url?: string
  icon?: ReactNode
}

export interface AgentActivitySearch {
  id: string
  type: "search"
  query: ReactNode
  results?: AgentSearchResult[]
  moreCount?: number
}

export interface AgentActivityTool {
  id: string
  type: "tool"
  action: "read" | "edit" | "run" | (string & {})
  target: ReactNode
  additions?: number
  deletions?: number
}

export type AgentTraceKind =
  "thinking" | "message" | "write" | "run" | "read" | (string & {})

export interface AgentActivityTrace {
  id: string
  type: "trace"
  kind: AgentTraceKind
  label: ReactNode
  detail?: ReactNode
  icon?: ReactNode
}

export type AgentActivityItem =
  | AgentActivityStep
  | AgentActivityText
  | AgentActivitySearch
  | AgentActivityTool
  | AgentActivityTrace

export type AgentActivityContentType = AgentActivityItem["type"] | "mixed"

export interface AgentActivityProps {
  /** Chronological activity entries. Append or update items as events stream. */
  items: AgentActivityItem[]
  /** Expected activity kind before the first streamed item arrives. */
  contentType?: AgentActivityContentType
  /** Current run phase. Active runs always stay expanded. */
  status?: AgentActivityStatus
  /** Elapsed run time, in seconds. Used by the step-only summary. */
  duration?: number
  /** Controlled expanded state used after the run completes. */
  open?: boolean
  /** Initial expanded state used after the run completes. */
  defaultOpen?: boolean
  /** Called when the completed activity disclosure changes state. */
  onOpenChange?: (open: boolean) => void
  /** Collapse the disclosure when status changes from working to complete. */
  collapseOnComplete?: boolean
  /** Optional label shown while the run is active. */
  activeLabel?: ReactNode
  /** Optional completed summary. Derived from the item types by default. */
  summary?: ReactNode
  /** Optional renderer for the contents of the active status row. */
  renderWorkingStatus?: (context: {
    label: ReactNode
    duration: number
  }) => ReactNode
  /** Optional renderer for the contents before the built-in disclosure chevron. */
  renderCompletedStatus?: (context: {
    summary: ReactNode
    duration: number
  }) => ReactNode
  /** Maximum visible activity height before the stream begins gliding. */
  maxHeight?: number
  className?: string
  contentClassName?: string
}
```

## Example

```tsx
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
```

Live docs: https://opendraft-ui.vercel.app/docs/agent-activity. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
