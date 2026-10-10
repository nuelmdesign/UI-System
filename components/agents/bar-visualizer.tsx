// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/** What the voice agent is doing. Drives the highlight pattern. */
type BarVisualizerState =
  "connecting" | "initializing" | "listening" | "speaking" | "thinking"

type MultibandVolumeOptions = {
  /** Number of bands to produce. */
  bands?: number
  /** First FFT bin of the analysed slice. */
  loPass?: number
  /** Last FFT bin (exclusive) of the analysed slice. */
  hiPass?: number
  /** Minimum milliseconds between updates. */
  updateInterval?: number
  /** AnalyserNode FFT size (power of two). */
  fftSize?: number
  /** AnalyserNode smoothing, 0 to 1. */
  smoothingTimeConstant?: number
}

const NO_LEVELS: number[] = []

// Map decibels (-100..-10) onto 0..1 with a square root for a livelier low end.
const normalizeDb = (value: number) => {
  if (!Number.isFinite(value)) return 0
  const db = 1 - Math.abs(Math.max(-100, Math.min(-10, value))) / 100
  return Math.sqrt(db)
}

/**
 * Splits a MediaStream into per-band levels (0 to 1) with the Web Audio API.
 * The AudioContext is closed and the animation frame cancelled on cleanup;
 * the stream itself stays owned by the caller.
 */
