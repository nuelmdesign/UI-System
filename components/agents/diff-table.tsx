// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * DIFF TABLE
 * The proposed edit plays once and rests on the completed
 * diff. Each changed row is the control: click it to include
 * or exclude that specific addition/removal before applying.
 * ───────────────────────────────────────────────────────── */

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

const ROWS: DiffRow[] = [
  {
    key: "rocky",
    id: "Rocky Road",
    dept: "Classic",
    email: "aurora-scoops",
    removed: true,
  },
  {
    key: "bubblegum",
    id: "Bubblegum",
    dept: "Retro",
    email: "kumo-creamery",
    removed: true,
  },
  {
    key: "mint",
    id: "Mint Chip",
    dept: "Classic",
    email: "maple-orbit",
    removed: false,
  },
]

const ADDED: DiffAddedRow = {
  key: "pistachio",
  id: "Pistachio",
  dept: "Seasonal",
  email: "maple-orbit",
}

const COLUMNS: [string, string, string] = ["Flavor", "Category", "Supplier"]

const DOT: Record<string, string> = {
  Classic: "bg-brand",
  Retro: "bg-muted-foreground/70",
  Seasonal: "bg-warning",
}

// 0 plain · 1 removals tinted · 2 completed diff
const STAGE_DELAYS = [180, 260]

function useStage(steps: number[]) {
  const [stage, setStage] = React.useState(0)
  React.useEffect(() => {
    if (stage >= steps.length) return
    const t = window.setTimeout(() => setStage((s) => s + 1), steps[stage])
    return () => window.clearTimeout(t)
  }, [stage, steps])
  return stage
}

