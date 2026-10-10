# Live Waveform

Microphone-driven canvas waveform in static or scrolling mode with a processing animation; handles denied or missing microphones. Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/live-waveform
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { LiveWaveform } from "@/components/agents/live-waveform"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
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
```

## Example

```tsx
"use client"

import * as React from "react"
import { Loader2, Mic, MicOff } from "lucide-react"

import {
  LiveWaveform,
  type LiveWaveformMode,
} from "@/components/agents/live-waveform"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LiveWaveformDemo() {
  const [active, setActive] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const [mode, setMode] = React.useState<LiveWaveformMode>("static")
  const [problem, setProblem] = React.useState<string | null>(null)

  function toggleMic() {
    setProblem(null)
    setProcessing(false)
    setActive((value) => !value)
  }

  return (
    <div className="grid w-full max-w-xl gap-5">
      <div className="rounded-lg border bg-card p-4">
        <LiveWaveform
          active={active}
          processing={processing}
          mode={mode}
          height={80}
          barWidth={3}
          barGap={2}
          barColor="foreground"
          onError={(error) => {
            setActive(false)
            setProblem(
              error.name === "NotAllowedError"
                ? "Microphone access was blocked. Allow it in your browser settings to try again."
                : "No microphone is available in this browser."
            )
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={active ? "default" : "outline"}
          size="sm"
          onClick={toggleMic}
        >
          {active ? <MicOff /> : <Mic />}
          {active ? "Stop microphone" : "Start microphone"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={active}
          aria-pressed={processing}
          onClick={() => setProcessing((value) => !value)}
        >
          <Loader2 />
          Processing
        </Button>
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as LiveWaveformMode)}
        >
          <TabsList>
            <TabsTrigger value="static">Static</TabsTrigger>
            <TabsTrigger value="scrolling">Scrolling</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {problem ??
          (active
            ? "Listening. Nothing is recorded or uploaded."
            : "Start the microphone to see your voice.")}
      </p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/live-waveform. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
