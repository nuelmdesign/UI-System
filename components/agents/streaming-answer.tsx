// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import {
  BarChart3,
  Copy,
  CornerDownLeft,
  IceCreamCone,
  RotateCw,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from "lucide-react"

import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * STREAMING ANSWER
 * Words stream in at 55ms each, an inline citation chip pops
 * in mid-sentence, then the action row, sources toggle and
 * follow-up prompts fade in and become usable. Loops after a
 * 3.4s hold unless `loop` is off.
 * ───────────────────────────────────────────────────────── */

const WORD_MS = 55
const HOLD_MS = 3400

/** One streamed word, or a `cite` placeholder that renders an inline source chip. */
export type StreamingToken = { text: string; cite?: boolean }

/** One cited source, shown in the inline chip, the avatar stack and the list. */
export type StreamingSource = {
  name: string
  domain: string
  href: string
  /** Favicon URL. When absent, `icon` (or the first letter) is shown. */
  image?: string
  icon?: ReactNode
}

export type StreamingAnswerAction = "copy" | "retry" | "like" | "dislike"

export type StreamingAnswerLabels = {
  /** Label on the collapsed sources toggle. */
  sources: string
  /** Heading above the follow-up prompts. */
  followUps: string
}

const TOKENS: StreamingToken[] = [
  ..."Pistachio is your fastest-growing flavor — sales are up 23% this month and margins beat vanilla by 8 points."
    .split(" ")
    .map((text) => ({ text })),
  { text: "", cite: true },
  ..."Stone-fruit flavors are trending in the same range."
    .split(" ")
    .map((text) => ({ text })),
]

const FOLLOW_UPS = [
  "Which flavors sell best in winter",
  "Compare gelato and soft serve margins",
]

const SOURCES: StreamingSource[] = [
  {
    name: "Scoop Data",
    domain: "scoopdata.io",
    href: "https://scoopdata.io/",
    icon: <IceCreamCone />,
  },
  {
    name: "Trends Index",
    domain: "trends.google.com",
    href: "https://trends.google.com/trends/",
    icon: <TrendingUp />,
  },
  {
    name: "Market Basket",
    domain: "marketbasket.io",
    href: "https://marketbasket.io/",
    icon: <BarChart3 />,
  },
]

const DEFAULT_LABELS: StreamingAnswerLabels = {
  sources: "10 sources",
  followUps: "Follow-ups",
}

const ACTIONS: { id: StreamingAnswerAction; label: string; icon: ReactNode }[] =
  [
    { id: "copy", label: "Copy", icon: <Copy /> },
    { id: "retry", label: "Retry", icon: <RotateCw /> },
    { id: "like", label: "Good response", icon: <ThumbsUp /> },
    { id: "dislike", label: "Bad response", icon: <ThumbsDown /> },
  ]

function SourceMark({
  source,
  className,
}: {
  source: StreamingSource
  className?: string
}) {
  if (source.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={source.image}
        alt=""
        className={cn("shrink-0 object-cover", className)}
      />
    )
  }
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center bg-brand/10 font-mono text-[calc(8px*var(--text-scale))] text-brand uppercase [&_svg]:size-[70%] [&_svg]:stroke-[2.25]",
        className
      )}
    >
      {source.icon ?? source.name.charAt(0)}
    </span>
  )
}

function SourceChip({ source }: { source?: StreamingSource }) {
  if (!source) return null
  return (
    <a
      data-slot="streaming-answer-citation"
      href={source.href}
      target="_blank"
      rel="noreferrer"
      className="mr-1 inline-flex h-4.5 -translate-y-px animate-pop-in items-center gap-1 rounded-sm border bg-muted px-[3px] align-middle font-mono text-[calc(10.5px*var(--text-scale))] text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
      style={{ animationDuration: "250ms" }}
    >
      <SourceMark source={source} className="size-3 rounded-sm" />
      <span>{source.domain}</span>
    </a>
  )
}

export interface StreamingAnswerProps {
  /** The streamed tokens; `cite` tokens render an inline source chip. */
  content?: StreamingToken[]
  /** Cited sources shown in the chip, avatar stack and expanded list. */
  sources?: StreamingSource[]
  /** Follow-up prompt suggestions shown once the stream completes. */
  followUps?: string[]
  labels?: Partial<StreamingAnswerLabels>
  /** Restart the stream after a hold; turn off when embedding in a real thread. */
  loop?: boolean
  /** Fill the parent width instead of the fixed measure. */
  fill?: boolean
  onDone?: () => void
  /** Fired when a follow-up prompt is chosen. */
  onFollowUp?: (text: string, index: number) => void
  /** Fired when an action icon is pressed. */
  onAction?: (action: StreamingAnswerAction) => void
  className?: string
}

