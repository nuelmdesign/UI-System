// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import { Check, ChevronDown, GripVertical, IceCreamCone } from "lucide-react"

import { GlideMenu } from "@/components/motion/glide-menu"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * FLOWCHART — an agent workflow on a dotted editor canvas.
 * Two steps: a Trigger card and an If/Else condition card,
 * joined by a measured connector. Cards drag anywhere on
 * the canvas; the connector follows. Condition chips open
 * real dropdowns.
 * ───────────────────────────────────────────────────────── */

export type FlowchartTone = "brand" | "warning"

export type FlowchartStep = {
  id: string
  row: number
  /** 0–1 horizontal center of the node on the canvas. */
  x: number
  w: number
  kind?: { label: string; tone: FlowchartTone }
  tone?: FlowchartTone
  title?: string
  caption?: string
  /** Renders the if/else chip rows instead of a title + caption. */
  condition?: boolean
}

export type FlowchartEdge = { from: string; to: string }

export type FlowchartOption = { name: string; tag?: string }

export type FlowchartProps = {
  steps?: FlowchartStep[]
  edges?: FlowchartEdge[]
  /** Options for the property chips in the condition card. */
  properties?: FlowchartOption[]
  /** Options for the first value chip. */
  values?: FlowchartOption[]
  /** Options for the second value chip. */
  secondaryValues?: FlowchartOption[]
  /** Source label shown in the condition rows. */
  source?: string
  onSelectStep?: (id: string | null) => void
  className?: string
}

/* layout constants */
const PAD_Y = 24
const ROW_GAP = 64
const PILL_OFFSET = 30 // kind pill + gap above a card

const STEPS: FlowchartStep[] = [
  {
    id: "trigger",
    row: 0,
    x: 0.5,
    w: 300,
    kind: { label: "Trigger", tone: "brand" },
    tone: "brand",
    title: "New order created",
    caption: "Trigger when a new order is created",
  },
  {
    id: "cond",
    row: 1,
    x: 0.5,
    w: 356,
    kind: { label: "If / Else", tone: "warning" },
    condition: true,
  },
]

const EDGES: FlowchartEdge[] = [{ from: "trigger", to: "cond" }]

/* estimated heights for the first paint; measured immediately after */
const EST_H: Record<string, number> = { trigger: 92, cond: 134 }

const PROPERTIES: FlowchartOption[] = [
  { name: "flavor" },
  { name: "topping" },
  { name: "size" },
  { name: "scoops" },
]
const FLAVORS: FlowchartOption[] = [
  { name: "Rocky Road", tag: "Classic" },
  { name: "Mint Chip", tag: "Classic" },
  { name: "Pistachio", tag: "Seasonal" },
  { name: "Bubblegum", tag: "Retro" },
]
const TOPPINGS: FlowchartOption[] = [
  { name: "Brown butter bourbon brittle crunch" },
  { name: "Rainbow sprinkles" },
  { name: "Hot fudge" },
  { name: "Candied pecans" },
]

/* warning is a light hue; mix it toward foreground so text stays legible */
const WARNING_TEXT = {
  color: "color-mix(in oklch, var(--warning) 70%, var(--foreground))",
}

const TONE: Record<
  FlowchartTone,
  { pill: string; tile: string; style?: React.CSSProperties }
> = {
  brand: {
    pill: "bg-brand/10 text-brand",
    tile: "border-brand/20 bg-brand/10 text-brand",
  },
  warning: {
    pill: "bg-warning/15",
    tile: "border-warning/30 bg-warning/15",
    style: WARNING_TEXT,
  },
}

