# Preview Rail

Tick rail with hover previews for jumping between sections.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/preview-rail
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { PreviewRail } from "@/components/motion/preview-rail"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/use-dismiss`, `@opendraft/use-hover-gesture`, `@opendraft/use-tap-gesture`

## Props and types

```ts
export interface PreviewRailItem {
  id: string
  label: string
  ariaLabel?: string
  description?: ReactNode
  href?: string
  target?: "_blank" | "_self" | "_parent" | "_top"
  rel?: string
}

export interface PreviewRailProps {
  items: PreviewRailItem[]
  label?: string
  orientation?: "vertical" | "horizontal"
  activeId?: string
  defaultActiveId?: string
  onActiveChange?: (id: string) => void
  onItemSelect?: (item: PreviewRailItem) => void
  renderPreview?: (item: PreviewRailItem) => ReactNode
  showPreview?: boolean
  previewSide?: "before" | "after"
  highlightActive?: boolean
  itemSize?: number
  children?: ReactNode
  className?: string
  railClassName?: string
  previewContainerClassName?: string
  previewClassName?: string
}
```

## Example

```tsx
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
        <p className="font-display text-3xl font-light">{current.label}</p>
      </div>
    </PreviewRail>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/preview-rail. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
