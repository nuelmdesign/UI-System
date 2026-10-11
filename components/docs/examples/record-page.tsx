import { Button } from "@/components/ui/button"
import { RecordPage } from "@/components/blocks/record-page"

const frame = "h-[680px] w-full overflow-hidden rounded-lg border bg-background"

function ShipmentView() {
  return (
    <RecordPage
      id="SHP-48213"
      title="Pallet order to Rotterdam"
      subtitle="Dock 4 to Port of Rotterdam, 12 pallets"
      status={{ label: "In transit", tone: "brand" }}
      actions={
        <>
          <Button variant="outline">Reassign</Button>
          <Button>Mark delivered</Button>
        </>
      }
      summary={[
        { label: "Weight", value: "4,120 kg" },
        { label: "ETA", value: "Oct 14", hint: "On schedule" },
        {
          label: "Distance",
          value: "1,240 km",
          delta: { value: "3%", direction: "down", goodWhen: "down" },
        },
      ]}
      fields={[
        { label: "Carrier", value: "Northline Freight" },
        { label: "Origin", value: "Dock 4, Antwerp" },
        { label: "Destination", value: "Port of Rotterdam" },
        { label: "Tracking", value: "TRK-90017732", mono: true },
        { label: "Picked up", value: "2026-10-09 07:40", mono: true },
        { label: "Customs note", value: "Cleared for export.", wide: true },
      ]}
      activity={[
        {
          time: "Oct 11, 06:10",
          timestamp: "2026-10-11T06:10:00Z",
          title: "Departed hub",
          meta: "Antwerp",
          status: "current",
        },
        {
          time: "Oct 10, 18:02",
          timestamp: "2026-10-10T18:02:00Z",
          title: "Customs cleared",
          status: "success",
        },
        {
          time: "Oct 9, 07:40",
          timestamp: "2026-10-09T07:40:00Z",
          title: "Picked up",
          status: "success",
        },
      ]}
      related={[
        {
          id: "i1",
          title: "Invoice 2291",
          meta: "INV-2291",
          status: { label: "Paid", tone: "success" },
          onSelect: () => {},
        },
        {
          id: "i2",
          title: "Return label",
          meta: "RTN-118",
          status: { label: "Pending", tone: "warning" },
          onSelect: () => {},
        },
      ]}
      labels={{ related: "Linked documents" }}
    />
  )
}

function EmployeeView() {
  return (
    <RecordPage
      id="EMP-0231"
      title="Jordan Lee"
      subtitle="Senior designer, Product team"
      status={{ label: "On leave", tone: "warning" }}
      actions={<Button variant="outline">Edit profile</Button>}
      summary={[
        { label: "Tenure", value: "4.2 y" },
        { label: "Leave left", value: "11 d" },
        { label: "Reviews", value: "8" },
        { label: "Direct reports", value: "2" },
      ]}
      fields={[
        { label: "Manager", value: "Priya Nair" },
        { label: "Location", value: "Lisbon" },
        { label: "Email", value: "jordan.lee@example.com", mono: true },
        { label: "Start date", value: "2022-07-18", mono: true },
        { label: "Cost centre", value: null },
        { label: "Equipment", value: "Laptop, monitor" },
      ]}
      activity={[
        {
          time: "Oct 1",
          timestamp: "2026-10-01T00:00:00Z",
          title: "Leave started",
          description: "Parental leave until Jan 12.",
          status: "warning",
        },
        {
          time: "Jul 15",
          timestamp: "2026-07-15T00:00:00Z",
          title: "Promotion approved",
          status: "success",
        },
      ]}
      related={[{ id: "p1", title: "Priya Nair", meta: "Manager", href: "#" }]}
      labels={{
        details: "Profile",
        related: "People",
        noActivity: "No history",
      }}
    />
  )
}

export default function RecordPageDemo() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className={frame}>
        <ShipmentView />
      </div>
      <div className={frame}>
        <EmployeeView />
      </div>
    </div>
  )
}
