# Secret Input

Masked input with reveal, copy and optional auto-hide, for API keys, tokens and sensitive fields.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/secret-input
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SecretInput } from "@/components/ui/secret-input"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/input`, `@opendraft/button`

## Props and types

```ts
type SecretInputLabels = {
  show: string
  hide: string
  copy: string
  copied: string
  /** Announced when the value is hidden again automatically. */
  autoHidden: string
}

type SecretInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Character used to mask the value while hidden. A custom character makes the hidden field read-only. */
  mask?: string
  /** Show a copy button. */
  copyable?: boolean
  /** Hide the value again after this many milliseconds. 0 disables. */
  autoHideMs?: number
  /** Fixed accessible name for the field. Never include the secret itself. */
  "aria-label"?: string
  labels?: Partial<SecretInputLabels>
  /** Called after a successful copy. */
  onCopy?: () => void
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { Field } from "@/components/ui/field"
import { SecretInput } from "@/components/ui/secret-input"

export default function SecretInputDemo() {
  const [token, setToken] = React.useState("tok_live_8f3a91c2d7b04e65")
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Field label="Access token" hint="Hides itself after 10 seconds.">
        {(c) => (
          <SecretInput
            {...c}
            value={token}
            onChange={setToken}
            autoHideMs={10000}
          />
        )}
      </Field>
      <Field label="National ID number" hint="Masked with a custom character.">
        {(c) => (
          <SecretInput
            {...c}
            defaultValue="482-19-7730"
            mask="*"
            copyable={false}
            labels={{ show: "Reveal number", hide: "Hide number" }}
          />
        )}
      </Field>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/secret-input. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
