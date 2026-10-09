// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import * as React from "react"
import { createPortal, flushSync } from "react-dom"
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUpRight,
  Braces,
  Calendar,
  Check,
  ChevronRight,
  CircleCheck,
  Database,
  Ellipsis,
  EyeOff,
  File,
  Files,
  Globe,
  Info,
  Link,
  ListChecks,
  Pin,
  Plus,
  RotateCcw,
  RotateCw,
  Settings2,
  Sparkle,
  Text,
  User,
  X,
  type LucideIcon,
} from "lucide-react"

import { GlideMenu } from "@/components/motion/glide-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * RECORDS TABLE — an AI spreadsheet grid. Columns are
 * *properties*: click a header to open its configuration
 * popover (type, tool, grounding, inputs, prompt, run), add
 * a new AI property from the + header, and watch cells
 * resolve row-by-row while it calculates.
 * ───────────────────────────────────────────────────────── */

export type RecordStrength = "strong" | "weak" | "veryweak" | "none"
type SortKey = "name" | "last" | "strength"
type ColumnKey = "company" | "categories" | "last" | "strength" | "links" | "ai"

export type RecordRow = {
  id: string
  name: string
  tags: string[]
  last: string
  strength: RecordStrength
  website?: string
}

export type RecordsTableProps = {
  rows?: RecordRow[]
  /** Stretch to the parent's height instead of capping the scroller. */
  fill?: boolean
  className?: string
}

const DEFAULT_COLUMN_WIDTHS: Record<ColumnKey, number> = {
  company: 270,
  categories: 275,
  last: 190,
  strength: 210,
  links: 175,
  ai: 240,
}

const COMPACT_COLUMN_WIDTHS: Record<ColumnKey, number> = {
  company: 220,
  categories: 220,
  last: 155,
  strength: 180,
  links: 160,
  ai: 200,
}

const STRENGTH: Record<
  RecordStrength,
  { label: string; dot: string; rank: number }
> = {
  strong: { label: "Very strong", dot: "bg-success", rank: 3 },
  weak: { label: "Weak", dot: "bg-warning", rank: 2 },
  veryweak: { label: "Very weak", dot: "bg-destructive", rank: 1 },
  none: { label: "No communication", dot: "bg-muted-foreground/70", rank: 0 },
}

/* One base tone per tag; background, text and border are mixed from it
 * against the card and foreground tokens, so chips follow the theme. */
const TAG_PALETTE = {
  amber: "var(--warning)",
  lime: "var(--blue-800)",
  yellow: "var(--blue-300)",
  purple: "var(--blue-700)",
  orange: "var(--blue-400)",
  cyan: "var(--blue-500)",
  red: "var(--destructive)",
  magenta: "var(--blue-900)",
  green: "var(--success)",
  pink: "var(--blue-600)",
} as const

const TAG_COLORS: Record<string, string> = {
  B2B: TAG_PALETTE.amber,
  B2C: TAG_PALETTE.lime,
  Cafe: TAG_PALETTE.red,
  Catering: TAG_PALETTE.magenta,
  "Dairy-free": TAG_PALETTE.cyan,
  Gelato: TAG_PALETTE.purple,
  Imports: TAG_PALETTE.orange,
  Local: TAG_PALETTE.green,
  Seasonal: TAG_PALETTE.yellow,
  Sorbet: TAG_PALETTE.pink,
  Vegan: TAG_PALETTE.lime,
  Wholesale: TAG_PALETTE.amber,
}

