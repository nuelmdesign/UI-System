"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowLeft,
  CircleCheck,
  CreditCard,
  GraduationCap,
  ShoppingBag,
  TriangleAlert,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { duration, ease } from "@/lib/motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QuantityStepper } from "@/components/ui/quantity-stepper"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Stepper, type StepperStep } from "@/components/ui/stepper"
import { TicketPass } from "@/components/ui/ticket-pass"

export type CheckoutItem = {
  id: string
  title: string
  subtitle?: string
  /** Unit price in major currency units. */
  price: number
  quantity: number
  max?: number
  /** Optional image url. Falls back to an icon tile. */
  image?: string
}

export type CheckoutFee = {
  id: string
  label: string
  amount: number
}

export type CheckoutDelivery = "email" | "desk"
export type CheckoutPaymentMethod = "card" | "later"

export type CheckoutSummary = {
  items: CheckoutItem[]
  subtotal: number
  discount: number
  discountCode: string | null
  fees: CheckoutFee[]
  total: number
  currency: string
}

export type CheckoutValues = {
  contact: { name: string; email: string; phone: string }
  attendee: { someoneElse: boolean; name: string; email: string }
  delivery: CheckoutDelivery
  /**
   * Masked on purpose: the full card number and CVC never leave the form.
   * To charge a card, mount your payment provider's hosted fields in place of
   * the card inputs, so card data goes to the provider and not through your app.
   */
  payment: {
    method: CheckoutPaymentMethod
    cardName: string
    last4: string
    expiry: string
  }
  summary: CheckoutSummary
}

/** What the card inputs hold while the form is open. Never exposed. */
type CardForm = {
  method: CheckoutPaymentMethod
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
}

export type CheckoutResult = {
  orderNumber?: string
}

export type CheckoutProps = {
  /** Cart lines. Controlled when passed together with `onChange`. */
  items?: CheckoutItem[]
  fees?: CheckoutFee[]
  /** ISO 4217 currency code. */
  currency?: string
  /** Valid discount codes mapped to a percentage off the subtotal. */
  discountCodes?: Record<string, number>
  onChange?: (items: CheckoutItem[]) => void
  /**
   * Async. Called with the form values on the payment step. Throw (or reject)
   * to show the error message. May resolve with an order number.
   * No payment is processed by this component.
   */
  onPay?: (
    values: CheckoutValues
  ) => void | CheckoutResult | Promise<void | CheckoutResult>
  /** Called when the person finishes on the confirmation step. */
  onComplete?: (order: { orderNumber: string; values: CheckoutValues }) => void
  /** Labels for the three steps. */
  steps?: [string, string, string]
  /** Shown in the empty-cart state. */
  emptyAction?: React.ReactNode
  className?: string
}

export const SAMPLE_CHECKOUT_ITEMS: CheckoutItem[] = [
  {
    id: "ws-pottery",
    title: "Wheel throwing basics",
    subtitle: "Sat 14 Mar, 10:00 · Studio B · Hosted by Ines Marlowe",
    price: 85,
    quantity: 1,
    max: 6,
  },
  {
    id: "ws-bookbinding",
    title: "Hand bookbinding evening",
    subtitle: "Wed 18 Mar, 18:30 · Print room · Hosted by Tomas Reyes",
    price: 48,
    quantity: 2,
    max: 8,
  },
]

export const SAMPLE_CHECKOUT_FEES: CheckoutFee[] = [
  { id: "service", label: "Service fee", amount: 4.5 },
  { id: "materials", label: "Materials", amount: 12 },
]

export const SAMPLE_CHECKOUT_DISCOUNTS: Record<string, number> = {
  WELCOME10: 10,
  SAVE20: 20,
}

