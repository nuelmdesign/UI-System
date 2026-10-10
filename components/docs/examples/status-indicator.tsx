import { StatusIndicator, UptimeBar } from "@/components/ui/status-indicator"
import type {
  StatusKind,
  UptimeSegment,
} from "@/components/ui/status-indicator"

const pattern: StatusKind[] = ["degraded", "down", "maintenance", "unknown"]

function makeSegments(seed: number): UptimeSegment[] {
  return Array.from({ length: 90 }, (_, i) => {
    const day = 90 - i
    const hit = (i * 7 + seed) % 29 === 0
    return {
      status: hit ? pattern[(i + seed) % pattern.length] : "operational",
      label: `${day} days ago`,
    }
  })
}

const services = [
  { name: "Tracking API", status: "operational", uptime: "99.98%", seed: 3 },
  { name: "Booking portal", status: "degraded", uptime: "99.41%", seed: 5 },
  { name: "Customs gateway", status: "down", uptime: "98.72%", seed: 11 },
] as const

export default function StatusIndicatorDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <StatusIndicator status="operational" pulse />
        <StatusIndicator status="degraded" />
        <StatusIndicator status="down" />
        <StatusIndicator status="maintenance" />
        <StatusIndicator status="unknown" />
        <StatusIndicator tone="brand" label="In transit" />
        <StatusIndicator status="operational" hideLabel label="Online" />
      </div>
      <div className="flex flex-col gap-5">
        {services.map((s) => (
          <div key={s.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{s.name}</span>
              <StatusIndicator status={s.status} />
            </div>
            <UptimeBar
              name={s.name}
              unit="days"
              segments={makeSegments(s.seed)}
              uptime={s.uptime}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
