# Tool Chips

An agent run as compact tool-call rows with inline chips, then file-diff chips that preview their diff on hover.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/tool-chips
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { ToolChips } from "@/components/agents/tool-chips"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
export type ToolStepIcon = "think" | "write" | "run" | "read"

export type ToolDetailLine = { text: string; tone?: "add" }

export type ToolStep = {
  icon: ToolStepIcon
  label: string
  chip: string
  mono: boolean
  detailMono: boolean
  detail: ToolDetailLine[]
}

export type ToolDiff = { file: string; add: number; del: number }

export type ToolDiffLine = { text: string; tone: "add" | "del" | "ctx" }

export type ToolChipsLabels = {
  header: string
  more: string
}

export interface ToolChipsProps {
  steps?: ToolStep[]
  diffs?: ToolDiff[]
  diffLines?: Record<string, ToolDiffLine[]>
  labels?: Partial<ToolChipsLabels>
  className?: string
  onOpenChange?: (open: boolean) => void
  onToggleRow?: (label: string, open: boolean) => void
  /** Fired when the trailing "+N more" chip is pressed. */
  onMore?: () => void
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { RotateCw } from "lucide-react"

import { ToolChips } from "@/components/agents/tool-chips"
import { Button } from "@/components/ui/button"

export default function ToolChipsDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ToolChips key={run} />
      <Button variant="ghost" size="xs" onClick={() => setRun((r) => r + 1)}>
        <RotateCw />
        Replay
      </Button>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/tool-chips. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
