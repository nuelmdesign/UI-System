// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import { Check, CodeXml, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * CODE PANEL
 * A light editor panel with two views:
 *   · Code — a line-numbered listing
 *   · Diff — a unified diff: one gutter, a success/destructive
 *     accent bar and row tint, plus word-level add/del highlights.
 * Both share syntax coloring, insets, and wrapping behavior.
 * ───────────────────────────────────────────────────────── */

const FILE = "churn.ts"

const CODE_LINES = [
  "export async function churnBatch() {",
  '  const flavor = await getFlavor("pistachio");',
  "  const base = await dairy.fetch({ flavor });",
  '  await freezer.store(base, { temp: "-16C" });',
  "  if (!base.approved) return null;",
  "  return base.gallons;",
  "}",
]

/** A single run of code within a diff row; `change` tints it as an add/del. */
export type CodePiece = { text: string; change?: "add" | "del" }
/** One row of a unified diff: old/new line numbers, its kind, and its pieces. */
export type DiffRow = {
  old: number | null
  cur: number | null
  type: "ctx" | "add" | "del"
  pieces: CodePiece[]
}
/** Prominent copy strings on the panel. */
export type CodePanelLabels = { copy: string; copied: string }
export type CodePanelVariant = "Code" | "Diff"

const DIFF: DiffRow[] = [
  {
    old: 1,
    cur: 1,
    type: "ctx",
    pieces: [{ text: "export async function churnBatch() {" }],
  },
  {
    old: 2,
    cur: 2,
    type: "ctx",
    pieces: [{ text: '  const flavor = await getFlavor("pistachio");' }],
  },
  {
    old: 3,
    cur: 3,
    type: "ctx",
    pieces: [{ text: "  const base = await dairy.fetch({ flavor });" }],
  },
  {
    old: 4,
    cur: null,
    type: "del",
    pieces: [
      { text: "  await freezer.store(base, { temp: " },
      { text: '"-14C"', change: "del" },
      { text: " });" },
    ],
  },
  {
    old: null,
    cur: 4,
    type: "add",
    pieces: [
      { text: "  await freezer.store(base, { temp: " },
      { text: '"-16C"', change: "add" },
      { text: " });" },
    ],
  },
  {
    old: null,
    cur: 5,
    type: "add",
    pieces: [{ text: "  if (!base.approved) return null;" }],
  },
  {
    old: 5,
    cur: 6,
    type: "ctx",
    pieces: [{ text: "  return base.gallons;" }],
  },
  { old: 6, cur: 7, type: "ctx", pieces: [{ text: "}" }] },
]

/** Hatched accent bar for removed rows. */
const HATCH =
  "repeating-linear-gradient(45deg, var(--destructive) 0, var(--destructive) 1.5px, transparent 1.5px, transparent 3px)"

/* light syntax coloring — keywords, function calls, strings & numbers */
const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "async",
  "function",
  "const",
  "let",
  "var",
  "await",
  "return",
  "if",
  "else",
  "for",
  "while",
  "new",
  "throw",
  "try",
  "catch",
  "null",
  "true",
  "false",
  "undefined",
])
const TOKEN =
  /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`[^`]*`|\b\d+(?:\.\d+)?\b|\b(?:import|from|export|default|async|function|const|let|var|await|return|if|else|for|while|new|throw|try|catch|null|true|false|undefined)\b|[A-Za-z_$][\w$]*(?=\s*\())/g

function highlight(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let last = 0
  let k = 0
  for (const m of text.matchAll(TOKEN)) {
    const idx = m.index ?? 0
    const t = m[0]
    if (idx > last) nodes.push(<span key={k++}>{text.slice(last, idx)}</span>)
    const tone =
      /^["'`]/.test(t) || /^\d/.test(t)
        ? "text-warning" // string / number
        : KEYWORDS.has(t)
          ? "text-brand" // keyword / import / conditional
          : "font-medium text-foreground" // function call
    nodes.push(
      <span key={k++} className={tone}>
        {t}
      </span>
    )
    last = idx + t.length
  }
  if (last < text.length) nodes.push(<span key={k++}>{text.slice(last)}</span>)
  return nodes
}

function Pieces({ pieces }: { pieces: CodePiece[] }) {
  return (
    <>
      {pieces.map((p, i) =>
        p.change ? (
          <span
            key={i}
            className={cn(
              "-mx-px rounded-sm [box-decoration-break:clone] px-0.5",
              p.change === "add" ? "bg-success/20" : "bg-destructive/20"
            )}
          >
            {highlight(p.text)}
          </span>
        ) : (
          <span key={i}>{highlight(p.text)}</span>
        )
      )}
    </>
  )
}

const DEFAULT_LABELS: CodePanelLabels = { copy: "Copy", copied: "Copied" }

