# Button

Primary, ink, secondary, outline, ghost, destructive and link, with a loading state.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/button
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Button, Spinner } from "@/components/ui/button"
```

## Dependencies

- npm: `radix-ui`, `class-variance-authority`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function Spinner(props: { className?: string })
```

## Variants

- `variant`: `default` (default), `brand`, `ink`, `secondary`, `outline`, `ghost`, `destructive`, `link`
- `size`: `xs`, `sm`, `default` (default), `lg`, `xl`, `icon`, `icon-sm`, `icon-xs`
- `caps`: `true`, `false` (default)

## Example

```tsx
"use client"

import * as React from "react"
import { ArrowRight, Plus, Sparkles, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Default</Button>
        <Button variant="ink">Ink</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">
          <Trash2 /> Delete
        </Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="lg">
          <Sparkles /> Large
        </Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <Plus />
        </Button>
        <Button caps>
          Start for free <ArrowRight />
        </Button>
        <Button
          variant="outline"
          loading={loading}
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 1500)
          }}
        >
          Click to load
        </Button>
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/button. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
