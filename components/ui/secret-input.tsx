"use client"

import * as React from "react"
import { Check, Copy, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SecretInputLabels = {
  show: string
  hide: string
  copy: string
  copied: string
  /** Announced when the value is hidden again automatically. */
  autoHidden: string
}

const DEFAULT_LABELS: SecretInputLabels = {
  show: "Show value",
  hide: "Hide value",
  copy: "Copy value",
  copied: "Copied to clipboard",
  autoHidden: "Value hidden",
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

function SecretInput({
  className,
  value,
  defaultValue = "",
  onChange,
  mask = "•",
  copyable = true,
  autoHideMs = 0,
  labels,
  onCopy,
  disabled,
  readOnly,
  ...props
}: SecretInputProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const [internal, setInternal] = React.useState(defaultValue)
  const [revealed, setRevealed] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [note, setNote] = React.useState("")
  const current = value ?? internal
  const maskChar = mask.slice(0, 1) || "•"

  // Auto-hide: the timer callback is the only place state changes.
  React.useEffect(() => {
    if (!revealed || autoHideMs <= 0) return
    const t = window.setTimeout(() => {
      setRevealed(false)
      setNote(l.autoHidden)
    }, autoHideMs)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, autoHideMs])

  React.useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(t)
  }, [copied])

  // A custom mask character renders the masked string read-only; reveal the
  // value to edit it. The default bullet uses the native password input.
  const customMask = mask !== "\u2022" && !revealed
  const shown = customMask ? maskChar.repeat(current.length) : current
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current)
      setCopied(true)
      setNote(l.copied)
      onCopy?.()
    } catch {
      setNote("")
    }
  }

  const toggle = () => {
    setNote("")
    setRevealed((r) => !r)
  }

  return (
    <div
      data-slot="secret-input"
      data-revealed={revealed || undefined}
      className={cn("relative flex w-full items-center", className)}
    >
      <Input
        {...props}
        type={revealed || customMask ? "text" : "password"}
        value={shown}
        disabled={disabled}
        readOnly={readOnly || customMask}
        autoComplete={props.autoComplete ?? "off"}
        spellCheck={false}
        autoCapitalize="off"
        onChange={(e) => {
          setInternal(e.target.value)
          onChange?.(e.target.value)
        }}
        className={cn(
          "font-mono tracking-wide",
          copyable ? "pr-[4.75rem]" : "pr-10"
        )}
      />
      <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
        {copyable && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            disabled={disabled || current.length === 0}
            onClick={copy}
            aria-label={l.copy}
            data-slot="secret-input-copy"
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          onClick={toggle}
          aria-label={revealed ? l.hide : l.show}
          aria-pressed={revealed}
          data-slot="secret-input-toggle"
        >
          {revealed ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {note}
      </span>
    </div>
  )
}

export { SecretInput }
export type { SecretInputProps, SecretInputLabels }
