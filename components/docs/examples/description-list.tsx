import {
  DescriptionList,
  type DescriptionItem,
} from "@/components/ui/description-list"

const shipment: DescriptionItem[] = [
  { label: "Tracking number", value: "SHP-204518", mono: true, copyable: true },
  { label: "Carrier", value: "Example Freight" },
  { label: "Status", value: "In transit" },
  { label: "Origin", value: "Rotterdam, NL" },
  { label: "Destination", value: "Chicago, US" },
  { label: "ETA", value: "2026-03-18", mono: true },
  { label: "Handling notes", value: "", span: 3 },
]

const employee: DescriptionItem[] = [
  { label: "Name", value: "Sam Example" },
  { label: "Employee ID", value: "E-10482", mono: true, copyable: true },
  { label: "Email", value: "sam@example.com", copyable: true },
  { label: "Department", value: "Operations" },
  { label: "Start date", value: "2025-09-01", mono: true },
  { label: "Manager", value: "Jo Example" },
]

export default function DescriptionListDemo() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Shipment</h3>
        <DescriptionList
          items={shipment}
          bordered
          labels={{ empty: "None recorded" }}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Employee record</h3>
        <DescriptionList items={employee} columns={2} bordered />
      </section>
    </div>
  )
}
