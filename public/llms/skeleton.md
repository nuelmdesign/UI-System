# Skeleton

Shimmering placeholder while content loads.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/skeleton
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Skeleton(props: React.ComponentProps<"div">)
```

## Example

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3.5 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/skeleton. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
