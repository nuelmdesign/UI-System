// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { Check, ChevronDown, Globe, Search, Sparkle } from "lucide-react"

import { ShimmerText } from "@/components/motion/shimmer-text"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * THINKING TRACE — expandable agent trace, four variants
 *
 *   steps      step list with spinner → muted checks
 *   reasoning  prose reasoning that expands, then settles
 *   search     web-search trace: query + sources read
 *   coding     tool trace: files read, edits, commands
 *
 *      0ms  header shimmers
 *    800ms  trace expands
 *   1400ms  first two rows land (120ms stagger)
 *   3200ms  remaining rows land
 *   5800ms  settles: label swaps to the done copy
 *   7400ms  trace collapses; stays expandable
 * ───────────────────────────────────────────────────────── */

export type ThinkingTraceVariant = "steps" | "reasoning" | "search" | "coding"

export type ThinkingTraceRow = {
  primary: string
  secondary?: string
  mono?: boolean
  add?: number
  del?: number
  href?: string
}

const STAGES = [800, 600, 1800, 2600, 1600]

function useSequence(steps: number[]) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    if (stage >= steps.length - 1) return
    const t = setTimeout(() => setStage((s) => s + 1), steps[stage])
    return () => clearTimeout(t)
  }, [stage, steps])
  return stage
}

type TraceContent = {
  active: string
  done: string
  rows: ThinkingTraceRow[]
  query?: string
  more?: string
}

const VARIANTS: Record<ThinkingTraceVariant, TraceContent> = {
  steps: {
    active: "Thinking",
    done: "Thought for 4 seconds",
    rows: [
      { primary: "Reading flavor briefs" },
      { primary: "Scanning supplier lists" },
      { primary: "Comparing tasting notes", secondary: "6 flavors" },
      { primary: "Writing the scoop report" },
    ],
  },
  reasoning: {
    active: "Thinking",
    done: "Thought for 4 seconds",
    rows: [
      {
        primary:
          "Summer demand spikes for stone-fruit flavors — peach and apricot lead.",
      },
      {
        primary:
          "I should check cone inventory before promoting a waffle-bowl special.",
      },
    ],
  },
  search: {
    active: "Searching the web",
    done: "Searched the web",
    query: "best waffle cone supplier",
    more: "+7 more",
    rows: [
      {
        primary: "Joy Cone",
        secondary: "joycone.com",
        href: "https://joycone.com/fs_products/waffle-cones/",
      },
      {
        primary: "WebstaurantStore",
        secondary: "webstaurantstore.com",
        href: "https://www.webstaurantstore.com/ice-cream-shop-supplies.html",
      },
      {
        primary: "The Konery",
        secondary: "thekonery.com",
        href: "https://www.thekonery.com/",
      },
    ],
  },
  coding: {
    active: "Running tools",
    done: "Ran 3 tools",
    rows: [
      { primary: "Read", secondary: "flavors.ts", mono: true },
      {
        primary: "Edit",
        secondary: "ChurnSchedule.tsx",
        mono: true,
        add: 74,
        del: 41,
      },
      { primary: "Run", secondary: "npm run freeze", mono: true },
    ],
  },
}

/* favicon stand-ins for search results */
const TONES = ["bg-blue-600", "bg-blue-400", "bg-blue-800"]

function SourceDot({ tone }: { tone: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-3.5 shrink-0 items-center justify-center rounded-full text-primary-foreground",
        tone
      )}
    >
      <Globe className="size-[9px]" strokeWidth={2.5} />
    </span>
  )
}

export interface ThinkingTraceProps {
  variant?: ThinkingTraceVariant
  /** Fires once, when the trace stops working. */
  onSettled?: () => void
  /** Override the built-in trace rows. */
  rows?: ThinkingTraceRow[]
  /** Label while working. */
  active?: string
  /** Label once settled. */
  done?: string
  /** Search query line (search variant). */
  query?: string
  /** Trailing "+N more" line (search variant). */
  more?: string
  /** Override the header glyph (defaults to the sparkle). */
  icon?: ReactNode
  className?: string
}

