# MFA Step

Multi-factor step: code entry, method switcher, resend countdown, and verifying, error and locked states.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/mfa-step
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { MfaStep } from "@/components/ui/mfa-step"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/otp-input`, `@opendraft/button`

## Props and types

```ts
type MfaMethod = {
  id: string
  /** Short name shown in the switcher, e.g. "Authenticator app". */
  label: string
  /** Instruction under the title while this method is active. */
  description?: React.ReactNode
  /** Where a code was sent, e.g. a masked phone number. Shown with the description. */
  destination?: string
  /** Number of characters in the code. Defaults to 6. */
  codeLength?: number
  /** Accepted characters. Defaults to numeric. */
  pattern?: "numeric" | "alphanumeric"
  /** Whether a new code can be requested for this method. */
  resendable?: boolean
}

type MfaVerifyResult = boolean | void

type MfaStepLabels = {
  title: string
  codeLabel: string
  verify: string
  verifying: string
  switchMethod: string
  resend: string
  /** Template for the countdown; `{seconds}` is replaced. */
  resendIn: string
  resent: string
  invalidCode: string
  failed: string
  lockedTitle: string
  lockedDescription: string
}

type MfaStepProps = Omit<
  React.ComponentProps<"section">,
  "onSubmit" | "title"
> & {
  methods?: MfaMethod[]
  method?: string
  defaultMethod?: string
  onMethodChange?: (id: string) => void
  /**
   * Resolve to verify. Return false or throw to show an error. The code is
   * submitted automatically once every cell is filled.
   */
  onVerify: (code: string, method: string) => Promise<MfaVerifyResult>
  /** Request a new code. Restarts the countdown. */
  onResend?: (method: string) => void | Promise<void>
  /** Seconds before a code can be requested again. */
  resendIn?: number
  /** Locks the step, e.g. after too many failed attempts. */
  locked?: boolean
  /** Error from outside, shown instead of the local one. */
  error?: React.ReactNode
  labels?: Partial<MfaStepLabels>
}
```

## Example

```tsx
"use client"

import { MfaStep, type MfaMethod } from "@/components/ui/mfa-step"

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const BANK_METHODS: MfaMethod[] = [
  {
    id: "app",
    label: "Authenticator",
    description: "Open your authenticator app and enter the current code.",
  },
  {
    id: "sms",
    label: "SMS",
    description: "We texted a code to",
    destination: "•••• 4417",
    resendable: true,
  },
]

const CLINIC_METHODS: MfaMethod[] = [
  {
    id: "email",
    label: "Email",
    description: "Enter the 8-character code sent to",
    destination: "j•••@example.com",
    codeLength: 8,
    pattern: "alphanumeric",
    resendable: true,
  },
  {
    id: "backup",
    label: "Recovery code",
    description: "Use one of the recovery codes you saved.",
    codeLength: 10,
    pattern: "alphanumeric",
  },
]

export default function MfaStepDemo() {
  return (
    <div className="grid w-full gap-10 md:grid-cols-2">
      <MfaStep
        methods={BANK_METHODS}
        resendIn={20}
        onVerify={async (code) => {
          await wait(700)
          return code === "123456"
        }}
        onResend={() => wait(300)}
        labels={{ title: "Confirm this payment" }}
      />
      <MfaStep
        methods={CLINIC_METHODS}
        resendIn={45}
        onVerify={async () => {
          await wait(700)
          throw new Error("This code has expired.")
        }}
        onResend={() => wait(300)}
        labels={{ title: "Open patient record", verify: "Continue" }}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/mfa-step. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
