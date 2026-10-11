# Checklist

Tickable checklist with progress, optional notes and a sign-off step for inspections, onboarding or compliance.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/checklist
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Checklist } from "@/components/ui/checklist"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/checkbox`, `@opendraft/progress`, `@opendraft/textarea`

## Props and types

```ts
type ChecklistItem = {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  /** Initial state when the list is uncontrolled and `defaultValue` is not set. */
  done?: boolean
  /** Initial note. */
  note?: string
}

type ChecklistLabels = {
  /** Progress caption. */
  progress: string
  /** Progress value. `{done}` and `{total}` are replaced. */
  count: string
  addNote: string
  editNote: string
  notePlaceholder: string
  noteLabel: string
  signOff: string
  signedOff: string
  /** Shown beside the disabled sign-off button. */
  incomplete: string
  /** Screen-reader announcement when progress changes. */
  announce: string
  empty: string
}

type ChecklistProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue"
> & {
  items?: ChecklistItem[]
  /** Controlled list of completed item ids. */
  value?: string[]
  /** Uncontrolled initial completed ids. Falls back to each item's `done`. */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  title?: React.ReactNode
  description?: React.ReactNode
  /** Show a progress bar and count. */
  showProgress?: boolean
  /** Allow a note on each item. */
  notes?: boolean
  /** Controlled notes keyed by item id. */
  noteValues?: Record<string, string>
  onNoteChange?: (id: string, note: string) => void
  /** Show a sign-off footer. Enabled once every item is done. */
  onComplete?: (result: {
    done: string[]
    notes: Record<string, string>
  }) => void
  /** Extra content above the sign-off button, e.g. a name field. */
  signOff?: React.ReactNode
  /** Disables sign-off even when complete (e.g. a required field is empty). */
  signOffDisabled?: boolean
  disabled?: boolean
  /** Items stay visible and notes readable, but nothing can change. */
  readOnly?: boolean
  labels?: Partial<ChecklistLabels>
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/checklist. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
