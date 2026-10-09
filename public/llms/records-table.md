# Records Table

AI spreadsheet grid with property popovers, row-by-row calculation, resizable sticky columns and sorting. Shows sample content (an ice cream shop) until you pass your own data through its props.

Category: Data & Workflows

## Install

```bash
npx shadcn@latest add @opendraft/records-table
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { RecordsTable } from "@/components/agents/records-table"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/glide-menu`, `@opendraft/checkbox`, `@opendraft/switch`

## Props and types

```ts
export type RecordStrength = "strong" | "weak" | "veryweak" | "none"

export type RecordRow = {
  id: string
  name: string
  tags: string[]
  last: string
  strength: RecordStrength
  website?: string
}

export type RecordsTableProps = {
  rows?: RecordRow[]
  /** Stretch to the parent's height instead of capping the scroller. */
  fill?: boolean
  className?: string
}
```

## Example

```tsx
import { RecordsTable } from "@/components/agents/records-table"

export default function RecordsTableDemo() {
  return (
    <div className="w-full max-w-5xl">
      <RecordsTable />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/records-table. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
