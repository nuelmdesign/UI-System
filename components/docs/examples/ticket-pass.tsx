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
