"use client"

import * as React from "react"
import {
  Heart,
  Image as ImageIcon,
  MapPin,
  Search,
  SearchX,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

export type CatalogItem = {
  id: string
  title: string
  host: string
  /** Venue or city, shown on cards and the featured band. */
  location?: string
  category: string
  /** ISO date (YYYY-MM-DD). Used for sorting and the date block. */
  date: string
  /** Price in whole units of the catalog `currency`. 0 renders as the free label. */
  price: number
  capacity: number
  /** Places left. 0 means sold out. */
  remaining: number
  image?: string
  favourite?: boolean
  featured?: boolean
}

export type CatalogProps = {
  items?: CatalogItem[]
  categories?: string[]
  onSelect?: (item: CatalogItem) => void
  onFavourite?: (id: string, next: boolean) => void
  /** Show a skeleton instead of the grid. */
  loading?: boolean
  title?: string
  eyebrow?: string
  /** ISO 4217 code used for every price and the default price filter. */
  currency?: string
  /** Price filter buckets (min and max both inclusive). Defaults are computed in `currency`. */
  priceRanges?: CatalogPriceRange[]
  /** "cards" is a grid; "compact" is a list-style row per item. */
  layout?: "cards" | "compact"
  /** Override any fixed copy. */
  labels?: Partial<CatalogLabels>
  className?: string
}

export type CatalogPriceRange = { label: string; min?: number; max?: number }

export type CatalogLabels = {
  /** Prefix before the host on the featured band. Empty string for none. */
  hostLabel: string
  placesLeft: string
  placesValue: (remaining: number, capacity: number) => string
  soldOut: string
  sellingFast: string
  free: string
  all: string
  featured: string
  viewDetails: string
  searchLabel: string
  searchPlaceholder: string
  categoryGroup: string
  sortBy: string
  sortRelevance: string
  sortPriceAsc: string
  sortPriceDesc: string
  sortDate: string
  price: string
  anyPrice: string
  hideSoldOut: string
  hidingSoldOut: string
  active: string
  clear: string
  loading: string
  results: (shown: number, total: number) => string
  emptyTitle: string
  emptyDescription: string
  clearFilters: string
}

export const SAMPLE_CATALOG_CATEGORIES = [
  "Design",
  "Engineering",
  "Writing",
  "Business",
]

export const SAMPLE_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "w1",
    title: "Typography for Interfaces",
    host: "Amara Lindqvist",
    location: "Studio 4, Lisbon",
    category: "Design",
    date: "2026-11-04",
    price: 180,
    capacity: 24,
    remaining: 3,
    featured: true,
  },
  {
    id: "w2",
    title: "Reliable Systems in Practice",
    host: "Jonas Whitfield",
    location: "Online",
    category: "Engineering",
    date: "2026-11-11",
    price: 240,
    capacity: 30,
    remaining: 18,
  },
  {
    id: "w3",
    title: "Clear Writing for Product Teams",
    host: "Priya Raman",
    category: "Writing",
    date: "2026-11-18",
    price: 95,
    capacity: 40,
    remaining: 26,
  },
  {
    id: "w4",
    title: "Pricing and Packaging Basics",
    host: "Marcus Oyelaran",
    category: "Business",
    date: "2026-11-20",
    price: 140,
    capacity: 20,
    remaining: 0,
  },
  {
    id: "w5",
    title: "Design Systems from Scratch",
    host: "Elena Marchetti",
    category: "Design",
    date: "2026-12-02",
    price: 320,
    capacity: 16,
    remaining: 5,
  },
  {
    id: "w6",
    title: "Testing Without the Tears",
    host: "Tomas Berg",
    category: "Engineering",
    date: "2026-12-09",
    price: 0,
    capacity: 60,
    remaining: 41,
  },
  {
    id: "w7",
    title: "Interview Writing Lab",
    host: "Hana Kobayashi",
    category: "Writing",
    date: "2026-12-12",
    price: 60,
    capacity: 18,
    remaining: 2,
  },
  {
    id: "w8",
    title: "Running a Small Studio",
    host: "Diego Alvarez",
    category: "Business",
    date: "2027-01-14",
    price: 210,
    capacity: 25,
    remaining: 14,
  },
  {
    id: "w9",
    title: "Motion Principles for the Web",
    host: "Sofia Andersson",
    category: "Design",
    date: "2027-01-21",
    price: 160,
    capacity: 22,
    remaining: 0,
  },
]

