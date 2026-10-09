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
