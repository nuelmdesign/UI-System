// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import {
  Check,
  ChevronDown,
  House,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Popsicle,
  Search,
  Settings,
  SquarePen,
  UserPlus,
  X,
} from "lucide-react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
import { GlideMenu } from "@/components/motion/glide-menu"
import { duration } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * SIDEBAR NAV
 * Compact workspace switcher, primary navigation, searchable
 * chat history, and a collapse that preserves icon alignment.
 * ───────────────────────────────────────────────────────── */

const WORKSPACE = { key: "creamery", name: "Creamery Ops", monogram: "C" }

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: <House className="size-[18px]" /> },
  {
    key: "invite",
    label: "Invite users",
    icon: <UserPlus className="size-[18px]" />,
    count: "3/10",
  },
]

export type SidebarRecent = {
  id: string
  label: string
  prompt?: string
}

const DEFAULT_RECENTS: SidebarRecent[] = [
  { id: "suppliers", label: "Supplier records" },
  { id: "todos", label: "Urgent to-dos this morning" },
  { id: "flavor", label: "Flavor page ticket" },
  { id: "workload", label: "Workload summary" },
  { id: "offboarding", label: "Off-board a supplier" },
  { id: "restock", label: "Batch restock function" },
  { id: "edits", label: "Propose flavor edits" },
  { id: "subway", label: "Subway surfing" },
]

export type SidebarNavProps = {
  activeTitle?: string | null
  className?: string
  /** Fill the parent's height instead of the fixed 600px demo height. */
  fill?: boolean
  onNewChat?: () => void
  onPick?: (id: string, label: string, prompt?: string) => void
  /** Controlled primary-nav selection (e.g. "home" | "invite"). */
  activeNav?: string
  onNavigate?: (key: string) => void
  /** Footer call-to-action — defaults to the demo "Upgrade" button. */
  footerLabel?: string
  footerIcon?: React.ReactNode
  onFooterClick?: () => void
  recents?: SidebarRecent[]
}

/* The rail: width eases between these; copy fades + slides out faster than
 * the rail closes so labels never get clipped mid-read. */
const SIDEBAR_MOTION = {
  expandedWidth: 224,
  collapsedWidth: 52,
  duration: duration.base * 1000,
  copyDuration: duration.fast * 1000,
  copyOffset: 8,
}

/* ─────────────────────────────────────────────────────────
 * CHAT SEARCH STORYBOARD
 *
 *   0ms   search is triggered; Chats label begins fading
 *   0ms   field grows right → left from the search control
 * 160ms   field fills the row; cursor is focused and ready
 * ───────────────────────────────────────────────────────── */
const CHAT_SEARCH_MOTION = {
  duration: duration.fast * 1000,
  closedWidth: 28,
}

/** Applied to every label/count: hides when the rail collapses. */
const COPY = cn(
  "transition-[opacity,translate] duration-(--sidebar-copy-duration) ease-out",
  "group-data-[collapsed=true]/sidebar:pointer-events-none group-data-[collapsed=true]/sidebar:translate-x-[calc(var(--sidebar-copy-offset)*-1)] group-data-[collapsed=true]/sidebar:opacity-0"
)

/** Rows shrink to an icon-sized square so the active tint stays aligned. */
const ROW = cn(
  "relative z-10 mx-2 flex h-8 w-[208px] items-center rounded-md px-2 text-left outline-none",
  "transition-[width,background-color,color,scale] duration-(--sidebar-duration) ease-out active:scale-[0.98]",
  "focus-visible:ring-[3px] focus-visible:ring-ring",
  "group-data-[collapsed=true]/sidebar:w-9"
)

function GlideGroup({ children }: { children: React.ReactNode }) {
  return (
    <GlideMenu
      rowSelector="[data-row]"
      highlightClassName="rounded-md bg-accent"
      className="flex flex-col gap-px"
    >
      {children}
    </GlideMenu>
  )
}