export function ThinkingTrace({
  variant = "steps",
  onSettled,
  rows,
  active,
  done,
  query,
  more,
  icon,
  className,
}: ThinkingTraceProps) {
  const stage = useSequence(STAGES)
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const base = VARIANTS[variant]
  const v = {
    rows: rows ?? base.rows,
    active: active ?? base.active,
    done: done ?? base.done,
    query: query ?? base.query,
    more: more ?? base.more,
  }
  const autoExpanded = stage >= 1 && stage < 4
  const expanded = manualExpanded ?? autoExpanded
  const working = stage < 3
  const visible =
    stage < 2 ? 0 : stage === 2 ? Math.min(2, v.rows.length) : v.rows.length

  const traceRef = useRef<HTMLDivElement>(null)
  const [lineHeight, setLineHeight] = useState(0)
  useLayoutEffect(() => {
    if (traceRef.current) setLineHeight(traceRef.current.offsetHeight)
  }, [visible, expanded, variant, stage])

  /* let embedders sequence content after the trace settles */
  const settledRef = useRef(false)
  useEffect(() => {
    if (working || settledRef.current) return
    settledRef.current = true
    onSettled?.()
  }, [working, onSettled])

  return (
    <div
      data-slot="thinking-trace"
      data-variant={variant}
      data-state={working ? "working" : "settled"}
      className={cn(
        "flex w-full max-w-95 flex-col transition-[min-height] duration-400 ease-out",
        className
      )}
      style={{ minHeight: working || expanded ? 176 : undefined }}
    >
      {/* header — shared across variants */}
      <button
        type="button"
        data-slot="thinking-trace-header"
        aria-expanded={expanded}
        onClick={() =>
          setManualExpanded((current) => !(current ?? autoExpanded))
        }
        className="-mx-1.5 flex w-fit items-center gap-2 rounded-md px-1.5 py-1 transition-colors duration-100 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        <span
          aria-hidden
          className={cn(
            "flex shrink-0 transition-colors duration-200 [&_svg]:size-4",
            working ? "text-brand" : "text-muted-foreground/70"
          )}
        >
          {icon ?? <Sparkle fill="currentColor" strokeWidth={0} />}
        </span>
        <span role="status" className="contents">
          {working ? (
            <ShimmerText
              duration={1.4}
              className="text-[13px] font-medium whitespace-nowrap"
            >
              {v.active}
            </ShimmerText>
          ) : (
            <span
              className="animate-fade-in text-[13px] font-medium whitespace-nowrap text-muted-foreground"
              style={{ animationDuration: "350ms" }}
            >
              {v.done}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden
          strokeWidth={2.2}
          className="size-3.5 text-muted-foreground/70 transition-transform duration-300 ease-out"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      {/* expandable trace */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-400 ease-out"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="relative mt-1 ml-[5px] pl-4">
            <span
              aria-hidden
              className="absolute left-[3px] w-px bg-border transition-[height] duration-500 ease-out"
              style={{ top: -8, height: lineHeight ? lineHeight - 2 : 0 }}
            />
            <div
              ref={traceRef}
              data-slot="thinking-trace-rows"
              className="flex flex-col gap-1 py-1"
            >
              {v.query && (
                <div
                  className={cn(
                    "flex h-6 items-center gap-2 px-1.5",
                    expanded && "animate-fade-up"
                  )}
                >
                  <Search
                    aria-hidden
                    className="size-3.5 shrink-0 text-muted-foreground/70"
                  />
                  <span className="text-[12.5px] text-muted-foreground">
                    {v.query}
                  </span>
                </div>
              )}
              {v.rows.slice(0, visible).map((row, i) => {
                const content = (
                  <>
                    {variant === "search" && (
                      <SourceDot tone={TONES[i % TONES.length]} />
                    )}
                    {variant === "steps" &&
                      (i < visible - 1 || !working ? (
                        <Check
                          aria-hidden
                          strokeWidth={2.5}
                          className="size-3.5 shrink-0 text-muted-foreground/70"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="size-3 shrink-0 animate-spin rounded-full border-[1.5px] border-input border-t-muted-foreground"
                          style={{ animationDuration: "700ms" }}
                        />
                      ))}
                    <span
                      className={cn(
                        "min-w-0 truncate text-[12.5px]",
                        variant === "reasoning"
                          ? "leading-relaxed whitespace-normal text-muted-foreground"
                          : "font-medium text-foreground",
                        variant === "search" &&
                          "underline decoration-transparent underline-offset-2 transition-[text-decoration-color] duration-150 group-hover/source:decoration-current"
                      )}
                    >
                      {row.primary}
                    </span>
                    {row.secondary && (
                      <span
                        className={cn(
                          "shrink-0 text-[11.5px] text-muted-foreground/70",
                          row.mono && "font-mono"
                        )}
                      >
                        {row.secondary}
                      </span>
                    )}
                    {row.add !== undefined && (
                      <span className="shrink-0 font-mono text-[11px] tabular-nums">
                        <span className="text-success">+{row.add}</span>{" "}
                        <span className="text-destructive">−{row.del}</span>
                      </span>
                    )}
                  </>
                )
                const rowClass =
                  "flex min-h-7 w-full animate-fade-up items-center gap-2 rounded-md px-1.5 py-0.5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                const delay = { animationDelay: `${i * 120}ms` }

                if (variant === "search") {
                  return (
                    <a
                      key={row.primary}
                      data-slot="thinking-trace-row"
                      href={row.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        rowClass,
                        "group/source transition-colors duration-150 hover:bg-accent"
                      )}
                      style={delay}
                    >
                      {content}
                    </a>
                  )
                }

                if (variant === "coding") {
                  const selected = selectedTool === row.primary
                  return (
                    <button
                      key={row.primary}
                      data-slot="thinking-trace-row"
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setSelectedTool(selected ? null : row.primary)
                      }
                      className={cn(
                        rowClass,
                        "transition-colors duration-150",
                        selected ? "bg-muted" : "hover:bg-accent"
                      )}
                      style={delay}
                    >
                      {content}
                    </button>
                  )
                }

                return (
                  <div
                    key={row.primary}
                    data-slot="thinking-trace-row"
                    className={rowClass}
                    style={delay}
                  >
                    {content}
                  </div>
                )
              })}
              {variant === "search" && v.more && stage >= 3 && (
                <span className="animate-fade-in px-1.5 text-xs text-muted-foreground/70">
                  {v.more}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
