# Bulk Action Bar

Toolbar that appears when items are selected: count, generic actions and a clear button.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/bulk-action-bar
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { BulkActionBar } from "@/components/ui/bulk-action-bar"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`

## Props and types

```ts
export type BulkAction = {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect: () => void
  destructive?: boolean
  disabled?: boolean
}

export type BulkActionBarLabels = {
  /** Summary text for the current count. */
  selected: (count: number) => string
  clear: string
  /** aria-label for the toolbar. */
  toolbar: string
}

export type BulkActionBarProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Number of selected items. The bar renders nothing visible at 0. */
  count: number
  actions: BulkAction[]
  onClear?: () => void
  labels?: Partial<BulkActionBarLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { Archive, Download, Trash2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BulkActionBar } from "@/components/ui/bulk-action-bar"

export default function BulkActionBarDemo() {
  const [a, setA] = React.useState(3)
  const [b, setB] = React.useState(2)

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-muted-foreground">Invoices</p>
        <div className="flex items-center gap-2">
          <Button size="xs" variant="outline" onClick={() => setA(a + 1)}>
            Select one more
          </Button>
        </div>
        <BulkActionBar
          count={a}
          onClear={() => setA(0)}
          actions={[
            {
              id: "export",
              label: "Export",
              icon: <Download />,
              onSelect: () => {},
            },
            {
              id: "archive",
              label: "Archive",
              icon: <Archive />,
              onSelect: () => {},
            },
            {
              id: "delete",
              label: "Delete",
              icon: <Trash2 />,
              destructive: true,
              onSelect: () => setA(0),
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-muted-foreground">Staff, custom labels</p>
        <Button
          size="xs"
          variant="outline"
          className="w-fit"
          onClick={() => setB(b + 1)}
        >
          Select one more
        </Button>
        <BulkActionBar
          count={b}
          onClear={() => setB(0)}
          labels={{
            selected: (n) =>
              `${n} ${n === 1 ? "employee" : "employees"} chosen`,
            clear: "Deselect all",
          }}
          actions={[
            {
              id: "assign",
              label: "Assign manager",
              icon: <UserPlus />,
              onSelect: () => {},
            },
          ]}
        />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/bulk-action-bar. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
