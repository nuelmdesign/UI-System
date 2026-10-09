# Marquee

Seamless scrolling row with faded edges.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/marquee
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Marquee } from "@/components/motion/marquee"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type MarqueeProps = React.ComponentProps<"div"> & {
  /** Seconds per loop. */
  duration?: number
  gap?: string
  reverse?: boolean
  pauseOnHover?: boolean
  /** Fade the edges out. */
  fade?: boolean
}
```

## Example

```tsx
import { Marquee } from "@/components/motion/marquee"

const STACK = [
  "shadcn/ui",
  "Radix",
  "Motion",
  "Tailwind CSS",
  "Shiki",
  "Next.js",
  "Geist",
]

export default function MarqueeDemo() {
  return (
    <Marquee duration={25} gap="3rem" className="w-full py-2">
      {STACK.map((name) => (
        <span
          key={name}
          className="font-display text-2xl text-muted-foreground"
        >
          {name}
        </span>
      ))}
    </Marquee>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/marquee. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
