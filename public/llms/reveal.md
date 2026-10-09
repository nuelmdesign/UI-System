# Reveal

Fades and lifts content into view as it scrolls in.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/reveal
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Reveal } from "@/components/motion/reveal"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
type RevealProps = HTMLMotionProps<"div"> & {
  variant?: keyof typeof presets
  delay?: number
  /** Only animate the first time it scrolls into view. */
  once?: boolean
}
```

## Example

```tsx
import { Reveal } from "@/components/motion/reveal"

const STEPS = ["Tokens", "Components", "Motion"]

export default function RevealDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {STEPS.map((step, i) => (
        <Reveal key={step} delay={i * 0.12} className="border bg-card p-5">
          <p className="eyebrow text-muted-foreground">0{i + 1}</p>
          <p className="mt-3 font-display text-2xl font-light">{step}</p>
        </Reveal>
      ))}
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/reveal. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
