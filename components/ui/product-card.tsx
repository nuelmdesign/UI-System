import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

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

export const DEFAULT_PRODUCT_CARD_LABELS: ProductCardLabels = {
  new: "New",
  sale: "Sale",
  soldOut: "Out of stock",
  add: "Add",
  was: "Was",
  now: "Now",
  noImage: "No image",
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

function makeFormatter(
  currency?: string,
  locale?: string,
  formatValue?: (value: number) => string
) {
  if (formatValue) return formatValue
  const nf = new Intl.NumberFormat(
    locale,
    currency ? { style: "currency", currency } : undefined
  )
  return (value: number) => nf.format(value)
}

function ProductCard({
  title,
  subtitle,
  image,
  renderImage,
  price,
  compareAtPrice,
  currency,
  locale,
  formatValue,
  isNew = false,
  badges = [],
  rating,
  meta,
  outOfStock = false,
  onAdd,
  onSelect,
  href,
  labels: labelsProp,
  className,
  ...props
}: ProductCardProps) {
  const labels = { ...DEFAULT_PRODUCT_CARD_LABELS, ...labelsProp }
  const format = makeFormatter(currency, locale, formatValue)
  const onSale = compareAtPrice !== undefined && compareAtPrice > price
  const imageClass = cn(
    "size-full object-cover transition-opacity",
    outOfStock && "opacity-50"
  )
  const titleClass =
    "heading text-lg leading-snug outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline focus-visible:underline-offset-4"

  return (
    <article
      data-slot="product-card"
      data-out-of-stock={outOfStock ? "" : undefined}
      className={cn(
        "group/product relative flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-3 text-card-foreground transition-colors focus-within:ring-[3px] focus-within:ring-ring hover:border-foreground/25",
        className
      )}
      {...props}
    >
      <div
        data-slot="product-card-media"
        className="relative aspect-[4/5] overflow-hidden rounded-md border bg-surface"
      >
        {renderImage ? (
          renderImage({ className: imageClass })
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={image.sizes}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className={imageClass}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-dots">
            <span className="eyebrow text-muted-foreground">
              {labels.noImage}
            </span>
          </div>
        )}
        {(isNew || onSale || outOfStock || badges.length > 0) && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {outOfStock && <Badge variant="secondary">{labels.soldOut}</Badge>}
            {isNew && <Badge variant="brand">{labels.new}</Badge>}
            {onSale && <Badge variant="success">{labels.sale}</Badge>}
            {badges.map((b) => (
              <Badge key={b.label} variant={b.variant ?? "outline"}>
                {b.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 data-slot="product-card-title" className="min-w-0">
          {href ? (
            <a href={href} className={titleClass}>
              {title}
            </a>
          ) : onSelect ? (
            <button
              type="button"
              onClick={onSelect}
              className={cn(titleClass, "text-left")}
            >
              {title}
            </button>
          ) : (
            title
          )}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {rating && <div data-slot="product-card-rating">{rating}</div>}
        <p
          data-slot="product-card-price"
          className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1 font-mono text-sm"
        >
          {onSale && <span className="sr-only">{labels.now}</span>}
          <span className="font-medium">{format(price)}</span>
          {onSale && (
            <>
              <span className="sr-only">{labels.was}</span>
              <s className="text-muted-foreground">{format(compareAtPrice)}</s>
            </>
          )}
        </p>
        {meta}
      </div>

      {onAdd && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={outOfStock}
          onClick={onAdd}
          aria-label={`${labels.add}: ${title}`}
          className="relative z-10 w-full"
        >
          {outOfStock ? labels.soldOut : labels.add}
        </Button>
      )}
    </article>
  )
}

export type ProductGridLabels = {
  emptyTitle: string
  emptyDescription: string
}

export const DEFAULT_PRODUCT_GRID_LABELS: ProductGridLabels = {
  emptyTitle: "Nothing to show",
  emptyDescription: "No items match the current filters.",
}

export type ProductGridProps = React.ComponentProps<"div"> & {
  /** Label for the list, read by screen readers. */
  "aria-label"?: string
  /** Shown instead of the grid when there are no children. */
  empty?: React.ReactNode
  labels?: Partial<ProductGridLabels>
}

/** Container-query grid: 1 to 4 columns by the width it is given, not the viewport. */
function ProductGrid({
  empty,
  labels: labelsProp,
  className,
  children,
  ...props
}: ProductGridProps) {
  const labels = { ...DEFAULT_PRODUCT_GRID_LABELS, ...labelsProp }
  const items = React.Children.toArray(children)

  return (
    <div data-slot="product-grid" className="@container/product-grid w-full">
      {items.length === 0 ? (
        (empty ?? (
          <EmptyState
            live
            bordered
            title={labels.emptyTitle}
            description={labels.emptyDescription}
          />
        ))
      ) : (
        <ul
          className={cn(
            "grid grid-cols-1 gap-4 @sm/product-grid:grid-cols-2 @3xl/product-grid:grid-cols-3 @5xl/product-grid:grid-cols-4",
            className
          )}
          {...(props as React.ComponentProps<"ul">)}
        >
          {items.map((child, i) => (
            <li key={i} className="flex min-w-0 [&>*]:w-full">
              {child}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { ProductCard, ProductGrid }
