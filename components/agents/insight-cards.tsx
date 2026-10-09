// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { transition, variants } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * INSIGHT CARDS
 * Embedded mini-visualizations in an "Insights N ‹ ›"
 * carousel, crossfading with a blur between pages.
 * ───────────────────────────────────────────────────────── */

export type InsightTone =
  "brand" | "blue" | "warning" | "destructive" | "success"

const TONE_VAR: Record<InsightTone, string> = {
  brand: "var(--brand)",
  blue: "var(--blue-300)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  success: "var(--success)",
}

const TONE_BG: Record<InsightTone, string> = {
  brand: "bg-brand",
  blue: "bg-blue-300",
  warning: "bg-warning",
  destructive: "bg-destructive",
  success: "bg-success",
}

const formatPercent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(2)}%`
const formatMoney = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`

/* Catmull-Rom resample — turn a sparse series into a dense, smoothly curved
 * one so both the line and the hover cursor glide instead of stepping between
 * a handful of points. */
function smooth(values: number[], perSegment = 9): number[] {
  if (values.length < 3) return values.slice()
  const out: number[] = []
  const n = values.length
  for (let i = 0; i < n - 1; i += 1) {
    const p0 = values[Math.max(0, i - 1)]
    const p1 = values[i]
    const p2 = values[i + 1]
    const p3 = values[Math.min(n - 1, i + 2)]
    for (let s = 0; s < perSegment; s += 1) {
      const t = s / perSegment
      const t2 = t * t
      const t3 = t2 * t
      out.push(
        0.5 *
          (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      )
    }
  }
  out.push(values[n - 1])
  return out
}

/* ── chart ── */

type ChartLine = { id: string; values: number[]; tone: InsightTone }
type TooltipRow = { label: string; value: string; tone: InsightTone }

/**
 * A tiny SVG line chart: Catmull-Rom smoothed path, optional area fill and
 * dashed threshold, and a pointer-driven cursor + tooltip. The hover index
 * walks the points you pass in — pass dense (pre-smoothed) values for a
 * gliding cursor, or sparse ones for a stepping cursor.
 */
function InsightChart({
  lines,
  fill = false,
  grid = false,
  threshold,
  index,
  onIndexChange,
  tooltip,
  label,
  className,
}: {
  lines: ChartLine[]
  fill?: boolean
  grid?: boolean
  threshold?: number
  index: number | null
  onIndexChange: (index: number | null) => void
  tooltip: (index: number) => TooltipRow[]
  label: string
  className?: string
}) {
  const count = lines[0]?.values.length ?? 0
  const all = lines.flatMap((l) => l.values)
  if (threshold !== undefined) all.push(threshold)
  const lo = Math.min(...all)
  const hi = Math.max(...all)
  const pad = (hi - lo || 1) * 0.08
  const min = lo - pad
  const max = hi + pad
  const y = (v: number) => ((max - v) / (max - min)) * 100
  const x = (i: number, n = count) => (n > 1 ? (i / (n - 1)) * 100 : 50)

  const paths = lines.map((line) => {
    const dense = line.values.length < 24 ? smooth(line.values) : line.values
    const d = dense
      .map((v, i) => `${i ? "L" : "M"} ${x(i, dense.length)} ${y(v)}`)
      .join(" ")
    return { ...line, d, area: `${d} L 100 100 L 0 100 Z` }
  })

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const progress = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width)
    )
    onIndexChange(Math.round(progress * (count - 1)))
  }
  const clear = () => onIndexChange(null)

  const cursorX = index !== null ? x(index) : 0

  return (
    <div
      data-slot="insight-chart"
      role="img"
      aria-label={label}
      className={cn("relative h-[166px] touch-none", className)}
      onPointerDown={fromPointer}
      onPointerMove={fromPointer}
      onPointerLeave={clear}
      onPointerCancel={clear}
      onPointerUp={clear}
    >
      {/* plot area: leaves room for the tooltip above and air below */}
      <div className="absolute inset-x-0 top-10 bottom-5">
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          {grid &&
            [0, 50, 100].map((gy) => (
              <line
                key={gy}
                x1="0"
                x2="100"
                y1={gy}
                y2={gy}
                stroke="var(--border)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          {threshold !== undefined && (
            <line
              x1="0"
              x2="100"
              y1={y(threshold)}
              y2={y(threshold)}
              stroke="var(--muted-foreground)"
              strokeOpacity="0.6"
              strokeWidth="1"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          )}
          {fill &&
            paths.map((p) => (
              <path
                key={`${p.id}-area`}
                d={p.area}
                fill={TONE_VAR[p.tone]}
                fillOpacity="0.1"
              />
            ))}
          {paths.map((p) => (
            <path
              key={p.id}
              d={p.d}
              fill="none"
              stroke={TONE_VAR[p.tone]}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {index !== null &&
          lines.map((line) => (
            <span
              key={line.id}
              aria-hidden
              className={cn(
                "pointer-events-none absolute size-2 -translate-1/2 rounded-full ring-2 ring-card",
                TONE_BG[line.tone]
              )}
              style={{ left: `${cursorX}%`, top: `${y(line.values[index])}%` }}
            />
          ))}
      </div>

      {index !== null && (
        <>
          <span
            aria-hidden
            data-slot="insight-chart-cursor"
            className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-foreground/20"
            style={{ left: `${cursorX}%` }}
          />
          <span
            data-slot="insight-chart-tooltip"
            className="pointer-events-none absolute top-2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-ink px-2 py-1 font-mono text-[calc(11px*var(--text-scale))] whitespace-nowrap text-ink-foreground tabular-nums"
            style={{ left: `${Math.min(Math.max(cursorX, 28), 72)}%` }}
          >
            {tooltip(index).map((row) => (
              <span key={row.label} className="flex items-center gap-1">
                <span
                  className={cn("size-1.5 rounded-full", TONE_BG[row.tone])}
                />
                {row.value}
              </span>
            ))}
          </span>
        </>
      )}
    </div>
  )
}

/* ── small inline atoms ── */

/** inline @entity mention */
function Entity({
  name,
  tone = "brand",
}: {
  name: string
  tone?: InsightTone
}) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline font-medium text-foreground">
      <span
        className={cn("inline-block size-2.5 rounded-full", TONE_BG[tone])}
      />
      @{name}
    </span>
  )
}

function Mono({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: "destructive" | "success"
}) {
  return (
    <code
      className={cn(
        "font-mono text-[calc(11.5px*var(--text-scale))] tabular-nums",
        tone === "destructive" ? "text-destructive" : "text-success"
      )}
    >
      {children}
    </code>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[calc(10.5px*var(--text-scale))] font-medium text-muted-foreground">
      {children}
    </span>
  )
}

const cardClass = "min-h-[278px] rounded-lg border bg-card p-3"
const insetClass = "mt-2 overflow-hidden rounded-md border bg-muted/50"
const insetBarClass = "flex items-center justify-between border-b px-2.5 py-1.5"

/* ── 1 — return comparison ── */

/** content shape for the return-comparison card's two plotted series */
export type CompareSeries = {
  name: string
  values: number[]
  sub: string
  /** Text tone for the delta. */
  tone: "destructive" | "success"
  /** Line, legend dot and tooltip color. */
  color: InsightTone
}

const COMPARE_SERIES: CompareSeries[] = [
  {
    name: "Mint Chip",
    values: [-2.9, -3.4, -3.05, -3.86, -3.52, -4.1, -3.82, -4.41],
    sub: "-$2,377.66",
    tone: "destructive",
    color: "warning",
  },
  {
    name: "Pistachio",
    values: [0.22, 0.58, 0.42, 0.91, 0.76, 1.08, 0.96, 1.15],
    sub: "+$617.22",
    tone: "success",
    color: "brand",
  },
]

function CompareCard({
  series = COMPARE_SERIES,
}: {
  series?: CompareSeries[]
}) {
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const dense = series.map((s) => smooth(s.values))

  return (
    <div data-slot="insight-card" className={cardClass}>
      <div className="flex items-center gap-4">
        {series.map((s) => (
          <div key={s.name} className="flex-1">
            <span className="flex items-center gap-1.5 text-[calc(11.5px*var(--text-scale))] text-muted-foreground">
              <span className={cn("size-2 rounded-full", TONE_BG[s.color])} />
              {s.name}
            </span>
            <span
              className={cn(
                "block text-[calc(17px*var(--text-scale))] font-semibold tracking-[-0.01em] tabular-nums",
                s.tone === "destructive" ? "text-destructive" : "text-success"
              )}
            >
              {formatPercent(s.values.at(-1) ?? 0)}
            </span>
            <Mono tone={s.tone}>{s.sub}</Mono>
          </div>
        ))}
      </div>
      <div className={insetClass}>
        <div className={insetBarClass}>
          <span className="text-[calc(11px*var(--text-scale))] text-muted-foreground/70 tabular-nums">
            Trend snapshot
          </span>
          <Tag>Snapshot</Tag>
        </div>
        <InsightChart
          label={`Return comparison: ${series.map((s) => s.name).join(" vs ")}`}
          lines={series.map((s, i) => ({
            id: s.name,
            values: dense[i],
            tone: s.color,
          }))}
          index={hoverIndex}
          onIndexChange={setHoverIndex}
          tooltip={(i) =>
            series.map((s, si) => ({
              label: s.name,
              value: formatPercent(dense[si][i]),
              tone: s.color,
            }))
          }
        />
      </div>
    </div>
  )
}

/* ── 2 — anomaly ── */

/** content shape for the anomaly card's two toggled metric series */
export type AnomalyData = {
  spend: number[]
  usage: number[]
  /** Dashed threshold per metric. */
  threshold: { spend: number; usage: number }
}

const ANOMALY_DATA: AnomalyData = {
  spend: [274, 289, 264, 307, 331, 1210, 1718, 2112],
  usage: [18, 19, 17, 21, 22, 58, 81, 96],
  threshold: { spend: 1500, usage: 82 },
}

function AnomalyCard({ data = ANOMALY_DATA }: { data?: AnomalyData }) {
  const [metric, setMetric] = React.useState<"spend" | "usage">("spend")
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)

  const values = data[metric]
  const format = (v: number) =>
    metric === "spend" ? formatMoney(v) : `${Math.round(v)} kWh`
  const threshold = data.threshold[metric]

  return (
    <div data-slot="insight-card" className={cardClass}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[calc(12px*var(--text-scale))] font-medium text-foreground">
          <ArrowUp aria-hidden className="size-3 text-destructive" />
          High freezer spend
        </span>
        <Tag>Snapshot</Tag>
      </div>
      <div className={insetClass}>
        <div className={insetBarClass}>
          <span className="font-mono text-[calc(11px*var(--text-scale))] text-muted-foreground/70 tabular-nums">
            {hoverIndex !== null
              ? format(values[hoverIndex])
              : `${format(threshold)} threshold`}
          </span>
          <span className="flex rounded-md bg-muted p-0.5">
            {(["spend", "usage"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={metric === item}
                onClick={() => setMetric(item)}
                className={cn(
                  "rounded-sm px-2 py-0.5 text-[calc(10.5px*var(--text-scale))] font-medium transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.96]",
                  metric === item
                    ? "bg-card text-foreground ring-1 ring-border"
                    : "text-muted-foreground/70 hover:text-muted-foreground"
                )}
              >
                {item === "spend" ? "Spend" : "Usage"}
              </button>
            ))}
          </span>
        </div>
        <InsightChart
          label={`Freezer ${metric} over time`}
          lines={[{ id: metric, values, tone: "destructive" }]}
          fill
          grid
          threshold={threshold}
          index={hoverIndex}
          onIndexChange={setHoverIndex}
          tooltip={(i) => [
            {
              label: metric === "spend" ? "Spend" : "Usage",
              value: format(values[i]),
              tone: "destructive",
            },
          ]}
        />
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-[calc(17px*var(--text-scale))] font-semibold tracking-[-0.01em] text-foreground tabular-nums">
          {formatMoney(data.spend.at(-1) ?? 0)} spent
        </span>
        <Mono tone="destructive">+$1,834.66</Mono>
        <span className="text-[calc(11px*var(--text-scale))] text-muted-foreground/70">
          vs 3 months
        </span>
      </div>
    </div>
  )
}

