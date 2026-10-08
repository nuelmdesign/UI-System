"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AgentCode } from "@/components/agents/agent-code"
import {
  AgentActivity,
  type AgentActivityItem,
} from "@/components/agents/agent-activity"
import { CodeBlock } from "@/components/agents/code-block"
import { FileDiff, type FileDiffLine } from "@/components/agents/file-diff"
import { TodoList, type TodoItem } from "@/components/agents/todo-list"
import {
  ToolResult,
  ToolResultOutput,
  type ToolResultStatus,
} from "@/components/agents/tool-result"
import {
  AgentProgress,
  ReasoningText,
  ThinkingShimmer,
} from "@/components/agents/loading-states"
import { Loader, type LoaderVariant } from "@/components/motion/loader"

/** Remounts its child on Replay so each demo plays from the start. */
export function Replayable({
  children,
  className,
}: {
  children: (replay: () => void) => React.ReactNode
  className?: string
}) {
  const [run, setRun] = React.useState(0)
  const replay = () => setRun((r) => r + 1)
  return (
    <div className="flex w-full flex-col gap-4">
      <div key={run} className={className}>
        {children(replay)}
      </div>
      <Button
        variant="ghost"
        size="xs"
        className="self-start text-muted-foreground"
        onClick={replay}
      >
        <RotateCcw /> Replay
      </Button>
    </div>
  )
}

/** Reveals `steps` items one by one, then settles on `finalStatus`. */
function useSteps(
  steps: number,
  interval = 420,
  finalStatus: Exclude<ToolResultStatus, "running"> = "success"
) {
  const reduce = useReducedMotion() ?? false
  const [visible, setVisible] = React.useState(0)
  const [status, setStatus] = React.useState<ToolResultStatus>("running")

  React.useEffect(() => {
    if (reduce) return
    const timers = Array.from({ length: steps }, (_, i) =>
      window.setTimeout(() => setVisible(i + 1), i * interval + 180)
    )
    timers.push(
      window.setTimeout(() => setStatus(finalStatus), steps * interval + 480)
    )
    return () => timers.forEach(window.clearTimeout)
  }, [finalStatus, interval, reduce, steps])

  return reduce
    ? { visible: steps, status: finalStatus as ToolResultStatus }
    : { visible, status }
}

/* ------------------------------ Agent Activity ----------------------------- */

const BRIEF: AgentActivityItem = {
  id: "brief",
  type: "step",
  label: "Reading the launch brief",
  status: "active",
}
const SEARCH: AgentActivityItem = {
  id: "search",
  type: "search",
  query: "design systems with motion tokens",
  results: [],
}
const SEARCH_DONE: AgentActivityItem = {
  ...SEARCH,
  results: [
    { id: "linear", title: "Linear Method", domain: "linear.app" },
    { id: "vercel", title: "Geist Design System", domain: "vercel.com" },
    { id: "stripe", title: "Stripe Sessions UI", domain: "stripe.com" },
  ],
  moreCount: 4,
}
const READ: AgentActivityItem = {
  id: "read",
  type: "tool",
  action: "read",
  target: "lib/motion.ts",
}
const FRAMES: AgentActivityItem[][] = [
  [BRIEF],
  [{ ...BRIEF, status: "complete" }, SEARCH],
  [{ ...BRIEF, status: "complete" }, SEARCH_DONE],
  [{ ...BRIEF, status: "complete" }, SEARCH_DONE, READ],
  [
    { ...BRIEF, status: "complete" },
    SEARCH_DONE,
    READ,
    {
      id: "edit",
      type: "tool",
      action: "edit",
      target: "components/ui/tabs.tsx",
      additions: 42,
      deletions: 8,
    },
    { id: "run", type: "tool", action: "run", target: "pnpm build" },
    {
      id: "verify",
      type: "step",
      label: "Checking both themes",
      status: "complete",
    },
  ],
]