function RailButton({
  icon,
  label,
  active = false,
  count,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  count?: string
  onClick?: () => void
}) {
  return (
    <button
      data-row
      data-slot="sidebar-nav-item"
      data-active={active || undefined}
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        ROW,
        active && "bg-accent group-hover/glide-menu:bg-transparent"
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          COPY,
          "ml-1.5 min-w-0 flex-1 truncate text-sm font-medium",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      {count && (
        <span
          className={cn(
            COPY,
            "mr-2 shrink-0 font-mono text-xs text-muted-foreground/70 tabular-nums"
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function WorkspaceMenu({
  position,
  onClose,
}: {
  position: { top: number; left: number }
  onClose: () => void
}) {
  const items = [
    { label: "New workspace", icon: <Plus className="size-4" /> },
    { label: "Workspace settings", icon: <Settings className="size-4" /> },
    { label: "Invite team members", icon: <UserPlus className="size-4" /> },
  ]
  const row =
    "relative z-10 flex w-full items-center gap-1.5 rounded-md px-2 text-left outline-none"

  return createPortal(
    <div
      data-workspace-menu
      data-slot="sidebar-nav-workspace-menu"
      role="menu"
      className="fixed z-50 w-64 origin-top-left animate-pop-in rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      <GlideMenu
        className="flex flex-col gap-px"
        highlightClassName="inset-x-0"
      >
        <button
          data-menu-row
          role="menuitem"
          type="button"
          onClick={onClose}
          className={cn(row, "h-10")}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-ink text-[11px] font-semibold text-ink-foreground">
            {WORKSPACE.monogram}
          </span>
          <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-foreground">
            {WORKSPACE.name}
          </span>
          <Check className="size-4 shrink-0 text-brand" />
        </button>
        <div className="my-1 h-px bg-border" />
        {items.map((item) => (
          <button
            key={item.label}
            data-menu-row
            role="menuitem"
            type="button"
            onClick={onClose}
            className={cn(row, "h-9")}
          >
            <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] text-foreground">
              {item.label}
            </span>
          </button>
        ))}
        <div className="my-1 h-px bg-border" />
        <button
          data-menu-row
          role="menuitem"
          type="button"
          onClick={onClose}
          className={cn(row, "h-9")}
        >
          <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
            <LogOut className="size-4" />
          </span>
          <span className="min-w-0 flex-1 truncate text-[13.5px] text-foreground">
            Sign out
          </span>
        </button>
      </GlideMenu>
    </div>,
    document.body
  )
}

function SidebarNav({
  activeTitle,
  className,
  fill = false,
  onNewChat,
  onPick,
  activeNav,
  onNavigate,
  footerLabel = "Upgrade",
  footerIcon,
  onFooterClick,
  recents = DEFAULT_RECENTS,
}: SidebarNavProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [internalNav, setInternalNav] = React.useState("chats")
  const currentNav = activeNav ?? internalNav
  const selectNav = (key: string) => {
    setInternalNav(key)
    onNavigate?.(key)
  }
  const [demoActiveTitle, setDemoActiveTitle] = React.useState<string | null>(
    null
  )
  const [workspaceOpen, setWorkspaceOpen] = React.useState(false)
  const [workspacePosition, setWorkspacePosition] = React.useState({
    top: 0,
    left: 0,
  })
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const workspaceButtonRef = React.useRef<HTMLButtonElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)

  const selectedTitle =
    activeTitle === undefined ? demoActiveTitle : activeTitle
  const visibleRecents = recents.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase())
  )

  React.useEffect(() => {
    if (!workspaceOpen) return
    const close = (event: PointerEvent) => {
      const target = event.target as Element
      if (
        !target.closest("[data-workspace-trigger]") &&
        !target.closest("[data-workspace-menu]")
      ) {
        setWorkspaceOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWorkspaceOpen(false)
        workspaceButtonRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", onKey)
    }
  }, [workspaceOpen])

  React.useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery("")
  }

  const collapse = () => {
    setCollapsed(true)
    setWorkspaceOpen(false)
    closeSearch()
  }

  return (
    <aside
      data-slot="sidebar-nav"
      data-collapsed={collapsed}
      aria-label="Workspace navigation"
      className={cn(
        "group/sidebar relative flex shrink-0 overflow-hidden border-r bg-background transition-[width] ease-out",
        fill ? "h-full" : "h-[600px]",
        className
      )}
      style={
        {
          width: collapsed
            ? SIDEBAR_MOTION.collapsedWidth
            : SIDEBAR_MOTION.expandedWidth,
          transitionDuration: `${SIDEBAR_MOTION.duration}ms`,
          "--sidebar-duration": `${SIDEBAR_MOTION.duration}ms`,
          "--sidebar-copy-duration": `${SIDEBAR_MOTION.copyDuration}ms`,
          "--sidebar-copy-offset": `${SIDEBAR_MOTION.copyOffset}px`,
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-0 w-[224px] shrink-0 flex-col py-1">
        {/* header — workspace switcher, collapse / expand controls */}
        <div className="relative mb-2.5 h-10 shrink-0">
          <button
            ref={workspaceButtonRef}
            data-workspace-trigger
            data-slot="sidebar-nav-workspace"
            type="button"
            aria-haspopup="menu"
            aria-expanded={workspaceOpen}
            aria-hidden={collapsed}
            tabIndex={collapsed ? -1 : 0}
            onClick={() => {
              if (!workspaceOpen && workspaceButtonRef.current) {
                const rect = workspaceButtonRef.current.getBoundingClientRect()
                setWorkspacePosition({ top: rect.bottom + 6, left: rect.left })
              }
              setWorkspaceOpen((open) => !open)
            }}
            className={cn(
              "absolute top-1 left-2 flex h-8 w-[164px] items-center rounded-md px-2 text-left outline-none",
              "transition-[background-color,scale] duration-100 ease-out hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring active:scale-[0.99]",
              "group-data-[collapsed=true]/sidebar:pointer-events-none group-data-[collapsed=true]/sidebar:bg-transparent"
            )}
          >
            {/* logo sits exactly where the expand control appears */}
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center text-foreground",
                "transition-opacity duration-(--sidebar-copy-duration) ease-out",
                "group-focus-within/sidebar:group-data-[collapsed=true]/sidebar:opacity-0 group-hover/sidebar:group-data-[collapsed=true]/sidebar:opacity-0"
              )}
            >
              <Popsicle className="size-[18px]" />
            </span>
            <span
              className={cn(
                COPY,
                "ml-1.5 min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground"
              )}
            >
              {WORKSPACE.name}
            </span>
            <span
              className={cn(
                COPY,
                "ml-1 flex shrink-0 text-muted-foreground/70"
              )}
            >
              <ChevronDown className="size-4" />
            </span>
          </button>

          {workspaceOpen && (
            <WorkspaceMenu
              position={workspacePosition}
              onClose={() => setWorkspaceOpen(false)}
            />
          )}

          <button
            type="button"
            data-slot="sidebar-nav-collapse"
            aria-label="Collapse sidebar"
            aria-hidden={collapsed}
            tabIndex={collapsed ? -1 : 0}
            onClick={collapse}
            className={cn(
              "absolute top-1 right-2 flex size-8 items-center justify-center rounded-md text-muted-foreground/70 outline-none",
              "transition-[opacity,background-color,color] duration-150 ease-out hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
              "group-data-[collapsed=true]/sidebar:pointer-events-none group-data-[collapsed=true]/sidebar:opacity-0"
            )}
          >
            <PanelLeftClose className="size-[18px]" />
          </button>
          <button
            type="button"
            data-slot="sidebar-nav-expand"
            aria-label="Expand sidebar"
            aria-hidden={!collapsed}
            tabIndex={collapsed ? 0 : -1}
            onClick={() => setCollapsed(false)}
            className={cn(
              "pointer-events-none absolute top-0.5 left-2 flex size-9 items-center justify-center rounded-md text-muted-foreground/70 opacity-0 outline-none",
              "transition-[opacity,background-color,color] duration-150 ease-out hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
              "group-data-[collapsed=true]/sidebar:pointer-events-auto group-focus-within/sidebar:group-data-[collapsed=true]/sidebar:opacity-100 group-hover/sidebar:group-data-[collapsed=true]/sidebar:opacity-100"
            )}
          >
            <PanelLeftOpen className="size-[18px]" />
          </button>
        </div>

        {/* primary navigation */}
        <nav aria-label="Primary">
          <GlideGroup>
            <RailButton
              icon={<SquarePen className="size-[18px]" />}
              label="New chat"
              onClick={() => {
                if (activeTitle === undefined) setDemoActiveTitle(null)
                selectNav("chats")
                onNewChat?.()
              }}
            />
            {NAV_ITEMS.map((item) => (
              <RailButton
                key={item.key}
                icon={item.icon}
                label={item.label}
                count={item.count}
                active={currentNav === item.key}
                onClick={() => selectNav(item.key)}
              />
            ))}
          </GlideGroup>
        </nav>

        {/* chats — hidden from the a11y tree and tab order while collapsed */}
        <div
          data-slot="sidebar-nav-chats"
          inert={collapsed}
          className="mt-3 min-h-0 flex-1 overflow-y-auto"
        >
          <div className={cn(COPY, "relative mx-2 mb-1 h-8")}>
            <div
              aria-hidden={searchOpen}
              className={cn(
                "absolute inset-0 flex items-center gap-1.5 px-2 text-[12.5px] font-medium text-muted-foreground/70 transition-[opacity,translate] ease-out",
                searchOpen
                  ? "pointer-events-none -translate-x-1 opacity-0"
                  : "translate-x-0 opacity-100"
              )}
              style={{ transitionDuration: `${CHAT_SEARCH_MOTION.duration}ms` }}
            >
              <ChevronDown className="size-4" />
              <span>Chats</span>
            </div>

            <button
              type="button"
              aria-label="Search chats"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
              className={cn(
                "absolute top-0 right-0 z-10 flex size-8 items-center justify-center rounded-md text-muted-foreground/70 outline-none",
                "transition-[opacity,background-color,color,scale] ease-out hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring active:scale-[0.96]",
                searchOpen ? "pointer-events-none opacity-0" : "opacity-100"
              )}
              style={{ transitionDuration: `${CHAT_SEARCH_MOTION.duration}ms` }}
            >
              <Search className="size-4" />
            </button>

            {/* the field grows right → left out of the search control */}
            <div
              data-slot="sidebar-nav-search"
              className={cn(
                "absolute top-0 right-0 z-20 flex h-8 items-center overflow-hidden rounded-md border bg-muted text-muted-foreground/70 transition-[width,opacity] ease-out focus-within:border-ring focus-within:text-muted-foreground",
                searchOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              )}
              style={{
                width: searchOpen ? "100%" : CHAT_SEARCH_MOTION.closedWidth,
                transitionDuration: `${CHAT_SEARCH_MOTION.duration}ms`,
              }}
            >
              <span className="ml-2 flex shrink-0 items-center justify-center">
                <Search className="size-[15px]" />
              </span>
              <input
                ref={searchRef}
                value={query}
                tabIndex={searchOpen ? 0 : -1}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch()
                }}
                placeholder="Search chats"
                aria-label="Search chat history"
                className="ml-1.5 min-w-0 flex-1 bg-transparent text-[13px] font-medium text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="button"
                aria-label="Close chat search"
                tabIndex={searchOpen ? 0 : -1}
                onClick={closeSearch}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground/70 transition-[background-color,color,scale] duration-150 ease-out hover:bg-accent hover:text-foreground active:scale-[0.96]"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <GlideGroup>
            {visibleRecents.map((item) => {
              const active = item.label === selectedTitle
              return (
                <button
                  key={item.id}
                  data-row
                  data-slot="sidebar-nav-chat"
                  data-active={active || undefined}
                  type="button"
                  title={item.label}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    selectNav("chats")
                    if (activeTitle === undefined)
                      setDemoActiveTitle(item.label)
                    onPick?.(item.id, item.label, item.prompt)
                  }}
                  className={cn(
                    ROW,
                    active && "bg-accent group-hover/glide-menu:bg-transparent"
                  )}
                >
                  <span
                    className={cn(
                      COPY,
                      "min-w-0 flex-1 truncate text-sm font-medium",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
            {query && visibleRecents.length === 0 && (
              <div
                className={cn(
                  COPY,
                  "mx-2 px-2 py-2 text-[12.5px] text-muted-foreground/70"
                )}
              >
                No chats found
              </div>
            )}
          </GlideGroup>
        </div>

        {/* footer call-to-action */}
        <div
          inert={collapsed}
          className={cn(COPY, "mx-2 mt-3 w-[208px] border-t pt-3 pb-1")}
        >
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-[12.5px]"
            onClick={onFooterClick ?? onNewChat}
          >
            {footerIcon}
            {footerLabel}
          </Button>
        </div>
      </div>
    </aside>
  )
}

export { SidebarNav }
