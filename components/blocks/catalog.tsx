"use client"

import * as React from "react"
import { Heart, Image as ImageIcon, Search, SearchX, X } from "lucide-react"

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
  category: string
  /** ISO date (YYYY-MM-DD). Used for sorting and the date block. */
  date: string
  /** Price in whole currency units. 0 renders as "Free". */
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
  className?: string
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
type PriceKey = "any" | "free" | "under-100" | "100-250" | "over-250"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "date", label: "Date: soonest" },
]

const PRICE_OPTIONS: { value: PriceKey; label: string }[] = [
  { value: "any", label: "Any price" },
  { value: "free", label: "Free" },
  { value: "under-100", label: "Under $100" },
  { value: "100-250", label: "$100 to $250" },
  { value: "over-250", label: "Over $250" },
]

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const monthFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
})
const dayFmt = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  timeZone: "UTC",
})
const longFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

function formatPrice(price: number) {
  return price <= 0 ? "Free" : money.format(price)
}

function inPriceRange(price: number, key: PriceKey) {
  switch (key) {
    case "free":
      return price <= 0
    case "under-100":
      return price > 0 && price < 100
    case "100-250":
      return price >= 100 && price <= 250
    case "over-250":
      return price > 250
    default:
      return true
  }
}

function relevance(item: CatalogItem, q: string) {
  if (!q) return 0
  const t = item.title.toLowerCase()
  let score = 0
  if (t.startsWith(q)) score += 3
  if (t.includes(q)) score += 2
  if (item.host.toLowerCase().includes(q)) score += 1
  if (item.category.toLowerCase().includes(q)) score += 1
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

function StatusBadge({ item }: { item: CatalogItem }) {
  const s = status(item)
  if (s === "open") return null
  return (
    <Badge
      variant={s === "sold-out" ? "secondary" : "warning"}
      className="bg-background/90"
    >
      {s === "sold-out" ? "Sold out" : "Selling fast"}
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

function CardSkeleton() {
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
  className,
}: CatalogProps) {
  const uid = React.useId()
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string | null>(null)
  const [sort, setSort] = React.useState<SortKey>("relevance")
  const [price, setPrice] = React.useState<PriceKey>("any")
  const [hideSoldOut, setHideSoldOut] = React.useState(false)
  const [favourites, setFavourites] = React.useState<Record<string, boolean>>(
    {}
  )

  const isFav = (item: CatalogItem) => favourites[item.id] ?? !!item.favourite
  const toggleFav = (item: CatalogItem, next: boolean) => {
    setFavourites((f) => ({ ...f, [item.id]: next }))
    onFavourite?.(item.id, next)
  }

  const q = query.trim().toLowerCase()

  const results = React.useMemo(() => {
    const list = items.filter((item) => {
      if (category && item.category !== category) return false
      if (hideSoldOut && item.remaining <= 0) return false
      if (!inPriceRange(item.price, price)) return false
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
  }, [items, category, hideSoldOut, price, q, sort])

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
  if (price !== "any")
    activeFilters.push({
      key: "price",
      label: PRICE_OPTIONS.find((o) => o.value === price)?.label ?? price,
      clear: () => setPrice("any"),
    })
  if (hideSoldOut)
    activeFilters.push({
      key: "avail",
      label: "Hiding sold out",
      clear: () => setHideSoldOut(false),
    })

  const clearAll = () => {
    setQuery("")
    setCategory(null)
    setPrice("any")
    setHideSoldOut(false)
  }

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
              {loading
                ? "Loading"
                : `${results.length} of ${items.length} results`}
            </p>
          </div>
        </header>

        {featured && (
          <section
            aria-label="Featured"
            className="dark overflow-hidden rounded-lg border bg-background text-foreground"
          >
            <div className="grid @3xl/catalog:grid-cols-2">
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
                  <Media
                    item={featured}
                    className="min-h-48 @3xl/catalog:min-h-72"
                  />
                  <div className="flex flex-col justify-between gap-6 p-6 @3xl/catalog:p-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="eyebrow">Featured</span>
                        <StatusBadge item={featured} />
                      </div>
                      <h3 className="heading text-3xl @3xl/catalog:text-4xl">
                        {featured.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Hosted by {featured.host}
                        <span aria-hidden> · </span>
                        <time
                          dateTime={featured.date}
                          className="font-mono tabular-nums"
                        >
                          {longFmt.format(new Date(featured.date))}
                        </time>
                      </p>
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
                          {featured.remaining <= 0
                            ? "Sold out"
                            : "View details"}
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
              aria-label="Search the catalog"
              placeholder="Search by title, host or category"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div
            role="group"
            aria-label="Filter by category"
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
                  {c ?? "All"}
                </Button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-sort`} className="eyebrow">
                Sort by
              </label>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger id={`${uid}-sort`} className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-price`} className="eyebrow">
                Price
              </label>
              <Select
                value={price}
                onValueChange={(v) => setPrice(v as PriceKey)}
              >
                <SelectTrigger id={`${uid}-price`} className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
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
                Hide sold out
              </label>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div
              aria-label="Active filters"
              className="flex flex-wrap items-center gap-2 border-t pt-4"
            >
              <span className="eyebrow">Active</span>
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
                Clear
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div
            aria-busy="true"
            aria-label="Loading results"
            className="grid grid-cols-1 gap-4 @md/catalog:grid-cols-2 @3xl/catalog:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            live
            bordered
            icon={<SearchX />}
            title="Nothing matches"
            description="Try a different search or loosen the filters."
            action={
              <Button type="button" variant="outline" onClick={clearAll}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 @md/catalog:grid-cols-2 @3xl/catalog:grid-cols-3">
            {results.map((item) => {
              const s = status(item)
              const soldOut = s === "sold-out"
              return (
                <li
                  key={item.id}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-colors focus-within:border-brand/60 hover:border-foreground/25",
                    soldOut && "text-muted-foreground"
                  )}
                >
                  <div className="relative">
                    <Media
                      item={item}
                      className={cn("aspect-[16/10]", soldOut && "opacity-70")}
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge item={item} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start gap-3">
                      <time
                        dateTime={item.date}
                        className="flex w-11 shrink-0 flex-col items-center border py-1 font-mono tabular-nums"
                      >
                        <span className="eyebrow">
                          {monthFmt.format(new Date(item.date))}
                        </span>
                        <span className="text-base leading-tight text-foreground">
                          {dayFmt.format(new Date(item.date))}
                        </span>
                      </time>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <h3 className="text-base leading-snug font-medium text-foreground">
                          <button
                            type="button"
                            onClick={() => onSelect?.(item)}
                            className="text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
                          >
                            {item.title}
                          </button>
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                          {item.host}
                          <span aria-hidden> · </span>
                          {item.category}
                        </p>
                      </div>
                    </div>
                    <Progress
                      className="mt-auto"
                      size="sm"
                      tone="auto"
                      invert
                      value={item.remaining}
                      max={item.capacity}
                      aria-label={`Availability for ${item.title}`}
                      label="Places left"
                      valueLabel={`${item.remaining} of ${item.capacity}`}
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
