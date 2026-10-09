# Separator

Horizontal or vertical hairline.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/separator
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Separator } from "@/components/ui/separator"
```

## Dependencies

- npm: `radix-ui`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Separator(props: React.ComponentProps<typeof SeparatorPrimitive.Root>)
```

## Example

```tsx
import { Separator } from "@/components/ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <p className="heading text-xl">opendraft</p>
      <p className="text-sm text-muted-foreground">
        A design system for agent interfaces.
      </p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Registry</span>
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/separator. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
