"use client"

import * as React from "react"

import { SignaturePad } from "@/components/ui/signature-pad"

export default function SignaturePadDemo() {
  const [delivery, setDelivery] = React.useState<string | null>(null)
  const [consent, setConsent] = React.useState<string | null>(null)

  return (
    <div className="grid w-full max-w-3xl gap-8 sm:grid-cols-2">
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Proof of delivery</h3>
        <SignaturePad
          labels={{
            label: "Recipient signature",
            empty: "Recipient signs here",
            sign: "Confirm delivery",
          }}
          onChange={setDelivery}
          onSign={() => {}}
        />
        <p className="font-mono text-xs text-muted-foreground">
          {delivery ? "Captured" : "Waiting for signature"}
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Patient consent</h3>
        <SignaturePad
          allowTyped
          labels={{
            label: "Patient or guardian",
            empty: "Sign to consent",
            typedLabel: "Type the patient's full name",
            sign: "Give consent",
          }}
          onChange={setConsent}
          onSign={() => {}}
        />
        <p className="font-mono text-xs text-muted-foreground">
          {consent ? "Captured" : "Waiting for consent"}
        </p>
      </section>
    </div>
  )
}