function IncludedMark({
  included,
  tone,
}: {
  included: boolean
  tone: "destructive" | "success"
}) {
  return (
    <span
      aria-hidden
      data-slot="diff-table-mark"
      className={cn(
        "flex size-4.5 shrink-0 items-center justify-center rounded-sm transition-[background-color,color,transform] duration-150 ease-out",
        included
          ? tone === "destructive"
            ? "scale-100 bg-destructive text-destructive-foreground"
            : "scale-100 bg-success text-background"
          : "scale-[0.92] border bg-muted text-muted-foreground/70"
      )}
    >
      {included ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  )
}

function onActivate(handler: () => void) {
  return (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handler()
    }
  }
}

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`
}

export function DiffTable({
  rows = ROWS,
  added = ADDED,
  title = "Proposed menu cleanup",
  columns = COLUMNS,
  onApply,
  className,
}: DiffTableProps) {
  const stage = useStage(STAGE_DELAYS)
  const tinted = stage >= 1
  const settled = stage >= 2
  const [accepted, setAccepted] = React.useState(false)
  // Only overrides are stored; every proposed edit starts included.
  const [edits, setEdits] = React.useState<Record<string, boolean>>({})
  const isOn = (key: string) => edits[key] ?? true

  const removedRows = rows.filter((row) => row.removed)
  const removals = removedRows.filter((row) => isOn(row.key)).length
  const additions = isOn(added.key) ? 1 : 0
  const total = removals + additions

  const toggleEdit = (key: string) =>
    setEdits((current) => ({ ...current, [key]: !(current[key] ?? true) }))

  const apply = () => {
    setAccepted(true)
    onApply?.([...removedRows.map((row) => row.key), added.key].filter(isOn))
  }

  const addedOn = isOn(added.key)

  return (
    <div data-slot="diff-table" className={cn("w-full max-w-95", className)}>
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <div className="flex h-10 items-center justify-between border-b px-3">
          <span className="text-[calc(12.5px*var(--text-scale))] font-medium text-foreground">
            {title}
          </span>
          {settled && !accepted && (
            <span className="animate-fade-in text-[calc(11px*var(--text-scale))] text-muted-foreground/70">
              Click changed rows to toggle
            </span>
          )}
        </div>

        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[30%]" />
            <col className="w-[36%]" />
          </colgroup>
          <thead>
            <tr className="border-b">
              {columns.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-[calc(12px*var(--text-scale))] font-medium text-muted-foreground/70"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const on = isOn(row.key)
              const out = row.removed && tinted && on
              const interactive = row.removed && settled && !accepted
              return (
                <tr
                  key={row.key}
                  data-slot="diff-table-row"
                  data-state={out ? "removed" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-selected={row.removed ? on : undefined}
                  onClick={interactive ? () => toggleEdit(row.key) : undefined}
                  onKeyDown={
                    interactive
                      ? onActivate(() => toggleEdit(row.key))
                      : undefined
                  }
                  className={cn(
                    "border-b transition-[background-color,opacity] duration-150 last:border-0 focus-visible:ring-1 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset",
                    out && "bg-destructive/10",
                    interactive &&
                      (out
                        ? "cursor-pointer hover:bg-destructive/15"
                        : "cursor-pointer hover:bg-accent/50")
                  )}
                >
                  <td
                    className={cn(
                      "px-3 py-2 text-[calc(13px*var(--text-scale))] font-medium tabular-nums transition-colors duration-200",
                      out ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {row.id}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "inline-flex h-5.5 items-center gap-1.5 rounded-md border bg-muted px-2 text-[calc(11.5px*var(--text-scale))] font-medium transition-opacity duration-200",
                        out ? "opacity-55" : "opacity-100"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          DOT[row.dept] ?? "bg-muted-foreground/70"
                        )}
                      />
                      <span className="text-muted-foreground">{row.dept}</span>
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-3 py-2 text-[calc(12.5px*var(--text-scale))] whitespace-nowrap decoration-destructive/50 transition-colors duration-200",
                      out
                        ? "text-destructive line-through"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate">{row.email}</span>
                      {row.removed && settled && (
                        <IncludedMark included={on} tone="destructive" />
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
            {/* added row */}
            <tr>
              <td colSpan={3} className="p-0">
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                    settled
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      role="checkbox"
                      data-slot="diff-table-row"
                      data-state={addedOn ? "added" : undefined}
                      tabIndex={accepted || !settled ? -1 : 0}
                      aria-checked={addedOn}
                      aria-label={`Include adding ${added.id}`}
                      onClick={
                        accepted ? undefined : () => toggleEdit(added.key)
                      }
                      onKeyDown={
                        accepted
                          ? undefined
                          : onActivate(() => toggleEdit(added.key))
                      }
                      className={cn(
                        "grid grid-cols-[34%_30%_36%] items-center border-t transition-[background-color,opacity] duration-150 focus-visible:ring-1 focus-visible:ring-brand focus-visible:outline-none focus-visible:ring-inset",
                        addedOn && "bg-success/10",
                        !accepted &&
                          (addedOn
                            ? "cursor-pointer hover:bg-success/15"
                            : "cursor-pointer hover:bg-accent/50")
                      )}
                    >
                      <span
                        className={cn(
                          "px-3 py-2 text-[calc(13px*var(--text-scale))] font-medium tabular-nums transition-colors duration-200",
                          addedOn ? "text-success" : "text-muted-foreground/70"
                        )}
                      >
                        {added.id}
                      </span>
                      <span className="px-3 py-2">
                        <span className="inline-flex h-5.5 items-center gap-1.5 rounded-md border bg-card px-2 text-[calc(11.5px*var(--text-scale))] font-medium">
                          <span className="size-1.5 rounded-full bg-success" />
                          <span className="text-muted-foreground">
                            {added.dept}
                          </span>
                        </span>
                      </span>
                      <span
                        className={cn(
                          "px-3 py-2 text-[calc(13px*var(--text-scale))] transition-colors duration-200",
                          addedOn ? "text-success" : "text-muted-foreground/70"
                        )}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate">
                            {added.email}
                          </span>
                          <IncludedMark included={addedOn} tone="success" />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* footer — the summary follows the row-level selection */}
        {settled && (
          <div
            data-slot="diff-table-footer"
            className="flex min-h-11 animate-fade-up items-center justify-between border-t px-3 py-2"
          >
            {accepted ? (
              <span
                role="status"
                className="inline-flex animate-pop-in items-center gap-1.5 rounded-md bg-success/10 py-1 pr-2.5 pl-1 text-[calc(12.5px*var(--text-scale))] font-medium text-success"
              >
                <span className="flex size-4.5 items-center justify-center rounded-full bg-success text-background">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {plural(total, "edit", "edits")} applied
              </span>
            ) : (
              <>
                <span className="font-mono text-[calc(11.5px*var(--text-scale))] text-muted-foreground/70 tabular-nums">
                  {plural(removals, "removal", "removals")} ·{" "}
                  {plural(additions, "addition", "additions")}
                </span>
                <Button
                  size="sm"
                  disabled={total === 0}
                  onClick={apply}
                  className="text-[calc(12px*var(--text-scale))]"
                >
                  Apply {plural(total, "change", "changes")}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