export function StreamingAnswer({
  content = TOKENS,
  sources = SOURCES,
  followUps = FOLLOW_UPS,
  labels,
  loop = true,
  fill = false,
  onDone,
  onFollowUp,
  onAction,
  className,
}: StreamingAnswerProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const [count, setCount] = useState(0)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const done = count >= content.length
  const total = content.length

  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    if (done && !loop) {
      onDoneRef.current?.()
      return
    }
    const t = setTimeout(
      () => setCount((c) => (c >= total ? 0 : c + 1)),
      done ? HOLD_MS : WORD_MS
    )
    return () => clearTimeout(t)
  }, [count, done, loop, total])

  return (
    <div
      data-slot="streaming-answer"
      data-state={done ? "done" : "streaming"}
      className={cn(fill ? "w-full" : "min-h-62 w-full max-w-95", className)}
    >
      <p className="text-[calc(13px*var(--text-scale))] leading-relaxed text-foreground">
        {content.slice(0, count).map((token, i) =>
          token.cite ? (
            <SourceChip key={i} source={sources[0]} />
          ) : (
            <span key={i} className="inline">
              {token.text}{" "}
            </span>
          )
        )}
        {!done && (
          <span
            aria-hidden
            className="ml-0.5 inline-block h-3 w-0.5 translate-y-0.5 animate-fade-in bg-foreground"
            style={{ animationDuration: "150ms" }}
          />
        )}
      </p>

      {/* action icons row */}
      <div
        data-slot="streaming-answer-actions"
        inert={!done}
        className="mt-2 flex items-center gap-0.5 transition-opacity duration-400 ease-out"
        style={{ opacity: done ? 1 : 0 }}
      >
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            onClick={() => onAction?.(action.id)}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground/70 transition-colors duration-100 outline-none hover:bg-accent hover:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring [&_svg]:size-[15px] [&_svg]:stroke-[1.8]"
          >
            {action.icon}
          </button>
        ))}
        <button
          type="button"
          aria-expanded={sourcesOpen}
          onClick={() => setSourcesOpen((current) => !current)}
          className="ml-1.5 flex items-center gap-1.5 rounded-md px-1 py-0.5 text-left transition-colors duration-150 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <span className="flex -space-x-1">
            {sources.map((source) => (
              <SourceMark
                key={source.domain}
                source={source}
                className="size-3.5 rounded-full bg-card ring-[1.5px] ring-background"
              />
            ))}
          </span>
          <span className="text-xs text-muted-foreground">{l.sources}</span>
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        inert={!(done && sourcesOpen)}
        style={{
          gridTemplateRows: done && sourcesOpen ? "1fr" : "0fr",
          opacity: done && sourcesOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div
            data-slot="streaming-answer-sources"
            className="mt-1.5 flex flex-col rounded-lg border bg-muted p-1"
          >
            {sources.map((source) => (
              <a
                key={source.domain}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="group/source flex items-center gap-2 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
              >
                <SourceMark source={source} className="size-4 rounded-sm" />
                <span className="underline decoration-transparent underline-offset-2 transition-[text-decoration-color] duration-150 group-hover/source:decoration-current">
                  {source.name}
                </span>
                <span className="ml-auto font-mono text-[calc(10.5px*var(--text-scale))] text-muted-foreground/70">
                  {source.domain}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* follow-ups */}
      <div
        data-slot="streaming-answer-follow-ups"
        inert={!done}
        className="mt-2.5 transition-opacity duration-400 ease-out"
        style={{ opacity: done ? 1 : 0 }}
      >
        <p className="text-xs font-medium text-muted-foreground">
          {l.followUps}
        </p>
        <div className="mt-0.5 flex flex-col">
          {followUps.map((text, i) => (
            <button
              key={text}
              type="button"
              onClick={() => onFollowUp?.(text, i)}
              className={cn(
                "-mx-1.5 flex items-center gap-2 rounded-md border-b px-1.5 py-1.5 text-left text-[calc(12.5px*var(--text-scale))] text-foreground transition-colors duration-100 outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring",
                done ? "animate-fade-up" : "opacity-0"
              )}
              style={
                done
                  ? {
                      animationDuration: "350ms",
                      animationDelay: `${i * 90}ms`,
                    }
                  : undefined
              }
            >
              <CornerDownLeft
                aria-hidden
                strokeWidth={2}
                className="size-[11px] shrink-0 text-muted-foreground/70"
              />
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
