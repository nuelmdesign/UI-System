"use client"

import * as React from "react"

import { MicSelector } from "@/components/agents/mic-selector"

export default function MicSelectorDemo() {
  const [deviceId, setDeviceId] = React.useState<string>()
  const [muted, setMuted] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <MicSelector
        value={deviceId}
        onValueChange={setDeviceId}
        muted={muted}
        onMutedChange={setMuted}
      />
      <p className="eyebrow text-muted-foreground">
        {muted ? "Muted" : "Open the menu to preview your input level"}
      </p>
    </div>
  )
}
