"use client"

import * as React from "react"
import {
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import { Mic, MicOff, Pause, Play } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShimmerText } from "@/components/motion/shimmer-text"
import { Reveal } from "@/components/motion/reveal"
import { VoiceOrb, ORB_PALETTES } from "@/components/agents/voice-orb"
import {
  BubbleGallery,
  ChatDemo,
  StreamingDemo,
} from "@/components/site/chat-demos"
import {
  ActivityDemo,
  CodeBlockDemo,
  FileDiffDemo,
  LoadingStatesDemo,
  TodoDemo,
  ToolResultDemo,
} from "@/components/site/agent-work-demos"
import {
  ApprovalQuestionDemo,
  ApprovalReviewDemo,
  ImageGenerationDemo,
  ToolApprovalDemo,
} from "@/components/site/approval-demos"
import { CELLS } from "@/components/site/cells"
import { AISidebarDemo, ChatAppDemo } from "@/components/site/workspace-demos"
import { cn } from "@/lib/utils"

type Palette = keyof typeof ORB_PALETTES

export function VoiceOrbDemo() {
  const activity = useMotionValue(0)
  const reducedMotion = useReducedMotion()
  const [palette, setPalette] = React.useState<Palette>("brand")
  const [active, setActive] = React.useState(true)
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null)
  const audio = React.useRef<{ ctx: AudioContext; stream: MediaStream } | null>(
    null
  )

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
        description:
          "Allow microphone access to drive the orb with your voice.",
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

function AgentSpecimen({
  title,
  meta,
  isNew,
  className,
  bodyClassName,
  children,
}: {
  title: string
  meta?: string
  isNew?: boolean
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}) {
  return (
    <Reveal className={cn("bg-card", className)}>
      <div className="flex items-center gap-2 px-5 pt-5 text-muted-foreground">
        <span className="eyebrow">{title}</span>
        {isNew ? (
          <Badge
            variant="brand"
            className="h-4 px-1 font-mono text-[9px] uppercase"
          >
            New
          </Badge>
        ) : null}
        {meta ? (
          <span className="ml-auto hidden truncate font-mono text-[11px] sm:inline">
            {meta}
          </span>
        ) : null}
      </div>
      <div className={cn("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </Reveal>
  )
}

export function AgentsSection({ heading }: { heading: React.ReactNode }) {
  return (
    <>
      {heading}
      <div className={cn(CELLS, "md:grid-cols-2")}>
        <AgentSpecimen
          title="Voice Orb"
          meta="WebGL · voice-reactive"
          isNew
          className="md:col-span-2"
          bodyClassName="sm:p-10"
        >
          <VoiceOrbDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="Chat"
          meta="MessageScroller · Message · PromptInput · StreamingResponse"
          className="md:col-span-2"
          bodyClassName="p-3 sm:p-4"
        >
          <ChatDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="Message Bubble"
          meta="variants · collapsible · typing"
        >
          <BubbleGallery />
        </AgentSpecimen>

        <AgentSpecimen title="Streaming Response" meta="actions · sources">
          <StreamingDemo />
        </AgentSpecimen>

        <AgentSpecimen title="Agent Activity" meta="steps · search · tools">
          <ActivityDemo />
        </AgentSpecimen>

        <AgentSpecimen title="Todo List" meta="live plan · progress">
          <TodoDemo />
        </AgentSpecimen>

        <AgentSpecimen title="Tool Result" meta="terminal · request · error">
          <ToolResultDemo />
        </AgentSpecimen>

        <AgentSpecimen title="Code Block" meta="streaming · Shiki highlighting">
          <CodeBlockDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="File Diff"
          meta="additions · removals"
          className="md:col-span-2"
        >
          <FileDiffDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="Approval Card"
          meta="questions · single & multi choice"
        >
          <ApprovalQuestionDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="Approval Card · review"
          meta="approve · request changes · reject"
        >
          <ApprovalReviewDemo />
        </AgentSpecimen>

        <AgentSpecimen title="Tool Approval" meta="parameters · always allow">
          <ToolApprovalDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="Image Generation"
          meta="queued · generating · refining"
        >
          <ImageGenerationDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="Chat App"
          meta="ChatApp · AnimatedSidebar · full composition"
          className="md:col-span-2"
          bodyClassName="p-3 sm:p-4"
        >
          <ChatAppDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="AI Sidebar"
          meta="tree · drag to move · rename"
          className="md:col-span-2"
          bodyClassName="p-3 sm:p-4"
        >
          <AISidebarDemo />
        </AgentSpecimen>

        <AgentSpecimen
          title="Agent Loading States"
          meta="shimmer · progress · reasoning · loaders"
          className="md:col-span-2"
        >
          <LoadingStatesDemo />
        </AgentSpecimen>
      </div>
    </>
  )
}
