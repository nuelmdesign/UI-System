# Data Table

Virtualized table: sort, resize and reorder columns, select rows, edit cells.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/table
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Table } from "@/components/motion/table"
```

Files added to the project:

- `components/motion/table/index.tsx`
- `components/motion/table/editable-cell.tsx`
- `components/motion/table/row-handle.tsx`
- `components/motion/table/skeleton-rows.tsx`
- `components/motion/table/table-header.tsx`
- `components/motion/table/table-menu.tsx`
- `components/motion/table/types.ts`
- `components/motion/table/use-column-reorder.ts`
- `components/motion/table/use-column-resize.ts`
- `components/motion/table/use-column-sort.ts`
- `components/motion/table/use-row-selection.ts`
- `components/motion/table/utils.ts`

## Dependencies

- npm: `motion`, `lucide-react`, `@tanstack/react-virtual`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/checkbox`, `@opendraft/touch`

## Props and types

```ts
export type SortDirection = "asc" | "desc"

export type SortState = {
  key: string
  direction: SortDirection
}

export type TableColumn<T> = {
  /** Stable key; also the default object property read for the cell + sort value. */
  key: string
  /** Header content. */
  header: ReactNode
  /** Allow clicking the header to sort by this column. */
  sortable?: boolean
  /** Cell text alignment. */
  align?: "left" | "center" | "right"
  /** Column width as a CSS length, e.g. "160px" or "20%". Omit to share remaining space equally. */
  width?: string
  /** Custom cell renderer. Falls back to `row[key]`. */
  cell?: (row: T) => ReactNode
  /** Render an inline text input for this column's cells (ignored when `cell` is set). */
  editable?: boolean
  /** Value used for sorting. Falls back to `row[key]`. */
  sortValue?: (row: T) => string | number
}

export type InsertPosition = "before" | "after"

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  /** Stable id per row, required for correct selection across sorts. Defaults to row index. */
  getRowId?: (row: T, index: number) => string
  /** Render a leading checkbox column with select-all in the header. */
  selectable?: boolean
  selectedRowIds?: string[]
  defaultSelectedRowIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  sort?: SortState | null
  defaultSort?: SortState | null
  onSortChange?: (sort: SortState | null) => void
  /** Allow dragging the right edge of a header to resize that column. */
  resizable?: boolean
  /** Minimum column width in px when resizing. */
  minColumnWidth?: number
  onColumnResize?: (key: string, width: number) => void
  /** Allow dragging a header grip to reorder columns. */
  reorderable?: boolean
  onColumnOrderChange?: (keys: string[]) => void
  /** Called when an `editable` cell changes. */
  onCellEdit?: (rowId: string, columnKey: string, value: string) => void
  /** When set, non-sortable headers become editable inputs for the column name. */
  onColumnRename?: (columnKey: string, value: string) => void
  /** Enables the row menu (Insert before / after). Receives the target index. */
  onInsertRow?: (index: number, position: InsertPosition) => void
  /** Enables Delete in the row menu. */
  onDeleteRow?: (rowId: string, index: number) => void
  /** Enables the column menu (Insert before / after). Receives the target column index. */
  onInsertColumn?: (index: number, position: InsertPosition) => void
  /** Enables Delete in the column menu. */
  onDeleteColumn?: (columnKey: string, index: number) => void
  /** Fixed row height in px — required for virtualization. */
  rowHeight?: number
  /** Scroll viewport height in px. */
  height?: number
  /** Size to the rows, up to this many px, instead of the fixed `height`. */
  maxHeight?: number
  /** Rows rendered above/below the viewport. */
  overscan?: number
  /** Fires when the viewport scrolls near the bottom — load the next page. */
  onEndReached?: () => void
  /** Currently fetching — shows skeleton rows and pauses `onEndReached`. */
  loading?: boolean
  /** How many skeleton rows to show while loading more (default 3). */
  skeletonRows?: number
  emptyState?: ReactNode
  className?: string
}

function Table(props: TableProps<T>)
```

## Example

```tsx
"use client"

import * as React from "react"

import { Table, type TableColumn } from "@/components/motion/table"
import { Badge } from "@/components/ui/badge"

type Person = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "invited" | "suspended"
  mrr: number
}

const FIRST = [
  "Ava",
  "Leo",
  "Mia",
  "Kai",
  "Zoe",
  "Eli",
  "Noa",
  "Ren",
  "Ivy",
  "Jude",
]
const LAST = [
  "Cole",
  "Frost",
  "Vale",
  "Reyes",
  "Okafor",
  "Sato",
  "Lund",
  "Marsh",
  "Bose",
  "Quinn",
]
const ROLES = ["Owner", "Admin", "Member", "Viewer"]
const STATUSES: Person["status"][] = ["active", "invited", "suspended"]
const STATUS_VARIANT = {
  active: "success",
  invited: "warning",
  suspended: "destructive",
} as const

// Deterministic so the server and the browser render the same rows.
function buildPeople(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST[i % FIRST.length]
    const last = LAST[(i * 7) % LAST.length]
    return {
      id: String(i),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      role: ROLES[(i * 3) % ROLES.length],
      status: STATUSES[(i * 5) % STATUSES.length],
      mrr: 12 + ((i * 37) % 488),
    }
  })
}

export default function TableDemo() {
  const data = React.useMemo(() => buildPeople(10_000), [])
  const [selected, setSelected] = React.useState<string[]>([])

  const columns = React.useMemo<TableColumn<Person>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        sortable: true,
        width: "1.4fr",
        cell: (row) => <span className="font-medium">{row.name}</span>,
      },
      { key: "email", header: "Email", width: "1.8fr" },
      { key: "role", header: "Role", sortable: true, width: "120px" },
      {
        key: "status",
        header: "Status",
        width: "130px",
        cell: (row) => (
          <Badge
            variant={STATUS_VARIANT[row.status]}
            dot
            className="capitalize"
          >
            {row.status}
          </Badge>
        ),
      },
      {
        key: "mrr",
        header: "MRR",
        sortable: true,
        align: "right",
        width: "110px",
        cell: (row) => (
          <span className="tabular-nums">${row.mrr.toLocaleString()}</span>
        ),
      },
    ],
    []
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>{data.length.toLocaleString()} rows · virtualized</span>
        {selected.length > 0 ? (
          <span>{selected.length.toLocaleString()} selected</span>
        ) : null}
      </div>
      <Table
        data={data}
        columns={columns}
        selectable
        resizable
        reorderable
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        defaultSort={{ key: "mrr", direction: "desc" }}
        height={400}
        rowHeight={48}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/table. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
