# Rating

Star rating display and input with half steps, plus a distribution breakdown.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/rating
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Rating, RatingBreakdown, RatingInput } from "@/components/ui/rating"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type RatingSize = "sm" | "default" | "lg"

type RatingLabels = {
  /** aria-label of a display rating. {value}, {max}. */
  summary: string
  /** Visible suffix after the number. {max}. Use "" to hide. */
  outOf: string
  /** Count text, plural. {count}. */
  count: string
  /** Count text when the count is 1. {count}. */
  countOne: string
  /** aria-label of one input option. {value}, {max}. */
  option: string
  /** aria-label of the input group. */
  group: string
  /** Shown by the input when nothing is chosen. */
  none: string
}

type RatingProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Average or score, 0 to `max`. Fractions are drawn by clipping. */
  value: number
  max?: number
  size?: RatingSize
  /** Show the number (and "out of max"). Default true. */
  showValue?: boolean
  /** Decimal places for the number. Default 1. */
  precision?: number
  /** Number of ratings behind the value. */
  count?: number
  locale?: string
  labels?: Partial<RatingLabels>
}

type RatingInputProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "children"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  size?: RatingSize
  /** Allow half steps (0.5, 1, 1.5 ...). */
  allowHalf?: boolean
  /** Clicking the chosen value again clears it to 0. */
  clearable?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Renders a hidden input so the value posts with a form. */
  name?: string
  /** Show the chosen value as text beside the stars. Default true. */
  showValue?: boolean
  labels?: Partial<RatingLabels>
}

type RatingBreakdownLabels = {
  /** aria-label of the list. */
  group: string
  /** Row summary for assistive tech. {stars}, {count}, {percent}. */
  row: string
}

type RatingBreakdownProps = Omit<React.ComponentProps<"ul">, "children"> & {
  /** Counts per rating, index 0 = 1 star ... index max-1 = max stars. */
  counts?: number[]
  /** Makes each row a button, e.g. to filter a list. */
  onSelectStars?: (stars: number) => void
  /** Highlights the active filter. */
  selectedStars?: number | null
  locale?: string
  labels?: Partial<RatingBreakdownLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { Rating, RatingBreakdown, RatingInput } from "@/components/ui/rating"

export default function RatingDemo() {
  // Domain 1: product reviews.
  const [filter, setFilter] = React.useState<number | null>(null)
  // Domain 2: course feedback.
  const [score, setScore] = React.useState(3.5)

  return (
    <div className="grid w-full max-w-3xl gap-10 sm:grid-cols-2">
      <section className="flex flex-col gap-4">
        <span className="eyebrow">Product reviews</span>
        <Rating value={4.3} count={1284} size="lg" />
        <RatingBreakdown
          counts={[38, 52, 120, 410, 664]}
          selectedStars={filter}
          onSelectStars={(s) => setFilter((f) => (f === s ? null : s))}
        />
        <p className="font-mono text-xs text-muted-foreground">
          filter = {filter ?? "all"}
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <span className="eyebrow">Course feedback</span>
        <RatingInput
          aria-label="Rate this lesson"
          value={score}
          onValueChange={setScore}
          allowHalf
          clearable
          size="lg"
          name="lesson-rating"
        />
        <Rating
          value={3.8}
          max={5}
          count={1}
          size="sm"
          labels={{ count: "{count} responses", countOne: "{count} response" }}
        />
        <Rating
          value={7.4}
          max={10}
          precision={1}
          showValue
          labels={{ outOf: "of {max} clarity" }}
        />
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/rating. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
