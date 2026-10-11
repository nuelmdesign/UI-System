"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Inbox,
  SearchX,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BulkActionBar, type BulkAction } from "@/components/ui/bulk-action-bar"
import {
  FilterBar,
  type FilterConfig,
  type FilterValues,
} from "@/components/ui/filter-bar"

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

const defaultLabels: DataTableLabels = {
  search: "Search",
  searchPlaceholder: "Search...",
  selectAll: "Select all rows on this page",
  selectRow: (name) => `Select ${name}`,
  emptyTitle: "Nothing here yet",
  emptyDescription: "Records you add will show up in this table.",
  noResultsTitle: "No matching results",
  noResultsDescription: "Try a different search or clear the filters.",
  clearFilters: "Clear filters",
  previous: "Previous page",
  next: "Next page",
  range: (from, to, total) => `${from}-${to} of ${total}`,
  page: (page, pages) => `Page ${page} of ${pages}`,
  views: "Views",
  sortedAscending: "sorted ascending",
  sortedDescending: "sorted descending",
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

const STATUSES = ["Active", "Pending", "Archived"] as const

/** Neutral placeholder rows. Deterministic, no domain wording. */
export const SAMPLE_DATA_TABLE_ROWS: SampleRow[] = Array.from(
  { length: 24 },
  (_, i) => ({
    id: `ID-${String(1001 + i)}`,
    name: `Item ${i + 1}`,
    owner: `Person ${((i * 5) % 7) + 1}`,
    email: `person${((i * 5) % 7) + 1}@example.com`,
    status: STATUSES[(i * 2) % 3],
    updated: `2026-0${(i % 9) + 1}-${String(((i * 3) % 27) + 1).padStart(2, "0")}`,
    amount: 120 + ((i * 377) % 4000),
  })
)

export const SAMPLE_DATA_TABLE_COLUMNS: DataTableColumn<SampleRow>[] = [
  { key: "id", header: "ID", mono: true, sortable: true, width: "7rem" },
  { key: "name", header: "Name", sortable: true },
  { key: "owner", header: "Owner", sortable: true },
  { key: "status", header: "Status", sortable: true },
  { key: "updated", header: "Updated", mono: true, sortable: true },
  {
    key: "amount",
    header: "Amount",
    mono: true,
    sortable: true,
    align: "right",
  },
]

function rawValue<T>(col: DataTableColumn<T>, row: T) {
  return col.accessor
    ? col.accessor(row)
    : ((row as Record<string, unknown>)[col.key] as
        string | number | boolean | null | undefined)
}

function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

const justifyClass = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
} as const

function defaultFilterRow<T>(row: T, values: FilterValues) {
  return Object.entries(values).every(([key, v]) => {
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0))
      return true
    const field = String((row as Record<string, unknown>)[key] ?? "")
    return Array.isArray(v)
      ? v.includes(field)
      : field.toLowerCase().includes(v.toLowerCase())
  })
}

