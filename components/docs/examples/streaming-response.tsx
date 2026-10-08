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
