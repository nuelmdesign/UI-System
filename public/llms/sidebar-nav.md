# Sidebar Nav

Workspace switcher, primary nav and searchable chats that collapse to an aligned icon rail.

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

export type SidebarWorkspace = { key: string; name: string; monogram: string }

export type SidebarNavItem = {
  key: string
  label: string
  icon: React.ReactNode
  count?: string
}

export type SidebarNavProps = {
  /** Workspace shown in the switcher. Defaults to a demo workspace. */
  workspace?: SidebarWorkspace
  /** Primary navigation items. Defaults to demo items. */
  navItems?: SidebarNavItem[]
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
import { SidebarNav } from "@/components/agents/sidebar-nav"

export default function SidebarNavDemo() {
  return (
    <div className="flex h-[600px] overflow-hidden rounded-lg border bg-background">
      <SidebarNav fill />
      <div className="flex-1 bg-dots" />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/sidebar-nav. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
