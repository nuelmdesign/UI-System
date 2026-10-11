"use client"

import { EtaIndicator } from "@/components/ui/eta-indicator"

const NOW = "2026-03-14T14:00:00Z"

export default function EtaIndicatorDemo() {
  return (
    <div className="grid w-full max-w-[720px] gap-4 min-[600px]:grid-cols-2">
      <EtaIndicator
        title="Parcel delivery"
        now={NOW}
        eta="2026-03-14T15:20:00Z"
        earliest="2026-03-14T14:50:00Z"
        latest="2026-03-14T16:30:00Z"
        confidence={0.82}
        updatedAt="2026-03-14T13:56:00Z"
        timeZone="Europe/Berlin"
      />
      <EtaIndicator
        title="Clinician arrival"
        now={NOW}
        eta="2026-03-14T14:35:00Z"
        earliest="2026-03-14T14:20:00Z"
        latest="2026-03-14T15:30:00Z"
        confidence={0.41}
        updatedAt="2026-03-14T13:20:00Z"
        timeZone="America/New_York"
        labels={{ eta: "Expected on site", stale: "Out of date" }}
      />
    </div>
  )
}
