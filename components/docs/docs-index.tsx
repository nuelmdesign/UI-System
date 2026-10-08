"use client"

import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  ENTRIES,
  entriesIn,
  type DocEntry,
} from "@/components/docs/entries"
import { useDocsNav } from "@/components/docs/docs-nav"
import { PixelField } from "@/components/motion/pixel-field"

/** The components dashboard: every component as a card, grouped by category. */
export function DocsIndex() {
  const fresh = ENTRIES.filter((e) => e.isNew)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="relative overflow-hidden border bg-card">
        <PixelField variant="matrix" className="absolute inset-0 opacity-60" />
        <div className="relative grid gap-4 p-6 sm:p-10">
          <p className="flex items-center gap-2 eyebrow text-muted-foreground">
            <span className="size-2 bg-primary" /> Components
          </p>
          <h1 className="font-display text-4xl leading-[1.05] font-light tracking-[-0.02em] sm:text-5xl">
            Every piece, live.
          </h1>
          <p className="max-w-xl text-pretty text-muted-foreground">
            {ENTRIES.length} components you can open, try and install. Each page
            has a working preview, the code behind it, the install command and
            the full source.
          </p>
          <div className="flex flex-wrap gap-6 pt-2 font-mono text-xs text-muted-foreground">
            {CATEGORY_ORDER.map((c) => (
              <span key={c}>
                <span className="text-foreground">{entriesIn(c).length}</span>{" "}
                {CATEGORY_LABEL[c]}
              </span>
            ))}
          </div>
        </div>
      </header>

      <Section title="New" entries={fresh} />
      {CATEGORY_ORDER.map((c) => (
        <Section key={c} title={CATEGORY_LABEL[c]} entries={entriesIn(c)} />
      ))}
    </div>
  )
}

function Section({ title, entries }: { title: string; entries: DocEntry[] }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 flex items-center gap-2 eyebrow text-muted-foreground">
        {title}
        <span className="rounded-sm bg-muted px-1 py-0.5 text-[10px] tabular-nums">
          {entries.length}
        </span>
      </h2>
      <div className="grid border-t border-l sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry) => (
          <EntryCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </section>
  )
}

function EntryCard({ entry }: { entry: DocEntry }) {
  const nav = useDocsNav()
  return (
    <nav.Link
      href={nav.href(entry.slug)}
      className={cn(
        "group relative flex min-h-36 flex-col gap-3 border-r border-b bg-card p-5 transition-colors",
        "hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{entry.title}</span>
        {entry.isNew ? (
          <span className="rounded-sm border border-brand/30 bg-brand/10 px-1 font-mono text-[9px] tracking-wider text-brand uppercase">
            New
          </span>
        ) : null}
        <ArrowUpRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="line-clamp-3 text-sm text-muted-foreground">
        {entry.description}
      </p>
      <span className="mt-auto eyebrow text-muted-foreground/70">
        {CATEGORY_LABEL[entry.category]}
      </span>
    </nav.Link>
  )
}
