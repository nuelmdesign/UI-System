# Fine-tune Card

Compact inspector with scrub-able number fields, a sliding segmented control and a Type menu.

Category: Data & Workflows

## Install

```bash
npx shadcn@latest add @opendraft/fine-tune-card
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { FineTuneCard } from "@/components/agents/fine-tune-card"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/glide-menu`, `@opendraft/shimmer-text`

## Props and types

```ts
/** A single scrub-able number property. `value` is the initial/default value. */
export type FineTuneField = {
  key: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
}

/** Prominent copy strings on the card. */
export type FineTuneCardLabels = {
  title: string
  layout: string
  type: string
  placeholder: string
  adjust: string
  edited: string
}

/** The editable state emitted by `onChange`. */
export type FineTuneState = {
  segment: number
  values: Record<string, number>
  type: string
}

export type FineTuneCardProps = {
  /** The scrub-able properties shown in the layout grid (rendered in pairs). */
  fields?: FineTuneField[]
  /** Options offered in the Type menu. */
  options?: string[]
  /** Prominent copy strings. */
  labels?: Partial<FineTuneCardLabels>
  /** Called with the full editable state whenever the user edits it. */
  onChange?: (state: FineTuneState) => void
  className?: string
}
```

## Example

```tsx
import { FineTuneCard } from "@/components/agents/fine-tune-card"

export default function FineTuneCardDemo() {
  return (
    <div className="flex w-full justify-center">
      <FineTuneCard />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/fine-tune-card. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