/* ── dropdown menu ── */
function ChipMenu({
  items,
  value,
  width,
  align,
  onPick,
}: {
  items: FlowchartOption[]
  value: string
  width: string
  align: "left" | "right"
  onPick: (name: string) => void
}) {
  return (
    <GlideMenu
      role="menu"
      data-slot="flowchart-menu"
      className={cn(
        "absolute bottom-full z-20 mb-1.5 animate-pop-in rounded-lg border bg-popover p-1 text-popover-foreground shadow-md [--pop-y:2px]",
        align === "right"
          ? "right-0 origin-bottom-right"
          : "left-0 origin-bottom-left",
        width
      )}
    >
      {items.map((item) => {
        const checked = item.name === value
        return (
          <button
            key={item.name}
            type="button"
            role="menuitemradio"
            aria-checked={checked}
            data-menu-row
            onClick={() => onPick(item.name)}
            className="relative z-10 flex h-7.5 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left outline-none"
          >
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">
              {item.name}
            </span>
            {item.tag && (
              <span className="shrink-0 text-[11px] text-muted-foreground/70">
                {item.tag}
              </span>
            )}
            <Check
              aria-hidden
              className={cn(
                "size-3.5 shrink-0 text-foreground",
                !checked && "invisible"
              )}
            />
          </button>
        )
      })}
    </GlideMenu>
  )
}

/* ── chips used inside the condition card ── */
function SourceChip({ label }: { label: string }) {
  return (
    <span
      data-ui
      className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md border bg-card px-1.5 text-[12px] font-medium text-foreground"
    >
      <IceCreamCone aria-hidden className="size-3 text-muted-foreground" />
      {label}
    </span>
  )
}

function SelectChip({
  id,
  value,
  dot,
  items,
  width,
  align = "left",
  open,
  onToggle,
  onPick,
}: {
  id: string
  value: string
  dot?: boolean
  items: FlowchartOption[]
  width: string
  align?: "left" | "right"
  open: boolean
  onToggle: (id: string) => void
  onPick: (id: string, name: string) => void
}) {
  return (
    <span data-ui className="relative inline-flex min-w-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => onToggle(id)}
        className={cn(
          "inline-flex h-6 min-w-0 cursor-pointer items-center gap-1 rounded-md px-1.5 text-[12px] font-medium text-foreground transition-colors duration-100 outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
          open ? "bg-accent" : "bg-muted hover:bg-accent"
        )}
      >
        {dot && <span className="size-1.5 shrink-0 rounded-full bg-warning" />}
        <span className="min-w-0 truncate">{value}</span>
        <ChevronDown
          aria-hidden
          className="size-3 shrink-0 text-muted-foreground/70"
        />
      </button>
      {open && (
        <ChipMenu
          items={items}
          value={value}
          width={width}
          align={align}
          onPick={(name) => onPick(id, name)}
        />
      )}
    </span>
  )
}

function ConditionBody({
  source,
  properties,
  values: firstValues,
  secondaryValues,
}: {
  source: string
  properties: FlowchartOption[]
  values: FlowchartOption[]
  secondaryValues: FlowchartOption[]
}) {
  const [values, setValues] = React.useState<Record<string, string>>({
    prop1: properties[0]?.name ?? "",
    val1: firstValues[0]?.name ?? "",
    prop2: properties[1]?.name ?? properties[0]?.name ?? "",
    val2: secondaryValues[0]?.name ?? "",
  })
  const [open, setOpen] = React.useState<string | null>(null)

  /* click anywhere else (or Escape) closes the menu */
  React.useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-ui]")) setOpen(null)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null)
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", escape)
    }
  }, [open])

  const toggle = (id: string) =>
    setOpen((current) => (current === id ? null : id))
  const pick = (id: string, name: string) => {
    setValues((current) => ({ ...current, [id]: name }))
    setOpen(null)
  }

  const chip = (
    id: string,
    items: FlowchartOption[],
    width: string,
    extra?: { dot?: boolean; align?: "left" | "right" }
  ) => (
    <SelectChip
      id={id}
      value={values[id]}
      items={items}
      width={width}
      open={open === id}
      onToggle={toggle}
      onPick={pick}
      {...extra}
    />
  )

  const label = "w-7 text-[12.5px] text-muted-foreground"
  const grip = "size-4 shrink-0 cursor-grab text-muted-foreground/50"

  return (
    <div className="flex flex-col gap-1.5 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <GripVertical aria-hidden className={grip} />
        <span className={label}>If</span>
        <SourceChip label={source} />
        {chip("prop1", properties, "w-36")}
        <span className="text-[12.5px] text-muted-foreground">is</span>
        {chip("val1", firstValues, "w-44", { dot: true, align: "right" })}
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1.5">
        <GripVertical aria-hidden className={grip} />
        <span className={label}>and</span>
        <SourceChip label={source} />
        {chip("prop2", properties, "w-36")}
        <span className="text-[12.5px] text-muted-foreground">is</span>
        <span className="max-w-full pl-[49px]">
          {chip("val2", secondaryValues, "w-64", { dot: true })}
        </span>
      </div>
    </div>
  )
}

