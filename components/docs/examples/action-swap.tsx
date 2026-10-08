import { Check, Copy, Pause, Play } from "lucide-react"

import { ActionSwapButton } from "@/components/motion/action-swap"

export default function ActionSwapDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ActionSwapButton
        animation="roll"
        cycle
        items={[
          { id: "play", label: "Play", icon: <Play className="size-4" /> },
          { id: "pause", label: "Pause", icon: <Pause className="size-4" /> },
        ]}
      />
      <ActionSwapButton
        variant="outline"
        animation="blur"
        cycle
        items={[
          { id: "copy", label: "Copy link", icon: <Copy className="size-4" /> },
          { id: "copied", label: "Copied", icon: <Check className="size-4" /> },
        ]}
      />
      <ActionSwapButton
        variant="ghost"
        animation="cascade"
        cycle
        items={[
          { id: "follow", label: "Follow" },
          { id: "following", label: "Following" },
        ]}
      />
    </div>
  )
}
