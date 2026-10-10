# Sidebar Nav

Workspace switcher, primary nav and searchable chats that collapse to an aligned icon rail. Data shape: An AI-chat sidebar (chats, new chat, collapse rail). For general app navigation use `animated-sidebar`. Shows sample content (an ice cream shop) until you pass your own data through its props.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/sidebar-nav
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SidebarNav } from "@/components/agents/sidebar-nav"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/glide-menu`, `@opendraft/motion`

## Props and types

```ts
export type SidebarRecent = {
  id: string
  label: string
  prompt?: string
}

export type SidebarWorkspaceMenuItem = {
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
}

export type SidebarWorkspace = { key: string; name: string; monogram: string }

export type SidebarNavItem = {
  key: string
  label: string
  icon: React.ReactNode
  count?: string
}

export type SidebarNavProps = {
  /** Workspace shown in the switcher. Defaults to a neutral "Workspace". */
  workspace?: SidebarWorkspace
  /** Primary navigation items. Defaults to neutral Home / Invite users. */
  navItems?: SidebarNavItem[]
  /** Mark shown at the left of the workspace switcher. Defaults to a neutral icon. */
  logo?: React.ReactNode
  /** Items in the workspace menu (between the workspace row and sign out). */
  workspaceMenu?: SidebarWorkspaceMenuItem[]
  /** Called from the sign-out row of the workspace menu. */
  onSignOut?: () => void
  signOutLabel?: string
  newChatLabel?: string
  chatsLabel?: string
  searchLabel?: string
  searchPlaceholder?: string
  emptyLabel?: string
  /** aria-label of the aside. */
  ariaLabel?: string
  collapseLabel?: string
  expandLabel?: string
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
```

## Example

```tsx
import { SAMPLE_RECENTS, SidebarNav } from "@/components/agents/sidebar-nav"

export default function SidebarNavDemo() {
  return (
    <div className="flex h-[600px] overflow-hidden rounded-lg border bg-background">
      <SidebarNav fill recents={SAMPLE_RECENTS} />
      <div className="flex-1 bg-dots" />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/sidebar-nav. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
