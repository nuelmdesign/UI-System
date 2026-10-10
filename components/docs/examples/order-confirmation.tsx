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
