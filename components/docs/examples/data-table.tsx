"use client"

import { Archive, Download } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type DataTableColumn } from "@/components/blocks/data-table"

type Shipment = {
  id: string
  origin: string
  destination: string
  mode: "Air" | "Sea" | "Road"
  status: "In transit" | "Delayed" | "Delivered"
  eta: string
  weightKg: number
}

type Employee = {
  id: string
  name: string
  team: string
  location: string
  status: "Active" | "On leave"
  start: string
  salary: number
}

const modes = ["Air", "Sea", "Road"] as const
const shipStatus = ["In transit", "Delayed", "Delivered"] as const
const cities = ["Rotterdam", "Singapore", "Chicago", "Lagos", "Santos"]

const shipments: Shipment[] = Array.from({ length: 18 }, (_, i) => ({
  id: `SHP-${4100 + i}`,
  origin: cities[i % 5],
  destination: cities[(i * 2 + 1) % 5],
  mode: modes[i % 3],
  status: shipStatus[(i * 2) % 3],
  eta: `2026-11-${String((i % 28) + 1).padStart(2, "0")}`,
  weightKg: 180 + ((i * 431) % 9000),
}))

const teams = ["Engineering", "Support", "Finance", "Design"]
const employees: Employee[] = Array.from({ length: 16 }, (_, i) => ({
  id: `EMP-${200 + i}`,
  name: `Employee ${i + 1}`,
  team: teams[i % 4],
  location: ["Remote", "Berlin", "Austin"][i % 3],
  status: i % 5 === 4 ? "On leave" : "Active",
  start: `202${(i % 5) + 1}-0${(i % 9) + 1}-15`,
  salary: 52000 + ((i * 7919) % 60000),
}))

const money = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})
const kg = new Intl.NumberFormat("en")

const shipmentColumns: DataTableColumn<Shipment>[] = [
  { key: "id", header: "Shipment", mono: true, sortable: true },
  { key: "origin", header: "Origin", sortable: true },
  { key: "destination", header: "Destination", sortable: true },
  { key: "mode", header: "Mode" },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (r) => (
      <Badge
        dot
        variant={
          r.status === "Delayed"
            ? "warning"
            : r.status === "Delivered"
              ? "success"
              : "secondary"
        }
      >
        {r.status}
      </Badge>
    ),
  },
  { key: "eta", header: "ETA", mono: true, sortable: true },
  {
    key: "weightKg",
    header: "Weight (kg)",
    mono: true,
    sortable: true,
    align: "right",
    cell: (r) => kg.format(r.weightKg),
  },
]

const employeeColumns: DataTableColumn<Employee>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "team", header: "Team", sortable: true },
  { key: "location", header: "Location" },
  {
    key: "status",
    header: "Status",
    cell: (r) => (
      <Badge dot variant={r.status === "Active" ? "success" : "outline"}>
        {r.status}
      </Badge>
    ),
  },
  { key: "start", header: "Start date", mono: true, sortable: true },
  {
    key: "salary",
    header: "Salary",
    mono: true,
    sortable: true,
    align: "right",
    cell: (r) => money.format(r.salary),
  },
]

const frame = "h-[680px] w-full overflow-hidden rounded-lg border bg-background"

export default function DataTableDemo() {
  return (
    <Tabs defaultValue="shipments" className="w-full">
      <TabsList>
        <TabsTrigger value="shipments">Shipments</TabsTrigger>
        <TabsTrigger value="employees">Employees</TabsTrigger>
      </TabsList>
      <TabsContent value="shipments">
        <div className={frame}>
          <DataTable<Shipment>
            columns={shipmentColumns}
            rows={shipments}
            getRowId={(r) => r.id}
            selectable
            pageSize={8}
            defaultSort={{ key: "eta", direction: "asc" }}
            labels={{
              searchPlaceholder: "Search shipments...",
              emptyTitle: "No shipments",
            }}
            filters={[
              {
                key: "mode",
                type: "multi-select",
                label: "Mode",
                options: modes.map((m) => ({ value: m, label: m })),
              },
            ]}
            views={[
              { id: "all", label: "All" },
              {
                id: "delayed",
                label: "Delayed",
                filter: (r) => r.status === "Delayed",
              },
              {
                id: "delivered",
                label: "Delivered",
                filter: (r) => r.status === "Delivered",
              },
            ]}
            bulkActions={[
              {
                id: "export",
                label: "Export",
                icon: <Download />,
                onSelect: () => {},
              },
            ]}
            onRowOpen={() => {}}
          />
        </div>
      </TabsContent>
      <TabsContent value="employees">
        <div className={frame}>
          <DataTable<Employee>
            columns={employeeColumns}
            rows={employees}
            getRowId={(r) => r.id}
            getRowName={(r) => r.name}
            selectable
            pageSize={6}
            labels={{
              searchPlaceholder: "Search people...",
              selectRow: (n) => `Select ${n}`,
              range: (f, t, total) => `Showing ${f} to ${t} of ${total} people`,
            }}
            filters={[
              {
                key: "team",
                type: "select",
                label: "Team",
                options: teams.map((t) => ({ value: t, label: t })),
              },
            ]}
            bulkActions={[
              {
                id: "archive",
                label: "Archive",
                icon: <Archive />,
                destructive: true,
                onSelect: () => {},
              },
            ]}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
