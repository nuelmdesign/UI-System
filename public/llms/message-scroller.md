# Message Scroller

Transcript that follows streamed output, with a rail for jumping between turns.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/message-scroller
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { MessageScroller } from "@/components/agents/message-scroller"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/preview-rail`

## Props and types

```ts
export interface MessageScrollerProps extends ComponentPropsWithRef<"div"> {
  /** Keep streamed output pinned while the reader remains near the end. */
  followOutput?: boolean
  /** Distance from the end that still counts as following the output. */
  followThreshold?: number
  /** Smoothly follow growing content. */
  smooth?: boolean
  /** Reports when the reader leaves or returns to the live edge. */
  onFollowChange?: (following: boolean) => void
  /** Accessible label for the scrollable transcript. */
  label?: string
  /** Marks the transcript as waiting for more streamed content. */
  busy?: boolean
  /** Adds a compact rail for navigating between rendered Message rows. */
  navigation?: "rail"
  /** Accessible label for the optional message navigation rail. */
  navigationLabel?: string
  viewportClassName?: string
  contentClassName?: string
  railClassName?: string
  viewportRef?: Ref<HTMLElement>
  viewportProps?: Omit<
    ComponentPropsWithRef<"section">,
    "children" | "className" | "ref"
  >
  contentProps?: Omit<
    ComponentPropsWithRef<"div">,
    "children" | "className" | "ref"
  >
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { AnimatePresence, useReducedMotion } from "motion/react"
import { Brain, FileText, ImagePlus, Puzzle, Sparkles, Zap } from "lucide-react"
import { toast } from "sonner"

import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageBubbleContent,
  MessageContent,
  MessageMarker,
  MessageScroller,
  MessageTyping,
} from "@/components/agents/message"
import { PromptInput } from "@/components/agents/prompt-input"
import { StreamingResponse } from "@/components/agents/streaming-response"

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

export default function MessageScrollerDemo() {
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
    <div className="flex h-[560px] w-full flex-col overflow-hidden border bg-background">
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
```

Live docs: https://ui-system-virid.vercel.app/docs/message-scroller. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
