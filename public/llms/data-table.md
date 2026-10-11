# Data Table

Generic table for any domain: search, filters, view tabs, sorting, selection with bulk actions, paging and a card layout when narrow.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/data-table
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DataTable } from "@/components/blocks/data-table"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/checkbox`, `@opendraft/empty-state`, `@opendraft/input`, `@opendraft/tabs`, `@opendraft/filter-bar`, `@opendraft/bulk-action-bar`

## Props and types

```ts
export type DataTableColumn<T> = {
  /** Unique column key. Also the default field read from the row. */
  key: string
  header: React.ReactNode
  /** Plain-text header used for aria and the card view. Defaults to `header` when it is a string. */
  headerText?: string
  /** Custom cell render. Defaults to the stringified field. */
  cell?: (row: T) => React.ReactNode
  /** Value used for sorting and search. Defaults to row[key]. */
  accessor?: (row: T) => string | number | boolean | null | undefined
  sortable?: boolean
  align?: "left" | "center" | "right"
  /** Use the mono font (IDs, dates, amounts). */
  mono?: boolean
  /** CSS width for the table column, e.g. "8rem". */
  width?: string
  /** Hide this column in the card view. */
  hideInCard?: boolean
}

export type DataTableView<T> = {
  id: string
  label: string
  /** Rows kept by this view. Omit for an "all" view. */
  filter?: (row: T) => boolean
}

export type DataTableBulkAction<T> = Omit<BulkAction, "onSelect"> & {
  onSelect: (rows: T[]) => void
}

export type DataTableLabels = {
  search: string
  searchPlaceholder: string
  selectAll: string
  selectRow: (rowName: string) => string
  emptyTitle: string
  emptyDescription: string
  noResultsTitle: string
  noResultsDescription: string
  clearFilters: string
  previous: string
  next: string
  range: (from: number, to: number, total: number) => string
  page: (page: number, pages: number) => string
  views: string
  sortedAscending: string
  sortedDescending: string
}

export type DataTableSort = { key: string; direction: "asc" | "desc" }

export type DataTableProps<T> = {
  columns?: DataTableColumn<T>[]
  rows?: T[]
  getRowId?: (row: T) => string
  /** Plain-text name of a row, for checkbox labels. Defaults to the id. */
  getRowName?: (row: T) => string
  /** Show the search field. Default true. */
  searchable?: boolean
  /** Filter controls shown beside the search field. */
  filters?: FilterConfig[]
  /** Decide whether a row matches the filter values. Default compares row[key] to the value(s). */
  filterRow?: (row: T, values: FilterValues) => boolean
  /** Tabs above the table, each keeping a subset of rows. */
  views?: DataTableView<T>[]
  defaultView?: string
  /** Show a checkbox column and the bulk action bar. */
  selectable?: boolean
  bulkActions?: DataTableBulkAction<T>[]
  selectedIds?: string[]
  defaultSelectedIds?: string[]
  onSelectedIdsChange?: (ids: string[]) => void
  defaultSort?: DataTableSort
  /** Rows per page. Set to 0 to show every row. Default 8. */
  pageSize?: number
  /** Called when a row is clicked or activated with Enter. */
  onRowOpen?: (row: T) => void
  /** Replaces the empty state when there are no rows at all. */
  empty?: React.ReactNode
  labels?: Partial<DataTableLabels>
  className?: string
}

export type SampleRow = {
  id: string
  name: string
  owner: string
  email: string
  status: "Active" | "Pending" | "Archived"
  updated: string
  amount: number
}

function DataTable(props: DataTableProps<T>)
```

## Example

```tsx
"use client"

import { Archive, Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type DataTableColumn } from "@/components/blocks/data-table"

type Shipment = {
  id: string
  origin: string
  destination: string
  mode: "Air" | "Sea" | "Road"
  status: "In transit" | "Delayed" | "Delivered"
  eta: string
  weightKg: number
}

type Employee = {
  id: string
  name: string
  team: string
  location: string
  status: "Active" | "On leave"
  start: string
  salary: number
}

const modes = ["Air", "Sea", "Road"] as const
const shipStatus = ["In transit", "Delayed", "Delivered"] as const
const cities = ["Rotterdam", "Singapore", "Chicago", "Lagos", "Santos"]

