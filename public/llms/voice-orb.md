# Voice Orb

Breathing WebGL liquid orb that reacts to a voice level or an audio analyser.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/voice-orb
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { VoiceOrb } from "@/components/agents/voice-orb"
```

Files added to the project:

- `components/agents/voice-orb.tsx`
- `components/agents/voice-orb/renderer.ts`

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
type OrbColors = readonly [base: string, highlight: string, shadow: string]

type VoiceOrbProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onError"
> & {
  /** Normalized activity, 0 to 1. Pass a MotionValue to avoid re-rendering every frame. */
  activity?: number | MotionValue<number>
  /** Optional caller-owned audio analyser. The orb never requests a microphone itself. */
  analyser?: AnalyserNode | null
  /** A preset name or [base, highlight, shadow] as #RGB / #RRGGBB hex. */
  colors?: keyof typeof ORB_PALETTES | OrbColors
  /** Pause the surface while keeping the current frame visible. */
  active?: boolean
  speed?: number
  onError?: (error: Error) => void
}
```

## Example

```tsx
"use client"

import * as React from "react"
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import { Mic, MicOff, Pause, Play } from "lucide-react"
import { toast } from "sonner"

import { ORB_PALETTES, VoiceOrb } from "@/components/agents/voice-orb"
import { ShimmerText } from "@/components/motion/shimmer-text"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Palette = keyof typeof ORB_PALETTES

export default function VoiceOrbDemo() {
  const activity = useMotionValue(0)
  const reduce = useReducedMotion()
  const [palette, setPalette] = React.useState<Palette>("brand")
  const [active, setActive] = React.useState(true)
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null)
  const audio = React.useRef<{ ctx: AudioContext; stream: MediaStream } | null>(
    null
  )

  // Simulated syllables and pauses while the microphone is off.
  useAnimationFrame((time) => {
    if (analyser) return
    if (reduce) return activity.set(0)
    const t = time / 1000
    const phrase = Math.max(0, Math.sin(t * 0.85))
    const syllable = Math.max(0, Math.sin(t * 9.3 + Math.sin(t * 2.1)))
    activity.set(phrase * (0.12 + syllable ** 2 * 0.72))
  })

  const stopMic = React.useCallback(() => {
    audio.current?.stream.getTracks().forEach((track) => track.stop())
    void audio.current?.ctx.close()
    audio.current = null
    setAnalyser(null)
  }, [])

  React.useEffect(() => stopMic, [stopMic])

  async function toggleMic() {
    if (analyser) return stopMic()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext()
      const node = ctx.createAnalyser()
      node.fftSize = 1024
      ctx.createMediaStreamSource(stream).connect(node)
      audio.current = { ctx, stream }
      setAnalyser(node)
    } catch {
      toast.error("Microphone unavailable", {
        description:
          "Allow microphone access to drive the orb with your voice.",
      })
    }
  }

  return (
    <div className="grid w-full items-center gap-8 md:grid-cols-[1fr_auto]">
      <div className="flex flex-col items-center gap-6">
        <VoiceOrb
          activity={activity}
          analyser={analyser}
          colors={palette}
          active={active}
          aria-label="Voice visualization"
          className="w-56"
        />
        <ShimmerText className="text-sm font-medium">
          {!active ? "Paused" : analyser ? "Listening…" : "Speaking…"}
        </ShimmerText>
      </div>
      <div className="grid gap-5 md:w-64">
        <Tabs value={palette} onValueChange={(v) => setPalette(v as Palette)}>
          <TabsList className="w-full">
            {Object.keys(ORB_PALETTES).map((name) => (
              <TabsTrigger key={name} value={name} className="capitalize">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <Button
            variant={analyser ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={toggleMic}
          >
            {analyser ? <MicOff /> : <Mic />}
            {analyser ? "Stop mic" : "Use mic"}
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={active ? "Pause" : "Resume"}
            onClick={() => setActive((v) => !v)}
          >
            {active ? <Pause /> : <Play />}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/voice-orb. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
