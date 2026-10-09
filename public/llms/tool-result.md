# Tool Result

Tool call card for terminal, request and file output with status, copy and retry.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/tool-result
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { ToolResultOutput, ToolResult } from "@/components/agents/tool-result"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/agent-disclosure`, `@opendraft/action-swap`, `@opendraft/agent-code`

## Props and types

```ts
export type ToolResultStatus = "running" | "success" | "error" | "cancelled"

export type ToolResultKind = "terminal" | "request" | "custom"

export interface ToolResultProps {
  tool: ReactNode
  title: ReactNode
  children: ReactNode
  status?: ToolResultStatus
  kind?: ToolResultKind
  meta?: ReactNode
  icon?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  collapseOnComplete?: boolean
  maxHeight?: number
  copyText?: string
  onCopy?: () => void | Promise<void>
  onRetry?: () => void
  className?: string
  contentClassName?: string
}

export interface ToolResultOutputProps {
  children: string
  language?: AgentCodeLanguage
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { AgentCode } from "@/components/agents/agent-code"
import {
  ToolResult,
  ToolResultOutput,
  type ToolResultStatus,
} from "@/components/agents/tool-result"

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

const TERMINAL = [
  "$ pnpm build",
  "▲ Next.js 16.4.0 (Turbopack)",
  "✓ Compiled successfully in 1.3s",
  "✓ Finished TypeScript in 4.3s",
  "✓ Generating static pages (4/4)",
  "registry.json: 58 items",
] as const

function TerminalRun({ onReplay }: { onReplay: () => void }) {
  const { visible, status } = useSteps(TERMINAL.length)
  const output = TERMINAL.slice(0, visible).join("\n")
  return (
    <ToolResult
      tool="terminal.run"
      title={status === "running" ? "Building the library" : "Build passed"}
      kind="terminal"
      status={status}
      meta={status === "success" ? "6.1s" : undefined}
      copyText={output}
      onRetry={onReplay}
      maxHeight={150}
    >
      <ToolResultOutput>{output}</ToolResultOutput>
    </ToolResult>
  )
}

const RESPONSE = `{
  "error": "rate_limit_exceeded",
  "retryAfter": 30,
  "requestId": "req_8f21"
}`

function RequestRun({ onReplay }: { onReplay: () => void }) {
  const { visible, status } = useSteps(3, 600, "error")
  return (
    <ToolResult
      tool="http.request"
      title={
        status === "running" ? "Fetching project activity" : "Request failed"
      }
      kind="request"
      status={status}
      meta={status === "error" ? "429" : "GET /v1/activity"}
      copyText={RESPONSE}
      onRetry={onReplay}
      collapseOnComplete={false}
      maxHeight={150}
    >
      {visible < 3 ? (
        <ToolResultOutput>
          {visible === 0
            ? "Preparing request…"
            : visible === 1
              ? "GET /v1/activity\nConnecting…"
              : "GET /v1/activity\nWaiting for response…"}
        </ToolResultOutput>
      ) : (
        <AgentCode code={RESPONSE} language="json" />
      )}
    </ToolResult>
  )
}

export default function ToolResultDemo() {
  const [run, setRun] = React.useState(0)
  const replay = () => setRun((r) => r + 1)
  return (
    <div key={run} className="grid w-full max-w-xl gap-3">
      <TerminalRun onReplay={replay} />
      <RequestRun onReplay={replay} />
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/tool-result. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
