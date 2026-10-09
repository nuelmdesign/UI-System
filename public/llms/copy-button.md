# Copy Button

Copies a value and morphs its icon into a check.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/copy-button
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { CopyButton } from "@/components/motion/copy-button"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/button`

## Props and types

```ts
function CopyButton(props: Omit<React.ComponentProps<typeof Button>, "onClick" | "children"> & {
  value: string
})
```

## Example

```tsx
import { CopyButton } from "@/components/motion/copy-button"

const COMMAND = "npx shadcn add @opendraft/button"

export default function CopyButtonDemo() {
  return (
    <div className="flex h-10 items-center gap-2 border bg-surface pr-1 pl-3 font-mono text-sm">
      <span className="text-brand">$</span> {COMMAND}
      <CopyButton value={COMMAND} />
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/copy-button. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
