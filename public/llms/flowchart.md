# Flowchart

Workflow canvas with draggable Trigger and If/Else cards joined by a live bezier connector.

Category: Data & Workflows

## Install

```bash
npx shadcn@latest add @opendraft/flowchart
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Flowchart } from "@/components/agents/flowchart"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/glide-menu`

## Props and types

```ts
export type FlowchartTone = "brand" | "warning"

export type FlowchartStep = {
  id: string
  row: number
  /** 0–1 horizontal center of the node on the canvas. */
  x: number
  w: number
  kind?: { label: string; tone: FlowchartTone }
  tone?: FlowchartTone
  title?: string
  caption?: string
  /** Renders the if/else chip rows instead of a title + caption. */
  condition?: boolean
}

export type FlowchartEdge = { from: string; to: string }

export type FlowchartOption = { name: string; tag?: string }

export type FlowchartProps = {
  steps?: FlowchartStep[]
  edges?: FlowchartEdge[]
  /** Options for the property chips in the condition card. */
  properties?: FlowchartOption[]
  /** Options for the first value chip. */
  values?: FlowchartOption[]
  /** Options for the second value chip. */
  secondaryValues?: FlowchartOption[]
  /** Source label shown in the condition rows. */
  source?: string
  onSelectStep?: (id: string | null) => void
  className?: string
}
```

## Example

```tsx
"use client"

import { Flowchart } from "@/components/agents/flowchart"

export default function FlowchartDemo() {
  return (
    <div className="mx-auto w-full max-w-lg">
      <Flowchart />
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/flowchart. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
