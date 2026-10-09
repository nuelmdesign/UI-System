// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Maximize2,
  Minimize2,
  Square,
} from "lucide-react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * AGENT SCREEN (live viewer)
 * Watch an agent work. The resting card is a framed capture of
 * the agent's screen; hover reveals an "Open" button. Open expands
 * to a full-screen viewer where you can "Teach a task" — which
 * starts recording — collapse (recording keeps running, the timer
 * lives here, not in the overlay), and end it.
 *
 * The screen is a built-in faux window by default; pass a
 * `streamSrc` (image or video URL) to pipe in a real stream.
 * ───────────────────────────────────────────────────────── */

export type AgentScreenVariant = "Default" | "Loading"

export type AgentScreenProps = {
  /** Shown under the card and in the viewer's title bar. */
  agentName?: string
  /** Image or video URL of the agent's screen. Defaults to a faux window. */
  streamSrc?: string
  /** "Loading" shows the connecting state and disables opening. */
  variant?: AgentScreenVariant
  className?: string
}

/** Aspect ratio of the resting capture (a 16:10 desktop). */
const SCREEN_ASPECT = "aspect-[16/10]"
const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|$)/i

const subscribeNever = () => () => {}

function fmt(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

/* macOS-style pointer */
function CursorSvg({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      className={cn("fill-ink stroke-ink-foreground drop-shadow-sm", className)}
      style={style}
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
    </svg>
  )
}

/* the agent's screen — a real stream via streamSrc, else a faux window.
 * Media is absolutely positioned so it always fills its (relative) parent. */
function Screen({
  streamSrc,
  cursor = true,
}: {
  streamSrc?: string
  cursor?: boolean
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-muted">
      {streamSrc ? (
        VIDEO_RE.test(streamSrc) ? (
          <video
            src={streamSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={streamSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      ) : (
        <FauxWindow />
      )}
      {/* a static decorative cursor sitting on the capture */}
      {cursor && (
        <CursorSvg
          className="pointer-events-none absolute size-5"
          style={{ left: "42%", top: "53%" }}
        />
      )}
    </div>
  )
}

/* expanded viewer media — sizes itself within the viewport (bounded by width
 * and height) so the whole screen always fits with no crop */
function MediaSizer({ src }: { src?: string }) {
  const bounds = "max-h-[calc(100vh-150px)] max-w-[min(960px,90vw)]"
  if (!src)
    return (
      <div
        className={cn("relative w-[min(960px,90vw)]", SCREEN_ASPECT, bounds)}
      >
        <div className="absolute inset-0">
          <FauxWindow />
        </div>
      </div>
    )
  const cls = cn("block h-auto w-auto object-contain", bounds)
  return VIDEO_RE.test(src) ? (
    <video src={src} autoPlay muted loop playsInline className={cls} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={cls} />
  )
}

/* connecting state — spinner on a dark screen */
function LoadingScreen() {
  const size = 26
  const stroke = 2
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div
      data-slot="agent-screen-loading"
      role="status"
      className="dark absolute inset-0 bg-background text-foreground"
    >
      {/* the wrapper carries the centering so the spin transform doesn't override it */}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg
          width={size}
          height={size}
          className="block animate-spin"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.18}
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c * 0.72}`}
          />
        </svg>
      </span>
      <span className="absolute inset-x-0 top-[calc(50%+28px)] text-center text-[12.5px] font-medium text-muted-foreground">
        Connecting to agent&apos;s screen
      </span>
    </div>
  )
}

function FauxWindow() {
  return (
    <div
      data-slot="agent-screen-faux"
      aria-hidden
      className="flex h-full w-full flex-col bg-card"
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b bg-muted px-2.5 py-1.5">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-destructive" />
          <span className="size-2 rounded-full bg-warning" />
          <span className="size-2 rounded-full bg-success" />
        </span>
        <span className="ml-1 flex min-w-0 items-center gap-1.5 border-x border-t bg-card px-2 py-1">
          <span className="size-2 shrink-0 rounded-sm bg-brand/20" />
          <span className="h-1.5 w-14 bg-input" />
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-b px-2.5 py-1.5 text-muted-foreground/70">
        <ChevronLeft className="size-3" />
        <ChevronRight className="size-3" />
        <span className="min-w-0 flex-1 truncate rounded-md bg-muted px-2.5 py-[3px] font-mono text-[9px] text-muted-foreground/70">
          scoops.example/suppliers/search
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-3">
        <div className="flex items-center gap-2">
          <span className="grid size-4 place-items-center rounded-sm bg-brand/15 text-[8px] font-bold text-brand">
            s
          </span>
          <span className="h-1.5 w-12 bg-input" />
          <span className="ml-auto h-4 w-12 rounded-md border bg-muted" />
        </div>
        <div className="flex items-center gap-2 rounded-md bg-muted p-2">
          <span className="h-3 flex-1 rounded-sm border bg-card" />
          <span className="h-3 w-9 rounded-sm bg-primary" />
        </div>
        {["w-2/5", "w-1/2", "w-1/3", "w-2/5"].map((w, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="size-6 shrink-0 rounded-full bg-brand/15" />
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className={cn("h-1.5 bg-input", w)} />
              <span className="h-1.5 w-3/5 bg-border" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgentScreen({
  agentName = "Agent",
  streamSrc,
  variant = "Default",
  className,
}: AgentScreenProps) {
  const loading = variant === "Loading"
  const [open, setOpen] = React.useState(false)
  const [recording, setRecording] = React.useState(false)
  const [secs, setSecs] = React.useState(0)
  const [cursorPos, setCursorPos] = React.useState<{
    x: number
    y: number
  } | null>(null)
  const mounted = React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )

  // tick while recording — survives collapse (state lives here, not the overlay)
  React.useEffect(() => {
    if (!recording) return
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [recording])

  // lock scroll + Esc-to-collapse while the viewer is open
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const previous = document.body.style.overflow
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [open])

  const startRecording = () => {
    setSecs(0)
    setRecording(true)
  }
  const endRecording = () => {
    setRecording(false)
    setSecs(0)
  }

  const controls = (
    <div className="flex shrink-0 items-center gap-1.5">
      {recording ? (
        <Button
          variant="destructive"
          size="xs"
          className="gap-1.5 pr-3 pl-2.5"
          onClick={endRecording}
        >
          <Square aria-hidden className="size-2.5 fill-current" />
          End
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="gap-1 pl-2"
          onClick={startRecording}
        >
          <CircleDot aria-hidden />
          Teach a task
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Collapse"
        className="text-muted-foreground/70 hover:text-foreground"
        onClick={() => setOpen(false)}
      >
        <Minimize2 aria-hidden className="size-[15px]" />
      </Button>
    </div>
  )

  return (
    <div
      data-slot="agent-screen"
      data-variant={variant}
      className={cn("w-full max-w-[340px]", className)}
    >
      {/* ── resting card — hover/click scoped to the window only ── */}
      <div
        data-slot="agent-screen-card"
        className={cn(
          "group/screen relative animate-fade-up overflow-hidden rounded-lg border bg-muted transition-[border-color] duration-150 ease-out",
          SCREEN_ASPECT,
          !loading && "cursor-pointer hover:border-foreground/25"
        )}
        onClick={loading ? undefined : () => setOpen(true)}
      >
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Screen streamSrc={streamSrc} />

            {/* hover reveal — scoped to this frame's named group */}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-150 ease-out group-focus-within/screen:bg-ink/15 group-hover/screen:bg-ink/15">
              {recording && (
                <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-md bg-destructive px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-destructive-foreground tabular-nums">
                  <span className="size-1.5 animate-blink rounded-full bg-current" />
                  REC {fmt(secs)}
                </span>
              )}
              <span className="translate-y-1 opacity-0 transition duration-150 ease-out group-focus-within/screen:translate-y-0 group-focus-within/screen:opacity-100 group-hover/screen:translate-y-0 group-hover/screen:opacity-100">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(true)
                  }}
                >
                  <Maximize2 aria-hidden className="size-3.5" />
                  Open
                </Button>
              </span>
            </div>
          </>
        )}
      </div>

      <div className="mt-2.5 truncate px-0.5 text-[13px] font-medium text-foreground">
        {agentName}&apos;s screen
      </div>

      {/* ── expanded viewer — portaled to <body> so it takes over the page ── */}
      {open &&
        mounted &&
        createPortal(
          <div
            data-slot="agent-screen-viewer"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${agentName}'s screen`}
          >
            <div
              className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-[2px] dark:bg-black/60"
              onClick={() => setOpen(false)}
            />
            <div className="relative flex max-h-full animate-pop-in flex-col overflow-hidden rounded-xl border bg-card p-2 pt-0 text-card-foreground shadow-lg">
              {/* title bar — agent name far left, controls right */}
              <div className="flex h-11 shrink-0 items-center justify-between gap-3 px-1.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-[13px] font-semibold text-foreground">
                    {agentName}
                  </span>
                  {recording && (
                    <span
                      data-slot="agent-screen-rec"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-destructive/10 py-0.5 pr-2 pl-1.5 font-mono text-[11.5px] font-medium text-destructive tabular-nums"
                    >
                      <span className="size-2 animate-blink rounded-full bg-destructive" />
                      <span className="sr-only">Recording</span>
                      {fmt(secs)}
                    </span>
                  )}
                </div>
                {controls}
              </div>

              {/* the screen — the media sizes the window so the whole screen fits */}
              <div
                className="relative min-h-0 cursor-none overflow-hidden rounded-md border bg-muted"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  setCursorPos({ x: e.clientX - r.left, y: e.clientY - r.top })
                }}
                onMouseLeave={() => setCursorPos(null)}
              >
                {loading ? (
                  <div
                    className={cn(
                      "relative w-[min(960px,90vw)]",
                      SCREEN_ASPECT
                    )}
                  >
                    <LoadingScreen />
                  </div>
                ) : (
                  <MediaSizer src={streamSrc} />
                )}
                {!loading && cursorPos && (
                  <CursorSvg
                    className="pointer-events-none absolute z-10"
                    style={{ left: cursorPos.x, top: cursorPos.y }}
                  />
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export { AgentScreen }
