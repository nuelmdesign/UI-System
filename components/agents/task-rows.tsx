// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { type ReactNode, useEffect, useState } from "react"
import { Check, ChevronDown, RotateCw, X } from "lucide-react"

import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * TASK ROWS
 *
 *     0ms   rows enter staggered (80ms apart)
 *   600ms   running row's ring spins
 *  1500ms   running row expands — detail steps drop down
 *  3900ms   it collapses; the sequence row flips to Failed + retry
 *  5300ms   the sequence row resolves to Completed
 * The status run completes once; task details stay clickable.
 * ───────────────────────────────────────────────────────── */

export type TaskRowsVariant = "capsules" | "list"

/** One detail line shown when a task row is expanded. */
export type TaskDetail = { label: string; meta: string }

/**
 * A single task row.
 *  - "done"     → check badge + completed pill (static)
 *  - "running"  → active spinner showing `step`, no pill (static)
 *  - "sequence" → animation-driven: pending spinner → failed → completed
 */
export type TaskRow = {
  key: string
  label: string
  amount: string
  status: "done" | "running" | "sequence"
  step?: number
  details: TaskDetail[]
}

export type TaskRowsLabels = {
  completed: string
  failed: string
}

const TICKS = [600, 900, 2400, 1400, 2400, 600]

function useTick(intervals: number[]) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (tick >= intervals.length - 1) return
    const t = setTimeout(() => setTick((x) => x + 1), intervals[tick])
    return () => clearTimeout(t)
  }, [tick, intervals])
  return tick
}

const DEFAULT_LABELS: TaskRowsLabels = {
  completed: "Completed",
  failed: "Failed",
}

const TASK_ROWS: TaskRow[] = [
  {
    key: "verify",
    label: "Verified vendor records",
    amount: "12 suppliers",
    status: "done",
    details: [
      { label: "Matched tax and contact IDs", meta: "12/12" },
      { label: "Flagged stale records", meta: "0" },
    ],
  },
  {
    key: "index",
    label: "Build reorder task list",
    amount: "7 SKUs",
    status: "running",
    step: 2,
    details: [
      { label: "Reading POS export", meta: "3 files" },
      { label: "Scoring stockout risk", meta: "68%" },
    ],
  },
  {
    key: "draft",
    label: "Draft supplier emails",
    amount: "2 messages",
    status: "sequence",
    step: 3,
    details: [
      { label: "Cone supplier follow-up", meta: "draft" },
      { label: "Pistachio reorder note", meta: "draft" },
    ],
  },
]

const RING_SIZE = 24
const RING_STROKE = 2

