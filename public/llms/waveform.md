# Waveform

Static, clickable and scrubbable waveform bars drawn from normalized data, plus a scrolling variant and an accessible scrubber. Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/waveform
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Waveform, ScrollingWaveform, AudioScrubber } from "@/components/agents/waveform"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
/**
 * A theme token name (`"foreground"`, `"primary"`, `"brand"`, `"muted-foreground"`...)
 * or any CSS color. Token names are read from the CSS variables at draw time,
 * so the canvas follows light, dark and `.dark` sections.
 */
type WaveformColor = string

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
```

## Example

```tsx
"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"

import {
  AudioScrubber,
  ScrollingWaveform,
  Waveform,
} from "@/components/agents/waveform"
import { Button } from "@/components/ui/button"

const DURATION = 42

/** A deterministic, speech-like envelope so server and client render the same bars. */
const SAMPLES = Array.from({ length: 160 }, (_, i) => {
  const phrase = 0.5 + 0.5 * Math.sin(i * 0.11)
  const syllable = 0.5 + 0.5 * Math.sin(i * 0.9 + Math.sin(i * 0.31) * 2)
  return Math.max(0.06, Math.min(1, 0.12 + phrase * 0.45 + syllable * 0.35))
})

const formatTime = (time: number) => {
  const total = Math.floor(time)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

export default function WaveformDemo() {
  const [time, setTime] = React.useState(12)
  const [playing, setPlaying] = React.useState(false)
  const [picked, setPicked] = React.useState<string | null>(null)

  // A simulated playback clock keeps the demo silent and offline.
  React.useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setTime((current) => {
        if (current >= DURATION) {
          setPlaying(false)
          return DURATION
        }
        return Math.min(DURATION, current + 0.25)
      })
    }, 250)
    return () => window.clearInterval(timer)
  }, [playing])

  return (
    <div className="grid w-full max-w-2xl gap-10">
      <section className="grid gap-3">
        <p className="eyebrow text-muted-foreground">Scrubbable</p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              if (time >= DURATION) setTime(0)
              setPlaying((value) => !value)
            }}
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <AudioScrubber
            data={SAMPLES}
            currentTime={time}
            duration={DURATION}
            onSeek={setTime}
            aria-label="Seek recording"
            height={56}
          />
          <span className="w-20 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
            {formatTime(time)} / {formatTime(DURATION)}
          </span>
        </div>
      </section>

      <section className="grid gap-3">
        <p className="eyebrow text-muted-foreground">Static, clickable bars</p>
        <Waveform
          data={SAMPLES}
          height={96}
          barColor="brand"
          fadeEdges
          aria-label="Recording overview"
          onBarClick={(index, value) =>
            setPicked(`Bar ${index + 1} at ${Math.round(value * 100)}%`)
          }
        />
        <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
          {picked ?? "Click a bar to read its level."}
        </p>
      </section>

      <section className="grid gap-3">
        <p className="eyebrow text-muted-foreground">Scrolling</p>
        <ScrollingWaveform
          height={72}
          barWidth={3}
          barGap={2}
          speed={30}
          barColor="muted-foreground"
          aria-label="Incoming audio level"
        />
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/waveform. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
