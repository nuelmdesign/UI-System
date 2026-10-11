"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Rating (display), RatingInput (radio group) and RatingBreakdown           */
/*  (distribution bars). Domain-free: reviews, feedback, quality scores...     */
/* -------------------------------------------------------------------------- */

type RatingSize = "sm" | "default" | "lg"

const STAR_SIZE: Record<RatingSize, string> = {
  sm: "size-3.5",
  default: "size-4",
  lg: "size-6",
}

type RatingLabels = {
  /** aria-label of a display rating. {value}, {max}. */
  summary: string
  /** Visible suffix after the number. {max}. Use "" to hide. */
  outOf: string
  /** Count text, plural. {count}. */
  count: string
  /** Count text when the count is 1. {count}. */
  countOne: string
  /** aria-label of one input option. {value}, {max}. */
  option: string
  /** aria-label of the input group. */
  group: string
  /** Shown by the input when nothing is chosen. */
  none: string
}

const DEFAULT_LABELS: RatingLabels = {
  summary: "{value} out of {max}",
  outOf: "out of {max}",
  count: "{count} ratings",
  countOne: "{count} rating",
  option: "{value} out of {max}",
  group: "Rating",
  none: "Not rated",
}

function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "")
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n))

/* ------------------------------- Stars layer -------------------------------- */

/** Outline stars with a filled copy clipped to `value / max` of the width. */
function Stars({
  value,
  max,
  size,
}: {
  value: number
  max: number
  size: RatingSize
}) {
  const cls = cn(STAR_SIZE[size], "shrink-0")
  const row = (filled: boolean) =>
    Array.from({ length: max }, (_, i) => (
      <StarIcon
        key={i}
        aria-hidden
        className={cn(cls, filled ? "fill-current" : "")}
      />
    ))
  return (
    <span aria-hidden className="relative inline-flex">
      <span className="inline-flex text-muted-foreground/50">{row(false)}</span>
      <span
        className="absolute inset-y-0 left-0 overflow-hidden text-warning"
        style={{ width: `${(clamp(value, 0, max) / max) * 100}%` }}
      >
        <span className="inline-flex">{row(true)}</span>
      </span>
    </span>
  )
}

/* ---------------------------------- Rating --------------------------------- */

type RatingProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Average or score, 0 to `max`. Fractions are drawn by clipping. */
  value: number
  max?: number
  size?: RatingSize
  /** Show the number (and "out of max"). Default true. */
  showValue?: boolean
  /** Decimal places for the number. Default 1. */
  precision?: number
  /** Number of ratings behind the value. */
  count?: number
  locale?: string
  labels?: Partial<RatingLabels>
}

function Rating({
  value,
  max = 5,
  size = "default",
  showValue = true,
  precision = 1,
  count,
  locale,
  labels: labelsProp,
  className,
  ...props
}: RatingProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const safeMax = Math.max(1, Math.floor(max))
  const v = clamp(value, 0, safeMax)
  const number = new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(v)
  const vars = { value: number, max: String(safeMax) }
  const countText =
    count === undefined
      ? null
      : fill(count === 1 ? labels.countOne : labels.count, {
          count: new Intl.NumberFormat(locale).format(count),
        })

  return (
    <div
      data-slot="rating"
      className={cn(
        "inline-flex flex-wrap items-center gap-x-2 gap-y-0.5",
        className
      )}
      {...props}
    >
      <span
        role="img"
        aria-label={fill(labels.summary, vars)}
        className="inline-flex"
      >
        <Stars value={v} max={safeMax} size={size} />
      </span>
      {showValue && (
        <span className="text-sm">
          <span className="font-mono font-medium tabular-nums">{number}</span>
          {labels.outOf && (
            <span className="text-muted-foreground">
              {" "}
              {fill(labels.outOf, vars)}
            </span>
          )}
        </span>
      )}
      {countText && (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          ({countText})
        </span>
      )}
    </div>
  )
}

/* -------------------------------- RatingInput ------------------------------- */

type RatingInputProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  size?: RatingSize
  /** Allow half steps (0.5, 1, 1.5 ...). */
  allowHalf?: boolean
  /** Clicking the chosen value again clears it to 0. */
  clearable?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Renders a hidden input so the value posts with a form. */
  name?: string
  /** Show the chosen value as text beside the stars. Default true. */
  showValue?: boolean
  labels?: Partial<RatingLabels>
}

