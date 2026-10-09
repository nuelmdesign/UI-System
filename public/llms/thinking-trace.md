# Thinking Trace

An expandable agent trace that shimmers while working, then settles. Steps, reasoning, search and coding variants.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/thinking-trace
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ThinkingTrace } from "@/components/agents/thinking-trace"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/shimmer-text`

## Props and types

```ts
export type ThinkingTraceVariant = "steps" | "reasoning" | "search" | "coding"

export type ThinkingTraceRow = {
  primary: string
  secondary?: string
  mono?: boolean
  add?: number
  del?: number
  href?: string
}

export interface ThinkingTraceProps {
  variant?: ThinkingTraceVariant
  /** Fires once, when the trace stops working. */
  onSettled?: () => void
  /** Override the built-in trace rows. */
  rows?: ThinkingTraceRow[]
  /** Label while working. */
  active?: string
  /** Label once settled. */
  done?: string
  /** Search query line (search variant). */
  query?: string
  /** Trailing "+N more" line (search variant). */
  more?: string
  /** Override the header glyph (defaults to the sparkle). */
  icon?: ReactNode
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  ThinkingTrace,
  type ThinkingTraceVariant,
} from "@/components/agents/thinking-trace"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const VARIANTS: ThinkingTraceVariant[] = [
  "steps",
  "reasoning",
  "search",
  "coding",
]

export default function ThinkingTraceDemo() {
  const [variant, setVariant] = React.useState<ThinkingTraceVariant>("steps")

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as ThinkingTraceVariant)}
      >
        <TabsList>
          {VARIANTS.map((v) => (
            <TabsTrigger key={v} value={v} className="capitalize">
              {v}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* keyed so each switch replays the trace */}
      <ThinkingTrace key={variant} variant={variant} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/thinking-trace. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
