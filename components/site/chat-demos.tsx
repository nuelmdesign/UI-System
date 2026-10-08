"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import { AnimatePresence } from "motion/react"
import {
  Brain,
  FileText,
  ImagePlus,
  Puzzle,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageBubbleCollapsible,
  MessageBubbleContent,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  MessageMarker,
  MessageScroller,
  MessageTyping,
} from "@/components/agents/message"
import { PromptInput } from "@/components/agents/prompt-input"
import { StreamingResponse } from "@/components/agents/streaming-response"
import type { CitationItem } from "@/components/agents/citations"

const MODELS = [
  { value: "fast", label: "Fast", icon: <Zap /> },
  { value: "balanced", label: "Balanced", icon: <Sparkles /> },
  { value: "deep", label: "Deep thinking", icon: <Brain /> },
]

const ACTIONS = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: <ImagePlus />,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: <Puzzle />,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: <FileText />,
  },
]

type ChatMessage = { id: string; from: "user" | "assistant"; text: string }

const SEED: ChatMessage[] = [
  { id: "1", from: "user", text: "What should the first release include?" },
  {
    id: "2",
    from: "assistant",
    text: "Start with the smallest workflow that still feels complete: a prompt, a streamed answer and a way to recover from errors.",
  },
  { id: "3", from: "user", text: "Include streaming and recovery states too." },
  {
    id: "4",
    from: "assistant",
    text: "Yes. Those states make the first version feel dependable, and they're cheap to add now.",
  },
  { id: "5", from: "user", text: "How should we present tool results?" },
  {
    id: "6",
    from: "assistant",
    text: "Keep results close to the action that produced them, collapsed by default.",
  },
]

const REPLIES = [
  "The view follows the newest message while you're at the bottom. Scroll up while this streams and it leaves your reading position alone.",
  "Hover the rail on the right to preview each turn, then click to jump there.",
  "Every animation here reads from lib/motion.ts, so it feels like the rest of the system.",
]

/** Streams `text` at a steady rate; returns the visible slice and whether it's done. */
function useStream(text: string | null, cps = 90) {
  const reduce = useReducedMotion() ?? false
  const [state, setState] = React.useState({ text, cursor: 0 })
  // Restart from zero whenever the text changes (state adjusted during render).
  if (state.text !== text) setState({ text, cursor: 0 })

  React.useEffect(() => {
    if (!text || reduce) return
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const cursor = Math.min(
        text.length,
        Math.floor(((now - start) / 1000) * cps)
      )
      setState({ text, cursor })
      if (cursor < text.length) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, cps, reduce])

  const cursor = reduce ? (text?.length ?? 0) : state.cursor
  return {
    visible: text ? text.slice(0, cursor) : "",
    done: !!text && cursor >= text.length,
  }
}

export function ChatDemo({ className }: { className?: string }) {
  const [messages, setMessages] = React.useState(SEED)
  const [pending, setPending] = React.useState<string | null>(null)
  const [thinking, setThinking] = React.useState(false)
  const replyIndex = React.useRef(0)
  const thinkTimer = React.useRef<number | undefined>(undefined)
  const stream = useStream(pending)

  // When the stream finishes, move it into the transcript.
  React.useEffect(() => {
    if (!pending || !stream.done) return
    const t = window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), from: "assistant", text: pending },
      ])
      setPending(null)
    }, 250)
    return () => window.clearTimeout(t)
  }, [pending, stream.done])

  React.useEffect(() => () => window.clearTimeout(thinkTimer.current), [])

  const send = (text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: "user", text }])
    setThinking(true)
    thinkTimer.current = window.setTimeout(() => {
      setThinking(false)
      setPending(REPLIES[replyIndex.current++ % REPLIES.length])
    }, 700)
  }

  const stop = () => {
    window.clearTimeout(thinkTimer.current)
    setThinking(false)
    if (pending) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          from: "assistant",
          text: stream.visible + "…",
        },
      ])
    }
    setPending(null)
  }

  const busy = thinking || !!pending

  return (
    <div
      className={cn(
        "flex h-[560px] w-full flex-col overflow-hidden rounded-lg",
        className
      )}
    >
      <MessageScroller
        navigation="rail"
        busy={busy}
        className="flex-1"
        contentClassName="flex flex-col gap-5 px-1 py-4 sm:px-4"
      >
        <MessageMarker>Today</MessageMarker>
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <ChatRow key={message.id} message={message} />
          ))}
          {thinking ? (
            <Message key="thinking" from="assistant" animateIn>
              <MessageAvatar>
                <Sparkles />
              </MessageAvatar>
              <MessageContent>
                <MessageBubble>
                  <MessageBubbleContent>
                    <MessageTyping />
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          ) : null}
          {pending ? (
            <Message key="streaming" from="assistant">
              <MessageAvatar>
                <Sparkles />
              </MessageAvatar>
              <MessageContent>
                <MessageBubble variant="ghost">
                  <MessageBubbleContent>
                    <StreamingResponse status="streaming" announce={false}>
                      <p>{stream.visible}</p>
                    </StreamingResponse>
                  </MessageBubbleContent>
                </MessageBubble>
              </MessageContent>
            </Message>
          ) : null}
        </AnimatePresence>
      </MessageScroller>
      <div className="border-t bg-background/60 p-3">
        <PromptInput
          models={MODELS}
          actions={ACTIONS}
          minRows={1}
          loading={busy}
          onSubmit={send}
          onStop={stop}
          onAction={(value) =>
            toast(ACTIONS.find((a) => a.value === value)?.label ?? "Action")
          }
          placeholder="Send a message…"
        />
      </div>
    </div>
  )
}

