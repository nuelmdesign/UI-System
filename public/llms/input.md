# Input

Text field with focus, invalid and disabled states.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/input
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Input } from "@/components/ui/input"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Input(props: React.ComponentProps<"input">)
```

## Example

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="invalid">Workspace URL</Label>
        <Input id="invalid" defaultValue="my workspace" aria-invalid />
        <p className="text-xs text-destructive">
          Use letters, numbers and dashes.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="disabled">Plan</Label>
        <Input id="disabled" defaultValue="Pro" disabled />
      </div>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/input. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