// prettier-ignore
const INITIAL_ROWS: RecordRow[] = [
  { id: "aurora", name: "Aurora Scoops — Reykjavík", tags: ["Gelato", "Seasonal"], last: "9 days ago", strength: "strong", website: "aurora-scoops.example.com" },
  { id: "kumo", name: "Kumo Creamery — Tokyo", tags: ["B2C", "Cafe", "Vegan"], last: "3 weeks ago", strength: "strong", website: "kumo-creamery.example.com" },
  { id: "sol-nieve", name: "Sol y Nieve — Buenos Aires", tags: ["Gelato", "Local"], last: "2 months ago", strength: "weak", website: "sol-y-nieve.example.com" },
  { id: "maple-orbit", name: "Maple Orbit — Montréal", tags: ["B2B", "Wholesale", "Seasonal"], last: "15 days ago", strength: "weak", website: "maple-orbit.example.com" },
  { id: "blue-fig", name: "Blue Fig Gelato — Florence", tags: ["Gelato", "Cafe"], last: "over 1 year ago", strength: "veryweak", website: "blue-fig.example.com" },
  { id: "sahara-swirl", name: "Sahara Swirl — Marrakech", tags: ["Sorbet", "Local"], last: "5 months ago", strength: "veryweak" },
  { id: "cloudberry", name: "Cloudberry Cone — Helsinki", tags: ["Dairy-free", "Seasonal"], last: "No contact", strength: "none", website: "cloudberry-cone.example.com" },
  { id: "palm-sugar", name: "Palm Sugar Creamery — Bangkok", tags: ["B2C", "Vegan"], last: "3 months ago", strength: "veryweak", website: "palm-sugar.example.com" },
  { id: "cape-vanilla", name: "Cape Vanilla Co. — Cape Town", tags: ["Wholesale", "Imports"], last: "over 1 year ago", strength: "veryweak", website: "cape-vanilla.example.com" },
  { id: "andes-snow", name: "Andes Snow Creamery — Quito", tags: ["Gelato", "Catering"], last: "almost 2 years ago", strength: "veryweak" },
  { id: "tasman-sea", name: "Tasman Sea Gelato — Hobart", tags: ["Gelato", "Local"], last: "2 months ago", strength: "weak", website: "tasman-sea.example.com" },
  { id: "silk-road", name: "Silk Road Sorbet — Tbilisi", tags: ["Sorbet", "Imports"], last: "about 1 month ago", strength: "weak", website: "silk-road.example.com" },
  { id: "rosewater", name: "Rosewater Kulfi — Jaipur", tags: ["B2C", "Seasonal"], last: "2 months ago", strength: "veryweak" },
  { id: "lumen", name: "Lumen Soft Serve — Copenhagen", tags: ["Dairy-free", "Cafe"], last: "8 months ago", strength: "weak", website: "lumen-soft-serve.example.com" },
  { id: "cacao-norte", name: "Cacao Norte — Oaxaca", tags: ["B2B", "Local", "Wholesale"], last: "about 2 years ago", strength: "none", website: "cacao-norte.example.com" },
  { id: "pine-pistachio", name: "Pine & Pistachio — Istanbul", tags: ["Gelato", "Catering"], last: "about 1 month ago", strength: "veryweak" },
  { id: "ember-cone", name: "Ember Cone Company — Seoul", tags: ["B2C", "Vegan"], last: "15 days ago", strength: "weak", website: "ember-cone.example.com" },
  { id: "coral-coast", name: "Coral Coast Sorbet — Honolulu", tags: ["Sorbet", "Local"], last: "9 days ago", strength: "strong", website: "coral-coast.example.com" },
  { id: "sunbird", name: "Sunbird Gelateria — Lisbon", tags: ["Gelato", "Cafe"], last: "over 2 years ago", strength: "none", website: "sunbird.example.com" },
  { id: "mooncake", name: "Mooncake Ice Cream — Singapore", tags: ["B2B", "Wholesale"], last: "about 1 month ago", strength: "veryweak", website: "mooncake-ice-cream.example.com" },
  { id: "juniper", name: "Juniper & Cream — Vancouver", tags: ["Dairy-free", "Catering"], last: "No contact", strength: "none" },
  { id: "mango-moon", name: "Mango Moon Gelato — Nairobi", tags: ["Sorbet", "Vegan"], last: "almost 2 years ago", strength: "veryweak", website: "mango-moon.example.com" },
  { id: "fjord-fizz", name: "Fjord Fizz Ice — Oslo", tags: ["Dairy-free", "Seasonal"], last: "No contact", strength: "none" },
  { id: "pampa", name: "Pampa Creamery — Córdoba", tags: ["B2C", "Local"], last: "12 months ago", strength: "veryweak", website: "pampa-creamery.example.com" },
  { id: "lotus-leaf", name: "Lotus Leaf Scoops — Hanoi", tags: ["Vegan", "Cafe"], last: "15 days ago", strength: "weak" },
  { id: "saffron-sky", name: "Saffron Sky Kulfi — Dubai", tags: ["Imports", "Catering"], last: "almost 2 years ago", strength: "veryweak", website: "saffron-sky.example.com" },
  { id: "alpine-churn", name: "Alpine Churn — Zürich", tags: ["B2B", "Gelato", "Wholesale"], last: "4 days ago", strength: "strong", website: "alpine-churn.example.com" },
  { id: "monsoon-mango", name: "Monsoon Mango — Mumbai", tags: ["Sorbet", "Vegan", "Catering"], last: "18 days ago", strength: "weak", website: "monsoon-mango.example.com" },
  { id: "cedar-spoon", name: "Cedar Spoon — Beirut", tags: ["Cafe", "Local", "Seasonal"], last: "6 days ago", strength: "strong", website: "cedar-spoon.example.com" },
  { id: "baltic-berry", name: "Baltic Berry — Tallinn", tags: ["Dairy-free", "Seasonal", "B2C"], last: "5 weeks ago", strength: "weak", website: "baltic-berry.example.com" },
  { id: "delta-dairy", name: "Delta Dairy Works — New Orleans", tags: ["B2B", "Wholesale", "Local"], last: "2 days ago", strength: "strong", website: "delta-dairy.example.com" },
  { id: "yuzu-yard", name: "Yuzu Yard — Kyoto", tags: ["Sorbet", "Cafe", "Seasonal"], last: "11 days ago", strength: "strong", website: "yuzu-yard.example.com" },
  { id: "copper-cone", name: "Copper Cone — Melbourne", tags: ["Gelato", "Cafe", "B2C"], last: "about 1 month ago", strength: "weak", website: "copper-cone.example.com" },
  { id: "mint-medina", name: "Mint Medina — Tunis", tags: ["Dairy-free", "Vegan", "Local"], last: "No contact", strength: "none" },
  { id: "glacier-grove", name: "Glacier Grove — Anchorage", tags: ["Seasonal", "Local", "Catering"], last: "7 weeks ago", strength: "weak", website: "glacier-grove.example.com" },
  { id: "orchard-cloud", name: "Orchard Cloud — Lyon", tags: ["Gelato", "Seasonal", "Cafe"], last: "5 days ago", strength: "strong", website: "orchard-cloud.example.com" },
  { id: "tamarind-tide", name: "Tamarind Tide — Chennai", tags: ["Vegan", "Sorbet", "B2C"], last: "9 months ago", strength: "veryweak", website: "tamarind-tide.example.com" },
  { id: "amber-scoop", name: "Amber Scoop — Prague", tags: ["Gelato", "B2B"], last: "over 1 year ago", strength: "none" },
  { id: "boreal-batch", name: "Boreal Batch — Yellowknife", tags: ["Dairy-free", "Local", "Seasonal"], last: "8 days ago", strength: "strong", website: "boreal-batch.example.com" },
  { id: "coconut-commons", name: "Coconut Commons — Manila", tags: ["Vegan", "B2C", "Cafe"], last: "24 days ago", strength: "weak", website: "coconut-commons.example.com" },
  { id: "dolomite-dairy", name: "Dolomite Dairy — Bolzano", tags: ["Gelato", "Wholesale"], last: "3 days ago", strength: "strong", website: "dolomite-dairy.example.com" },
  { id: "equator-cream", name: "Equator Cream — Kampala", tags: ["B2B", "Catering", "Local"], last: "10 months ago", strength: "veryweak", website: "equator-cream.example.com" },
  { id: "hibiscus-house", name: "Hibiscus House — Accra", tags: ["Sorbet", "Cafe"], last: "6 weeks ago", strength: "weak", website: "hibiscus-house.example.com" },
  { id: "lagoon-ladle", name: "Lagoon Ladle — Venice", tags: ["Gelato", "Seasonal", "Catering"], last: "7 days ago", strength: "strong", website: "lagoon-ladle.example.com" },
  { id: "midnight-milk", name: "Midnight Milk — Tromsø", tags: ["Dairy-free", "Vegan", "Wholesale"], last: "No contact", strength: "none" },
  { id: "nomad-nougat", name: "Nomad Nougat — Ulaanbaatar", tags: ["Imports", "B2B"], last: "almost 2 years ago", strength: "none", website: "nomad-nougat.example.com" },
  { id: "olive-snow", name: "Olive Snow — Athens", tags: ["Gelato", "Cafe", "Local"], last: "4 days ago", strength: "strong", website: "olive-snow.example.com" },
  { id: "pacific-pear", name: "Pacific Pear — Valparaíso", tags: ["Sorbet", "Seasonal"], last: "2 months ago", strength: "weak", website: "pacific-pear.example.com" },
  { id: "quartz-cone", name: "Quartz Cone — Denver", tags: ["B2C", "Wholesale"], last: "10 days ago", strength: "strong", website: "quartz-cone.example.com" },
  { id: "red-lantern", name: "Red Lantern Creamery — Taipei", tags: ["Cafe", "Vegan"], last: "about 1 month ago", strength: "weak", website: "red-lantern.example.com" },
  { id: "salt-silk", name: "Salt & Silk — Muscat", tags: ["Imports", "Catering", "Gelato"], last: "8 months ago", strength: "veryweak", website: "salt-and-silk.example.com" },
  { id: "tropic-churn", name: "Tropic Churn — San Juan", tags: ["Sorbet", "Local", "B2C"], last: "6 days ago", strength: "strong", website: "tropic-churn.example.com" },
  { id: "umber-cream", name: "Umber Cream — Warsaw", tags: ["B2B", "Wholesale", "Cafe"], last: "5 weeks ago", strength: "weak", website: "umber-cream.example.com" },
  { id: "vanilla-vale", name: "Vanilla Vale — Antananarivo", tags: ["Imports", "Local"], last: "No contact", strength: "none" },
  { id: "willow-whip", name: "Willow Whip — Portland", tags: ["Dairy-free", "Vegan", "Cafe"], last: "3 days ago", strength: "strong", website: "willow-whip.example.com" },
  { id: "zenith-gelato", name: "Zenith Gelato — Auckland", tags: ["Gelato", "Seasonal"], last: "3 weeks ago", strength: "weak", website: "zenith-gelato.example.com" },
  { id: "apricot-atlas", name: "Apricot Atlas — Algiers", tags: ["Sorbet", "Imports"], last: "11 months ago", strength: "veryweak", website: "apricot-atlas.example.com" },
  { id: "black-sesame", name: "Black Sesame Social — Bandung", tags: ["Vegan", "Cafe", "B2C"], last: "9 days ago", strength: "strong", website: "black-sesame.example.com" },
  { id: "crimson-clover", name: "Crimson Clover — Brussels", tags: ["Gelato", "Wholesale", "Catering"], last: "2 months ago", strength: "weak", website: "crimson-clover.example.com" },
  { id: "dragonfruit-dock", name: "Dragonfruit Dock — Shenzhen", tags: ["Sorbet", "B2B", "Wholesale"], last: "No contact", strength: "none" },
]