type SortKey = "relevance" | "price-asc" | "price-desc" | "date"

export const DEFAULT_CATALOG_LABELS: CatalogLabels = {
  hostLabel: "Hosted by",
  placesLeft: "Places left",
  placesValue: (remaining, capacity) => `${remaining} of ${capacity}`,
  soldOut: "Sold out",
  sellingFast: "Selling fast",
  free: "Free",
  all: "All",
  featured: "Featured",
  viewDetails: "View details",
  searchLabel: "Search the catalog",
  searchPlaceholder: "Search by title, host or category",
  categoryGroup: "Filter by category",
  sortBy: "Sort by",
  sortRelevance: "Relevance",
  sortPriceAsc: "Price: low to high",
  sortPriceDesc: "Price: high to low",
  sortDate: "Date: soonest",
  price: "Price",
  anyPrice: "Any price",
  hideSoldOut: "Hide sold out",
  hidingSoldOut: "Hiding sold out",
  active: "Active",
  clear: "Clear",
  loading: "Loading",
  results: (shown, total) => `${shown} of ${total} results`,
  emptyTitle: "Nothing matches",
  emptyDescription: "Try a different search or loosen the filters.",
  clearFilters: "Clear filters",
}

const monthFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
})
const dayFmt = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  timeZone: "UTC",
})

function makeMoney(currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    })
  }
}

function defaultPriceRanges(
  money: Intl.NumberFormat,
  L: CatalogLabels
): CatalogPriceRange[] {
  return [
    { label: L.free, max: 0 },
    { label: `Under ${money.format(100)}`, min: 0.01, max: 99.99 },
    {
      label: `${money.format(100)} to ${money.format(250)}`,
      min: 100,
      max: 250,
    },
    { label: `Over ${money.format(250)}`, min: 250.01 },
  ]
}

function inRange(price: number, r: CatalogPriceRange | undefined) {
  if (!r) return true
  if (r.min !== undefined && price < r.min) return false
  if (r.max !== undefined && price > r.max) return false
  return true
}

function relevance(item: CatalogItem, q: string) {
  if (!q) return 0
  const t = item.title.toLowerCase()
  let score = 0
  if (t.startsWith(q)) score += 3
  if (t.includes(q)) score += 2
  if (item.host.toLowerCase().includes(q)) score += 1
  if (item.category.toLowerCase().includes(q)) score += 1
  if (item.location?.toLowerCase().includes(q)) score += 1
  return score
}

function status(item: CatalogItem) {
  if (item.remaining <= 0) return "sold-out" as const
  if (item.remaining / Math.max(item.capacity, 1) <= 0.25)
    return "selling-fast" as const
  return "open" as const
}

function Media({ item, className }: { item: CatalogItem; className?: string }) {
  return (
    <div
      data-slot="catalog-media"
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted bg-dots text-muted-foreground",
        className
      )}
    >
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <ImageIcon aria-hidden className="size-6" />
      )}
    </div>
  )
}

function DateBlock({ date, className }: { date: string; className?: string }) {
  const d = new Date(date)
  return (
    <time
      dateTime={date}
      className={cn(
        "flex w-11 shrink-0 flex-col items-center border py-1 font-mono tabular-nums",
        className
      )}
    >
      <span className="eyebrow">{monthFmt.format(d)}</span>
      <span className="text-base leading-tight text-foreground">
        {dayFmt.format(d)}
      </span>
    </time>
  )
}

function Location({
  value,
  className,
}: {
  value?: string
  className?: string
}) {
  if (!value) return null
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1", className)}>
      <MapPin aria-hidden className="size-3 shrink-0" />
      <span className="truncate">{value}</span>
    </span>
  )
}

