# Label

Accessible label for form controls.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/label
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Label } from "@/components/ui/label"
```

## Dependencies

- npm: `radix-ui`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Label(props: React.ComponentProps<typeof LabelPrimitive.Root>)
```

## Example

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function LabelDemo() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/label. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
