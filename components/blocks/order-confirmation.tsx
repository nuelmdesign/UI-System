"use client"

import * as React from "react"
import {
  CalendarPlus,
  Download,
  MailCheck,
  Ticket as TicketIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Stat, StatGroup } from "@/components/ui/stat"
import { Stepper, type StepperStep } from "@/components/ui/stepper"
import {
  TicketPass,
  type TicketPassField,
  type TicketPassStatus,
} from "@/components/ui/ticket-pass"

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

const DEFAULT_LABELS: OrderConfirmationLabels = {
  steps: ["Details", "Payment", "Confirmation"],
  progress: "Checkout progress",
  title: "Order confirmed",
  orderNumber: "Order",
  emailSent: "A confirmation was sent to",
  date: "Date",
  tickets: "Tickets",
  total: "Total",
  ticketsHeading: "Your tickets",
  admitOne: "Admit one",
  summaryHeading: "Order summary",
  quantity: "Qty",
  download: "Download tickets",
  addToCalendar: "Add to calendar",
  viewTickets: "View my tickets",
  continue: "Continue browsing",
  emptyTitle: "No order to show",
  emptyDescription:
    "Once you complete a purchase, your confirmation appears here.",
}

export const SAMPLE_ORDER: Order = {
  number: "ORD-48213",
  email: "alex@example.com",
  date: "12 Nov 2026",
  currency: "USD",
  lines: [
    {
      id: "l1",
      title: "Intro to Ceramics",
      detail: "Workshop, Sat 14 Nov",
      quantity: 2,
      price: 45,
    },
    {
      id: "l2",
      title: "Materials kit",
      detail: "Add-on",
      quantity: 1,
      price: 18,
    },
  ],
  total: 108,
  tickets: [
    {
      id: "t1",
      title: "Intro to Ceramics",
      code: "TKT-48213-A1",
      fields: [
        { label: "Date", value: "Sat 14 Nov 2026" },
        { label: "Time", value: "10:00 - 13:00" },
        { label: "Host", value: "Maya Ortiz" },
      ],
    },
    {
      id: "t2",
      title: "Intro to Ceramics",
      code: "TKT-48213-A2",
      fields: [
        { label: "Date", value: "Sat 14 Nov 2026" },
        { label: "Time", value: "10:00 - 13:00" },
        { label: "Host", value: "Maya Ortiz" },
      ],
    },
  ],
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

function OrderConfirmation({
  order = SAMPLE_ORDER,
  labels: labelsProp,
  onDownload,
  onAddToCalendar,
  onViewTickets,
  onContinue,
  className,
}: OrderConfirmationProps) {
  const t = { ...DEFAULT_LABELS, ...labelsProp }
  const money = React.useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: order?.currency ?? "USD",
      }),
    [order?.currency]
  )
  const steps: StepperStep[] = t.steps.map((label, i) => ({
    id: `s${i}`,
    label,
  }))

  return (
    <div
      data-slot="order-confirmation"
      className={cn(
        "@container/order h-full min-h-0 w-full overflow-y-auto bg-background text-foreground",
        className
      )}
    >
      {!order ? (
        <div className="flex h-full items-center justify-center p-6">
          <EmptyState
            icon={<TicketIcon />}
            title={t.emptyTitle}
            description={t.emptyDescription}
            action={
              onContinue && <Button onClick={onContinue}>{t.continue}</Button>
            }
          />
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6 @xl/order:px-6 @xl/order:py-10">
          <Stepper
            steps={steps}
            current={steps.length}
            complete
            aria-label={t.progress}
          />

          <header className="flex flex-col gap-3">
            <span className="flex items-center gap-2 eyebrow text-success">
              <MailCheck aria-hidden className="size-4" />
              {t.orderNumber}{" "}
              <span className="font-mono tracking-normal">{order.number}</span>
            </span>
            <h1 className="heading text-4xl text-balance @xl/order:text-5xl">
              {t.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.emailSent}{" "}
              <span className="font-medium break-all text-foreground">
                {order.email}
              </span>
              .
            </p>
          </header>

          <StatGroup columns={3}>
            <Stat
              label={t.date}
              value={order.date}
              className="[&_.heading]:text-2xl"
            />
            <Stat label={t.tickets} value={order.tickets.length} />
            <Stat
              label={t.total}
              value={
                <span className="font-mono">{money.format(order.total)}</span>
              }
            />
          </StatGroup>

          <div className="flex flex-wrap gap-2">
            {onDownload && (
              <Button onClick={onDownload}>
                <Download /> {t.download}
              </Button>
            )}
            {onAddToCalendar && (
              <Button variant="outline" onClick={onAddToCalendar}>
                <CalendarPlus /> {t.addToCalendar}
              </Button>
            )}
            {onViewTickets && (
              <Button variant="outline" onClick={onViewTickets}>
                {t.viewTickets}
              </Button>
            )}
          </div>

          <section aria-labelledby="oc-tickets" className="flex flex-col gap-4">
            <h2 id="oc-tickets" className="heading text-2xl">
              {t.ticketsHeading}
            </h2>
            {order.tickets.map((tk) => (
              <TicketPass
                key={tk.id}
                title={tk.title}
                eyebrow={t.admitOne}
                fields={tk.fields}
                code={tk.code}
                status={tk.status}
              />
            ))}
          </section>

          <section aria-labelledby="oc-summary" className="flex flex-col gap-3">
            <h2 id="oc-summary" className="heading text-2xl">
              {t.summaryHeading}
            </h2>
            <ul className="divide-y rounded-lg border">
              {order.lines.map((l) => (
                <li
                  key={l.id}
                  className="flex items-start justify-between gap-4 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{l.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.detail && <>{l.detail} &middot; </>}
                      {t.quantity}{" "}
                      <span className="font-mono tabular-nums">
                        {l.quantity}
                      </span>
                    </p>
                  </div>
                  <span className="font-mono text-sm tabular-nums">
                    {money.format(l.price * l.quantity)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 bg-surface p-4">
                <span className="eyebrow text-muted-foreground">{t.total}</span>
                <span className="font-mono text-base font-medium tabular-nums">
                  {money.format(order.total)}
                </span>
              </li>
            </ul>
          </section>

          {onContinue && (
            <div>
              <Button variant="ghost" onClick={onContinue}>
                {t.continue}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { OrderConfirmation }
