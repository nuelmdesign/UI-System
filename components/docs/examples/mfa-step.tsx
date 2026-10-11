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
