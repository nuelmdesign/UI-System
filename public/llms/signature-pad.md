# Signature Pad

Canvas signature capture with undo, clear and a typed-name alternative, for delivery, consent and sign-off.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/signature-pad
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SignaturePad } from "@/components/ui/signature-pad"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/input`

## Props and types

```ts
type SignaturePadMode = "draw" | "type"

type SignaturePadLabels = {
  /** Visible label above the pad. */
  label: string
  /** Placeholder shown while the pad is empty. */
  empty: string
  clear: string
  undo: string
  /** Confirm button, shown when `onSign` is set. */
  sign: string
  draw: string
  type: string
  typedLabel: string
  typedPlaceholder: string
  /** Accessible name of the drawing surface. */
  canvas: string
  /** Live announcement once a signature exists. */
  captured: string
  /** Live announcement after clearing. */
  cleared: string
}

type SignaturePadResult = {
  dataUrl: string
  mode: SignaturePadMode
  /** The typed name, when mode is "type". */
  name?: string
}

type SignaturePadProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "children"
> & {
  /** Called with a PNG data URL after each stroke, undo or typed change, or null when empty. */
  onChange?: (dataUrl: string | null) => void
  /** Called when the person confirms with the sign button. The button is hidden when omitted. */
  onSign?: (result: SignaturePadResult) => void
  /** Offer a typed-name alternative for keyboard and assistive-tech users. */
  allowTyped?: boolean
  disabled?: boolean
  /** Stroke width in CSS pixels. */
  strokeWidth?: number
  /** Height of the drawing surface in CSS pixels. */
  height?: number
  labels?: Partial<SignaturePadLabels>
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/signature-pad. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
