"use client"

import * as React from "react"

import { Slider } from "@/components/ui/slider"

export default function SliderDemo() {
  const [volume, setVolume] = React.useState([70])

  return (
    <div className="grid w-full max-w-md gap-8">
      <Slider
        label="Playback volume"
        value={volume}
        onValueChange={setVolume}
        formatValue={(v) => `${v}%`}
        showRange
      />
      <Slider
        label="Speaking rate"
        defaultValue={[1]}
        min={0.5}
        max={2}
        step={0.1}
        formatValue={(v) => `${v.toFixed(1)}x`}
        marks={[
          { value: 0.5, label: "Slow" },
          { value: 1.25, label: "Natural" },
          { value: 2, label: "Fast" },
        ]}
      />
      <Slider
        label="Pitch range"
        defaultValue={[20, 65]}
        formatValue={(v) => `${v}`}
        showRange
      />
      <Slider aria-label="Noise reduction" defaultValue={[40]} disabled />
    </div>
  )
}
