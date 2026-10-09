# Image Generation

Image frame with queued, generating, refining and complete states.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/image-generation
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { ImageGeneration } from "@/components/agents/image-generation"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/use-hover-capable`

## Props and types

```ts
export type ImageGenerationStatus =
  "queued" | "generating" | "refining" | "complete" | "error"

export interface ImageGenerationProps {
  /** The completed media. Pass an img, Next Image, canvas, video, or custom preview. */
  children?: ReactNode
  status?: ImageGenerationStatus
  /** Accessible description. Defaults to a description derived from prompt. */
  label?: string
  prompt?: string
  resolution?: string
  /** CSS aspect ratio reserved before generated media is available. */
  aspectRatio?: CSSProperties["aspectRatio"]
  size?: "compact" | "fluid"
  /** Lets the active dither cluster follow fine-pointer movement. */
  interactive?: boolean
  statusText?: string
  showStatus?: boolean
  onRetry?: () => void
  className?: string
  mediaClassName?: string
  statusClassName?: string
}
```

## Example

```tsx
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
```

Live docs: https://opendraft-ui.vercel.app/docs/image-generation. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
