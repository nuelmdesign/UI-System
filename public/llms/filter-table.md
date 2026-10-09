# Filter Table

Task table filtered by status chips; rows collapse in place and status pills are tinted by meaning.

Category: Data & Workflows

## Install

```bash
npx shadcn@latest add @opendraft/filter-table
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { FilterTable } from "@/components/agents/filter-table"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
export type FilterTableStatus = "todo" | "progress" | "done"

export type FilterTableRow = {
  task: string
  date: string
  status: FilterTableStatus
  owner: string
}

export type FilterTableLabels = {
  all: string
  status: Record<FilterTableStatus, string>
  columns: { task: string; date: string; status: string; owner: string }
}

export interface FilterTableProps {
  rows?: FilterTableRow[]
  labels?: Partial<FilterTableLabels>
  className?: string
}
```

## Example

```tsx
"use client"

import { FilterTable } from "@/components/agents/filter-table"

export default function FilterTableDemo() {
  return (
    <div className="flex w-full justify-center">
      <FilterTable />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/filter-table. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
