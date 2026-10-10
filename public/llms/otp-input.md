# OTP Input

One-time-code entry on a single real input, with paste, a separator and complete, invalid and disabled states.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/otp-input
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { OtpInput } from "@/components/ui/otp-input"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type OtpInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "maxLength" | "pattern" | "type"
> & {
  /** Number of cells. Defaults to 6. */
  length?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called once when every cell is filled. */
  onComplete?: (value: string) => void
  /** Accepted characters. Digits only by default. */
  pattern?: "numeric" | "alphanumeric"
  invalid?: boolean
  /** Render a dash after the middle cell. */
  separator?: boolean
  /** Focus the field on mount. */
  autoFocus?: boolean
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { OtpInput } from "@/components/ui/otp-input"

export default function OtpInputDemo() {
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "error" | "ok">("idle")

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-3">
        <p className="eyebrow">Two-factor authentication</p>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app. Try 123456.
        </p>
        <OtpInput
          separator
          value={code}
          invalid={status === "error"}
          onValueChange={(v) => {
            setCode(v)
            setStatus("idle")
          }}
          onComplete={(v) => setStatus(v === "123456" ? "ok" : "error")}
          aria-label="Authentication code"
        />
        <p
          role={status === "error" ? "alert" : "status"}
          className="min-h-5 text-sm"
        >
          {status === "error" && (
            <span className="text-destructive">
              That code is not valid. Try again.
            </span>
          )}
          {status === "ok" && <span className="text-success">Verified.</span>}
        </p>
      </div>
      <div className="grid gap-3">
        <p className="eyebrow">Alphanumeric, 4 characters</p>
        <OtpInput length={4} pattern="alphanumeric" aria-label="Access code" />
      </div>
      <div className="grid gap-3">
        <p className="eyebrow">Disabled</p>
        <OtpInput defaultValue="1234" disabled aria-label="Locked code" />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/otp-input. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
