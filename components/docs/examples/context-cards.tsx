"use client"

import { ContextCards } from "@/components/agents/context-cards"

export default function ContextCardsDemo() {
  return (
    <div className="flex w-full justify-center">
      <ContextCards labels={{ header: "Retrieved context", count: "2" }} />
    </div>
  )
}
