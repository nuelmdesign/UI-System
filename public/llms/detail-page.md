# Detail Page

Detail page with a sticky purchase panel: media, meta, key facts, tabs, tier selection with quantity, running total, checkout and waitlist.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/detail-page
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DetailPage } from "@/components/blocks/detail-page"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/avatar`, `@opendraft/badge`, `@opendraft/button`, `@opendraft/accordion`, `@opendraft/progress`, `@opendraft/quantity-stepper`, `@opendraft/radio-group`, `@opendraft/stat`, `@opendraft/tabs`

## Props and types

```ts
export type DetailTier = {
  id: string
  name: string
  description?: string
  /** Unit price in major currency units. */
  price: number
  /** Total seats / units in this tier. */
  capacity: number
  /** Units still available. 0 means sold out. */
  remaining: number
}

export type DetailScheduleItem = {
  time: string
  title: string
  description?: string
}

export type DetailFaq = { question: string; answer: string }

export type DetailFact = { label: string; value: string; hint?: string }

export type DetailHost = { name: string; role?: string; avatar?: string }

export type DetailItem = {
  title: string
  /** Optional hero image URL. Falls back to a muted placeholder. */
  image?: string
  imageAlt?: string
  category?: string
  date: string
  location: string
  host: DetailHost
  currency?: string
  facts: DetailFact[]
  tiers: DetailTier[]
  sections: {
    about: string[]
    schedule: DetailScheduleItem[]
    faqs: DetailFaq[]
  }
}

export type DetailCheckout = { tierId: string; quantity: number }

export type DetailPageProps = {
  item?: DetailItem
  onCheckout?: (selection: DetailCheckout) => void
  onWaitlist?: (tierId: string) => void
  onSaveChange?: (saved: boolean) => void
  /** Label for the back link. */
  backLabel?: string
  onBack?: () => void
  className?: string
}
```

## Example

```tsx
import { DetailPage } from "@/components/blocks/detail-page"

export default function DetailPageDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <DetailPage />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/detail-page. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
