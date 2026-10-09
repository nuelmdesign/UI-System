# Avatar

Image or initials, alone or overlapped in a group.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/avatar
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
```

## Dependencies

- npm: `radix-ui`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Avatar(props: React.ComponentProps<typeof AvatarPrimitive.Root>)

function AvatarImage(props: React.ComponentProps<typeof AvatarPrimitive.Image>)

function AvatarFallback(props: React.ComponentProps<typeof AvatarPrimitive.Fallback>)

function AvatarGroup(props: React.ComponentProps<"div">)
```

## Example

```tsx
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-6">
      <Avatar className="size-10">
        <AvatarFallback>NM</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {["NM", "AL", "GH", "KT"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/avatar. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
