"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  LayoutGrid,
  List as ListIcon,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { AnimatedNumber } from "@/components/motion/animated-number"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ease, spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

export interface CrmStage {
  id: string
  label: string
}

export interface CrmActivity {
  id: string
  /** What happened, e.g. "Sent revised proposal". */
  text: string
  /** Display label, e.g. "2 days ago". */
  when: string
  kind?: "note" | "email" | "call" | "stage"
}

export interface CrmDeal {
  id: string
  company: string
  contact: string
  email?: string
  phone?: string
  /** Deal value in whole currency units. */
  value: number
  stage: string
  owner: string
  /** ISO date (YYYY-MM-DD) for the expected close. */
  due: string
  /** Display label, e.g. "3 days ago". */
  lastTouched: string
  tags?: string[]
  activity?: CrmActivity[]
}

export interface CrmPipelineProps {
  stages?: CrmStage[]
  deals?: CrmDeal[]
  /** Called after a deal is moved to another stage. */
  onMove?: (dealId: string, toStage: string, deal: CrmDeal) => void
  /** Called with the deal created from the Add deal form. */
  onAdd?: (deal: CrmDeal) => void
  /** Called when a deal is opened in the detail panel. */
  onSelect?: (deal: CrmDeal) => void
  className?: string
}

export const SAMPLE_CRM_STAGES: CrmStage[] = [
  { id: "lead", label: "Lead" },
  { id: "qualified", label: "Qualified" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "won", label: "Won" },
]

export const SAMPLE_CRM_DEALS: CrmDeal[] = [
  {
    id: "d1",
    company: "Northwind Logistics",
    contact: "Amara Okafor",
    email: "amara@northwind.example",
    phone: "+1 555 0142",
    value: 48000,
    stage: "lead",
    owner: "Jonas Weber",
    due: "2026-11-12",
    lastTouched: "Today",
    tags: ["Inbound", "Logistics"],
    activity: [
      {
        id: "a1",
        text: "Requested a demo from the pricing page",
        when: "Today",
        kind: "note",
      },
    ],
  },
  {
    id: "d2",
    company: "Brightside Health",
    contact: "Priya Raman",
    email: "priya@brightside.example",
    phone: "+1 555 0178",
    value: 22500,
    stage: "lead",
    owner: "Mina Park",
    due: "2026-11-30",
    lastTouched: "3 days ago",
    tags: ["Referral"],
    activity: [
      {
        id: "a1",
        text: "Introduced by a partner on email",
        when: "3 days ago",
        kind: "email",
      },
    ],
  },
  {
    id: "d3",
    company: "Cobalt Studio",
    contact: "Leo Martins",
    email: "leo@cobalt.example",
    phone: "+1 555 0113",
    value: 15000,
    stage: "qualified",
    owner: "Jonas Weber",
    due: "2026-10-28",
    lastTouched: "Yesterday",
    tags: ["Design", "SMB"],
    activity: [
      {
        id: "a1",
        text: "Discovery call, 30 min",
        when: "Yesterday",
        kind: "call",
      },
      { id: "a2", text: "Sent intro deck", when: "5 days ago", kind: "email" },
    ],
  },
  {
    id: "d4",
    company: "Harbor & Pine",
    contact: "Sofia Alvarez",
    email: "sofia@harborpine.example",
    phone: "+1 555 0190",
    value: 67000,
    stage: "qualified",
    owner: "Mina Park",
    due: "2026-11-20",
    lastTouched: "2 days ago",
    tags: ["Retail", "Enterprise"],
    activity: [
      {
        id: "a1",
        text: "Security questionnaire received",
        when: "2 days ago",
        kind: "note",
      },
      {
        id: "a2",
        text: "Qualified on budget and timeline",
        when: "1 week ago",
        kind: "stage",
      },
    ],
  },
  {
    id: "d5",
    company: "Quill Analytics",
    contact: "Daniel Cho",
    email: "daniel@quill.example",
    phone: "+1 555 0165",
    value: 92000,
    stage: "proposal",
    owner: "Jonas Weber",
    due: "2026-10-31",
    lastTouched: "Today",
    tags: ["Enterprise", "Data"],
    activity: [
      {
        id: "a1",
        text: "Sent revised proposal v2",
        when: "Today",
        kind: "email",
      },
      {
        id: "a2",
        text: "Pricing review with finance",
        when: "4 days ago",
        kind: "call",
      },
    ],
  },
  {
    id: "d6",
    company: "Marlowe Foods",
    contact: "Grace Nwosu",
    email: "grace@marlowe.example",
    phone: "+1 555 0127",
    value: 31000,
    stage: "proposal",
    owner: "Mina Park",
    due: "2026-11-05",
    lastTouched: "1 week ago",
    tags: ["Retail"],
    activity: [
      {
        id: "a1",
        text: "Proposal sent, awaiting reply",
        when: "1 week ago",
        kind: "email",
      },
    ],
  },
  {
    id: "d7",
    company: "Atlas Robotics",
    contact: "Henrik Sund",
    email: "henrik@atlas.example",
    phone: "+1 555 0151",
    value: 128000,
    stage: "negotiation",
    owner: "Jonas Weber",
    due: "2026-10-22",
    lastTouched: "Today",
    tags: ["Enterprise", "Priority"],
    activity: [
      {
        id: "a1",
        text: "Legal redlines returned",
        when: "Today",
        kind: "note",
      },
      { id: "a2", text: "Exec sponsor call", when: "3 days ago", kind: "call" },
      {
        id: "a3",
        text: "Moved to Negotiation",
        when: "1 week ago",
        kind: "stage",
      },
    ],
  },
  {
    id: "d8",
    company: "Fernhill Education",
    contact: "Tomas Ibarra",
    email: "tomas@fernhill.example",
    phone: "+1 555 0136",
    value: 18500,
    stage: "won",
    owner: "Mina Park",
    due: "2026-10-05",
    lastTouched: "4 days ago",
    tags: ["Education"],
    activity: [
      { id: "a1", text: "Contract signed", when: "4 days ago", kind: "stage" },
    ],
  },
]

