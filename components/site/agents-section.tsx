"use client"

import * as React from "react"
import { useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react"
import { Mic, MicOff, Pause, Play } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShimmerText } from "@/components/motion/shimmer-text"
import { Reveal } from "@/components/motion/reveal"
import { VoiceOrb, ORB_PALETTES } from "@/components/agents/voice-orb"

type Palette = keyof typeof ORB_PALETTES

export function VoiceOrbDemo() {
  const activity = useMotionValue(0)
  const reducedMotion = useReducedMotion()
  const [palette, setPalette] = React.useState<Palette>("brand")
  const [active, setActive] = React.useState(true)
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null)
  const audio = React.useRef<{ ctx: AudioContext; stream: MediaStream } | null>(null)

  // Simulated syllables and pauses while the mic is off.
  useAnimationFrame((time) => {
    if (analyser) return
    if (reducedMotion) return activity.set(0)
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
        description: "Allow microphone access to drive the orb with your voice.",
      })
    }
  }

  return (
    <div className="relative grid w-full gap-8 md:grid-cols-[1fr_auto] md:items-center">
      <div className="flex flex-col items-center gap-6">
        <VoiceOrb
          activity={activity}
          analyser={analyser}
          colors={palette}
          active={active}
          aria-label="Voice visualization"
          className="w-56 sm:w-64"
        />
        <ShimmerText className="text-sm font-medium">
          {!active ? "Paused" : analyser ? "Listening…" : "Speaking…"}
        </ShimmerText>
      </div>

      <div className="grid gap-5 md:w-64">
        <div className="grid gap-2">
          <p className="text-xs font-medium text-muted-foreground">Pigment</p>
          <Tabs value={palette} onValueChange={(v) => setPalette(v as Palette)}>
            <TabsList className="w-full">
              {Object.keys(ORB_PALETTES).map((name) => (
                <TabsTrigger key={name} value={name} className="capitalize">
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-medium text-muted-foreground">Source</p>
          <div className="flex gap-2">
            <Button
              variant={analyser ? "brand" : "outline"}
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
          <p className="text-xs text-muted-foreground">
            Audio stays in your browser. The orb only reads a level.
          </p>
        </div>
      </div>
    </div>
  )
}

export function AgentsSection({
  heading,
}: {
  heading: React.ReactNode
}) {
  return (
    <>
      {heading}
      <div className="grid gap-4">
        <Reveal className="overflow-hidden rounded-xl border bg-card [box-shadow:var(--highlight),var(--shadow-xs)]">
          <div className="flex h-10 items-center gap-2 border-b px-4 text-xs font-medium text-muted-foreground">
            Voice Orb
            <Badge variant="brand" className="h-4 px-1.5 text-[10px]">
              New
            </Badge>
            <span className="ml-auto hidden font-mono sm:inline">WebGL · voice-reactive</span>
          </div>
          <div className="p-6 sm:p-10">
            <VoiceOrbDemo />
          </div>
        </Reveal>
      </div>
    </>
  )
}
