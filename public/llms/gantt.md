# Gantt

Task bars on a day, week or month axis with dependency arrows, groups, today marker and critical flags.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/gantt
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Gantt } from "@/components/ui/gantt"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`, `@opendraft/badge`, `@opendraft/button`

## Props and types

```ts
export type GanttDate = string | Date

export type GanttZoom = "day" | "week" | "month"

export type GanttTone = "default" | "brand" | "success" | "warning"

export type GanttTask = {
  id: string
  label: string
  start: GanttDate
  end: GanttDate
  /** 0-100. Leave out when progress is not tracked (then a task is never "overdue"). */
  progress?: number
  /** Ids of tasks that must finish before this one starts. */
  dependsOn?: string[]
  /** Tasks sharing a group value are listed under one collapsible header. */
  group?: string
  tone?: GanttTone
}

/** Fixed copy. Placeholders in braces: {value} {count} {label} {names}. */
export type GanttLabels = {
  chart: string
  task: string
  zoom: string
  day: string
  week: string
  month: string
  today: string
  critical: string
  overdue: string
  complete: string
  /** Uses {value}. */
  progress: string
  /** Uses {names}. */
  dependsOn: string
  /** Uses {label}. */
  collapse: string
  /** Uses {label}. */
  expand: string
  /** Uses {count}. */
  tasks: string
  noTasks: string
}

export type GanttProps = {
  tasks?: GanttTask[]
  zoom?: GanttZoom
  defaultZoom?: GanttZoom
  onZoomChange?: (zoom: GanttZoom) => void
  /** Group values that are collapsed. */
  collapsed?: string[]
  defaultCollapsed?: string[]
  onCollapsedChange?: (collapsed: string[]) => void
  /** Current time for the today marker and overdue checks. Passed in, never read from the clock. */
  now?: GanttDate
  /**
   * Task ids drawn as critical. Defaults to the chain of driving dependencies that
   * ends at the latest finishing task.
   */
  criticalIds?: string[]
  /** IANA zone for day boundaries and labels. Default "UTC". */
  timeZone?: string
  locale?: string
  onTaskClick?: (task: GanttTask) => void
  labels?: Partial<GanttLabels>
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { Gantt, type GanttTask } from "@/components/ui/gantt"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Domain = "construction" | "launch"

const CONSTRUCTION: GanttTask[] = [
  {
    id: "c1",
    group: "Site",
    label: "Survey and permits",
    start: "2026-08-17",
    end: "2026-09-04",
    progress: 100,
  },
  {
    id: "c2",
    group: "Site",
    label: "Excavation",
    start: "2026-09-04",
    end: "2026-09-25",
    progress: 100,
    dependsOn: ["c1"],
  },
  {
    id: "c3",
    group: "Structure",
    label: "Foundations",
    start: "2026-09-21",
    end: "2026-10-09",
    progress: 70,
    dependsOn: ["c2"],
  },
  {
    id: "c4",
    group: "Structure",
    label: "Frame",
    start: "2026-10-09",
    end: "2026-11-13",
    progress: 20,
    dependsOn: ["c3"],
  },
  {
    id: "c5",
    group: "Structure",
    label: "Roof",
    start: "2026-11-09",
    end: "2026-11-27",
    progress: 0,
    dependsOn: ["c4"],
  },
  {
    id: "c6",
    group: "Services",
    label: "Plumbing rough-in",
    start: "2026-10-19",
    end: "2026-11-06",
    progress: 10,
    dependsOn: ["c3"],
    tone: "success",
  },
  {
    id: "c7",
    group: "Services",
    label: "Electrical rough-in",
    start: "2026-11-02",
    end: "2026-11-20",
    progress: 0,
    dependsOn: ["c4", "c6"],
    tone: "success",
  },
  {
    id: "c8",
    label: "Handover",
    start: "2026-12-07",
    end: "2026-12-11",
    dependsOn: ["c5", "c7"],
  },
]

const LAUNCH: GanttTask[] = [
  {
    id: "l1",
    group: "Plan",
    label: "Positioning brief",
    start: "2026-09-14",
    end: "2026-09-25",
    progress: 100,
  },
  {
    id: "l2",
    group: "Plan",
    label: "Pricing decision",
    start: "2026-09-21",
    end: "2026-10-02",
    progress: 80,
    dependsOn: ["l1"],
  },
  {
    id: "l3",
    group: "Build",
    label: "Core features",
    start: "2026-09-28",
    end: "2026-10-30",
    progress: 55,
    dependsOn: ["l1"],
  },
  {
    id: "l4",
    group: "Build",
    label: "Beta feedback fixes",
    start: "2026-10-30",
    end: "2026-11-13",
    progress: 0,
    dependsOn: ["l3"],
  },
  {
    id: "l5",
    group: "Market",
    label: "Landing page",
    start: "2026-10-05",
    end: "2026-10-23",
    progress: 40,
    dependsOn: ["l2"],
    tone: "success",
  },
  {
    id: "l6",
    group: "Market",
    label: "Launch campaign",
    start: "2026-11-02",
    end: "2026-11-20",
    progress: 0,
    dependsOn: ["l5", "l4"],
    tone: "success",
  },
  {
    id: "l7",
    label: "Public launch",
    start: "2026-11-20",
    end: "2026-11-23",
    dependsOn: ["l4", "l6"],
  },
]

export default function GanttDemo() {
  const [domain, setDomain] = React.useState<Domain>("construction")
  const [picked, setPicked] = React.useState("")

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={domain} onValueChange={(v) => setDomain(v as Domain)}>
          <TabsList>
            <TabsTrigger value="construction">Construction plan</TabsTrigger>
            <TabsTrigger value="launch">Product launch</TabsTrigger>
          </TabsList>
        </Tabs>
        <p
          className="font-mono text-xs text-muted-foreground"
          aria-live="polite"
        >
          {picked}
        </p>
      </div>
      <Gantt
        key={domain}
        className="h-[480px]"
        tasks={domain === "construction" ? CONSTRUCTION : LAUNCH}
        now="2026-10-13T12:00:00Z"
        defaultZoom="week"
        onTaskClick={(t) => setPicked(t.label)}
        labels={
          domain === "construction"
            ? { task: "Work package", tasks: "{count} packages" }
            : { task: "Deliverable", tasks: "{count} deliverables" }
        }
      />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/gantt. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