function SpinnerRing({
  active,
  children,
}: {
  active?: boolean
  children?: ReactNode
}) {
  const r = (RING_SIZE - RING_STROKE) / 2
  const c = 2 * Math.PI * r
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        aria-hidden
        width={RING_SIZE}
        height={RING_SIZE}
        className={cn(
          "absolute inset-0 text-muted-foreground/70",
          active && "animate-spin"
        )}
        style={active ? { animationDuration: "1.1s" } : undefined}
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={RING_STROKE}
        />
        {active && (
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c * 0.72}`}
          />
        )}
      </svg>
      <span className="relative text-[calc(10.5px*var(--text-scale))] font-semibold text-foreground tabular-nums">
        {children}
      </span>
    </span>
  )
}

function Badge({
  tone,
  children,
}: {
  tone: "destructive" | "success"
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "flex size-5.5 shrink-0 animate-pop-in items-center justify-center rounded-full",
        tone === "destructive"
          ? "bg-destructive text-destructive-foreground"
          : "bg-success text-primary-foreground"
      )}
      style={{ animationDuration: "300ms" }}
    >
      {children}
    </span>
  )
}

function Pill({
  tone,
  animate,
  children,
}: {
  tone: "destructive" | "success"
  animate?: boolean
  children: ReactNode
}) {
  return (
    <span
      data-slot="task-rows-status"
      className={cn(
        "inline-flex h-5.5 items-center gap-1.5 rounded-md px-2 text-[calc(11.5px*var(--text-scale))] font-medium",
        tone === "destructive"
          ? "bg-destructive/10 text-destructive"
          : "bg-success/10 text-success",
        animate && "animate-fade-in"
      )}
      style={animate ? { animationDuration: "200ms" } : undefined}
    >
      {children}
    </span>
  )
}

const checkIcon = (
  <Check aria-hidden strokeWidth={3.5} className="size-[13px]" />
)
const xIcon = <X aria-hidden strokeWidth={3.5} className="size-3" />

export interface TaskRowsProps {
  variant?: TaskRowsVariant
  rows?: TaskRow[]
  labels?: Partial<TaskRowsLabels>
  className?: string
  onToggleRow?: (key: string, open: boolean) => void
}

export function TaskRows({
  variant = "capsules",
  rows = TASK_ROWS,
  labels,
  className,
  onToggleRow,
}: TaskRowsProps) {
  const tick = useTick(TICKS)
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({})
  const sequence: "pending" | "failed" | "done" =
    tick < 3 ? "pending" : tick === 3 ? "failed" : "done"
  const copy = { ...DEFAULT_LABELS, ...labels }

  const badgeFor = (row: TaskRow) => {
    if (row.status === "done") return <Badge tone="success">{checkIcon}</Badge>
    if (row.status === "running")
      return <SpinnerRing active>{row.step}</SpinnerRing>
    if (sequence === "pending") return <SpinnerRing>{row.step}</SpinnerRing>
    if (sequence === "failed") return <Badge tone="destructive">{xIcon}</Badge>
    return <Badge tone="success">{checkIcon}</Badge>
  }

  const pillFor = (row: TaskRow) => {
    if (row.status === "done")
      return <Pill tone="success">{copy.completed}</Pill>
    if (row.status === "running" || sequence === "pending") return null
    if (sequence === "failed")
      return (
        <Pill tone="destructive" animate>
          {copy.failed}
          <RotateCw
            aria-hidden
            strokeWidth={3}
            className="size-3 animate-spin"
            style={{ animationDuration: "1.2s" }}
          />
        </Pill>
      )
    return (
      <Pill tone="success" animate>
        {copy.completed}
      </Pill>
    )
  }

  const list = variant === "list"
  return (
    <div
      data-slot="task-rows"
      data-variant={variant}
      className={cn(
        "flex w-full max-w-110 flex-col",
        list
          ? "gap-0 self-start overflow-hidden rounded-lg border bg-card"
          : "min-h-49 gap-2",
        className
      )}
    >
      {rows.map((row, i) => {
        const open = manualOpen[row.key] ?? (row.key === "index" && tick === 2)
        return (
          <div
            key={row.key}
            data-slot="task-rows-row"
            data-state={open ? "open" : "closed"}
            className={cn(
              "animate-fade-up self-stretch overflow-hidden transition-[border-radius,background-color] duration-300 ease-out hover:bg-muted",
              list
                ? "border-b last:border-0"
                : cn("border bg-card", open ? "rounded-lg" : "rounded-2xl")
            )}
            style={{
              animationDuration: "450ms",
              animationDelay: `${i * 80}ms`,
            }}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => {
                setManualOpen((current) => ({ ...current, [row.key]: !open }))
                onToggleRow?.(row.key, !open)
              }}
              className="flex h-11 w-full items-center gap-2.5 px-2.5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset"
            >
              <span className="flex size-6 shrink-0 items-center justify-center">
                {badgeFor(row)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[calc(13px*var(--text-scale))] font-medium text-foreground">
                {row.label}
              </span>
              <span className="text-[calc(12.5px*var(--text-scale))] text-muted-foreground tabular-nums">
                {row.amount}
              </span>
              {pillFor(row)}
              <span
                aria-hidden
                className="-ml-2 flex size-7 shrink-0 items-center justify-center text-muted-foreground/70"
              >
                <ChevronDown
                  strokeWidth={2.2}
                  className="size-[15px] transition-transform duration-300 ease-out"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
                />
              </span>
            </button>

            {/* dropdown detail */}
            <div
              className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
              style={{
                gridTemplateRows: open ? "1fr" : "0fr",
                opacity: open ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <div className="mb-2.5 grid grid-cols-[24px_1fr] gap-2.5 px-2.5">
                  <span aria-hidden className="mx-auto h-full w-px bg-border" />
                  <div className="flex flex-col gap-1.5">
                    {row.details.map((d, j) => (
                      <div
                        key={d.label}
                        className={cn(
                          "flex items-center justify-between",
                          open && "animate-fade-up"
                        )}
                        style={
                          open
                            ? {
                                animationDuration: "300ms",
                                animationDelay: `${120 + j * 100}ms`,
                              }
                            : undefined
                        }
                      >
                        <span className="text-xs text-muted-foreground">
                          {d.label}
                        </span>
                        <span className="font-mono text-[calc(11.5px*var(--text-scale))] text-muted-foreground/70 tabular-nums">
                          {d.meta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
