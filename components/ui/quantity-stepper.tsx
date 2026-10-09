"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const stepperVariants = cva(
  "inline-flex items-center rounded-md border bg-card data-[disabled]:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8",
        default: "h-9",
      },
    },
    defaultVariants: { size: "default" },
  }
)

const REPEAT_DELAY = 400
const REPEAT_INTERVAL = 80

type QuantityStepperProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** Controlled value. */
  value?: number
  /** Initial value when uncontrolled. */
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: "sm" | "default"
  disabled?: boolean
  /** Hold a button to keep stepping. */
  repeat?: boolean
  /** Accessible name of the group. */
  "aria-label"?: string
  /** Spoken names of the two buttons. */
  decrementLabel?: string
  incrementLabel?: string
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function QuantityStepper({
  className,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = Infinity,
  step = 1,
  size = "default",
  disabled = false,
  repeat = false,
  "aria-label": ariaLabel = "Quantity",
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  ...props
}: QuantityStepperProps) {
  const [internal, setInternal] = React.useState(() =>
    clamp(defaultValue ?? min, min, max)
  )
  const [draft, setDraft] = React.useState<string | null>(null)
  const current = clamp(value ?? internal, min, max)

  const currentRef = React.useRef(current)
  const timers = React.useRef<{
    delay?: ReturnType<typeof setTimeout>
    tick?: ReturnType<typeof setInterval>
  }>({})

  React.useEffect(() => {
    currentRef.current = current
  }, [current])

  const commit = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, min, max)
      if (clamped === currentRef.current) return
      currentRef.current = clamped
      setInternal(clamped)
      onValueChange?.(clamped)
    },
    [min, max, onValueChange]
  )

  const stop = React.useCallback(() => {
    clearTimeout(timers.current.delay)
    clearInterval(timers.current.tick)
    timers.current = {}
  }, [])

  React.useEffect(() => stop, [stop])

  function start(dir: 1 | -1) {
    commit(currentRef.current + dir * step)
    if (!repeat) return
    stop()
    timers.current.delay = setTimeout(() => {
      timers.current.tick = setInterval(() => {
        const next = clamp(currentRef.current + dir * step, min, max)
        if (next === currentRef.current) return stop()
        commit(next)
      }, REPEAT_INTERVAL)
    }, REPEAT_DELAY)
  }

  // Keyboard activation (Enter/Space) fires click with detail 0; pointer
  // presses are handled on pointerdown so they can repeat.
  function press(e: React.PointerEvent, dir: 1 | -1) {
    if (e.button === 0) start(dir)
  }
  function click(e: React.MouseEvent, dir: 1 | -1) {
    if (e.detail === 0) commit(currentRef.current + dir * step)
  }

  function applyDraft() {
    if (draft === null) return
    const parsed = Number.parseFloat(draft.replace(/[^\d.-]/g, ""))
    setDraft(null)
    if (Number.isFinite(parsed)) commit(parsed)
  }

  const btnSize = size === "sm" ? "icon-xs" : "icon-sm"

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="quantity-stepper"
      data-disabled={disabled ? "" : undefined}
      className={cn(stepperVariants({ size }), className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size={btnSize}
        data-slot="quantity-stepper-decrement"
        aria-label={decrementLabel}
        disabled={disabled || current <= min}
        className="rounded-r-none"
        onPointerDown={(e) => press(e, -1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onClick={(e) => click(e, -1)}
      >
        <MinusIcon />
      </Button>
      <input
        type="text"
        inputMode="numeric"
        role="spinbutton"
        data-slot="quantity-stepper-input"
        aria-label={ariaLabel}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        disabled={disabled}
        value={draft ?? String(current)}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={applyDraft}
        onKeyDown={(e) => {
          if (e.key === "Enter") applyDraft()
          else if (e.key === "ArrowUp") {
            e.preventDefault()
            setDraft(null)
            commit(current + step)
          } else if (e.key === "ArrowDown") {
            e.preventDefault()
            setDraft(null)
            commit(current - step)
          } else if (e.key === "Escape") setDraft(null)
        }}
        className={cn(
          "h-full w-10 min-w-0 bg-transparent text-center font-mono text-sm tabular-nums outline-none",
          "focus-visible:bg-accent disabled:cursor-not-allowed",
          size === "sm" && "w-9 text-xs"
        )}
      />
      <span className="sr-only" aria-live="polite">
        {current}
      </span>
      <Button
        type="button"
        variant="ghost"
        size={btnSize}
        data-slot="quantity-stepper-increment"
        aria-label={incrementLabel}
        disabled={disabled || current >= max}
        className="rounded-l-none"
        onPointerDown={(e) => press(e, 1)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onClick={(e) => click(e, 1)}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}

export { QuantityStepper, stepperVariants as quantityStepperVariants }
export type { QuantityStepperProps }
