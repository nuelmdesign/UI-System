"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Bell,
  CreditCard,
  Download,
  Trash2,
  User,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { duration, ease, spring } from "@/lib/motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

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
  /** Which sections render, in order. Default: all four. */
  sections?: SettingsSection[]
  /** Show the danger zone (profile) and the delete dialog. Default true. */
  showDangerZone?: boolean
  /** Danger zone copy. `description` replaces the default sentence; `action` is the button label. */
  dangerLabels?: {
    title?: string
    description?: string
    action?: string
    dialogTitle?: string
  }
  timezones?: { value: string; label: string }[]
  onSave?: (values: SettingsSaveValues) => void | Promise<void>
  onInvite?: (invite: { email: string; role: TeamRole }) => void
  onDelete?: () => void
  onDownloadInvoice?: (invoice: Invoice) => void
  className?: string
}

export const SAMPLE_PROFILE: ProfileValues = {
  name: "Alex Morgan",
  email: "alex@example.com",
  bio: "Product designer working on internal tools and data products.",
  timezone: "Europe/London",
}

export const SAMPLE_TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time (UTC-8)" },
  { value: "America/New_York", label: "Eastern Time (UTC-5)" },
  { value: "Europe/London", label: "London (UTC+0)" },
  { value: "Europe/Berlin", label: "Central European Time (UTC+1)" },
  { value: "Asia/Kolkata", label: "India Standard Time (UTC+5:30)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (UTC+9)" },
]

export const SAMPLE_NOTIFICATIONS: NotificationGroup[] = [
  {
    id: "activity",
    title: "Activity",
    description: "What happens in the projects you follow.",
    items: [
      {
        id: "comments",
        label: "Comments and mentions",
        description: "When someone replies to you or mentions you.",
        enabled: true,
      },
      {
        id: "assignments",
        label: "Assignments",
        description: "When a task or review is assigned to you.",
        enabled: true,
      },
      {
        id: "digest",
        label: "Weekly digest",
        description: "A Monday summary of what changed last week.",
        enabled: false,
      },
    ],
  },
  {
    id: "account",
    title: "Account",
    description: "Security and billing messages.",
    items: [
      {
        id: "security",
        label: "Security alerts",
        description: "New sign-ins and changes to your credentials.",
        enabled: true,
      },
      {
        id: "billing",
        label: "Billing receipts",
        description: "Invoices and failed payment notices.",
        enabled: true,
      },
    ],
  },
  {
    id: "product",
    title: "Product",
    items: [
      {
        id: "releases",
        label: "Release notes",
        description: "New features and improvements.",
        enabled: false,
      },
    ],
  },
]

export const SAMPLE_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "owner",
    status: "active",
  },
  {
    id: "m2",
    name: "Daniel Reyes",
    email: "daniel@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "m3",
    name: "Priya Nair",
    email: "priya@example.com",
    role: "member",
    status: "active",
  },
  {
    id: "m4",
    name: "Tomas Berg",
    email: "tomas@example.com",
    role: "viewer",
    status: "pending",
  },
]

export const SAMPLE_BILLING: BillingValues = {
  plan: "Team",
  price: "$48",
  interval: "month",
  renewsOn: "Nov 1, 2026",
  features: ["Unlimited projects", "10 seats included", "90-day history"],
  usage: [
    { id: "seats", label: "Seats", used: 4, limit: 10 },
    { id: "storage", label: "Storage", used: 38.4, limit: 100, unit: "GB" },
    { id: "api", label: "API requests", used: 82400, limit: 100000 },
  ],
  invoices: [
    { id: "INV-1042", date: "Oct 1, 2026", amount: "$48.00", status: "paid" },
    { id: "INV-1031", date: "Sep 1, 2026", amount: "$48.00", status: "paid" },
    { id: "INV-1019", date: "Aug 1, 2026", amount: "$48.00", status: "paid" },
    { id: "INV-1004", date: "Jul 1, 2026", amount: "$36.00", status: "failed" },
  ],
}

const SECTIONS: { id: SettingsSection; label: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "billing", label: "Billing", icon: CreditCard },
]

