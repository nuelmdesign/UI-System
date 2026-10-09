# Magnetic

Pulls its child gently toward the cursor.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/magnetic
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Magnetic } from "@/components/motion/magnetic"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
function Magnetic(props: {
  children: React.ReactNode
  strength?: number
  className?: string
})
```

## Example

```tsx
import { Magnetic } from "@/components/motion/magnetic"
import { Button } from "@/components/ui/button"

export default function MagneticDemo() {
  return (
    <Magnetic strength={0.4}>
      <Button size="lg" caps>
        Hover near me
      </Button>
    </Magnetic>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/magnetic. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
