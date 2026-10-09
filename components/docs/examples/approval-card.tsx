"use client"

import * as React from "react"

import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/agents/approval-card"

/** Runs `fn` after `ms`; pending timers clear on unmount. */
function useTimers() {
  const timers = React.useRef<number[]>([])
  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), [])
  return React.useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
}

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
          ["Release", "opendraft 0.2"],
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

export default function ApprovalCardDemo() {
  return (
    <div className="grid w-full items-start gap-6 lg:grid-cols-2">
      <QuestionFlow />
      <ReviewFlow />
    </div>
  )
}
