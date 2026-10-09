# Pixel Loader

A 3×3 pixel-grid loader with a shimmering status label and a live elapsed timer, in four motion variants.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/pixel-loader
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { PixelLoader } from "@/components/agents/pixel-loader"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`, `@opendraft/shimmer-text`

## Props and types

```ts
export type PixelLoaderVariant = "drive" | "dots" | "orbit" | "surfer"

export interface PixelLoaderProps {
  /** Status text next to the grid. Defaults to "Churning" ("Subway surfing" for surfer). */
  label?: string
  variant?: PixelLoaderVariant
  /** Video shown in the surfer variant's card. Without it the card shows the loader. */
  videoSrc?: string
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  PixelLoader,
  type PixelLoaderVariant,
} from "@/components/agents/pixel-loader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const VARIANTS: PixelLoaderVariant[] = ["drive", "dots", "orbit", "surfer"]

export default function PixelLoaderDemo() {
  const [variant, setVariant] = React.useState<PixelLoaderVariant>("drive")

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Tabs
        value={variant}
        onValueChange={(v) => setVariant(v as PixelLoaderVariant)}
      >
        <TabsList>
          {VARIANTS.map((v) => (
            <TabsTrigger key={v} value={v} className="capitalize">
              {v}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex min-h-40 items-start">
        {/* surfer takes a videoSrc; without one it shows the loader card */}
        <PixelLoader key={variant} variant={variant} />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/pixel-loader. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
