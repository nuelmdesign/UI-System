# Theme Toggle

Icon menu that switches between system, light and dark by toggling the dark class, and remembers the choice.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/theme-toggle
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/dropdown-menu`

## Props and types

```ts
type ThemePreference = "system" | "light" | "dark"

type ThemeToggleProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick"
>
```

## Example

```tsx
"use client"

import { ThemeToggle, useThemePreference } from "@/components/ui/theme-toggle"

export default function ThemeToggleDemo() {
  const [preference] = useThemePreference()

  return (
    <div className="flex w-full max-w-[640px] items-center justify-between gap-4 border p-4">
      <div className="min-w-0">
        <p className="eyebrow text-muted-foreground">Appearance</p>
        <p className="mt-1 text-sm">
          Preference: <span className="font-mono">{preference}</span>
        </p>
      </div>
      <ThemeToggle />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/theme-toggle. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
