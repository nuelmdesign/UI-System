# Action Swap

Buttons whose label and icon roll, blur or cascade between states.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/action-swap
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { ActionSwapText, ActionSwapIcon, ActionSwapButton } from "@/components/motion/action-swap"
```

Files added to the project:

- `components/motion/action-swap.tsx`
- `components/motion/action-swap-roll.tsx`

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
export type ActionSwapItem = {
  id: string
  label: ReactNode
  icon?: ReactNode
  ariaLabel?: string
}

export type ActionSwapButtonVariant =
  "primary" | "secondary" | "outline" | "ghost"

export type ActionSwapButtonSize = "sm" | "md" | "lg" | "icon"

export type ActionSwapAnimation = "blur" | "roll" | "cascade"

export interface ActionSwapButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children" | "onChange"
> {
  items: ActionSwapItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, item: ActionSwapItem) => void
  variant?: ActionSwapButtonVariant
  size?: ActionSwapButtonSize
  animation?: ActionSwapAnimation
  iconOnly?: boolean
  cycle?: boolean
}

export interface ActionSwapTextProps {
  value: string
  children: ReactNode
  animation?: ActionSwapAnimation
  className?: string
}

export interface ActionSwapIconProps {
  value: string
  children: ReactNode
  animation?: ActionSwapAnimation
  className?: string
}
```

## Example

```tsx
import { Check, Copy, Pause, Play } from "lucide-react"

import { ActionSwapButton } from "@/components/motion/action-swap"

export default function ActionSwapDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ActionSwapButton
        animation="roll"
        cycle
        items={[
          { id: "play", label: "Play", icon: <Play className="size-4" /> },
          { id: "pause", label: "Pause", icon: <Pause className="size-4" /> },
        ]}
      />
      <ActionSwapButton
        variant="outline"
        animation="blur"
        cycle
        items={[
          { id: "copy", label: "Copy link", icon: <Copy className="size-4" /> },
          { id: "copied", label: "Copied", icon: <Check className="size-4" /> },
        ]}
      />
      <ActionSwapButton
        variant="ghost"
        animation="cascade"
        cycle
        items={[
          { id: "follow", label: "Follow" },
          { id: "following", label: "Following" },
        ]}
      />
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/action-swap. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
