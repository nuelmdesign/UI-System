# Agent Loading States

Thinking shimmer, elapsed-time progress and rotating reasoning text.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/loading-states
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { AgentProgress, ReasoningText, ThinkingShimmer } from "@/components/agents/loading-states"
```

Files added to the project:

- `components/agents/loading-states/index.ts`
- `components/agents/loading-states/agent-progress.tsx`
- `components/agents/loading-states/reasoning-text.tsx`
- `components/agents/loading-states/thinking-shimmer.tsx`

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/shimmer-text`, `@opendraft/text-scramble`, `@opendraft/loader`, `@opendraft/text-shimmer`

## Props and types

```ts
export interface AgentProgressProps {
  /** Verb describing the agent's current activity. */
  label?: string
  /** Controlled elapsed time in seconds. */
  elapsedSeconds?: number
  /** Starting time for the internal timer, in seconds. */
  initialSeconds?: number
  /** Whether the internal timer should advance. Ignored when elapsedSeconds is provided. */
  running?: boolean
  className?: string
}

export type ReasoningTextVariant = "cascade" | "swap" | "scramble"

export interface ReasoningTextProps {
  /** Phrases cycled through while the agent works. */
  phrases?: string[]
  /** Animation used when the active phrase changes. */
  variant?: ReasoningTextVariant
  /** Milliseconds each phrase remains visible. */
  interval?: number
  /** Seconds taken for one shimmer pass. */
  shimmerDuration?: number
  /** Optional leading visual. Defaults to a terminal-style ASCII loader. */
  indicator?: ReactNode
  className?: string
}

export interface ThinkingShimmerProps {
  /** Loading message shown to the user. */
  children?: ReactNode
  /** Seconds taken for one shimmer pass. */
  duration?: number
  className?: string
}
```

## Example

```tsx
import {
  AgentProgress,
  ReasoningText,
  ThinkingShimmer,
} from "@/components/agents/loading-states"

const PHRASES = [
  "Thinking",
  "Reading the request",
  "Working through the details",
  "Preparing the answer",
]

export default function LoadingStatesDemo() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="grid content-start gap-6">
        <Labeled label="ThinkingShimmer">
          <ThinkingShimmer className="text-base" />
        </Labeled>
        <Labeled label="AgentProgress">
          <AgentProgress
            label="Churning"
            initialSeconds={151.6}
            className="text-base"
          />
        </Labeled>
      </div>
      <div className="grid content-start gap-6">
        <Labeled label="ReasoningText · cascade">
          <ReasoningText
            variant="cascade"
            phrases={PHRASES}
            className="text-base"
          />
        </Labeled>
        <Labeled label="ReasoningText · swap">
          <ReasoningText
            variant="swap"
            phrases={PHRASES}
            className="text-base"
          />
        </Labeled>
        <Labeled label="ReasoningText · scramble">
          <ReasoningText
            variant="scramble"
            phrases={["Thinking", "Searching", "Reasoning", "Composing"]}
            className="text-base"
          />
        </Labeled>
      </div>
    </div>
  )
}

function Labeled({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <span className="eyebrow text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/loading-states. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
