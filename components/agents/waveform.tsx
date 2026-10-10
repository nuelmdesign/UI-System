// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A theme token name (`"foreground"`, `"primary"`, `"brand"`, `"muted-foreground"`...)
 * or any CSS color. Token names are read from the CSS variables at draw time,
 * so the canvas follows light, dark and `.dark` sections.
 */
type WaveformColor = string

const TOKEN_NAME = /^[a-z][a-z0-9-]*$/

function resolveColor(element: Element, color: WaveformColor) {
  if (TOKEN_NAME.test(color)) {
    const value = getComputedStyle(element)
      .getPropertyValue(`--${color}`)
      .trim()
    if (value) return value
  }
  return color
}

/** Size the canvas backing store to its box and return a ready 2d context. */
function prepareCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const width = Math.max(0, Math.round(rect.width * dpr))
  const height = Math.max(0, Math.round(rect.height * dpr))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, rect.width, rect.height)
  return { ctx, width: rect.width, height: rect.height }
}

function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (radius > 0) {
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, radius)
    ctx.fill()
  } else {
    ctx.fillRect(x, y, width, height)
  }
}

/** Calls `callback` when the box resizes or the theme class/attributes change. */
function useRedrawOnLayoutOrTheme(
  container: React.RefObject<HTMLElement | null>,
  callback: () => void,
  enabled = true
) {
  React.useEffect(() => {
    const element = container.current
    if (!element || !enabled) return
    const resize = new ResizeObserver(callback)
    resize.observe(element)
    const theme = new MutationObserver(callback)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    })
    return () => {
      resize.disconnect()
      theme.disconnect()
    }
  }, [container, callback, enabled])
}

type WaveformBaseProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Width of one bar in px. */
  barWidth?: number
  /** Minimum bar height in px. */
  barHeight?: number
  /** Gap between bars in px. */
  barGap?: number
  /** Bar corner radius in px. */
  barRadius?: number
  /** Theme token name or CSS color for the bars. */
  barColor?: WaveformColor
  /** Fade the left and right edges out. */
  fadeEdges?: boolean
  /** Width of the edge fade in px. */
  fadeWidth?: number
  /** Container height. Numbers are px. */
  height?: number | string
}

const fadeMask =
  "[mask-image:linear-gradient(to_right,transparent,#000_var(--fade),#000_calc(100%-var(--fade)),transparent)]"

function heightValue(height: number | string) {
  return typeof height === "number" ? `${height}px` : height
}

type WaveformProps = WaveformBaseProps & {
  /** Normalized bar values, 0 to 1. Resampled to fit the available width. */
  data?: number[]
  /** Playback position from 0 to 1. Bars before it use `playedColor`. */
  progress?: number
  /** Theme token name or CSS color for bars already played. */
  playedColor?: WaveformColor
  /** Fires when a bar is clicked. Pointer only; use `AudioScrubber` for keyboard seeking. */
  onBarClick?: (index: number, value: number) => void
  /** Accessible description of the audio. */
  "aria-label"?: string
}

