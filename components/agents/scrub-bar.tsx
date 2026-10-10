// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Formats seconds as `m:ss`, or `h:mm:ss` from one hour up. */
function formatTimestamp(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00"
  const total = Math.floor(value)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = String(total % 60).padStart(2, "0")
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`
    : `${minutes}:${seconds}`
}

type ScrubBarContextValue = {
  duration: number
  value: number
  /** 0 to 100. */
  progress: number
  onScrub?: (time: number) => void
  onScrubStart?: () => void
  onScrubEnd?: () => void
}

const ScrubBarContext = React.createContext<ScrubBarContextValue | null>(null)

function useScrubBar() {
  const context = React.useContext(ScrubBarContext)
  if (!context) {
    throw new Error("ScrubBar parts must be used within a ScrubBarContainer")
  }
  return context
}

type ScrubBarContainerProps = React.ComponentProps<"div"> & {
  /** Total length in seconds. The bar is disabled while this is 0. */
  duration: number
  /** Current position in seconds. */
  value: number
  /** Called with the new position (seconds) while the user drags or presses a key. */
  onScrub?: (time: number) => void
  /** Called when a pointer drag begins. */
  onScrubStart?: () => void
  /** Called when a pointer drag ends. */
  onScrubEnd?: () => void
}

/** Context root for a seekable scrub bar. Compose with the other `ScrubBar*` parts. */
function ScrubBarContainer({
  duration,
  value,
  onScrub,
  onScrubStart,
  onScrubEnd,
  className,
  children,
  ...props
}: ScrubBarContainerProps) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0
  const clamped = Math.min(
    Math.max(Number.isFinite(value) ? value : 0, 0),
    safeDuration
  )
  const progress = safeDuration > 0 ? (clamped / safeDuration) * 100 : 0

  return (
    <ScrubBarContext.Provider
      value={{
        duration: safeDuration,
        value: clamped,
        progress,
        onScrub,
        onScrubStart,
        onScrubEnd,
      }}
    >
      <div
        data-slot="scrub-bar-root"
        className={cn("flex w-full items-center", className)}
        {...props}
      >
        {children}
      </div>
    </ScrubBarContext.Provider>
  )
}

type ScrubBarTrackProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Accessible name of the seek control. */
  label?: string
  /** Keyboard and drag granularity in seconds. */
  step?: number
  /** Formats the spoken value of the slider. Defaults to `m:ss`. */
  formatValueText?: (time: number) => string
}

/**
 * The seek surface. A transparent native range input sits over the visuals, so
 * pointer, touch and keyboard (arrows, Home, End, PageUp, PageDown) all work
 * with native semantics.
 */
function ScrubBarTrack({
  className,
  children,
  label = "Seek",
  step = 0.25,
  formatValueText = formatTimestamp,
  ...props
}: ScrubBarTrackProps) {
  const { duration, value, onScrub, onScrubStart, onScrubEnd } = useScrubBar()
  const disabled = duration <= 0

  return (
    <div
      data-slot="scrub-bar-track"
      className={cn(
        "group/scrub relative flex h-5 w-full grow items-center",
        className
      )}
      {...props}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 h-1.5 rounded-sm border bg-muted"
      />
      {children}
      <input
        data-slot="scrub-bar-input"
        type="range"
        aria-label={label}
        aria-valuetext={`${formatValueText(value)} of ${formatValueText(duration)}`}
        min={0}
        max={duration}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onScrub?.(Number(event.currentTarget.value))}
        onPointerDown={() => onScrubStart?.()}
        onPointerUp={() => onScrubEnd?.()}
        onPointerCancel={() => onScrubEnd?.()}
        className="absolute inset-0 m-0 size-full cursor-pointer touch-pan-y opacity-0 disabled:cursor-not-allowed"
      />
    </div>
  )
}

/** The filled part of the track. Place inside `ScrubBarTrack`. */
function ScrubBarProgress({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { progress } = useScrubBar()
  return (
    <div
      data-slot="scrub-bar-progress"
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-0 h-1.5 rounded-sm bg-primary",
        className
      )}
      style={{ width: `${progress}%`, ...style }}
      {...props}
    />
  )
}

/** The draggable handle. Place inside `ScrubBarTrack`. Shows a focus ring for keyboard users. */
function ScrubBarThumb({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { progress, duration } = useScrubBar()
  return (
    <div
      data-slot="scrub-bar-thumb"
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-primary bg-background",
        "group-has-[input:focus-visible]/scrub:ring-[3px] group-has-[input:focus-visible]/scrub:ring-ring",
        duration <= 0 && "opacity-50",
        className
      )}
      style={{ left: `${progress}%`, ...style }}
      {...props}
    />
  )
}

type ScrubBarTimeLabelProps = React.ComponentProps<"span"> & {
  /** Seconds to display. */
  time: number
  format?: (time: number) => string
}

/** A formatted time in tabular mono digits. */
function ScrubBarTimeLabel({
  className,
  time,
  format = formatTimestamp,
  ...props
}: ScrubBarTimeLabelProps) {
  return (
    <span
      data-slot="scrub-bar-time-label"
      className={cn(
        "font-mono text-xs text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {format(time)}
    </span>
  )
}

type ScrubBarProps = Omit<ScrubBarContainerProps, "children"> & {
  /** Show elapsed and remaining time under the track. Defaults to true. */
  showTimeLabels?: boolean
  /** Show remaining time (`-0:12`) instead of total duration on the right. */
  showRemaining?: boolean
  /** Accessible name of the seek control. */
  label?: string
  step?: number
}

/** A ready-made scrub bar: track, fill, thumb and time labels. */
function ScrubBar({
  showTimeLabels = true,
  showRemaining = false,
  label,
  step,
  className,
  ...props
}: ScrubBarProps) {
  return (
    <ScrubBarContainer
      className={cn("flex-col items-stretch gap-1", className)}
      {...props}
    >
      <ScrubBarTrack label={label} step={step}>
        <ScrubBarProgress />
        <ScrubBarThumb />
      </ScrubBarTrack>
      {showTimeLabels && (
        <div className="flex items-center justify-between">
          <ScrubBarTimeLabel time={props.value} />
          <ScrubBarTimeLabel
            time={showRemaining ? props.duration - props.value : props.duration}
            format={showRemaining ? (t) => `-${formatTimestamp(t)}` : undefined}
          />
        </div>
      )}
    </ScrubBarContainer>
  )
}

export {
  ScrubBar,
  ScrubBarContainer,
  ScrubBarTrack,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
  formatTimestamp,
}
export type {
  ScrubBarProps,
  ScrubBarContainerProps,
  ScrubBarTrackProps,
  ScrubBarTimeLabelProps,
}