/* ── 3 — allocation ── */

/** content shape for one allocation segment */
export type AllocationSegment = {
  name: string
  label: string
  pct: number
  amount: string
  /** Bar and legend dot fill class, e.g. `bg-primary`. */
  cls: string
  /** Label text class, e.g. `text-brand`. */
  tone: string
}

const ALLOCATION_SEGMENTS: AllocationSegment[] = [
  {
    name: "VAN",
    label: "Vanilla",
    pct: 72.5,
    amount: "$51,785",
    cls: "bg-primary",
    tone: "text-brand",
  },
  {
    name: "CHOC",
    label: "Chocolate",
    pct: 22.8,
    amount: "$16,278",
    cls: "bg-blue-300",
    tone: "text-muted-foreground",
  },
  {
    name: "MINT",
    label: "Mint",
    pct: 4.7,
    amount: "$3,357",
    cls: "bg-input",
    tone: "text-muted-foreground/70",
  },
]

function AllocationCard({
  segments = ALLOCATION_SEGMENTS,
}: {
  segments?: AllocationSegment[]
}) {
  const [selected, setSelected] = React.useState(segments[0].name)
  const active =
    segments.find((segment) => segment.name === selected) ?? segments[0]

  return (
    <div data-slot="insight-card" className={cardClass}>
      <span className="flex items-center gap-1.5 text-[calc(12px*var(--text-scale))] font-medium text-foreground">
        <span className="flex size-3.5 items-center justify-center rounded-full bg-primary text-[calc(8px*var(--text-scale))] font-bold text-primary-foreground">
          V
        </span>
        Vanilla allocation
      </span>
      <span className="mt-1 block text-[calc(20px*var(--text-scale))] font-semibold tracking-[-0.01em] text-foreground tabular-nums">
        {active.amount}
      </span>
      <div
        className="mt-3 flex h-9 gap-0.5 overflow-hidden rounded-md bg-muted p-0.5"
        role="group"
        aria-label="Allocation segments"
      >
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            aria-label={`${s.label}: ${s.pct}%`}
            onClick={() => setSelected(s.name)}
            className={cn(
              "relative h-full overflow-hidden rounded-sm transition-[opacity,transform,box-shadow] duration-300 ease-out active:scale-[0.98]",
              s.cls,
              selected === s.name
                ? "opacity-100 ring-1 ring-background/25 ring-inset"
                : "opacity-60"
            )}
            style={{ width: `${s.pct}%` }}
          >
            <span
              className={cn(
                "absolute inset-y-1 left-1 rounded-sm bg-background/20 transition-[width,opacity] duration-500 ease-out",
                selected === s.name
                  ? "w-[calc(100%-8px)] opacity-100"
                  : "w-0 opacity-0"
              )}
            />
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            onClick={() => setSelected(s.name)}
            className={cn(
              "flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[calc(11px*var(--text-scale))] transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]",
              selected === s.name
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <span className={cn("size-1.5 rounded-full", s.cls)} />
            {s.name} <span className="tabular-nums">{s.pct}%</span>
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-16 rounded-md border bg-muted/50 px-2.5 py-2">
        <span
          className={cn(
            "block text-[calc(11.5px*var(--text-scale))] font-medium",
            active.tone
          )}
        >
          {active.label}
        </span>
        <span className="mt-1 block text-[calc(11px*var(--text-scale))] leading-relaxed text-muted-foreground/70">
          Contribution snapshot across current inventory value. Segment
          selection changes the inspected group without moving the card.
        </span>
      </div>
    </div>
  )
}

/* ── carousel ── */

/** content shape for one insight page in the carousel */
export type InsightPage = {
  key: string
  prose: React.ReactNode
  Card: React.ComponentType
  pill: string
}

const PAGES: InsightPage[] = [
  {
    key: "compare",
    prose: (
      <>
        The worst performer in your <Entity name="Creamery" /> is Rocky Road —
        down <Mono tone="destructive">-6%</Mono> or{" "}
        <Mono tone="destructive">-$2,453.44</Mono>.
      </>
    ),
    Card: CompareCard,
    pill: "Should I rebalance flavors?",
  },
  {
    key: "anomaly",
    prose: (
      <>
        Unusually high freezer bill on{" "}
        <span className="font-medium text-foreground">Dec 13</span> —{" "}
        <Mono tone="destructive">+$1,834.66</Mono> above your average.
      </>
    ),
    Card: AnomalyCard,
    pill: "Get tips on cutting freezer costs",
  },
  {
    key: "allocation",
    prose: (
      <>
        You’re heavily invested in <Entity name="Vanilla" /> — it’s{" "}
        <span className="font-medium text-foreground">72.5%</span> of your case.
      </>
    ),
    Card: AllocationCard,
    pill: "If we look at seasonals, what changes?",
  },
]

export type InsightCardsLabels = {
  /** carousel heading shown before the page count */
  title: string
  previous: string
  next: string
}

const DEFAULT_LABELS: InsightCardsLabels = {
  title: "Insights",
  previous: "Previous insight",
  next: "Next insight",
}

export type InsightCardsProps = {
  pages?: InsightPage[]
  labels?: Partial<InsightCardsLabels>
  /** Called with the follow-up prompt when its pill is pressed. */
  onAsk?: (pill: string, page: InsightPage) => void
  onPageChange?: (index: number) => void
  className?: string
}

function InsightCards({
  pages = PAGES,
  labels,
  onAsk,
  onPageChange,
  className,
}: InsightCardsProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const [page, setPage] = React.useState(0)

  const move = (direction: -1 | 1) => {
    const next = (page + direction + pages.length) % pages.length
    setPage(next)
    onPageChange?.(next)
  }

  const current = pages[page]
  const Card = current.Card

  return (
    <div
      data-slot="insight-cards"
      className={cn("min-h-[408px] w-full max-w-86", className)}
    >
      {/* pager header */}
      <div className="flex items-center justify-between">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[calc(13px*var(--text-scale))] font-semibold text-foreground">
            {l.title}
          </span>
          <span className="font-mono text-[calc(12px*var(--text-scale))] text-muted-foreground/70 tabular-nums">
            {pages.length}
          </span>
        </span>
        <span className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={l.previous}
            onClick={() => move(-1)}
            className="size-6 text-muted-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={l.next}
            onClick={() => move(1)}
            className="size-6 text-muted-foreground/70 hover:text-foreground"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </span>
      </div>

      {/* page content — blurred crossfade */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.key}
          data-slot="insight-cards-page"
          variants={variants.blurIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={transition.base}
        >
          <p className="mt-1.5 text-[calc(12.5px*var(--text-scale))] leading-relaxed text-muted-foreground">
            {current.prose}
          </p>
          <div className="mt-2">
            <Card />
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => onAsk?.(current.pill, current)}
            className="mt-2 h-auto py-1.5 text-left text-[calc(12px*var(--text-scale))] font-normal whitespace-normal"
          >
            {current.pill}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export { InsightCards, InsightChart }
