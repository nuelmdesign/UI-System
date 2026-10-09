// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { ArrowUpRight, TextQuote } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/* Retrieved chunks enter once, then their source chips settle in. */

export type ContextChunkTone = "destructive" | "success" | "brand" | "muted"

export type ContextChunk = {
  title: string
  chars: string
  body: string
  source: string
  /** Short file-type badge, e.g. "PDF". */
  badge: string
  tone: ContextChunkTone
  href?: string
}

export type ContextCardsLabels = {
  header: string
  count: string
}

export interface ContextCardsProps {
  chunks?: ContextChunk[]
  labels?: Partial<ContextCardsLabels>
  className?: string
}

const DEFAULT_LABELS: ContextCardsLabels = {
  header: "All chunks",
  count: "32",
}

const TONE_BG: Record<ContextChunkTone, string> = {
  destructive: "bg-destructive text-destructive-foreground",
  success: "bg-success text-primary-foreground",
  brand: "bg-brand text-brand-foreground",
  muted: "bg-muted-foreground text-background",
}

const CHUNKS: ContextChunk[] = [
  {
    title: "Vendor onboarding rule",
    chars: "290 characters",
    body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
    source: "Dairy Onboarding SOP.pdf",
    badge: "PDF",
    tone: "destructive",
  },
  {
    title: "Seasonal demand row",
    chars: "1,250 characters",
    body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
    source: "Sales Velocity Export.csv",
    badge: "CSV",
    tone: "success",
  },
]

export function ContextCards({
  chunks = CHUNKS,
  labels,
  className,
}: ContextCardsProps) {
  const [chipsShown, setChipsShown] = useState(false)
  const copy = { ...DEFAULT_LABELS, ...labels }

  useEffect(() => {
    const chips = setTimeout(() => setChipsShown(true), 700)
    return () => clearTimeout(chips)
  }, [])

  return (
    <div
      data-slot="context-cards"
      className={cn("flex w-full max-w-95 flex-col gap-2", className)}
    >
      <div className="flex animate-fade-in items-center gap-2 px-0.5">
        <span className="text-[13px] font-semibold text-foreground">
          {copy.header}
        </span>
        <span className="inline-flex h-5 items-center rounded-md border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground tabular-nums">
          {copy.count}
        </span>
      </div>

      {chunks.map((chunk, i) => {
        const Chip = chunk.href ? "a" : "span"
        return (
          <div
            key={chunk.title}
            data-slot="context-card"
            className="animate-fade-up overflow-hidden rounded-lg border bg-card"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex h-10 items-center gap-2.5 border-b px-3">
              <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-foreground">
                <TextQuote className="size-3 shrink-0" strokeWidth={2.5} />
                <span className="truncate">{chunk.title}</span>
              </span>
              <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground/70 tabular-nums">
                {chunk.chars}
              </span>
            </div>
            <p className="px-3 pt-2 pb-1 text-[12.5px] leading-relaxed text-muted-foreground">
              {chunk.body}
            </p>
            <div className="px-3 pb-3">
              <Chip
                data-slot="context-card-source"
                {...(chunk.href
                  ? { href: chunk.href, target: "_blank", rel: "noreferrer" }
                  : {})}
                className={cn(
                  "inline-flex h-6 items-center gap-1.5 rounded-md border bg-muted px-2 text-xs font-medium text-muted-foreground transition-[opacity,transform,background-color] duration-300 ease-out hover:bg-accent",
                  chipsShown ? "scale-100 opacity-100" : "scale-95 opacity-0"
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span
                  className={cn(
                    "flex h-3.5 min-w-3.5 items-center justify-center rounded-[2px] px-0.5 font-mono text-[7px] font-bold",
                    TONE_BG[chunk.tone]
                  )}
                >
                  {chunk.badge}
                </span>
                {chunk.source}
                <ArrowUpRight className="size-2.5" strokeWidth={2.5} />
              </Chip>
            </div>
          </div>
        )
      })}
    </div>
  )
}
