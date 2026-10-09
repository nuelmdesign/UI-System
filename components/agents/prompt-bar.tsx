// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import {
  ArrowUp,
  ChartColumn,
  Check,
  ChevronDown,
  FileText,
  Globe,
  Layers,
  Mail,
  MessagesSquare,
  Mic,
  Paperclip,
  PenTool,
  Plus,
  X,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import {
  type ReactNode,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { GlideMenu } from "@/components/motion/glide-menu"
import { ease } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * PROMPT BAR
 * A composer with real controls: attach, @ data sources,
 * / commands, a model picker, dictation, and send.
 * Type @ or / to open the menus; ↑↓ + Enter to pick.
 * Variants: Rounded (square card) · Pill (full radius).
 * ───────────────────────────────────────────────────────── */

export type PromptBarVariant = "Rounded" | "Pill"

/** An entry in the @ menu. `attach` adds a file chip; `connect` shows a Connect toggle. */
export type PromptBarSource = {
  key: string
  name: string
  description: string
  icon: ReactNode
  attach?: boolean
  connect?: boolean
}

/** An entry in the / menu. `name` includes the leading slash. */
export type PromptBarCommand = {
  key: string
  name: string
  description: string
}

/** A model in the picker. Selecting a `flagship` model plays a one-shot sweep. */
export type PromptBarModel = {
  key: string
  name: string
  tag?: string
  flagship?: boolean
}

const DEFAULT_SOURCES: PromptBarSource[] = [
  {
    key: "attach",
    name: "Add photos & files",
    description: "Upload from your computer",
    icon: <Paperclip />,
    attach: true,
  },
  {
    key: "scoop",
    name: "Scoop Data",
    description: "Sales & churn metrics",
    icon: <ChartColumn />,
  },
  {
    key: "flavors",
    name: "Flavor records",
    description: "26 makers, tags, links",
    icon: <Layers />,
  },
  {
    key: "web",
    name: "Web search",
    description: "Real-time news and info",
    icon: <Globe />,
  },
  {
    key: "design",
    name: "Design files",
    description: "Design-to-code workflows",
    icon: <PenTool />,
  },
  {
    key: "chat",
    name: "Team chat",
    description: "Read and manage channels",
    icon: <MessagesSquare />,
  },
  {
    key: "mail",
    name: "Email",
    description: "Read and manage your inbox",
    icon: <Mail />,
    connect: true,
  },
]

const DEFAULT_COMMANDS: PromptBarCommand[] = [
  { key: "compare", name: "/compare", description: "Flavor vs. last summer" },
  {
    key: "churn-plan",
    name: "/churn-plan",
    description: "Draft a churn schedule",
  },
  { key: "restock", name: "/restock", description: "Build a reorder list" },
  {
    key: "draft-email",
    name: "/draft-email",
    description: "Write a supplier email",
  },
  {
    key: "summarize",
    name: "/summarize",
    description: "Digest the thread so far",
  },
]

const DEFAULT_MODELS: PromptBarModel[] = [
  { key: "sprinkles-5", name: "Sprinkles 5", tag: "Flagship", flagship: true },
  { key: "vanilla-1", name: "Vanilla 1", tag: "Basic" },
  { key: "freezer-burn", name: "Freezer Burn 0.4", tag: "Stale" },
]

const FILES = ["flavor-chart.png", "summer-menu.pdf", "pos-export.csv"]
const DICTATION = "Compare pistachio weekends to last summer"

/* self-running demo: walk the @ menu, then the / menu, then upgrade the
 * model, and repeat. Any pointer or key interaction hands control to the
 * user. Step 0 matches the initial state. */
const AUTO_STEPS: {
  draft: string
  active?: number
  connect?: boolean
  modelOpen?: boolean
  model?: string
  hold: number
}[] = [
  { draft: "", connect: false, model: "vanilla-1", hold: 1100 },
  { draft: "@", active: 0, hold: 900 },
  { draft: "@", active: 1, hold: 620 },
  { draft: "@", active: 4, hold: 620 },
  { draft: "@", active: 6, hold: 700 },
  { draft: "@", active: 6, connect: true, hold: 1000 },
  { draft: "", hold: 700 },
  { draft: "/", active: 0, hold: 900 },
  { draft: "/", active: 1, hold: 620 },
  { draft: "/", active: 3, hold: 1000 },
  { draft: "", hold: 800 },
  // open the model picker and upgrade to the flagship → blue sweep
  { draft: "", modelOpen: true, hold: 1200 },
  { draft: "", model: "sprinkles-5", hold: 2400 },
  { draft: "", hold: 900 },
]

/* the last @word or /word being typed, if any */
function parseToken(
  draft: string
): { kind: "at" | "slash"; query: string; start: number } | null {
  const match = /(^|\s)([@/])([\w-]*)$/.exec(draft)
  if (!match) return null
  return {
    kind: match[2] === "@" ? "at" : "slash",
    query: match[3].toLowerCase(),
    start: match.index + match[1].length,
  }
}

export type PromptBarProps = {
  variant?: PromptBarVariant
  /** The self-running walkthrough; turn off when embedding in a real surface. */
  demo?: boolean
  /** Hero sizing: a multi-line input with controls on their own row. */
  tall?: boolean
  placeholder?: string
  /** Entries in the @ menu. */
  sources?: PromptBarSource[]
  /** Entries in the / menu. */
  commands?: PromptBarCommand[]
  /** Models in the picker; the second one starts selected (the first if only one). */
  models?: PromptBarModel[]
  onSend?: (text: string) => void
  className?: string
}

export function PromptBar({
  variant = "Rounded",
  demo = true,
  tall = false,
  placeholder,
  sources = DEFAULT_SOURCES,
  commands = DEFAULT_COMMANDS,
  models = DEFAULT_MODELS,
  onSend,
  className,
}: PromptBarProps) {
  const pill = variant === "Pill"
  const reduceMotion = useReducedMotion()
  const [draft, setDraft] = useState("")
  const [dismissed, setDismissed] = useState(false)
  const [plusOpen, setPlusOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [model, setModel] = useState(models[1] ?? models[0])
  const [attachments, setAttachments] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const [active, setActive] = useState(0)
  const [engaged, setEngaged] = useState(false)
  const [listening, setListening] = useState(false)
  const [auto, setAuto] = useState(demo)
  const [autoStep, setAutoStep] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [sweep, setSweep] = useState(0)
  const [modelMenu, setModelMenu] = useState({ left: 0, bottom: 0 })
  const wide = expanded || tall

  const rootRef = useRef<HTMLDivElement>(null)
  const composerAnchorRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const modelRef = useRef<HTMLButtonElement>(null)

  /* hand control to the user: stop the demo loop, and when they aim at
   * the input itself, clear the demo's leftover draft for a clean start */
  const takeOver = (event: { target: EventTarget | null }) => {
    if (!auto) return
    setAuto(false)
    if (event.target === inputRef.current) setDraft("")
  }

  const token = dismissed ? null : parseToken(draft)
  const menu: "at" | "slash" | null = plusOpen ? "at" : (token?.kind ?? null)
  const query = plusOpen ? "" : (token?.query ?? "")

  const rows: (PromptBarSource | PromptBarCommand)[] =
    menu === "at"
      ? sources.filter((s) => s.name.toLowerCase().includes(query))
      : menu === "slash"
        ? commands.filter((c) => c.name.slice(1).startsWith(query))
        : []

  /* a new menu or query starts the highlight back at the top */
  const menuKey = `${menu}:${query}`
  const [prevMenuKey, setPrevMenuKey] = useState(menuKey)
  if (prevMenuKey !== menuKey) {
    setPrevMenuKey(menuKey)
    setActive(0)
    setEngaged(false)
  }

  /* The menu is outside the clipped composer, so align it to the model
   * trigger by measurement instead of pinning it to the far-right edge. */
  useLayoutEffect(() => {
    if (!modelOpen || !composerAnchorRef.current || !modelRef.current) return
    const anchorRect = composerAnchorRef.current.getBoundingClientRect()
    const triggerRect = modelRef.current.getBoundingClientRect()
    setModelMenu({
      left: Math.max(
        0,
        Math.min(triggerRect.left - anchorRect.left, anchorRect.width - 176)
      ),
      bottom: anchorRect.bottom - triggerRect.top + 8,
    })
  }, [modelOpen, wide, model.name])

  const selectModel = (next: PromptBarModel) => {
    setModel(next)
    setModelOpen(false)
    // Restart the one-shot sweep across the composer interior.
    if (next.flagship && !reduceMotion) setSweep((n) => n + 1)
  }

  /* autoplay: after the current step's hold, apply the next one */
  const advance = useEffectEvent(() => {
    const nextIndex = autoStep + 1
    const step = AUTO_STEPS[nextIndex % AUTO_STEPS.length]
    setDraft(step.draft)
    setDismissed(false)
    setPlusOpen(false)
    if (step.active !== undefined) setActive(step.active)
    if (step.connect !== undefined) setConnected(step.connect)
    if (step.modelOpen !== undefined) setModelOpen(step.modelOpen)
    if (step.model) {
      const next = models.find((m) => m.key === step.model)
      if (next) selectModel(next)
    }
    setAutoStep(nextIndex)
  })

  useEffect(() => {
    if (!auto) return
    const step = AUTO_STEPS[autoStep % AUTO_STEPS.length]
    const t = window.setTimeout(advance, step.hold)
    return () => window.clearTimeout(t)
  }, [auto, autoStep])

  /* dictation resolves after a beat, like a real transcript landing */
  useEffect(() => {
    if (!listening) return
    const t = window.setTimeout(() => {
      setDraft((current) =>
        current ? `${current.trimEnd()} ${DICTATION}` : DICTATION
      )
      setListening(false)
      inputRef.current?.focus()
    }, 2200)
    return () => window.clearTimeout(t)
  }, [listening])

  /* Move wrapped text above the controls, then grow to a compact maximum. */
  useLayoutEffect(() => {
    const input = inputRef.current
    const controls = controlsRef.current
    const measure = measureRef.current
    const modelButton = modelRef.current
    if (!input || !controls || !measure || !modelButton) return

    const fixedControlsWidth = 28 * 3 + modelButton.offsetWidth
    const inlineGaps = 4 * 4
    const inlineInputWidth =
      controls.clientWidth - fixedControlsWidth - inlineGaps
    const needsFullWidth =
      draft.includes("\n") || measure.offsetWidth + 8 > inlineInputWidth
    if (needsFullWidth !== expanded) setExpanded(needsFullWidth)

    const minHeight = 28
    const maxHeight = 100
    input.style.height = "0px"
    const contentHeight = input.scrollHeight
    input.style.height = `${Math.min(Math.max(contentHeight, minHeight), maxHeight)}px`
    input.style.overflowY = contentHeight > maxHeight ? "auto" : "hidden"
  }, [draft, expanded])

  /* clicking anywhere outside the composer closes the open menus */
  useEffect(() => {
    if (!modelOpen && !plusOpen) return
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setModelOpen(false)
        setPlusOpen(false)
      }
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [modelOpen, plusOpen])

  const closeMenus = () => {
    setPlusOpen(false)
    setModelOpen(false)
  }

  const pick = (row: PromptBarSource | PromptBarCommand | undefined) => {
    if (!row) return
    const source =
      menu === "at" ? sources.find((s) => s.key === row.key) : undefined
    const head = token ? draft.slice(0, token.start) : draft
    if (source?.attach) {
      setAttachments((current) => [
        ...current,
        FILES[current.length % FILES.length],
      ])
      if (token) setDraft(head)
    } else if (menu === "at") {
      setDraft(`${head}@${row.name} `)
    } else {
      setDraft(`${head}${row.name} `)
    }
    setPlusOpen(false)
    setDismissed(false)
    inputRef.current?.focus()
  }

  const canSend = draft.trim().length > 0 || attachments.length > 0
  const send = () => {
    if (!canSend) return
    onSend?.(draft.trim())
    setDraft("")
    setAttachments([])
    closeMenus()
  }

  const control = pill ? "rounded-full" : "rounded-md"
  const showHighlight = (engaged || auto) && active < rows.length

  return (
    <div
      ref={rootRef}
      data-slot="prompt-bar"
      data-variant={variant}
      className={cn(
        demo
          ? "flex min-h-[384px] w-full max-w-105 flex-col justify-end pb-8"
          : "w-full",
        className
      )}
      onPointerDownCapture={takeOver}
      onKeyDownCapture={takeOver}
    >
      {/* composer is the anchor — menus grow up from its top edge */}
      <div ref={composerAnchorRef} className="relative">
        {/* ── @ / slash menu ─────────────────────────────── */}
        {menu && (
          <div
            data-slot="prompt-bar-menu"
            onMouseLeave={() => setEngaged(false)}
            className="absolute inset-x-0 bottom-full z-10 mb-2 origin-bottom animate-pop-in rounded-lg border bg-popover p-1 text-popover-foreground shadow-md [--pop-y:4px]"
          >
            <div className="relative">
              {/* single highlight glides to the active row (rows are h-9) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-9 rounded-md bg-accent transition-[transform,opacity] duration-200 ease-out"
                style={{
                  transform: `translateY(${active * 100}%)`,
                  opacity: showHighlight ? 1 : 0,
                }}
              />
              {rows.map((row, i) => {
                const source =
                  menu === "at"
                    ? sources.find((s) => s.key === row.key)
                    : undefined
                return (
                  <button
                    key={row.key}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => {
                      setActive(i)
                      setEngaged(true)
                    }}
                    onClick={() => pick(row)}
                    className="relative z-10 flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left outline-none"
                  >
                    {source && (
                      <span className="flex size-5.5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-[15px]">
                        {source.icon}
                      </span>
                    )}
                    <span className="shrink-0 text-[12.5px] font-medium text-foreground">
                      {row.name}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground/70">
                      {row.description}
                    </span>
                    {source?.connect && (
                      <span
                        role="button"
                        tabIndex={-1}
                        onClick={(event) => {
                          event.stopPropagation()
                          setConnected((current) => !current)
                        }}
                        className={cn(
                          "shrink-0 text-xs font-medium transition-colors duration-100",
                          connected
                            ? "text-success"
                            : "text-brand hover:underline"
                        )}
                      >
                        {connected ? "Connected" : "Connect"}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {rows.length === 0 && (
              <div className="flex h-9 items-center px-2 text-xs text-muted-foreground/70">
                No matches for “{query}”
              </div>
            )}
            <div className="mt-1 border-t px-2 pt-1.5 pb-1 text-[11px] text-muted-foreground/70">
              {menu === "at"
                ? "Type to search sources & files"
                : "Type to search commands"}
            </div>
          </div>
        )}

        {/* ── model menu ─────────────────────────────────── */}
        {modelOpen && (
          <GlideMenu
            data-slot="prompt-bar-models"
            highlightClassName="bg-accent"
            className="absolute z-10 w-44 origin-bottom-left animate-pop-in rounded-lg border bg-popover p-1 text-popover-foreground shadow-md [--pop-y:4px]"
            style={{ left: modelMenu.left, bottom: modelMenu.bottom }}
          >
            {models.map((m) => (
              <button
                key={m.key}
                type="button"
                data-menu-row
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  selectModel(m)
                  inputRef.current?.focus()
                }}
                className="relative z-10 flex h-7.5 w-full items-center gap-2 rounded-md px-2 text-left outline-none"
              >
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-foreground">
                  {m.name}
                </span>
                {m.tag && (
                  <span className="shrink-0 text-[11px] text-muted-foreground/70">
                    {m.tag}
                  </span>
                )}
                <Check
                  aria-hidden
                  strokeWidth={2.5}
                  className={cn(
                    "size-3.25 shrink-0 text-foreground",
                    m.key !== model.key && "invisible"
                  )}
                />
              </button>
            ))}
          </GlideMenu>
        )}

        {/* ── composer ───────────────────────────────────── */}
        <div
          data-slot="prompt-bar-composer"
          className={cn(
            "relative isolate flex flex-col overflow-hidden border bg-card transition-[border-color,border-radius] duration-150 ease-out focus-within:border-brand/50",
            tall ? "gap-2.5 p-3.5" : "gap-1.5 p-1.5",
            pill
              ? attachments.length > 0 || wide
                ? "rounded-[22px]"
                : "rounded-full"
              : "rounded-lg"
          )}
        >
          {/* one-shot blue sweep across the interior on a flagship upgrade */}
          {sweep > 0 && (
            <motion.span
              key={sweep}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-2/3 bg-linear-to-r from-transparent via-blue-400/40 to-transparent"
              initial={{ x: "-100%", opacity: 1 }}
              animate={{ x: "160%", opacity: [1, 1, 0] }}
              transition={{ duration: 0.65, ease: ease.out }}
            />
          )}
          <span
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute text-[13px] leading-[18px] whitespace-pre"
          >
            {draft}
          </span>

          {attachments.length > 0 && (
            <div
              className={cn(
                "flex flex-wrap gap-1.5 pt-0.5",
                pill ? "px-1" : "px-0.5"
              )}
            >
              {attachments.map((file, i) => (
                <span
                  key={`${file}-${i}`}
                  data-slot="prompt-bar-attachment"
                  className={cn(
                    "flex h-6.5 animate-pop-in items-center gap-1.5 border bg-muted py-1 pr-1 pl-1.5 text-[11.5px] text-muted-foreground",
                    control
                  )}
                >
                  <FileText aria-hidden className="size-3" />
                  <span className="max-w-36 truncate">{file}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${file}`}
                    onClick={() =>
                      setAttachments((current) =>
                        current.filter((_, j) => j !== i)
                      )
                    }
                    className={cn(
                      "-my-1 flex size-6 items-center justify-center text-muted-foreground/70 transition-colors duration-100 hover:bg-accent hover:text-foreground",
                      control
                    )}
                  >
                    <X aria-hidden strokeWidth={2.5} className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div
            ref={controlsRef}
            className={cn(
              "grid items-end gap-x-1 gap-y-1.5",
              wide
                ? "grid-cols-[28px_auto_minmax(0,1fr)_28px_28px]"
                : "grid-cols-[28px_minmax(0,1fr)_auto_28px_28px]"
            )}
          >
            <button
              type="button"
              aria-label="Add attachments and sources"
              aria-expanded={plusOpen}
              onClick={() => {
                setModelOpen(false)
                setPlusOpen((current) => !current)
                inputRef.current?.focus()
              }}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center justify-self-start text-muted-foreground/70 transition-[background-color,color,transform] duration-150 ease-out hover:bg-accent hover:text-foreground active:scale-[0.94]",
                control,
                plusOpen && "bg-accent text-foreground",
                "col-start-1",
                wide ? "row-start-2" : "row-start-1"
              )}
            >
              <Plus aria-hidden strokeWidth={2} className="size-4" />
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setDismissed(false)
                setPlusOpen(false)
              }}
              onKeyDown={(event) => {
                if (menu && rows.length > 0) {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault()
                    setEngaged(true)
                    setActive(
                      (current) =>
                        (current +
                          (event.key === "ArrowDown" ? 1 : rows.length - 1)) %
                        rows.length
                    )
                    return
                  }
                  if (
                    (event.key === "Enter" && !event.shiftKey) ||
                    event.key === "Tab"
                  ) {
                    event.preventDefault()
                    pick(rows[active])
                    return
                  }
                }
                if (event.key === "Escape") {
                  setDismissed(true)
                  closeMenus()
                  return
                }
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  send()
                }
              }}
              placeholder={
                listening ? "Listening…" : (placeholder ?? "Write a message…")
              }
              aria-label="Prompt"
              className={cn(
                tall
                  ? "min-h-[68px] px-2 py-2 text-sm leading-5"
                  : "min-h-7 px-1 py-[5px] text-[13px] leading-[18px]",
                "w-full min-w-0 resize-none bg-transparent [overflow-wrap:anywhere] text-foreground outline-none placeholder:text-muted-foreground/70",
                wide
                  ? "col-span-full col-start-1 row-start-1"
                  : "col-start-2 row-start-1"
              )}
            />

            {/* model picker */}
            <button
              ref={modelRef}
              type="button"
              aria-expanded={modelOpen}
              aria-label="Choose model"
              onClick={() => {
                setPlusOpen(false)
                setModelOpen((current) => !current)
              }}
              className={cn(
                "flex h-7 shrink-0 items-center gap-1 px-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out hover:bg-accent hover:text-foreground",
                control,
                modelOpen && "bg-accent text-foreground",
                wide
                  ? "col-start-2 row-start-2 justify-self-start"
                  : "col-start-3 row-start-1"
              )}
            >
              {model.name}
              <ChevronDown
                aria-hidden
                strokeWidth={2.4}
                className="size-2.75 text-muted-foreground/70"
              />
            </button>

            {/* dictation */}
            <button
              type="button"
              aria-label={listening ? "Stop dictation" : "Start dictation"}
              aria-pressed={listening}
              onClick={() => setListening((current) => !current)}
              className={cn(
                "col-start-4 flex size-7 shrink-0 items-center justify-center transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.94]",
                control,
                listening
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground/70 hover:bg-accent hover:text-foreground",
                wide ? "row-start-2" : "row-start-1"
              )}
            >
              {listening ? (
                <span className="flex h-3.5 items-center gap-[2.5px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-full w-[2.5px] animate-eq rounded-full bg-current"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
              ) : (
                <Mic aria-hidden strokeWidth={2} className="size-[15px]" />
              )}
            </button>

            {/* send — square (round in the pill variant) */}
            <button
              type="button"
              aria-label="Send"
              disabled={!canSend}
              onClick={send}
              className={cn(
                "col-start-5 flex size-7 shrink-0 items-center justify-center transition-[background-color,color,transform] duration-200 ease-out enabled:active:scale-[0.94]",
                control,
                canSend
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground",
                wide ? "row-start-2" : "row-start-1"
              )}
            >
              <ArrowUp aria-hidden strokeWidth={2.4} className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
