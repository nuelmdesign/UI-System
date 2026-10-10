# Diff Table

A proposed table edit that plays once; click each changed row to keep or drop it before applying. Data shape: A demo of an AI edit to a people table (id, dept, email). Not a general diff viewer; use `file-diff` for text changes. Shows sample content (an ice cream shop) until you pass your own data through its props.

Category: Data & Workflows

## Install

```bash
npx shadcn@latest add @opendraft/diff-table
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DiffTable } from "@/components/agents/diff-table"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`

## Props and types

```ts
export type DiffRow = {
  key: string
  id: string
  dept: string
  email: string
  removed: boolean
}

export type DiffAddedRow = Omit<DiffRow, "removed">

export type DiffTableProps = {
  rows?: DiffRow[]
  /** The row the edit proposes to add; it slides in once the diff settles. */
  added?: DiffAddedRow
  title?: string
  columns?: [string, string, string]
  /** Called with the keys of the edits that were kept when "Apply" is pressed. */
  onApply?: (keys: string[]) => void
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { DiffTable } from "@/components/agents/diff-table"
import { Button } from "@/components/ui/button"

export default function DiffTableDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <DiffTable key={run} />
      <Button variant="ghost" size="xs" onClick={() => setRun((r) => r + 1)}>
        <RotateCcw />
        Replay
      </Button>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/diff-table. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
