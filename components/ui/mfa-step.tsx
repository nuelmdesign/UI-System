"use client"

import * as React from "react"
import { Loader2, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { OtpInput } from "@/components/ui/otp-input"

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

const DEFAULT_LABELS: MfaStepLabels = {
  title: "Verify it's you",
  codeLabel: "Verification code",
  verify: "Verify",
  verifying: "Verifying",
  switchMethod: "Verification method",
  resend: "Resend code",
  resendIn: "Resend in {seconds}s",
  resent: "A new code was requested.",
  invalidCode: "That code is not valid. Check it and try again.",
  failed: "Something went wrong. Try again.",
  lockedTitle: "Too many attempts",
  lockedDescription:
    "Verification is locked. Try again later or contact support.",
}

const SAMPLE_MFA_METHODS: MfaMethod[] = [
  {
    id: "authenticator",
    label: "Authenticator app",
    description: "Enter the 6-digit code from your authenticator app.",
  },
  {
    id: "sms",
    label: "Text message",
    description: "Enter the code we sent by text message.",
    destination: "+1 ••• ••• 0142",
    resendable: true,
  },
  {
    id: "backup",
    label: "Backup code",
    description: "Enter one of your unused backup codes.",
    codeLength: 8,
    pattern: "alphanumeric",
  },
]

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

function MfaStep({
  className,
  methods = SAMPLE_MFA_METHODS,
  method,
  defaultMethod,
  onMethodChange,
  onVerify,
  onResend,
  resendIn = 30,
  locked = false,
  error: errorProp,
  labels,
  ...props
}: MfaStepProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const [internalMethod, setInternalMethod] = React.useState(
    defaultMethod ?? methods[0]?.id ?? ""
  )
  const activeId = method ?? internalMethod
  const active = methods.find((m) => m.id === activeId) ?? methods[0]
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "verifying" | "error">(
    "idle"
  )
  const [localError, setLocalError] = React.useState("")
  const [remaining, setRemaining] = React.useState(resendIn)
  const [note, setNote] = React.useState("")
  const titleId = React.useId()
  const errorId = React.useId()

  const running = remaining > 0
  React.useEffect(() => {
    if (!running) return
    const t = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0))
    }, 1000)
    return () => window.clearInterval(t)
  }, [running])

  if (!active) return null
  const length = active.codeLength ?? 6
  const error = errorProp || (status === "error" ? localError : "")
  const busy = status === "verifying"
  const disabled = locked || busy

  const submit = async (value: string) => {
    if (locked || busy || value.length !== length) return
    setStatus("verifying")
    setLocalError("")
    try {
      const ok = await onVerify(value, active.id)
      if (ok === false) {
        setStatus("error")
        setLocalError(l.invalidCode)
        setCode("")
      } else {
        setStatus("idle")
      }
    } catch (e) {
      setStatus("error")
      setLocalError(e instanceof Error && e.message ? e.message : l.failed)
      setCode("")
    }
  }

  const pick = (id: string) => {
    if (id === active.id || disabled) return
    setInternalMethod(id)
    onMethodChange?.(id)
    setCode("")
    setStatus("idle")
    setLocalError("")
    setNote("")
  }

  const resend = async () => {
    if (running || disabled || !onResend) return
    setRemaining(resendIn)
    setNote(l.resent)
    try {
      await onResend(active.id)
    } catch {
      setNote("")
    }
  }

  return (
    <section
      data-slot="mfa-step"
      data-status={locked ? "locked" : status}
      aria-labelledby={titleId}
      className={cn("flex w-full max-w-sm flex-col gap-6", className)}
      {...props}
    >
      <header className="flex flex-col gap-2">
        <h2 id={titleId} className="heading text-2xl">
          {l.title}
        </h2>
        {active.description && (
          <p className="text-sm text-muted-foreground">
            {active.description}
            {active.destination && (
              <>
                {" "}
                <span className="font-mono text-foreground">
                  {active.destination}
                </span>
              </>
            )}
          </p>
        )}
      </header>

      {locked ? (
        <div
          role="alert"
          data-slot="mfa-step-locked"
          className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4"
        >
          <Lock aria-hidden className="mt-0.5 size-4 text-destructive" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{l.lockedTitle}</p>
            <p className="text-sm text-muted-foreground">
              {l.lockedDescription}
            </p>
          </div>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            void submit(code)
          }}
        >
          <OtpInput
            key={active.id}
            length={length}
            pattern={active.pattern}
            value={code}
            onValueChange={(v) => {
              setCode(v)
              if (status === "error") setStatus("idle")
            }}
            onComplete={(v) => void submit(v)}
            invalid={!!error}
            disabled={disabled}
            autoFocus
            separator={length >= 6}
            aria-label={l.codeLabel}
            aria-describedby={error ? errorId : undefined}
          />
          <p
            id={errorId}
            role="alert"
            data-slot="mfa-step-error"
            className="min-h-5 text-sm text-destructive"
          >
            {error}
          </p>
          <Button
            type="submit"
            variant="ink"
            disabled={disabled || code.length !== length}
          >
            {busy && <Loader2 aria-hidden className="animate-spin" />}
            {busy ? l.verifying : l.verify}
          </Button>
        </form>
      )}

      {!locked && active.resendable && onResend && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="link"
            size="xs"
            className="h-auto p-0"
            disabled={running || disabled}
            onClick={() => void resend()}
          >
            {running
              ? l.resendIn.replace("{seconds}", String(remaining))
              : l.resend}
          </Button>
        </div>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {busy ? l.verifying : note}
      </span>

      {methods.length > 1 && (
        <div
          role="group"
          aria-label={l.switchMethod}
          data-slot="mfa-step-methods"
          className="flex flex-col gap-1 border-t pt-4"
        >
          <span className="eyebrow">{l.switchMethod}</span>
          <div className="flex flex-wrap gap-1.5">
            {methods.map((m) => (
              <Button
                key={m.id}
                type="button"
                size="xs"
                variant={m.id === active.id ? "secondary" : "ghost"}
                aria-pressed={m.id === active.id}
                disabled={busy}
                onClick={() => pick(m.id)}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export { MfaStep, SAMPLE_MFA_METHODS }
export type { MfaStepProps, MfaStepLabels, MfaMethod, MfaVerifyResult }
