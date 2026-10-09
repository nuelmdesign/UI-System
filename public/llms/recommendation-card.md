# Recommendation Card

Recommendation with a confidence meter, an alternatives drawer that swaps the pick, and a confirm action.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/recommendation-card
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { RecommendationCard } from "@/components/agents/recommendation-card"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`

## Props and types

```ts
export type RecommendationTone = "success" | "warning" | "muted"

export type RecommendationOption = {
  key: string
  body: ReactNode
  short: string
  /** Confidence bars lit, 0–3. */
  signal: number
  tone: RecommendationTone
  label: string
  cta: string
  ctaVariant: "default" | "ink" | "outline"
}

export type RecommendationLabels = {
  title: string
  alternatives: string
  otherOptions: string
  accepted: string
}

export interface RecommendationCardProps {
  options?: RecommendationOption[]
  labels?: Partial<RecommendationLabels>
  /** Fired with the option key when its action is pressed. */
  onAccept?: (key: string) => void
  className?: string
}
```

## Example

```tsx
"use client"

import { RecommendationCard } from "@/components/agents/recommendation-card"

export default function RecommendationCardDemo() {
  return (
    <div className="flex w-full justify-center">
      <RecommendationCard onAccept={(key) => console.log("accepted:", key)} />
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/recommendation-card. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
