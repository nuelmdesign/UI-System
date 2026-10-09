// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import {
  ArrowUp,
  Check,
  ChevronRight,
  MessageCircleQuestion,
  RotateCcw,
  Scissors,
  Smile,
  Sparkles,
  SpellCheck,
  X,
} from "lucide-react"
import { motion } from "motion/react"
import {
  type ReactNode,
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { ShimmerText } from "@/components/motion/shimmer-text"
import { Button } from "@/components/ui/button"
import { ease } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * SELECTION ACTIONS
 * A contextual AI bar attached beneath selected text. The bar
 * follows the selection while a rewrite streams in, and its
 * width animates between the idle, busy and result modes.
 * ───────────────────────────────────────────────────────── */

const LEAD = "Pistachio holds the top slot all weekend. "
const PICKED =
  "Churn it first thing Saturday so the batch has time to firm up before the afternoon rush."
const REWRITE =
  "Churn pistachio first thing Saturday so the batch has time to fully firm before the afternoon rush."

/** The passage: lead-in text, the selected `original`, and the streamed `rewrite`. */
export type SelectionText = {
  lead: string
  original: string
  rewrite: string
}

/** A single AI action offered in the bar. Omit `action` for a no-op button
 * (e.g. Explain); `busyLabel` is the gerund shown while it runs. */
export type SelectionAction = {
  id: string
  icon: ReactNode
  action?: string
  busyLabel?: string
}

/** The action set: `primary` are always visible; `more` reveal on expand. */
export type SelectionActionSet = {
  primary: SelectionAction[]
  more: SelectionAction[]
}

/** Prominent copy strings. */
export type SelectionActionsLabels = {
  keep: string
  discard: string
  placeholder: string
}

const DEFAULT_TEXT: SelectionText = {
  lead: LEAD,
  original: PICKED,
  rewrite: REWRITE,
}

const DEFAULT_LABELS: SelectionActionsLabels = {
  keep: "Keep",
  discard: "Discard",
  placeholder: "Describe edits",
}

const DEFAULT_ACTIONS: SelectionActionSet = {
  primary: [
    { id: "Explain", icon: <MessageCircleQuestion /> },
    {
      id: "Improve",
      icon: <Sparkles />,
      action: "Improve",
      busyLabel: "Improving",
    },
  ],
  more: [
    {
      id: "Shorten",
      icon: <Scissors />,
      action: "Shorten",
      busyLabel: "Shortening",
    },
    {
      id: "Tone",
      icon: <Smile />,
      action: "Change tone",
      busyLabel: "Changing tone",
    },
    { id: "Grammar", icon: <SpellCheck />, action: "Fix grammar" },
  ],
}

type Mode = "idle" | "thinking" | "streaming" | "result"

/* Padding (2 × 4px) plus hairline border (2 × 1px) around the bar's content. */
const CHROME = 10
/* Width of the send slot (28px button + 2px gap). */
const SEND_SLOT = 30

/* Reveals `text` a word at a time with a short blur/fade. Calls `onProgress`
 * after each word lands (so the bar can follow the reflow) and `onDone`
 * once the last word has settled. */
function StreamText({
  text,
  interval = 55,
  onProgress,
  onDone,
}: {
  text: string
  interval?: number
  onProgress?: () => void
  onDone?: () => void
}) {
  const words = text.split(/(\s+)/).filter(Boolean)
  const [count, setCount] = useState(0)
  const progress = useEffectEvent(() => onProgress?.())
  const done = useEffectEvent(() => onDone?.())

  useEffect(() => {
    progress()
    if (count >= words.length) {
      const t = window.setTimeout(done, 220)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setCount((c) => c + 1), interval)
    return () => window.clearTimeout(t)
  }, [count, words.length, interval])

  return (
    <span data-slot="selection-actions-stream" aria-live="polite">
      {words.slice(0, count).map((word, i) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.24, ease: ease.out }}
          >
            {word}
          </motion.span>
        )
      )}
    </span>
  )
}

