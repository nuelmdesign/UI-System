# Search List

Command-style search with live filtering, a clear action, a gliding hover highlight and an empty state. Shows sample content (an ice cream shop) until you pass your own data through its props.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/search-list
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SearchList } from "@/components/agents/search-list"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/glide-menu`

## Props and types

```ts
export type SearchItem = string

export type SearchListLabels = {
  placeholder: string
  ariaLabel: string
  emptyTitle: string
  emptyHint: string
}

export interface SearchListProps {
  items?: SearchItem[]
  labels?: Partial<SearchListLabels>
  /** Fired when a result is picked. */
  onSelect?: (item: SearchItem) => void
  className?: string
}
```

## Example

```tsx
"use client"

import { SearchList } from "@/components/agents/search-list"

export default function SearchListDemo() {
  return (
    <div className="flex w-full justify-center">
      <SearchList onSelect={(item) => console.log("picked:", item)} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/search-list. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