const ROLES: { value: TeamRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BIO_MAX = 160

type ProfileErrors = Partial<Record<"name" | "email" | "bio", string>>

function validateProfile(p: ProfileValues): ProfileErrors {
  const errors: ProfileErrors = {}
  if (!p.name.trim()) errors.name = "Enter your name."
  if (!p.email.trim()) errors.email = "Enter your email address."
  else if (!EMAIL_RE.test(p.email.trim()))
    errors.email = "Enter a valid email address."
  if (p.bio.length > BIO_MAX)
    errors.bio = `Keep your bio under ${BIO_MAX} characters.`
  return errors
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  )
}

function toFlags(groups: NotificationGroup[]) {
  const flags: Record<string, boolean> = {}
  for (const group of groups)
    for (const item of group.items) flags[item.id] = item.enabled
  return flags
}

function sameFlags(a: Record<string, boolean>, b: Record<string, boolean>) {
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length && keys.every((k) => a[k] === b[k])
  )
}

function sameMembers(a: TeamMember[], b: TeamMember[]) {
  return (
    a.length === b.length &&
    a.every((m, i) => m.id === b[i].id && m.role === b[i].role)
  )
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-4">
      <div className="min-w-0">
        <h2 className="heading text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function SettingsPage({
  profile = SAMPLE_PROFILE,
  notifications = SAMPLE_NOTIFICATIONS,
  members = SAMPLE_MEMBERS,
  billing = SAMPLE_BILLING,
  workspaceName = "Workspace",
  sections,
  showDangerZone = true,
  dangerLabels,
  timezones = SAMPLE_TIMEZONES,
  onSave,
  onInvite,
  onDelete,
  onDownloadInvoice,
  className,
}: SettingsPageProps) {
  const uid = React.useId()
  const visibleSections = React.useMemo(() => {
    const picked = sections
      ? sections
          .map((id) => SECTIONS.find((s) => s.id === id))
          .filter((s): s is (typeof SECTIONS)[number] => !!s)
      : SECTIONS
    return picked.length > 0 ? picked : SECTIONS
  }, [sections])
  const [chosenSection, setSection] = React.useState<SettingsSection>(
    () => visibleSections[0].id
  )
  const section = visibleSections.some((s) => s.id === chosenSection)
    ? chosenSection
    : visibleSections[0].id

  const [saved, setSaved] = React.useState<SettingsSaveValues>(() => ({
    profile,
    notifications: toFlags(notifications),
    members,
  }))
  const [draftProfile, setDraftProfile] = React.useState(profile)
  const [flags, setFlags] = React.useState(() => toFlags(notifications))
  const [team, setTeam] = React.useState(members)
  const [showErrors, setShowErrors] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<TeamRole>("member")
  const [inviteError, setInviteError] = React.useState<string>()

  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")

  const errors = validateProfile(draftProfile)
  const dirty =
    JSON.stringify(draftProfile) !== JSON.stringify(saved.profile) ||
    !sameFlags(flags, saved.notifications) ||
    !sameMembers(team, saved.members)

  const patchProfile = (patch: Partial<ProfileValues>) =>
    setDraftProfile((p) => ({ ...p, ...patch }))

  const discard = () => {
    setDraftProfile(saved.profile)
    setFlags(saved.notifications)
    setTeam(saved.members)
    setShowErrors(false)
  }

  const save = async () => {
    if (Object.keys(errors).length > 0) {
      setShowErrors(true)
      setSection("profile")
      return
    }
    const values: SettingsSaveValues = {
      profile: {
        ...draftProfile,
        name: draftProfile.name.trim(),
        email: draftProfile.email.trim(),
      },
      notifications: flags,
      members: team,
    }
    setSaving(true)
    try {
      await onSave?.(values)
      setSaved(values)
      setDraftProfile(values.profile)
      setShowErrors(false)
    } finally {
      setSaving(false)
    }
  }

  const onAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) patchProfile({ avatarUrl: URL.createObjectURL(file) })
    e.target.value = ""
  }

  const submitInvite = (e: React.FormEvent) => {
    e.preventDefault()
    const email = inviteEmail.trim()
    if (!EMAIL_RE.test(email)) {
      setInviteError("Enter a valid email address.")
      return
    }
    if (team.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      setInviteError("That person is already on the team.")
      return
    }
    const invited: TeamMember = {
      id: `invite-${team.length + 1}-${email}`,
      name: email.split("@")[0],
      email,
      role: inviteRole,
      status: "pending",
    }
    setTeam((t) => [...t, invited])
    setSaved((s) => ({ ...s, members: [...s.members, invited] }))
    onInvite?.({ email, role: inviteRole })
    setInviteOpen(false)
    setInviteEmail("")
    setInviteRole("member")
    setInviteError(undefined)
  }

  const removeMember = (id: string) => {
    setTeam((t) => t.filter((m) => m.id !== id))
    setSaved((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) }))
  }

  const canDelete = confirmText === workspaceName

  const nameError = showErrors ? errors.name : undefined
  const emailError = showErrors ? errors.email : undefined
  const bioError = errors.bio

  return (
    <div
      data-slot="settings-page"
      className={cn(
        "flex h-full min-h-0 w-full flex-col bg-background text-foreground md:flex-row",
        className
      )}
    >
      {/* Navigation */}
      <nav
        aria-label="Settings"
        className="shrink-0 border-b p-3 md:w-56 md:border-r md:border-b-0 md:p-4"
      >
        <div className="md:hidden">
          <Label htmlFor={`${uid}-section`} className="sr-only">
            Settings section
          </Label>
          <Select
            value={section}
            onValueChange={(v) => setSection(v as SettingsSection)}
          >
            <SelectTrigger id={`${uid}-section`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visibleSections.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="mb-3 hidden px-2 eyebrow md:block">{workspaceName}</p>
        <ul className="hidden flex-col gap-0.5 md:flex">
          {visibleSections.map((s) => {
            const active = s.id === section
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSection(s.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`${uid}-nav-active`}
                      transition={spring.snappy}
                      className="absolute inset-0 rounded-md bg-muted"
                    />
                  )}
                  <s.icon className="relative size-4" aria-hidden />
                  <span className="relative font-medium">{s.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Content */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.fast, ease: ease.out }}
              className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-8"
            >
              {section === "profile" && (
                <>
                  <SectionHeader
                    title="Profile"
                    description="How you appear to others in this workspace."
                  />
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      {draftProfile.avatarUrl && (
                        <AvatarImage
                          src={draftProfile.avatarUrl}
                          alt={`${draftProfile.name} avatar`}
                        />
                      )}
                      <AvatarFallback className="text-base">
                        {initials(draftProfile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <label className="cursor-pointer">
                          Upload photo
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={onAvatarFile}
                          />
                        </label>
                      </Button>
                      {draftProfile.avatarUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => patchProfile({ avatarUrl: undefined })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id={`${uid}-name`} label="Name" error={nameError}>
                      <Input
                        id={`${uid}-name`}
                        value={draftProfile.name}
                        onChange={(e) => patchProfile({ name: e.target.value })}
                        aria-invalid={!!nameError}
                        aria-describedby={
                          nameError ? `${uid}-name-error` : undefined
                        }
                        autoComplete="name"
                      />
                    </Field>
                    <Field id={`${uid}-email`} label="Email" error={emailError}>
                      <Input
                        id={`${uid}-email`}
                        type="email"
                        value={draftProfile.email}
                        onChange={(e) =>
                          patchProfile({ email: e.target.value })
                        }
                        aria-invalid={!!emailError}
                        aria-describedby={
                          emailError ? `${uid}-email-error` : undefined
                        }
                        autoComplete="email"
                      />
                    </Field>
                  </div>
                  <Field
                    id={`${uid}-bio`}
                    label="Bio"
                    error={bioError}
                    hint={
                      <span
                        className={cn(
                          "font-mono text-xs",
                          draftProfile.bio.length > BIO_MAX
                            ? "text-destructive"
                            : "text-muted-foreground"
                        )}
                      >
                        {draftProfile.bio.length}/{BIO_MAX}
                      </span>
                    }
                  >
                    <Textarea
                      id={`${uid}-bio`}
                      value={draftProfile.bio}
                      onChange={(e) => patchProfile({ bio: e.target.value })}
                      aria-invalid={!!bioError}
                      aria-describedby={
                        bioError ? `${uid}-bio-error` : undefined
                      }
                      rows={3}
                    />
                  </Field>
                  <Field id={`${uid}-tz`} label="Timezone">
                    <Select
                      value={draftProfile.timezone}
                      onValueChange={(timezone) => patchProfile({ timezone })}
                    >
                      <SelectTrigger
                        id={`${uid}-tz`}
                        className="w-full sm:w-80"
                      >
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Danger zone */}
                  {showDangerZone && (
                    <section
                      aria-labelledby={`${uid}-danger`}
                      className="mt-4 border border-destructive/30"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <h3
                            id={`${uid}-danger`}
                            className="eyebrow text-destructive"
                          >
                            {dangerLabels?.title ?? "Danger zone"}
                          </h3>
                          <p className="mt-1.5 text-sm text-muted-foreground">
                            {dangerLabels?.description ??
                              `Permanently delete ${workspaceName} and all of its data. This cannot be undone.`}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 />
                          {dangerLabels?.action ?? "Delete workspace"}
                        </Button>
                      </div>
                    </section>
                  )}
                </>
              )}

              {section === "notifications" && (
                <>
                  <SectionHeader
                    title="Notifications"
                    description="Choose what we email you about."
                  />
                  {notifications.map((group) => (
                    <fieldset key={group.id} className="min-w-0">
                      <legend className="mb-1 eyebrow">{group.title}</legend>
                      {group.description && (
                        <p className="mb-2 text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      )}
                      <ul className="divide-y border-y">
                        {group.items.map((item) => {
                          const id = `${uid}-n-${item.id}`
                          return (
                            <li
                              key={item.id}
                              className="flex items-center justify-between gap-4 py-3"
                            >
                              <div className="min-w-0">
                                <Label htmlFor={id}>{item.label}</Label>
                                <p
                                  id={`${id}-desc`}
                                  className="mt-1 text-sm text-muted-foreground"
                                >
                                  {item.description}
                                </p>
                              </div>
                              <Switch
                                id={id}
                                aria-describedby={`${id}-desc`}
                                checked={flags[item.id] ?? false}
                                onCheckedChange={(v) =>
                                  setFlags((f) => ({ ...f, [item.id]: v }))
                                }
                              />
                            </li>
                          )
                        })}
                      </ul>
                    </fieldset>
                  ))}
                </>
              )}

              {section === "team" && (
                <>
                  <SectionHeader
                    title="Team"
                    description={`${team.length} people in ${workspaceName}.`}
                    action={
                      <Button size="sm" onClick={() => setInviteOpen(true)}>
                        <UserPlus />
                        Invite member
                      </Button>
                    }
                  />
                  <div className="overflow-x-auto border">
                    <table className="w-full min-w-[30rem] text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="px-3 py-2 eyebrow font-normal">
                            Member
                          </th>
                          <th className="px-3 py-2 eyebrow font-normal">
                            Role
                          </th>
                          <th className="px-3 py-2">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {team.map((m) => (
                          <tr key={m.id}>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-3">
                                <Avatar className="size-8">
                                  <AvatarFallback>
                                    {initials(m.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="flex items-center gap-2 font-medium">
                                    <span className="truncate">{m.name}</span>
                                    {m.status === "pending" && (
                                      <Badge variant="warning">Pending</Badge>
                                    )}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {m.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-2.5">
                              {m.role === "owner" ? (
                                <Badge variant="brand">Owner</Badge>
                              ) : (
                                <Select
                                  value={m.role}
                                  onValueChange={(role) =>
                                    setTeam((t) =>
                                      t.map((x) =>
                                        x.id === m.id
                                          ? { ...x, role: role as TeamRole }
                                          : x
                                      )
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    size="sm"
                                    className="w-28"
                                    aria-label={`Role for ${m.name}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ROLES.map((r) => (
                                      <SelectItem key={r.value} value={r.value}>
                                        {r.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              {m.role !== "owner" && (
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label={`Remove ${m.name}`}
                                  onClick={() => removeMember(m.id)}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {section === "billing" && (
                <>
                  <SectionHeader
                    title="Billing"
                    description="Your plan, usage and past invoices."
                  />
                  <div className="flex flex-wrap items-start justify-between gap-4 border p-4">
                    <div className="min-w-0">
                      <p className="eyebrow">Current plan</p>
                      <p className="mt-2 heading text-3xl">
                        {billing.plan}
                        <span className="ml-3 font-sans text-sm text-muted-foreground">
                          {billing.price} / {billing.interval}
                        </span>
                      </p>
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {billing.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <p className="mt-3 font-mono text-xs text-muted-foreground">
                        Renews {billing.renewsOn}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change plan
                    </Button>
                  </div>

                  <div>
                    <h3 className="mb-3 eyebrow">Usage this period</h3>
                    <ul className="grid gap-4 sm:grid-cols-3">
                      {billing.usage.map((u) => {
                        const pct = Math.min(100, (u.used / u.limit) * 100)
                        return (
                          <li key={u.id} className="border p-3">
                            <p className="text-sm text-muted-foreground">
                              {u.label}
                            </p>
                            <p className="mt-1 font-mono text-sm">
                              {u.used.toLocaleString("en-US")}
                              {u.unit ? ` ${u.unit}` : ""}
                              <span className="text-muted-foreground">
                                {" "}
                                / {u.limit.toLocaleString("en-US")}
                              </span>
                            </p>
                            <div
                              role="progressbar"
                              aria-label={u.label}
                              aria-valuemin={0}
                              aria-valuemax={u.limit}
                              aria-valuenow={u.used}
                              className="mt-3 h-1.5 bg-muted"
                            >
                              <div
                                className={cn(
                                  "h-full",
                                  pct >= 90 ? "bg-warning" : "bg-primary"
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 eyebrow">Invoices</h3>
                    <ul className="divide-y border">
                      {billing.invoices.map((inv) => (
                        <li
                          key={inv.id}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm"
                        >
                          <span className="font-mono text-xs">{inv.id}</span>
                          <span className="min-w-0 flex-1 truncate text-muted-foreground">
                            {inv.date}
                          </span>
                          <span className="font-mono">{inv.amount}</span>
                          <Badge
                            variant={
                              inv.status === "paid"
                                ? "success"
                                : inv.status === "failed"
                                  ? "destructive"
                                  : "warning"
                            }
                            className="capitalize"
                          >
                            {inv.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Download ${inv.id}`}
                            onClick={() => onDownloadInvoice?.(inv)}
                          >
                            <Download />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Unsaved changes bar */}
        <AnimatePresence>
          {dirty && (
            <motion.div
              role="region"
              aria-label="Unsaved changes"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={spring.smooth}
              className="shrink-0 border-t bg-popover"
            >
              <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
                <p className="text-sm" aria-live="polite">
                  You have unsaved changes.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={discard}
                    disabled={saving}
                  >
                    Discard
                  </Button>
                  <Button size="sm" onClick={save} disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Invite dialog */}
      <Dialog
        open={inviteOpen}
        onOpenChange={(o) => {
          setInviteOpen(o)
          if (!o) setInviteError(undefined)
        }}
      >
        <DialogContent>
          <form onSubmit={submitInvite} noValidate className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>
                They will get an email with a link to join {workspaceName}.
              </DialogDescription>
            </DialogHeader>
            <Field id={`${uid}-invite-email`} label="Email" error={inviteError}>
              <Input
                id={`${uid}-invite-email`}
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="name@company.com"
                aria-invalid={!!inviteError}
                aria-describedby={
                  inviteError ? `${uid}-invite-email-error` : undefined
                }
              />
            </Field>
            <Field id={`${uid}-invite-role`} label="Role">
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as TeamRole)}
              >
                <SelectTrigger id={`${uid}-invite-role`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Send invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      {showDangerZone && (
        <Dialog
          open={deleteOpen}
          onOpenChange={(o) => {
            setDeleteOpen(o)
            if (!o) setConfirmText("")
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dangerLabels?.dialogTitle ?? `Delete ${workspaceName}?`}
              </DialogTitle>
              <DialogDescription>
                This permanently removes the workspace, its projects and every
                member&apos;s access. Type{" "}
                <span className="font-mono text-foreground">
                  {workspaceName}
                </span>{" "}
                to confirm.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-1.5">
              <Label htmlFor={`${uid}-confirm`}>Workspace name</Label>
              <Input
                id={`${uid}-confirm`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                autoComplete="off"
                placeholder={workspaceName}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={!canDelete}
                onClick={() => {
                  onDelete?.()
                  setDeleteOpen(false)
                  setConfirmText("")
                }}
              >
                {dangerLabels?.action ?? "Delete workspace"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export { SettingsPage }
