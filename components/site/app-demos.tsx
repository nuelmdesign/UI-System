"use client"

import * as React from "react"
import {
  Bell,
  Bot,
  CreditCard,
  FileText,
  LayoutGrid,
  Moon,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Drawer } from "@/components/motion/drawer"
import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette"
import { Table, type TableColumn } from "@/components/motion/table"
import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerClear,
  DateRangePickerContent,
  DateRangePickerFooter,
  DateRangePickerGrid,
  DateRangePickerHeader,
  DateRangePickerSelection,
  DateRangePickerTrigger,
} from "@/components/motion/date-range-picker"

/* --------------------------------- Drawer ---------------------------------- */

export function DrawerDemo() {
  const [open, setOpen] = React.useState(false)
  const [side, setSide] = React.useState<"left" | "right">("right")
  const show = (s: "left" | "right") => {
    setSide(s)
    setOpen(true)
  }

  return (
    <>
      <Button variant="outline" onClick={() => show("left")}>
        Open left
      </Button>
      <Button onClick={() => show("right")}>Open settings</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        side={side}
        ariaLabel="Workspace settings"
        className="gap-6 p-6"
      >
        <div>
          <p className="eyebrow text-muted-foreground">Workspace</p>
          <h2 className="mt-3 font-display text-3xl font-light tracking-[-0.02em]">
            Settings
          </h2>
        </div>
        <div className="grid gap-4 border-t pt-6">
          {[
            ["notify", "Email notifications", true],
            ["digest", "Weekly digest", false],
            ["agents", "Let agents run tools", true],
          ].map(([id, label, on]) => (
            <div
              key={id as string}
              className="flex items-center justify-between gap-4"
            >
              <Label htmlFor={`drawer-${id}`}>{label}</Label>
              <Switch id={`drawer-${id}`} defaultChecked={on as boolean} />
            </div>
          ))}
        </div>
        <div className="mt-auto flex gap-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setOpen(false)
              toast.success("Settings saved")
            }}
          >
            Save
          </Button>
        </div>
      </Drawer>
    </>
  )
}

/* ----------------------------- Command palette ----------------------------- */

export function CommandPaletteDemo() {
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
      id: "foundations",
      label: "Foundations",
      group: "Go to",
      icon: LayoutGrid,
      onSelect: () => {
        location.hash = "foundations"
      },
    },
    {
      id: "agents",
      label: "Agent components",
      group: "Go to",
      icon: Bot,
      onSelect: () => {
        location.hash = "agents"
      },
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
        className="w-full justify-between text-muted-foreground sm:w-72"
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

/* ------------------------------- Data table -------------------------------- */

type Person = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "invited" | "suspended"
  mrr: number
}

const FIRST = [
  "Ava",
  "Leo",
  "Mia",
  "Kai",
  "Zoe",
  "Eli",
  "Noa",
  "Ren",
  "Ivy",
  "Jude",
]
const LAST = [
  "Cole",
  "Frost",
  "Vale",
  "Reyes",
  "Okafor",
  "Sato",
  "Lund",
  "Marsh",
  "Bose",
  "Quinn",
]
const ROLES = ["Owner", "Admin", "Member", "Viewer"]
const STATUSES: Person["status"][] = ["active", "invited", "suspended"]
const STATUS_VARIANT = {
  active: "success",
  invited: "warning",
  suspended: "destructive",
} as const

// Deterministic so server and client render the same rows.
function buildPeople(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST[i % FIRST.length]
    const last = LAST[(i * 7) % LAST.length]
    return {
      id: String(i),
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      role: ROLES[(i * 3) % ROLES.length],
      status: STATUSES[(i * 5) % STATUSES.length],
      mrr: 12 + ((i * 37) % 488),
    }
  })
}

export function DataTableDemo() {
  const data = React.useMemo(() => buildPeople(10_000), [])
  const [selected, setSelected] = React.useState<string[]>([])
  const columns = React.useMemo<TableColumn<Person>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        sortable: true,
        width: "1.4fr",
        cell: (row) => <span className="font-medium">{row.name}</span>,
      },
      { key: "email", header: "Email", width: "1.8fr" },
      { key: "role", header: "Role", sortable: true, width: "120px" },
      {
        key: "status",
        header: "Status",
        width: "130px",
        cell: (row) => (
          <Badge
            variant={STATUS_VARIANT[row.status]}
            dot
            className="capitalize"
          >
            {row.status}
          </Badge>
        ),
      },
      {
        key: "mrr",
        header: "MRR",
        sortable: true,
        align: "right",
        width: "110px",
        cell: (row) => (
          <span className="tabular-nums">${row.mrr.toLocaleString()}</span>
        ),
      },
    ],
    []
  )

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <span>{data.length.toLocaleString()} rows · virtualized</span>
        {selected.length > 0 ? (
          <span>{selected.length.toLocaleString()} selected</span>
        ) : null}
      </div>
      <Table
        data={data}
        columns={columns}
        selectable
        resizable
        reorderable
        selectedRowIds={selected}
        onSelectionChange={setSelected}
        defaultSort={{ key: "mrr", direction: "desc" }}
        height={400}
        rowHeight={48}
      />
    </div>
  )
}

/* ---------------------------- Date range picker ---------------------------- */

function isoDaysAgo(daysAgo: number) {
  const day = new Date()
  day.setDate(day.getDate() - daysAgo)
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
}

const subscribeNever = () => () => {}

export function DateRangeDemo() {
  // Dates are only known in the browser; the server renders a placeholder.
  const today = React.useSyncExternalStore(
    subscribeNever,
    () => isoDaysAgo(0),
    () => null
  )
  if (!today) {
    return (
      <Button variant="outline" disabled>
        Reporting period
      </Button>
    )
  }
  return (
    <DateRangePicker
      label="Reporting period"
      defaultMonth={today}
      defaultValue={{ from: isoDaysAgo(6), to: today }}
      max={today}
    >
      <DateRangePickerTrigger />
      <DateRangePickerContent>
        <DateRangePickerCalendar className="w-full rounded-none border-0">
          <DateRangePickerHeader />
          <DateRangePickerGrid />
          <DateRangePickerFooter>
            <div className="flex items-center justify-between gap-2">
              <DateRangePickerSelection />
              <DateRangePickerClear />
            </div>
          </DateRangePickerFooter>
        </DateRangePickerCalendar>
      </DateRangePickerContent>
    </DateRangePicker>
  )
}
