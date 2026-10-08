"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/agents/approval-card"
import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "@/components/agents/tool-approval"
import {
  ImageGeneration,
  type ImageGenerationStatus,
} from "@/components/agents/image-generation"
import { PixelField } from "@/components/motion/pixel-field"
import { Replayable } from "@/components/site/agent-work-demos"

/** Runs `fn` after `ms`; every pending timer clears on unmount. */
function useTimers() {
  const timers = React.useRef<number[]>([])
  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), [])
  return React.useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
}

/* ------------------------------ Approval Card ------------------------------ */

const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      { value: "focused", label: "A focused starter set" },
      { value: "broad", label: "A broader collection" },
      { value: "flagship", label: "One flagship experience" },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description: "Select every check the agent must pass before it continues.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
]

function QuestionFlow() {
  const [status, setStatus] = React.useState<ApprovalCardStatus>("pending")
  const later = useTimers()
  return (
    <ApprovalCard
      questions={QUESTIONS}
      status={status}
      onSubmit={() => {
        setStatus("submitting")
        later(() => setStatus("answered"), 750)
      }}
      result="Three responses sent to the agent."
    />
  )
}

function ReviewFlow() {
  const [status, setStatus] = React.useState<ApprovalCardStatus>("pending")
  const later = useTimers()
  const finish = (next: ApprovalCardStatus) => {
    setStatus("submitting")
    later(() => setStatus(next), 700)
  }
  return (
    <ApprovalCard
      title="Publish the component update?"
      description="The agent has prepared the release and is waiting for your decision."
      status={status}
      onApprove={() => finish("approved")}
      onRequestChanges={() => finish("changes-requested")}
      onReject={() => finish("rejected")}
      result={
        status === "approved"
          ? "Publishing was approved."
          : status === "changes-requested"
            ? "The agent will wait for revision notes."
            : "Publishing was declined."
      }
    >
      <dl className="grid gap-1 text-xs">
        {[
          ["Release", "nuelm/ui 0.2"],
          ["Checks", "4 passed"],
          ["Visibility", "Public registry"],
        ].map(([term, value]) => (
          <div
            key={term}
            className="flex items-center justify-between gap-4 py-1"
          >
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="font-mono text-foreground/80">{value}</dd>
          </div>
        ))}
      </dl>
    </ApprovalCard>
  )
}

export function ApprovalQuestionDemo() {
  return <Replayable className="min-h-96">{() => <QuestionFlow />}</Replayable>
}

export function ApprovalReviewDemo() {
  return <Replayable className="min-h-72">{() => <ReviewFlow />}</Replayable>
}

/* ------------------------------ Tool Approval ------------------------------ */

function ToolApprovalRun() {
  const [status, setStatus] = React.useState<ToolApprovalStatus>("pending")
  const [open, setOpen] = React.useState(true)
  const later = useTimers()
  const approve = () => {
    setStatus("approving")
    later(() => setStatus("approved"), 600)
    later(() => setStatus("running"), 1150)
    later(() => setStatus("complete"), 2200)
  }
  return (
    <ToolApproval
      tool="terminal.run"
      title={
        status === "pending" ? "Allow this tool to run?" : "Terminal access"
      }
      description="The agent wants to run the build and registry checks in this workspace."
      status={status}
      open={open}
      onOpenChange={setOpen}
      parameters={[
        {
          id: "command",
          label: "Command",
          value: <ToolApprovalCode code="pnpm build" language="bash" />,
        },
        { id: "directory", label: "Directory", value: "UI-System" },
      ]}
      onApprove={approve}
      onAlwaysAllow={approve}
      onDeny={() => setStatus("denied")}
    />
  )
}

export function ToolApprovalDemo() {
  return (
    <Replayable className="min-h-72">{() => <ToolApprovalRun />}</Replayable>
  )
}

/* ----------------------------- Image Generation ---------------------------- */

function GenerationRun({ onReplay }: { onReplay: () => void }) {
  const reduce = useReducedMotion() ?? false
  const [status, setStatus] = React.useState<ImageGenerationStatus>("queued")

  React.useEffect(() => {
    if (reduce) return
    const timers = [
      window.setTimeout(() => setStatus("generating"), 500),
      window.setTimeout(() => setStatus("refining"), 3000),
      window.setTimeout(() => setStatus("complete"), 5200),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [reduce])

  return (
    <ImageGeneration
      label="Blue pixel study, vertical streaks"
      prompt="a soft blue pixel mosaic with vertical streaks"
      resolution="1024 × 1024"
      status={reduce ? "complete" : status}
      onRetry={onReplay}
    >
      <PixelField
        variant="mosaic"
        cell={24}
        speed={0.4}
        className="size-full"
      />
    </ImageGeneration>
  )
}

export function ImageGenerationDemo() {
  return (
    <Replayable className="flex min-h-96 justify-center">
      {(replay) => <GenerationRun onReplay={replay} />}
    </Replayable>
  )
}
