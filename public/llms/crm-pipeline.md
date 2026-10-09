# CRM Pipeline

Sales pipeline with a stage board, sortable list view, search, drag or menu moves, and a deal detail panel with an activity timeline.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/crm-pipeline
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { CrmPipeline } from "@/components/blocks/crm-pipeline"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/badge`, `@opendraft/avatar`, `@opendraft/input`, `@opendraft/label`, `@opendraft/select`, `@opendraft/dialog`, `@opendraft/dropdown-menu`, `@opendraft/tabs`, `@opendraft/animated-number`

## Props and types

```ts
export interface CrmStage {
  id: string
  label: string
}

export interface CrmActivity {
  id: string
  /** What happened, e.g. "Sent revised proposal". */
  text: string
  /** Display label, e.g. "2 days ago". */
  when: string
  kind?: "note" | "email" | "call" | "stage"
}

export interface CrmDeal {
  id: string
  company: string
  contact: string
  email?: string
  phone?: string
  /** Deal value in whole currency units. */
  value: number
  stage: string
  owner: string
  /** ISO date (YYYY-MM-DD) for the expected close. */
  due: string
  /** Display label, e.g. "3 days ago". */
  lastTouched: string
  tags?: string[]
  activity?: CrmActivity[]
}

export interface CrmPipelineProps {
  stages?: CrmStage[]
  deals?: CrmDeal[]
  /** Called after a deal is moved to another stage. */
  onMove?: (dealId: string, toStage: string, deal: CrmDeal) => void
  /** Called with the deal created from the Add deal form. */
  onAdd?: (deal: CrmDeal) => void
  /** Called when a deal is opened in the detail panel. */
  onSelect?: (deal: CrmDeal) => void
  className?: string
}
```

## Example

```tsx
"use client"

import { CrmPipeline } from "@/components/blocks/crm-pipeline"

export default function CrmPipelineDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <CrmPipeline />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/crm-pipeline. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
