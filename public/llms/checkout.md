# Checkout

Three-step checkout (details, payment, confirmation) with validation, a sticky order summary with quantity steppers and discount codes, and ticket-pass confirmation. Card details stay in the form; only the last four digits reach your code.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/checkout
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Checkout } from "@/components/blocks/checkout"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`, `@opendraft/button`, `@opendraft/checkbox`, `@opendraft/empty-state`, `@opendraft/input`, `@opendraft/label`, `@opendraft/quantity-stepper`, `@opendraft/radio-group`, `@opendraft/stepper`, `@opendraft/ticket-pass`

## Props and types

```ts
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

export type CheckoutResult = {
  orderNumber?: string
}

export type CheckoutLabels = {
  eyebrow: string
  title: string
  detailsTitle: string
  detailsDescription: string
  paymentTitle: string
  paymentDescription: string
  confirmationTitle: string
  /** Receives the contact email and the order number. */
  confirmationDescription: (email: string, orderNumber: string) => string
  emptyTitle: string
  emptyDescription: string
  continue: string
  back: string
  pay: string
  reserve: string
  done: string
  summary: string
  subtotal: string
  discount: string
  total: string
  discountCode: string
  discountPlaceholder: string
  discountApply: string
  discountRemove: string
  /** Receives the percentage off. */
  discountApplied: (percent: number) => string
  /** Eyebrow of each ticket on the confirmation step. */
  ticketEyebrow: (item: CheckoutItem) => string
}

export type CheckoutTicketField = {
  label: string
  value: React.ReactNode
}

export type CheckoutProps = {
  /**
   * Cart lines. Controlled when passed together with `onChange`. When omitted,
   * the block starts with `SAMPLE_CHECKOUT_ITEMS` (generic placeholder tickets).
   */
  items?: CheckoutItem[]
  /** Extra charges added to the total. Defaults to none. */
  fees?: CheckoutFee[]
  /** ISO 4217 currency code. */
  currency?: string
  /** Valid discount codes mapped to a percentage off the subtotal. Defaults to none. */
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
  /** Override any fixed copy. Merged over the defaults. */
  labels?: Partial<CheckoutLabels>
  /**
   * Fields shown on each confirmation ticket. Defaults to Attendee, Quantity
   * and Order.
   */
  ticketFields?: (
    item: CheckoutItem,
    order: { orderNumber: string; values: CheckoutValues }
  ) => CheckoutTicketField[]
  className?: string
}
```

## Example

```tsx
import {
  Checkout,
  SAMPLE_CHECKOUT_DISCOUNTS,
  SAMPLE_CHECKOUT_FEES,
} from "@/components/blocks/checkout"

export default function CheckoutDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <Checkout
        fees={SAMPLE_CHECKOUT_FEES}
        discountCodes={SAMPLE_CHECKOUT_DISCOUNTS}
        onPay={async ({ payment }) => {
          await new Promise((r) => setTimeout(r, 1200))
          if (payment.last4 === "0002")
            throw new Error("Your card was declined.")
        }}
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/checkout. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
