# Scrub Bar

Seekable progress bar with time labels on a native range input, so pointer, touch and keyboard all work. Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/scrub-bar
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ScrubBar, ScrubBarContainer, ScrubBarTrack, ScrubBarProgress, ScrubBarThumb, ScrubBarTimeLabel } from "@/components/agents/scrub-bar"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
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

type ScrubBarTrackProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Accessible name of the seek control. */
  label?: string
  /** Keyboard and drag granularity in seconds. */
  step?: number
  /** Formats the spoken value of the slider. Defaults to `m:ss`. */
  formatValueText?: (time: number) => string
}

type ScrubBarTimeLabelProps = React.ComponentProps<"span"> & {
  /** Seconds to display. */
  time: number
  format?: (time: number) => string
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

function ScrubBarProgress(props: React.ComponentProps<"div">)

function ScrubBarThumb(props: React.ComponentProps<"div">)
```

## Example

```tsx
"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrubBar } from "@/components/agents/scrub-bar"

const DURATION = 184

export default function ScrubBarDemo() {
  const [time, setTime] = React.useState(42)
  const [playing, setPlaying] = React.useState(false)
  const [scrubbing, setScrubbing] = React.useState(false)

  const running = playing && time < DURATION

  // Simulated playback: advance a tenth of a second at a time.
  React.useEffect(() => {
    if (!running || scrubbing) return
    const id = window.setInterval(() => {
      setTime((t) => Math.min(t + 0.1, DURATION))
    }, 100)
    return () => window.clearInterval(id)
  }, [running, scrubbing])

  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-lg border bg-card p-4">
      <Button
        size="icon"
        aria-label={running ? "Pause" : "Play"}
        onClick={() => {
          if (time >= DURATION) setTime(0)
          setPlaying(!running)
        }}
      >
        {running ? <Pause /> : <Play />}
      </Button>
      <ScrubBar
        duration={DURATION}
        value={time}
        showRemaining
        label="Seek recording"
        onScrub={setTime}
        onScrubStart={() => setScrubbing(true)}
        onScrubEnd={() => setScrubbing(false)}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/scrub-bar. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
