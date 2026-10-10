// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type LiveWaveformMode = "static" | "scrolling"

type LiveWaveformProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onError"
> & {
  /** Capture the microphone and draw it. When false the tracks are stopped and the bars settle to idle. */
  active?: boolean
  /** Show a synthetic "thinking" wave while the microphone is off. */
  processing?: boolean
  /** Specific input device from `enumerateDevices()`. */
  deviceId?: string
  /** `static` mirrors the spectrum around the centre; `scrolling` scrolls recent loudness right to left. */
  mode?: LiveWaveformMode
  /** Width of one bar in px. */
  barWidth?: number
  /** Gap between bars in px. */
  barGap?: number
  /** Minimum bar height in px. */
  barHeight?: number
  /** Bar corner radius in px. */
  barRadius?: number
  /**
   * Theme token name (`"foreground"`, `"primary"`, `"brand"`, `"muted-foreground"`...)
   * or any CSS color. Tokens are read from the CSS variables on every frame.
   */
  barColor?: string
  /** Fade the left and right edges out. */
  fadeEdges?: boolean
  /** Width of the edge fade in px. */
  fadeWidth?: number
  /** Container height. Numbers are px. */
  height?: number | string
  /** Multiplier applied to the measured level. */
  sensitivity?: number
  /** AnalyserNode smoothing, 0 to 1. */
  smoothingTimeConstant?: number
  /** AnalyserNode FFT size (power of two). */
  fftSize?: number
  /** Number of samples kept in `scrolling` mode. */
  historySize?: number
  /** Minimum milliseconds between audio samples. */
  updateRate?: number
  /** Called when the microphone is unsupported, blocked or fails. */
  onError?: (error: Error) => void
  /** Called with the live stream once the microphone is open. */
  onStreamReady?: (stream: MediaStream) => void
  /** Called after the stream has been stopped. */
  onStreamEnd?: () => void
  /** Accessible name. Defaults to a description of the current state. */
  "aria-label"?: string
}

type MicStatus = "idle" | "ready" | "denied" | "error"

const TOKEN_NAME = /^[a-z][a-z0-9-]*$/

function resolveColor(element: Element, color: string) {
  if (TOKEN_NAME.test(color)) {
    const value = getComputedStyle(element)
      .getPropertyValue(`--${color}`)
      .trim()
    if (value) return value
  }
  return color
}

const noopSubscribe = () => () => {}

function micSupported() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    (typeof window.AudioContext === "function" ||
      "webkitAudioContext" in window)
  )
}

/** True when the browser can capture a microphone. Assumed true on the server. */
function useMicSupported() {
  return React.useSyncExternalStore(noopSubscribe, micSupported, () => true)
}

/** The ambient wave shown while `processing`. `position` is -1 to 1. */
function processingLevel(time: number, position: number) {
  const centerWeight = 1 - Math.abs(position) * 0.4
  const wave =
    Math.sin(time * 1.5 + position * 3) * 0.25 +
    Math.sin(time * 0.8 - position * 2) * 0.2 +
    Math.cos(time * 2 + position) * 0.15
  return Math.max(0.05, Math.min(1, (0.2 + wave) * centerWeight))
}

const fadeMask =
  "[mask-image:linear-gradient(to_right,transparent,#000_var(--fade),#000_calc(100%-var(--fade)),transparent)]"

/**
 * Microphone-driven canvas waveform. Handles unsupported browsers and denied
 * permission, stops every track on unmount and when `active` turns false.
 */
