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