function StepBody({ node }: { node: FlowchartStep }) {
  const tone = TONE[node.tone ?? "brand"]
  return (
    <div className="flex items-center gap-2.5 p-2.5">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md border",
          tone.tile
        )}
        style={tone.style}
      >
        <IceCreamCone aria-hidden className="size-4" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block truncate text-[13px] leading-tight font-semibold text-foreground">
          {node.title}
        </span>
        <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">
          {node.caption}
        </span>
      </span>
    </div>
  )
}

type Drag = {
  id: string
  startX: number
  startY: number
  baseDx: number
  baseDy: number
  moved: boolean
}

/* ── the canvas ── */
function Flowchart({
  steps = STEPS,
  edges = EDGES,
  properties = PROPERTIES,
  values = FLAVORS,
  secondaryValues = TOPPINGS,
  source = "order",
  onSelectStep,
  className,
}: FlowchartProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const nodeRefs = React.useRef(new Map<string, HTMLElement>())
  const drag = React.useRef<Drag | null>(null)
  const [width, setWidth] = React.useState(0)
  const [heights, setHeights] = React.useState<Record<string, number>>(EST_H)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState<string | null>(null)
  const [offsets, setOffsets] = React.useState<
    Record<string, { dx: number; dy: number }>
  >({})

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const nodes = nodeRefs.current

    const measure = () => {
      setWidth(canvas.clientWidth)
      setHeights((prev) => {
        const next = { ...prev }
        let changed = false
        nodes.forEach((el, id) => {
          const h = el.offsetHeight
          if (h && Math.abs(h - (next[id] ?? 0)) > 0.5) {
            next[id] = h
            changed = true
          }
        })
        return changed ? next : prev
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    nodes.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  /* rows → y offsets from measured node heights */
  const rows = [...new Set(steps.map((n) => n.row))].sort((a, b) => a - b)
  const rowH = rows.map((r) =>
    Math.max(
      ...steps.filter((n) => n.row === r).map((n) => heights[n.id] ?? 90)
    )
  )
  const rowY: number[] = []
  rows.forEach((_, i) => {
    rowY[i] = i === 0 ? PAD_Y : rowY[i - 1] + rowH[i - 1] + ROW_GAP
  })
  const canvasH = rowY[rows.length - 1] + rowH[rows.length - 1] + PAD_Y

  const cw = width || 480
  const place = (n: FlowchartStep) => {
    const w = Math.min(n.w, cw * 0.92)
    const off = offsets[n.id]
    return {
      w,
      cx: n.x * cw + (off?.dx ?? 0),
      top: rowY[rows.indexOf(n.row)] + (off?.dy ?? 0),
    }
  }

  /* card anchor points (pills sit above the card, so offset the top) */
  const anchors = (n: FlowchartStep) => {
    const { cx, top } = place(n)
    return {
      top: { x: cx, y: top + (n.kind ? PILL_OFFSET : 0) },
      bottom: { x: cx, y: top + (heights[n.id] ?? 90) },
    }
  }

  const bezier = (edge: FlowchartEdge) => {
    const fromNode = steps.find((n) => n.id === edge.from)
    const toNode = steps.find((n) => n.id === edge.to)
    if (!fromNode || !toNode) return ""
    const from = anchors(fromNode).bottom
    const to = anchors(toNode).top
    const k = Math.min(Math.max(Math.abs(to.y - from.y) * 0.55, 24), 84)
    return `M ${from.x} ${from.y} C ${from.x} ${from.y + k}, ${to.x} ${to.y - k}, ${to.x} ${to.y}`
  }

  /* ── dragging ── */
  const onPointerDown =
    (node: FlowchartStep) => (event: React.PointerEvent<HTMLDivElement>) => {
      if ((event.target as Element).closest("[data-ui]")) return
      const off = offsets[node.id]
      drag.current = {
        id: node.id,
        startX: event.clientX,
        startY: event.clientY,
        baseDx: off?.dx ?? 0,
        baseDy: off?.dy ?? 0,
        moved: false,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    }

  const onPointerMove =
    (node: FlowchartStep) => (event: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current
      if (!d || d.id !== node.id) return
      const dx = d.baseDx + event.clientX - d.startX
      const dy = d.baseDy + event.clientY - d.startY
      if (!d.moved && Math.hypot(dx - d.baseDx, dy - d.baseDy) < 3) return
      if (!d.moved) setDragging(node.id)
      d.moved = true

      /* keep the card inside the canvas */
      const { w } = place(node)
      const h = heights[node.id] ?? 90
      const baseCx = node.x * cw
      const baseTop = rowY[rows.indexOf(node.row)]
      const cx = Math.min(Math.max(baseCx + dx, w / 2 + 8), cw - w / 2 - 8)
      const top = Math.min(Math.max(baseTop + dy, 8), canvasH - h - 8)
      setOffsets((current) => ({
        ...current,
        [node.id]: { dx: cx - baseCx, dy: top - baseTop },
      }))
    }

  const onPointerUp = (node: FlowchartStep) => () => {
    const d = drag.current
    if (d?.id !== node.id) return
    setDragging(null)
    /* a real drag shouldn't also toggle selection */
    if (d.moved) window.setTimeout(() => (drag.current = null), 0)
    else drag.current = null
  }

  const select = (id: string | null) => {
    setSelected(id)
    onSelectStep?.(id)
  }

  const isLit = (edge: FlowchartEdge) =>
    selected === edge.from || selected === edge.to

  return (
    <div
      ref={canvasRef}
      data-slot="flowchart"
      className={cn(
        "relative w-full overflow-hidden rounded-lg border bg-background bg-dots bg-center select-none [--dot-gap:22px]",
        className
      )}
      style={{ height: canvasH }}
    >
      {/* connectors */}
      <svg
        aria-hidden
        width={cw}
        height={canvasH}
        className="pointer-events-none absolute inset-0"
      >
        {edges.map((edge) => (
          <path
            key={`${edge.from}-${edge.to}`}
            data-slot="flowchart-edge"
            d={bezier(edge)}
            fill="none"
            stroke={isLit(edge) ? "var(--brand)" : "var(--input)"}
            strokeWidth="1.25"
            className="transition-[stroke] duration-150 ease-out"
          />
        ))}
      </svg>

      {/* nodes */}
      {steps.map((node) => {
        const { w, cx, top } = place(node)
        const active = selected === node.id
        const kindTone = node.kind ? TONE[node.kind.tone] : null
        return (
          <div
            key={node.id}
            data-slot="flowchart-step"
            ref={(el) => {
              if (el) nodeRefs.current.set(node.id, el)
              else nodeRefs.current.delete(node.id)
            }}
            onPointerDown={onPointerDown(node)}
            onPointerMove={onPointerMove(node)}
            onPointerUp={onPointerUp(node)}
            onPointerCancel={onPointerUp(node)}
            className="absolute flex -translate-x-1/2 touch-none flex-col items-start gap-1.5"
            style={{
              left: cx,
              top,
              width: w,
              zIndex: dragging === node.id ? 2 : 1,
            }}
          >
            {node.kind && kindTone && (
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-md px-2 text-[11.5px] font-medium",
                  kindTone.pill
                )}
                style={kindTone.style}
              >
                {node.kind.label}
              </span>
            )}
            {node.condition ? (
              <div className="w-full rounded-lg border bg-card transition-colors duration-150 hover:border-foreground/25">
                <ConditionBody
                  source={source}
                  properties={properties}
                  values={values}
                  secondaryValues={secondaryValues}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (drag.current?.moved) return
                  select(active ? null : node.id)
                }}
                aria-pressed={active}
                className={cn(
                  "w-full cursor-pointer rounded-lg border bg-card text-left outline-none",
                  "transition-[border-color,box-shadow] duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-ring",
                  active
                    ? "border-brand ring-1 ring-brand"
                    : "hover:border-foreground/25"
                )}
              >
                <StepBody node={node} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { Flowchart }
