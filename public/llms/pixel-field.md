# Pixel Field

Canvas pixel textures in the blue scale: mosaic, dot matrix and equalizer.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/pixel-field
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { PixelField } from "@/components/motion/pixel-field"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`, `@opendraft/theme`

## Props and types

```ts
type PixelFieldVariant = "mosaic" | "matrix" | "equalizer"

type PixelFieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  /**
   * mosaic: drifting blue pixel gradient (hero panels).
   * matrix: faint dot grid with a few cells blinking on (section texture).
   * equalizer: dot columns rising and falling like a level meter (bands).
   */
  variant?: PixelFieldVariant
  /** Cell pitch in CSS px. Defaults per variant. */
  cell?: number
  /** Animation speed multiplier. 0 renders a still frame. */
  speed?: number
  children?: React.ReactNode
}
```

## Example

```tsx
import { PixelField } from "@/components/motion/pixel-field"

export default function PixelFieldDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {(["mosaic", "matrix", "equalizer"] as const).map((variant) => (
        <div key={variant} className="grid gap-2">
          <PixelField variant={variant} className="h-40 border" />
          <p className="eyebrow text-muted-foreground">{variant}</p>
        </div>
      ))}
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/pixel-field. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
