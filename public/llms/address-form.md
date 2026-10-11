# Address Form

Shipping or billing address form with per-country rules, validation and correct autocomplete tokens.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/address-form
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { AddressForm } from "@/components/ui/address-form"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/field`, `@opendraft/input`, `@opendraft/select`

## Props and types

```ts
export type AddressValue = {
  line1: string
  line2: string
  city: string
  region: string
  postal: string
  /** Country code, matching `countries[].code`. */
  country: string
}

export type AddressField = keyof AddressValue

export type AddressCountry = { code: string; name: string }

export type AddressRule = {
  postalLabel?: string
  regionLabel?: string
  /** Postal code must match this (tested on the trimmed value). */
  postalPattern?: RegExp
  /** Shown as placeholder and in the invalid message hint, e.g. "SW1A 1AA". */
  postalExample?: string
  /** Default true. Set false where regions are not part of addresses. */
  regionRequired?: boolean
  /** Renders region as a select instead of free text. */
  regionOptions?: { value: string; label: string }[]
  /** Default true. */
  postalRequired?: boolean
}

export type AddressFormLabels = {
  line1: string
  line2: string
  city: string
  region: string
  postal: string
  country: string
  optional: string
  selectCountry: string
  selectRegion: string
  submit: string
  required: (field: string) => string
  invalidPostal: (field: string, example?: string) => string
}

export type AddressErrors = Partial<Record<AddressField, string>>

export type AddressFormProps = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "onChange" | "defaultValue"
> & {
  /** Controlled value. */
  value?: AddressValue
  defaultValue?: Partial<AddressValue>
  onChange?: (value: AddressValue) => void
  /** Called with a valid address. May return a promise; the button shows loading until it settles. */
  onSubmit?: (value: AddressValue) => void | Promise<void>
  countries?: AddressCountry[]
  /** Per-country-code overrides merged over `DEFAULT_ADDRESS_RULE`. */
  rules?: Record<string, AddressRule>
  /** Prefixes autocomplete tokens: "shipping" gives "shipping address-line1". */
  section?: "shipping" | "billing"
  /** Replaces the default submit button. */
  footer?: React.ReactNode
  disabled?: boolean
  labels?: Partial<AddressFormLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  AddressForm,
  SAMPLE_ADDRESS_COUNTRIES,
  SAMPLE_ADDRESS_RULES,
  type AddressValue,
} from "@/components/ui/address-form"

export default function AddressFormDemo() {
  const [saved, setSaved] = React.useState<AddressValue | null>(null)
  const [billing, setBilling] = React.useState<AddressValue>({
    line1: "",
    line2: "",
    city: "",
    region: "",
    postal: "",
    country: "US",
  })

  return (
    <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <h3 className="eyebrow">Shipping, United Kingdom</h3>
        <AddressForm
          section="shipping"
          defaultValue={{ country: "GB" }}
          countries={SAMPLE_ADDRESS_COUNTRIES}
          rules={SAMPLE_ADDRESS_RULES}
          labels={{ submit: "Deliver here" }}
          onSubmit={(v) => setSaved(v)}
        />
        <p
          aria-live="polite"
          className="font-mono text-xs text-muted-foreground"
        >
          {saved
            ? JSON.stringify(saved)
            : "Uncontrolled. Submit to see the value."}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="eyebrow">Billing, United States (controlled)</h3>
        <AddressForm
          section="billing"
          value={billing}
          onChange={setBilling}
          countries={SAMPLE_ADDRESS_COUNTRIES}
          rules={{
            ...SAMPLE_ADDRESS_RULES,
            US: {
              ...SAMPLE_ADDRESS_RULES.US,
              regionOptions: [
                { value: "CA", label: "California" },
                { value: "NY", label: "New York" },
                { value: "TX", label: "Texas" },
              ],
            },
          }}
          labels={{ submit: "Save billing address", line1: "Street address" }}
        />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/address-form. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
