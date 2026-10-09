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
