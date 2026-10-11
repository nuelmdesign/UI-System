"use client"

import * as React from "react"
import { Archive, Download, Trash2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BulkActionBar } from "@/components/ui/bulk-action-bar"

export default function BulkActionBarDemo() {
  const [a, setA] = React.useState(3)
  const [b, setB] = React.useState(2)

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-muted-foreground">Invoices</p>
        <div className="flex items-center gap-2">
          <Button size="xs" variant="outline" onClick={() => setA(a + 1)}>
            Select one more
          </Button>
        </div>
        <BulkActionBar
          count={a}
          onClear={() => setA(0)}
          actions={[
            {
              id: "export",
              label: "Export",
              icon: <Download />,
              onSelect: () => {},
            },
            {
              id: "archive",
              label: "Archive",
              icon: <Archive />,
              onSelect: () => {},
            },
            {
              id: "delete",
              label: "Delete",
              icon: <Trash2 />,
              destructive: true,
              onSelect: () => setA(0),
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-muted-foreground">Staff, custom labels</p>
        <Button
          size="xs"
          variant="outline"
          className="w-fit"
          onClick={() => setB(b + 1)}
        >
          Select one more
        </Button>
        <BulkActionBar
          count={b}
          onClear={() => setB(0)}
          labels={{
            selected: (n) =>
              `${n} ${n === 1 ? "employee" : "employees"} chosen`,
            clear: "Deselect all",
          }}
          actions={[
            {
              id: "assign",
              label: "Assign manager",
              icon: <UserPlus />,
              onSelect: () => {},
            },
          ]}
        />
      </div>
    </div>
  )
}
