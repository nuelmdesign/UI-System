"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export const DEFAULT_ADDRESS_FORM_LABELS: AddressFormLabels = {
  line1: "Address line 1",
  line2: "Address line 2",
  city: "City",
  region: "Region",
  postal: "Postal code",
  country: "Country",
  optional: "Optional",
  selectCountry: "Select a country",
  selectRegion: "Select a region",
  submit: "Save address",
  required: (f) => `${f} is required.`,
  invalidPostal: (f, ex) =>
    ex
      ? `Enter a valid ${f.toLowerCase()}, e.g. ${ex}.`
      : `Enter a valid ${f.toLowerCase()}.`,
}

/** Generic rule used for any country without its own entry in `rules`. */
export const DEFAULT_ADDRESS_RULE: AddressRule = {
  postalLabel: "Postal code",
  regionLabel: "Region",
  regionRequired: true,
  postalRequired: true,
}

/** Neutral list for demos. Pass your own `countries` in real use. */
export const SAMPLE_ADDRESS_COUNTRIES: AddressCountry[] = [
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
]

export const SAMPLE_ADDRESS_RULES: Record<string, AddressRule> = {
  GB: {
    postalLabel: "Postcode",
    regionLabel: "County",
    regionRequired: false,
    postalPattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/,
    postalExample: "SW1A 1AA",
  },
  US: {
    postalLabel: "ZIP code",
    regionLabel: "State",
    postalPattern: /^\d{5}(-\d{4})?$/,
    postalExample: "94103",
  },
}

export const EMPTY_ADDRESS: AddressValue = {
  line1: "",
  line2: "",
  city: "",
  region: "",
  postal: "",
  country: "",
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

const TOKENS: Record<AddressField, string> = {
  line1: "address-line1",
  line2: "address-line2",
  city: "address-level2",
  region: "address-level1",
  postal: "postal-code",
  country: "country",
}

function AddressForm({
  value: valueProp,
  defaultValue,
  onChange,
  onSubmit,
  countries = SAMPLE_ADDRESS_COUNTRIES,
  rules,
  section,
  footer,
  disabled = false,
  labels: labelsProp,
  className,
  ...props
}: AddressFormProps) {
  const labels = { ...DEFAULT_ADDRESS_FORM_LABELS, ...labelsProp }
  const formRef = React.useRef<HTMLFormElement>(null)
  const [internal, setInternal] = React.useState<AddressValue>({
    ...EMPTY_ADDRESS,
    ...defaultValue,
  })
  const [errors, setErrors] = React.useState<AddressErrors>({})
  const [pending, setPending] = React.useState(false)
  const value = valueProp ?? internal

  const rule: AddressRule = {
    ...DEFAULT_ADDRESS_RULE,
    ...rules?.[value.country],
  }
  const postalLabel = rule.postalLabel ?? labels.postal
  const regionLabel = rule.regionLabel ?? labels.region

  const validate = (v: AddressValue): AddressErrors => {
    const r: AddressRule = { ...DEFAULT_ADDRESS_RULE, ...rules?.[v.country] }
    const e: AddressErrors = {}
    if (!v.line1.trim()) e.line1 = labels.required(labels.line1)
    if (!v.city.trim()) e.city = labels.required(labels.city)
    if (!v.country) e.country = labels.required(labels.country)
    if (r.regionRequired !== false && !v.region.trim())
      e.region = labels.required(r.regionLabel ?? labels.region)
    const pl = r.postalLabel ?? labels.postal
    if (!v.postal.trim()) {
      if (r.postalRequired !== false) e.postal = labels.required(pl)
    } else if (r.postalPattern && !r.postalPattern.test(v.postal.trim())) {
      e.postal = labels.invalidPostal(pl, r.postalExample)
    }
    return e
  }

  const set = (key: AddressField, next: string) => {
    const updated = { ...value, [key]: next }
    // Region options and postal rules depend on the country.
    if (key === "country") updated.region = ""
    setInternal(updated)
    onChange?.(updated)
    if (errors[key] || key === "country") {
      setErrors((prev) => {
        const all = validate(updated)
        const out: AddressErrors = {}
        for (const k of Object.keys(prev) as AddressField[]) {
          if (all[k]) out[k] = all[k]
        }
        return out
      })
    }
  }

  const blurCheck = (key: AddressField) => {
    const msg = validate(value)[key]
    setErrors((prev) => ({ ...prev, [key]: msg }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const found = validate(value)
    setErrors(found)
    const first = (Object.keys(TOKENS) as AddressField[]).find((k) => found[k])
    if (first) {
      formRef.current
        ?.querySelector<HTMLElement>(`[data-address-field="${first}"]`)
        ?.focus()
      return
    }
    if (!onSubmit) return
    try {
      setPending(true)
      await onSubmit(value)
    } finally {
      setPending(false)
    }
  }

  const ac = (key: AddressField) =>
    section ? `${section} ${TOKENS[key]}` : TOKENS[key]

  const text = (
    key: Exclude<AddressField, "country">,
    label: string,
    extra?: {
      required?: boolean
      placeholder?: string
      inputMode?: React.ComponentProps<"input">["inputMode"]
      span?: boolean
    }
  ) => (
    <Field
      label={label}
      required={extra?.required}
      hint={extra?.required === false ? labels.optional : undefined}
      error={errors[key]}
      data-span={extra?.span ? "full" : undefined}
    >
      {(p) => (
        <Input
          {...p}
          name={key}
          data-address-field={key}
          autoComplete={ac(key)}
          inputMode={extra?.inputMode}
          placeholder={extra?.placeholder}
          disabled={disabled}
          value={value[key]}
          onChange={(e) => set(key, e.target.value)}
          onBlur={() => blurCheck(key)}
        />
      )}
    </Field>
  )

  return (
    <form
      ref={formRef}
      noValidate
      data-slot="address-form"
      onSubmit={handleSubmit}
      className={cn("flex w-full flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {text("line1", labels.line1, { required: true, span: true })}
        {text("line2", labels.line2, { required: false, span: true })}
        {text("city", labels.city, { required: true })}
        {rule.regionOptions ? (
          <Field
            label={regionLabel}
            required={rule.regionRequired !== false}
            error={errors.region}
          >
            {(p) => (
              <Select
                name="region"
                autoComplete={ac("region")}
                disabled={disabled}
                value={value.region}
                onValueChange={(v) => set("region", v)}
              >
                <SelectTrigger
                  {...p}
                  data-address-field="region"
                  className="w-full"
                  onBlur={() => blurCheck("region")}
                >
                  <SelectValue placeholder={labels.selectRegion} />
                </SelectTrigger>
                <SelectContent>
                  {(rule.regionOptions ?? []).map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>
        ) : (
          text("region", regionLabel, {
            required: rule.regionRequired !== false,
          })
        )}
        {text("postal", postalLabel, {
          required: rule.postalRequired !== false,
          placeholder: rule.postalExample,
        })}
        <Field label={labels.country} required error={errors.country}>
          {(p) => (
            <Select
              name="country"
              autoComplete={ac("country")}
              disabled={disabled}
              value={value.country}
              onValueChange={(v) => set("country", v)}
            >
              <SelectTrigger
                {...p}
                data-address-field="country"
                className="w-full"
              >
                <SelectValue placeholder={labels.selectCountry} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </FieldGroup>
      {footer ?? (
        <div>
          <Button type="submit" loading={pending} disabled={disabled}>
            {labels.submit}
          </Button>
        </div>
      )}
    </form>
  )
}

export { AddressForm }
