# Prompt Input

Auto-growing prompt box with a model picker, an action menu and send / stop.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/prompt-input
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { PromptInput } from "@/components/agents/prompt-input"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/button`, `@opendraft/popover`, `@opendraft/select`

## Props and types

```ts
export interface PromptModel {
  value: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface PromptAction {
  value: string
  label: ReactNode
  description?: ReactNode
  icon?: ReactNode
  disabled?: boolean
}

export interface PromptInputProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "defaultValue" | "onChange" | "onSubmit" | "children"
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  models?: PromptModel[]
  model?: string
  defaultModel?: string
  onModelChange?: (model: string) => void
  actions?: PromptAction[]
  onAction?: (action: string) => void
  onSubmit?: (value: string, model?: string) => void | Promise<void>
  loading?: boolean
  onStop?: () => void
  minRows?: number
  maxRows?: number
  leadingAction?: ReactNode
  className?: string
}
```

## Example

```tsx
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
```

Live docs: https://opendraft-ui.vercel.app/docs/prompt-input. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
