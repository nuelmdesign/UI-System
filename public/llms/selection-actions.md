# Selection Actions

A contextual AI bar under selected text that animates its width between modes and streams in a rewrite.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/selection-actions
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SelectionActions } from "@/components/agents/selection-actions"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/shimmer-text`, `@opendraft/motion`

## Props and types

```ts
/** The passage: lead-in text, the selected `original`, and the streamed `rewrite`. */
export type SelectionText = {
  lead: string
  original: string
  rewrite: string
}

/** A single AI action offered in the bar. Omit `action` for a no-op button
 * (e.g. Explain); `busyLabel` is the gerund shown while it runs. */
export type SelectionAction = {
  id: string
  icon: ReactNode
  action?: string
  busyLabel?: string
}

/** The action set: `primary` are always visible; `more` reveal on expand. */
export type SelectionActionSet = {
  primary: SelectionAction[]
  more: SelectionAction[]
}

/** Prominent copy strings. */
export type SelectionActionsLabels = {
  keep: string
  discard: string
  placeholder: string
}

export type SelectionActionsProps = {
  /** The passage shown above the bar. */
  text?: Partial<SelectionText>
  /** The AI actions offered in the bar. */
  actions?: SelectionActionSet
  /** Prominent copy strings. */
  labels?: Partial<SelectionActionsLabels>
  /** Called with the action name whenever an edit is run. */
  onAction?: (action: string) => void
  className?: string
}
```

## Example

```tsx
"use client"

import { toast } from "sonner"

import { SelectionActions } from "@/components/agents/selection-actions"

export default function SelectionActionsDemo() {
  return (
    <div className="flex w-full justify-center">
      <SelectionActions onAction={(action) => toast(`${action}…`)} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/selection-actions. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
