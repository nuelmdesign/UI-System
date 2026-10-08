"use client"

import * as React from "react"
import { ArrowRight, Plus, Sparkles, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Default</Button>
        <Button variant="ink">Ink</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">
          <Trash2 /> Delete
        </Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="lg">
          <Sparkles /> Large
        </Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <Plus />
        </Button>
        <Button caps>
          Start for free <ArrowRight />
        </Button>
        <Button
          variant="outline"
          loading={loading}
          onClick={() => {
            setLoading(true)
            setTimeout(() => setLoading(false), 1500)
          }}
        >
          Click to load
        </Button>
      </div>
    </div>
  )
}
