# Prompt Bar

A composer with @ sources, / commands, a model picker, dictation and attachments, plus a self-running demo.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/prompt-bar
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { PromptBar } from "@/components/agents/prompt-bar"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/glide-menu`, `@opendraft/motion`

## Props and types

```ts
export type PromptBarVariant = "Rounded" | "Pill"

/** An entry in the @ menu. `attach` adds a file chip; `connect` shows a Connect toggle. */
export type PromptBarSource = {
  key: string
  name: string
  description: string
  icon: ReactNode
  attach?: boolean
  connect?: boolean
}

/** An entry in the / menu. `name` includes the leading slash. */
export type PromptBarCommand = {
  key: string
  name: string
  description: string
}

/** A model in the picker. Selecting a `flagship` model plays a one-shot sweep. */
export type PromptBarModel = {
  key: string
  name: string
  tag?: string
  flagship?: boolean
}

export type PromptBarProps = {
  variant?: PromptBarVariant
  /** The self-running walkthrough; turn off when embedding in a real surface. */
  demo?: boolean
  /** Hero sizing: a multi-line input with controls on their own row. */
  tall?: boolean
  placeholder?: string
  /** Entries in the @ menu. */
  sources?: PromptBarSource[]
  /** Entries in the / menu. */
  commands?: PromptBarCommand[]
  /** Models in the picker; the second one starts selected (the first if only one). */
  models?: PromptBarModel[]
  onSend?: (text: string) => void
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  PromptBar,
  type PromptBarVariant,
} from "@/components/agents/prompt-bar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const VARIANTS: PromptBarVariant[] = ["Rounded", "Pill"]

export default function PromptBarDemo() {
  const [variant, setVariant] = React.useState<PromptBarVariant>("Rounded")

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as PromptBarVariant)}
      >
        <TabsList>
          {VARIANTS.map((name) => (
            <TabsTrigger key={name} value={name}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* Remount on switch so the self-running demo restarts. */}
      <PromptBar
        key={variant}
        variant={variant}
        onSend={(text) => toast("Prompt sent", { description: text })}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/prompt-bar. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
