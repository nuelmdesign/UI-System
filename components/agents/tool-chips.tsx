// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { type ReactNode, type SyntheticEvent, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  ChevronDown,
  FileText,
  PencilLine,
  Sparkle,
  SquareTerminal,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * TOOL CHIPS
 * An agent run as compact rows: tool calls with inline chips
 * (one every 700ms), then file-diff chips summarizing the
 * edits. Hover a row to reveal its chevron; every row expands
 * to show what the tool did. Hover or focus a file chip to
 * preview its diff.
 * ───────────────────────────────────────────────────────── */

const STEP_MS = 700

export type ToolStepIcon = "think" | "write" | "run" | "read"

const ICONS: Record<ToolStepIcon, ReactNode> = {
  think: <Sparkle fill="currentColor" strokeWidth={0} />,
  write: <PencilLine />,
  run: <SquareTerminal />,
  read: <FileText />,
}

export type ToolDetailLine = { text: string; tone?: "add" }

export type ToolStep = {
  icon: ToolStepIcon
  label: string
  chip: string
  mono: boolean
  detailMono: boolean
  detail: ToolDetailLine[]
}

export type ToolDiff = { file: string; add: number; del: number }

export type ToolDiffLine = { text: string; tone: "add" | "del" | "ctx" }

export type ToolChipsLabels = {
  header: string
  more: string
}

const DEFAULT_LABELS: ToolChipsLabels = {
  header: "4 tool calls, 2 messages",
  more: "+2 more",
}

const ROWS: ToolStep[] = [
  {
    icon: "think",
    label: "Thinking",
    chip: "Planning the churn schedule…",
    mono: false,
    detailMono: false,
    detail: [
      { text: "Weekend demand carries pistachio, so it churns first." },
      { text: "Batch capacity leaves two evening freezer windows." },
    ],
  },
  {
    icon: "write",
    label: "Write 204 lines",
    chip: "ChurnSchedule.tsx",
    mono: true,
    detailMono: true,
    detail: [
      {
        text: "+ const windows = slots.filter((s) => s.temp <= -12)",
        tone: "add",
      },
      {
        text: '+ return schedule(windows, { hero: "pistachio" })',
        tone: "add",
      },
    ],
  },
  {
    icon: "run",
    label: "Rebuild and verify",
    chip: "npm run freeze",
    mono: true,
    detailMono: true,
    detail: [{ text: "✓ built in 1.2s" }, { text: "✓ 34 checks passed" }],
  },
  {
    icon: "read",
    label: "Read image",
    chip: "flavor-chart.png",
    mono: true,
    detailMono: false,
    detail: [
      { text: "1280 × 720 · line chart, three summers." },
      { text: "Mint chip trends up 12% through July." },
    ],
  },
]

const DIFFS: ToolDiff[] = [
  { file: "flavors.css", add: 13, del: 0 },
  { file: "ChurnSchedule.tsx", add: 74, del: 41 },
  { file: "menu.ts", add: 8, del: 2 },
]

/* hovering a file chip opens its diff — added in success, removed in destructive */
const DIFF_LINES: Record<string, ToolDiffLine[]> = {
  "flavors.css": [
    { text: ".scoop-card {", tone: "ctx" },
    { text: "  gap: 14px;", tone: "del" },
    { text: "  gap: 12px;", tone: "add" },
    { text: "  container-type: inline-size;", tone: "add" },
    { text: "}", tone: "ctx" },
  ],
  "ChurnSchedule.tsx": [
    { text: "const slots = coldSlots(week);", tone: "ctx" },
    { text: "const windows = slots;", tone: "del" },
    { text: "const windows = slots.filter(", tone: "add" },
    { text: "  (s) => s.temp <= -12,", tone: "add" },
    { text: ");", tone: "add" },
  ],
  "menu.ts": [
    { text: 'export const hero = "mint-chip";', tone: "del" },
    { text: 'export const hero = "pistachio";', tone: "add" },
  ],
}

type Preview = { file: string; x: number; top?: number; bottom?: number }

export interface ToolChipsProps {
  steps?: ToolStep[]
  diffs?: ToolDiff[]
  diffLines?: Record<string, ToolDiffLine[]>
  labels?: Partial<ToolChipsLabels>
  className?: string
  onOpenChange?: (open: boolean) => void
  onToggleRow?: (label: string, open: boolean) => void
  /** Fired when the trailing "+N more" chip is pressed. */
  onMore?: () => void
}