function StatusBadge({
  item,
  labels,
}: {
  item: CatalogItem
  labels: CatalogLabels
}) {
  const s = status(item)
  if (s === "open") return null
  return (
    <Badge
      variant={s === "sold-out" ? "secondary" : "warning"}
      className="bg-background/90"
    >
      {s === "sold-out" ? labels.soldOut : labels.sellingFast}
    </Badge>
  )
}

function FavouriteButton({
  item,
  on,
  onToggle,
  className,
}: {
  item: CatalogItem
  on: boolean
  onToggle: (next: boolean) => void
  className?: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-pressed={on}
      aria-label={`Save ${item.title}`}
      onClick={() => onToggle(!on)}
      className={cn("bg-background/90", on && "text-destructive", className)}
    >
      <Heart className={cn(on && "fill-current")} />
    </Button>
  )
}

function CardSkeleton({ compact }: { compact?: boolean }) {
  if (compact)
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <Skeleton className="h-12 w-11" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
    )
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-2 h-1.5 w-full" />
      </div>
    </div>
  )
}

function Catalog({
  items = SAMPLE_CATALOG_ITEMS,
  categories = SAMPLE_CATALOG_CATEGORIES,
  onSelect,
  onFavourite,
  loading = false,
  title = "Workshops and courses",
  eyebrow = "Catalog",
  currency = "USD",
  priceRanges,
  layout = "cards",
  labels: labelsProp,
  className,
}: CatalogProps) {
  const uid = React.useId()
  const L: CatalogLabels = { ...DEFAULT_CATALOG_LABELS, ...labelsProp }
  const money = React.useMemo(() => makeMoney(currency), [currency])
  const formatPrice = (price: number) =>
    price <= 0 ? L.free : money.format(price)
  const ranges = priceRanges ?? defaultPriceRanges(money, L)
  const compact = layout === "compact"

  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string | null>(null)
  const [sort, setSort] = React.useState<SortKey>("relevance")
  const [price, setPrice] = React.useState<string>("any")
  const [hideSoldOut, setHideSoldOut] = React.useState(false)
  const [favourites, setFavourites] = React.useState<Record<string, boolean>>(
    {}
  )

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "relevance", label: L.sortRelevance },
    { value: "price-asc", label: L.sortPriceAsc },
    { value: "price-desc", label: L.sortPriceDesc },
    { value: "date", label: L.sortDate },
  ]

  const isFav = (item: CatalogItem) => favourites[item.id] ?? !!item.favourite
  const toggleFav = (item: CatalogItem, next: boolean) => {
    setFavourites((f) => ({ ...f, [item.id]: next }))
    onFavourite?.(item.id, next)
  }

  const q = query.trim().toLowerCase()
  const activeRange = price === "any" ? undefined : ranges[Number(price)]

  const results = (() => {
    const list = items.filter((item) => {
      if (category && item.category !== category) return false
      if (hideSoldOut && item.remaining <= 0) return false
      if (!inRange(item.price, activeRange)) return false
      if (q && relevance(item, q) === 0) return false
      return true
    })
    const indexed = list.map((item, i) => ({ item, i }))
    indexed.sort((a, b) => {
      let d = 0
      if (sort === "price-asc") d = a.item.price - b.item.price
      else if (sort === "price-desc") d = b.item.price - a.item.price
      else if (sort === "date") d = a.item.date.localeCompare(b.item.date)
      else d = relevance(b.item, q) - relevance(a.item, q)
      return d || a.i - b.i
    })
    return indexed.map((x) => x.item)
  })()

  const featured = items.find((i) => i.featured) ?? null

  const activeFilters: { key: string; label: string; clear: () => void }[] = []
  if (query.trim())
    activeFilters.push({
      key: "q",
      label: `"${query.trim()}"`,
      clear: () => setQuery(""),
    })
  if (category)
    activeFilters.push({
      key: "cat",
      label: category,
      clear: () => setCategory(null),
    })
  if (activeRange)
    activeFilters.push({
      key: "price",
      label: activeRange.label,
      clear: () => setPrice("any"),
    })
  if (hideSoldOut)
    activeFilters.push({
      key: "avail",
      label: L.hidingSoldOut,
      clear: () => setHideSoldOut(false),
    })

  const clearAll = () => {
    setQuery("")
    setCategory(null)
    setPrice("any")
    setHideSoldOut(false)
  }

  const gridClass = compact
    ? "flex flex-col gap-2"
    : "grid grid-cols-1 gap-4 @md/catalog:grid-cols-2 @3xl/catalog:grid-cols-3"

  return (
    <div
      data-slot="catalog"
      className={cn(
        "@container/catalog h-full min-h-0 w-full overflow-y-auto bg-background text-foreground",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 @md/catalog:px-6 @3xl/catalog:py-8">
        <header className="flex flex-col gap-1.5">
          <span className="eyebrow">{eyebrow}</span>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="heading text-3xl @md/catalog:text-4xl">{title}</h2>
            <p
              aria-live="polite"
              className="font-mono text-xs text-muted-foreground tabular-nums"
            >
              {loading ? L.loading : L.results(results.length, items.length)}
            </p>
          </div>
        </header>

        {featured && (
          <section
            aria-label={L.featured}
            className="dark overflow-hidden rounded-lg border bg-background text-foreground"
          >
            <div
              className={cn(
                "grid",
                (loading || featured.image) && "@3xl/catalog:grid-cols-2"
              )}
            >
              {loading ? (
                <>
                  <Skeleton className="min-h-48 rounded-none" />
                  <div className="flex flex-col gap-3 p-6">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </>
              ) : (
                <>
                  {featured.image && (
                    <Media
                      item={featured}
                      className="min-h-48 @3xl/catalog:min-h-72"
                    />
                  )}
                  <div className="flex flex-col justify-between gap-6 p-6 @3xl/catalog:p-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="eyebrow">{L.featured}</span>
                        <StatusBadge item={featured} labels={L} />
                      </div>
                      <div className="flex items-start gap-4">
                        <DateBlock date={featured.date} className="w-12" />
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <h3 className="heading text-3xl @3xl/catalog:text-4xl">
                            {featured.title}
                          </h3>
                          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                            <span>
                              {L.hostLabel ? `${L.hostLabel} ` : ""}
                              {featured.host}
                            </span>
                            {featured.location && (
                              <>
                                <span aria-hidden>·</span>
                                <Location value={featured.location} />
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="font-mono text-2xl tabular-nums">
                        {formatPrice(featured.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <FavouriteButton
                          item={featured}
                          on={isFav(featured)}
                          onToggle={(n) => toggleFav(featured, n)}
                        />
                        <Button
                          type="button"
                          disabled={featured.remaining <= 0}
                          onClick={() => onSelect?.(featured)}
                        >
                          {featured.remaining <= 0 ? L.soldOut : L.viewDetails}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-4" role="search">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              aria-label={L.searchLabel}
              placeholder={L.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div
            role="group"
            aria-label={L.categoryGroup}
            className="flex flex-wrap gap-2"
          >
            {[null, ...categories].map((c) => {
              const pressed = category === c
              return (
                <Button
                  key={c ?? "all"}
                  type="button"
                  size="sm"
                  variant={pressed ? "ink" : "outline"}
                  aria-pressed={pressed}
                  onClick={() => setCategory(c)}
                >
                  {c ?? L.all}
                </Button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-sort`} className="eyebrow">
                {L.sortBy}
              </label>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger id={`${uid}-sort`} className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-price`} className="eyebrow">
                {L.price}
              </label>
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger id={`${uid}-price`} className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">{L.anyPrice}</SelectItem>
                  {ranges.map((r, i) => (
                    <SelectItem key={`${i}-${r.label}`} value={String(i)}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex h-9 items-center gap-2">
              <Switch
                id={`${uid}-avail`}
                checked={hideSoldOut}
                onCheckedChange={setHideSoldOut}
              />
              <label htmlFor={`${uid}-avail`} className="text-sm">
                {L.hideSoldOut}
              </label>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div
              aria-label="Active filters"
              className="flex flex-wrap items-center gap-2 border-t pt-4"
            >
              <span className="eyebrow">{L.active}</span>
              {activeFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={f.clear}
                  aria-label={`Remove filter ${f.label}`}
                  className="inline-flex h-7 items-center gap-1.5 rounded-sm border bg-surface px-2 text-xs outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
                >
                  {f.label}
                  <X aria-hidden className="size-3 text-muted-foreground" />
                </button>
              ))}
              <Button type="button" variant="link" size="xs" onClick={clearAll}>
                {L.clear}
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div
            aria-busy="true"
            aria-label="Loading results"
            className={gridClass}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} compact={compact} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            live
            bordered
            icon={<SearchX />}
            title={L.emptyTitle}
            description={L.emptyDescription}
            action={
              <Button type="button" variant="outline" onClick={clearAll}>
                {L.clearFilters}
              </Button>
            }
          />
        ) : (
          <ul className={gridClass}>
            {results.map((item) => {
              const s = status(item)
              const soldOut = s === "sold-out"
              const select = (
                <button
                  type="button"
                  onClick={() => onSelect?.(item)}
                  className="text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
                >
                  {item.title}
                </button>
              )
              const itemClass = cn(
                "group relative flex overflow-hidden rounded-lg border bg-card transition-colors focus-within:border-brand/60 hover:border-foreground/25",
                !compact && "flex-col",
                soldOut && "text-muted-foreground"
              )

              if (compact)
                return (
                  <li
                    key={item.id}
                    className={cn(itemClass, "items-center gap-3 p-3")}
                  >
                    <DateBlock date={item.date} />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <h3 className="text-base leading-snug font-medium text-foreground">
                        {select}
                      </h3>
                      <p className="flex min-w-0 items-center gap-x-1.5 text-sm text-muted-foreground">
                        <span className="truncate">
                          {item.host}
                          <span aria-hidden> · </span>
                          {item.category}
                        </span>
                        {item.location && (
                          <>
                            <span
                              aria-hidden
                              className="hidden @md/catalog:inline"
                            >
                              ·
                            </span>
                            <Location
                              value={item.location}
                              className="hidden @md/catalog:inline-flex"
                            />
                          </>
                        )}
                      </p>
                    </div>
                    <div className="hidden w-32 shrink-0 @xl/catalog:block">
                      <Progress
                        size="sm"
                        tone="auto"
                        invert
                        value={item.remaining}
                        max={item.capacity}
                        aria-label={`${L.placesLeft}: ${item.title}`}
                        label={L.placesLeft}
                        valueLabel={L.placesValue(
                          item.remaining,
                          item.capacity
                        )}
                      />
                    </div>
                    <StatusBadge item={item} labels={L} />
                    <span className="shrink-0 font-mono text-base text-foreground tabular-nums">
                      {formatPrice(item.price)}
                    </span>
                    <FavouriteButton
                      item={item}
                      on={isFav(item)}
                      onToggle={(n) => toggleFav(item, n)}
                      className="relative z-10 shrink-0"
                    />
                  </li>
                )

              return (
                <li key={item.id} className={itemClass}>
                  {item.image && (
                    <div className="relative">
                      <Media
                        item={item}
                        className={cn(
                          "aspect-[16/10]",
                          soldOut && "opacity-70"
                        )}
                      />
                      <div className="absolute top-3 left-3">
                        <StatusBadge item={item} labels={L} />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    {!item.image && s !== "open" && (
                      <div>
                        <StatusBadge item={item} labels={L} />
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <DateBlock date={item.date} />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <h3 className="text-base leading-snug font-medium text-foreground">
                          {select}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.host}
                          <span aria-hidden> · </span>
                          {item.category}
                        </p>
                        <Location
                          value={item.location}
                          className="text-sm text-muted-foreground"
                        />
                      </div>
                    </div>
                    <Progress
                      className="mt-auto"
                      size="sm"
                      tone="auto"
                      invert
                      value={item.remaining}
                      max={item.capacity}
                      aria-label={`${L.placesLeft}: ${item.title}`}
                      label={L.placesLeft}
                      valueLabel={L.placesValue(item.remaining, item.capacity)}
                    />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg text-foreground tabular-nums">
                        {formatPrice(item.price)}
                      </span>
                      <FavouriteButton
                        item={item}
                        on={isFav(item)}
                        onToggle={(n) => toggleFav(item, n)}
                        className="relative z-10"
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export { Catalog }