/* the AI column resolves to fictional competitor pairs */
const AI_LABEL = "Competitors"
const COMPETITOR_POOL = [
  "Frost & Ladle",
  "Polar Pint Co.",
  "Meltwater Creamery",
  "Cirrus Scoops",
  "Golden Churn",
  "Velvet Freeze",
  "North Cone Collective",
  "Sundae Syndicate",
]
const competitorsFor = (index: number) =>
  `${COMPETITOR_POOL[index % 8]}, ${COMPETITOR_POOL[(index + 3) % 8]}`

/* glyphs for property types & tools */
const TYPE_ICONS: Record<string, LucideIcon> = {
  Text,
  File,
  Collection: Database,
  "Single select": CircleCheck,
  "Multi select": ListChecks,
  URL: Link,
  Reference: ArrowUpRight,
  JSON: Braces,
  "File splitter": Files,
  Date: Calendar,
}

type ToolKind = "model" | "web" | "user"
const TOOL_ICONS: Record<ToolKind, LucideIcon> = {
  model: Sparkle,
  web: Globe,
  user: User,
}

/* per-property configuration shown in the popover */
type Prompt = { before: string; chip?: string; after?: string }
type ColumnMeta = {
  type: string
  tool: string
  toolKind: ToolKind
  inputs?: string
  prompt?: Prompt
}

const COLUMN_META: Record<string, ColumnMeta> = {
  Company: { type: "Text", tool: "User input", toolKind: "user" },
  Categories: {
    type: "Multi select",
    tool: "Sprinkles 5",
    toolKind: "model",
    inputs: "Company",
    prompt: {
      before: "Tag each ",
      chip: "Company",
      after: " with its market categories.",
    },
  },
  "Last interaction": { type: "Date", tool: "User input", toolKind: "user" },
  "Connection strength": {
    type: "Single select",
    tool: "Sprinkles 5",
    toolKind: "model",
    inputs: "Last interaction",
    prompt: {
      before: "Score the relationship from ",
      chip: "Last interaction",
      after: ".",
    },
  },
  Links: {
    type: "URL",
    tool: "Web search",
    toolKind: "web",
    inputs: "Company",
    prompt: { before: "Find the website for ", chip: "Company", after: "." },
  },
  [AI_LABEL]: {
    type: "Text",
    tool: "Web search",
    toolKind: "web",
    inputs: "Company",
    prompt: { before: "Find competitors for ", chip: "Company" },
  },
}

const NEW_PROPERTY_TYPES = [
  "Text",
  "File",
  "Collection",
  "Single select",
  "Multi select",
  "URL",
  "Reference",
  "JSON",
  "File splitter",
]
const MODEL_OPTIONS = ["Sprinkles 5", "Sprinkles 4.2", "Sprinkles Mini"]
const INPUT_OPTIONS = [
  "Company",
  "Categories",
  "Last interaction",
  "Connection strength",
  "Links",
]

/* ── shared class strings ───────────────────────────────── */

const POPOVER =
  "fixed z-50 animate-pop-in rounded-lg border bg-popover text-popover-foreground shadow-md"
const SUBMENU =
  "absolute top-0 left-full z-30 ml-5 origin-top-left animate-pop-in rounded-lg border bg-popover p-1.5 shadow-md"
const MENU_LABEL =
  "px-2 pt-1 pb-1 text-[calc(12px*var(--text-scale))] font-medium text-muted-foreground"
const MENU_ROW =
  "relative z-10 flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[calc(13px*var(--text-scale))] text-foreground outline-none [&_svg]:size-[15px] [&>svg]:text-muted-foreground"
const PICKER_ROW =
  "relative z-10 flex h-8 w-full items-center gap-1.5 rounded-md px-1.5 text-left text-[calc(13px*var(--text-scale))] font-medium text-foreground outline-none"
const CONFIG_TRIGGER =
  "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[calc(13px*var(--text-scale))] font-medium text-foreground transition-colors duration-100 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
const ICON_BUTTON =
  "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-100 outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"

/* Cells paint an opaque background so the sticky first column hides what
 * scrolls beneath it; tints are mixed into the card colour instead of
 * layered with alpha. */
const CELL_BASE = "border-r border-b border-border last:border-r-0"
const BG_IDLE =
  "bg-card group-hover/row:bg-[color-mix(in_oklab,var(--accent)_50%,var(--card))]"
const BG_TINT =
  "bg-[color-mix(in_oklab,var(--brand)_5%,var(--card))] group-hover/row:bg-[color-mix(in_oklab,var(--brand)_8%,var(--card))]"
const BG_TINT_STRONG =
  "bg-[color-mix(in_oklab,var(--brand)_10%,var(--card))] group-hover/row:bg-[color-mix(in_oklab,var(--brand)_12%,var(--card))]"

function foot(sticky = false) {
  return cn(
    "sticky bottom-0 h-9 overflow-hidden border-t border-r border-border bg-card px-3 align-middle whitespace-nowrap last:border-r-0",
    sticky ? "left-0 z-30" : "z-20"
  )
}

function cellBg(rowSelected: boolean, colSelected: boolean) {
  if (rowSelected && colSelected) return BG_TINT_STRONG
  if (rowSelected || colSelected) return BG_TINT
  return BG_IDLE
}

const subscribeNever = () => () => {}

/* ── small parts ────────────────────────────────────────── */

function Tag({ name }: { name: string }) {
  const tone = TAG_COLORS[name] ?? "var(--muted-foreground)"
  return (
    <span
      data-slot="records-table-tag"
      className="inline-flex h-5 shrink-0 items-center rounded-md border border-[color-mix(in_oklab,var(--tag)_28%,var(--card))] bg-[color-mix(in_oklab,var(--tag)_14%,var(--card))] px-1.5 text-[calc(11.5px*var(--text-scale))] font-medium whitespace-nowrap text-[color-mix(in_oklab,var(--tag)_72%,var(--foreground))] dark:border-[color-mix(in_oklab,var(--tag)_40%,var(--card))] dark:bg-[color-mix(in_oklab,var(--tag)_22%,var(--card))] dark:text-[color-mix(in_oklab,var(--tag)_55%,var(--foreground))]"
      style={{ "--tag": tone } as React.CSSProperties}
    >
      {name}
    </span>
  )
}

const MORE_TAG =
  "inline-flex h-5 shrink-0 items-center rounded-md border bg-muted px-1.5 font-mono text-[calc(11px*var(--text-scale))] text-muted-foreground tabular-nums"

