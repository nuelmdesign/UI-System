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
