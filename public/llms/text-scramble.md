# Text Scramble

Characters scramble, then resolve to the new text.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/text-scramble
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { TextScramble } from "@/components/motion/text-scramble"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
export interface TextScrambleProps {
  /** Final text revealed by the scramble animation. */
  text: string
  /** Maximum animation duration in milliseconds. */
  duration?: number
  /** Characters sampled while unresolved positions are scrambling. */
  glyphs?: string
  className?: string
  style?: CSSProperties
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { TextScramble } from "@/components/motion/text-scramble"
import { Button } from "@/components/ui/button"

const WORDS = ["Thinking", "Searching", "Reasoning", "Composing"]

export default function TextScrambleDemo() {
  const [index, setIndex] = React.useState(0)

  return (
    <div className="flex flex-wrap items-center gap-6">
      <TextScramble
        text={WORDS[index]}
        className="w-48 font-mono text-2xl tracking-wide uppercase"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIndex((i) => (i + 1) % WORDS.length)}
      >
        Next word
      </Button>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/text-scramble. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
