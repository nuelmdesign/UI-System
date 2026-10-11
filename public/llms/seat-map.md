# Seat Map

Grid seat picker for aircraft, venues and transport with five seat states, a max selection and arrow-key navigation.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/seat-map
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SeatMap } from "@/components/ui/seat-map"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type SeatState = "available" | "selected" | "occupied" | "blocked" | "premium"

type SeatInfo = {
  /** Defaults to "available". "selected" is derived from the selection. */
  state?: Exclude<SeatState, "selected">
  /** Price in the smallest display unit you pass to `formatValue`. */
  price?: number
  /** Free text tier name, e.g. "Exit row" or "Circle". Shown in the readout. */
  tier?: string
}

/**
 * Layout rows, one string per row. `s` is a seat, `.` an aisle (narrow gap),
 * `_` an empty cell the size of a seat (a missing seat, a pillar).
 */
type SeatLayoutObject = {
  rows: string[]
  /** One label per row; defaults to A, B, C... */
  rowLabels?: string[]
  /** One label per grid column (aisles included, ignored for them); defaults to 1, 2, 3... counted per row. */
  columnLabels?: string[]
}

type SeatLayout = string[] | SeatLayoutObject

type SeatMapLabels = {
  legend: string
  front: string
  available: string
  selected: string
  occupied: string
  blocked: string
  premium: string
  none: string
  total: string
  maxReached: (max: number) => string
  /** Row label shown to assistive tech. */
  row: (label: string) => string
  /** Accessible description of one seat. */
  seat: (p: {
    id: string
    stateLabel: string
    price?: string
    tier?: string
  }) => string
  map: string
}

type SeatMapChange = { id: string; row: number; col: number } & SeatInfo

type SeatMapProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue" | "children"
> & {
  layout?: SeatLayout
  /** Per-seat info by seat id (row label + column label, e.g. "12A"). */
  seats?: Record<string, SeatInfo>
  /** Computed alternative to `seats`; takes precedence when it returns a value. */
  getSeat?: (id: string, row: number, col: number) => SeatInfo | undefined
  /** Controlled selection (seat ids). */
  value?: string[]
  defaultValue?: string[]
  /** Maximum selectable seats. With 1, picking another seat replaces the first. */
  max?: number
  onChange?: (ids: string[], seats: SeatMapChange[]) => void
  /** Formats prices. Defaults to `Intl` with `currency` if given, else plain number. */
  formatValue?: (value: number) => string
  currency?: string
  locale?: string
  /** Hide the legend or the selection summary. */
  showLegend?: boolean
  showSummary?: boolean
  readOnly?: boolean
  labels?: Partial<SeatMapLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { SeatMap, type SeatInfo } from "@/components/ui/seat-map"

const cabinRows = Array.from({ length: 10 }, (_, i) => String(i + 1))
const cabin = {
  rows: cabinRows.map(() => "sss.sss"),
  rowLabels: cabinRows,
  columnLabels: ["A", "B", "C", ".", "D", "E", "F"],
}
const cabinSeats: Record<string, SeatInfo> = {}
for (const r of ["1", "2"])
  for (const c of ["A", "B", "C", "D", "E", "F"])
    cabinSeats[`${r}${c}`] = {
      state: "premium",
      price: 45,
      tier: "Extra legroom",
    }
for (const id of ["3B", "3C", "4A", "6E", "6F", "7D", "9A"])
  cabinSeats[id] = { state: "occupied" }
for (const id of ["5A", "5F"]) cabinSeats[id] = { state: "blocked" }
for (const r of ["3", "4", "5", "6", "7", "8", "9", "10"])
  for (const c of ["A", "B", "C", "D", "E", "F"])
    cabinSeats[`${r}${c}`] ??= { price: 18 }

const theatre = {
  rows: [
    "__ssssssss__",
    "_ssssssssss_",
    "ssss.ss.ssss",
    "ssss.ss.ssss",
    "ssss.ss.ssss",
    "ssss.ss.ssss",
  ],
  rowLabels: ["A", "B", "C", "D", "E", "F"],
}
const theatreSeats: Record<string, SeatInfo> = {}
for (const r of ["C", "D"])
  for (let n = 1; n <= 10; n++)
    theatreSeats[`${r}${n}`] = { state: "premium", price: 60, tier: "Stalls" }
for (const id of ["D4", "D5", "E2", "F9", "F10", "B6"])
  theatreSeats[id] = { state: "occupied" }
theatreSeats.A1 = { state: "blocked" }

export default function SeatMapDemo() {
  const [cabinPick, setCabinPick] = React.useState<string[]>(["2C"])
  return (
    <div className="grid w-full gap-12">
      <section className="grid gap-3">
        <h3 className="heading text-xl">Aircraft cabin</h3>
        <SeatMap
          layout={cabin}
          seats={cabinSeats}
          value={cabinPick}
          onChange={setCabinPick}
          max={3}
          currency="EUR"
          locale="en-GB"
          labels={{ front: "Cockpit", premium: "Extra legroom" }}
        />
      </section>
      <section className="grid gap-3">
        <h3 className="heading text-xl">Theatre</h3>
        <SeatMap
          layout={theatre}
          seats={theatreSeats}
          max={4}
          formatValue={(n) => `$${n.toFixed(2)}`}
          labels={{
            front: "Stage",
            premium: "Best view",
            row: (l) => `Row ${l}`,
          }}
        />
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/seat-map. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