const currency: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

function formatDue(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d)
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", currency).format(value)
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

type SortKey = "company" | "stage" | "value" | "owner" | "due"
type SortDir = "asc" | "desc"

function CrmPipeline({
  stages = SAMPLE_CRM_STAGES,
  deals: dealsProp = SAMPLE_CRM_DEALS,
  onMove,
  onAdd,
  onSelect,
  className,
}: CrmPipelineProps) {
  const reduce = useReducedMotion()
  const [deals, setDeals] = React.useState<CrmDeal[]>(dealsProp)
  const [view, setView] = React.useState<"board" | "list">("board")
  const [query, setQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [adding, setAdding] = React.useState(false)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [overStage, setOverStage] = React.useState<string | null>(null)
  const [sort, setSort] = React.useState<{ key: SortKey; dir: SortDir }>({
    key: "due",
    dir: "asc",
  })
  const [nextId, setNextId] = React.useState(1)

  const stageLabel = React.useCallback(
    (id: string) => stages.find((s) => s.id === id)?.label ?? id,
    [stages]
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return deals
    return deals.filter((d) =>
      [d.company, d.contact, d.owner, ...(d.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [deals, query])

  const selected = deals.find((d) => d.id === selectedId) ?? null

  function open(deal: CrmDeal) {
    setSelectedId(deal.id)
    onSelect?.(deal)
  }

  function move(dealId: string, toStage: string) {
    const current = deals.find((d) => d.id === dealId)
    if (!current || current.stage === toStage) return
    const next: CrmDeal = {
      ...current,
      stage: toStage,
      lastTouched: "Just now",
      activity: [
        {
          id: `${dealId}-m${(current.activity?.length ?? 0) + 1}`,
          text: `Moved to ${stageLabel(toStage)}`,
          when: "Just now",
          kind: "stage",
        },
        ...(current.activity ?? []),
      ],
    }
    setDeals((all) => all.map((d) => (d.id === dealId ? next : d)))
    onMove?.(dealId, toStage, next)
  }

  function add(input: Omit<CrmDeal, "id">) {
    const deal: CrmDeal = { ...input, id: `new-${nextId}` }
    setNextId((n) => n + 1)
    setDeals((all) => [deal, ...all])
    onAdd?.(deal)
    setAdding(false)
    setView("board")
  }

  const sorted = React.useMemo(() => {
    const order = new Map(stages.map((s, i) => [s.id, i]))
    const dir = sort.dir === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => {
      let r = 0
      switch (sort.key) {
        case "value":
          r = a.value - b.value
          break
        case "stage":
          r = (order.get(a.stage) ?? 0) - (order.get(b.stage) ?? 0)
          break
        case "due":
          r = a.due.localeCompare(b.due)
          break
        default:
          r = a[sort.key].localeCompare(b[sort.key])
      }
      return r * dir
    })
  }, [filtered, sort, stages])

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "value" ? "desc" : "asc" }
    )
  }

  const total = filtered.reduce((sum, d) => sum + d.value, 0)

  return (
    <div
      data-slot="crm-pipeline"
      className={cn(
        "relative flex h-full min-h-[480px] w-full flex-col overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <header className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 sm:mr-auto">
          <p className="eyebrow text-muted-foreground">Sales</p>
          <h2 className="mt-1 flex flex-wrap items-baseline gap-x-3 heading text-2xl">
            Pipeline
            <span className="font-mono text-sm text-muted-foreground">
              <AnimatedNumber value={total} format={currency} /> across{" "}
              {filtered.length} {filtered.length === 1 ? "deal" : "deals"}
            </span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              aria-label="Search deals"
              placeholder="Search deals"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "board" | "list")}
          >
            <TabsList aria-label="View">
              <TabsTrigger value="board" aria-label="Board view">
                <LayoutGrid /> Board
              </TabsTrigger>
              <TabsTrigger value="list" aria-label="List view">
                <ListIcon /> List
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => setAdding(true)}>
            <Plus /> Add deal
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        {view === "board" ? (
          <div className="flex h-full gap-3 overflow-x-auto p-4">
            {stages.map((stage) => {
              const items = filtered.filter((d) => d.stage === stage.id)
              const sum = items.reduce((s, d) => s + d.value, 0)
              const isOver = overStage === stage.id && dragId !== null
              return (
                <section
                  key={stage.id}
                  aria-label={`${stage.label} stage`}
                  onDragOver={(e) => {
                    if (!dragId) return
                    e.preventDefault()
                    e.dataTransfer.dropEffect = "move"
                    setOverStage(stage.id)
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOverStage((s) => (s === stage.id ? null : s))
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    const id = e.dataTransfer.getData("text/plain") || dragId
                    if (id) move(id, stage.id)
                    setDragId(null)
                    setOverStage(null)
                  }}
                  className={cn(
                    "flex h-full w-72 shrink-0 flex-col border bg-surface transition-colors",
                    "rounded-lg",
                    isOver && "border-brand bg-brand/5"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="truncate eyebrow">{stage.label}</h3>
                      <Badge variant="secondary" className="font-mono">
                        {items.length}
                      </Badge>
                    </div>
                    <AnimatedNumber
                      value={sum}
                      format={currency}
                      className="font-mono text-xs text-muted-foreground"
                    />
                  </div>
                  <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
                    {items.length === 0 ? (
                      <li className="flex flex-1 items-center justify-center rounded-md border border-dashed bg-dots p-4 text-center text-xs text-muted-foreground">
                        Drop a deal here
                      </li>
                    ) : (
                      items.map((deal) => (
                        <DealCard
                          key={deal.id}
                          deal={deal}
                          stages={stages}
                          dragging={dragId === deal.id}
                          onOpen={() => open(deal)}
                          onMove={(to) => move(deal.id, to)}
                          onDragStart={() => setDragId(deal.id)}
                          onDragEnd={() => {
                            setDragId(null)
                            setOverStage(null)
                          }}
                        />
                      ))
                    )}
                  </ul>
                </section>
              )
            })}
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-background">
                <tr className="border-b">
                  <SortHead
                    k="company"
                    label="Deal"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHead
                    k="stage"
                    label="Stage"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHead
                    k="value"
                    label="Value"
                    align="right"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHead
                    k="owner"
                    label="Owner"
                    sort={sort}
                    onSort={toggleSort}
                  />
                  <SortHead
                    k="due"
                    label="Close date"
                    sort={sort}
                    onSort={toggleSort}
                  />
                </tr>
              </thead>
              <tbody>
                {sorted.map((deal) => (
                  <tr
                    key={deal.id}
                    onClick={() => open(deal)}
                    className="cursor-pointer border-b transition-colors hover:bg-accent"
                  >
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          open(deal)
                        }}
                        className="flex items-center gap-2.5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
                      >
                        <Avatar className="size-7">
                          <AvatarFallback>
                            {initials(deal.contact)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          <span className="block font-medium">
                            {deal.company}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {deal.contact}
                          </span>
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline">{stageLabel(deal.stage)}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                      {formatMoney(deal.value)}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {deal.owner}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                      {formatDue(deal.due)}
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-muted-foreground"
                    >
                      No deals match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.button
              key="scrim"
              type="button"
              aria-label="Close deal details"
              tabIndex={-1}
              onClick={() => setSelectedId(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: ease.out }}
              className="absolute inset-0 z-20 cursor-default bg-background/60 backdrop-blur-[2px]"
            />
            <DealPanel
              key="panel"
              deal={selected}
              stages={stages}
              reduce={!!reduce}
              onClose={() => setSelectedId(null)}
              onMove={(to) => move(selected.id, to)}
            />
          </>
        )}
      </AnimatePresence>

      <AddDealDialog
        open={adding}
        onOpenChange={setAdding}
        stages={stages}
        onSubmit={add}
      />
    </div>
  )
}

function SortHead({
  k,
  label,
  align,
  sort,
  onSort,
}: {
  k: SortKey
  label: string
  align?: "right"
  sort: { key: SortKey; dir: SortDir }
  onSort: (k: SortKey) => void
}) {
  const active = sort.key === k
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown
  return (
    <th
      scope="col"
      aria-sort={
        active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn("px-4 py-2", align === "right" && "text-right")}
    >
      <button
        type="button"
        onClick={() => onSort(k)}
        className={cn(
          "inline-flex items-center gap-1.5 eyebrow text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
          active && "text-foreground"
        )}
      >
        {label}
        <Icon className="size-3" aria-hidden />
      </button>
    </th>
  )
}

function StageMenuItems({
  stages,
  current,
  onMove,
}: {
  stages: CrmStage[]
  current: string
  onMove: (to: string) => void
}) {
  return (
    <>
      {stages.map((s) => (
        <DropdownMenuItem
          key={s.id}
          disabled={s.id === current}
          onSelect={() => onMove(s.id)}
        >
          {s.label}
        </DropdownMenuItem>
      ))}
    </>
  )
}

function DealCard({
  deal,
  stages,
  dragging,
  onOpen,
  onMove,
  onDragStart,
  onDragEnd,
}: {
  deal: CrmDeal
  stages: CrmStage[]
  dragging: boolean
  onOpen: () => void
  onMove: (to: string) => void
  onDragStart: () => void
  onDragEnd: () => void
}) {
  return (
    <li
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", deal.id)
        e.dataTransfer.effectAllowed = "move"
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab rounded-md border bg-card transition-[border-color,opacity] hover:border-foreground/25 active:cursor-grabbing",
        dragging && "opacity-40"
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full flex-col gap-2.5 rounded-md p-3 pr-9 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        <span className="text-sm leading-tight font-medium">
          {deal.company}
        </span>
        <span className="flex items-center gap-2">
          <Avatar className="size-5">
            <AvatarFallback className="text-[10px]">
              {initials(deal.contact)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">
            {deal.contact}
          </span>
        </span>
        <span className="font-mono text-base tabular-nums">
          {formatMoney(deal.value)}
        </span>
        {deal.tags && deal.tags.length > 0 && (
          <span className="flex flex-wrap gap-1">
            {deal.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </span>
        )}
        <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{deal.owner}</span>
          <span className="inline-flex shrink-0 items-center gap-1 font-mono">
            <CalendarDays className="size-3" aria-hidden />
            {formatDue(deal.due)}
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          Touched {deal.lastTouched.toLowerCase()}
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Actions for ${deal.company}`}
            className="absolute top-1.5 right-1.5"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={onOpen}>Open details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to stage</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>Stage</DropdownMenuLabel>
              <StageMenuItems
                stages={stages}
                current={deal.stage}
                onMove={onMove}
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

function DealPanel({
  deal,
  stages,
  reduce,
  onClose,
  onMove,
}: {
  deal: CrmDeal
  stages: CrmStage[]
  reduce: boolean
  onClose: () => void
  onMove: (to: string) => void
}) {
  const titleId = React.useId()
  const closeRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <motion.aside
      role="dialog"
      aria-labelledby={titleId}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation()
          onClose()
        }
      }}
      initial={reduce ? { opacity: 0 } : { x: "100%" }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: "100%" }}
      transition={reduce ? { duration: 0.2, ease: ease.out } : spring.smooth}
      className="absolute inset-y-0 right-0 z-30 flex w-full max-w-md flex-col border-l bg-background"
    >
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <div className="min-w-0">
          <p className="eyebrow text-muted-foreground">Deal</p>
          <h3 id={titleId} className="mt-1 heading text-2xl">
            {deal.company}
          </h3>
          <p className="mt-1 font-mono text-sm tabular-nums">
            {formatMoney(deal.value)}
          </p>
        </div>
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon-sm"
          aria-label="Close"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <Field label="Stage">
            <Select value={deal.stage} onValueChange={onMove}>
              <SelectTrigger aria-label="Stage" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stages.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Owner">{deal.owner}</Field>
          <Field label="Contact">
            <span className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">
                  {initials(deal.contact)}
                </AvatarFallback>
              </Avatar>
              {deal.contact}
            </span>
          </Field>
          <Field label="Close date">{formatDue(deal.due)}</Field>
          {deal.email && (
            <Field label="Email">
              <a
                href={`mailto:${deal.email}`}
                className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
              >
                <Mail className="size-3.5" aria-hidden />
                <span className="truncate">{deal.email}</span>
              </a>
            </Field>
          )}
          {deal.phone && (
            <Field label="Phone">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" aria-hidden />
                {deal.phone}
              </span>
            </Field>
          )}
          {deal.tags && deal.tags.length > 0 && (
            <Field label="Tags" className="col-span-2">
              <span className="flex flex-wrap gap-1">
                {deal.tags.map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </span>
            </Field>
          )}
        </dl>

        <section aria-label="Activity">
          <h4 className="mb-3 eyebrow text-muted-foreground">Activity</h4>
          {deal.activity && deal.activity.length > 0 ? (
            <ol className="relative space-y-4 border-l pl-4">
              {deal.activity.map((a) => (
                <li key={a.id} className="relative text-sm">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1.5 -left-[21px] size-2 rounded-full border bg-background",
                      a.kind === "stage" && "border-brand bg-brand"
                    )}
                  />
                  <p>{a.text}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {a.when}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          )}
        </section>
      </div>
    </motion.aside>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function AddDealDialog({
  open,
  onOpenChange,
  stages,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  stages: CrmStage[]
  onSubmit: (deal: Omit<CrmDeal, "id">) => void
}) {
  const uid = React.useId()
  const [company, setCompany] = React.useState("")
  const [contact, setContact] = React.useState("")
  const [value, setValue] = React.useState("")
  const [stage, setStage] = React.useState(stages[0]?.id ?? "")
  const [touched, setTouched] = React.useState(false)

  const amount = Number(value)
  const errors = {
    company: company.trim() ? "" : "Company is required.",
    value:
      value && Number.isFinite(amount) && amount >= 0
        ? ""
        : "Enter a value of 0 or more.",
  }

  function reset() {
    setCompany("")
    setContact("")
    setValue("")
    setStage(stages[0]?.id ?? "")
    setTouched(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (errors.company || errors.value) return
    onSubmit({
      company: company.trim(),
      contact: contact.trim() || "Unassigned",
      value: amount,
      stage,
      owner: "You",
      due: "2026-12-15",
      lastTouched: "Just now",
      tags: [],
      activity: [
        { id: "created", text: "Deal created", when: "Just now", kind: "note" },
      ],
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={submit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add deal</DialogTitle>
            <DialogDescription>
              Create a deal and place it in a pipeline stage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor={`${uid}-company`}>Company</Label>
            <Input
              id={`${uid}-company`}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              aria-invalid={touched && !!errors.company}
              aria-describedby={
                touched && errors.company ? `${uid}-ce` : undefined
              }
              autoComplete="off"
            />
            {touched && errors.company && (
              <p id={`${uid}-ce`} className="text-xs text-destructive">
                {errors.company}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${uid}-contact`}>Contact</Label>
            <Input
              id={`${uid}-contact`}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor={`${uid}-value`}>Value (USD)</Label>
              <Input
                id={`${uid}-value`}
                inputMode="numeric"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-invalid={touched && !!errors.value}
                aria-describedby={
                  touched && errors.value ? `${uid}-ve` : undefined
                }
              />
              {touched && errors.value && (
                <p id={`${uid}-ve`} className="text-xs text-destructive">
                  {errors.value}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={`${uid}-stage`}>Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger id={`${uid}-stage`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add deal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CrmPipeline }
