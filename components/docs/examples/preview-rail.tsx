"use client"

import * as React from "react"

import {
  PreviewRail,
  type PreviewRailItem,
} from "@/components/motion/preview-rail"

const SECTIONS: PreviewRailItem[] = [
  {
    id: "tokens",
    label: "Tokens",
    description: "Color, type, shape and motion in one file.",
  },
  {
    id: "components",
    label: "Components",
    description: "Radix behavior, token styling, Motion state.",
  },
  {
    id: "agents",
    label: "Agents",
    description: "Chat, tools, approvals and voice.",
  },
  {
    id: "registry",
    label: "Registry",
    description: "Install any piece with one command.",
  },
]

export default function PreviewRailDemo() {
  const [active, setActive] = React.useState("tokens")
  const current = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]

  return (
    <PreviewRail
      items={SECTIONS}
      activeId={active}
      onActiveChange={setActive}
      highlightActive
      className="min-h-64 w-full"
    >
      <div className="grid h-full content-center gap-2 pl-6">
        <p className="eyebrow text-muted-foreground">Hover the ticks</p>
        <p className="heading text-3xl">{current.label}</p>
      </div>
    </PreviewRail>
  )
}
