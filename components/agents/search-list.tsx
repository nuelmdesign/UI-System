// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { Search, X } from "lucide-react"
import { useState } from "react"

import { GlideMenu } from "@/components/motion/glide-menu"
import { cn } from "@/lib/utils"

/* Command search with live filtering. The field, clear action and results
 * are directly usable. */

export type SearchItem = string

export type SearchListLabels = {
  placeholder: string
  ariaLabel: string
  emptyTitle: string
  emptyHint: string
}

export interface SearchListProps {
  items?: SearchItem[]
  labels?: Partial<SearchListLabels>
  /** Fired when a result is picked. */
  onSelect?: (item: SearchItem) => void
  className?: string
}

const ITEMS: SearchItem[] = [
  "Forecast summer demand",
  "Find waffle cone suppliers",
  "Compare seasonal flavors",
  "Draft flavor launch plan",
  "Check cold-chain status",
  "Audit sugar costs",
  "Retire low sellers",
]

const LABELS: SearchListLabels = {
  placeholder: "Search flavors…",
  ariaLabel: "Search flavors",
  emptyTitle: "No results found",
  emptyHint: "Adjust your search to try again",
}

export function SearchList({
  items = ITEMS,
  labels,
  onSelect,
  className,
}: SearchListProps) {
  const l = { ...LABELS, ...labels }
  const [query, setQuery] = useState("")
  const results = query
    ? items.filter((i) => i.toLowerCase().includes(query.toLowerCase()))
    : items.slice(0, 5)
  const empty = query.length > 2 && results.length === 0

  return (
    <div
      data-slot="search-list"
      className={cn(
        "flex min-h-[248px] w-full max-w-72 flex-col items-stretch",
        className
      )}
    >
      <div className="w-full self-start overflow-hidden rounded-lg border bg-popover shadow-md">
        {/* input row */}
        <div
          data-slot="search-list-field"
          className="flex h-10 items-center gap-2 border-b px-3 transition-colors duration-100 hover:bg-accent"
        >
          <Search className="size-3.5 shrink-0 text-muted-foreground/70" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={l.placeholder}
            aria-label={l.ariaLabel}
            className="min-w-0 flex-1 bg-transparent text-[calc(13px*var(--text-scale))] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          {query && (
            <button
              aria-label="Clear search"
              type="button"
              onClick={() => setQuery("")}
              className="flex size-6 animate-fade-in items-center justify-center rounded-md text-muted-foreground/70 transition-colors duration-100 hover:bg-border hover:text-foreground"
            >
              <X className="size-3" strokeWidth={2.2} />
            </button>
          )}
        </div>

        {/* results / empty state */}
        {empty ? (
          <div
            data-slot="search-list-empty"
            className="flex animate-fade-in flex-col items-center justify-center gap-1 px-4 py-8"
          >
            <span className="mb-1.5 flex size-8 items-center justify-center rounded-md border bg-muted text-muted-foreground/70">
              <Search className="size-4" strokeWidth={1.8} />
            </span>
            <span className="text-[calc(13px*var(--text-scale))] font-medium text-foreground">
              {l.emptyTitle}
            </span>
            <span className="text-xs text-muted-foreground/70">
              {l.emptyHint}
            </span>
          </div>
        ) : (
          <div data-slot="search-list-results" className="p-1">
            <GlideMenu
              className="flex flex-col gap-px"
              highlightClassName="inset-x-0 rounded-md bg-accent"
            >
              {results.map((item) => (
                <button
                  key={item}
                  data-menu-row
                  type="button"
                  onClick={() => {
                    setQuery(item)
                    onSelect?.(item)
                  }}
                  className="relative z-10 flex h-8 w-full animate-fade-in items-center rounded-md px-2 text-left text-[calc(13px*var(--text-scale))] text-foreground outline-none"
                >
                  {item}
                </button>
              ))}
            </GlideMenu>
          </div>
        )}
      </div>
    </div>
  )
}
