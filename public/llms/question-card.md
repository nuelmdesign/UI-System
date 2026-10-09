# Question Card

One question at a time in a sliding stack with an odometer step counter and auto-advance on single choice.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/question-card
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { QuestionCard } from "@/components/agents/question-card"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/glide-menu`, `@opendraft/motion`

## Props and types

```ts
export type QuestionCardQuestion = {
  q: string
  type: "radio" | "check"
  options: string[]
}

export type QuestionCardLabels = {
  skip: string
  continue: string
  send: string
  customPlaceholder: string
  sentMessage: string
}

export type QuestionCardAnswers = Record<number, number[]>

export interface QuestionCardProps {
  questions?: QuestionCardQuestion[]
  labels?: Partial<QuestionCardLabels>
  onSubmitted?: (answers: QuestionCardAnswers) => void
  onAnswerChange?: (questionIndex: number, answer: number[]) => void
  /** Show a "Start over" action after sending. */
  resettable?: boolean
  className?: string
}
```

## Example

```tsx
"use client"

import { QuestionCard } from "@/components/agents/question-card"

export default function QuestionCardDemo() {
  return (
    <div className="flex w-full justify-center">
      <QuestionCard
        questions={[
          {
            q: "How many flavors should we launch?",
            type: "radio",
            options: ["Three (core line)", "Five (full case)", "Just one hero"],
          },
          {
            q: "Which mix-ins should we stock?",
            type: "check",
            options: ["Chocolate chips", "Waffle bits", "Sprinkles"],
          },
        ]}
        onSubmitted={(answers) => console.log(answers)}
      />
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/question-card. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
