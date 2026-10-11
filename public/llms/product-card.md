# Product Card

Product card and responsive grid with price, compare-at price, text badges, rating slot and an out-of-stock state.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/product-card
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ProductCard, ProductGrid } from "@/components/ui/product-card"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`, `@opendraft/button`, `@opendraft/empty-state`

## Props and types

```ts
export type ProductCardLabels = {
  /** Badge shown when `isNew` is set. */
  new: string
  /** Badge shown when `compareAtPrice` is higher than `price`. */
  sale: string
  soldOut: string
  /** Button text; the product title is appended to the accessible name. */
  add: string
  /** Screen-reader text before the original price. */
  was: string
  /** Screen-reader text before the current price. */
  now: string
  /** Shown in the image area when there is no image. */
  noImage: string
}

export type ProductBadge = {
  label: string
  variant?: "default" | "secondary" | "outline" | "brand" | "success"
}

export type ProductCardProps = Omit<
  React.ComponentProps<"article">,
  "title" | "onSelect"
> & {
  title: string
  subtitle?: React.ReactNode
  /** Plain `<img>`; works in any React app. Ignored when `renderImage` is set. */
  image?: { src: string; alt: string; srcSet?: string; sizes?: string }
  /** Replaces the `<img>`, e.g. to render your framework's image component. */
  renderImage?: (props: { className: string }) => React.ReactNode
  price: number
  compareAtPrice?: number
  /** ISO 4217 code used with Intl when `formatValue` is not given. */
  currency?: string
  locale?: string
  /** Full control of price text. Overrides `currency` and `locale`. */
  formatValue?: (value: number) => string
  isNew?: boolean
  /** Extra badges (e.g. "Low stock", "Refurbished"). Text, never color alone. */
  badges?: ProductBadge[]
  /** Slot under the subtitle: stars, review count, any rating UI. */
  rating?: React.ReactNode
  /** Extra content under the price (swatches, stock note, delivery). */
  meta?: React.ReactNode
  outOfStock?: boolean
  onAdd?: () => void
  /** Makes the whole card activatable through the title. */
  onSelect?: () => void
  /** Renders the title as a link instead of a button. Takes priority over `onSelect`. */
  href?: string
  labels?: Partial<ProductCardLabels>
}

export type ProductGridLabels = {
  emptyTitle: string
  emptyDescription: string
}

export type ProductGridProps = React.ComponentProps<"div"> & {
  /** Label for the list, read by screen readers. */
  "aria-label"?: string
  /** Shown instead of the grid when there are no children. */
  empty?: React.ReactNode
  labels?: Partial<ProductGridLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { ProductCard, ProductGrid } from "@/components/ui/product-card"

function art(label: string, shade: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="hsl(220 8% ${shade}%)"/><text x="200" y="256" font-family="monospace" font-size="20" text-anchor="middle" fill="hsl(220 8% 40%)">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function Rating({ value, count }: { value: number; count: number }) {
  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <Star aria-hidden className="size-3 fill-current" />
      <span className="font-mono">
        <span className="sr-only">Rated </span>
        {value.toFixed(1)}
        <span className="sr-only"> out of 5, </span> ({count})
      </span>
    </p>
  )
}

const apparel = [
  {
    id: 1,
    title: "Linen overshirt",
    subtitle: "Sand, 6 sizes",
    price: 89,
    was: 120,
    isNew: false,
    rating: [4.6, 128] as const,
  },
  {
    id: 2,
    title: "Wool crew sweater",
    subtitle: "Charcoal",
    price: 110,
    isNew: true,
    rating: [4.8, 41] as const,
  },
  {
    id: 3,
    title: "Canvas tote",
    subtitle: "One size",
    price: 38,
    out: true,
    rating: [4.2, 9] as const,
  },
  {
    id: 4,
    title: "Selvedge jeans",
    subtitle: "Indigo, straight",
    price: 145,
    rating: [4.7, 76] as const,
  },
]

const electronics = [
  {
    id: 1,
    title: "Noise-cancelling headphones",
    subtitle: "40 h battery",
    price: 249.99,
    was: 299.99,
    rating: [4.5, 2310] as const,
  },
  {
    id: 2,
    title: "27-inch 4K monitor",
    subtitle: "USB-C, 60 W",
    price: 429,
    isNew: true,
    rating: [4.4, 318] as const,
  },
  {
    id: 3,
    title: "Mechanical keyboard",
    subtitle: "Hot-swap switches",
    price: 129,
    out: true,
    rating: [4.9, 87] as const,
  },
]

export default function ProductCardDemo() {
  const [added, setAdded] = React.useState<string | null>(null)

  return (
    <div className="flex w-full flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="eyebrow">Apparel store</h3>
        <ProductGrid aria-label="Apparel">
          {apparel.map((p, i) => (
            <ProductCard
              key={p.id}
              title={p.title}
              subtitle={p.subtitle}
              image={{
                src: art(p.title, 90 - i * 4),
                alt: `${p.title}, product photo`,
              }}
              price={p.price}
              compareAtPrice={p.was}
              currency="GBP"
              locale="en-GB"
              isNew={p.isNew}
              outOfStock={p.out}
              rating={<Rating value={p.rating[0]} count={p.rating[1]} />}
              onAdd={() => setAdded(p.title)}
              onSelect={() => setAdded(`Opened ${p.title}`)}
            />
          ))}
        </ProductGrid>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="eyebrow">Electronics</h3>
        <ProductGrid aria-label="Electronics">
          {electronics.map((p, i) => (
            <ProductCard
              key={p.id}
              title={p.title}
              subtitle={p.subtitle}
              image={{ src: art(p.title, 86 - i * 4), alt: p.title }}
              price={p.price}
              compareAtPrice={p.was}
              currency="USD"
              locale="en-US"
              isNew={p.isNew}
              outOfStock={p.out}
              badges={i === 0 ? [{ label: "Free shipping" }] : undefined}
              rating={<Rating value={p.rating[0]} count={p.rating[1]} />}
              labels={{ add: "Add to cart", soldOut: "Sold out" }}
              onAdd={() => setAdded(p.title)}
            />
          ))}
        </ProductGrid>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="eyebrow">Empty</h3>
        <ProductGrid
          labels={{
            emptyTitle: "No results",
            emptyDescription: "Try fewer filters.",
          }}
        />
      </section>

      <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
        {added ? `Last action: ${added}` : "Press Add or a title."}
      </p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/product-card. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
