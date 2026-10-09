# Command Palette

⌘K palette with fuzzy search, groups, hints and keyboard navigation.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/command-palette
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { CommandPalette } from "@/components/motion/command-palette"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/presence-gate`, `@opendraft/command-search`, `@opendraft/use-on-open`, `@opendraft/use-row-cursor`, `@opendraft/use-touch-capable`

## Props and types

```ts
export type CommandItem = {
  id: string
  label: string
  group?: string
  hint?: string
  keywords?: string[]
  icon?: LucideIcon
  badge?: ReactNode
  onSelect: () => void
}

export interface CommandPaletteProps {
  items: CommandItem[]
  /** Opens with Cmd/Ctrl + this key. Default: "k" */
  shortcut?: string
  placeholder?: string
  emptyMessage?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
```

## Example

```tsx
"use client"

import * as React from "react"
import {
  Bell,
  Bot,
  CreditCard,
  FileText,
  Moon,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import { toast } from "sonner"

import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false)
  const run = (label: string) => () => toast(label)

  const items: CommandItem[] = [
    {
      id: "new",
      label: "New chat",
      group: "Actions",
      icon: Sparkles,
      hint: "N",
      onSelect: run("New chat"),
    },
    {
      id: "agent",
      label: "Run agent on this page",
      group: "Actions",
      icon: Bot,
      onSelect: run("Agent started"),
    },
    {
      id: "search",
      label: "Search components",
      group: "Actions",
      icon: Search,
      keywords: ["find"],
      onSelect: run("Search"),
    },
    {
      id: "theme",
      label: "Toggle dark mode",
      group: "Preferences",
      icon: Moon,
      onSelect: () => document.documentElement.classList.toggle("dark"),
    },
    {
      id: "notifications",
      label: "Notification settings",
      group: "Preferences",
      icon: Bell,
      onSelect: run("Notifications"),
    },
    {
      id: "docs",
      label: "Registry docs",
      group: "Go to",
      icon: FileText,
      onSelect: run("Docs"),
    },
    {
      id: "profile",
      label: "Profile",
      group: "Account",
      icon: User,
      onSelect: run("Profile"),
    },
    {
      id: "billing",
      label: "Billing",
      group: "Account",
      icon: CreditCard,
      badge: <Badge variant="brand">Pro</Badge>,
      onSelect: run("Billing"),
    },
    {
      id: "settings",
      label: "Settings",
      group: "Account",
      icon: Settings,
      onSelect: run("Settings"),
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-72 max-w-full justify-between text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <Search /> Search or run a command…
        </span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandPalette items={items} open={open} onOpenChange={setOpen} />
    </>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/command-palette. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
