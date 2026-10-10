# Catalog

Browse and discovery screen: featured band, search, category chips, sort, price filter, availability switch, card grid, active filters, empty state and loading skeleton. Data shape: Event-shaped items (host, date, capacity, remaining). Not a retail product grid.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/catalog
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Catalog } from "@/components/blocks/catalog"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/badge`, `@opendraft/input`, `@opendraft/select`, `@opendraft/switch`, `@opendraft/progress`, `@opendraft/skeleton`, `@opendraft/empty-state`

## Props and types

```ts
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
```

## Example

```tsx
import { Catalog } from "@/components/blocks/catalog"

export default function CatalogDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <Catalog />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/catalog. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
