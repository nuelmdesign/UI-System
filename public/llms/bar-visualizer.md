# Bar Visualizer

Volume or frequency bars that light up by agent state (connecting, listening, thinking, speaking). Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/bar-visualizer
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { BarVisualizer } from "@/components/agents/bar-visualizer"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
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
```

## Example

```tsx
"use client"

import * as React from "react"
import { Mic, MicOff } from "lucide-react"

import {
  BarVisualizer,
  type BarVisualizerState,
} from "@/components/agents/bar-visualizer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const STATES: BarVisualizerState[] = [
  "connecting",
  "listening",
  "thinking",
  "speaking",
]
const BARS = 15

export default function BarVisualizerDemo() {
  const [state, setState] = React.useState<BarVisualizerState>("speaking")
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const [problem, setProblem] = React.useState<string | null>(null)
  const [levels, setLevels] = React.useState<number[]>(() =>
    Array.from({ length: BARS }, () => 0.2)
  )
  const streamRef = React.useRef<MediaStream | null>(null)

  // Simulated levels while the microphone is off.
  React.useEffect(() => {
    if (stream) return
    const moving = state === "speaking" || state === "listening"
    const timer = window.setInterval(() => {
      const t = performance.now() / 1000
      setLevels(
        Array.from({ length: BARS }, (_, i) =>
          moving
            ? Math.max(
                0.1,
                0.45 +
                  Math.sin(t * 3 + i * 0.6) * 0.3 +
                  Math.sin(t * 7.3 + i) * 0.12
              )
            : 0.2
        )
      )
    }, 80)
    return () => window.clearInterval(timer)
  }, [state, stream])

  const stopMic = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
  }, [])

  React.useEffect(() => stopMic, [stopMic])

  async function toggleMic() {
    if (stream) return stopMic()
    setProblem(null)
    try {
      const next = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = next
      setStream(next)
      setState("listening")
    } catch {
      setProblem("Microphone unavailable. Showing simulated levels instead.")
    }
  }

  return (
    <div className="grid w-full max-w-xl gap-5">
      <BarVisualizer
        state={state}
        barCount={BARS}
        levels={stream ? undefined : levels}
        mediaStream={stream}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={state}
          onValueChange={(v) => setState(v as BarVisualizerState)}
        >
          <TabsList className="h-auto max-w-full flex-wrap justify-start">
            {STATES.map((name) => (
              <TabsTrigger key={name} value={name} className="capitalize">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          variant={stream ? "default" : "outline"}
          size="sm"
          onClick={toggleMic}
        >
          {stream ? <MicOff /> : <Mic />}
          {stream ? "Stop mic" : "Use mic"}
        </Button>
      </div>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {problem ?? (stream ? "Reading your microphone." : "Simulated levels.")}
      </p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/bar-visualizer. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
