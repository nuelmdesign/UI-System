"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import {
  ImageGeneration,
  type ImageGenerationStatus,
} from "@/components/agents/image-generation"
import { PixelField } from "@/components/motion/pixel-field"

function GenerationRun({ onReplay }: { onReplay: () => void }) {
  const reduce = useReducedMotion() ?? false
  const [status, setStatus] = React.useState<ImageGenerationStatus>("queued")

  React.useEffect(() => {
    if (reduce) return
    const timers = [
      window.setTimeout(() => setStatus("generating"), 500),
      window.setTimeout(() => setStatus("refining"), 3000),
      window.setTimeout(() => setStatus("complete"), 5200),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [reduce])

  return (
    <ImageGeneration
      label="Blue pixel study, vertical streaks"
      prompt="a soft blue pixel mosaic with vertical streaks"
      resolution="1024 × 1024"
      status={reduce ? "complete" : status}
      onRetry={onReplay}
    >
      <PixelField
        variant="mosaic"
        cell={24}
        speed={0.4}
        className="size-full"
      />
    </ImageGeneration>
  )
}

export default function ImageGenerationDemo() {
  const [run, setRun] = React.useState(0)
  return <GenerationRun key={run} onReplay={() => setRun((r) => r + 1)} />
}
