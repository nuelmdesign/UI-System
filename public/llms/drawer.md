# Drawer

Side sheet with a backdrop that closes on Esc or an outside click.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/drawer
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Drawer } from "@/components/motion/drawer"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/presence-gate`

## Props and types

```ts
export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: "left" | "right"
  children: ReactNode
  /** Class for the panel surface. */
  className?: string
  /** Class for the backdrop. */
  backdropClassName?: string
  ariaLabel?: string
  /** Close when the backdrop is clicked. Default true. */
  dismissable?: boolean
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { toast } from "sonner"

import { Drawer } from "@/components/motion/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const SETTINGS = [
  { id: "notify", label: "Email notifications", on: true },
  { id: "digest", label: "Weekly digest", on: false },
  { id: "agents", label: "Let agents run tools", on: true },
]

export default function DrawerDemo() {
  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<"left" | "right">("right")

  const show = (next: "left" | "right") => {
    setSide(next)
    setOpen(true)
  }

  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => show("left")}>
        Open left
      </Button>
      <Button onClick={() => show("right")}>Open settings</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        ariaLabel="Workspace settings"
        className="gap-6 p-6"
      >
        <div>
          <p className="eyebrow text-muted-foreground">Workspace</p>
          <h2 className="mt-3 font-display text-3xl font-light tracking-[-0.02em]">
            Settings
          </h2>
        </div>
        <div className="grid gap-4 border-t pt-6">
          {SETTINGS.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between gap-4"
            >
              <Label htmlFor={`drawer-${setting.id}`}>{setting.label}</Label>
              <Switch id={`drawer-${setting.id}`} defaultChecked={setting.on} />
            </div>
          ))}
        </div>
        <div className="mt-auto flex gap-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setOpen(false)
              toast.success("Settings saved")
            }}
          >
            Save
          </Button>
        </div>
      </Drawer>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/drawer. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
