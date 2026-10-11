"use client"

import * as React from "react"

import { Checklist, type ChecklistItem } from "@/components/ui/checklist"
import { Input } from "@/components/ui/input"

const preflight: ChecklistItem[] = [
  {
    id: "fuel",
    label: "Fuel quantity",
    description: "Check against the flight plan.",
    done: true,
  },
  { id: "controls", label: "Flight controls free and correct" },
  {
    id: "lights",
    label: "Exterior lights",
    description: "Navigation, strobe and landing.",
  },
  { id: "docs", label: "Documents on board" },
]

const onboarding: ChecklistItem[] = [
  { id: "contract", label: "Signed contract received", done: true },
  {
    id: "laptop",
    label: "Laptop issued",
    note: "Serial recorded in the asset log.",
  },
  {
    id: "accounts",
    label: "Accounts created",
    description: "Email, chat and calendar.",
  },
  { id: "intro", label: "Intro meeting scheduled" },
]

export default function ChecklistDemo() {
  const [name, setName] = React.useState("")
  return (
    <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
      <Checklist
        title="Pre-flight inspection"
        description="Walk-around before engine start."
        items={preflight}
        notes
        labels={{
          progress: "Inspection",
          signOff: "Release aircraft",
          signedOff: "Released",
        }}
        signOff={
          <Input
            aria-label="Inspector name"
            placeholder="Inspector name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        }
        signOffDisabled={!name.trim()}
        onComplete={() => {}}
      />
      <Checklist
        title="New hire onboarding"
        description="Read-only view for the hiring manager."
        items={onboarding}
        notes
        readOnly
        labels={{ progress: "Onboarding" }}
      />
    </div>
  )
}
