# Popover

Floating panel anchored to a trigger.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/popover
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "@/components/ui/popover"
```

## Dependencies

- npm: `radix-ui`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>)

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>)

function PopoverContent(props: React.ComponentProps<typeof PopoverPrimitive.Content>)

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>)
```

## Example

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-3">
        <p className="eyebrow text-muted-foreground">Dimensions</p>
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
          <Label htmlFor="height">Height</Label>
          <Input id="height" defaultValue="auto" className="col-span-2 h-8" />
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/popover. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