function DataTable<T = SampleRow>({
  columns: columnsProp,
  rows: rowsProp,
  getRowId: getRowIdProp,
  getRowName,
  searchable = true,
  filters,
  filterRow = defaultFilterRow,
  views,
  defaultView,
  selectable = false,
  bulkActions = [],
  selectedIds,
  defaultSelectedIds,
  onSelectedIdsChange,
  defaultSort,
  pageSize = 8,
  onRowOpen,
  empty,
  labels: labelsProp,
  className,
}: DataTableProps<T>) {
  const labels = { ...defaultLabels, ...labelsProp }
  const columns = (columnsProp ??
    SAMPLE_DATA_TABLE_COLUMNS) as DataTableColumn<T>[]
  const rows = (rowsProp ?? SAMPLE_DATA_TABLE_ROWS) as T[]
  const getRowId =
    getRowIdProp ??
    ((row: T) => String((row as Record<string, unknown>).id ?? ""))
  const rowName = (row: T) => (getRowName ? getRowName(row) : getRowId(row))

  const [query, setQuery] = React.useState("")
  const [filterValues, setFilterValues] = React.useState<FilterValues>({})
  const [view, setView] = React.useState(defaultView ?? views?.[0]?.id)
  const [sort, setSort] = React.useState<DataTableSort | null>(
    defaultSort ?? null
  )
  const [page, setPage] = React.useState(0)
  const [internalSel, setInternalSel] = React.useState<string[]>(
    defaultSelectedIds ?? []
  )
  const selection = selectedIds ?? internalSel

  function setSelection(next: string[]) {
    if (selectedIds === undefined) setInternalSel(next)
    onSelectedIdsChange?.(next)
  }

  const activeView = views?.find((v) => v.id === view)
  const viewRows = activeView?.filter ? rows.filter(activeView.filter) : rows

  const q = query.trim().toLowerCase()
  const filtered = viewRows.filter((row) => {
    if (!filterRow(row, filterValues)) return false
    if (!q) return true
    return columns.some((c) =>
      String(rawValue(c, row) ?? "")
        .toLowerCase()
        .includes(q)
    )
  })

  const sortCol = sort ? columns.find((c) => c.key === sort.key) : undefined
  const sorted =
    sort && sortCol
      ? [...filtered].sort(
          (a, b) =>
            compare(rawValue(sortCol, a), rawValue(sortCol, b)) *
            (sort.direction === "asc" ? 1 : -1)
        )
      : filtered

  const paged = pageSize > 0
  const pageCount = paged ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const current = Math.min(page, pageCount - 1)
  const visible = paged
    ? sorted.slice(current * pageSize, (current + 1) * pageSize)
    : sorted

  const visibleIds = visible.map(getRowId)
  const selectedVisible = visibleIds.filter((id) => selection.includes(id))
  const allChecked =
    visibleIds.length > 0 && selectedVisible.length === visibleIds.length
  const someChecked = selectedVisible.length > 0 && !allChecked

  function toggleAll(checked: boolean) {
    setSelection(
      checked
        ? [...new Set([...selection, ...visibleIds])]
        : selection.filter((id) => !visibleIds.includes(id))
    )
  }

  function toggleRow(id: string, checked: boolean) {
    setSelection(
      checked ? [...selection, id] : selection.filter((x) => x !== id)
    )
  }

  function cycleSort(key: string) {
    setPage(0)
    setSort((s) =>
      !s || s.key !== key
        ? { key, direction: "asc" }
        : s.direction === "asc"
          ? { key, direction: "desc" }
          : null
    )
  }

  function renderCell(col: DataTableColumn<T>, row: T) {
    if (col.cell) return col.cell(row)
    const v = rawValue(col, row)
    return v == null ? "" : String(v)
  }

  function open(row: T, target: EventTarget | null) {
    if (!onRowOpen) return
    if (
      target instanceof Element &&
      target.closest("button,a,input,[role=checkbox]")
    )
      return
    onRowOpen(row)
  }

  const rowProps = (row: T) =>
    onRowOpen
      ? {
          tabIndex: 0,
          onClick: (e: React.MouseEvent) => open(row, e.target),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && e.target === e.currentTarget)
              onRowOpen(row)
          },
        }
      : {}

  const hasFilters =
    q !== "" || Object.values(filterValues).some((v) => v && v.length > 0)
  const selectedRows = rows.filter((r) => selection.includes(getRowId(r)))
  const actions: BulkAction[] = bulkActions.map((a) => ({
    ...a,
    onSelect: () => a.onSelect(selectedRows),
  }))
  const headerText = (c: DataTableColumn<T>) =>
    c.headerText ?? (typeof c.header === "string" ? c.header : c.key)

  return (
    <div
      data-slot="data-table"
      className={cn("@container/data-table h-full min-h-0 w-full", className)}
    >
      <div className="flex h-full min-h-0 flex-col gap-3 p-3 @md/data-table:p-4">
        {views && views.length > 0 && (
          <Tabs
            variant="underline"
            value={view}
            onValueChange={(v) => {
              setView(v)
              setPage(0)
            }}
          >
            <TabsList
              aria-label={labels.views}
              className="max-w-full overflow-x-auto"
            >
              {views.map((v) => (
                <TabsTrigger key={v.id} value={v.id}>
                  {v.label}
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {v.filter ? rows.filter(v.filter).length : rows.length}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {(searchable || (filters && filters.length > 0)) && (
          <div className="flex flex-wrap items-center gap-2">
            {searchable && (
              <Input
                type="search"
                value={query}
                aria-label={labels.search}
                placeholder={labels.searchPlaceholder}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(0)
                }}
                className="h-8 min-w-40 flex-1 @md/data-table:max-w-64 @md/data-table:flex-none"
              />
            )}
            {filters && filters.length > 0 && (
              <FilterBar
                filters={filters}
                value={filterValues}
                onValueChange={(v) => {
                  setFilterValues(v)
                  setPage(0)
                }}
              />
            )}
          </div>
        )}

        {selectable && bulkActions.length > 0 && (
          <BulkActionBar
            count={selection.length}
            actions={actions}
            onClear={() => setSelection([])}
          />
        )}

        <div className="min-h-0 flex-1 overflow-auto rounded-md border">
          {sorted.length === 0 ? (
            rows.length === 0 && !hasFilters ? (
              (empty ?? (
                <EmptyState
                  icon={<Inbox />}
                  title={labels.emptyTitle}
                  description={labels.emptyDescription}
                />
              ))
            ) : (
              <EmptyState
                live
                icon={<SearchX />}
                title={labels.noResultsTitle}
                description={labels.noResultsDescription}
                action={
                  hasFilters ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setQuery("")
                        setFilterValues({})
                      }}
                    >
                      {labels.clearFilters}
                    </Button>
                  ) : undefined
                }
              />
            )
          ) : (
            <>
              <table className="hidden w-full border-collapse text-sm @md/data-table:table">
                <thead className="sticky top-0 z-10 bg-surface">
                  <tr className="border-b">
                    {selectable && (
                      <th scope="col" className="w-10 px-3 py-2">
                        <Checkbox
                          aria-label={labels.selectAll}
                          checked={
                            allChecked
                              ? true
                              : someChecked
                                ? "indeterminate"
                                : false
                          }
                          onCheckedChange={(c) => toggleAll(c === true)}
                        />
                      </th>
                    )}
                    {columns.map((c) => {
                      const dir = sort?.key === c.key ? sort.direction : null
                      const align = c.align ?? "left"
                      return (
                        <th
                          key={c.key}
                          scope="col"
                          style={{ width: c.width }}
                          aria-sort={
                            dir === "asc"
                              ? "ascending"
                              : dir === "desc"
                                ? "descending"
                                : undefined
                          }
                          className={cn(
                            "px-3 py-2 eyebrow font-normal text-muted-foreground",
                            alignClass[align]
                          )}
                        >
                          {c.sortable ? (
                            <button
                              type="button"
                              onClick={() => cycleSort(c.key)}
                              className={cn(
                                "-mx-1 inline-flex w-full items-center gap-1 rounded-sm px-1 py-1 eyebrow outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
                                justifyClass[align],
                                dir && "text-foreground"
                              )}
                            >
                              {c.header}
                              {dir === "asc" ? (
                                <ArrowUp aria-hidden className="size-3" />
                              ) : dir === "desc" ? (
                                <ArrowDown aria-hidden className="size-3" />
                              ) : (
                                <ChevronsUpDown
                                  aria-hidden
                                  className="size-3 opacity-60"
                                />
                              )}
                              {dir && (
                                <span className="sr-only">
                                  {dir === "asc"
                                    ? labels.sortedAscending
                                    : labels.sortedDescending}
                                </span>
                              )}
                            </button>
                          ) : (
                            c.header
                          )}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => {
                    const id = getRowId(row)
                    const selected = selection.includes(id)
                    return (
                      <tr
                        key={id}
                        data-state={selected ? "selected" : undefined}
                        {...rowProps(row)}
                        className={cn(
                          "border-b outline-none last:border-b-0 hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset data-[state=selected]:bg-accent",
                          onRowOpen && "cursor-pointer"
                        )}
                      >
                        {selectable && (
                          <td className="w-10 px-3 py-2">
                            <Checkbox
                              aria-label={labels.selectRow(rowName(row))}
                              checked={selected}
                              onCheckedChange={(c) => toggleRow(id, c === true)}
                            />
                          </td>
                        )}
                        {columns.map((c) => (
                          <td
                            key={c.key}
                            className={cn(
                              "px-3 py-2",
                              alignClass[c.align ?? "left"],
                              c.mono && "font-mono tabular-nums"
                            )}
                          >
                            {renderCell(c, row)}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <ul className="divide-y @md/data-table:hidden">
                {visible.map((row) => {
                  const id = getRowId(row)
                  const selected = selection.includes(id)
                  const [first, ...rest] = columns.filter((c) => !c.hideInCard)
                  return (
                    <li
                      key={id}
                      data-state={selected ? "selected" : undefined}
                      {...rowProps(row)}
                      className={cn(
                        "flex gap-3 px-3 py-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset data-[state=selected]:bg-accent",
                        onRowOpen && "cursor-pointer"
                      )}
                    >
                      {selectable && (
                        <Checkbox
                          aria-label={labels.selectRow(rowName(row))}
                          checked={selected}
                          onCheckedChange={(c) => toggleRow(id, c === true)}
                          className="mt-0.5"
                        />
                      )}
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        {first && (
                          <div
                            className={cn(
                              "min-w-0 truncate text-sm font-medium",
                              first.mono && "font-mono tabular-nums"
                            )}
                          >
                            {renderCell(first, row)}
                          </div>
                        )}
                        <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                          {rest.map((c) => (
                            <div key={c.key} className="min-w-0">
                              <dt className="eyebrow text-muted-foreground">
                                {headerText(c)}
                              </dt>
                              <dd
                                className={cn(
                                  "mt-1 truncate text-sm",
                                  c.mono && "font-mono tabular-nums"
                                )}
                              >
                                {renderCell(c, row)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>

        {paged && sorted.length > 0 && (
          <div
            data-slot="data-table-pagination"
            className="flex flex-wrap items-center justify-between gap-2"
          >
            <span
              role="status"
              aria-live="polite"
              className="font-mono text-xs text-muted-foreground tabular-nums"
            >
              {labels.range(
                current * pageSize + 1,
                Math.min((current + 1) * pageSize, sorted.length),
                sorted.length
              )}
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-xs text-muted-foreground tabular-nums @md/data-table:inline">
                {labels.page(current + 1, pageCount)}
              </span>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label={labels.previous}
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label={labels.next}
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { DataTable }
