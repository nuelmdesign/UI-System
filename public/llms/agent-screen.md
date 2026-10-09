# Agent Screen

Live agent-screen card that expands to a full-screen viewer with Teach-a-task recording.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/agent-screen
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { AgentScreen } from "@/components/agents/agent-screen"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`

## Props and types

```ts
export type AgentScreenVariant = "Default" | "Loading"

export type AgentScreenProps = {
  /** Shown under the card and in the viewer's title bar. */
  agentName?: string
  /** Image or video URL of the agent's screen. Defaults to a faux window. */
  streamSrc?: string
  /** "Loading" shows the connecting state and disables opening. */
  variant?: AgentScreenVariant
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  AgentScreen,
  type AgentScreenVariant,
} from "@/components/agents/agent-screen"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AgentScreenDemo() {
  const [variant, setVariant] = React.useState<AgentScreenVariant>("Default")
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as AgentScreenVariant)}
      >
        <TabsList>
          <TabsTrigger value="Default">Default</TabsTrigger>
          <TabsTrigger value="Loading">Loading</TabsTrigger>
        </TabsList>
      </Tabs>
      <AgentScreen key={variant} agentName="Scout" variant={variant} />
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/agent-screen. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