export function ToolChips({
  steps = ROWS,
  diffs = DIFFS,
  diffLines = DIFF_LINES,
  labels,
  className,
  onOpenChange,
  onToggleRow,
  onMore,
}: ToolChipsProps) {
  const copy = { ...DEFAULT_LABELS, ...labels }
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(true)
  const [openRows, setOpenRows] = useState<Set<string>>(() => new Set())
  /* Rendered in a body portal so animated/translated reply wrappers cannot
   * redefine the fixed-position coordinate system. Only set from events,
   * so it never renders on the server. */
  const [preview, setPreview] = useState<Preview | null>(null)
  const total = steps.length + 1 // rows, then diff chips

  useEffect(() => {
    if (step >= total) return
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [step, total])

  const openPreview = (file: string) => (event: SyntheticEvent) => {
    const chip = (event.currentTarget as Element).closest("[data-diffchip]")
    if (!chip) return
    const rect = chip.getBoundingClientRect()
    const previewHeight = 38 + (diffLines[file]?.length ?? 0) * 19
    const fitsBelow = rect.bottom + 6 + previewHeight <= window.innerHeight - 12
    setPreview({
      file,
      x: Math.max(12, Math.min(rect.left, window.innerWidth - 300)),
      ...(fitsBelow
        ? { top: rect.bottom + 6 }
        : { bottom: window.innerHeight - rect.top + 6 }),
    })
  }
  const closePreview = (file: string) => () =>
    setPreview((current) => (current?.file === file ? null : current))

  const toggleOpen = () => {
    setOpen(!open)
    onOpenChange?.(!open)
  }

  const toggleRow = (label: string) => {
    const next = new Set(openRows)
    if (next.has(label)) next.delete(label)
    else next.add(label)
    setOpenRows(next)
    onToggleRow?.(label, next.has(label))
  }

  const previewDiff = preview
    ? diffs.find((diff) => diff.file === preview.file)
    : undefined

  return (
    <div
      data-slot="tool-chips"
      className={cn("min-h-55 w-full max-w-80 pb-1", className)}
    >
      {/* collapsed run header */}
      <button
        type="button"
        data-slot="tool-chips-header"
        aria-expanded={open}
        onClick={toggleOpen}
        className="-mx-1.5 flex w-fit items-center gap-1.5 rounded-md px-1.5 py-1 text-[calc(12.5px*var(--text-scale))] text-muted-foreground transition-colors duration-100 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        <ChevronDown
          aria-hidden
          strokeWidth={2.2}
          className="size-3 transition-transform duration-200 ease-out"
          style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
        />
        <span className="tabular-nums">{copy.header}</span>
      </button>

      {/* tool call rows */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        inert={!open}
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        {/* -mx-1 + px-1.5 keeps content at the same x while giving the row
            hover fills room inside this overflow-hidden clip box */}
        <div className="-mx-1 overflow-hidden px-1.5 pb-1">
          <div className="mt-1.5 flex flex-col gap-1">
            {steps.slice(0, step).map((row) => {
              const rowOpen = openRows.has(row.label)
              return (
                <div
                  key={row.label}
                  data-slot="tool-chips-row"
                  data-state={rowOpen ? "open" : "closed"}
                  className="animate-fade-up"
                  style={{ animationDuration: "300ms" }}
                >
                  <button
                    type="button"
                    aria-expanded={rowOpen}
                    onClick={() => toggleRow(row.label)}
                    className="group/row -mx-[3px] flex h-7 w-[calc(100%+6px)] min-w-0 items-center gap-2 rounded-md px-[3px] text-left transition-colors duration-100 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
                  >
                    <span className="relative flex size-4 shrink-0 items-center justify-center text-muted-foreground/70">
                      <span
                        aria-hidden
                        className={cn(
                          "flex transition-opacity duration-100 group-hover/row:opacity-0 [&_svg]:size-[13px] [&_svg]:stroke-2",
                          rowOpen && "opacity-0"
                        )}
                      >
                        {ICONS[row.icon]}
                      </span>
                      <ChevronDown
                        aria-hidden
                        strokeWidth={2.2}
                        className={cn(
                          "absolute size-3 transition-[opacity,transform] duration-150 ease-out group-hover/row:opacity-100",
                          rowOpen ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                          transform: rowOpen
                            ? "rotate(0deg)"
                            : "rotate(-90deg)",
                        }}
                      />
                    </span>
                    <span className="shrink-0 text-[calc(12.5px*var(--text-scale))] font-medium text-foreground">
                      {row.label}
                    </span>
                    <span
                      data-slot="tool-chips-chip"
                      className={cn(
                        "flex h-5.5 min-w-0 flex-1 items-center rounded-sm border bg-muted px-1.5 text-[calc(11.5px*var(--text-scale))] text-muted-foreground transition-colors duration-100 hover:bg-accent",
                        row.mono && "font-mono"
                      )}
                    >
                      <span className="truncate">{row.chip}</span>
                    </span>
                  </button>

                  {/* expanded detail */}
                  <div
                    className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                    style={{
                      gridTemplateRows: rowOpen ? "1fr" : "0fr",
                      opacity: rowOpen ? 1 : 0,
                    }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="mt-0.5 mb-1 ml-2 flex flex-col gap-0.5 border-l py-0.5 pl-3.5">
                        {row.detail.map((line) => (
                          <span
                            key={line.text}
                            className={cn(
                              "truncate text-[calc(11.5px*var(--text-scale))] leading-[1.6]",
                              row.detailMono && "font-mono",
                              line.tone === "add"
                                ? "text-success"
                                : "text-muted-foreground"
                            )}
                          >
                            {line.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* file-diff chips */}
          {step >= total && (
            <div
              data-slot="tool-chips-diffs"
              className="mt-2.5 flex max-w-full flex-wrap gap-1.5 border-t pt-2.5"
            >
              {diffs.map((d, i) => (
                <span
                  key={d.file}
                  data-diffchip
                  className="relative"
                  onMouseEnter={openPreview(d.file)}
                  onMouseLeave={closePreview(d.file)}
                >
                  <button
                    type="button"
                    aria-expanded={preview?.file === d.file}
                    aria-label={`Show diff for ${d.file}`}
                    onFocus={openPreview(d.file)}
                    onBlur={closePreview(d.file)}
                    className="inline-flex h-7 max-w-full animate-pop-in items-center gap-2 rounded-md border bg-card px-2 font-mono text-[calc(11.5px*var(--text-scale))] text-foreground transition-colors duration-100 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
                    style={{
                      animationDuration: "250ms",
                      animationDelay: `${i * 80}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <span className="min-w-0 truncate">{d.file}</span>
                    <span className="shrink-0 text-success tabular-nums">
                      +{d.add}
                    </span>
                    {d.del > 0 && (
                      <span className="shrink-0 text-destructive tabular-nums">
                        −{d.del}
                      </span>
                    )}
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={onMore}
                className="inline-flex h-7 animate-fade-in items-center rounded-md px-1.5 font-mono text-[calc(11.5px*var(--text-scale))] text-muted-foreground/70 underline decoration-transparent underline-offset-2 transition-colors duration-100 outline-none hover:text-muted-foreground hover:decoration-current focus-visible:ring-[3px] focus-visible:ring-ring"
                style={{ animationDelay: `${diffs.length * 80}ms` }}
              >
                {copy.more}
              </button>
            </div>
          )}
        </div>
      </div>

      {preview &&
        createPortal(
          <div
            data-slot="tool-chips-preview"
            className="fixed z-50 w-72 animate-pop-in overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md"
            style={{
              left: preview.x,
              top: preview.top,
              bottom: preview.bottom,
              transformOrigin:
                preview.top === undefined ? "bottom left" : "top left",
            }}
          >
            <div className="flex items-center justify-between border-b px-2.5 py-1.5 font-mono text-[calc(11px*var(--text-scale))]">
              <span className="min-w-0 truncate text-muted-foreground">
                {preview.file}
              </span>
              {previewDiff && (
                <span className="shrink-0 tabular-nums">
                  <span className="text-success">+{previewDiff.add}</span>
                  {previewDiff.del > 0 && (
                    <span className="text-destructive">
                      {" "}
                      −{previewDiff.del}
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="py-1 font-mono text-[calc(11px*var(--text-scale))] leading-[1.8]">
              {(diffLines[preview.file] ?? []).map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-2 px-2.5 whitespace-pre",
                    line.tone === "add"
                      ? "bg-success/10 text-success"
                      : line.tone === "del"
                        ? "bg-destructive/10 text-destructive"
                        : "text-muted-foreground"
                  )}
                >
                  <span className="w-3 shrink-0 select-none">
                    {line.tone === "add"
                      ? "+"
                      : line.tone === "del"
                        ? "−"
                        : " "}
                  </span>
                  <span className="min-w-0 truncate">{line.text}</span>
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
