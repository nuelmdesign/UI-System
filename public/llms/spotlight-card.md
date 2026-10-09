# Spotlight Card

Card whose border and surface light up under the cursor.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/spotlight-card
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SpotlightCard } from "@/components/motion/spotlight-card"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
function SpotlightCard(props: React.ComponentProps<"div"> & { size?: number })
```

## Example

```tsx
import { SpotlightCard } from "@/components/motion/spotlight-card"

export default function SpotlightCardDemo() {
  return (
    <SpotlightCard className="w-full max-w-sm">
      <p className="mb-4 eyebrow text-muted-foreground">Spotlight</p>
      <h3 className="font-display text-2xl font-light tracking-[-0.01em]">
        Move your cursor over me
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The border and surface follow the pointer with a blue glow.
      </p>
    </SpotlightCard>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/spotlight-card. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