function TagList({ tags }: { tags: string[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const measureRef = React.useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = React.useState(tags.length)

  React.useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const update = () => {
      const available = container.clientWidth
      const tagWidths = Array.from(
        measure.querySelectorAll<HTMLElement>("[data-tag-measure]"),
        (tag) => tag.offsetWidth
      )
      const moreWidth =
        measure.querySelector<HTMLElement>("[data-more-measure]")
          ?.offsetWidth ?? 0
      let used = 0
      let count = 0

      for (let index = 0; index < tagWidths.length; index += 1) {
        const nextUsed = used + (count > 0 ? 4 : 0) + tagWidths[index]
        const hiddenAfter = tags.length - (index + 1)
        const totalWithOverflow =
          nextUsed + (hiddenAfter > 0 ? 4 + moreWidth : 0)
        if (totalWithOverflow > available) break
        used = nextUsed
        count += 1
      }

      setVisibleCount(count)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [tags])

  const hiddenCount = tags.length - visibleCount

  return (
    <div
      ref={containerRef}
      className="relative flex min-w-0 items-center gap-1 overflow-hidden"
      title={tags.join(", ")}
      aria-label={`Categories: ${tags.join(", ")}`}
    >
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 flex gap-1"
      >
        {tags.map((tag) => (
          <span key={tag} data-tag-measure className="flex">
            <Tag name={tag} />
          </span>
        ))}
        <span data-more-measure className={MORE_TAG}>
          +{tags.length}
        </span>
      </div>
      {tags.slice(0, visibleCount).map((tag) => (
        <Tag key={tag} name={tag} />
      ))}
      {hiddenCount > 0 && <span className={MORE_TAG}>+{hiddenCount}</span>}
    </div>
  )
}

function CalcCell() {
  return (
    <span
      data-slot="records-table-calculating"
      className="inline-flex items-center gap-2"
    >
      <span className="text-muted-foreground/70">Calculating…</span>
      <span className="size-1.5 animate-blink rounded-full bg-brand" />
    </span>
  )
}

function StrengthDot({ className }: { className: string }) {
  return <span className={cn("size-1.5 shrink-0 rounded-full", className)} />
}

function ResizeHandle({
  label,
  resizing,
  onPointerDown,
}: {
  label: string
  resizing: boolean
  onPointerDown: (event: React.PointerEvent<HTMLSpanElement>) => void
}) {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      data-slot="records-table-resize"
      data-resizing={resizing || undefined}
      onPointerDown={onPointerDown}
      className="group/handle absolute inset-y-0 -right-1 z-10 flex w-2 cursor-col-resize touch-none justify-center"
    >
      <span
        className={cn(
          "h-full w-px transition-colors duration-150",
          resizing ? "bg-brand" : "bg-transparent group-hover/handle:bg-brand"
        )}
      />
    </span>
  )
}

function headerCellClass(selected: boolean, sticky = false) {
  return cn(
    "group/th sticky top-0 border-r border-b border-border p-0 text-left font-normal last:border-r-0",
    sticky ? "left-0 z-30" : "z-20",
    selected
      ? "bg-[color-mix(in_oklab,var(--brand)_5%,var(--card))]"
      : "bg-card"
  )
}

function HeaderCell({
  label,
  icon: Icon,
  sortKey,
  sort,
  onSort,
  onResizeStart,
  resizing = false,
  selected = false,
  onPick,
  thRef,
}: {
  label: string
  icon: LucideIcon
  sortKey?: SortKey
  sort: { key: SortKey; dir: 1 | -1 }
  onSort: (key: SortKey) => void
  onResizeStart: (event: React.PointerEvent<HTMLSpanElement>) => void
  resizing?: boolean
  selected?: boolean
  onPick?: (event: React.MouseEvent) => void
  thRef?: React.Ref<HTMLTableCellElement>
}) {
  const active = sortKey !== undefined && sort.key === sortKey
  return (
    <th
      ref={thRef}
      data-slot="records-table-header"
      data-selected={selected || undefined}
      className={headerCellClass(selected)}
    >
      {/* header click opens the property config; the arrow sorts */}
      <button
        type="button"
        data-recpop
        aria-haspopup="dialog"
        aria-expanded={selected}
        onClick={onPick}
        className={cn(
          "flex h-9 w-full min-w-0 items-center gap-1.5 px-3 text-[calc(13px*var(--text-scale))] transition-colors duration-100 outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          selected ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <Icon className="size-[15px] shrink-0" aria-hidden />
        <span className="truncate">{label}</span>
        {sortKey && (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Sort by ${label}`}
            onClick={(event) => {
              event.stopPropagation()
              onSort(sortKey)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                event.stopPropagation()
                onSort(sortKey)
              }
            }}
            className={cn(
              "ml-auto flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[opacity,transform,background-color] duration-150 ease-out hover:bg-accent hover:text-foreground focus-visible:opacity-100",
              active ? "opacity-100" : "opacity-0 group-hover/th:opacity-100",
              active && sort.dir === -1 && "rotate-180"
            )}
          >
            <ArrowDown className="size-3" aria-hidden />
          </span>
        )}
      </button>
      <ResizeHandle
        label={label}
        resizing={resizing}
        onPointerDown={onResizeStart}
      />
    </th>
  )
}

/* config row inside the property popover */
function ConfigRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-8 items-center justify-between">
      <span className="text-[calc(13px*var(--text-scale))] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

function ConfigPicker({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: { label: string; icon: LucideIcon }[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div role="menu" aria-label={label} className={cn(SUBMENU, "w-[210px]")}>
      <div className="px-2 pt-0.5 pb-1 text-[calc(11.5px*var(--text-scale))] font-medium text-muted-foreground">
        {label}
      </div>
      <GlideMenu className="flex flex-col gap-px">
        {options.map(({ label: option, icon: Icon }) => (
          <button
            key={option}
            data-menu-row
            type="button"
            role="menuitemradio"
            aria-checked={selected === option}
            onClick={() => onSelect(option)}
            className={PICKER_ROW}
          >
            <Icon
              className="size-[15px] shrink-0 text-muted-foreground"
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate">{option}</span>
            <Check
              aria-hidden
              strokeWidth={2.2}
              className={cn(
                "size-3.5",
                selected === option ? "text-foreground" : "invisible"
              )}
            />
          </button>
        ))}
      </GlideMenu>
    </div>
  )
}

function InputPicker({
  options,
  selected,
  onToggle,
}: {
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div
      role="menu"
      aria-label="Calculation inputs"
      className={cn(SUBMENU, "w-[220px]")}
    >
      <div className="px-2 pt-0.5 pb-1 text-[calc(11.5px*var(--text-scale))] font-medium text-muted-foreground">
        Use values from
      </div>
      <GlideMenu className="flex flex-col gap-px">
        {options.map((option) => {
          const checked = selected.includes(option)
          return (
            <button
              key={option}
              data-menu-row
              type="button"
              role="menuitemcheckbox"
              aria-checked={checked}
              onClick={() => onToggle(option)}
              className={PICKER_ROW}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150",
                  checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-transparent"
                )}
              >
                <Check className="size-[11px]" strokeWidth={2.6} aria-hidden />
              </span>
              <span className="min-w-0 flex-1 truncate">{option}</span>
            </button>
          )
        })}
      </GlideMenu>
    </div>
  )
}

/* ── table ──────────────────────────────────────────────── */

type Anchor = { x: number; y: number }

export function RecordsTable({
  rows = INITIAL_ROWS,
  fill = false,
  className,
}: RecordsTableProps) {
  const mounted = React.useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set())
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({
    key: "name",
    dir: 1,
  })
  const [columnWidths, setColumnWidths] = React.useState(DEFAULT_COLUMN_WIDTHS)
  const [actionColumnWidth, setActionColumnWidth] = React.useState(100)
  const [columnWidthsLocked, setColumnWidthsLocked] = React.useState(false)
  const [resizingColumn, setResizingColumn] = React.useState<ColumnKey | null>(
    null
  )
  const initialColumnWidthsRef = React.useRef<Record<ColumnKey, number> | null>(
    null
  )
  const tableRef = React.useRef<HTMLTableElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  /* property popover, anchored to the clicked header */
  const [prop, setProp] = React.useState<(Anchor & { col: string }) | null>(
    null
  )
  const [grounding, setGrounding] = React.useState(false)
  const [groundingHelpOpen, setGroundingHelpOpen] = React.useState(false)
  const [configMenu, setConfigMenu] = React.useState<
    "type" | "tool" | "inputs" | null
  >(null)
  const [columnOverrides, setColumnOverrides] = React.useState<
    Record<string, Partial<ColumnMeta>>
  >({})
  const [inputSelections, setInputSelections] = React.useState<
    Record<string, string[]>
  >({})
  const [pinnedColumns, setPinnedColumns] = React.useState<Set<string>>(
    () => new Set()
  )
  const [moreSettingsOpen, setMoreSettingsOpen] = React.useState(false)
  const [advancedSettings, setAdvancedSettings] = React.useState({
    required: false,
    allowEmpty: true,
    confidence: false,
  })
  /* + new-property menu and table options menu */
  const [addOpen, setAddOpen] = React.useState<Anchor | null>(null)
  const [tableMenuOpen, setTableMenuOpen] = React.useState<Anchor | null>(null)
  /* the added AI column and its lifecycle */
  const [aiAdded, setAiAdded] = React.useState(false)
  const [aiDone, setAiDone] = React.useState(false)
  const aiThRef = React.useRef<HTMLTableCellElement>(null)
  /* programmatic scrolls (revealing the new column) shouldn't close popovers */
  const ignoreScrollRef = React.useRef(false)
  /* a running calculation resolves rows one by one */
  const [calc, setCalc] = React.useState<{
    col: string
    resolved: number
  } | null>(null)

  /* Let the table fill its available space once, then capture those rendered
   * widths before paint. From that point on every column is explicit, so a
   * resize changes only the dragged column and the table's total width. */
  React.useLayoutEffect(() => {
    if (columnWidthsLocked || !tableRef.current) return
    const headers = Array.from(
      tableRef.current.querySelectorAll<HTMLTableCellElement>("thead th")
    )
    if (headers.length < 6) return
    const width = (index: number) =>
      headers[index].getBoundingClientRect().width

    const measured: Record<ColumnKey, number> = {
      company: width(0),
      categories: width(1),
      last: width(2),
      strength: width(3),
      links: width(4),
      ai: DEFAULT_COLUMN_WIDTHS.ai,
    }
    initialColumnWidthsRef.current = measured
    setColumnWidths(measured)
    setActionColumnWidth(width(headers.length - 1))
    setColumnWidthsLocked(true)
  }, [columnWidthsLocked])

  const visibleRows = React.useMemo(() => {
    return [...rows].sort((a, b) => {
      const value =
        sort.key === "name"
          ? a.name.localeCompare(b.name)
          : sort.key === "last"
            ? a.last.localeCompare(b.last)
            : STRENGTH[a.strength].rank - STRENGTH[b.strength].rank
      return value * sort.dir
    })
  }, [rows, sort])

  /* stagger: one row resolves every beat */
  React.useEffect(() => {
    if (!calc) return
    const t = window.setTimeout(() => {
      if (calc.resolved >= visibleRows.length) {
        if (calc.col === AI_LABEL) setAiDone(true)
        setCalc(null)
      } else {
        setCalc({ ...calc, resolved: calc.resolved + 1 })
      }
    }, 110)
    return () => window.clearTimeout(t)
  }, [calc, visibleRows.length])

  const closeAll = React.useCallback(() => {
    setProp(null)
    setConfigMenu(null)
    setGroundingHelpOpen(false)
    setMoreSettingsOpen(false)
    setAddOpen(null)
    setTableMenuOpen(null)
  }, [])

  /* click anywhere else, Escape or a page scroll closes popovers */
  const anyOpen = !!prop || !!addOpen || !!tableMenuOpen
  React.useEffect(() => {
    if (!anyOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest("[data-recpop]")) closeAll()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll()
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    window.addEventListener("scroll", closeAll)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("scroll", closeAll)
    }
  }, [anyOpen, closeAll])

  const anchorBelow = (rect: DOMRect, width: number): Anchor => ({
    x: Math.max(8, Math.min(rect.left, window.innerWidth - width - 16)),
    y: rect.bottom + 6,
  })

  const openProp = (col: string) => (event: React.MouseEvent) => {
    const th = (event.currentTarget as Element).closest("th")
    if (!th) return
    setAddOpen(null)
    setTableMenuOpen(null)
    setConfigMenu(null)
    setGroundingHelpOpen(false)
    setMoreSettingsOpen(false)
    const anchor = anchorBelow(th.getBoundingClientRect(), 320)
    setProp((current) => (current?.col === col ? null : { col, ...anchor }))
  }

  /* add the AI column, scroll it into view and open its config anchored to
   * the new header */
  const addAiColumn = () => {
    flushSync(() => {
      setAddOpen(null)
      setAiDone(false)
      setAiAdded(true)
    })
    const th = aiThRef.current
    const scroller = scrollRef.current
    if (!th) return
    if (scroller) {
      const max = scroller.scrollWidth - scroller.clientWidth
      if (Math.abs(scroller.scrollLeft - max) > 1) {
        ignoreScrollRef.current = true
        scroller.scrollLeft = max
      }
    }
    setProp({ col: AI_LABEL, ...anchorBelow(th.getBoundingClientRect(), 320) })
  }

  const isCalc = (col: string, index: number) =>
    !!calc && calc.col === col && index >= calc.resolved

  const allSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selected.has(row.id))
  const partiallySelected =
    !allSelected && visibleRows.some((row) => selected.has(row.id))

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, dir: (current.dir * -1) as 1 | -1 }
        : { key, dir: 1 }
    )

  const startColumnResize =
    (key: ColumnKey, minWidth = 120) =>
    (event: React.PointerEvent<HTMLSpanElement>) => {
      event.preventDefault()
      event.stopPropagation()
      closeAll()

      const startX = event.clientX
      const startWidth = columnWidths[key]
      const body = document.body
      const previousCursor = body.style.cursor
      const previousSelection = body.style.userSelect
      body.style.cursor = "col-resize"
      body.style.userSelect = "none"
      setResizingColumn(key)

      const move = (moveEvent: PointerEvent) => {
        const width = Math.max(
          minWidth,
          startWidth + moveEvent.clientX - startX
        )
        setColumnWidths((current) => ({ ...current, [key]: width }))
      }
      const finish = () => {
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", finish)
        window.removeEventListener("pointercancel", finish)
        body.style.cursor = previousCursor
        body.style.userSelect = previousSelection
        setResizingColumn(null)
      }

      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", finish)
      window.addEventListener("pointercancel", finish)
    }

  const toggleRow = (id: string) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const toggleAll = () =>
    setSelected((current) => {
      const next = new Set(current)
      for (const row of visibleRows) {
        if (allSelected) next.delete(row.id)
        else next.add(row.id)
      }
      return next
    })

  const meta = prop
    ? { ...COLUMN_META[prop.col], ...columnOverrides[prop.col] }
    : null
  const selectedInputs =
    prop && meta
      ? (inputSelections[prop.col] ?? (meta.inputs ? [meta.inputs] : []))
      : []
  const tableWidth =
    columnWidths.company +
    columnWidths.categories +
    columnWidths.last +
    columnWidths.strength +
    columnWidths.links +
    (aiAdded ? columnWidths.ai : 0) +
    actionColumnWidth
  const averageStrength = rows.length
    ? Math.round(
        (rows.reduce((sum, row) => sum + STRENGTH[row.strength].rank, 0) /
          rows.length /
          3) *
          100
      )
    : 0

  const colSel = (col: string) => prop?.col === col
  const MetaTypeIcon = meta ? (TYPE_ICONS[meta.type] ?? Text) : Text
  const MetaToolIcon = meta ? TOOL_ICONS[meta.toolKind] : Sparkle

  return (
    <div
      data-slot="records-table"
      className={cn(
        "relative w-full overflow-hidden rounded-lg border bg-card text-[calc(13px*var(--text-scale))] text-foreground",
        fill && "flex h-full flex-col",
        className
      )}
    >
      <div
        ref={scrollRef}
        data-slot="records-table-scroll"
        tabIndex={0}
        aria-label="Companies table. Scroll horizontally and vertically to view all columns and records."
        className={cn(
          "overflow-auto overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          fill ? "min-h-0 flex-1" : "max-h-[420px]"
        )}
        onScroll={() => {
          if (ignoreScrollRef.current) {
            ignoreScrollRef.current = false
            return
          }
          closeAll()
        }}
      >
        <table
          ref={tableRef}
          className="table-fixed border-separate border-spacing-0"
          style={{
            width: columnWidthsLocked ? tableWidth : "100%",
            minWidth: tableWidth,
          }}
        >
          <colgroup>
            <col style={{ width: columnWidths.company }} />
            <col style={{ width: columnWidths.categories }} />
            <col style={{ width: columnWidths.last }} />
            <col style={{ width: columnWidths.strength }} />
            <col style={{ width: columnWidths.links }} />
            {aiAdded && <col style={{ width: columnWidths.ai }} />}
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              <th
                data-slot="records-table-header"
                data-selected={colSel("Company") || undefined}
                className={headerCellClass(colSel("Company"), true)}
              >
                <div className="flex h-9 items-center gap-2.5 pl-3">
                  <Checkbox
                    checked={
                      allSelected
                        ? true
                        : partiallySelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Select all companies"
                  />
                  <button
                    type="button"
                    data-recpop
                    aria-haspopup="dialog"
                    aria-expanded={colSel("Company")}
                    onClick={openProp("Company")}
                    className={cn(
                      "flex h-9 min-w-0 flex-1 items-center gap-1.5 pr-3 text-[calc(13px*var(--text-scale))] transition-colors duration-100 outline-none focus-visible:underline",
                      colSel("Company")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Text className="size-[15px] shrink-0" aria-hidden />
                    <span className="truncate">Company</span>
                  </button>
                </div>
                <ResizeHandle
                  label="Company"
                  resizing={resizingColumn === "company"}
                  onPointerDown={startColumnResize("company", 180)}
                />
              </th>
              <HeaderCell
                label="Categories"
                selected={colSel("Categories")}
                onPick={openProp("Categories")}
                sort={sort}
                onSort={toggleSort}
                onResizeStart={startColumnResize("categories")}
                resizing={resizingColumn === "categories"}
                icon={ListChecks}
              />
              <HeaderCell
                label="Last interaction"
                selected={colSel("Last interaction")}
                onPick={openProp("Last interaction")}
                sortKey="last"
                sort={sort}
                onSort={toggleSort}
                onResizeStart={startColumnResize("last")}
                resizing={resizingColumn === "last"}
                icon={Calendar}
              />
              <HeaderCell
                label="Connection strength"
                selected={colSel("Connection strength")}
                onPick={openProp("Connection strength")}
                sortKey="strength"
                sort={sort}
                onSort={toggleSort}
                onResizeStart={startColumnResize("strength")}
                resizing={resizingColumn === "strength"}
                icon={CircleCheck}
              />
              <HeaderCell
                label="Links"
                selected={colSel("Links")}
                onPick={openProp("Links")}
                sort={sort}
                onSort={toggleSort}
                onResizeStart={startColumnResize("links")}
                resizing={resizingColumn === "links"}
                icon={Link}
              />
              {aiAdded && (
                <HeaderCell
                  thRef={aiThRef}
                  label={AI_LABEL}
                  selected={colSel(AI_LABEL)}
                  onPick={openProp(AI_LABEL)}
                  sort={sort}
                  onSort={toggleSort}
                  onResizeStart={startColumnResize("ai")}
                  resizing={resizingColumn === "ai"}
                  icon={Text}
                />
              )}
              <th className={headerCellClass(false)}>
                <div className="flex h-9 items-center gap-1 px-2">
                  <button
                    type="button"
                    aria-label="New property"
                    aria-haspopup="menu"
                    aria-expanded={!!addOpen}
                    data-recpop
                    onClick={(event) => {
                      setProp(null)
                      setTableMenuOpen(null)
                      const rect = event.currentTarget.getBoundingClientRect()
                      setAddOpen((current) =>
                        current ? null : anchorBelow(rect, 260)
                      )
                    }}
                    className={ICON_BUTTON}
                  >
                    <Plus className="size-[15px]" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    aria-label="Table options"
                    aria-haspopup="menu"
                    aria-expanded={!!tableMenuOpen}
                    data-recpop
                    onClick={(event) => {
                      setProp(null)
                      setAddOpen(null)
                      const rect = event.currentTarget.getBoundingClientRect()
                      setTableMenuOpen((current) =>
                        current
                          ? null
                          : {
                              x: Math.max(
                                8,
                                Math.min(
                                  rect.right - 220,
                                  window.innerWidth - 228
                                )
                              ),
                              y: rect.bottom + 6,
                            }
                      )
                    }}
                    className={ICON_BUTTON}
                  >
                    <Ellipsis className="size-[15px]" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, index) => {
              const rowSelected = selected.has(row.id)
              const strength = STRENGTH[row.strength]
              const td = (col?: string) =>
                cn(
                  CELL_BASE,
                  "h-10 overflow-hidden px-3 align-middle whitespace-nowrap transition-colors duration-100",
                  cellBg(rowSelected, !!col && colSel(col))
                )
              return (
                <tr
                  key={row.id}
                  data-slot="records-table-row"
                  data-state={rowSelected ? "selected" : undefined}
                  aria-selected={rowSelected}
                  className="group/row [&:last-child>td]:border-b-0"
                >
                  <td className={cn(td("Company"), "sticky left-0 z-10 pl-3")}>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="relative flex size-4 shrink-0 items-center justify-center">
                        <span
                          aria-hidden
                          className={cn(
                            "font-mono text-[calc(11px*var(--text-scale))] text-muted-foreground/70 tabular-nums transition-opacity duration-100",
                            rowSelected
                              ? "opacity-0"
                              : "group-focus-within/row:opacity-0 group-hover/row:opacity-0"
                          )}
                        >
                          {index + 1}
                        </span>
                        <Checkbox
                          checked={rowSelected}
                          onCheckedChange={() => toggleRow(row.id)}
                          aria-label={`Select ${row.name}`}
                          className={cn(
                            "absolute inset-0 transition-[opacity,background-color,border-color,transform] duration-100",
                            rowSelected
                              ? "opacity-100"
                              : "opacity-0 group-focus-within/row:opacity-100 group-hover/row:opacity-100 focus-visible:opacity-100"
                          )}
                        />
                      </span>
                      <span
                        aria-hidden
                        className="flex size-5 shrink-0 items-center justify-center rounded-md border bg-muted text-[calc(11px*var(--text-scale))] font-medium text-muted-foreground"
                      >
                        {row.name.slice(0, 1).toUpperCase()}
                      </span>
                      {row.website ? (
                        <a
                          href={`https://${row.website}`}
                          target="_blank"
                          rel="noreferrer"
                          title={row.name}
                          className="min-w-0 truncate font-medium text-foreground decoration-border underline-offset-4 hover:underline"
                        >
                          {row.name}
                        </a>
                      ) : (
                        <span
                          title={row.name}
                          className="min-w-0 truncate font-medium text-foreground"
                        >
                          {row.name}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className={td("Categories")}>
                    {isCalc("Categories", index) ? (
                      <CalcCell />
                    ) : (
                      <TagList tags={row.tags} />
                    )}
                  </td>
                  <td
                    className={cn(
                      td("Last interaction"),
                      row.last === "No contact"
                        ? "text-muted-foreground/70"
                        : "text-foreground/80"
                    )}
                  >
                    {isCalc("Last interaction", index) ? (
                      <CalcCell />
                    ) : (
                      row.last
                    )}
                  </td>
                  <td className={td("Connection strength")}>
                    {isCalc("Connection strength", index) ? (
                      <CalcCell />
                    ) : (
                      <span className="inline-flex items-center gap-2 text-foreground/80">
                        <StrengthDot className={strength.dot} />
                        {strength.label}
                      </span>
                    )}
                  </td>
                  <td className={td("Links")}>
                    {isCalc("Links", index) ? (
                      <CalcCell />
                    ) : row.website ? (
                      <a
                        href={`https://${row.website}`}
                        title={row.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full min-w-0 items-center gap-1 text-muted-foreground transition-colors duration-100 hover:text-brand"
                      >
                        <span className="truncate">{row.website}</span>
                        <ArrowUpRight className="size-3 shrink-0" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-muted-foreground/70">—</span>
                    )}
                  </td>
                  {aiAdded && (
                    <td className={cn(td(AI_LABEL), "text-foreground/80")}>
                      {calc?.col === AI_LABEL ? (
                        index < calc.resolved ? (
                          <span className="block animate-fade-in truncate">
                            {competitorsFor(index)}
                          </span>
                        ) : (
                          <CalcCell />
                        )
                      ) : aiDone ? (
                        <span className="block truncate">
                          {competitorsFor(index)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/70">—</span>
                      )}
                    </td>
                  )}
                  <td className={td()} />
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr
              data-slot="records-table-footer"
              className="text-[calc(12px*var(--text-scale))] text-muted-foreground"
            >
              <td className={foot(true)}>
                <span>
                  <span className="font-mono text-foreground tabular-nums">
                    {rows.length}
                  </span>{" "}
                  count
                </span>
              </td>
              <td className={foot()}>
                <button
                  type="button"
                  className="-mx-1.5 inline-flex h-6 items-center gap-1.5 rounded-md px-1.5 text-muted-foreground/70 transition-colors duration-100 outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Plus className="size-3.5" aria-hidden />
                  Add calculation
                </button>
              </td>
              <td className={cn(foot(), "text-muted-foreground/70")}>—</td>
              <td className={foot()}>
                <span className="inline-flex items-center gap-2">
                  <StrengthDot className="bg-warning" />
                  <span className="font-mono text-foreground tabular-nums">
                    {averageStrength}%
                  </span>{" "}
                  average
                </span>
              </td>
              <td className={foot()}>
                <span className="font-mono tabular-nums">
                  {rows.filter((row) => row.website).length}
                </span>{" "}
                links
              </td>
              {aiAdded && (
                <td className={cn(foot(), "text-muted-foreground/70")}>
                  {aiDone ? (
                    <>
                      <span className="font-mono tabular-nums">
                        {rows.length}
                      </span>{" "}
                      filled
                    </>
                  ) : (
                    "—"
                  )}
                </td>
              )}
              <td className={foot()} />
            </tr>
          </tfoot>
        </table>
      </div>

      {mounted &&
        createPortal(
          <>
            {/* ── property configuration popover ─────────────── */}
            {prop && meta && (
              <div
                data-recpop
                role="dialog"
                aria-label={`${prop.col} property`}
                data-slot="records-table-property"
                className={cn(POPOVER, "w-80 origin-top-left px-3 pt-3 pb-1.5")}
                style={{ top: prop.y, left: prop.x }}
              >
                <div className="pb-2 text-[calc(13.5px*var(--text-scale))] font-medium text-foreground">
                  {prop.col}
                </div>

                <ConfigRow label="Type">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={configMenu === "type"}
                    onClick={() =>
                      setConfigMenu((current) =>
                        current === "type" ? null : "type"
                      )
                    }
                    className={CONFIG_TRIGGER}
                  >
                    <MetaTypeIcon
                      className="size-3.5 text-muted-foreground"
                      aria-hidden
                    />
                    {meta.type}
                    <ChevronRight
                      className="size-3 text-muted-foreground/70"
                      strokeWidth={2.2}
                      aria-hidden
                    />
                  </button>
                  {configMenu === "type" && (
                    <ConfigPicker
                      label="Property type"
                      selected={meta.type}
                      options={NEW_PROPERTY_TYPES.map((type) => ({
                        label: type,
                        icon: TYPE_ICONS[type],
                      }))}
                      onSelect={(type) => {
                        setColumnOverrides((current) => ({
                          ...current,
                          [prop.col]: { ...current[prop.col], type },
                        }))
                        setConfigMenu(null)
                      }}
                    />
                  )}
                </ConfigRow>
                <ConfigRow label="Tool">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={configMenu === "tool"}
                    onClick={() =>
                      setConfigMenu((current) =>
                        current === "tool" ? null : "tool"
                      )
                    }
                    className={CONFIG_TRIGGER}
                  >
                    <MetaToolIcon
                      aria-hidden
                      className={cn(
                        "size-3.5",
                        meta.toolKind === "model"
                          ? "fill-current text-brand"
                          : "text-muted-foreground"
                      )}
                    />
                    {meta.tool}
                    <ChevronRight
                      className="size-3 text-muted-foreground/70"
                      strokeWidth={2.2}
                      aria-hidden
                    />
                  </button>
                  {configMenu === "tool" && (
                    <ConfigPicker
                      label="Model"
                      selected={meta.tool}
                      options={MODEL_OPTIONS.map((model) => ({
                        label: model,
                        icon: Sparkle,
                      }))}
                      onSelect={(tool) => {
                        setColumnOverrides((current) => ({
                          ...current,
                          [prop.col]: {
                            ...current[prop.col],
                            tool,
                            toolKind: "model",
                          },
                        }))
                        setConfigMenu(null)
                      }}
                    />
                  )}
                </ConfigRow>
                <ConfigRow label="Grounding">
                  <span className="flex items-center gap-2">
                    <Switch
                      aria-label="Grounding"
                      checked={grounding}
                      onCheckedChange={setGrounding}
                    />
                    <button
                      type="button"
                      aria-label="About grounding"
                      aria-expanded={groundingHelpOpen}
                      onClick={() => setGroundingHelpOpen((open) => !open)}
                      className={cn(ICON_BUTTON, "size-6")}
                    >
                      <Info className="size-3.5" aria-hidden />
                    </button>
                  </span>
                  {groundingHelpOpen && (
                    <div
                      role="status"
                      className="absolute top-[30px] right-0 z-30 w-[230px] origin-top-right animate-pop-in rounded-md bg-ink px-3 py-2.5 text-[calc(12px*var(--text-scale))] leading-relaxed text-ink-foreground shadow-md"
                    >
                      Grounding lets the model verify generated values against
                      connected sources.
                    </div>
                  )}
                </ConfigRow>
                <ConfigRow label="Inputs">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={configMenu === "inputs"}
                    onClick={() =>
                      setConfigMenu((current) =>
                        current === "inputs" ? null : "inputs"
                      )
                    }
                    className={cn(
                      CONFIG_TRIGGER,
                      "max-w-[220px] font-normal text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {selectedInputs.length ? (
                      <span className="flex min-w-0 items-center gap-1">
                        {selectedInputs.slice(0, 2).map((input) => (
                          <span
                            key={input}
                            className="max-w-[92px] truncate rounded-md bg-brand/10 px-1.5 py-0.5 text-[calc(12px*var(--text-scale))] font-medium text-brand"
                          >
                            {input}
                          </span>
                        ))}
                        {selectedInputs.length > 2 && (
                          <span className="font-mono text-[calc(11px*var(--text-scale))] font-medium text-muted-foreground/70">
                            +{selectedInputs.length - 2}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span>Select inputs</span>
                    )}
                    <ChevronRight
                      className="size-3 shrink-0 text-muted-foreground/70"
                      strokeWidth={2.2}
                      aria-hidden
                    />
                  </button>
                  {configMenu === "inputs" && (
                    <InputPicker
                      selected={selectedInputs}
                      options={INPUT_OPTIONS.filter(
                        (input) => input !== prop.col
                      )}
                      onToggle={(input) => {
                        setInputSelections((current) => {
                          const existing =
                            current[prop.col] ??
                            (meta.inputs ? [meta.inputs] : [])
                          const next = existing.includes(input)
                            ? existing.filter((item) => item !== input)
                            : [...existing, input]
                          return { ...current, [prop.col]: next }
                        })
                      }}
                    />
                  )}
                </ConfigRow>

                {/* prompt — @-mention chips inline */}
                <div
                  key={prop.col}
                  contentEditable
                  suppressContentEditableWarning
                  role="textbox"
                  aria-label={`${prop.col} calculation prompt`}
                  aria-multiline="true"
                  spellCheck
                  className="mt-2 min-h-[88px] cursor-text rounded-md border bg-muted p-3 text-[calc(13px*var(--text-scale))] leading-relaxed transition-[box-shadow,border-color] duration-150 outline-none focus:border-brand focus:ring-2 focus:ring-ring"
                >
                  {meta.prompt ? (
                    <span className="text-foreground">
                      {meta.prompt.before}
                      {meta.prompt.chip && (
                        <span
                          contentEditable={false}
                          className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[calc(12px*var(--text-scale))] font-medium text-brand"
                        >
                          {meta.prompt.chip}
                        </span>
                      )}
                      {meta.prompt.after}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/70">
                      Set a prompt (press @ to mention an input)
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!!calc}
                  onClick={() => {
                    setCalc({ col: prop.col, resolved: 0 })
                    setProp(null)
                  }}
                  className="mt-2.5 flex h-9 w-full items-center justify-center gap-2 rounded-md border bg-card text-[calc(12.5px*var(--text-scale))] font-medium text-foreground transition-[background-color,border-color,transform] duration-150 ease-out outline-none hover:border-foreground/25 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-60"
                >
                  <RotateCw className="size-3.5" aria-hidden />
                  Go calculate
                </button>

                <GlideMenu
                  className="mt-3 flex flex-col gap-0.5 border-t pt-2"
                  highlightClassName="-inset-x-1.5"
                >
                  <button
                    data-menu-row
                    type="button"
                    aria-pressed={pinnedColumns.has(prop.col)}
                    onClick={() =>
                      setPinnedColumns((current) => {
                        const next = new Set(current)
                        if (next.has(prop.col)) next.delete(prop.col)
                        else next.add(prop.col)
                        return next
                      })
                    }
                    className={cn(
                      MENU_ROW,
                      "h-8 px-1.5 transition-transform duration-150 ease-out active:scale-[0.96]"
                    )}
                  >
                    <Pin
                      aria-hidden
                      className={cn(
                        pinnedColumns.has(prop.col) && "fill-current text-brand"
                      )}
                    />
                    {pinnedColumns.has(prop.col) ? "Unpin" : "Pin"}
                  </button>
                  <button
                    data-menu-row
                    type="button"
                    aria-expanded={moreSettingsOpen}
                    onClick={() => setMoreSettingsOpen((open) => !open)}
                    className={cn(
                      MENU_ROW,
                      "h-8 px-1.5 transition-transform duration-150 ease-out active:scale-[0.96]"
                    )}
                  >
                    <Settings2
                      aria-hidden
                      className={cn(moreSettingsOpen && "text-foreground")}
                    />
                    <span className="flex-1">More settings</span>
                    <ChevronRight
                      aria-hidden
                      strokeWidth={2.2}
                      className={cn(
                        "size-3! text-muted-foreground/70 transition-transform duration-150 ease-out",
                        moreSettingsOpen && "rotate-90"
                      )}
                    />
                  </button>
                  {prop.col === AI_LABEL && (
                    <button
                      data-menu-row
                      type="button"
                      onClick={() => {
                        setAiAdded(false)
                        setAiDone(false)
                        setProp(null)
                      }}
                      className={cn(
                        MENU_ROW,
                        "h-8 px-1.5 transition-transform duration-150 ease-out active:scale-[0.96]"
                      )}
                    >
                      <EyeOff aria-hidden />
                      Hide from view
                    </button>
                  )}
                </GlideMenu>

                {moreSettingsOpen && (
                  <div className="mt-2 animate-fade-up border-t pt-2">
                    <div className="pb-1 eyebrow text-muted-foreground">
                      Behavior
                    </div>
                    <ConfigRow label="Required value">
                      <Switch
                        aria-label="Required value"
                        checked={advancedSettings.required}
                        onCheckedChange={(required) =>
                          setAdvancedSettings((current) => ({
                            ...current,
                            required,
                          }))
                        }
                      />
                    </ConfigRow>
                    <ConfigRow label="Allow empty results">
                      <Switch
                        aria-label="Allow empty results"
                        checked={advancedSettings.allowEmpty}
                        onCheckedChange={(allowEmpty) =>
                          setAdvancedSettings((current) => ({
                            ...current,
                            allowEmpty,
                          }))
                        }
                      />
                    </ConfigRow>
                    <ConfigRow label="Show confidence">
                      <Switch
                        aria-label="Show confidence"
                        checked={advancedSettings.confidence}
                        onCheckedChange={(confidence) =>
                          setAdvancedSettings((current) => ({
                            ...current,
                            confidence,
                          }))
                        }
                      />
                    </ConfigRow>
                  </div>
                )}
              </div>
            )}

            {/* ── new property type menu ─────────────────────── */}
            {addOpen && (
              <div
                data-recpop
                role="menu"
                aria-label="New property"
                className={cn(POPOVER, "w-[260px] origin-top-left p-1.5")}
                style={{ top: addOpen.y, left: addOpen.x }}
              >
                <div className={MENU_LABEL}>New property</div>
                <GlideMenu className="flex flex-col gap-px">
                  {NEW_PROPERTY_TYPES.map((type) => {
                    const Icon = TYPE_ICONS[type]
                    return (
                      <button
                        key={type}
                        data-menu-row
                        type="button"
                        role="menuitem"
                        onClick={addAiColumn}
                        className={MENU_ROW}
                      >
                        <Icon aria-hidden />
                        {type}
                      </button>
                    )
                  })}
                </GlideMenu>
              </div>
            )}

            {/* ── table options menu ─────────────────────────── */}
            {tableMenuOpen && (
              <div
                data-recpop
                role="menu"
                aria-label="Table options"
                className={cn(POPOVER, "w-[220px] origin-top-right p-1.5")}
                style={{ top: tableMenuOpen.y, left: tableMenuOpen.x }}
              >
                <div className={MENU_LABEL}>Table options</div>
                <GlideMenu className="flex flex-col gap-px">
                  <button
                    data-menu-row
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      const position = tableMenuOpen
                      setTableMenuOpen(null)
                      setAddOpen({
                        x: Math.min(position.x, window.innerWidth - 276),
                        y: position.y,
                      })
                    }}
                    className={MENU_ROW}
                  >
                    <Plus aria-hidden strokeWidth={2} />
                    Add property
                  </button>
                  <button
                    data-menu-row
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setColumnWidths(COMPACT_COLUMN_WIDTHS)
                      setTableMenuOpen(null)
                    }}
                    className={MENU_ROW}
                  >
                    <ArrowLeftRight aria-hidden />
                    Compact columns
                  </button>
                  <button
                    data-menu-row
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setColumnWidths({
                        ...(initialColumnWidthsRef.current ??
                          DEFAULT_COLUMN_WIDTHS),
                      })
                      setTableMenuOpen(null)
                    }}
                    className={MENU_ROW}
                  >
                    <RotateCcw aria-hidden />
                    Reset column widths
                  </button>
                  <div role="separator" className="my-1 h-px bg-border" />
                  <button
                    data-menu-row
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setSelected(new Set())
                      setTableMenuOpen(null)
                    }}
                    className={MENU_ROW}
                  >
                    <X aria-hidden />
                    Clear selection
                  </button>
                </GlideMenu>
              </div>
            )}
          </>,
          document.body
        )}
    </div>
  )
}