function ChatRow({ message }: { message: ChatMessage }) {
  const user = message.from === "user"
  return (
    <Message from={message.from} animateIn>
      <MessageAvatar className={user ? "bg-brand/15 text-brand" : undefined}>
        {user ? "NM" : <Sparkles />}
      </MessageAvatar>
      <MessageContent>
        <MessageBubble variant={user ? "solid" : "ghost"} animateIn>
          <MessageBubbleContent>
            {user ? message.text : <p>{message.text}</p>}
          </MessageBubbleContent>
        </MessageBubble>
      </MessageContent>
    </Message>
  )
}

/* -------------------------------------------------------------------------- */

const VARIANTS = ["solid", "soft", "tint", "outline", "danger"] as const

export function BubbleGallery() {
  return (
    <MessageGroup spacing="default" className="w-full">
      <Message from="user">
        <MessageAvatar className="bg-brand/15 text-brand">NM</MessageAvatar>
        <MessageContent>
          <MessageHeader>You · 9:41</MessageHeader>
          <MessageBubble variant="solid">
            <MessageBubbleContent>
              Can you summarise the launch plan?
            </MessageBubbleContent>
          </MessageBubble>
          <MessageFooter>Read</MessageFooter>
        </MessageContent>
      </Message>

      <Message from="assistant">
        <MessageAvatar>
          <Sparkles />
        </MessageAvatar>
        <MessageContent>
          <MessageBubble variant="soft">
            <MessageBubbleContent>
              <MessageBubbleCollapsible collapsedLines={2}>
                <p>
                  Launch in three phases. First, an internal beta with the core
                  chat flow and streaming. Second, a private preview with tool
                  results, approvals and citations. Third, general availability
                  with the full sidebar, voice input and usage analytics.
                </p>
                <p>
                  Each phase ends with a short review of reliability and latency
                  before the next one starts.
                </p>
              </MessageBubbleCollapsible>
            </MessageBubbleContent>
          </MessageBubble>
        </MessageContent>
      </Message>

      <div className="flex flex-wrap gap-2 pt-2">
        {VARIANTS.map((variant) => (
          <MessageBubble key={variant} variant={variant} className="w-auto">
            <MessageBubbleContent className="max-w-none">
              {variant}
            </MessageBubbleContent>
          </MessageBubble>
        ))}
        <MessageBubble variant="soft" className="w-auto">
          <MessageBubbleContent className="max-w-none text-muted-foreground">
            <MessageTyping />
          </MessageBubbleContent>
        </MessageBubble>
      </div>
    </MessageGroup>
  )
}

/* -------------------------------------------------------------------------- */

const SOURCES: CitationItem[] = [
  {
    id: "motion",
    title: "Motion for React",
    domain: "motion.dev",
    url: "https://motion.dev/docs/react",
  },
  {
    id: "aria",
    title: "ARIA live regions",
    domain: "developer.mozilla.org",
    url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",
  },
  {
    id: "radix",
    title: "Radix Primitives",
    domain: "radix-ui.com",
    url: "https://www.radix-ui.com/primitives",
  },
]

const ANSWER =
  "Streaming answers keep structure as they arrive. Links stay clickable, lists keep their spacing, and the actions only appear once the response is complete, so nothing jumps under the reader's cursor."

function StreamingRun({ onReplay }: { onReplay: () => void }) {
  const stream = useStream(ANSWER, 110)
  const [complete, setComplete] = React.useState(false)

  React.useEffect(() => {
    if (!stream.done) return
    const t = window.setTimeout(() => setComplete(true), 350)
    return () => window.clearTimeout(t)
  }, [stream.done])

  return (
    <StreamingResponse
      status={complete ? "complete" : "streaming"}
      copyText={ANSWER}
      onRetry={onReplay}
      sources={SOURCES}
    >
      <p>{stream.visible}</p>
      {stream.done ? (
        <ul>
          <li>Actions: copy, retry, thumbs up / down</li>
          <li>Sources: a collapsible list with favicons</li>
        </ul>
      ) : null}
    </StreamingResponse>
  )
}

export function StreamingDemo() {
  const [run, setRun] = React.useState(0)
  return (
    <div className="flex min-h-72 w-full flex-col gap-4">
      <div className="flex-1">
        <StreamingRun key={run} onReplay={() => setRun((r) => r + 1)} />
      </div>
      <Button
        variant="ghost"
        size="xs"
        className="self-start text-muted-foreground"
        onClick={() => setRun((r) => r + 1)}
      >
        <RotateCcw /> Replay
      </Button>
    </div>
  )
}
