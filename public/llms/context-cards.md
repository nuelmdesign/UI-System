# Context Cards

Retrieved context chunks that stagger in, then reveal their source file chips.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/context-cards
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ContextCards } from "@/components/agents/context-cards"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
export type ContextChunkTone = "destructive" | "success" | "brand" | "muted"

export type ContextChunk = {
  title: string
  chars: string
  body: string
  source: string
  /** Short file-type badge, e.g. "PDF". */
  badge: string
  tone: ContextChunkTone
  href?: string
}

export type ContextCardsLabels = {
  header: string
  count: string
}

export interface ContextCardsProps {
  chunks?: ContextChunk[]
  labels?: Partial<ContextCardsLabels>
  className?: string
}
```

## Example

```tsx
"use client"

import { ContextCards } from "@/components/agents/context-cards"

export default function ContextCardsDemo() {
  return (
    <div className="flex w-full justify-center">
      <ContextCards labels={{ header: "Retrieved context", count: "2" }} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/context-cards. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
