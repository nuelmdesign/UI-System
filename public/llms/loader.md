# Loader

Fifteen loading animations, from spinners to ASCII and metaballs.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/loader
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Loader } from "@/components/motion/loader"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
export type LoaderVariant =
  | "spinner"
  | "dots"
  | "bars"
  | "dot-matrix"
  | "dither"
  | "ascii"
  | "ascii-line"
  | "ascii-braille"
  | "ascii-blocks"
  | "ascii-bounce"
  | "morph"
  | "comet"
  | "scramble"
  | "metaballs"
  | "newton"
  | "helix"
  | "percent"

export interface LoaderProps {
  /** Which animation to render. */
  variant?: LoaderVariant
  /** Base square size in px. Everything scales from this. */
  size?: number
  /** Seconds per animation cycle. */
  speed?: number
  /** Accessible label announced to screen readers. */
  label?: string
  className?: string
}
```

## Example

```tsx
import { Loader, type LoaderVariant } from "@/components/motion/loader"

const VARIANTS: LoaderVariant[] = [
  "spinner",
  "dots",
  "bars",
  "dot-matrix",
  "dither",
  "morph",
  "comet",
  "metaballs",
  "newton",
  "helix",
  "ascii",
  "ascii-braille",
  "ascii-blocks",
  "scramble",
  "percent",
]

export default function LoaderDemo() {
  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5">
      {VARIANTS.map((variant) => (
        <div
          key={variant}
          className="flex h-24 min-w-0 flex-col items-center justify-center gap-3 bg-muted/50"
        >
          <Loader variant={variant} size={28} label={variant} />
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            {variant}
          </span>
        </div>
      ))}
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/loader. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
