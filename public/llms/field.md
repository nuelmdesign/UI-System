# Field

Form field wrapper that pairs a label, control, hint and error message and wires ids and ARIA attributes, with a responsive group and fieldset.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/field
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Field, FieldControl, FieldGroup, FieldSet } from "@/components/ui/field"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`, `@opendraft/label`

## Props and types

```ts
type FieldControlProps = {
  id: string
  "aria-describedby"?: string
  "aria-invalid"?: true
  "aria-required"?: true
}

type FieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  label?: React.ReactNode
  hint?: React.ReactNode
  /** Error message. Marks the control invalid and replaces the hint. */
  error?: React.ReactNode
  required?: boolean
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean
  /** Override the generated control id. */
  controlId?: string
  /**
   * A render function receiving the control props to spread, or plain nodes
   * containing a `FieldControl` / any component using `useFieldControl`.
   */
  children: React.ReactNode | ((props: FieldControlProps) => React.ReactNode)
}

type FieldGroupProps = React.ComponentProps<"div"> & {
  /** Max columns when the container is wide enough. */
  columns?: 1 | 2
}

type FieldSetProps = Omit<React.ComponentProps<"fieldset">, "title"> & {
  legend: React.ReactNode
  description?: React.ReactNode
}

function FieldControl(props: React.ComponentProps<typeof Slot.Root>)
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  Field,
  FieldControl,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function FieldDemo() {
  const [email, setEmail] = React.useState("name@")
  const emailError = /^\S+@\S+\.\S+$/.test(email)
    ? undefined
    : "Enter a valid email address."

  return (
    <form
      className="w-full max-w-[640px]"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <FieldSet
        legend="Contact details"
        description="We only use these to send your receipt."
      >
        <FieldGroup>
          <Field label="First name" required>
            {(p) => <Input {...p} autoComplete="given-name" />}
          </Field>
          <Field label="Last name" required>
            {(p) => <Input {...p} autoComplete="family-name" />}
          </Field>
          <Field
            data-span="full"
            label="Email"
            required
            hint="Receipts are sent here."
            error={emailError}
          >
            {(p) => (
              <Input
                {...p}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </Field>
          <Field label="Country">
            <Select defaultValue="us">
              <FieldControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FieldControl>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Company" hint="Optional.">
            {(p) => <Input {...p} />}
          </Field>
          <Field data-span="full" label="Notes" hint="Anything we should know?">
            <FieldControl>
              <Textarea rows={3} />
            </FieldControl>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/field. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
