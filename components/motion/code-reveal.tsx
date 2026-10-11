"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** One syntax-colored span of a line. */
type Token = { text: string; tone?: "keyword" | "string" | "comment" | "var" }

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "const",
  "return",
  "function",
  "npx",
])

/** A tiny highlighter: comments, strings, keywords and CSS variables. Enough for a backdrop. */
function tokenize(line: string): Token[] {
  const comment = line.indexOf("//")
  const head = comment === -1 ? line : line.slice(0, comment)
  const tail = comment === -1 ? "" : line.slice(comment)
  const out: Token[] = []
  const re = /("[^"]*"|'[^']*'|--[\w-]+|[A-Za-z_@][\w@/.-]*|\s+|.)/g
  for (const m of head.matchAll(re)) {
    const t = m[0]
    if (t.startsWith('"') || t.startsWith("'"))
      out.push({ text: t, tone: "string" })
    else if (t.startsWith("--")) out.push({ text: t, tone: "var" })
    else if (KEYWORDS.has(t)) out.push({ text: t, tone: "keyword" })
    else out.push({ text: t })
  }
  if (tail) out.push({ text: tail, tone: "comment" })
  return out
}

const TONE: Record<NonNullable<Token["tone"]>, string> = {
  keyword: "text-brand",
  string: "text-success",
  comment: "text-muted-foreground",
  var: "text-warning",
}

function CodeLines({ code }: { code: string }) {
  return (
    <>
      {code.split("\n").map((line, i) => (
        <div key={i} className="min-h-[1.4em]">
          {tokenize(line).map((t, j) => (
            <span key={j} className={t.tone ? TONE[t.tone] : undefined}>
              {t.text}
            </span>
          ))}
        </div>
      ))}
    </>
  )
}

const HIDDEN = "radial-gradient(circle 0px at 50% 50%, #000, transparent)"
const spot = (x: number, y: number, r: number, soft: number) =>
  `radial-gradient(circle ${Math.max(r, 0).toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, #000 0%, rgba(0,0,0,${soft}) 45%, transparent 100%)`

type CodeRevealProps = React.ComponentProps<"div"> & {
  /** The code to hide. Plain text with newlines. */
  code: string
  /** Radius in px of the bright spot under the cursor. */
  radius?: number
  /**
   * Where the code sits. "sides" keeps it out of the middle column so the
   * headline stays clear; "full" fills the whole area.
   */
  area?: "sides" | "full"
}

/**
 * A backdrop of code that is hidden until the pointer moves over it. A bright
 * spot follows the pointer smoothly and a dimmer, slower glow trails behind it.
 * Place it as the first child of a `relative` container; it listens on that
 * parent. On touch screens a slow wandering spot plays instead, and with
 * reduced motion the code is shown faintly and stays still.
 */
function CodeReveal({
  code,
  radius = 150,
  area = "sides",
  className,
  ...props
}: CodeRevealProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const brightRef = React.useRef<HTMLDivElement>(null)
  const dimRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const root = rootRef.current
    const host = root?.parentElement
    const bright = brightRef.current
    const dim = dimRef.current
    if (!root || !host || !bright || !dim) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const coarse = window.matchMedia("(hover: none)").matches
    const target = { x: 0, y: 0, r: 0 }
    const fast = { x: 0, y: 0, r: 0 }
    const slow = { x: 0, y: 0, r: 0 }
    let started = false
    let raf = 0
    let visible = true
    let inside = false

    const draw = () => {
      bright.style.maskImage = bright.style.webkitMaskImage = spot(
        fast.x,
        fast.y,
        fast.r,
        0.55
      )
      dim.style.maskImage = dim.style.webkitMaskImage = spot(
        slow.x,
        slow.y,
        slow.r,
        0.35
      )
    }

    const step = (now: number) => {
      raf = 0
      if (coarse && !inside) {
        const { width, height } = host.getBoundingClientRect()
        target.x = width * (0.5 + 0.42 * Math.sin(now / 2600))
        target.y = height * (0.5 + 0.34 * Math.sin(now / 1900 + 1))
        target.r = radius * 0.85
        if (!started) {
          Object.assign(fast, target)
          Object.assign(slow, target)
          started = true
        }
      }
      fast.x += (target.x - fast.x) * 0.22
      fast.y += (target.y - fast.y) * 0.22
      fast.r += (target.r - fast.r) * 0.18
      slow.x += (target.x - slow.x) * 0.08
      slow.y += (target.y - slow.y) * 0.08
      slow.r += (target.r * 1.9 - slow.r) * 0.06
      draw()
      const settled =
        Math.abs(target.x - slow.x) < 0.5 &&
        Math.abs(target.y - slow.y) < 0.5 &&
        Math.abs(target.r * 1.9 - slow.r) < 0.5
      if (visible && (coarse || !settled)) raf = requestAnimationFrame(step)
    }
    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(step)
    }

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      inside = true
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      target.r = radius
      if (!started) {
        Object.assign(fast, target, { r: 0 })
        Object.assign(slow, target, { r: 0 })
        started = true
      }
      wake()
    }
    const onLeave = () => {
      inside = false
      target.r = 0
      wake()
    }

    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerleave", onLeave)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
    })
    io.observe(host)
    bright.style.maskImage = bright.style.webkitMaskImage = HIDDEN
    dim.style.maskImage = dim.style.webkitMaskImage = HIDDEN
    if (coarse) wake()

    return () => {
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [radius])

  const columns =
    area === "sides"
      ? "grid grid-cols-1 lg:grid-cols-[minmax(0,26%)_1fr_minmax(0,26%)] lg:gap-0"
      : "grid grid-cols-1"
  const layer =
    "absolute inset-0 overflow-hidden px-4 py-6 font-mono text-[12px] leading-[1.4] whitespace-pre sm:px-8"

  return (
    <div
      ref={rootRef}
      data-slot="code-reveal"
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        className
      )}
      {...props}
    >
      <div
        ref={dimRef}
        className={cn(
          layer,
          "[mask-image:radial-gradient(circle_0px_at_50%_50%,#000,transparent)] text-muted-foreground opacity-40 motion-reduce:[mask-image:none] motion-reduce:opacity-20"
        )}
      >
        <div className={columns}>
          <div className="min-w-0">
            <CodeLines code={code} />
          </div>
          {area === "sides" && (
            <>
              <div className="hidden lg:block" />
              <div className="hidden min-w-0 lg:block">
                <CodeLines code={code} />
              </div>
            </>
          )}
        </div>
      </div>
      <div
        ref={brightRef}
        className={cn(
          layer,
          "[mask-image:radial-gradient(circle_0px_at_50%_50%,#000,transparent)] motion-reduce:hidden"
        )}
      >
        <div className={columns}>
          <div className="min-w-0">
            <CodeLines code={code} />
          </div>
          {area === "sides" && (
            <>
              <div className="hidden lg:block" />
              <div className="hidden min-w-0 lg:block">
                <CodeLines code={code} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { CodeReveal }
export type { CodeRevealProps }