/** Static waveform bars drawn from normalized `data`. */
function Waveform({
  data = [],
  progress,
  barWidth = 4,
  barHeight = 4,
  barGap = 2,
  barRadius = 2,
  barColor = "muted-foreground",
  playedColor = "primary",
  fadeEdges = false,
  fadeWidth = 24,
  height = 128,
  onBarClick,
  className,
  style,
  "aria-label": label = "Audio waveform",
  ...props
}: WaveformProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const prepared = prepareCanvas(canvas)
    if (!prepared) return
    const { ctx, width, height: h } = prepared

    const idle = resolveColor(canvas, barColor)
    const played = resolveColor(canvas, playedColor)
    const step = barWidth + barGap
    const count = Math.max(0, Math.floor((width + barGap) / step))
    const centerY = h / 2

    for (let i = 0; i < count; i++) {
      const value = Math.max(
        0,
        Math.min(1, data[Math.floor((i / count) * data.length)] ?? 0)
      )
      const barH = Math.max(barHeight, value * h * 0.8)
      const isPlayed = progress !== undefined && (i + 0.5) / count <= progress
      ctx.fillStyle = isPlayed ? played : idle
      ctx.globalAlpha = 0.4 + value * 0.6
      drawBar(ctx, i * step, centerY - barH / 2, barWidth, barH, barRadius)
    }
    ctx.globalAlpha = 1
  }, [
    data,
    progress,
    barWidth,
    barHeight,
    barGap,
    barRadius,
    barColor,
    playedColor,
  ])

  React.useEffect(draw, [draw])
  useRedrawOnLayoutOrTheme(containerRef, draw)

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!onBarClick || !canvas || data.length === 0) return
    const rect = canvas.getBoundingClientRect()
    const step = barWidth + barGap
    const count = Math.max(1, Math.floor((rect.width + barGap) / step))
    const bar = Math.min(
      count - 1,
      Math.max(0, Math.floor((event.clientX - rect.left) / step))
    )
    const index = Math.min(
      data.length - 1,
      Math.floor((bar / count) * data.length)
    )
    onBarClick(index, data[index])
  }

  return (
    <div
      ref={containerRef}
      data-slot="waveform"
      role={props["aria-hidden"] ? undefined : "img"}
      aria-label={props["aria-hidden"] ? undefined : label}
      className={cn("relative w-full", fadeEdges && fadeMask, className)}
      style={
        {
          height: heightValue(height),
          "--fade": `${fadeWidth}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onClick={handleClick}
        className={cn("block size-full", onBarClick && "cursor-pointer")}
      />
    </div>
  )
}

type ScrollingWaveformProps = WaveformBaseProps & {
  /** Scroll speed in px per second. */
  speed?: number
  /** Normalized values (0 to 1) fed in from the right, looping. Omit for an ambient pattern. */
  data?: number[]
  /** Pause scrolling while keeping the current frame. */
  active?: boolean
  /** Accessible description of the audio. */
  "aria-label"?: string
}

/** Deterministic pseudo-random value in [0, 1) so the ambient pattern is stable. */
function noise(index: number) {
  const x = Math.sin(index * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Bars scrolling right to left, fed from `data` or an ambient pattern. */
function ScrollingWaveform({
  speed = 50,
  data,
  active = true,
  barWidth = 4,
  barHeight = 4,
  barGap = 2,
  barRadius = 2,
  barColor = "muted-foreground",
  fadeEdges = true,
  fadeWidth = 24,
  height = 128,
  className,
  style,
  "aria-label": label = "Scrolling audio waveform",
  ...props
}: ScrollingWaveformProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const bars = React.useRef<Array<{ x: number; value: number }>>([])
  const cursor = React.useRef(0)
  const reducedMotion = useReducedMotion()

  const draw = React.useCallback(
    (delta: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const prepared = prepareCanvas(canvas)
      if (!prepared) return
      const { ctx, width, height: h } = prepared
      const step = barWidth + barGap
      const list = bars.current

      const nextValue = () => {
        const index = cursor.current++
        if (data && data.length > 0) {
          return Math.max(0.05, Math.min(1, data[index % data.length] ?? 0))
        }
        const wave =
          Math.sin(index * 0.35) * 0.2 + Math.cos(index * 0.13) * 0.15
        return Math.max(0.1, Math.min(0.9, 0.35 + wave + noise(index) * 0.35))
      }

      for (const bar of list) bar.x -= speed * delta
      while (list.length > 0 && list[0].x + barWidth < 0) list.shift()
      // Fill from the right edge back to the left on first paint, then top up on the right.
      if (list.length === 0) {
        for (let x = 0; x < width + step; x += step) {
          list.push({ x, value: nextValue() })
        }
      }
      while (list[list.length - 1].x + step < width + step) {
        list.push({ x: list[list.length - 1].x + step, value: nextValue() })
      }

      ctx.fillStyle = resolveColor(canvas, barColor)
      const centerY = h / 2
      for (const bar of list) {
        const barH = Math.max(barHeight, bar.value * h * 0.6)
        ctx.globalAlpha = 0.4 + bar.value * 0.6
        drawBar(ctx, bar.x, centerY - barH / 2, barWidth, barH, barRadius)
      }
      ctx.globalAlpha = 1
    },
    [barWidth, barGap, barHeight, barRadius, barColor, speed, data]
  )

  const animate = active && !reducedMotion

  React.useEffect(() => {
    if (!animate) return
    let frame = 0
    let last = 0
    const tick = (time: number) => {
      const delta = last ? Math.min(0.1, (time - last) / 1000) : 0
      last = time
      draw(delta)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [animate, draw])

  const redraw = React.useCallback(() => draw(0), [draw])
  React.useEffect(() => {
    if (!animate) redraw()
  }, [animate, redraw])
  useRedrawOnLayoutOrTheme(containerRef, redraw, !animate)

  return (
    <div
      ref={containerRef}
      data-slot="scrolling-waveform"
      role="img"
      aria-label={label}
      className={cn("relative w-full", fadeEdges && fadeMask, className)}
      style={
        {
          height: heightValue(height),
          "--fade": `${fadeWidth}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="block size-full" />
    </div>
  )
}

type AudioScrubberProps = Omit<WaveformProps, "progress" | "onBarClick"> & {
  /** Current playback time, in the same unit as `duration`. */
  currentTime?: number
  /** Total length. */
  duration?: number
  /** Called while scrubbing and on keyboard seeks. */
  onSeek?: (time: number) => void
  /** Amount one arrow key press seeks. Defaults to 5% of `duration`. */
  keyboardStep?: number
  /** Formats the time for assistive tech. */
  formatTime?: (time: number) => string
  /** Show a thin playhead line. */
  showPlayhead?: boolean
}

const defaultFormatTime = (time: number) => {
  const total = Math.max(0, Math.round(time))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

/** A waveform you can click, drag or use arrow keys on to seek. */
function AudioScrubber({
  data = [],
  currentTime = 0,
  duration = 100,
  onSeek,
  keyboardStep,
  formatTime = defaultFormatTime,
  showPlayhead = true,
  barWidth = 3,
  barGap = 1,
  barRadius = 1,
  height = 64,
  className,
  "aria-label": label = "Seek audio",
  ...props
}: AudioScrubberProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [dragProgress, setDragProgress] = React.useState<number | null>(null)

  const safeDuration = duration > 0 ? duration : 0
  const progress =
    dragProgress ??
    (safeDuration ? Math.max(0, Math.min(1, currentTime / safeDuration)) : 0)

  function seekTo(clientX: number) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    const next = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setDragProgress(next)
    onSeek?.(next * safeDuration)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    seekTo(event.clientX)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragProgress !== null) seekTo(event.clientX)
  }

  function handlePointerEnd() {
    setDragProgress(null)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = keyboardStep ?? safeDuration * 0.05
    const keys: Record<string, number> = {
      ArrowRight: currentTime + step,
      ArrowUp: currentTime + step,
      ArrowLeft: currentTime - step,
      ArrowDown: currentTime - step,
      Home: 0,
      End: safeDuration,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    onSeek?.(Math.max(0, Math.min(safeDuration, keys[event.key])))
  }

  return (
    <div
      ref={ref}
      data-slot="audio-scrubber"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={safeDuration}
      aria-valuenow={Math.min(currentTime, safeDuration)}
      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(safeDuration)}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative w-full cursor-pointer touch-none select-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
    >
      <Waveform
        data={data}
        progress={progress}
        barWidth={barWidth}
        barGap={barGap}
        barRadius={barRadius}
        height={height}
        aria-hidden="true"
        {...props}
      />
      {showPlayhead && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-primary"
          style={{ left: `${progress * 100}%` }}
        />
      )}
    </div>
  )
}

export { Waveform, ScrollingWaveform, AudioScrubber }
export type { WaveformProps, ScrollingWaveformProps, AudioScrubberProps }
