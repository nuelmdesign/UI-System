# Status Indicator

Shape plus word status (operational, degraded, down, maintenance) and an uptime bar of segments with an accessible summary.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/status-indicator
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { StatusIndicator, UptimeBar } from "@/components/ui/status-indicator"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type StatusKind =
  "operational" | "degraded" | "down" | "maintenance" | "unknown"

type StatusTone = "success" | "warning" | "destructive" | "brand" | "muted"

type StatusShape = "dot" | "half" | "ring" | "square" | "dash"

type StatusIndicatorProps = Omit<React.ComponentProps<"span">, "children"> & {
  status?: StatusKind
  /** Override the colour tone (for custom statuses). */
  tone?: StatusTone
  /** Override the label text. */
  label?: React.ReactNode
  /** Shape for custom statuses; defaults to the status shape. */
  shape?: StatusShape
  /** Visually hide the label (kept for screen readers). */
  hideLabel?: boolean
  /** Animate a soft halo for live states. Respects reduced motion. */
  pulse?: boolean
}

type UptimeSegment = { status: StatusKind; label?: string }

type UptimeBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  segments: UptimeSegment[]
  /** Percent text, e.g. "99.98%". Shown in mono beside the bar. */
  uptime?: React.ReactNode
  /** Name used in the accessible summary, e.g. "API gateway". */
  name?: string
  /** Unit for the accessible summary. */
  unit?: string
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/status-indicator. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
