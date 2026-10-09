"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { QrCode, type QrCodeErrorCorrection } from "@/components/ui/qr-code"

const LEVELS: QrCodeErrorCorrection[] = ["L", "M", "Q", "H"]

export default function QrCodeDemo() {
  const [value, setValue] = React.useState("https://example.com/invite/4F7K")
  const [level, setLevel] = React.useState<QrCodeErrorCorrection>("M")

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-6 sm:flex-row sm:items-start">
      <QrCode
        value={value || " "}
        errorCorrection={level}
        size={176}
        className="border"
      />
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-muted-foreground">Value</span>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <div
          role="radiogroup"
          aria-label="Error correction"
          className="flex flex-col gap-1.5"
        >
          <span className="eyebrow text-muted-foreground">
            Error correction
          </span>
          <div className="flex gap-1">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={level === l}
                onClick={() => setLevel(l)}
                className="h-8 w-10 rounded-md border font-mono text-xs transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-checked:border-transparent aria-checked:bg-ink aria-checked:text-ink-foreground"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