function ActivityRun() {
  const reduce = useReducedMotion() ?? false
  const [frame, setFrame] = React.useState(0)
  const [complete, setComplete] = React.useState(false)

  React.useEffect(() => {
    if (reduce) return
    const timers = FRAMES.slice(1).map((_, i) =>
      window.setTimeout(() => setFrame(i + 1), 850 + i * 1050)
    )
    timers.push(
      window.setTimeout(
        () => setComplete(true),
        850 + (FRAMES.length - 2) * 1050 + 900
      )
    )
    return () => timers.forEach(window.clearTimeout)
  }, [reduce])

  const done = reduce || complete
  return (
    <AgentActivity
      items={FRAMES[reduce ? FRAMES.length - 1 : frame]}
      status={done ? "complete" : "working"}
      duration={5.1}
      defaultOpen={reduce}
      collapseOnComplete={!reduce}
      maxHeight={220}
    />
  )
}

export function ActivityDemo() {
  return <Replayable className="min-h-64">{() => <ActivityRun />}</Replayable>
}

/* -------------------------------- Todo List -------------------------------- */

const TASKS = [
  "Inspect the current data flow",
  "Update the response schema",
  "Add coverage for edge cases",
  "Run checks and prepare the result",
]
const TICKS = 4

function TodoRun() {
  const reduce = useReducedMotion() ?? false
  const [tick, setTick] = React.useState(0)

  React.useEffect(() => {
    if (reduce || tick >= TASKS.length * TICKS) return
    const t = window.setTimeout(() => setTick((v) => v + 1), 280)
    return () => window.clearTimeout(t)
  }, [tick, reduce])

  const step = reduce ? TASKS.length * TICKS : tick
  const items: TodoItem[] = TASKS.map((title, i) => {
    const active = step >= i * TICKS && step < (i + 1) * TICKS
    const pct = ((step % TICKS) + 1) * 25
    return {
      id: `task-${i}`,
      title,
      status:
        step >= (i + 1) * TICKS
          ? "completed"
          : active
            ? "in-progress"
            : "pending",
      progress: active ? pct : undefined,
      detail: active ? `${pct}%` : undefined,
    }
  })

  return <TodoList items={items} title="Implementation plan" />
}

export function TodoDemo() {
  return <Replayable className="min-h-64">{() => <TodoRun />}</Replayable>
}

/* ------------------------------- Tool Result ------------------------------- */

const TERMINAL = [
  "$ pnpm build",
  "▲ Next.js 16.4.0 (Turbopack)",
  "✓ Compiled successfully in 1.3s",
  "✓ Finished TypeScript in 4.3s",
  "✓ Generating static pages (4/4)",
  "registry.json: 58 items",
] as const

function TerminalRun({ onReplay }: { onReplay: () => void }) {
  const { visible, status } = useSteps(TERMINAL.length)
  const output = TERMINAL.slice(0, visible).join("\n")
  return (
    <ToolResult
      tool="terminal.run"
      title={status === "running" ? "Building the library" : "Build passed"}
      kind="terminal"
      status={status}
      meta={status === "success" ? "6.1s" : undefined}
      copyText={output}
      onRetry={onReplay}
      maxHeight={150}
    >
      <ToolResultOutput>{output}</ToolResultOutput>
    </ToolResult>
  )
}

const RESPONSE = `{
  "error": "rate_limit_exceeded",
  "retryAfter": 30,
  "requestId": "req_8f21"
}`

function RequestRun({ onReplay }: { onReplay: () => void }) {
  const { visible, status } = useSteps(3, 600, "error")
  return (
    <ToolResult
      tool="http.request"
      title={
        status === "running" ? "Fetching project activity" : "Request failed"
      }
      kind="request"
      status={status}
      meta={status === "error" ? "429" : "GET /v1/activity"}
      copyText={RESPONSE}
      onRetry={onReplay}
      collapseOnComplete={false}
      maxHeight={150}
    >
      {visible < 3 ? (
        <ToolResultOutput>
          {visible === 0
            ? "Preparing request…"
            : visible === 1
              ? "GET /v1/activity\nConnecting…"
              : "GET /v1/activity\nWaiting for response…"}
        </ToolResultOutput>
      ) : (
        <AgentCode code={RESPONSE} language="json" />
      )}
    </ToolResult>
  )
}

export function ToolResultDemo() {
  return (
    <Replayable className="grid min-h-64 gap-3">
      {(replay) => (
        <>
          <TerminalRun onReplay={replay} />
          <RequestRun onReplay={replay} />
        </>
      )}
    </Replayable>
  )
}

/* ------------------------------- Code Block -------------------------------- */

