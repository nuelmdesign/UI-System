# Badge

Small square status label, with an optional dot.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/badge
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Badge } from "@/components/ui/badge"
```

## Dependencies

- npm: `radix-ui`, `class-variance-authority`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Badge(props: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; dot?: boolean })
```

## Variants

- `variant`: `default` (default), `secondary`, `outline`, `brand`, `success`, `warning`, `destructive`

## Example

```tsx
import { Badge } from "@/components/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="brand" dot>
        Brand
      </Badge>
      <Badge variant="success" dot>
        Paid
      </Badge>
      <Badge variant="warning" dot>
        Pending
      </Badge>
      <Badge variant="destructive" dot>
        Failed
      </Badge>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/badge. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
