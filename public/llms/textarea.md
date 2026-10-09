# Textarea

Multi-line text field that grows with its content.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/textarea
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Textarea } from "@/components/ui/textarea"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Textarea(props: React.ComponentProps<"textarea">)
```

## Example

```tsx
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Tell us a bit more…" />
      <p className="text-xs text-muted-foreground">
        Grows with its content up to the space available.
      </p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/textarea. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
