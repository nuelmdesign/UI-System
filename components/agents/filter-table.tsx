// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

/* Status chips directly filter the task table; rows collapse in place. */

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

const ROWS: FilterTableRow[] = [
  {
    task: "Restock mango sorbet",
    date: "Dec 03",
    status: "todo",
    owner: "Mango Moon Gelato",
  },
  {
    task: "Churn black sesame",
    date: "Sep 22",
    status: "progress",
    owner: "Kumo Creamery",
  },
  {
    task: "Print summer menu",
    date: "Jan 02",
    status: "todo",
    owner: "Coral Coast Sorbet",
  },
  {
    task: "Taste-test batch 42",
    date: "Nov 08",
    status: "progress",
    owner: "Maple Orbit",
  },
  {
    task: "Order waffle cones",
    date: "Apr 14",
    status: "done",
    owner: "Aurora Scoops",
  },
]

const LABELS: FilterTableLabels = {
  all: "All",
  status: { todo: "To do", progress: "In Progress", done: "Completed" },
  columns: {
    task: "Task name",
    date: "Date",
    status: "Status",
    owner: "Advisor",
  },
}

const STATUSES: FilterTableStatus[] = ["todo", "progress", "done"]

const DOT: Record<FilterTableStatus, string> = {
  todo: "bg-warning",
  progress: "bg-brand",
  done: "bg-success",
}

const PILL: Record<FilterTableStatus, string> = {
  todo: "border-warning/30 bg-warning/10 text-warning",
  progress: "border-brand/25 bg-brand/10 text-brand",
  done: "border-success/30 bg-success/10 text-success",
}

const GRID =
  "grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.6fr)_minmax(0,0.95fr)_minmax(0,0.9fr)]"

export function FilterTable({
  rows = ROWS,
  labels,
  className,
}: FilterTableProps) {
  const l = {
    ...LABELS,
    ...labels,
    status: { ...LABELS.status, ...labels?.status },
    columns: { ...LABELS.columns, ...labels?.columns },
  }
  const [filter, setFilter] = useState<"all" | FilterTableStatus>("all")

  const filters: {
    key: "all" | FilterTableStatus
    label: string
    count: number
  }[] = [
    { key: "all", label: l.all, count: rows.length },
    ...STATUSES.map((s) => ({
      key: s,
      label: l.status[s],
      count: rows.filter((r) => r.status === s).length,
    })),
  ]

  return (
    <div data-slot="filter-table" className={cn("w-full max-w-105", className)}>
      {/* filter chips */}
      <div
        data-slot="filter-table-filters"
        className="-mx-1 mb-1 scrollbar-hide flex items-center gap-1 overflow-x-auto px-1 py-1"
      >
        {filters.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.key)}
              className={cn(
                "flex h-6.5 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-[background-color,border-color,color] duration-200",
                active
                  ? "border-border bg-card text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-accent"
              )}
            >
              {f.key !== "all" && (
                <span
                  aria-hidden
                  className={cn("size-1.5 rounded-full", DOT[f.key])}
                />
              )}
              {f.label}
              <span
                className={cn(
                  "rounded-sm px-1 font-mono text-[calc(10.5px*var(--text-scale))] tabular-nums",
                  active
                    ? "bg-muted text-muted-foreground"
                    : "text-muted-foreground/70"
                )}
              >
                {f.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* table */}
      <div
        aria-label="Scrollable task table"
        className="scrollbar-hide overflow-x-auto rounded-lg border bg-card"
        role="region"
        tabIndex={0}
      >
        <div className="min-w-[420px]">
          <div
            className={cn(
              GRID,
              "border-b text-[calc(12.5px*var(--text-scale))] font-medium text-muted-foreground"
            )}
          >
            <span className="border-r px-3 py-2">{l.columns.task}</span>
            <span className="border-r px-3 py-2">{l.columns.date}</span>
            <span className="border-r px-3 py-2">{l.columns.status}</span>
            <span className="px-3 py-2">{l.columns.owner}</span>
          </div>
          {rows.map((row) => {
            const shown = filter === "all" || row.status === filter
            return (
              <div
                key={row.task}
                data-slot="filter-table-row"
                data-state={shown ? "shown" : "hidden"}
                aria-hidden={shown ? undefined : true}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  shown
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      GRID,
                      "border-b text-[calc(13px*var(--text-scale))] transition-colors duration-100 hover:bg-accent"
                    )}
                  >
                    <span className="flex min-w-0 items-center border-r px-3 py-2">
                      <span className="truncate font-medium text-foreground">
                        {row.task}
                      </span>
                    </span>
                    <span className="flex items-center border-r px-3 py-2 font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                      {row.date}
                    </span>
                    <span className="flex items-center border-r px-3 py-2">
                      <span
                        className={cn(
                          "inline-flex h-[23px] shrink-0 items-center rounded-md border px-[7px] text-xs font-medium whitespace-nowrap",
                          PILL[row.status]
                        )}
                      >
                        {l.status[row.status]}
                      </span>
                    </span>
                    <span className="flex min-w-0 items-center px-3 py-2 text-muted-foreground">
                      <span className="truncate">{row.owner}</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
