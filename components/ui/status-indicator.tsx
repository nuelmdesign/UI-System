import * as React from "react"

import { cn } from "@/lib/utils"

type StatusKind =
  "operational" | "degraded" | "down" | "maintenance" | "unknown"
type StatusTone = "success" | "warning" | "destructive" | "brand" | "muted"
type StatusShape = "dot" | "half" | "ring" | "square" | "dash"

const statusMeta: Record<
  StatusKind,
  { label: string; tone: StatusTone; shape: StatusShape }
> = {
  operational: { label: "Operational", tone: "success", shape: "dot" },
  degraded: { label: "Degraded", tone: "warning", shape: "half" },
  down: { label: "Down", tone: "destructive", shape: "ring" },
  maintenance: { label: "Maintenance", tone: "brand", shape: "square" },
  unknown: { label: "Unknown", tone: "muted", shape: "dash" },
}

const toneText: Record<StatusTone, string> = {
  success: "text-success",
  warning: "text-[color-mix(in_oklch,var(--warning)_80%,var(--foreground))]",
  destructive: "text-destructive",
  brand: "text-brand",
  muted: "text-muted-foreground",
}

const toneBg: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  brand: "bg-brand",
  muted: "bg-muted-foreground/30",
}

function ShapeGlyph({ shape }: { shape: StatusShape }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className="size-full overflow-visible"
      fill="currentColor"
    >
      {shape === "dot" && <circle cx="6" cy="6" r="5" />}
      {shape === "half" && (
        <>
          <circle
            cx="6"
            cy="6"
            r="4.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M6 1.75a4.25 4.25 0 0 1 0 8.5Z" />
        </>
      )}
      {shape === "ring" && (
        <circle
          cx="6"
          cy="6"
          r="4.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
      {shape === "square" && <rect x="1.5" y="1.5" width="9" height="9" />}
      {shape === "dash" && <rect x="1" y="5" width="10" height="2" />}
    </svg>
  )
}

type StatusIndicatorProps = Omit<React.ComponentProps<"span">, "children"> & {
  status?: StatusKind
  /** Override the colour tone (for custom statuses). */
  tone?: StatusTone
  /** Override the label text. */
  label?: React.ReactNode
  /** Shape for custom statuses; defaults to the status shape. */
  shape?: StatusShape
  /** Visually hide the label (kept for screen readers). */
  hideLabel?: boolean
  /** Animate a soft halo for live states. Respects reduced motion. */
  pulse?: boolean
}

function StatusIndicator({
  className,
  status = "unknown",
  tone,
  label,
  shape,
  hideLabel = false,
  pulse = false,
  ...props
}: StatusIndicatorProps) {
  const meta = statusMeta[status]
  const t = tone ?? meta.tone
  const s = shape ?? meta.shape

  return (
    <span
      data-slot="status-indicator"
      data-status={status}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn("relative inline-flex size-3 shrink-0", toneText[t])}
      >
        {pulse && (
          <span
            className={cn(
              "absolute inset-0 rounded-full opacity-40 motion-safe:animate-ping",
              toneBg[t]
            )}
          />
        )}
        <span className="relative size-full">
          <ShapeGlyph shape={s} />
        </span>
      </span>
      <span className={cn(hideLabel && "sr-only")}>{label ?? meta.label}</span>
    </span>
  )
}

type UptimeSegment = { status: StatusKind; label?: string }

type UptimeBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  segments: UptimeSegment[]
  /** Percent text, e.g. "99.98%". Shown in mono beside the bar. */
  uptime?: React.ReactNode
  /** Name used in the accessible summary, e.g. "API gateway". */
  name?: string
  /** Unit for the accessible summary. */
  unit?: string
}

function UptimeBar({
  className,
  segments,
  uptime,
  name,
  unit = "periods",
  ...props
}: UptimeBarProps) {
  const known = segments.filter((s) => s.status !== "unknown")
  const ok = known.filter((s) => s.status === "operational").length
  const pct = known.length ? (ok / known.length) * 100 : 0
  const down = segments.filter((s) => s.status === "down").length
  const degraded = segments.filter((s) => s.status === "degraded").length
  const summary = `${name ? `${name}: ` : ""}${pct.toFixed(2)}% operational over ${segments.length} ${unit}, ${down} down, ${degraded} degraded`

  return (
    <div
      data-slot="uptime-bar"
      className={cn("flex w-full items-center gap-3", className)}
      {...props}
    >
      <div
        role="img"
        aria-label={summary}
        className="flex h-8 min-w-0 flex-1 items-stretch gap-px"
      >
        {segments.map((seg, i) => (
          <span
            key={i}
            data-status={seg.status}
            title={seg.label ?? statusMeta[seg.status].label}
            className={cn(
              "min-w-[2px] flex-1 rounded-[1px] transition-opacity hover:opacity-70",
              toneBg[statusMeta[seg.status].tone]
            )}
          />
        ))}
      </div>
      {uptime != null && (
        <span className="shrink-0 font-mono text-sm tabular-nums">
          {uptime}
        </span>
      )}
    </div>
  )
}

export {
  StatusIndicator,
  UptimeBar,
  statusMeta,
  type StatusIndicatorProps,
  type StatusKind,
  type StatusTone,
  type UptimeBarProps,
  type UptimeSegment,
}