const shipments: Shipment[] = Array.from({ length: 18 }, (_, i) => ({
  id: `SHP-${4100 + i}`,
  origin: cities[i % 5],
  destination: cities[(i * 2 + 1) % 5],
  mode: modes[i % 3],
  status: shipStatus[(i * 2) % 3],
  eta: `2026-11-${String((i % 28) + 1).padStart(2, "0")}`,
  weightKg: 180 + ((i * 431) % 9000),
}))

const teams = ["Engineering", "Support", "Finance", "Design"]
const employees: Employee[] = Array.from({ length: 16 }, (_, i) => ({
  id: `EMP-${200 + i}`,
  name: `Employee ${i + 1}`,
  team: teams[i % 4],
  location: ["Remote", "Berlin", "Austin"][i % 3],
  status: i % 5 === 4 ? "On leave" : "Active",
  start: `202${(i % 5) + 1}-0${(i % 9) + 1}-15`,
  salary: 52000 + ((i * 7919) % 60000),
}))

const money = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})
const kg = new Intl.NumberFormat("en")

const shipmentColumns: DataTableColumn<Shipment>[] = [
  { key: "id", header: "Shipment", mono: true, sortable: true },
  { key: "origin", header: "Origin", sortable: true },
  { key: "destination", header: "Destination", sortable: true },
  { key: "mode", header: "Mode" },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (r) => (
      <Badge
        dot
        variant={
          r.status === "Delayed"
            ? "warning"
            : r.status === "Delivered"
              ? "success"
              : "secondary"
        }
      >
        {r.status}
      </Badge>
    ),
  },
  { key: "eta", header: "ETA", mono: true, sortable: true },
  {
    key: "weightKg",
    header: "Weight (kg)",
    mono: true,
    sortable: true,
    align: "right",
    cell: (r) => kg.format(r.weightKg),
  },
]

const employeeColumns: DataTableColumn<Employee>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "team", header: "Team", sortable: true },
  { key: "location", header: "Location" },
  {
    key: "status",
    header: "Status",
    cell: (r) => (
      <Badge dot variant={r.status === "Active" ? "success" : "outline"}>
        {r.status}
      </Badge>
    ),
  },
  { key: "start", header: "Start date", mono: true, sortable: true },
  {
    key: "salary",
    header: "Salary",
    mono: true,
    sortable: true,
    align: "right",
    cell: (r) => money.format(r.salary),
  },
]

const frame = "h-[680px] w-full overflow-hidden rounded-lg border bg-background"

export default function DataTableDemo() {
  return (
    <Tabs defaultValue="shipments" className="w-full">
      <TabsList>
        <TabsTrigger value="shipments">Shipments</TabsTrigger>
        <TabsTrigger value="employees">Employees</TabsTrigger>
      </TabsList>
      <TabsContent value="shipments">
        <div className={frame}>
          <DataTable<Shipment>
            columns={shipmentColumns}
            rows={shipments}
            getRowId={(r) => r.id}
            selectable
            pageSize={8}
            defaultSort={{ key: "eta", direction: "asc" }}
            labels={{
              searchPlaceholder: "Search shipments...",
              emptyTitle: "No shipments",
            }}
            filters={[
              {
                key: "mode",
                type: "multi-select",
                label: "Mode",
                options: modes.map((m) => ({ value: m, label: m })),
              },
            ]}
            views={[
              { id: "all", label: "All" },
              {
                id: "delayed",
                label: "Delayed",
                filter: (r) => r.status === "Delayed",
              },
              {
                id: "delivered",
                label: "Delivered",
                filter: (r) => r.status === "Delivered",
              },
            ]}
            bulkActions={[
              {
                id: "export",
                label: "Export",
                icon: <Download />,
                onSelect: () => {},
              },
            ]}
            onRowOpen={() => {}}
          />
        </div>
      </TabsContent>
      <TabsContent value="employees">
        <div className={frame}>
          <DataTable<Employee>
            columns={employeeColumns}
            rows={employees}
            getRowId={(r) => r.id}
            getRowName={(r) => r.name}
            selectable
            pageSize={6}
            labels={{
              searchPlaceholder: "Search people...",
              selectRow: (n) => `Select ${n}`,
              range: (f, t, total) => `Showing ${f} to ${t} of ${total} people`,
            }}
            filters={[
              {
                key: "team",
                type: "select",
                label: "Team",
                options: teams.map((t) => ({ value: t, label: t })),
              },
            ]}
            bulkActions={[
              {
                id: "archive",
                label: "Archive",
                icon: <Archive />,
                destructive: true,
                onSelect: () => {},
              },
            ]}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/data-table. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
