# Toast

Stacked notifications with actions, themed to the tokens.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/sonner
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Toaster } from "@/components/ui/sonner"
```

## Dependencies

- npm: `sonner`
- Registry (installed with it): `@opendraft/utils`

## Example

```tsx
"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast("Deployment queued", {
            description: "Building main@4f2c1a, about 40 seconds.",
            action: { label: "View", onClick: () => {} },
          })
        }
      >
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Settings saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Payment failed")}>
        Error
      </Button>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/sonner. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
