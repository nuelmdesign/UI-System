import { Command } from "lucide-react"

import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function KbdDemo() {
  return (
    <div className="grid gap-3 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        Open the command palette
        <KbdGroup>
          <Kbd>
            <Command />
          </Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </p>
      <p className="flex items-center gap-2">
        Send without leaving the input
        <KbdGroup>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
        </KbdGroup>
      </p>
    </div>
  )
}
