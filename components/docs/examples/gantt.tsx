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
