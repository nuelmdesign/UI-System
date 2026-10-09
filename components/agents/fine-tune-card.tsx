// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import { Check, ChevronDown, Sparkle } from "lucide-react"

import { GlideMenu } from "@/components/motion/glide-menu"
import { ShimmerText } from "@/components/motion/shimmer-text"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * FINE-TUNE CARD — compact interactive inspector.
 * Number fields scrub: hover the label for an ↔ cursor and
 * drag to adjust, use ↑/↓ (⇧ for ×10), or type directly.
 * ───────────────────────────────────────────────────────── */

function ScrubField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "",
  active,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
  active?: boolean
}) {
  const drag = React.useRef<{ x: number; v: number } | null>(null)
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)))

  return (
    <label
      data-slot="fine-tune-field"
      data-active={active || undefined}
      className={cn(
        "flex h-6.5 min-w-0 items-center gap-1 rounded-md border py-1 pr-1 pl-0.5",
        "transition-[background-color,border-color] duration-200 ease-out",
        active ? "border-primary bg-brand/10" : "border-transparent bg-muted"
      )}
    >
      {/* scrub handle */}
      <span
        role="slider"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          drag.current = { x: e.clientX, v: value }
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          onChange(
            clamp(drag.current.v + ((e.clientX - drag.current.x) / 2) * step)
          )
        }}
        onPointerUp={() => {
          drag.current = null
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        onKeyDown={(e) => {
          const mult = e.shiftKey ? 10 : 1
          if (e.key === "ArrowUp" || e.key === "ArrowRight") {
            e.preventDefault()
            onChange(clamp(value + step * mult))
          } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
            e.preventDefault()
            onChange(clamp(value - step * mult))
          }
        }}
        className="flex h-full shrink-0 cursor-ew-resize touch-none items-center rounded-sm px-0.5 text-xs text-muted-foreground/70 select-none hover:text-muted-foreground focus-visible:text-brand focus-visible:outline-none"
      >
        {label}
      </span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^\d-]/g, ""))
          if (!Number.isNaN(n)) onChange(clamp(n))
        }}
        aria-label={`${label} value`}
        className="min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground tabular-nums outline-none"
      />
      {suffix && (
        <span className="shrink-0 pr-0.5 text-[11.5px] text-muted-foreground/70">
          {suffix}
        </span>
      )}
    </label>
  )
}

const SEGMENTS = ["row", "col", "grid"] as const

function SegmentIcon({ kind }: { kind: (typeof SEGMENTS)[number] }) {
  const dot = "size-1.5 rounded-[1px] border-[1.2px] border-current"
  if (kind === "row")
    return (
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className={dot} />
        ))}
      </span>
    )
  if (kind === "col")
    return (
      <span className="flex flex-col gap-0.5">
        {[0, 1].map((i) => (
          <span key={i} className={dot} />
        ))}
      </span>
    )
  return (
    <span className="grid grid-cols-2 gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={dot} />
      ))}
    </span>
  )
}

/** A single scrub-able number property. `value` is the initial/default value. */
export type FineTuneField = {
  key: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
}
/** Prominent copy strings on the card. */
export type FineTuneCardLabels = {
  title: string
  layout: string
  type: string
  placeholder: string
  adjust: string
  edited: string
}
/** The editable state emitted by `onChange`. */
export type FineTuneState = {
  segment: number
  values: Record<string, number>
  type: string
}

const FIELDS: FineTuneField[] = [
  { key: "width", label: "W", value: 324, min: 40, max: 999 },
  { key: "height", label: "H", value: 96, min: 24, max: 999 },
  { key: "radius", label: "Radius", value: 28, min: 0, max: 64 },
  {
    key: "opacity",
    label: "Opacity",
    value: 100,
    min: 0,
    max: 100,
    suffix: "%",
  },
]

const OPTIONS = ["Seasonal", "Classic", "Limited"]

const DEFAULT_LABELS: FineTuneCardLabels = {
  title: "Flavor card",
  layout: "Layout",
  type: "Type",
  placeholder: "Select type",
  adjust: "Adjust",
  edited: "Edited",
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size)
    rows.push(items.slice(i, i + size))
  return rows
}

export type FineTuneCardProps = {
  /** The scrub-able properties shown in the layout grid (rendered in pairs). */
  fields?: FineTuneField[]
  /** Options offered in the Type menu. */
  options?: string[]
  /** Prominent copy strings. */
  labels?: Partial<FineTuneCardLabels>
  /** Called with the full editable state whenever the user edits it. */
  onChange?: (state: FineTuneState) => void
  className?: string
}

