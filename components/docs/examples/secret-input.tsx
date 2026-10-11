"use client"

import * as React from "react"

import { Field } from "@/components/ui/field"
import { SecretInput } from "@/components/ui/secret-input"

export default function SecretInputDemo() {
  const [token, setToken] = React.useState("tok_live_8f3a91c2d7b04e65")
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Field label="Access token" hint="Hides itself after 10 seconds.">
        {(c) => (
          <SecretInput
            {...c}
            value={token}
            onChange={setToken}
            autoHideMs={10000}
          />
        )}
      </Field>
      <Field label="National ID number" hint="Masked with a custom character.">
        {(c) => (
          <SecretInput
            {...c}
            defaultValue="482-19-7730"
            mask="*"
            copyable={false}
            labels={{ show: "Reveal number", hide: "Hide number" }}
          />
        )}
      </Field>
    </div>
  )
}
