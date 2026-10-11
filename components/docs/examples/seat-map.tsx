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
