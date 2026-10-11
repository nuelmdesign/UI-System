# Step Navigation

Non-linear lesson and step navigation with complete, current, available and locked states.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/step-nav
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { StepNav } from "@/components/ui/step-nav"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/progress`

## Props and types

```ts
type StepNavStatus = "complete" | "current" | "locked" | "available"

type StepNavStep = {
  id: string
  label: string
  description?: string
  /** Defaults to "current" for the `current` id and "available" otherwise. */
  status?: StepNavStatus
  /** Why the step is locked. Shown as text and announced. */
  lockedReason?: string
}

type StepNavLabels = {
  navigation: string
  /** Template for the summary. `{done}` and `{total}` are replaced. */
  summary: string
  complete: string
  current: string
  available: string
  locked: string
  /** Fallback reason when a locked step has none. */
  lockedReason: string
}

type StepNavProps = Omit<
  React.ComponentProps<"nav">,
  "children" | "onSelect"
> & {
  steps: StepNavStep[]
  /** Id of the current step. Used for steps without an explicit status. */
  current?: string
  onSelect?: (step: StepNavStep, index: number) => void
  /** `auto` is vertical in narrow containers and horizontal from 42rem up. */
  orientation?: "auto" | "vertical" | "horizontal"
  /** Show the "n of m" summary and bar. */
  showProgress?: boolean
  labels?: Partial<StepNavLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { StepNav, type StepNavStep } from "@/components/ui/step-nav"

const lessons: StepNavStep[] = [
  {
    id: "l1",
    label: "Lesson 1",
    description: "Getting started",
    status: "complete",
  },
  {
    id: "l2",
    label: "Lesson 2",
    description: "Core ideas",
    status: "complete",
  },
  { id: "l3", label: "Lesson 3", description: "Worked examples" },
  {
    id: "l4",
    label: "Lesson 4",
    description: "Final quiz",
    status: "locked",
    lockedReason: "Pass lesson 3 to unlock",
  },
]

const onboarding: StepNavStep[] = [
  {
    id: "docs",
    label: "Identity check",
    description: "Upload documents",
    status: "complete",
  },
  { id: "policy", label: "Policy review", description: "Read and accept" },
  {
    id: "equipment",
    label: "Equipment",
    description: "Request devices",
    status: "locked",
    lockedReason: "Awaiting manager approval",
  },
]

export default function StepNavDemo() {
  const [lesson, setLesson] = React.useState("l3")
  const [task, setTask] = React.useState("policy")

  return (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Course lessons</h3>
        <StepNav
          steps={lessons}
          current={lesson}
          onSelect={(s) => setLesson(s.id)}
          labels={{ navigation: "Lessons" }}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Employee onboarding</h3>
        <StepNav
          orientation="vertical"
          steps={onboarding}
          current={task}
          onSelect={(s) => setTask(s.id)}
          labels={{
            navigation: "Onboarding tasks",
            summary: "{done} of {total} tasks done",
          }}
        />
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/step-nav. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