export type CodePanelProps = {
  /** Which view to render — "Code" (line-numbered listing) or "Diff". */
  variant?: CodePanelVariant
  /** The lines shown in the Code view. */
  lines?: string[]
  /** Raw text placed on the clipboard by Copy. Defaults to `lines` joined. */
  code?: string
  /** The unified-diff rows shown in the Diff view. */
  diff?: DiffRow[]
  /** Filename shown in the header. */
  filename?: string
  /** Prominent copy strings. */
  labels?: Partial<CodePanelLabels>
  /** Called with the copied text after a successful copy. */
  onCopy?: (text: string) => void
  className?: string
}

function CodePanel({
  variant = "Code",
  lines = CODE_LINES,
  code,
  diff = DIFF,
  filename = FILE,
  labels,
  onCopy,
  className,
}: CodePanelProps) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  const isDiff = variant === "Diff"
  const text = { ...DEFAULT_LABELS, ...labels }
  const raw = code ?? lines.join("\n")

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = () => {
    navigator.clipboard?.writeText(raw).then(() => {
      setCopied(true)
      onCopy?.(raw)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1500)
    })
  }

  const added = diff.filter((r) => r.type === "add").length
  const removed = diff.filter((r) => r.type === "del").length

  return (
    <div
      data-slot="code-panel"
      data-variant={variant}
      className={cn(
        "w-full max-w-105 overflow-hidden rounded-lg border bg-card text-card-foreground",
        className
      )}
    >
      {/* header — file · (diff stat | copy) */}
      <div
        data-slot="code-panel-header"
        className="flex h-11 items-center gap-2 border-b px-4 text-[12.5px]"
      >
        <span className="inline-flex min-w-0 items-center gap-[7px]">
          <CodeXml
            aria-hidden
            className="size-[15px] shrink-0 text-muted-foreground/70"
          />
          <span className="truncate font-mono leading-none text-foreground">
            {filename}
          </span>
        </span>

        {isDiff ? (
          <span className="ml-auto inline-flex items-center gap-2 font-mono text-xs leading-none tabular-nums">
            <span className="text-success">+{added}</span>
            <span className="text-destructive">-{removed}</span>
          </span>
        ) : (
          <button
            type="button"
            aria-label="Copy code"
            onClick={copy}
            className={cn(
              "-mr-1 ml-auto flex h-6 items-center gap-1 rounded-md px-1.5 text-xs font-medium outline-none",
              "transition-colors duration-100 ease-out hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring",
              copied
                ? "text-success"
                : "text-muted-foreground/70 hover:text-foreground"
            )}
          >
            {copied ? (
              <Check aria-hidden className="size-[11px]" strokeWidth={3} />
            ) : (
              <Copy aria-hidden className="size-[11px]" />
            )}
            <span aria-live="polite">{copied ? text.copied : text.copy}</span>
          </button>
        )}
      </div>

      {/* body — equal 12px inset on top / left / right; lines wrap */}
      <div
        data-slot="code-panel-body"
        className="py-3 font-mono text-[12.5px] leading-[1.65] text-muted-foreground"
      >
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-5 w-px bg-border" />
          {isDiff
            ? diff.map((r, i) => {
                const add = r.type === "add"
                const del = r.type === "del"
                // one gutter column: removals keep the old number, additions/context show the new one
                const num = del ? r.old : r.cur
                return (
                  <div
                    key={i}
                    data-slot="code-panel-row"
                    data-type={r.type}
                    className={cn(
                      "relative grid grid-cols-[20px_minmax(0,1fr)] items-start",
                      add && "bg-success/10",
                      del && "bg-destructive/10"
                    )}
                  >
                    {(add || del) && (
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 w-[3px]",
                          add && "bg-success"
                        )}
                        style={del ? { background: HATCH } : undefined}
                      />
                    )}
                    <span
                      className={cn(
                        "text-center text-[11px] select-none",
                        add
                          ? "text-success"
                          : del
                            ? "text-destructive"
                            : "text-muted-foreground/70"
                      )}
                    >
                      {num ?? ""}
                    </span>
                    <code className="pr-3 pl-1 break-words whitespace-pre-wrap">
                      <Pieces pieces={r.pieces} />
                    </code>
                  </div>
                )
              })
            : lines.map((line, i) => (
                <div
                  key={i}
                  data-slot="code-panel-row"
                  className="grid grid-cols-[20px_minmax(0,1fr)] items-start"
                >
                  <span className="text-center text-[11px] text-muted-foreground/70 select-none">
                    {i + 1}
                  </span>
                  <code className="pr-3 pl-1 break-words whitespace-pre-wrap">
                    {highlight(line)}
                  </code>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}

export { CodePanel }
