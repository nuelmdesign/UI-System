# Code Panel

Light editor panel with a line-numbered Code view and a unified Diff view with word-level highlights.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/code-panel
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { CodePanel } from "@/components/agents/code-panel"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
/** A single run of code within a diff row; `change` tints it as an add/del. */
export type CodePiece = { text: string; change?: "add" | "del" }

/** One row of a unified diff: old/new line numbers, its kind, and its pieces. */
export type DiffRow = {
  old: number | null
  cur: number | null
  type: "ctx" | "add" | "del"
  pieces: CodePiece[]
}

/** Prominent copy strings on the panel. */
export type CodePanelLabels = { copy: string; copied: string }

export type CodePanelVariant = "Code" | "Diff"

export type CodePanelProps = {
  /** Which view to render — "Code" (line-numbered listing) or "Diff". */
  variant?: CodePanelVariant
  /** The lines shown in the Code view. */
  lines?: string[]
  /** Raw text placed on the clipboard by Copy. Defaults to `lines` joined. */
  code?: string
  /** The unified-diff rows shown in the Diff view. */
  diff?: DiffRow[]
  /** Filename shown in the header. */
  filename?: string
  /** Prominent copy strings. */
  labels?: Partial<CodePanelLabels>
  /** Called with the copied text after a successful copy. */
  onCopy?: (text: string) => void
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  CodePanel,
  type CodePanelVariant,
} from "@/components/agents/code-panel"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CodePanelDemo() {
  const [view, setView] = React.useState<CodePanelVariant>("Code")
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Tabs value={view} onValueChange={(v) => setView(v as CodePanelVariant)}>
        <TabsList>
          <TabsTrigger value="Code">Code</TabsTrigger>
          <TabsTrigger value="Diff">Diff</TabsTrigger>
        </TabsList>
      </Tabs>
      <CodePanel variant={view} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/code-panel. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
