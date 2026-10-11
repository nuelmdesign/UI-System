# Filter Bar

Search, select and multi-select filters from a config, with removable chips and clear-all.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/filter-bar
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { FilterBar } from "@/components/ui/filter-bar"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`, `@opendraft/button`, `@opendraft/checkbox`, `@opendraft/input`, `@opendraft/popover`, `@opendraft/select`

## Props and types

```ts
export type FilterOption = {
  value: string
  label: string
  /** Optional count shown next to the option. */
  count?: number
}

type FilterBase = {
  /** Key of this filter in the values object. */
  key: string
  label: string
}

export type TextFilter = FilterBase & {
  type: "text"
  placeholder?: string
}

export type SelectFilter = FilterBase & {
  type: "select"
  options: FilterOption[]
}

export type MultiSelectFilter = FilterBase & {
  type: "multi-select"
  options: FilterOption[]
}

export type FilterConfig = TextFilter | SelectFilter | MultiSelectFilter

/** text and select store a string ("" = unset); multi-select stores string[]. */
export type FilterValues = Record<string, string | string[] | undefined>

export type FilterBarLabels = {
  clearAll: string
  /** Select placeholder suffix, e.g. "All" + label is built as `${all} ${label}`. */
  all: string
  /** Multi-select summary, receives the label and number selected. */
  selected: (label: string, count: number) => string
  /** aria-label for the group. */
  group: string
  /** aria-label for the remove button on an option chip. */
  remove: (label: string) => string
}

export type FilterBarProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  filters: FilterConfig[]
  value?: FilterValues
  defaultValue?: FilterValues
  onValueChange?: (value: FilterValues) => void
  labels?: Partial<FilterBarLabels>
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/filter-bar. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
