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