function useMultibandVolume(
  mediaStream?: MediaStream | null,
  {
    bands = 5,
    loPass = 100,
    hiPass = 200,
    updateInterval = 32,
    fftSize = 2048,
    smoothingTimeConstant,
  }: MultibandVolumeOptions = {}
) {
  const [levels, setLevels] = React.useState<number[]>(NO_LEVELS)

  React.useEffect(() => {
    if (!mediaStream || typeof AudioContext === "undefined") return
    let frame = 0
    let last = 0
    let previous: number[] = []
    let context: AudioContext
    try {
      context = new AudioContext()
    } catch {
      return
    }
    const analyser = context.createAnalyser()
    analyser.fftSize = fftSize
    if (smoothingTimeConstant !== undefined) {
      analyser.smoothingTimeConstant = smoothingTimeConstant
    }
    const source = context.createMediaStreamSource(mediaStream)
    source.connect(analyser)

    const data = new Float32Array(analyser.frequencyBinCount)
    const start = Math.max(0, loPass)
    const end = Math.min(data.length, Math.max(start + 1, hiPass))
    const chunk = Math.max(1, Math.ceil((end - start) / bands))

    const tick = (time: number) => {
      if (time - last >= updateInterval) {
        last = time
        analyser.getFloatFrequencyData(data)
        const next = Array.from({ length: bands }, (_, band) => {
          const from = start + band * chunk
          const to = Math.min(from + chunk, end)
          let sum = 0
          for (let i = from; i < to; i++) sum += normalizeDb(data[i])
          return to > from ? sum / (to - from) : 0
        })
        if (
          next.length !== previous.length ||
          next.some((value, i) => Math.abs(value - previous[i]) > 0.01)
        ) {
          previous = next
          setLevels(next)
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      source.disconnect()
      void context.close()
    }
  }, [
    mediaStream,
    bands,
    loPass,
    hiPass,
    updateInterval,
    fftSize,
    smoothingTimeConstant,
  ])

  return mediaStream ? levels : NO_LEVELS
}

/** Which bar indices are highlighted at each step of the state's animation. */
function highlightSequence(
  state: BarVisualizerState | undefined,
  columns: number
): number[][] {
  if (state === "thinking" || state === "listening") {
    return [[Math.floor(columns / 2)], []]
  }
  if (state === "connecting" || state === "initializing") {
    return Array.from({ length: columns }, (_, x) => [x, columns - 1 - x])
  }
  return [Array.from({ length: columns }, (_, i) => i)]
}

/** Returns the highlighted bar indices, stepping through the state's sequence. */
function useBarAnimator(
  state: BarVisualizerState | undefined,
  columns: number,
  interval: number,
  paused = false
) {
  const sequence = React.useMemo(
    () => highlightSequence(state, columns),
    [state, columns]
  )
  const key = `${state}:${columns}`
  const [ticks, setTicks] = React.useState({ key, count: 0 })

  React.useEffect(() => {
    if (paused || sequence.length < 2) return
    const timer = window.setInterval(() => {
      setTicks((current) => ({
        key,
        count: current.key === key ? current.count + 1 : 1,
      }))
    }, interval)
    return () => window.clearInterval(timer)
  }, [key, sequence, interval, paused])

  const count = ticks.key === key ? ticks.count : 0
  return sequence[paused ? 0 : count % sequence.length] ?? []
}

type BarVisualizerProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Agent state. Controls which bars light up. */
  state?: BarVisualizerState
  /** Number of bars. Ignored when `levels` is provided. */
  barCount?: number
  /** Per-bar levels, 0 to 1. Takes priority over `mediaStream` and `volume`. */
  levels?: number[]
  /** A single overall level, 0 to 1, shaped into a centred bell across the bars. */
  volume?: number
  /** Optional caller-owned stream to analyse. It is never stopped here. */
  mediaStream?: MediaStream | null
  /** Smallest bar height, as a percentage of the container. */
  minHeight?: number
  /** Largest bar height, as a percentage of the container. */
  maxHeight?: number
  /** Align bars to the vertical centre instead of the bottom. */
  centerAlign?: boolean
  /** Accessible name. Defaults to the current state. */
  "aria-label"?: string
}

const stateLabel: Record<BarVisualizerState, string> = {
  connecting: "Connecting",
  initializing: "Initializing",
  listening: "Listening",
  speaking: "Speaking",
  thinking: "Thinking",
}

const stateInterval = (
  state: BarVisualizerState | undefined,
  barCount: number
) =>
  state === "connecting"
    ? 2000 / barCount
    : state === "thinking"
      ? 150
      : state === "listening"
        ? 500
        : 1000

/** Frequency or volume bars that react to an agent's state and audio level. */
function BarVisualizer({
  state,
  barCount = 15,
  levels,
  volume = 0,
  mediaStream,
  minHeight = 20,
  maxHeight = 100,
  centerAlign = false,
  className,
  "aria-label": label,
  ...props
}: BarVisualizerProps) {
  const reducedMotion = useReducedMotion()
  const count = levels?.length ?? barCount
  const streamLevels = useMultibandVolume(levels ? null : mediaStream, {
    bands: count,
  })

  const bars = React.useMemo(() => {
    if (levels) return levels
    if (streamLevels.length === count) return streamLevels
    const level = Math.max(0, Math.min(1, volume))
    const half = Math.max(1, (count - 1) / 2)
    return Array.from({ length: count }, (_, i) => {
      const position = (i - (count - 1) / 2) / half
      return level * (1 - Math.abs(position) * 0.6)
    })
  }, [levels, streamLevels, volume, count])

  const highlighted = useBarAnimator(
    state,
    count,
    stateInterval(state, count),
    reducedMotion ?? false
  )

  return (
    <div
      data-slot="bar-visualizer"
      data-state={state}
      role="img"
      aria-label={
        label ??
        (state ? `Voice activity: ${stateLabel[state]}` : "Voice activity")
      }
      className={cn(
        "relative flex h-32 w-full justify-center gap-1.5 overflow-hidden rounded-lg bg-muted p-4",
        centerAlign ? "items-center" : "items-end",
        className
      )}
      {...props}
    >
      {bars.map((level, index) => {
        const heightPct = Math.min(
          maxHeight,
          Math.max(minHeight, Math.max(0, Math.min(1, level)) * 100 + 5)
        )
        const lit = highlighted.includes(index)
        return (
          <div
            key={index}
            aria-hidden="true"
            data-highlighted={lit}
            className={cn(
              "max-w-3 min-w-2 flex-1 rounded-sm transition-[height,background-color] duration-150 ease-out",
              lit || state === "speaking" ? "bg-primary" : "bg-border",
              state === "thinking" && lit && "animate-pulse"
            )}
            style={{ height: `${heightPct}%` }}
          />
        )
      })}
    </div>
  )
}

export { BarVisualizer, useBarAnimator, useMultibandVolume }
export type { BarVisualizerProps, BarVisualizerState, MultibandVolumeOptions }
