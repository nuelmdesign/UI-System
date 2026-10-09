# Empty State

Centered empty block with an optional icon, title, description and action slots, for tables, lists and cards.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/empty-state
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { EmptyState } from "@/components/ui/empty-state"
```

## Dependencies

- npm: `class-variance-authority`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof emptyStateVariants> & {
    icon?: React.ReactNode
    title: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
    secondaryAction?: React.ReactNode
    /** Announce to assistive tech (role="status"), e.g. for empty search results. */
    live?: boolean
  }
```

## Variants

- `size`: `sm`, `default` (default), `lg`
- `bordered`: `true`, `false` (default)

## Example

```tsx
import { Inbox, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function EmptyStateDemo() {
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-6">
      <EmptyState
        bordered
        icon={<Inbox />}
        title="No items yet"
        description="Items you create will show up here. Start by adding your first one."
        action={
          <Button size="sm">
            <Plus /> New item
          </Button>
        }
        secondaryAction={
          <Button size="sm" variant="outline">
            Import
          </Button>
        }
      />
      <div className="rounded-lg border">
        <EmptyState
          live
          size="sm"
          icon={<Search />}
          title="No results"
          description="Try a different search term or clear your filters."
          action={
            <Button size="sm" variant="outline">
              Clear filters
            </Button>
          }
        />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/empty-state. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
