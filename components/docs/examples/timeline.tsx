"use client"

import { MapPin, Package, Truck } from "lucide-react"

import { Timeline, TimelineItem } from "@/components/ui/timeline"

const incident = [
  {
    time: "14:52",
    timestamp: "2026-03-12T14:52:00Z",
    title: "Incident resolved",
    description: "Error rate back under 0.1% for 30 minutes.",
    meta: "Dana R., on-call",
    status: "success" as const,
  },
  {
    time: "14:21",
    timestamp: "2026-03-12T14:21:00Z",
    title: "Rollback in progress",
    description: "Reverting release 4.12.0 on all regions.",
    meta: "Deploy pipeline",
    status: "current" as const,
  },
  {
    time: "14:05",
    timestamp: "2026-03-12T14:05:00Z",
    title: "Checkout latency degraded",
    description: "p95 above 4s, elevated 5xx from the payments service.",
    meta: "Monitoring",
    status: "warning" as const,
    children: "Alert: payments-api p95 > 2s for 5 minutes. Runbook: RB-204.",
  },
  {
    time: "13:58",
    timestamp: "2026-03-12T13:58:00Z",
    title: "Database failover failed",
    description: "Replica promotion timed out.",
    meta: "Primary cluster",
    status: "destructive" as const,
  },
  {
    time: "13:40",
    timestamp: "2026-03-12T13:40:00Z",
    title: "Release 4.12.0 deployed",
    meta: "Alex M.",
  },
]

export default function TimelineDemo() {
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h3 className="eyebrow text-muted-foreground">
          Incident, newest first, collapsible
        </h3>
        <Timeline
          aria-label="Incident timeline"
          items={incident}
          newestFirst
          collapsible
          max={3}
          align="right-time"
        />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="eyebrow text-muted-foreground">
          Shipment tracking, composable
        </h3>
        <Timeline aria-label="Shipment tracking">
          <TimelineItem
            time="Mar 10"
            timestamp="2026-03-10"
            title="Order placed"
            meta="Online"
            status="success"
            icon={<Package className="size-3.5" />}
          />
          <TimelineItem
            time="Mar 11"
            timestamp="2026-03-11"
            title="Departed facility"
            meta={
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> Rotterdam, NL
              </span>
            }
            status="success"
          />
          <TimelineItem
            time="Mar 12"
            timestamp="2026-03-12"
            title="In transit"
            description="Arriving at the local depot."
            meta="Hamburg, DE"
            status="current"
            icon={<Truck className="size-3.5" />}
          />
          <TimelineItem
            time="Mar 13"
            title="Out for delivery"
            status="upcoming"
          />
          <TimelineItem time="Mar 14" title="Delivered" status="upcoming" />
        </Timeline>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <Timeline loading aria-label="Loading history" />
        <Timeline items={[]} emptyLabel="No history for this case" />
      </section>
    </div>
  )
}
