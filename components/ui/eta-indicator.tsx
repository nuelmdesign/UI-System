"use client"

import * as React from "react"
import {
  CircleAlert,
  CircleHelp,
  Clock,
  ShieldCheck,
  TimerOff,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"

type EtaConfidenceLevel = "high" | "medium" | "low"

type EtaLabels = {
  eta: string
  earliest: string
  latest: string
  confidence: string
  high: string
  medium: string
  low: string
  stale: string
  late: string
  unknown: string
  /** "Updated 12 min ago" */
  updated: (ago: string) => string
}

const defaultLabels: EtaLabels = {
  eta: "Estimated arrival",
  earliest: "Earliest",
  latest: "Latest",
  confidence: "Confidence",
  high: "High",
  medium: "Medium",
  low: "Low",
  stale: "Stale",
  late: "Past window",
  unknown: "Unknown",
  updated: (ago) => `Updated ${ago}`,
}

type DateInput = string | number | Date

type EtaIndicatorProps = Omit<React.ComponentProps<"div">, "children"> & {
  eta: DateInput
  /** Start of the plausible window. Pair with `latest` to show the range bar. */
  earliest?: DateInput
  latest?: DateInput
  /** 0 to 1. */
  confidence?: number
  /** `confidence` at or above these values reads as high / medium. */
  confidenceLevels?: { high: number; medium: number }
  /** When the estimate was last refreshed. */
  updatedAt?: DateInput
  /** Current time. Pass it for tests and stories; otherwise it ticks each minute. */
  now?: DateInput
  /** Estimates older than this are marked stale. Defaults to 15 minutes. */
  staleAfterMs?: number
  /** IANA zone, e.g. "Europe/Berlin". Defaults to the viewer's zone. */
  timeZone?: string
  locale?: string
  /** Show the zone abbreviation next to times. Defaults to true. */
  showTimeZone?: boolean
  /** What is being estimated, e.g. "Delivery", "Doctor arrives". */
  title?: React.ReactNode
  labels?: Partial<EtaLabels>
}

const TICK_MS = 60_000

function subscribeMinute(onChange: () => void) {
  const id = setInterval(onChange, TICK_MS)
  return () => clearInterval(id)
}

function minuteSnapshot() {
  return Math.floor(Date.now() / TICK_MS) * TICK_MS
}

function serverSnapshot() {
  return null
}

/** Current time as epoch ms, refreshed each minute. `null` until hydrated. */
function useMinuteNow(): number | null {
  return React.useSyncExternalStore(
    subscribeMinute,
    minuteSnapshot,
    serverSnapshot
  )
}

function toMs(input: DateInput | undefined): number | null {
  if (input === undefined) return null
  const ms = new Date(input).getTime()
  return Number.isNaN(ms) ? null : ms
}

function relative(deltaMs: number, locale?: string) {
  const fmt = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  const mins = Math.round(deltaMs / 60_000)
  if (Math.abs(mins) < 60) return fmt.format(mins, "minute")
  const hours = Math.round(mins / 60)
  if (Math.abs(hours) < 48) return fmt.format(hours, "hour")
  return fmt.format(Math.round(hours / 24), "day")
}

const levelIcon = {
  high: ShieldCheck,
  medium: CircleAlert,
  low: CircleHelp,
} as const

const levelVariant = {
  high: "success",
  medium: "warning",
  low: "destructive",
} as const

function EtaIndicator({
  eta,
  earliest,
  latest,
  confidence,
  confidenceLevels = { high: 0.75, medium: 0.5 },
  updatedAt,
  now: nowProp,
  staleAfterMs = 15 * 60_000,
  timeZone,
  locale,
  showTimeZone = true,
  title,
  labels: labelsProp,
  className,
  ...props
}: EtaIndicatorProps) {
  const labels = { ...defaultLabels, ...labelsProp }
  const reduceMotion = useReducedMotion()
  const tickNow = useMinuteNow()
  const nowMs = toMs(nowProp) ?? tickNow

  const etaMs = toMs(eta)
  const lo = toMs(earliest)
  const hi = toMs(latest)
  const updatedMs = toMs(updatedAt)

  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
    timeZoneName: showTimeZone ? "short" : undefined,
  })
  const dayFmt = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  })
  const dayKey = (ms: number) =>
    new Intl.DateTimeFormat("en-CA", { timeZone }).format(ms)

  const fmtTime = (ms: number | null) =>
    ms === null ? "—" : timeFmt.format(ms)
  const showDay = (ms: number | null) =>
    ms !== null && nowMs !== null && dayKey(ms) !== dayKey(nowMs)

  const stale =
    nowMs !== null && updatedMs !== null && nowMs - updatedMs > staleAfterMs
  const windowEnd = hi ?? etaMs
  const late = nowMs !== null && windowEnd !== null && nowMs > windowEnd

  const level: EtaConfidenceLevel | null =
    confidence === undefined
      ? null
      : confidence >= confidenceLevels.high
        ? "high"
        : confidence >= confidenceLevels.medium
          ? "medium"
          : "low"
  const LevelIcon = level ? levelIcon[level] : null

  const hasRange = lo !== null && hi !== null && hi > lo && etaMs !== null
  const pos = hasRange
    ? Math.min(Math.max(((etaMs - lo) / (hi - lo)) * 100, 0), 100)
    : 0

  const updatedText =
    nowMs !== null && updatedMs !== null
      ? labels.updated(relative(updatedMs - nowMs, locale))
      : null

  return (
    <div
      data-slot="eta-indicator"
      data-stale={stale ? "" : undefined}
      data-late={late ? "" : undefined}
      role="group"
      aria-label={typeof title === "string" ? title : labels.eta}
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="eyebrow text-muted-foreground">
          {title ?? labels.eta}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {late && (
            <Badge variant="destructive" data-slot="eta-late">
              <TimerOff aria-hidden />
              {labels.late}
            </Badge>
          )}
          {stale && (
            <Badge variant="warning" data-slot="eta-stale">
              <Clock aria-hidden />
              {labels.stale}
            </Badge>
          )}
        </div>
      </div>

      <div
        aria-live="polite"
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
      >
        <span
          data-slot="eta-time"
          className={cn(
            "heading text-3xl tabular-nums",
            stale && "text-muted-foreground"
          )}
        >
          {fmtTime(etaMs)}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {showDay(etaMs) && etaMs !== null && <>{dayFmt.format(etaMs)} · </>}
          {nowMs !== null && etaMs !== null && relative(etaMs - nowMs, locale)}
        </span>
      </div>

      {hasRange && (
        <div data-slot="eta-range" className="flex flex-col gap-1.5">
          <div
            role="img"
            aria-label={`${labels.earliest} ${fmtTime(lo)}, ${labels.eta} ${fmtTime(etaMs)}, ${labels.latest} ${fmtTime(hi)}`}
            className="relative h-1.5 rounded-sm bg-brand/25"
          >
            <motion.span
              aria-hidden
              className="absolute top-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-foreground"
              initial={false}
              animate={{ left: `${pos}%` }}
              transition={reduceMotion ? { duration: 0 } : spring.smooth}
            />
          </div>
          <div className="flex justify-between gap-2 font-mono text-xs text-muted-foreground tabular-nums">
            <span>
              <span className="sr-only">{labels.earliest} </span>
              {fmtTime(lo)}
            </span>
            <span>
              <span className="sr-only">{labels.latest} </span>
              {fmtTime(hi)}
            </span>
          </div>
        </div>
      )}

      {(level || updatedText) && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t pt-3">
          {level && LevelIcon && confidence !== undefined && (
            <Badge variant={levelVariant[level]} data-slot="eta-confidence">
              <LevelIcon aria-hidden />
              <span className="sr-only">{labels.confidence}: </span>
              {labels[level]}
              <span className="font-mono tabular-nums">
                {Math.round(confidence * 100)}%
              </span>
            </Badge>
          )}
          {updatedText && (
            <span className="font-mono text-xs text-muted-foreground">
              {updatedText}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export { EtaIndicator, useMinuteNow }
export type { EtaIndicatorProps, EtaLabels, EtaConfidenceLevel }
