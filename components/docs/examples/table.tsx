"use client"

import * as React from "react"

import { Table, type TableColumn } from "@/components/motion/table"
import { Badge } from "@/components/ui/badge"

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

// Deterministic so the server and the browser render the same rows.
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

export default function TableDemo() {
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
