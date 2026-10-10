# Alert

Callout with a per-variant icon, optional dismiss, an actions slot and a full-bleed banner mode for system, weather and policy notices.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/alert
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
```

## Dependencies

- npm: `class-variance-authority`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>

type AlertProps = Omit<React.ComponentProps<"div">, "title"> &
  VariantProps<typeof alertVariants> & {
    /** Replace the default per-variant icon. */
    icon?: React.ReactNode
    /** Show a close button. */
    dismissible?: boolean
    onDismiss?: () => void
    dismissLabel?: string
  }

function AlertTitle(props: React.ComponentProps<"div">)

function AlertDescription(props: React.ComponentProps<"div">)

function AlertAction(props: React.ComponentProps<"div">)
```

## Variants

- `variant`: `default` (default), `info`, `success`, `warning`, `destructive`
- `banner`: `false` (default), `true`

## Example

```tsx
"use client"

import * as React from "react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert>
        <AlertTitle>Shipment SH-20418 updated</AlertTitle>
        <AlertDescription>
          Departure rescheduled to 06:40 from the Rotterdam hub.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The tracking API is read-only on Sunday, 02:00 to 04:00 UTC.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Customs cleared</AlertTitle>
        <AlertDescription>
          Container MSKU-7731905 is released for pickup.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Weather delay at LHR</AlertTitle>
        <AlertDescription>
          Crosswinds are causing 45 minute holds on departures.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">
            View affected flights
          </Button>
        </AlertAction>
      </Alert>
      {open && (
        <Alert
          variant="destructive"
          dismissible
          onDismiss={() => setOpen(false)}
        >
          <AlertTitle>Webhook delivery failing</AlertTitle>
          <AlertDescription>
            Endpoint returned 503 for the last 12 attempts.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              Retry now
            </Button>
          </AlertAction>
        </Alert>
      )}
      <Alert variant="warning" banner>
        <AlertTitle>Policy update</AlertTitle>
        <AlertDescription>
          New cargo declaration rules apply from 1 November.
        </AlertDescription>
      </Alert>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/alert. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
