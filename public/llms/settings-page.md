# Settings Page

Settings with profile, notifications, team and billing sections, an unsaved-changes bar and a type-to-confirm danger zone.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/settings-page
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SettingsPage } from "@/components/blocks/settings-page"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/avatar`, `@opendraft/badge`, `@opendraft/button`, `@opendraft/dialog`, `@opendraft/input`, `@opendraft/label`, `@opendraft/select`, `@opendraft/switch`, `@opendraft/textarea`

## Props and types

```ts
export type SettingsSection = "profile" | "notifications" | "team" | "billing"

export type ProfileValues = {
  name: string
  email: string
  bio: string
  timezone: string
  avatarUrl?: string
}

export type NotificationItem = {
  id: string
  label: string
  description: string
  enabled: boolean
}

export type NotificationGroup = {
  id: string
  title: string
  description?: string
  items: NotificationItem[]
}

export type TeamRole = "owner" | "admin" | "member" | "viewer"

export type TeamMember = {
  id: string
  name: string
  email: string
  role: TeamRole
  status?: "active" | "pending"
}

export type UsageMeter = {
  id: string
  label: string
  used: number
  limit: number
  unit?: string
}

export type Invoice = {
  id: string
  date: string
  amount: string
  status: "paid" | "open" | "failed"
}

export type BillingValues = {
  plan: string
  price: string
  interval: string
  renewsOn: string
  features: string[]
  usage: UsageMeter[]
  invoices: Invoice[]
}

export type SettingsSaveValues = {
  profile: ProfileValues
  notifications: Record<string, boolean>
  members: TeamMember[]
}

export type SettingsPageProps = {
  profile?: ProfileValues
  notifications?: NotificationGroup[]
  members?: TeamMember[]
  billing?: BillingValues
  workspaceName?: string
  timezones?: { value: string; label: string }[]
  onSave?: (values: SettingsSaveValues) => void | Promise<void>
  onInvite?: (invite: { email: string; role: TeamRole }) => void
  onDelete?: () => void
  onDownloadInvoice?: (invoice: Invoice) => void
  className?: string
}
```

## Example

```tsx
"use client"

import { SettingsPage } from "@/components/blocks/settings-page"

export default function SettingsPageDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <SettingsPage />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/settings-page. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
