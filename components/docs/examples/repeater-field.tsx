"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RepeaterField } from "@/components/ui/repeater-field"

type Tier = { id: string; name: string; price: string; capacity: string }

let seq = 0
const createTier = (): Tier => ({
  id: `tier-${++seq}`,
  name: "",
  price: "",
  capacity: "",
})

export default function RepeaterFieldDemo() {
  const [tiers, setTiers] = React.useState<Tier[]>(() => [
    { id: "tier-a", name: "General admission", price: "25", capacity: "200" },
    { id: "tier-b", name: "VIP", price: "80", capacity: "40" },
  ])

  return (
    <div className="w-full max-w-xl">
      <RepeaterField
        label="Ticket tiers"
        itemLabel="Tier"
        addLabel="Add tier"
        emptyLabel="No tiers yet. Add one to start selling."
        value={tiers}
        onValueChange={setTiers}
        createItem={createTier}
        getKey={(t) => t.id}
        min={1}
        max={5}
        reorderable
        renderRow={({ item, update }) => (
          <div className="grid gap-3 sm:grid-cols-[1fr_5.5rem_5.5rem]">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${item.id}-name`}>Name</Label>
              <Input
                id={`${item.id}-name`}
                value={item.name}
                placeholder="Tier name"
                onChange={(e) => update({ name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${item.id}-price`}>Price</Label>
              <Input
                id={`${item.id}-price`}
                inputMode="decimal"
                className="font-mono tabular-nums"
                value={item.price}
                placeholder="0"
                onChange={(e) => update({ price: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${item.id}-cap`}>Capacity</Label>
              <Input
                id={`${item.id}-cap`}
                inputMode="numeric"
                className="font-mono tabular-nums"
                value={item.capacity}
                placeholder="0"
                onChange={(e) => update({ capacity: e.target.value })}
              />
            </div>
          </div>
        )}
      />
    </div>
  )
}