function RatingInput({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  size = "default",
  allowHalf = false,
  clearable = false,
  disabled = false,
  readOnly = false,
  required,
  name,
  showValue = true,
  labels: labelsProp,
  className,
  "aria-label": ariaLabel,
  ...props
}: RatingInputProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const safeMax = Math.max(1, Math.floor(max))
  const step = allowHalf ? 0.5 : 1
  const [internal, setInternal] = React.useState(defaultValue)
  const [hover, setHover] = React.useState<number | null>(null)
  const groupRef = React.useRef<HTMLDivElement>(null)
  const current = clamp(value ?? internal, 0, safeMax)
  const shown = hover ?? current
  const inactive = disabled || readOnly

  const options = React.useMemo(
    () =>
      Array.from(
        { length: Math.round(safeMax / step) },
        (_, i) => (i + 1) * step
      ),
    [safeMax, step]
  )
  // Roving tabindex: the chosen option, else the first.
  const tabStop = options.includes(current) ? current : options[0]

  function select(next: number) {
    if (inactive) return
    const resolved = clearable && next === current ? 0 : next
    if (value === undefined) setInternal(resolved)
    onValueChange?.(resolved)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (inactive) return
    const idx = options.indexOf(tabStop)
    const from = options.includes(current) ? idx : -1
    let next: number | undefined
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      next = options[Math.min(options.length - 1, from + 1)]
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      next = options[Math.max(0, from - 1)]
    } else if (e.key === "Home") next = options[0]
    else if (e.key === "End") next = options[options.length - 1]
    if (next === undefined) return
    e.preventDefault()
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
    groupRef.current
      ?.querySelector<HTMLElement>(`[data-value="${next}"]`)
      ?.focus()
  }

  const text = current > 0 ? String(current) : null

  return (
    <div
      data-slot="rating-input"
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={ariaLabel ?? labels.group}
        aria-required={required || undefined}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHover(null)}
        className="relative inline-flex"
      >
        <Stars value={shown} max={safeMax} size={size} />
        <div className="absolute inset-0 flex">
          {Array.from({ length: safeMax }, (_, i) => (
            <div key={i} className="relative flex-1">
              {(allowHalf ? [i + 0.5, i + 1] : [i + 1]).map((opt) => {
                const half = opt % 1 !== 0
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    data-value={opt}
                    aria-checked={current === opt}
                    aria-label={fill(labels.option, {
                      value: String(opt),
                      max: String(safeMax),
                    })}
                    tabIndex={opt === tabStop ? 0 : -1}
                    disabled={disabled}
                    onClick={() => select(opt)}
                    onMouseEnter={() => !inactive && setHover(opt)}
                    onFocus={() => !inactive && setHover(null)}
                    className={cn(
                      "absolute inset-y-0 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                      half
                        ? "left-0 z-10 w-1/2"
                        : allowHalf
                          ? "right-0 w-1/2"
                          : "right-0 w-full",
                      inactive ? "cursor-default" : "cursor-pointer"
                    )}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {showValue && (
        <span
          aria-live="polite"
          className="font-mono text-sm text-muted-foreground tabular-nums"
        >
          {text ?? labels.none}
        </span>
      )}
      {name && <input type="hidden" name={name} value={current} />}
    </div>
  )
}

/* ------------------------------ RatingBreakdown ----------------------------- */

type RatingBreakdownLabels = {
  /** aria-label of the list. */
  group: string
  /** Row summary for assistive tech. {stars}, {count}, {percent}. */
  row: string
}

const DEFAULT_BREAKDOWN_LABELS: RatingBreakdownLabels = {
  group: "Rating distribution",
  row: "{stars} stars: {count} ({percent}%)",
}

const SAMPLE_RATING_COUNTS = [12, 25, 61, 240, 530]

type RatingBreakdownProps = Omit<React.ComponentProps<"ul">, "children"> & {
  /** Counts per rating, index 0 = 1 star ... index max-1 = max stars. */
  counts?: number[]
  /** Makes each row a button, e.g. to filter a list. */
  onSelectStars?: (stars: number) => void
  /** Highlights the active filter. */
  selectedStars?: number | null
  locale?: string
  labels?: Partial<RatingBreakdownLabels>
}

function RatingBreakdown({
  counts = SAMPLE_RATING_COUNTS,
  onSelectStars,
  selectedStars,
  locale,
  labels: labelsProp,
  className,
  ...props
}: RatingBreakdownProps) {
  const labels = { ...DEFAULT_BREAKDOWN_LABELS, ...labelsProp }
  const total = counts.reduce((a, b) => a + b, 0)
  const nf = new Intl.NumberFormat(locale)
  const rows = counts.map((count, i) => ({ stars: i + 1, count })).reverse()

  return (
    <ul
      data-slot="rating-breakdown"
      aria-label={labels.group}
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    >
      {rows.map(({ stars, count }) => {
        const pct = total > 0 ? (count / total) * 100 : 0
        const selected = selectedStars === stars
        const body = (
          <>
            <span className="flex w-8 shrink-0 items-center gap-1 font-mono text-xs tabular-nums">
              {stars}
              <StarIcon aria-hidden className="size-3 text-muted-foreground" />
            </span>
            <span
              aria-hidden
              className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-sm border bg-muted"
            >
              <span
                className="absolute inset-y-0 left-0 bg-warning"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
              {nf.format(count)}
            </span>
          </>
        )
        const summary = fill(labels.row, {
          stars: String(stars),
          count: nf.format(count),
          percent: String(Math.round(pct)),
        })
        return (
          <li key={stars} data-stars={stars}>
            {onSelectStars ? (
              <button
                type="button"
                aria-pressed={selected}
                aria-label={summary}
                onClick={() => onSelectStars(stars)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-1 py-0.5 transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring",
                  selected && "bg-accent"
                )}
              >
                {body}
              </button>
            ) : (
              <div
                role="group"
                aria-label={summary}
                className="flex items-center gap-2 px-1 py-0.5"
              >
                {body}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export { Rating, RatingBreakdown, RatingInput, SAMPLE_RATING_COUNTS }
export type {
  RatingBreakdownLabels,
  RatingBreakdownProps,
  RatingInputProps,
  RatingLabels,
  RatingProps,
  RatingSize,
}
