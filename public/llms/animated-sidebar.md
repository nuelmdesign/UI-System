# Sidebar

Docked, icon rail or off-canvas sidebar with a mobile sheet, menus and sub-menus.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/animated-sidebar
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { AnimatedSidebarProvider, AnimatedSidebarMenuSubButton, AnimatedSidebarMenuButton, AnimatedSidebar, AnimatedSidebarTrigger, AnimatedSidebarClose, AnimatedSidebarRail, AnimatedSidebarInset, AnimatedSidebarHeader, AnimatedSidebarContent, AnimatedSidebarFooter, AnimatedSidebarGroup, AnimatedSidebarGroupLabel, AnimatedSidebarGroupContent, AnimatedSidebarMenu, AnimatedSidebarMenuItem, AnimatedSidebarMenuSub, AnimatedSidebarMenuSubItem } from "@/components/motion/animated-sidebar"
```

Files added to the project:

- `components/motion/animated-sidebar.tsx`
- `components/motion/shared-layout-bg.tsx`

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
type SidebarSide = "left" | "right"

type SidebarVariant = "sidebar" | "floating" | "inset"

type SidebarCollapsible = "offcanvas" | "icon" | "none"

type SidebarProviderStyle = CSSProperties & {
  "--sidebar-width"?: string
  "--sidebar-width-icon"?: string
  "--sidebar-width-mobile"?: string
}

export interface AnimatedSidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  openMobile?: boolean
  defaultOpenMobile?: boolean
  onOpenMobileChange?: (open: boolean) => void
  style?: SidebarProviderStyle
}

export interface AnimatedSidebarProps extends Omit<
  HTMLMotionProps<"aside">,
  "children"
> {
  children?: ReactNode
  side?: SidebarSide
  variant?: SidebarVariant
  collapsible?: SidebarCollapsible
  ariaLabel?: string
  panelClassName?: string
}

export type AnimatedSidebarTriggerProps =
  ButtonHTMLAttributes<HTMLButtonElement>

export type AnimatedSidebarCloseProps = ButtonHTMLAttributes<HTMLButtonElement>

export type AnimatedSidebarRailProps = ButtonHTMLAttributes<HTMLButtonElement>

export type AnimatedSidebarInsetProps = HTMLMotionProps<"main">

export interface AnimatedSidebarMenuSubProps extends Omit<
  HTMLMotionProps<"ul">,
  "children"
> {
  open: boolean
  children?: ReactNode
}

export interface AnimatedSidebarMenuSubButtonProps {
  children: ReactNode
  icon?: ReactNode
  href?: string
  isActive?: boolean
  disabled?: boolean
  closeOnSelect?: boolean
  target?: "_blank" | "_self" | "_parent" | "_top"
  rel?: string
  onSelect?: () => void
  className?: string
}

export interface AnimatedSidebarMenuButtonProps {
  children: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  href?: string
  isActive?: boolean
  ariaExpanded?: boolean
  disabled?: boolean
  closeOnSelect?: boolean
  target?: "_blank" | "_self" | "_parent" | "_top"
  rel?: string
  onSelect?: () => void
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"
import {
  Bot,
  Inbox,
  LayoutGrid,
  PanelLeft,
  Settings,
  Users,
} from "lucide-react"

import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarInset,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarProvider,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
} from "@/components/motion/animated-sidebar"

const NAV = [
  { id: "inbox", label: "Inbox", icon: Inbox, badge: "12" },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "projects", label: "Projects", icon: LayoutGrid },
  { id: "team", label: "Team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function AnimatedSidebarDemo() {
  const [active, setActive] = React.useState("inbox")
  const current = NAV.find((item) => item.id === active) ?? NAV[0]

  return (
    <AnimatedSidebarProvider
      style={{ "--sidebar-width": "15rem" }}
      className="h-[420px] min-h-0 w-full overflow-hidden border bg-background"
    >
      <AnimatedSidebar
        ariaLabel="Main navigation"
        collapsible="offcanvas"
        className="min-h-0 w-full"
        panelClassName="h-full bg-surface"
      >
        <AnimatedSidebarContent className="px-2 py-4">
          <AnimatedSidebarGroup className="px-1 py-0">
            <AnimatedSidebarGroupLabel className="mb-1 h-8 px-2 eyebrow">
              Workspace
            </AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-0.5">
                {NAV.map(({ id, label, icon: Icon, badge }) => (
                  <AnimatedSidebarMenuItem key={id}>
                    <AnimatedSidebarMenuButton
                      icon={<Icon className="size-4" />}
                      isActive={id === active}
                      badge={
                        badge ? (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {badge}
                          </span>
                        ) : undefined
                      }
                      onSelect={() => setActive(id)}
                      className="font-normal"
                    >
                      {label}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                ))}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>
        <AnimatedSidebarRail />
      </AnimatedSidebar>
      <AnimatedSidebarInset className="min-h-0 bg-background">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <AnimatedSidebarTrigger className="size-8 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <PanelLeft aria-hidden className="size-4" />
          </AnimatedSidebarTrigger>
          <p className="font-display text-lg font-light">{current.label}</p>
        </header>
        <div className="flex-1 bg-dots p-6 text-sm text-muted-foreground">
          Toggle the sidebar from the header, or drag its edge rail.
        </div>
      </AnimatedSidebarInset>
    </AnimatedSidebarProvider>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/animated-sidebar. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
