"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  fontFromRow,
  fontVariable,
  googleFontsUrl,
  type FontPick,
} from "@/lib/theme"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Row = [string, string, string]

/** Shown first, before anyone types. */
const POPULAR = [
  "Inter",
  "Geist",
  "IBM Plex Sans",
  "DM Sans",
  "Manrope",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "Outfit",
  "Figtree",
  "Work Sans",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans 3",
  "Newsreader",
  "Fraunces",
  "Playfair Display",
  "Instrument Serif",
  "Lora",
  "Merriweather",
  "EB Garamond",
  "DM Serif Display",
  "Libre Baskerville",
  "JetBrains Mono",
  "IBM Plex Mono",
  "Space Mono",
]

const LIMIT = 60

/** The family by its next/font variable when the page has it, else by name. */
const face = (family: string) =>
  `var(${fontVariable(family)}, "${family}"), ui-sans-serif`

let catalog: Promise<FontPick[]> | null = null
/** The full Google Fonts list, fetched once and only when a picker opens. */
function loadCatalog() {
  catalog ??= import("@/lib/google-fonts.json").then((m) =>
    (m.default as Row[]).map(fontFromRow)
  )
  return catalog
}

const injected = new Set<string>()
const BUNDLED = new Set(["Newsreader", "Geist", "Geist Mono"])
/** Adds a Google Fonts stylesheet once. Fonts stay loaded after that. */
export function useGoogleFont(font: FontPick, weights: number[]) {
  const href = googleFontsUrl(font, weights)
  // The site already ships its own default faces.
  const bundled = BUNDLED.has(font.family)
  React.useEffect(() => {
    if (bundled || injected.has(href)) return
    injected.add(href)
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    document.head.appendChild(link)
  }, [href, bundled])
}

/** Loads just the letters needed to draw each visible family's own name. */
function usePreviewFonts(fonts: FontPick[]) {
  const families = fonts.filter((f) => f.latin !== false).map((f) => f.family)
  const key = families.join("|")
  React.useEffect(() => {
    if (!key) return
    const timer = setTimeout(() => {
      const names = key.split("|").filter((f) => !injected.has(`name:${f}`))
      if (!names.length) return
      names.forEach((f) => injected.add(`name:${f}`))
      const text = [...new Set(names.join(""))].join("")
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = `https://fonts.googleapis.com/css2?${names
        .map((f) => `family=${f.replace(/ /g, "+")}`)
        .join("&")}&text=${encodeURIComponent(text)}&display=swap`
      document.head.appendChild(link)
    }, 120)
    return () => clearTimeout(timer)
  }, [key])
}

/** Searchable picker over every Google Font, each previewed in its own face. */
export function FontPicker({
  id,
  value,
  onChange,
}: {
  id?: string
  value: FontPick
  onChange: (font: FontPick) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [fonts, setFonts] = React.useState<FontPick[] | null>(null)
  const [active, setActive] = React.useState(0)
  const listRef = React.useRef<HTMLDivElement>(null)
  const listId = React.useId()

  React.useEffect(() => {
    if (!open || fonts) return
    let alive = true
    loadCatalog().then((list) => alive && setFonts(list))
    return () => {
      alive = false
    }
  }, [open, fonts])

  const results = React.useMemo(() => {
    if (!fonts) return []
    const q = query.trim().toLowerCase()
    if (!q) {
      const byName = new Map(fonts.map((f) => [f.family, f]))
      return POPULAR.map((f) => byName.get(f)).filter(Boolean) as FontPick[]
    }
    const starts: FontPick[] = []
    const contains: FontPick[] = []
    for (const f of fonts) {
      const name = f.family.toLowerCase()
      if (name.startsWith(q)) starts.push(f)
      else if (name.includes(q)) contains.push(f)
    }
    return [...starts, ...contains]
  }, [fonts, query])

  const shown = results.slice(0, LIMIT)
  usePreviewFonts(open ? shown : [])

  const choose = (font: FontPick) => {
    onChange(font)
    setOpen(false)
    setQuery("")
  }

  React.useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [active])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="truncate" style={{ fontFamily: face(value.family) }}>
            {value.family}
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-0">
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-3.5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault()
                setActive((i) => Math.min(i + 1, shown.length - 1))
              } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setActive((i) => Math.max(i - 1, 0))
              } else if (e.key === "Enter" && shown[active]) {
                e.preventDefault()
                choose(shown[active])
              }
            }}
            placeholder={
              fonts
                ? `Search ${fonts.length.toLocaleString()} fonts`
                : "Loading fonts…"
            }
            aria-label="Search Google Fonts"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Google Fonts"
          className="max-h-72 overflow-y-auto p-1"
        >
          {!query && fonts ? (
            <p className="px-2 pt-1.5 pb-1 eyebrow text-muted-foreground">
              Popular
            </p>
          ) : null}
          {shown.map((font, i) => (
            <button
              key={font.family}
              type="button"
              role="option"
              data-index={i}
              aria-selected={font.family === value.family}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(font)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[15px]",
                i === active && "bg-accent"
              )}
            >
              <span
                className="min-w-0 flex-1 truncate"
                style={
                  font.latin === false
                    ? undefined
                    : { fontFamily: face(font.family) }
                }
              >
                {font.family}
              </span>
              {font.latin === false ? (
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  no Latin
                </span>
              ) : null}
              {font.family === value.family ? (
                <Check className="size-3.5 shrink-0 text-brand" />
              ) : null}
            </button>
          ))}
          {fonts && !shown.length ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No Google Font called “{query}”.
            </p>
          ) : null}
          {results.length > LIMIT ? (
            <p className="px-2 pt-1 pb-1.5 text-xs text-muted-foreground">
              {(results.length - LIMIT).toLocaleString()} more. Keep typing to
              narrow it down.
            </p>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
