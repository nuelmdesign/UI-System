"use client"

import * as React from "react"

import { FilterBar, type FilterValues } from "@/components/ui/filter-bar"

const hospital: { name: string; ward: string; priority: string }[] = [
  { name: "Patient 1", ward: "Cardiology", priority: "Urgent" },
  { name: "Patient 2", ward: "Oncology", priority: "Routine" },
  { name: "Patient 3", ward: "Cardiology", priority: "Routine" },
  { name: "Patient 4", ward: "Neurology", priority: "Urgent" },
]

export default function FilterBarDemo() {
  const [values, setValues] = React.useState<FilterValues>({})
  const q = String(values.q ?? "").toLowerCase()
  const wards = (values.ward as string[] | undefined) ?? []
  const shown = hospital.filter(
    (r) =>
      r.name.toLowerCase().includes(q) &&
      (wards.length === 0 || wards.includes(r.ward)) &&
      (!values.priority || r.priority === values.priority)
  )

  return (
    <div className="flex w-full max-w-[720px] flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-muted-foreground">
          Logistics (uncontrolled)
        </p>
        <FilterBar
          filters={[
            {
              key: "q",
              type: "text",
              label: "Search",
              placeholder: "Search shipments",
            },
            {
              key: "carrier",
              type: "select",
              label: "Carrier",
              options: [
                { value: "north", label: "Northline" },
                { value: "harbor", label: "Harbor Freight" },
              ],
            },
            {
              key: "mode",
              type: "multi-select",
              label: "Mode",
              options: [
                { value: "air", label: "Air", count: 4 },
                { value: "sea", label: "Sea", count: 9 },
                { value: "road", label: "Road", count: 21 },
              ],
            },
          ]}
          defaultValue={{ mode: ["air", "sea"] }}
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="eyebrow text-muted-foreground">Healthcare (controlled)</p>
        <FilterBar
          value={values}
          onValueChange={setValues}
          labels={{ clearAll: "Reset", all: "Any" }}
          filters={[
            {
              key: "q",
              type: "text",
              label: "Search",
              placeholder: "Search patients",
            },
            {
              key: "ward",
              type: "multi-select",
              label: "Ward",
              options: [
                { value: "Cardiology", label: "Cardiology" },
                { value: "Oncology", label: "Oncology" },
                { value: "Neurology", label: "Neurology" },
              ],
            },
            {
              key: "priority",
              type: "select",
              label: "Priority",
              options: [
                { value: "Urgent", label: "Urgent" },
                { value: "Routine", label: "Routine" },
              ],
            },
          ]}
        />
        <p className="font-mono text-xs text-muted-foreground">
          {shown.length} of {hospital.length} match
        </p>
      </div>
    </div>
  )
}
