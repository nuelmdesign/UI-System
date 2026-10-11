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
