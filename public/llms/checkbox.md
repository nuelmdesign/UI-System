# Checkbox

Checkbox with a drawn check and an indeterminate state.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/checkbox
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

## Dependencies

- npm: `radix-ui`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
function Checkbox(props: React.ComponentProps<typeof CheckboxPrimitive.Root>)
```

## Example

```tsx
"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const ITEMS = ["Type safety", "Accessibility", "Registry validation"]

export default function CheckboxDemo() {
  const [checked, setChecked] = React.useState<string[]>(["Type safety"])
  const all = checked.length === ITEMS.length
  const some = checked.length > 0 && !all

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <Checkbox
          id="all"
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(value) => setChecked(value === true ? ITEMS : [])}
        />
        <Label htmlFor="all">All checks</Label>
      </div>
      <div className="grid gap-3 pl-7">
        {ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <Checkbox
              id={item}
              checked={checked.includes(item)}
              onCheckedChange={(value) =>
                setChecked((current) =>
                  value === true
                    ? [...current, item]
                    : current.filter((c) => c !== item)
                )
              }
            />
            <Label htmlFor={item}>{item}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/checkbox. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
