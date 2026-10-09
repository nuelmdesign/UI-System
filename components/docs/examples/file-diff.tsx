"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { FileDiff, type FileDiffLine } from "@/components/agents/file-diff"
import type { ToolResultStatus } from "@/components/agents/tool-result"

/** Reveals `steps` items one by one, then settles on `finalStatus`. */
function useSteps(
  steps: number,
  interval = 420,
  finalStatus: Exclude<ToolResultStatus, "running"> = "success"
) {
  const reduce = useReducedMotion() ?? false
  const [visible, setVisible] = React.useState(0)
  const [status, setStatus] = React.useState<ToolResultStatus>("running")

  React.useEffect(() => {
    if (reduce) return
    const timers = Array.from({ length: steps }, (_, i) =>
      window.setTimeout(() => setVisible(i + 1), i * interval + 180)
    )
    timers.push(
      window.setTimeout(() => setStatus(finalStatus), steps * interval + 480)
    )
    return () => timers.forEach(window.clearTimeout)
  }, [finalStatus, interval, reduce, steps])

  return reduce
    ? { visible: steps, status: finalStatus as ToolResultStatus }
    : { visible, status }
}

const DIFF: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 12,
    newLine: 12,
    content: "export const spring = {",
  },
  {
    id: "2",
    type: "removed",
    oldLine: 13,
    content: '  snappy: { type: "spring", stiffness: 400, damping: 28 },',
  },
  {
    id: "3",
    type: "added",
    newLine: 13,
    content:
      '  snappy: { type: "spring", stiffness: 520, damping: 36, mass: 0.8 },',
  },
  {
    id: "4",
    type: "added",
    newLine: 14,
    content:
      '  pop: { type: "spring", stiffness: 500, damping: 30, mass: 0.58 },',
  },
  { id: "5", oldLine: 14, newLine: 15, content: "}" },
]

export default function FileDiffDemo() {
  const { visible, status } = useSteps(DIFF.length, 360)
  return (
    <FileDiff
      file="lib/motion.ts"
      lines={DIFF.slice(0, visible)}
      status={status === "success" ? "complete" : "streaming"}
      copyText={DIFF.map((l) => l.content).join("\n")}
      collapseOnComplete={false}
      maxHeight={180}
    />
  )
}
