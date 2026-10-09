# Kbd

Keyboard keys and shortcuts.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/kbd
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Kbd(props: React.ComponentProps<"kbd">)

function KbdGroup(props: React.ComponentProps<"span">)
```

## Example

```tsx
import { Command } from "lucide-react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function KbdDemo() {
  return (
    <div className="grid gap-3 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        Open the command palette
        <KbdGroup>
          <Kbd>
            <Command />
          </Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </p>
      <p className="flex items-center gap-2">
        Send without leaving the input
        <KbdGroup>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
        </KbdGroup>
      </p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/kbd. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
