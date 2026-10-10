"use client"

import * as React from "react"

import {
  VoiceButton,
  type VoiceButtonState,
} from "@/components/agents/voice-button"

export default function VoiceButtonDemo() {
  const [state, setState] = React.useState<VoiceButtonState>("idle")
  const timers = React.useRef<number[]>([])

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  function stop() {
    setState("processing")
    timers.current.push(
      window.setTimeout(() => setState("success"), 1200),
      window.setTimeout(() => setState("idle"), 3000)
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <VoiceButton
        state={state}
        label="Dictate"
        shortcut="Space"
        hotkey="Space"
        onRecordStart={() => setState("recording")}
        onRecordEnd={stop}
      />
      <VoiceButton
        state={state}
        mode="push-to-talk"
        label="Hold to talk"
        onRecordStart={() => setState("recording")}
        onRecordEnd={stop}
      />
      <VoiceButton
        state={state}
        size="icon"
        aria-label="Record"
        onRecordStart={() => setState("recording")}
        onRecordEnd={stop}
      />
      <p className="eyebrow text-muted-foreground">State: {state}</p>
    </div>
  )
}