export type SelectionActionsProps = {
  /** The passage shown above the bar. */
  text?: Partial<SelectionText>
  /** The AI actions offered in the bar. */
  actions?: SelectionActionSet
  /** Prominent copy strings. */
  labels?: Partial<SelectionActionsLabels>
  /** Called with the action name whenever an edit is run. */
  onAction?: (action: string) => void
  className?: string
}

export function SelectionActions({
  text: textProp,
  actions = DEFAULT_ACTIONS,
  labels,
  onAction,
  className,
}: SelectionActionsProps) {
  const passage = { ...DEFAULT_TEXT, ...textProp }
  const copy = { ...DEFAULT_LABELS, ...labels }
  const [shown, setShown] = useState(false)
  const [mode, setMode] = useState<Mode>("idle")
  const [action, setAction] = useState("Improve")
  const [prompt, setPrompt] = useState("")
  const [typingWidth, setTypingWidth] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [anchor, setAnchor] = useState({ x: 0, y: 0 })
  const [positioned, setPositioned] = useState(false)

  const hostRef = useRef<HTMLDivElement>(null)
  const selectionRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const previousModeRef = useRef<Mode>("idle")
  const lastWidthRef = useRef(0)
  const widthAnimationRef = useRef<Animation | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setShown(true), 280)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (mode !== "thinking") return
    const timer = window.setTimeout(() => setMode("streaming"), 700)
    return () => window.clearTimeout(timer)
  }, [mode])

  /* Attach beneath the final selected line, while centering the bar
   * against the complete selection bounds. requestAnimationFrame batches
   * streaming reflow measurements and avoids visible intermediate positions. */
  const place = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const host = hostRef.current
      const selection = selectionRef.current
      if (!host || !selection) return

      const bounds = selection.getBoundingClientRect()
      const lastLine = Array.from(selection.getClientRects()).at(-1)
      if (!lastLine) return

      const hostBounds = host.getBoundingClientRect()
      const next = {
        x: Math.round(bounds.left - hostBounds.left + bounds.width / 2),
        y: Math.round(lastLine.bottom - hostBounds.top + 8),
      }

      setAnchor((current) =>
        current.x === next.x && current.y === next.y ? current : next
      )
      setPositioned(true)
    })
  }, [])

  useLayoutEffect(() => {
    place()
  }, [mode, place])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const observer = new ResizeObserver(place)
    observer.observe(host)
    window.addEventListener("resize", place)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", place)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [place])

  /* Intrinsic width handles the preset expansion. When the entire content
   * changes between idle, loading and confirmation, animate from the last
   * rendered width to the new intrinsic width before the browser paints. */
  useLayoutEffect(() => {
    const bar = barRef.current
    const content = contentRef.current
    if (!bar || !content) return

    const nextWidth = Math.ceil(content.getBoundingClientRect().width) + CHROME
    const previousWidth =
      lastWidthRef.current || Math.ceil(bar.getBoundingClientRect().width)

    if (
      previousModeRef.current !== mode &&
      Math.abs(nextWidth - previousWidth) > 1
    ) {
      widthAnimationRef.current?.cancel()
      const easing =
        getComputedStyle(bar).getPropertyValue("--ease-out").trim() ||
        "ease-out"
      const animation = bar.animate(
        [{ width: `${previousWidth}px` }, { width: `${nextWidth}px` }],
        { duration: 320, easing }
      )
      widthAnimationRef.current = animation
      animation.onfinish = () => {
        lastWidthRef.current = nextWidth
        widthAnimationRef.current = null
      }
    } else {
      lastWidthRef.current = nextWidth
    }

    previousModeRef.current = mode
  }, [mode])

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const observer = new ResizeObserver(() => {
      if (widthAnimationRef.current?.playState === "running") return
      lastWidthRef.current =
        Math.ceil(content.getBoundingClientRect().width) + CHROME
    })
    observer.observe(content)
    return () => {
      observer.disconnect()
      widthAnimationRef.current?.cancel()
    }
  }, [])

  const run = (nextAction: string) => {
    setAction(nextAction)
    setExpanded(false)
    setMode("thinking")
    onAction?.(nextAction)
  }

  const reset = () => {
    setExpanded(false)
    setPrompt("")
    setTypingWidth(null)
    setAction("Improve")
    setMode("idle")
  }

  const busy = mode === "thinking" || mode === "streaming"
  const visible = shown && positioned
  const hasPrompt = prompt.trim().length > 0
  const typing = mode === "idle" && hasPrompt ? typingWidth : null
  const busyLabel =
    [...actions.primary, ...actions.more].find(
      (item) => item.action === action && item.busyLabel
    )?.busyLabel ?? "Editing"

  const actionButton = (item: SelectionAction) => (
    <Button
      key={item.id}
      type="button"
      variant="ghost"
      size="xs"
      className="shrink-0 gap-1 px-2 text-[12.5px] font-normal"
      onClick={item.action ? () => run(item.action!) : undefined}
    >
      {item.icon}
      {item.id}
    </Button>
  )

  return (
    <div
      data-slot="selection-actions"
      className={cn("w-full max-w-[460px]", className)}
    >
      <div ref={hostRef} className="relative pb-12 select-none">
        <p className="text-[13px] leading-relaxed text-foreground">
          {passage.lead}
          <span
            ref={selectionRef}
            data-slot="selection-actions-selection"
            className="rounded-xs bg-brand/15 box-decoration-clone text-foreground"
          >
            {mode === "idle" || mode === "thinking" ? (
              passage.original
            ) : mode === "streaming" ? (
              <StreamText
                text={passage.rewrite}
                onProgress={place}
                onDone={() => setMode("result")}
              />
            ) : (
              passage.rewrite
            )}
          </span>
        </p>

        <div
          className="absolute top-0 left-0 z-10"
          style={{
            transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0) translateX(-50%)`,
            transition:
              "transform 320ms var(--ease-in-out), opacity 180ms var(--ease-out)",
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "auto" : "none",
            willChange: "transform",
          }}
        >
          {/* A 36px bar wraps 28px controls at a 4px inset. */}
          <div
            ref={barRef}
            data-slot="selection-actions-bar"
            className={cn(
              "flex h-9 w-fit max-w-[calc(100vw-48px)] items-center justify-center gap-0.5 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md",
              visible && "animate-pop-in"
            )}
            style={{ width: typing ?? undefined }}
          >
            <div
              ref={contentRef}
              className="flex w-fit shrink-0 items-center justify-center gap-0.5"
              style={{ width: typing ? typing - CHROME : undefined }}
            >
              {busy && (
                <span
                  role="status"
                  className="inline-flex h-7 items-center gap-1.5 px-2.5 text-[12.5px] whitespace-nowrap text-muted-foreground"
                >
                  <span className="size-3 shrink-0 animate-spin rounded-full border-[1.5px] border-input border-t-muted-foreground [animation-duration:700ms]" />
                  {mode === "thinking" ? (
                    <ShimmerText>{busyLabel}…</ShimmerText>
                  ) : (
                    <span>{busyLabel}…</span>
                  )}
                </span>
              )}

              {mode === "result" && (
                <>
                  <Button
                    type="button"
                    variant="ink"
                    size="xs"
                    className="shrink-0 gap-1 text-[12.5px] font-normal"
                    onClick={reset}
                  >
                    <Check />
                    {copy.keep}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="shrink-0 gap-1 px-2 text-[12.5px] font-normal"
                    onClick={reset}
                  >
                    <X />
                    {copy.discard}
                  </Button>
                  <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />
                  <button
                    type="button"
                    aria-label="Try again"
                    onClick={() => run(action)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/70 transition-[background-color,color,transform] duration-150 ease-out hover:bg-accent hover:text-muted-foreground active:scale-[0.96]"
                  >
                    <RotateCcw aria-hidden className="size-3.5" />
                  </button>
                </>
              )}

              {mode === "idle" && (
                <>
                  <div
                    className="flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,transform] duration-400 ease-out"
                    style={{
                      maxWidth: expanded
                        ? 0
                        : typing
                          ? typing - CHROME - SEND_SLOT - 2
                          : 145,
                      opacity: expanded ? 0 : 1,
                      transform: expanded
                        ? "translateX(-8px)"
                        : "translateX(0)",
                    }}
                  >
                    <form
                      className="flex h-7 shrink-0 items-center transition-[width] duration-400 ease-out"
                      style={{
                        width: typing ? typing - CHROME - SEND_SLOT - 2 : 145,
                      }}
                      onSubmit={(event) => {
                        event.preventDefault()
                        run(prompt.trim() || "Improve")
                      }}
                    >
                      <input
                        value={prompt}
                        onChange={(event) => {
                          const next = event.target.value
                          if (!prompt.trim() && next.trim()) {
                            setTypingWidth(
                              Math.ceil(
                                barRef.current?.getBoundingClientRect().width ??
                                  0
                              )
                            )
                          } else if (!next.trim()) {
                            setTypingWidth(null)
                          }
                          setPrompt(next)
                        }}
                        aria-label={copy.placeholder}
                        placeholder={copy.placeholder}
                        className="h-7 w-full bg-transparent pr-2.5 pl-3 text-[12.5px] text-foreground outline-none placeholder:text-muted-foreground/70"
                      />
                    </form>
                  </div>

                  <div
                    className="flex min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity,transform] duration-400 ease-out"
                    style={{
                      maxWidth: hasPrompt ? 0 : expanded ? 462 : 224,
                      opacity: hasPrompt ? 0 : 1,
                      transform: hasPrompt
                        ? "translateX(-8px)"
                        : "translateX(0)",
                    }}
                  >
                    {!expanded && (
                      <span className="mx-1 h-4 w-px shrink-0 bg-input" />
                    )}
                    {actions.primary.map(actionButton)}

                    <div
                      className="flex min-w-0 items-center gap-0.5 overflow-hidden transition-[max-width,opacity,margin] duration-400 ease-out"
                      style={{
                        maxWidth: expanded ? 262 : 0,
                        opacity: expanded ? 1 : 0,
                        marginLeft: expanded ? 2 : 0,
                      }}
                    >
                      {actions.more.map(actionButton)}
                    </div>

                    <span className="mx-0.5 h-4 w-px shrink-0 bg-border" />
                    <button
                      type="button"
                      aria-label={
                        expanded ? "Show fewer actions" : "Show more actions"
                      }
                      aria-expanded={expanded}
                      onClick={() => setExpanded((value) => !value)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground transition-[background-color,transform] duration-200 ease-out hover:bg-accent active:scale-[0.96]"
                    >
                      <ChevronRight
                        aria-hidden
                        className={cn(
                          "size-3.5 transition-transform duration-400 ease-out",
                          expanded && "rotate-180"
                        )}
                      />
                    </button>
                  </div>

                  <div
                    className="flex min-w-0 items-center overflow-hidden transition-[max-width,opacity,transform] duration-400 ease-out"
                    style={{
                      maxWidth: hasPrompt ? SEND_SLOT : 0,
                      opacity: hasPrompt ? 1 : 0,
                      transform: hasPrompt ? "scale(1)" : "scale(0.88)",
                    }}
                  >
                    <button
                      type="button"
                      aria-label="Send edit instruction"
                      onClick={() => run(prompt.trim())}
                      className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-[opacity,transform] duration-200 ease-out hover:bg-primary/90 active:scale-[0.94]"
                    >
                      <ArrowUp
                        aria-hidden
                        strokeWidth={2.4}
                        className="size-4"
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
