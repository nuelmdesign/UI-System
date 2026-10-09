# Tooltip

Short hint on hover or focus, with optional shortcuts.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/tooltip
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
```

## Dependencies

- npm: `radix-ui`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>)

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>)

function TooltipContent(props: React.ComponentProps<typeof TooltipPrimitive.Content>)

function TooltipProvider(props: React.ComponentProps<typeof TooltipPrimitive.Provider>)
```

## Example

```tsx
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Search">
          <Search />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Search
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/tooltip. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
