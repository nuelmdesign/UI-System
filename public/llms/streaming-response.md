# Streaming Response

Streamed answer with copy, retry, feedback and a sources footer.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/streaming-response
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { StreamingResponse } from "@/components/agents/streaming-response"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/citations`, `@opendraft/agent-disclosure`

## Props and types

```ts
export type StreamingResponseStatus = "streaming" | "complete" | "error"

export type StreamingResponseFeedback = "up" | "down" | null

export interface StreamingResponseProps {
  /** Rendered response content. Pass plain text or the output of a Markdown renderer. */
  children: ReactNode
  status?: StreamingResponseStatus
  /** Plain-text value copied by the built-in copy action. */
  copyText?: string
  /** Overrides the built-in clipboard action. */
  onCopy?: () => void | Promise<void>
  onRetry?: () => void
  /** Optional sources shown as a compact footer disclosure after streaming. */
  sources?: CitationItem[]
  sourcesOpen?: boolean
  defaultSourcesOpen?: boolean
  onSourcesOpenChange?: (open: boolean) => void
  sourceIdPrefix?: string
  feedback?: StreamingResponseFeedback
  defaultFeedback?: StreamingResponseFeedback
  onFeedbackChange?: (feedback: StreamingResponseFeedback) => void
  /** Set false when a surrounding conversation log announces streamed text. */
  announce?: boolean
  /** Hides the built-in completion actions without changing response status. */
  showActions?: boolean
  className?: string
  contentClassName?: string
  actionsClassName?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import type { CitationItem } from "@/components/agents/citations"
import { StreamingResponse } from "@/components/agents/streaming-response"

const SOURCES: CitationItem[] = [
  {
    id: "motion",
    title: "Motion for React",
    domain: "motion.dev",
    url: "https://motion.dev/docs/react",
  },
  {
    id: "aria",
    title: "ARIA live regions",
    domain: "developer.mozilla.org",
    url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
  },
  {
    id: "radix",
    title: "Radix Primitives",
    domain: "radix-ui.com",
    url: "https://www.radix-ui.com/primitives",
  },
]

const ANSWER =
  "Streaming answers keep structure as they arrive. Links stay clickable, lists keep their spacing, and the actions only appear once the response is complete, so nothing jumps under the reader's cursor."

function Run({ onRetry }: { onRetry: () => void }) {
  const reduce = useReducedMotion() ?? false
  const [cursor, setCursor] = React.useState(0)
  const [complete, setComplete] = React.useState(false)

  React.useEffect(() => {
    if (reduce) return
    const start = performance.now()
    let frame = 0
    let doneTimer: number | undefined
    const tick = (now: number) => {
      const next = Math.min(
        ANSWER.length,
        Math.floor(((now - start) / 1000) * 110)
      )
      setCursor(next)
      if (next < ANSWER.length) frame = requestAnimationFrame(tick)
      else doneTimer = window.setTimeout(() => setComplete(true), 350)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(doneTimer)
    }
  }, [reduce])

  const shown = reduce ? ANSWER.length : cursor
  return (
    <StreamingResponse
      status={reduce || complete ? "complete" : "streaming"}
      copyText={ANSWER}
      onRetry={onRetry}
      sources={SOURCES}
    >
      <p>{ANSWER.slice(0, shown)}</p>
    </StreamingResponse>
  )
}

export default function StreamingResponseDemo() {
  const [run, setRun] = React.useState(0)
  return (
    <div className="w-full max-w-xl">
      <Run key={run} onRetry={() => setRun((r) => r + 1)} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/streaming-response. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
