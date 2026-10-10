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
