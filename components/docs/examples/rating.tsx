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
