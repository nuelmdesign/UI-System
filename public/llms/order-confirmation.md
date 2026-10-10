# Order Confirmation

Order confirmed screen with a completed stepper, order number, stat row, one ticket pass per ticket, an order summary and download, calendar, view-tickets and continue actions. Data shape: Ticket-shaped: always shows tickets and a QR pass, with a fixed three-step stepper.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/order-confirmation
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { OrderConfirmation } from "@/components/blocks/order-confirmation"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/empty-state`, `@opendraft/stat`, `@opendraft/stepper`, `@opendraft/ticket-pass`

## Props and types

```ts
export type OrderLine = {
  id: string
  title: string
  detail?: string
  quantity: number
  /** Unit price in major currency units. */
  price: number
}

export type OrderTicket = {
  id: string
  title: string
  fields: TicketPassField[]
  code: string
  status?: TicketPassStatus
}

export type Order = {
  number: string
  email: string
  /** Pre-formatted date string. */
  date: string
  currency: string
  lines: OrderLine[]
  /** Total in major currency units. */
  total: number
  tickets: OrderTicket[]
}

export type OrderConfirmationLabels = {
  steps: [string, string, string]
  progress: string
  title: string
  orderNumber: string
  emailSent: string
  date: string
  tickets: string
  total: string
  ticketsHeading: string
  admitOne: string
  summaryHeading: string
  quantity: string
  download: string
  addToCalendar: string
  viewTickets: string
  continue: string
  emptyTitle: string
  emptyDescription: string
}

export type OrderConfirmationProps = {
  /** Omit or pass null to show the empty state. Defaults to sample data. */
  order?: Order | null
  labels?: Partial<OrderConfirmationLabels>
  onDownload?: () => void
  onAddToCalendar?: () => void
  onViewTickets?: () => void
  onContinue?: () => void
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { OrderConfirmation } from "@/components/blocks/order-confirmation"

export default function OrderConfirmationDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <OrderConfirmation
        onDownload={() => {}}
        onAddToCalendar={() => {}}
        onViewTickets={() => {}}
        onContinue={() => {}}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/order-confirmation. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
