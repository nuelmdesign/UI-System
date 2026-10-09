"use client"

import * as React from "react"
import { ArrowRight, LayoutGrid } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion/reveal"
import { useDocsNav } from "@/components/docs/docs-nav"
import { CATEGORY_LABEL, ENTRY_BY_SLUG } from "@/components/docs/entries"
import { COUNTS, Section, SectionIntro } from "@/components/site/landing/shared"

/* Small wireframe sketches. They suggest each component rather than render it,
   so the grid stays light and calm. */

const bar = "h-1.5 bg-border"

function Frame({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("w-40 border bg-card p-3 shadow-sm", className)}>
      {children}
    </div>
  )
}

const SKETCHES: Record<string, React.ReactNode> = {
  "prompt-bar": (
    <Frame className="flex w-48 items-center gap-2 p-2">
      <span className="size-4 border" />
      <span className={cn(bar, "flex-1")} />
      <span className="h-3 w-8 bg-muted" />
      <span className="size-5 bg-primary" />
    </Frame>
  ),
  "thinking-trace": (
    <Frame className="grid gap-2">
      <span className="flex items-center gap-1.5">
        <span className="size-2 bg-brand" />
        <span className={cn(bar, "w-20 bg-input")} />
      </span>
      {[16, 24, 20].map((w, i) => (
        <span key={i} className="ml-1 flex items-center gap-1.5 border-l pl-2">
          <span className="size-1.5 rounded-full bg-success" />
          <span className={bar} style={{ width: w * 4 }} />
        </span>
      ))}
    </Frame>
  ),
  "tool-chips": (
    <Frame className="grid gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="size-2 border" />
          <span className={cn(bar, "w-10")} />
          <span className="h-3 flex-1 border bg-muted" />
        </span>
      ))}
      <span className="mt-1 flex gap-1">
        <span className="h-3.5 w-12 border font-mono text-[7px] leading-3 text-success">
          {" "}
          +13
        </span>
        <span className="h-3.5 w-10 border" />
      </span>
    </Frame>
  ),
  "question-card": (
    <Frame className="grid gap-2">
      <span className={cn(bar, "w-24 bg-input")} />
      {[true, false, false].map((on, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-2.5 rounded-full border",
              on && "border-primary bg-primary"
            )}
          />
          <span className={cn(bar, "w-16")} />
        </span>
      ))}
      <span className="mt-1 ml-auto h-3.5 w-12 bg-primary" />
    </Frame>
  ),
  "records-table": (
    <Frame className="w-48 p-0">
      {[0, 1, 2, 3].map((r) => (
        <span
          key={r}
          className={cn(
            "grid grid-cols-[1fr_1fr_0.7fr] gap-2 border-b px-2 py-1.5 last:border-b-0",
            r === 0 && "bg-muted"
          )}
        >
          <span className={bar} />
          <span className="flex gap-1">
            <span className="h-1.5 w-5 bg-blue-200" />
            {r % 2 === 0 && <span className="h-1.5 w-4 bg-blue-100" />}
          </span>
          <span className={bar} />
        </span>
      ))}
    </Frame>
  ),
  "command-palette": (
    <Frame className="grid w-44 gap-2 p-0">
      <span className="flex items-center gap-1.5 border-b px-2 py-1.5">
        <span className="size-2 rounded-full border" />
        <span className={cn(bar, "w-16")} />
        <span className="ml-auto font-mono text-[7px] text-muted-foreground">
          ⌘K
        </span>
      </span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "mx-1.5 px-1.5 py-1 last:mb-1.5",
            i === 1 && "bg-accent"
          )}
        >
          <span className={cn(bar, "block w-20")} />
        </span>
      ))}
    </Frame>
  ),
  "date-range-picker": (
    <Frame className="grid grid-cols-7 gap-1 p-2.5">
      {Array.from({ length: 21 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-3.5 bg-muted",
            i >= 8 && i <= 12 && "bg-brand/20",
            (i === 8 || i === 12) && "bg-primary"
          )}
        />
      ))}
    </Frame>
  ),
  "insight-cards": (
    <Frame className="grid gap-2">
      <span className="flex items-center justify-between">
        <span className={cn(bar, "w-12 bg-input")} />
        <span className="font-mono text-[8px] text-success">+1.15%</span>
      </span>
      <svg viewBox="0 0 120 40" className="h-10 w-full" aria-hidden>
        <path
          d="M0 30 C 20 26, 30 34, 50 24 S 85 10, 120 14"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.5"
        />
        <path
          d="M0 20 C 25 24, 40 18, 60 26 S 95 30, 120 28"
          fill="none"
          stroke="var(--warning)"
          strokeWidth="1.5"
        />
      </svg>
    </Frame>
  ),
}

const FEATURED = Object.keys(SKETCHES)

export function Gallery() {
  const nav = useDocsNav()
  return (
    <Section id="components" className="scroll-mt-24">
      <SectionIntro
        icon={<LayoutGrid />}
        label="Components"
        title="Start from a working piece"
      >
        Each component has a live preview, the code behind it and a one-line
        install. These are a good place to start.
      </SectionIntro>
      <div className="mt-6 flex justify-center">
        <Button variant="link" asChild>
          <nav.Link href={nav.href("")}>
            Browse all {COUNTS.total} components <ArrowRight />
          </nav.Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-px border bg-border lg:grid-cols-4">
        {FEATURED.map((slug, i) => {
          const entry = ENTRY_BY_SLUG[slug]
          if (!entry) return null
          return (
            <Reveal key={slug} delay={(i % 4) * 0.04} className="bg-background">
              <nav.Link
                href={nav.href(slug)}
                className="group flex h-full flex-col transition-colors hover:bg-card"
              >
                <span className="grid h-40 place-items-center bg-dots p-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 sm:h-48">
                  {SKETCHES[slug]}
                </span>
                <span className="flex flex-col gap-1 border-t px-4 py-3">
                  <span className="text-sm font-medium">{entry.title}</span>
                  <span className="eyebrow text-muted-foreground">
                    {CATEGORY_LABEL[entry.category]}
                  </span>
                </span>
              </nav.Link>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
