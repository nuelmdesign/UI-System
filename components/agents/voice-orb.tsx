// Adapted from beUI (https://beui.dev), MIT © 2026 Saurabh Chauhan.
"use client"

import * as React from "react"
import {
  isMotionValue,
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"
import { createOrbRenderer } from "@/components/agents/voice-orb/renderer"

type OrbColors = readonly [base: string, highlight: string, shadow: string]

/**
 * Pigment presets as [base, highlight, shadow] hex colors.
 * WebGL needs hex, so these are hand-matched to the theme tokens.
 */
const ORB_PALETTES = {
  /** Matches --brand. */
  brand: ["#5b5fe0", "#dfe1ff", "#1e1b4b"],
  /** Neutral graphite, Linear / Vercel style. */
  graphite: ["#8a8f98", "#f4f5f7", "#1c1d21"],
  /** Matches --success. */
  mint: ["#2fb38a", "#d8fff0", "#0f3d4a"],
  /** beUI's original warm pigment. */
  ember: ["#e8754d", "#ffe0ac", "#346b52"],
} as const satisfies Record<string, OrbColors>

type VoiceOrbProps = Omit<React.ComponentProps<"div">, "children" | "onError"> & {
  /** Normalized activity, 0 to 1. Pass a MotionValue to avoid re-rendering every frame. */
  activity?: number | MotionValue<number>
  /** Optional caller-owned audio analyser. The orb never requests a microphone itself. */
  analyser?: AnalyserNode | null
  /** A preset name or [base, highlight, shadow] as #RGB / #RRGGBB hex. */
  colors?: keyof typeof ORB_PALETTES | OrbColors
  /** Pause the surface while keeping the current frame visible. */
  active?: boolean
  speed?: number
  onError?: (error: Error) => void
}

const clampLevel = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0

/** A grainy liquid sphere whose surface and silhouette respond to voice activity. */
function VoiceOrb({
  activity = 0,
  analyser = null,
  colors = "brand",
  active = true,
  speed = 1,
  onError,
  className,
  "aria-label": label,
  ...props
}: VoiceOrbProps) {
  const palette = typeof colors === "string" ? ORB_PALETTES[colors] : colors
  const reducedMotion = useReducedMotion()
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const renderer = React.useRef<ReturnType<typeof createOrbRenderer> | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  const target = useMotionValue(0)
  const smooth = useSpring(target, spring.glide)
  const transform = useTransform(
    smooth,
    (v) => `translate3d(0, ${-v * 2}px, 0) scale(${1 + v * 0.04}, ${1 - v * 0.018})`
  )

  // The render loop reads the latest props through a ref, so it never restarts.
  const latest = React.useRef({
    activity,
    analyser,
    palette,
    active,
    speed,
    reducedMotion,
    onError,
  })
  React.useLayoutEffect(() => {
    latest.current = { activity, analyser, palette, active, speed, reducedMotion, onError }
    if (reducedMotion) {
      smooth.jump(0)
      target.set(0)
    } else {
      target.set(
        active ? clampLevel(isMotionValue(activity) ? activity.get() : activity) : 0
      )
    }
    renderer.current?.requestDraw()
  })

  React.useEffect(() => {
    if (!isMotionValue(activity)) return
    return activity.on("change", (value) => {
      if (latest.current.active && !latest.current.reducedMotion) {
        target.set(clampLevel(value))
      }
      renderer.current?.requestDraw()
    })
  }, [activity, target])

  React.useEffect(
    () => smooth.on("change", () => renderer.current?.requestDraw()),
    [smooth]
  )

  React.useEffect(() => {
    const element = canvas.current
    if (!element) return
    let sample: Uint8Array<ArrayBuffer> | null = null
    let source: AnalyserNode | null = null
    const fail = (failure: Error) => {
      setError(failure)
      latest.current.onError?.(failure)
    }

    try {
      renderer.current = createOrbRenderer(
        element,
        () => {
          const current = latest.current
          const live = current.active && !current.reducedMotion

          if (current.analyser && live) {
            if (source !== current.analyser || sample?.length !== current.analyser.fftSize) {
              source = current.analyser
              sample = new Uint8Array(new ArrayBuffer(current.analyser.fftSize))
            }
            current.analyser.getByteTimeDomainData(sample)
            let sum = 0
            for (const byte of sample) sum += ((byte - 128) / 128) ** 2
            target.set(clampLevel(Math.sqrt(sum / sample.length) * 3))
          }

          return {
            activity: live ? clampLevel(smooth.get()) : 0,
            colors: current.palette,
            speed: Number.isFinite(current.speed) ? Math.max(0, current.speed) : 1,
            animated: live && (current.speed > 0 || !!current.analyser),
          }
        },
        fail
      )
    } catch (failure) {
      fail(failure instanceof Error ? failure : new Error(String(failure)))
    }

    return () => {
      renderer.current?.dispose()
      renderer.current = null
    }
  }, [smooth, target])

  return (
    <div
      {...props}
      role="img"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-slot="voice-orb"
      data-render-state={error ? "error" : "ready"}
      className={cn("relative aspect-square w-64 shrink-0", className)}
    >
      {error ? (
        <div className="flex size-full items-center justify-center rounded-full border bg-card p-8 text-center text-xs text-muted-foreground">
          Orb rendering unavailable
        </div>
      ) : (
        <motion.div
          className="size-full"
          style={{ transform: reducedMotion ? "none" : transform }}
        >
          <canvas ref={canvas} className="block size-full" />
        </motion.div>
      )}
    </div>
  )
}

export { VoiceOrb, ORB_PALETTES, type VoiceOrbProps }
