"use client"

import * as React from "react"
import {
  Clock3,
  GitPullRequest,
  LayoutGrid,
  MessageSquare,
  PanelLeft,
  Plug,
  SquarePen,
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
import { AISidebar, type SidebarResource } from "@/components/agents/ai-sidebar"
import { ChatApp } from "@/components/agents/chat-app"
import { Badge } from "@/components/ui/badge"
import { ChatDemo } from "@/components/site/chat-demos"

/* -------------------------------- AI Sidebar ------------------------------- */

const RESOURCES: SidebarResource[] = [
  { id: "design-system", label: "Design system", kind: "project" },
  { id: "client-portal", label: "Client portal", kind: "project" },
  {
    id: "platform",
    label: "Platform",
    kind: "project",
    children: [
      { id: "api", label: "API migration", kind: "file" },
      { id: "billing", label: "Billing states", kind: "file" },
      { id: "docs", label: "Read platform docs", kind: "bookmark" },
    ],
  },
  { id: "research", label: "Research lab", kind: "folder" },
  {
    id: "agents",
    label: "Agent workspace",
    kind: "project",
    children: [
      {
        id: "review",
        label: "Review sidebar interaction details",
        kind: "file",
      },
      { id: "release", label: "Prepare release announcement", kind: "file" },
      {
        id: "motion",
        label: "Research motion implementation patterns",
        kind: "bookmark",
      },
    ],
  },
  { id: "notes", label: "Release notes", kind: "file" },
]

const ACTIONS = [
  { label: "New workspace", icon: SquarePen },
  { label: "Pull requests", icon: GitPullRequest },
  { label: "Sites", icon: LayoutGrid },
  { label: "Scheduled", icon: Clock3 },
  { label: "Extensions", icon: Plug },
] as const

function findLabel(items: SidebarResource[], id: string): string | undefined {
  for (const item of items) {
    if (item.id === id) return item.label
    const child = item.children ? findLabel(item.children, id) : undefined
    if (child) return child
  }
}

export function AISidebarDemo() {
  const [active, setActive] = React.useState("review")
  const [items, setItems] = React.useState(RESOURCES)

  return (
    <AnimatedSidebarProvider
      style={{ "--sidebar-width": "16rem" }}
      className="h-[600px] min-h-0 w-full overflow-hidden border bg-background"
    >
      <AnimatedSidebar
        ariaLabel="Workspace resources"
        collapsible="offcanvas"
        className="min-h-0 w-full"
        panelClassName="h-full bg-surface"
      >
        <AnimatedSidebarContent className="gap-4 overflow-hidden px-2 py-4">
          <AnimatedSidebarGroup className="shrink-0 px-1 py-0">
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-0.5">
                {ACTIONS.map(({ label, icon: Icon }) => (
                  <AnimatedSidebarMenuItem key={label}>
                    <AnimatedSidebarMenuButton
                      icon={<Icon className="size-4" />}
                      onSelect={() => {}}
                      className="font-normal text-foreground"
                    >
                      {label}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                ))}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
          <AnimatedSidebarGroup className="min-h-0 flex-1 px-1 py-0">
            <AnimatedSidebarGroupLabel className="mb-1 h-8 px-2 eyebrow">
              Projects
            </AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <AISidebar
                items={items}
                activeId={active}
                defaultExpandedIds={["platform", "agents"]}
                onActiveChange={setActive}
                onItemsChange={setItems}
                onMove={() => new Promise((r) => window.setTimeout(r, 450))}
              />
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>
        <AnimatedSidebarRail />
      </AnimatedSidebar>

      <AnimatedSidebarInset className="min-h-0 bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-5">
          <div className="flex min-w-0 items-center gap-3">
            <AnimatedSidebarTrigger className="-ml-2 size-8 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <PanelLeft aria-hidden className="size-4" />
            </AnimatedSidebarTrigger>
            <div className="min-w-0">
              <p className="eyebrow text-muted-foreground">Workspace</p>
              <p className="mt-1 truncate text-sm font-medium">
                Agent workspace
              </p>
            </div>
          </div>
          <Badge variant="outline">Draft</Badge>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto bg-dots p-6 sm:p-10">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 eyebrow text-muted-foreground">
              <span className="size-2 bg-primary" /> Selected resource
            </p>
            <h3 className="mt-4 font-display text-3xl leading-tight font-light tracking-[-0.02em] sm:text-4xl">
              {findLabel(items, active) ?? active}
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              Drag rows to move them between projects, rename from the row menu,
              and expand folders around the current selection.
            </p>
            <ul className="mt-8 grid border-t text-sm text-muted-foreground">
              {[
                "Folders only reveal their contents.",
                "Files can be selected, moved or renamed.",
                "Rejected moves return to their previous place.",
              ].map((line) => (
                <li key={line} className="border-b py-3">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSidebarInset>
    </AnimatedSidebarProvider>
  )
}

/* --------------------------------- Chat App -------------------------------- */

const CONVERSATIONS = [
  { id: "release", title: "First release scope", when: "Now" },
  { id: "tokens", title: "Blue scale for charts", when: "2h" },
  { id: "motion", title: "Spring tuning notes", when: "Yesterday" },
  { id: "registry", title: "Registry deploy plan", when: "Mon" },
]

export function ChatAppDemo() {
  const [active, setActive] = React.useState(CONVERSATIONS[0].id)
  const current = CONVERSATIONS.find((c) => c.id === active) ?? CONVERSATIONS[0]

  return (
    <ChatApp sidebarWidth="16rem" className="h-[680px] rounded-none">
      <AnimatedSidebar
        ariaLabel="Conversations"
        collapsible="offcanvas"
        className="min-h-0 w-full"
        panelClassName="h-full bg-surface"
      >
        <AnimatedSidebarContent className="gap-4 overflow-hidden px-2 py-4">
          <AnimatedSidebarGroup className="shrink-0 px-1 py-0">
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu>
                <AnimatedSidebarMenuItem>
                  <AnimatedSidebarMenuButton
                    icon={<SquarePen className="size-4" />}
                    onSelect={() => setActive(CONVERSATIONS[0].id)}
                    className="font-normal text-foreground"
                  >
                    New chat
                  </AnimatedSidebarMenuButton>
                </AnimatedSidebarMenuItem>
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
          <AnimatedSidebarGroup className="min-h-0 flex-1 px-1 py-0">
            <AnimatedSidebarGroupLabel className="mb-1 h-8 px-2 eyebrow">
              Recent
            </AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-0.5">
                {CONVERSATIONS.map((c) => (
                  <AnimatedSidebarMenuItem key={c.id}>
                    <AnimatedSidebarMenuButton
                      icon={<MessageSquare className="size-4" />}
                      isActive={c.id === active}
                      badge={
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {c.when}
                        </span>
                      }
                      onSelect={() => setActive(c.id)}
                      className="font-normal"
                    >
                      {c.title}
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
          <p className="min-w-0 truncate font-display text-lg font-light tracking-[-0.01em]">
            {current.title}
          </p>
          <Badge variant="brand" className="ml-auto">
            Agent 5.6
          </Badge>
        </header>
        {/* Keyed so switching conversations starts a fresh transcript. */}
        <ChatDemo
          key={current.id}
          className="h-auto min-h-0 flex-1 rounded-none"
        />
      </AnimatedSidebarInset>
    </ChatApp>
  )
}
