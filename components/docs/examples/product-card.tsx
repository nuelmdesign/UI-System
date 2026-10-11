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
