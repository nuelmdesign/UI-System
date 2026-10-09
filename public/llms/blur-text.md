# Blur Text

Text that arrives word by word or character by character.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/blur-text
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { BlurText } from "@/components/motion/blur-text"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
type BlurTextProps = {
  text: string
  /** Animate per word (default) or per character. */
  by?: "word" | "char"
  as?: "h1" | "h2" | "h3" | "p" | "span"
  stagger?: number
  delay?: number
  /** Wait until the text scrolls into view. */
  inView?: boolean
  className?: string
}
```

## Example

```tsx
import { BlurText } from "@/components/motion/blur-text"

export default function BlurTextDemo() {
  return (
    <div className="grid gap-4">
      <BlurText
        as="h2"
        text="Text that arrives, word by word."
        className="font-display text-4xl font-light tracking-[-0.02em]"
      />
      <BlurText
        by="char"
        delay={0.6}
        text="Or one character at a time."
        className="text-muted-foreground"
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/blur-text. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
