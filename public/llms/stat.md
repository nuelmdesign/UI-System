# Stat

KPI tile with a label, a large value, a change chip and an optional toggle-button mode, plus a grouped grid.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/stat
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Stat, StatGroup } from "@/components/ui/stat"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`

## Props and types

```ts
type StatDirection = "up" | "down" | "flat"

type StatDelta = {
  value: string
  direction: StatDirection
  /** Which direction is good news. Defaults to "up". */
  goodWhen?: "up" | "down"
}

type StatProps = Omit<React.ComponentProps<"div">, "onClick" | "children"> & {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  delta?: StatDelta
  icon?: React.ReactNode
  /** Makes the tile an accessible toggle button. */
  onClick?: () => void
  selected?: boolean
  /** Drop the border and background, e.g. inside a StatGroup. */
  bare?: boolean
}

function StatGroup(props: React.ComponentProps<"div"> & { columns?: 2 | 3 | 4 })
```

## Example

```tsx
"use client"

import * as React from "react"
import { CreditCard, TrendingUp, Users } from "lucide-react"

import { Stat, StatGroup } from "@/components/ui/stat"

const items = [
  {
    id: "revenue",
    label: "Revenue",
    value: "$48,210",
    hint: "vs. previous 30 days",
    delta: { value: "12.4%", direction: "up" as const },
    icon: <CreditCard />,
  },
  {
    id: "users",
    label: "Active users",
    value: "3,982",
    hint: "vs. previous 30 days",
    delta: { value: "0.0%", direction: "flat" as const },
    icon: <Users />,
  },
  {
    id: "churn",
    label: "Churn",
    value: "2.1%",
    hint: "Lower is better",
    delta: {
      value: "0.6%",
      direction: "down" as const,
      goodWhen: "down" as const,
    },
    icon: <TrendingUp />,
  },
]

export default function StatDemo() {
  const [selected, setSelected] = React.useState("revenue")

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-6">
      <div className="grid gap-3 min-[480px]:grid-cols-3">
        {items.map((s) => (
          <Stat
            key={s.id}
            label={s.label}
            value={s.value}
            delta={s.delta}
            icon={s.icon}
            selected={selected === s.id}
            onClick={() => setSelected(s.id)}
          />
        ))}
      </div>
      <StatGroup columns={3}>
        {items.map((s) => (
          <Stat
            key={s.id}
            label={s.label}
            value={s.value}
            hint={s.hint}
            delta={s.delta}
          />
        ))}
      </StatGroup>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/stat. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
