"use client"

import * as React from "react"

import {
  StageBoard,
  type StageBoardStage,
} from "@/components/blocks/stage-board"
import { Badge } from "@/components/ui/badge"

type Ticket = {
  id: string
  subject: string
  requester: string
  stage: string
  priority: "Low" | "High" | "Urgent"
}

type Candidate = {
  id: string
  name: string
  role: string
  stage: string
  offer: number
  email: string
}

const ticketStages: StageBoardStage[] = [
  { id: "new", label: "New" },
  { id: "working", label: "Working", limit: 2 },
  { id: "waiting", label: "Waiting on customer" },
  { id: "resolved", label: "Resolved" },
]

const tickets: Ticket[] = [
  {
    id: "T-1041",
    subject: "Cannot export report",
    requester: "Dana Whitfield",
    stage: "new",
    priority: "High",
  },
  {
    id: "T-1042",
    subject: "Invoice shows wrong address",
    requester: "Ravi Menon",
    stage: "new",
    priority: "Low",
  },
  {
    id: "T-1038",
    subject: "Login loop on mobile",
    requester: "Chloe Park",
    stage: "working",
    priority: "Urgent",
  },
  {
    id: "T-1036",
    subject: "Webhook retries failing",
    requester: "Marcus Bell",
    stage: "working",
    priority: "High",
  },
  {
    id: "T-1035",
    subject: "Slow dashboard load",
    requester: "Ines Duarte",
    stage: "working",
    priority: "High",
  },
  {
    id: "T-1030",
    subject: "Update billing contact",
    requester: "Noah Kim",
    stage: "resolved",
    priority: "Low",
  },
]

const hiringStages: StageBoardStage[] = [
  { id: "applied", label: "Applied" },
  { id: "screen", label: "Phone screen", limit: 4 },
  { id: "onsite", label: "Onsite", limit: 3 },
  { id: "offer", label: "Offer" },
]

const candidates: Candidate[] = [
  {
    id: "c1",
    name: "Priya Shah",
    role: "Product designer",
    stage: "applied",
    offer: 0,
    email: "priya@example.com",
  },
  {
    id: "c2",
    name: "Tomas Reyes",
    role: "Backend engineer",
    stage: "screen",
    offer: 0,
    email: "tomas@example.com",
  },
  {
    id: "c3",
    name: "Hana Ito",
    role: "Backend engineer",
    stage: "onsite",
    offer: 0,
    email: "hana@example.com",
  },
  {
    id: "c4",
    name: "Leo Grant",
    role: "Data analyst",
    stage: "offer",
    offer: 92000,
    email: "leo@example.com",
  },
]

const priorityVariant = {
  Low: "secondary",
  High: "warning",
  Urgent: "destructive",
} as const

export default function StageBoardDemo() {
  const [domain, setDomain] = React.useState<"support" | "hiring">("support")
  return (
    <div className="grid w-full gap-3">
      <div role="group" aria-label="Sample data" className="flex gap-2">
        {(["support", "hiring"] as const).map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={domain === d}
            onClick={() => setDomain(d)}
            className="rounded-sm border px-2.5 py-1 text-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring aria-pressed:bg-ink aria-pressed:text-ink-foreground"
          >
            {d === "support" ? "Support tickets" : "Hiring"}
          </button>
        ))}
      </div>
      <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
        {domain === "support" ? <SupportBoard /> : <HiringBoard />}
      </div>
    </div>
  )
}

function useBoard<T extends { id: string; stage: string }>(initial: T[]) {
  const [items, setItems] = React.useState(initial)
  function onMove(id: string, toStage: string, index: number) {
    setItems((all) => {
      const moving = all.find((i) => i.id === id)
      if (!moving) return all
      const rest = all.filter((i) => i.id !== id)
      const dest = rest.filter((i) => i.stage === toStage)
      const before = dest[index]
      const next = { ...moving, stage: toStage }
      if (!before) {
        const last = dest[dest.length - 1]
        const at = last ? rest.indexOf(last) + 1 : rest.length
        return [...rest.slice(0, at), next, ...rest.slice(at)]
      }
      const at = rest.indexOf(before)
      return [...rest.slice(0, at), next, ...rest.slice(at)]
    })
  }
  return { items, onMove }
}

function SupportBoard() {
  const { items, onMove } = useBoard(tickets)
  return (
    <StageBoard
      stages={ticketStages}
      items={items}
      getItemId={(t) => t.id}
      getStage={(t) => t.stage}
      getItemLabel={(t) => t.subject}
      onMove={onMove}
      labels={{
        eyebrow: "Support",
        title: "Tickets",
        summary: "{count} open or recent",
        empty: "No tickets",
        emptyDrop: "Drop ticket here",
      }}
      renderCard={(t) => (
        <>
          <span className="font-mono text-xs text-muted-foreground">
            {t.id}
          </span>
          <span className="text-sm leading-tight font-medium">{t.subject}</span>
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-xs text-muted-foreground">
              {t.requester}
            </span>
            <Badge variant={priorityVariant[t.priority]}>{t.priority}</Badge>
          </span>
        </>
      )}
      renderDetail={(t) => (
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="eyebrow text-muted-foreground">Ticket</dt>
            <dd className="font-mono">{t.id}</dd>
          </div>
          <div>
            <dt className="eyebrow text-muted-foreground">Priority</dt>
            <dd>{t.priority}</dd>
          </div>
          <div className="col-span-2">
            <dt className="eyebrow text-muted-foreground">Requester</dt>
            <dd>{t.requester}</dd>
          </div>
        </dl>
      )}
    />
  )
}

function HiringBoard() {
  const { items, onMove } = useBoard(candidates)
  const money = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  })
  return (
    <StageBoard
      stages={hiringStages}
      items={items}
      getItemId={(c) => c.id}
      getStage={(c) => c.stage}
      getItemLabel={(c) => c.name}
      onMove={onMove}
      enforceLimits
      getValue={(c) => c.offer}
      formatValue={(v) => (v ? money.format(v) : "")}
      labels={{
        eyebrow: "Recruiting",
        title: "Candidates",
        summary: "{count} in process",
        empty: "No candidates",
        emptyDrop: "Drop candidate here",
        total: "Offers",
      }}
      renderCard={(c) => (
        <>
          <span className="text-sm leading-tight font-medium">{c.name}</span>
          <span className="text-xs text-muted-foreground">{c.role}</span>
        </>
      )}
      renderDetail={(c) => (
        <dl className="grid gap-4 text-sm">
          <div>
            <dt className="eyebrow text-muted-foreground">Role</dt>
            <dd>{c.role}</dd>
          </div>
          <div>
            <dt className="eyebrow text-muted-foreground">Email</dt>
            <dd className="font-mono">{c.email}</dd>
          </div>
        </dl>
      )}
    />
  )
}
