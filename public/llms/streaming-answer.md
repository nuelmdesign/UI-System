# Streaming Answer

An answer that streams in word by word with an inline citation, then shows actions, sources and follow-ups.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/streaming-answer
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { StreamingAnswer } from "@/components/agents/streaming-answer"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
/** One streamed word, or a `cite` placeholder that renders an inline source chip. */
export type StreamingToken = { text: string; cite?: boolean }

/** One cited source, shown in the inline chip, the avatar stack and the list. */
export type StreamingSource = {
  name: string
  domain: string
  href: string
  /** Favicon URL. When absent, `icon` (or the first letter) is shown. */
  image?: string
  icon?: ReactNode
}

export type StreamingAnswerAction = "copy" | "retry" | "like" | "dislike"

export type StreamingAnswerLabels = {
  /** Label on the collapsed sources toggle. */
  sources: string
  /** Heading above the follow-up prompts. */
  followUps: string
}

export interface StreamingAnswerProps {
  /** The streamed tokens; `cite` tokens render an inline source chip. */
  content?: StreamingToken[]
  /** Cited sources shown in the chip, avatar stack and expanded list. */
  sources?: StreamingSource[]
  /** Follow-up prompt suggestions shown once the stream completes. */
  followUps?: string[]
  labels?: Partial<StreamingAnswerLabels>
  /** Restart the stream after a hold; turn off when embedding in a real thread. */
  loop?: boolean
  /** Fill the parent width instead of the fixed measure. */
  fill?: boolean
  onDone?: () => void
  /** Fired when a follow-up prompt is chosen. */
  onFollowUp?: (text: string, index: number) => void
  /** Fired when an action icon is pressed. */
  onAction?: (action: StreamingAnswerAction) => void
  className?: string
}
```

## Example

```tsx
"use client"

import { StreamingAnswer } from "@/components/agents/streaming-answer"

export default function StreamingAnswerDemo() {
  return (
    <div className="flex w-full justify-center">
      <StreamingAnswer />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/streaming-answer. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
