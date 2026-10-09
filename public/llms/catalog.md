# Catalog

Browse and discovery screen: featured band, search, category chips, sort, price filter, availability switch, card grid, active filters, empty state and loading skeleton.

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
