"use client"

import { toast } from "sonner"

import { SelectionActions } from "@/components/agents/selection-actions"

export default function SelectionActionsDemo() {
  return (
    <div className="flex w-full justify-center">
      <SelectionActions onAction={(action) => toast(`${action}…`)} />
    </div>
  )
}
