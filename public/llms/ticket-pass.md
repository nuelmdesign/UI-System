# Ticket Pass

Digital ticket card with a title band, details grid, tear line, QR stub and a status badge.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/ticket-pass
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { TicketPass } from "@/components/ui/ticket-pass"
```

## Dependencies

- npm: `class-variance-authority`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/qr-code`, `@opendraft/badge`

## Props and types

```ts
type TicketPassStatus = "valid" | "used" | "expired" | "void"

type TicketPassField = {
  label: string
  value: React.ReactNode
}

type TicketPassProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Event or trip title. */
  title: React.ReactNode
  /** Small label above the title, e.g. "Admit one". */
  eyebrow?: React.ReactNode
  /** Label/value pairs shown in the meta grid. */
  fields: TicketPassField[]
  /** The string encoded in the QR code and shown under it. */
  code: string
  status?: TicketPassStatus
  /** Render the header band dark in either theme. */
  dark?: boolean
  /** Buttons or links rendered below the stub. */
  actions?: React.ReactNode
}
```

## Variants

- `dark`: `true`, `false` (default)

## Example

```tsx
import { Button } from "@/components/ui/button"
import { TicketPass } from "@/components/ui/ticket-pass"

const fields = [
  { label: "Date", value: <span className="font-mono">12 Nov 2026</span> },
  { label: "Doors", value: <span className="font-mono">19:00</span> },
  { label: "Venue", value: "Harbour Hall" },
  { label: "Section", value: "Floor A" },
  { label: "Seat", value: <span className="font-mono">14 / 22</span> },
  { label: "Tier", value: "General" },
]

export default function TicketPassDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <TicketPass
        eyebrow="Admit one"
        title="Autumn Sessions: Live"
        fields={fields}
        code="TKT-8F2K-41Q9"
        actions={
          <>
            <Button size="sm">Add to wallet</Button>
            <Button size="sm" variant="outline">
              Share
            </Button>
          </>
        }
      />
      <TicketPass
        dark
        eyebrow="Boarding pass"
        title="Lisbon to Berlin"
        fields={fields.slice(0, 4)}
        code="BRD-20X7-93LM"
        status="used"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <TicketPass
          title="Workshop day"
          fields={fields.slice(0, 2)}
          code="WSD-1102"
          status="expired"
        />
        <TicketPass
          title="Workshop day"
          fields={fields.slice(0, 2)}
          code="WSD-1103"
          status="void"
        />
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/ticket-pass. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