const CODE = [
  'import { motion } from "motion/react"',
  'import { spring } from "@/lib/motion"',
  "",
  "export function Indicator({ active }: { active: boolean }) {",
  "  return (",
  "    <motion.span",
  "      layout",
  "      transition={spring.smooth}",
  '      className={active ? "bg-brand" : "bg-muted"}',
  "    />",
  "  )",
  "}",
]

function CodeRun() {
  const reduce = useReducedMotion() ?? false
  const [lines, setLines] = React.useState(1)

  React.useEffect(() => {
    if (reduce || lines >= CODE.length) return
    const t = window.setTimeout(() => setLines((v) => v + 1), 220)
    return () => window.clearTimeout(t)
  }, [lines, reduce])

  const shown = reduce ? CODE.length : lines
  return (
    <CodeBlock
      filename="indicator.tsx"
      language="tsx"
      code={CODE.slice(0, shown).join("\n")}
      status={shown === CODE.length ? "complete" : "streaming"}
      highlightLines={[7, 8]}
      maxHeight={240}
    />
  )
}

export function CodeBlockDemo() {
  return <Replayable className="min-h-64">{() => <CodeRun />}</Replayable>
}

/* -------------------------------- File Diff -------------------------------- */

const DIFF: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 12,
    newLine: 12,
    content: "export const spring = {",
  },
  {
    id: "2",
    type: "removed",
    oldLine: 13,
    content: '  snappy: { type: "spring", stiffness: 400, damping: 28 },',
  },
  {
    id: "3",
    type: "added",
    newLine: 13,
    content:
      '  snappy: { type: "spring", stiffness: 520, damping: 36, mass: 0.8 },',
  },
  {
    id: "4",
    type: "added",
    newLine: 14,
    content:
      '  pop: { type: "spring", stiffness: 500, damping: 30, mass: 0.58 },',
  },
  { id: "5", oldLine: 14, newLine: 15, content: "}" },
]

function DiffRun() {
  const { visible, status } = useSteps(DIFF.length, 360)
  return (
    <FileDiff
      file="lib/motion.ts"
      lines={DIFF.slice(0, visible)}
      status={status === "success" ? "complete" : "streaming"}
      copyText={DIFF.map((l) => l.content).join("\n")}
      collapseOnComplete={false}
      maxHeight={180}
    />
  )
}

export function FileDiffDemo() {
  return <Replayable>{() => <DiffRun />}</Replayable>
}

/* ------------------------------ Loading states ----------------------------- */

const LOADERS: LoaderVariant[] = [
  "spinner",
  "dots",
  "bars",
  "dot-matrix",
  "dither",
  "morph",
  "comet",
  "metaballs",
  "newton",
  "helix",
  "ascii",
  "ascii-braille",
  "ascii-blocks",
  "scramble",
  "percent",
]

export function LoadingStatesDemo() {
  return (
    <div className="grid w-full gap-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-5">
          <Labeled label="ThinkingShimmer">
            <ThinkingShimmer className="text-base" />
          </Labeled>
          <Labeled label="AgentProgress">
            <AgentProgress
              label="Churning"
              initialSeconds={151.6}
              className="text-base"
            />
          </Labeled>
        </div>
        <div className="grid content-start gap-5">
          {(["cascade", "swap", "scramble"] as const).map((variant) => (
            <Labeled key={variant} label={`ReasoningText · ${variant}`}>
              <ReasoningText
                variant={variant}
                phrases={
                  variant === "scramble"
                    ? ["Thinking", "Searching", "Reasoning", "Composing"]
                    : [
                        "Thinking",
                        "Reading the request",
                        "Working through the details",
                        "Preparing the answer",
                      ]
                }
                className="text-base"
              />
            </Labeled>
          ))}
        </div>
      </div>
      <Labeled label="Loader">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {LOADERS.map((variant) => (
            <div
              key={variant}
              className="flex h-24 min-w-0 flex-col items-center justify-center gap-3 rounded-lg bg-muted/50 text-foreground"
            >
              <Loader variant={variant} size={28} label={variant} />
              <span className="truncate font-mono text-[10px] text-muted-foreground">
                {variant}
              </span>
            </div>
          ))}
        </div>
      </Labeled>
    </div>
  )
}

function Labeled({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <span className="text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}