function LiveWaveform({
  active = false,
  processing = false,
  deviceId,
  mode = "static",
  barWidth = 3,
  barGap = 1,
  barHeight = 4,
  barRadius = 1.5,
  barColor = "foreground",
  fadeEdges = true,
  fadeWidth = 24,
  height = 64,
  sensitivity = 1,
  smoothingTimeConstant = 0.8,
  fftSize = 256,
  historySize = 60,
  updateRate = 30,
  onError,
  onStreamReady,
  onStreamEnd,
  className,
  style,
  "aria-label": label,
  ...props
}: LiveWaveformProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const analyserRef = React.useRef<AnalyserNode | null>(null)
  const valuesRef = React.useRef<number[]>([])
  const reducedMotion = useReducedMotion()
  const supported = useMicSupported()
  const [status, setStatus] = React.useState<MicStatus>("idle")

  // The draw loop and microphone effect read the latest props through a ref,
  // so changing a callback or style prop never restarts capture.
  const latest = React.useRef({
    mode,
    barWidth,
    barGap,
    barHeight,
    barRadius,
    barColor,
    sensitivity,
    historySize,
    updateRate,
    reducedMotion,
    onError,
    onStreamReady,
    onStreamEnd,
  })
  React.useLayoutEffect(() => {
    latest.current = {
      mode,
      barWidth,
      barGap,
      barHeight,
      barRadius,
      barColor,
      sensitivity,
      historySize,
      updateRate,
      reducedMotion,
      onError,
      onStreamReady,
      onStreamEnd,
    }
  })

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const pixelW = Math.max(0, Math.round(rect.width * dpr))
    const pixelH = Math.max(0, Math.round(rect.height * dpr))
    if (canvas.width !== pixelW) canvas.width = pixelW
    if (canvas.height !== pixelH) canvas.height = pixelH
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)

    const o = latest.current
    const step = o.barWidth + o.barGap
    const count = Math.max(0, Math.floor((rect.width + o.barGap) / step))
    const values = valuesRef.current
    ctx.fillStyle = resolveColor(canvas, o.barColor)
    const centerY = rect.height / 2
    // Scrolling mode is right-aligned, static mode fills from the left.
    const offset = o.mode === "scrolling" ? count - values.length : 0

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      const slot = i + offset
      if (value <= 0.01 || slot < 0 || slot >= count) continue
      const h = Math.max(o.barHeight, value * rect.height * 0.8)
      ctx.globalAlpha = 0.4 + value * 0.6
      ctx.beginPath()
      ctx.roundRect(slot * step, centerY - h / 2, o.barWidth, h, o.barRadius)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }, [])

  // Redraw on resize and on theme changes while the loop is not running.
  React.useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const resize = new ResizeObserver(draw)
    resize.observe(element)
    const theme = new MutationObserver(draw)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })
    return () => {
      resize.disconnect()
      theme.disconnect()
    }
  }, [draw])

  // Microphone lifecycle. Cleanup stops every track, so it also covers `active`
  // turning false and unmount, including a request that resolves late.
  React.useEffect(() => {
    if (!active) return
    let cancelled = false
    let stream: MediaStream | null = null
    let context: AudioContext | null = null

    async function start() {
      if (!micSupported()) {
        latest.current.onError?.(
          new Error("Microphone capture is not supported in this browser.")
        )
        return
      }
      try {
        const audio: MediaTrackConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
        }
        const opened = await navigator.mediaDevices.getUserMedia({ audio })
        if (cancelled) {
          opened.getTracks().forEach((track) => track.stop())
          return
        }
        stream = opened
        const Context =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        context = new Context()
        const analyser = context.createAnalyser()
        analyser.fftSize = fftSize
        analyser.smoothingTimeConstant = smoothingTimeConstant
        context.createMediaStreamSource(opened).connect(analyser)
        void context.resume().catch(() => {})
        analyserRef.current = analyser
        valuesRef.current = []
        setStatus("ready")
        latest.current.onStreamReady?.(opened)
      } catch (failure) {
        if (cancelled) return
        const error =
          failure instanceof Error ? failure : new Error(String(failure))
        const denied =
          error.name === "NotAllowedError" || error.name === "SecurityError"
        setStatus(denied ? "denied" : "error")
        latest.current.onError?.(error)
      }
    }
    void start()

    return () => {
      cancelled = true
      analyserRef.current = null
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        latest.current.onStreamEnd?.()
      }
      if (context && context.state !== "closed") void context.close()
    }
  }, [active, deviceId, fftSize, smoothingTimeConstant])

  // Draw loop. Runs while listening or processing, then eases to idle and stops.
  React.useEffect(() => {
    let frame = 0
    let lastSample = 0
    const live = active || processing

    const tick = (now: number) => {
      const o = latest.current
      const canvas = canvasRef.current
      const width = canvas?.getBoundingClientRect().width ?? 0
      const step = o.barWidth + o.barGap
      const count = Math.max(0, Math.floor((width + o.barGap) / step))
      const analyser = active ? analyserRef.current : null
      const time = o.reducedMotion ? 0 : now / 1000
      let values = valuesRef.current

      if (analyser && now - lastSample >= o.updateRate) {
        lastSample = now
        const bins = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(bins)
        const from = Math.floor(bins.length * 0.05)
        const to = Math.max(from + 1, Math.floor(bins.length * 0.4))
        const band = bins.subarray(from, to)

        if (o.mode === "static") {
          const half = Math.floor(count / 2)
          const next: number[] = []
          const at = (i: number) =>
            Math.max(
              0.05,
              Math.min(
                1,
                (band[Math.floor((i / Math.max(1, half)) * band.length)] /
                  255) *
                  o.sensitivity
              )
            )
          for (let i = half - 1; i >= 0; i--) next.push(at(i))
          for (let i = 0; i < half; i++) next.push(at(i))
          values = next
        } else {
          let sum = 0
          for (let i = 0; i < band.length; i++) sum += band[i]
          const level = (sum / band.length / 255) * o.sensitivity
          values = [...values, Math.max(0.05, Math.min(1, level))].slice(
            -Math.min(o.historySize, Math.max(1, count))
          )
        }
        valuesRef.current = values
      } else if (!analyser) {
        // Processing wave or decay to idle, eased from whatever is on screen.
        const length =
          o.mode === "static" ? count : Math.min(count, o.historySize)
        const next: number[] = []
        for (let i = 0; i < length; i++) {
          const target = processing
            ? processingLevel(time, (i - length / 2) / Math.max(1, length / 2))
            : 0
          const current = values[i] ?? 0
          next.push(current + (target - current) * (processing ? 0.12 : 0.15))
        }
        values = next
        valuesRef.current = values
      }

      draw()

      const settled = !live && values.every((value) => value <= 0.01)
      if (settled) {
        valuesRef.current = []
        draw()
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, processing, draw])

  const idle = !active && !processing
  const message =
    active && !supported
      ? "Microphone not supported"
      : active && status === "denied"
        ? "Microphone access blocked"
        : active && status === "error"
          ? "Microphone unavailable"
          : null

  const name =
    label ??
    (message
      ? message
      : active
        ? "Live audio waveform"
        : processing
          ? "Processing audio"
          : "Audio waveform idle")

  return (
    <div
      ref={containerRef}
      data-slot="live-waveform"
      data-state={
        message
          ? "error"
          : active
            ? "active"
            : processing
              ? "processing"
              : "idle"
      }
      role="img"
      aria-label={name}
      className={cn("relative w-full", fadeEdges && fadeMask, className)}
      style={
        {
          height: typeof height === "number" ? `${height}px` : height,
          "--fade": `${fadeWidth}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {idle && !message && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-2 border-dotted border-border"
        />
      )}
      {message && (
        <p
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-center eyebrow text-muted-foreground"
        >
          {message}
        </p>
      )}
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </div>
  )
}

export { LiveWaveform }
export type { LiveWaveformProps, LiveWaveformMode }