function FineTuneCard({
  fields = FIELDS,
  options = OPTIONS,
  labels,
  onChange,
  className,
}: FineTuneCardProps) {
  const text = { ...DEFAULT_LABELS, ...labels }
  const [seg, setSeg] = React.useState(0)
  const [values, setValues] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  )
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [typeValue, setTypeValue] = React.useState(text.placeholder)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!menuOpen) return
    const close = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const selectSeg = (i: number) => {
    setSeg(i)
    onChange?.({ segment: i, values, type: typeValue })
  }
  const setValue = (key: string, v: number) => {
    const next = { ...values, [key]: v }
    setValues(next)
    onChange?.({ segment: seg, values: next, type: typeValue })
  }
  const selectType = (value: string) => {
    setTypeValue(value)
    setMenuOpen(false)
    onChange?.({ segment: seg, values, type: value })
  }

  const changed = fields.some((f) => values[f.key] !== f.value)
  const done = seg !== 0 || changed || typeValue !== text.placeholder

  return (
    <div
      data-slot="fine-tune-card"
      className={cn(
        "relative w-full max-w-60 rounded-lg border bg-card text-card-foreground",
        className
      )}
    >
      {/* header */}
      <div className="flex h-10 items-center justify-between border-b px-3">
        <span className="text-[13px] font-medium text-foreground">
          {text.title}
        </span>
        {done ? (
          <span className="flex animate-pop-in items-center gap-1.5 text-xs font-medium text-success">
            <Check aria-hidden className="size-2.5" strokeWidth={3} />
            {text.edited}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="flex size-4.5 items-center justify-center rounded-md border border-brand/30 bg-brand/10">
              <Sparkle
                aria-hidden
                className="size-[9px] fill-brand text-brand"
              />
            </span>
            <ShimmerText
              duration={1.4}
              className="bg-[linear-gradient(90deg,var(--brand)_35%,var(--foreground)_50%,var(--brand)_65%)] text-xs font-medium"
            >
              {text.adjust}
            </ShimmerText>
          </span>
        )}
      </div>

      {/* layout section */}
      <div className="flex flex-col gap-2 border-b p-3">
        <p className="text-[12.5px] font-medium text-foreground">
          {text.layout}
        </p>
        {/* segmented control: muted track, sliding card thumb */}
        <div
          data-slot="fine-tune-segments"
          role="group"
          aria-label={text.layout}
          className="relative grid grid-cols-3 rounded-md bg-muted p-0.5"
        >
          <span
            aria-hidden
            className="absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded-sm border bg-card transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${seg * 100}%)` }}
          />
          {SEGMENTS.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-label={`${s} layout`}
              aria-pressed={i === seg}
              onClick={() => selectSeg(i)}
              className={cn(
                "relative z-10 flex h-6 items-center justify-center rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                "transition-colors duration-200 ease-out",
                i === seg ? "text-brand" : "text-muted-foreground/70"
              )}
            >
              <SegmentIcon kind={s} />
            </button>
          ))}
        </div>
        {chunk(fields, 2).map((pair, ri) => (
          <div key={ri} className="grid min-w-0 grid-cols-2 gap-2">
            {pair.map((f) => (
              <ScrubField
                key={f.key}
                label={f.label}
                value={values[f.key]}
                onChange={(v) => setValue(f.key, v)}
                min={f.min}
                max={f.max}
                step={f.step}
                suffix={f.suffix}
                active={values[f.key] !== f.value}
              />
            ))}
          </div>
        ))}
      </div>

      {/* interaction section */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs text-muted-foreground/70">{text.type}</span>
        <div ref={menuRef} className="relative -mr-0.5 w-30">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className={cn(
              "flex h-6.5 w-full items-center justify-between rounded-md border bg-muted py-1 pr-1 pl-2 outline-none",
              "transition-[border-color] duration-200 ease-out focus-visible:ring-[3px] focus-visible:ring-ring",
              menuOpen && "border-primary"
            )}
          >
            <span
              className={cn(
                "text-xs",
                typeValue !== text.placeholder
                  ? "text-foreground"
                  : "text-muted-foreground/70"
              )}
            >
              {typeValue}
            </span>
            <ChevronDown
              aria-hidden
              className={cn(
                "size-[11px] text-muted-foreground/70 transition-transform duration-200 ease-out",
                menuOpen && "rotate-180"
              )}
              strokeWidth={2.5}
            />
          </button>

          {menuOpen && (
            <div
              role="listbox"
              aria-label={text.type}
              className="absolute right-0 bottom-8 z-10 w-30 origin-bottom-right animate-pop-in rounded-lg border bg-popover p-1 shadow-md [--pop-y:2px]"
            >
              <GlideMenu
                className="flex flex-col gap-px"
                highlightClassName="inset-x-0 bg-muted"
              >
                {options.map((item) => (
                  <button
                    key={item}
                    data-menu-row
                    role="option"
                    aria-selected={item === typeValue}
                    type="button"
                    onClick={() => selectType(item)}
                    className={cn(
                      "relative z-10 flex h-6.5 w-full items-center rounded-md px-2 text-left text-[12.5px] text-foreground outline-none",
                      item === typeValue &&
                        "bg-muted group-hover/glide-menu:bg-transparent"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </GlideMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { FineTuneCard }
