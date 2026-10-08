"use client"

import * as React from "react"
import { BookOpen, Bot, LayoutGrid, Menu, Search, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  ENTRIES,
  GUIDES,
  entriesIn,
} from "@/components/docs/entries"
import { useDocsNav } from "@/components/docs/docs-nav"
import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette"
import { Drawer } from "@/components/motion/drawer"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { LogoMark } from "@/components/site/logo-mark"

/** Docs chrome: top bar, grouped sidebar, search palette and a content slot. */
export function DocsShell({
  current,
  children,
}: {
  /** Slug of the page being shown; "" for the components index. */
  current: string
  children: React.ReactNode
}) {
  const nav = useDocsNav()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)

  const searchItems: CommandItem[] = React.useMemo(
    () => [
      ...GUIDES.map((g) => ({
        id: `guide-${g.slug}`,
        label: g.title,
        group: "Guides",
        icon: BookOpen,
        keywords: [g.description],
        onSelect: () => nav.navigate(nav.href(g.slug)),
      })),
      ...ENTRIES.map((e) => ({
        id: e.slug,
        label: e.title,
        group: CATEGORY_LABEL[e.category],
        icon:
          e.category === "Agents"
            ? Bot
            : e.category === "Motion"
              ? Sparkles
              : LayoutGrid,
        keywords: [e.description, e.slug],
        onSelect: () => nav.navigate(nav.href(e.slug)),
      })),
    ],
    [nav]
  )

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-6 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </Button>
          <nav.Link
            href={nav.href("home")}
            className="flex items-center gap-2.5"
          >
            <LogoMark />
            <span className="font-sans text-lg tracking-[-0.01em]">
              openDraft
            </span>
          </nav.Link>
          <nav className="hidden items-center gap-5 text-[13px] text-muted-foreground md:flex">
            <nav.Link
              href={nav.href("introduction")}
              className="transition-colors hover:text-foreground"
            >
              Docs
            </nav.Link>
            <nav.Link
              href={nav.href("")}
              className={cn(
                "transition-colors hover:text-foreground",
                current === "" && "text-foreground"
              )}
            >
              Components
            </nav.Link>
            <nav.Link
              href={nav.href("theming")}
              className="transition-colors hover:text-foreground"
            >
              Theming
            </nav.Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-8 w-64 items-center gap-2 rounded-md border bg-card px-2.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/25 sm:flex"
            >
              <Search className="size-3.5" />
              Search documentation…
              <KbdGroup className="ml-auto">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="sm:hidden"
              aria-label="Search documentation"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="sticky top-14 scrollbar-hide hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r px-3 py-6 lg:block">
          <SidebarNav current={current} />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <Drawer
        open={menuOpen}
        onOpenChange={setMenuOpen}
        side="left"
        ariaLabel="Documentation navigation"
        className="overflow-y-auto px-3 py-6"
      >
        <SidebarNav current={current} onNavigate={() => setMenuOpen(false)} />
      </Drawer>

      <CommandPalette
        items={searchItems}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        placeholder="Search components and guides…"
      />
    </div>
  )
}

function SidebarNav({
  current,
  onNavigate,
}: {
  current: string
  onNavigate?: () => void
}) {
  const nav = useDocsNav()

  const item = (slug: string, title: string, isNew?: boolean) => {
    const active = slug === current
    return (
      <nav.Link
        key={slug}
        href={nav.href(slug)}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-8 items-center justify-between gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          active && "bg-accent font-medium text-foreground"
        )}
      >
        <span className="truncate">{title}</span>
        {isNew ? (
          <span className="shrink-0 rounded-sm border border-brand/30 bg-brand/10 px-1 font-mono text-[9px] tracking-wider text-brand uppercase">
            New
          </span>
        ) : null}
      </nav.Link>
    )
  }

  return (
    <nav className="grid gap-6">
      <Group label="Get started">
        {item("", "All components")}
        {GUIDES.map((g) => item(g.slug, g.title))}
      </Group>
      {CATEGORY_ORDER.map((category) => {
        const entries = entriesIn(category)
        return (
          <Group
            key={category}
            label={CATEGORY_LABEL[category]}
            count={entries.length}
          >
            {entries.map((e) => item(e.slug, e.title, e.isNew))}
          </Group>
        )
      })}
    </nav>
  )
}

function Group({
  label,
  count,
  children,
}: {
  label: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-0.5">
      <p className="mb-2 flex items-center gap-2 px-3 eyebrow text-muted-foreground">
        {label}
        {count ? (
          <span className="rounded-sm bg-muted px-1 py-0.5 text-[10px] tabular-nums">
            {count}
          </span>
        ) : null}
      </p>
      {children}
    </div>
  )
}
