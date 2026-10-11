# Description List

Label and value grid for record details, with column spans, mono values and copy buttons.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/description-list
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DescriptionList } from "@/components/ui/description-list"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`, `@opendraft/copy-button`

## Props and types

```ts
type DescriptionItem = {
  label: React.ReactNode
  value?: React.ReactNode
  /** Columns this entry spans (clamped to the available columns). */
  span?: number
  /** Show a copy button. Needs `copyValue` or a string/number `value`. */
  copyable?: boolean
  /** Text to copy when it differs from the displayed value. */
  copyValue?: string
  /** Render the value in mono, for IDs, codes and dates. */
  mono?: boolean
}

type DescriptionListLabels = {
  /** Shown when a value is empty. */
  empty: string
  copy: string
}

type DescriptionListProps = Omit<React.ComponentProps<"dl">, "children"> & {
  items?: DescriptionItem[]
  /** Maximum columns. The list steps down as its container narrows. */
  columns?: 1 | 2 | 3 | 4
  /** Wrap the list in a hairline-bordered card with dividers. */
  bordered?: boolean
  labels?: Partial<DescriptionListLabels>
}
```

## Example

```tsx
import {
  DescriptionList,
  type DescriptionItem,
} from "@/components/ui/description-list"

const shipment: DescriptionItem[] = [
  { label: "Tracking number", value: "SHP-204518", mono: true, copyable: true },
  { label: "Carrier", value: "Example Freight" },
  { label: "Status", value: "In transit" },
  { label: "Origin", value: "Rotterdam, NL" },
  { label: "Destination", value: "Chicago, US" },
  { label: "ETA", value: "2026-03-18", mono: true },
  { label: "Handling notes", value: "", span: 3 },
]

const employee: DescriptionItem[] = [
  { label: "Name", value: "Sam Example" },
  { label: "Employee ID", value: "E-10482", mono: true, copyable: true },
  { label: "Email", value: "sam@example.com", copyable: true },
  { label: "Department", value: "Operations" },
  { label: "Start date", value: "2025-09-01", mono: true },
  { label: "Manager", value: "Jo Example" },
]

export default function DescriptionListDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Shipment</h3>
        <DescriptionList
          items={shipment}
          bordered
          labels={{ empty: "None recorded" }}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Employee record</h3>
        <DescriptionList items={employee} columns={2} bordered />
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/description-list. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
