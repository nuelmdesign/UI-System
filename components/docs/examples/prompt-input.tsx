"use client"

import * as React from "react"
import { Brain, FileText, ImagePlus, Puzzle, Sparkles, Zap } from "lucide-react"
import { toast } from "sonner"

import { PromptInput } from "@/components/agents/prompt-input"

const MODELS = [
  { value: "fast", label: "Fast", icon: <Zap /> },
  { value: "balanced", label: "Balanced", icon: <Sparkles /> },
  { value: "deep", label: "Deep thinking", icon: <Brain /> },
]

const ACTIONS = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: <ImagePlus />,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: <Puzzle />,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: <FileText />,
  },
]

export default function PromptInputDemo() {
  const [loading, setLoading] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div className="w-full max-w-xl">
      <PromptInput
        models={MODELS}
        actions={ACTIONS}
        defaultModel="balanced"
        defaultValue="Review the current implementation and suggest the next improvement."
        loading={loading}
        onSubmit={(prompt, model) => {
          setLoading(true)
          timer.current = window.setTimeout(() => {
            setLoading(false)
            toast("Prompt sent", { description: `${model}: ${prompt}` })
          }, 1200)
        }}
        onStop={() => {
          window.clearTimeout(timer.current)
          setLoading(false)
        }}
        onAction={(value) =>
          toast(ACTIONS.find((a) => a.value === value)?.label ?? "Action")
        }
      />
    </div>
  )
}
