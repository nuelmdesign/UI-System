# Shimmer Text

A light sweep across text, for thinking and loading labels.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/shimmer-text
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ShimmerText } from "@/components/motion/shimmer-text"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function ShimmerText(props: React.ComponentProps<"span"> & { duration?: number })
```

## Example

```tsx
import { ShimmerText } from "@/components/motion/shimmer-text"

export default function ShimmerTextDemo() {
  return (
    <div className="grid gap-3">
      <ShimmerText className="text-lg font-medium">
        Thinking through your request…
      </ShimmerText>
      <ShimmerText duration={3.5} className="text-sm">
        Searching 14 sources
      </ShimmerText>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/shimmer-text. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
