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