const DEFAULT_STEPS: [string, string, string] = [
  "Details",
  "Payment",
  "Confirmation",
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 19)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(raw: string) {
  let digits = raw.replace(/\D/g, "").slice(0, 4)
  if (digits.length === 1 && digits > "1") digits = `0${digits}`
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

function luhn(digits: string) {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

/** Deterministic order reference from the order contents. */
function makeOrderNumber(values: CheckoutValues) {
  const seed = `${values.contact.email}|${values.summary.total}|${values.summary.items
    .map((i) => `${i.id}x${i.quantity}`)
    .join(",")}`
  let h = 5381
  for (let i = 0; i < seed.length; i++)
    h = ((h << 5) + h + seed.charCodeAt(i)) >>> 0
  return `ORD-${h.toString(36).toUpperCase().padStart(7, "0").slice(0, 7)}`
}

type Errors = Record<string, string>

function validateDetails(
  contact: CheckoutValues["contact"],
  attendee: CheckoutValues["attendee"]
): Errors {
  const e: Errors = {}
  if (!contact.name.trim()) e.name = "Enter your full name."
  if (!contact.email.trim()) e.email = "Enter your email address."
  else if (!EMAIL_RE.test(contact.email.trim()))
    e.email = "Enter a valid email address."
  if (contact.phone.trim() && contact.phone.replace(/\D/g, "").length < 7)
    e.phone = "Enter a valid phone number."
  if (attendee.someoneElse) {
    if (!attendee.name.trim()) e.attendeeName = "Enter the attendee's name."
    if (attendee.email.trim() && !EMAIL_RE.test(attendee.email.trim()))
      e.attendeeEmail = "Enter a valid email address."
  }
  return e
}

function validateCard(p: CardForm, checkedAt: number | null): Errors {
  const e: Errors = {}
  if (p.method !== "card") return e
  if (!p.cardName.trim()) e.cardName = "Enter the name on the card."
  const digits = p.cardNumber.replace(/\D/g, "")
  if (!digits) e.cardNumber = "Enter your card number."
  else if (digits.length < 13 || !luhn(digits))
    e.cardNumber = "Enter a valid card number."
  const m = /^(\d{2})\/(\d{2})$/.exec(p.expiry)
  if (!p.expiry) e.expiry = "Enter the expiry date."
  else if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.expiry = "Use MM/YY."
  else if (checkedAt !== null) {
    const now = new Date(checkedAt)
    const year = 2000 + Number(m[2])
    const month = Number(m[1])
    if (
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    )
      e.expiry = "This card has expired."
  }
  if (!p.cvc) e.cvc = "Enter the CVC."
  else if (p.cvc.length < 3) e.cvc = "Use 3 or 4 digits."
  return e
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key={message}
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: ease.out }}
          className="text-xs text-destructive"
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

type FieldControlProps = {
  id: string
  "aria-invalid": boolean
  "aria-describedby": string | undefined
}

function Field({
  id,
  label,
  error,
  optional,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  className?: string
  children: (props: FieldControlProps) => React.ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        )}
      </Label>
      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-err` : undefined,
      })}
      <FieldError id={`${id}-err`} message={error} />
    </div>
  )
}

function RadioCard({
  value,
  title,
  description,
  icon,
  name,
}: {
  value: string
  title: string
  description: string
  icon?: React.ReactNode
  name: string
}) {
  const id = `${name}-${value}`
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-md border bg-card p-3 transition-colors hover:bg-accent has-[[data-state=checked]]:border-brand/60 has-[[data-state=checked]]:bg-brand/5"
    >
      <RadioGroupItem id={id} value={value} className="mt-0.5" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
    </label>
  )
}

function Money({
  value,
  currency,
  className,
}: {
  value: number
  currency: string
  className?: string
}) {
  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {formatMoney(value, currency)}
    </span>
  )
}

function Checkout({
  items: itemsProp,
  fees = SAMPLE_CHECKOUT_FEES,
  currency = "USD",
  discountCodes = SAMPLE_CHECKOUT_DISCOUNTS,
  onChange,
  onPay,
  onComplete,
  steps: stepLabels = DEFAULT_STEPS,
  emptyAction,
  className,
}: CheckoutProps) {
  const uid = React.useId()
  const [internalItems, setInternalItems] = React.useState(
    SAMPLE_CHECKOUT_ITEMS
  )
  const items = itemsProp ?? internalItems

  const [step, setStep] = React.useState(0)
  const [contact, setContact] = React.useState({
    name: "",
    email: "",
    phone: "",
  })
  const [attendee, setAttendee] = React.useState({
    someoneElse: false,
    name: "",
    email: "",
  })
  const [delivery, setDelivery] = React.useState<CheckoutDelivery>("email")
  const [payment, setPayment] = React.useState<CardForm>({
    method: "card",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [checkedAt, setCheckedAt] = React.useState<number | null>(null)

  const [code, setCode] = React.useState("")
  const [appliedCode, setAppliedCode] = React.useState<string | null>(null)
  const [codeError, setCodeError] = React.useState("")

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [order, setOrder] = React.useState<{
    orderNumber: string
    values: CheckoutValues
  } | null>(null)

  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const locked = step === 2
  const percent = appliedCode ? (discountCodes[appliedCode] ?? 0) : 0
  const subtotal = round2(items.reduce((s, i) => s + i.price * i.quantity, 0))
  const discount = round2((subtotal * percent) / 100)
  const feesTotal = round2(fees.reduce((s, f) => s + f.amount, 0))
  const total = Math.max(0, round2(subtotal - discount + feesTotal))

  const summary: CheckoutSummary = {
    items,
    subtotal,
    discount,
    discountCode: appliedCode,
    fees,
    total,
    currency,
  }

  const detailErrors = validateDetails(contact, attendee)
  const cardErrors = validateCard(payment, checkedAt)
  const shown = (key: string, errors: Errors) =>
    touched[key] ? errors[key] : undefined
  const touch = (...keys: string[]) =>
    setTouched((t) => ({
      ...t,
      ...Object.fromEntries(keys.map((k) => [k, true])),
    }))

  const setItems = (next: CheckoutItem[]) => {
    setInternalItems(next)
    onChange?.(next)
  }
  const setQuantity = (id: string, quantity: number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)))
  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id))

  const applyCode = () => {
    const key = code.trim().toUpperCase()
    if (!key) {
      setCodeError("Enter a discount code.")
      return
    }
    if (!(key in discountCodes)) {
      setCodeError("That code isn't valid.")
      return
    }
    setAppliedCode(key)
    setCode("")
    setCodeError("")
  }

  const values: CheckoutValues = {
    contact: {
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
    },
    attendee: {
      someoneElse: attendee.someoneElse,
      name: attendee.someoneElse ? attendee.name.trim() : "",
      email: attendee.someoneElse ? attendee.email.trim() : "",
    },
    delivery,
    payment: {
      method: payment.method,
      cardName: payment.cardName.trim(),
      last4:
        payment.method === "card"
          ? payment.cardNumber.replace(/\D/g, "").slice(-4)
          : "",
      expiry: payment.method === "card" ? payment.expiry : "",
    },
    summary,
  }

  const goDetailsNext = (e: React.FormEvent) => {
    e.preventDefault()
    touch("name", "email", "phone", "attendeeName", "attendeeEmail")
    if (Object.keys(detailErrors).length) return
    setStep(1)
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    touch("cardName", "cardNumber", "expiry", "cvc")
    setCheckedAt(Date.now())
    const errs = validateCard(payment, Date.now())
    if (Object.keys(errs).length) return
    setError("")
    setLoading(true)
    try {
      const result = await onPay?.(values)
      const orderNumber =
        (result && typeof result === "object" && result.orderNumber) ||
        makeOrderNumber(values)
      setOrder({ orderNumber, values })
      setStep(2)
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "We couldn't complete your order. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const stepList: StepperStep[] = stepLabels.map((label, i) => ({
    id: ["details", "payment", "confirmation"][i],
    label,
  }))

  const empty = items.length === 0 && !order
  const shownSummary = order ? order.values.summary : summary
  const shownItems = shownSummary.items

  const summaryAside = (
    <aside
      data-slot="checkout-summary"
      aria-label="Order summary"
      className="flex flex-col gap-4 self-start rounded-lg border bg-card p-4 @md/checkout:p-5 @3xl/checkout:sticky @3xl/checkout:top-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="eyebrow">Order summary</h2>
        {order && (
          <span className="font-mono text-xs">{order.orderNumber}</span>
        )}
      </div>

      <ul className="flex flex-col divide-y">
        {shownItems.map((item) => (
          <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-md border bg-muted text-muted-foreground">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-full object-cover"
                />
              ) : (
                <GraduationCap aria-hidden className="size-5" />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm leading-snug font-medium">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.subtitle}
                    </p>
                  )}
                </div>
                {!locked && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${item.title}`}
                    onClick={() => removeItem(item.id)}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                {locked ? (
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    Qty {item.quantity}
                  </span>
                ) : (
                  <QuantityStepper
                    size="sm"
                    min={1}
                    max={item.max ?? 99}
                    value={item.quantity}
                    onValueChange={(q) => setQuantity(item.id, q)}
                    aria-label={`Quantity for ${item.title}`}
                    decrementLabel={`Decrease ${item.title}`}
                    incrementLabel={`Increase ${item.title}`}
                  />
                )}
                <Money
                  value={round2(item.price * item.quantity)}
                  currency={currency}
                  className="text-sm"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!locked && (
        <div className="flex flex-col gap-1.5 border-t pt-4">
          <Label htmlFor={`${uid}-code`}>Discount code</Label>
          {appliedCode ? (
            <div className="flex items-center justify-between gap-2 rounded-md border bg-surface px-3 py-1.5">
              <Badge variant="success" className="font-mono">
                {appliedCode}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {percent}% off applied
              </span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setAppliedCode(null)}
                aria-label={`Remove code ${appliedCode}`}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                id={`${uid}-code`}
                value={code}
                placeholder="Enter code"
                autoComplete="off"
                aria-invalid={!!codeError}
                aria-describedby={codeError ? `${uid}-code-err` : undefined}
                onChange={(e) => {
                  setCode(e.target.value)
                  setCodeError("")
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    applyCode()
                  }
                }}
                className="font-mono uppercase"
              />
              <Button type="button" variant="outline" onClick={applyCode}>
                Apply
              </Button>
            </div>
          )}
          <FieldError id={`${uid}-code-err`} message={codeError} />
        </div>
      )}

      <dl className="flex flex-col gap-2 border-t pt-4 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>
            <Money value={shownSummary.subtotal} currency={currency} />
          </dd>
        </div>
        {shownSummary.discount > 0 && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Discount
              {shownSummary.discountCode
                ? ` (${shownSummary.discountCode})`
                : ""}
            </dt>
            <dd className="text-success">
              <Money value={-shownSummary.discount} currency={currency} />
            </dd>
          </div>
        )}
        {shownSummary.fees.map((f) => (
          <div key={f.id} className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{f.label}</dt>
            <dd>
              <Money value={f.amount} currency={currency} />
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-2 border-t pt-3">
          <dt className="font-medium">Total</dt>
          <dd>
            <Money
              value={shownSummary.total}
              currency={currency}
              className="text-xl font-medium"
            />
          </dd>
        </div>
      </dl>
    </aside>
  )

  return (
    <div
      className={cn(
        "@container/checkout h-full min-h-0 w-full overflow-y-auto bg-background text-foreground",
        className
      )}
    >
      <div
        data-slot="checkout"
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 @md/checkout:px-8 @md/checkout:py-8"
      >
        <div className="flex flex-col gap-1.5">
          <span className="eyebrow">Secure checkout</span>
          <h1 className="heading text-3xl">Complete your booking</h1>
        </div>

        {empty ? (
          <EmptyState
            bordered
            icon={<ShoppingBag />}
            title="Your cart is empty"
            description="Add a workshop or course to check out."
            action={emptyAction}
          />
        ) : (
          <>
            <Stepper
              steps={stepList}
              current={step}
              onStepClick={(_, i) => {
                if (step < 2) setStep(i)
              }}
            />

            <div className="grid items-start gap-6 @3xl/checkout:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="min-w-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: duration.base, ease: ease.out }}
                  >
                    {step === 0 && (
                      <form
                        noValidate
                        onSubmit={goDetailsNext}
                        className="flex flex-col gap-6"
                      >
                        <StepHeading
                          ref={headingRef}
                          title="Your details"
                          description="We'll send your booking confirmation here."
                        />
                        <div className="grid gap-4 @md/checkout:grid-cols-2">
                          <Field
                            id={`${uid}-name`}
                            label="Full name"
                            error={shown("name", detailErrors)}
                          >
                            {(p) => (
                              <Input
                                {...p}
                                autoComplete="name"
                                value={contact.name}
                                onChange={(e) =>
                                  setContact({
                                    ...contact,
                                    name: e.target.value,
                                  })
                                }
                                onBlur={() => touch("name")}
                              />
                            )}
                          </Field>
                          <Field
                            id={`${uid}-email`}
                            label="Email"
                            error={shown("email", detailErrors)}
                          >
                            {(p) => (
                              <Input
                                {...p}
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={contact.email}
                                onChange={(e) =>
                                  setContact({
                                    ...contact,
                                    email: e.target.value,
                                  })
                                }
                                onBlur={() => touch("email")}
                              />
                            )}
                          </Field>
                          <Field
                            id={`${uid}-phone`}
                            label="Phone"
                            optional
                            error={shown("phone", detailErrors)}
                            className="@md/checkout:col-span-2"
                          >
                            {(p) => (
                              <Input
                                {...p}
                                type="tel"
                                autoComplete="tel"
                                value={contact.phone}
                                onChange={(e) =>
                                  setContact({
                                    ...contact,
                                    phone: e.target.value,
                                  })
                                }
                                onBlur={() => touch("phone")}
                              />
                            )}
                          </Field>
                        </div>

                        <fieldset className="flex flex-col gap-3">
                          <legend className="mb-3 eyebrow">Attendee</legend>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`${uid}-else`}
                              checked={attendee.someoneElse}
                              onCheckedChange={(c) =>
                                setAttendee({
                                  ...attendee,
                                  someoneElse: c === true,
                                })
                              }
                            />
                            <Label htmlFor={`${uid}-else`}>
                              I&apos;m booking for someone else
                            </Label>
                          </div>
                          {attendee.someoneElse && (
                            <div className="grid gap-4 @md/checkout:grid-cols-2">
                              <Field
                                id={`${uid}-att-name`}
                                label="Attendee name"
                                error={shown("attendeeName", detailErrors)}
                              >
                                {(p) => (
                                  <Input
                                    {...p}
                                    value={attendee.name}
                                    onChange={(e) =>
                                      setAttendee({
                                        ...attendee,
                                        name: e.target.value,
                                      })
                                    }
                                    onBlur={() => touch("attendeeName")}
                                  />
                                )}
                              </Field>
                              <Field
                                id={`${uid}-att-email`}
                                label="Attendee email"
                                optional
                                error={shown("attendeeEmail", detailErrors)}
                              >
                                {(p) => (
                                  <Input
                                    {...p}
                                    type="email"
                                    value={attendee.email}
                                    onChange={(e) =>
                                      setAttendee({
                                        ...attendee,
                                        email: e.target.value,
                                      })
                                    }
                                    onBlur={() => touch("attendeeEmail")}
                                  />
                                )}
                              </Field>
                            </div>
                          )}
                        </fieldset>

                        <fieldset className="flex flex-col gap-3">
                          <legend className="mb-3 eyebrow">Delivery</legend>
                          <RadioGroup
                            value={delivery}
                            onValueChange={(v) =>
                              setDelivery(v as CheckoutDelivery)
                            }
                            aria-label="Delivery"
                            className="@md/checkout:grid-cols-2"
                          >
                            <RadioCard
                              name={`${uid}-delivery`}
                              value="email"
                              title="Digital pass by email"
                              description="Delivered instantly after booking."
                            />
                            <RadioCard
                              name={`${uid}-delivery`}
                              value="desk"
                              title="Collect at the front desk"
                              description="Show your order number on arrival."
                            />
                          </RadioGroup>
                        </fieldset>

                        <div className="flex justify-end">
                          <Button type="submit" size="lg">
                            Continue to payment
                          </Button>
                        </div>
                      </form>
                    )}

                    {step === 1 && (
                      <form
                        noValidate
                        onSubmit={handlePay}
                        className="flex flex-col gap-6"
                      >
                        <StepHeading
                          ref={headingRef}
                          title="Payment"
                          description="Choose how you'd like to pay."
                        />

                        <RadioGroup
                          value={payment.method}
                          onValueChange={(v) => {
                            setPayment({
                              ...payment,
                              method: v as CheckoutPaymentMethod,
                            })
                            setError("")
                          }}
                          aria-label="Payment method"
                          className="@md/checkout:grid-cols-2"
                        >
                          <RadioCard
                            name={`${uid}-method`}
                            value="card"
                            icon={<CreditCard aria-hidden className="size-4" />}
                            title="Credit or debit card"
                            description="Pay now and get your pass right away."
                          />
                          <RadioCard
                            name={`${uid}-method`}
                            value="later"
                            title="Pay later"
                            description="Reserve now and pay within 3 days."
                          />
                        </RadioGroup>

                        {payment.method === "card" ? (
                          <div className="grid gap-4 @md/checkout:grid-cols-6">
                            <Field
                              id={`${uid}-card-name`}
                              label="Name on card"
                              error={shown("cardName", cardErrors)}
                              className="@md/checkout:col-span-6"
                            >
                              {(p) => (
                                <Input
                                  {...p}
                                  autoComplete="cc-name"
                                  value={payment.cardName}
                                  onChange={(e) =>
                                    setPayment({
                                      ...payment,
                                      cardName: e.target.value,
                                    })
                                  }
                                  onBlur={() => touch("cardName")}
                                />
                              )}
                            </Field>
                            <Field
                              id={`${uid}-card-number`}
                              label="Card number"
                              error={shown("cardNumber", cardErrors)}
                              className="@md/checkout:col-span-6"
                            >
                              {(p) => (
                                <Input
                                  {...p}
                                  inputMode="numeric"
                                  autoComplete="cc-number"
                                  placeholder="1234 5678 9012 3456"
                                  value={payment.cardNumber}
                                  onChange={(e) =>
                                    setPayment({
                                      ...payment,
                                      cardNumber: formatCardNumber(
                                        e.target.value
                                      ),
                                    })
                                  }
                                  onBlur={() => touch("cardNumber")}
                                  className="font-mono tabular-nums"
                                />
                              )}
                            </Field>
                            <Field
                              id={`${uid}-expiry`}
                              label="Expiry"
                              error={shown("expiry", cardErrors)}
                              className="@md/checkout:col-span-3"
                            >
                              {(p) => (
                                <Input
                                  {...p}
                                  inputMode="numeric"
                                  autoComplete="cc-exp"
                                  placeholder="MM/YY"
                                  value={payment.expiry}
                                  onChange={(e) =>
                                    setPayment({
                                      ...payment,
                                      expiry: formatExpiry(e.target.value),
                                    })
                                  }
                                  onBlur={() => {
                                    touch("expiry")
                                    setCheckedAt(Date.now())
                                  }}
                                  className="font-mono tabular-nums"
                                />
                              )}
                            </Field>
                            <Field
                              id={`${uid}-cvc`}
                              label="CVC"
                              error={shown("cvc", cardErrors)}
                              className="@md/checkout:col-span-3"
                            >
                              {(p) => (
                                <Input
                                  {...p}
                                  inputMode="numeric"
                                  autoComplete="cc-csc"
                                  placeholder="123"
                                  value={payment.cvc}
                                  onChange={(e) =>
                                    setPayment({
                                      ...payment,
                                      cvc: e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 4),
                                    })
                                  }
                                  onBlur={() => touch("cvc")}
                                  className="font-mono tabular-nums"
                                />
                              )}
                            </Field>
                          </div>
                        ) : (
                          <p className="rounded-md border bg-surface p-4 text-sm text-muted-foreground">
                            Your spot is held for 3 days. We&apos;ll email a
                            payment link to {contact.email.trim() || "you"};
                            your pass activates once it&apos;s paid.
                          </p>
                        )}

                        {error && (
                          <div
                            role="alert"
                            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                          >
                            <TriangleAlert
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0"
                            />
                            {error}
                          </div>
                        )}

                        <div className="flex flex-col-reverse gap-2 @md/checkout:flex-row @md/checkout:justify-between">
                          <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            disabled={loading}
                            onClick={() => {
                              setError("")
                              setStep(0)
                            }}
                          >
                            <ArrowLeft />
                            Back
                          </Button>
                          <Button type="submit" size="lg" loading={loading}>
                            {payment.method === "card" ? "Pay " : "Reserve · "}
                            <Money value={total} currency={currency} />
                          </Button>
                        </div>
                      </form>
                    )}

                    {step === 2 && order && (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-3">
                          <CircleCheck
                            aria-hidden
                            className="mt-1 size-6 shrink-0 text-success"
                          />
                          <StepHeading
                            ref={headingRef}
                            title="You're booked"
                            description={`Confirmation sent to ${order.values.contact.email}. Order ${order.orderNumber}.`}
                          />
                        </div>

                        <div className="flex flex-col gap-4">
                          {order.values.summary.items.map((item, i) => (
                            <TicketPass
                              key={item.id}
                              eyebrow={`Admit ${item.quantity}`}
                              title={item.title}
                              code={`${order.orderNumber}-${String(i + 1).padStart(2, "0")}`}
                              status="valid"
                              className="max-w-none"
                              fields={[
                                {
                                  label: "Attendee",
                                  value:
                                    order.values.attendee.name ||
                                    order.values.contact.name,
                                },
                                { label: "Quantity", value: item.quantity },
                                {
                                  label: "Payment",
                                  value:
                                    order.values.payment.method === "card"
                                      ? "Paid"
                                      : "Due in 3 days",
                                },
                                ...(item.subtitle
                                  ? [{ label: "Session", value: item.subtitle }]
                                  : []),
                                {
                                  label: "Pass",
                                  value:
                                    order.values.delivery === "email"
                                      ? "By email"
                                      : "Front desk",
                                },
                              ]}
                            />
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <Button
                            size="lg"
                            onClick={() =>
                              onComplete?.({
                                orderNumber: order.orderNumber,
                                values: order.values,
                              })
                            }
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {summaryAside}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const StepHeading = React.forwardRef<
  HTMLHeadingElement,
  { title: string; description: string }
>(function StepHeading({ title, description }, ref) {
  return (
    <div className="flex flex-col gap-1">
      <h2 ref={ref} tabIndex={-1} className="heading text-2xl outline-none">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
})

export { Checkout }
