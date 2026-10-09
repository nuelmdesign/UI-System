// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { ArrowUp, Clock, Ellipsis, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/* Interactive chat panel with tabs, scripted replies and a composer.
 * The reply sequence begins only after the user sends. */

type Phase = "idle" | "sent" | "reply1" | "reply2" | "done"

/** One scripted agent reply in the thread. */
export type ChatPanelMessage = {
  label: string
  sub: string
  time: string
  body: string
}

export type ChatPanelLabels = {
  /** The pre-filled prompt shown in the first user bubble. */
  initialPrompt: string
  /** Composer input placeholder. */
  placeholder: string
}

export interface ChatPanelProps {
  /** Scripted agent replies revealed in sequence after the user sends. */
  messages?: ChatPanelMessage[]
  /** Header chips (tabs) for switching context. */
  suggestions?: string[]
  labels?: Partial<ChatPanelLabels>
  /** Fired with the trimmed prompt text when the user sends. */
  onSend?: (text: string) => void
  className?: string
}

const MESSAGES: ChatPanelMessage[] = [
  {
    label: "Sales History",
    sub: "Flavor Data",
    time: "4s",
    body: "Pulled 3 summers of mint chip sales for comparison.",
  },
  {
    label: "Comparison",
    sub: "Trend Detection",
    time: "2s",
    body: "Mint chip is up 12% with stronger weekend peaks.",
  },
]

const SUGGESTIONS = ["Flavors", "Suppliers"]

const DEFAULT_LABELS: ChatPanelLabels = {
  initialPrompt: "Compare mint chip to last summer",
  placeholder: "Prompt or tag a flavor with @",
}

const HEADER_ACTIONS = [
  { label: "New chat", Icon: Plus },
  { label: "History", Icon: Clock },
  { label: "More", Icon: Ellipsis },
]

function Section({
  label,
  sub,
  time,
  body,
  resolving,
}: ChatPanelMessage & { resolving?: boolean }) {
  return (
    // The entrance runs on the wrapper so its fill doesn't pin the inner
    // resolving transition (opacity/blur/scale) to the keyframe's end values.
    <div className="w-full animate-fade-up">
      <div
        data-slot="chat-panel-reply"
        data-resolving={resolving || undefined}
        className={cn(
          "flex w-full origin-top-left flex-col gap-1.5 transition-[opacity,filter,transform] duration-400 ease-out",
          resolving
            ? "scale-[0.985] opacity-55 blur-[0.5px]"
            : "scale-100 opacity-100 blur-none"
        )}
      >
        <div className="flex items-center gap-1 text-xs leading-[1.3]">
          <span className="font-medium text-foreground">{label}</span>
          <span className="text-muted-foreground">{sub}</span>
          <span className="font-mono text-muted-foreground/70 tabular-nums">
            for {time}
          </span>
        </div>
        <p className="text-[calc(13px*var(--text-scale))] leading-normal text-foreground">
          {body}
        </p>
      </div>
    </div>
  )
}

export function ChatPanel({
  messages = MESSAGES,
  suggestions = SUGGESTIONS,
  labels,
  onSend,
  className,
}: ChatPanelProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const [phase, setPhase] = useState<Phase>("done")
  const [draft, setDraft] = useState("")
  const [submitted, setSubmitted] = useState(l.initialPrompt)
  const [tab, setTab] = useState(suggestions[0] ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (phase === "sent") t = setTimeout(() => setPhase("reply1"), 500)
    else if (phase === "reply1") t = setTimeout(() => setPhase("reply2"), 1400)
    else if (phase === "reply2") t = setTimeout(() => setPhase("done"), 1200)
    else return
    return () => clearTimeout(t)
  }, [phase])

  const sent = phase !== "idle"
  const canSend = draft.trim().length > 0

  const send = () => {
    if (!canSend) return
    const text = draft.trim()
    setSubmitted(text)
    onSend?.(text)
    setDraft("")
    setPhase("sent")
  }

  return (
    <div
      data-slot="chat-panel"
      className={cn(
        "flex h-[288px] w-full max-w-95 flex-col self-start overflow-hidden rounded-lg border bg-card",
        className
      )}
    >
      {/* header: tabs + actions */}
      <div
        data-slot="chat-panel-header"
        className="flex shrink-0 items-center justify-between border-b p-1.5"
      >
        <div className="flex items-center">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={tab === item}
              onClick={() => setTab(item)}
              className={cn(
                "rounded-md px-2 py-[3px] text-[calc(13px*var(--text-scale))] text-foreground transition-[background-color,opacity] duration-100",
                tab === item ? "bg-muted" : "opacity-50 hover:opacity-75"
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {HEADER_ACTIONS.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground/70 transition-colors duration-100 hover:bg-accent hover:text-muted-foreground"
            >
              <Icon className="size-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* conversation: fixed region so the card never changes shape */}
      <div
        data-slot="chat-panel-thread"
        className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pt-2.5 pb-1"
      >
        {/* user bubble: right aligned, soft block */}
        <div className="flex justify-end pl-14">
          <div
            className={cn(
              "rounded-md bg-muted px-3 py-1.5 text-[calc(13px*var(--text-scale))] leading-[1.4] text-foreground transition-[opacity,transform] duration-300 ease-out",
              sent ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
            )}
          >
            {submitted}
          </div>
        </div>

        {messages[0] &&
        (phase === "reply1" || phase === "reply2" || phase === "done") ? (
          <Section {...messages[0]} />
        ) : null}
        {messages[1] && (phase === "reply2" || phase === "done") ? (
          <Section {...messages[1]} resolving={phase === "reply2"} />
        ) : null}
      </div>

      {/* composer */}
      <div data-slot="chat-panel-composer" className="mt-auto shrink-0 p-1.5">
        <div
          role="presentation"
          onClick={() => inputRef.current?.focus()}
          className="flex cursor-text flex-col gap-2 rounded-md border bg-muted p-2.5 transition-colors duration-150 focus-within:border-input"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") send()
            }}
            placeholder={l.placeholder}
            aria-label="Chat prompt"
            className="min-h-4.5 bg-transparent text-[calc(13px*var(--text-scale))] leading-[1.4] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={send}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.96]",
                canSend
                  ? "bg-ink text-ink-foreground"
                  : "bg-input text-muted-foreground"
              )}
            >
              <ArrowUp className="size-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
