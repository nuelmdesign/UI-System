"use client"

import * as React from "react"

import { MapView, type MapViewMarker } from "@/components/ui/map-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const FLEET: MapViewMarker<{ load: string }>[] = [
  {
    id: "v1",
    lng: 4.9,
    lat: 52.37,
    label: "Unit 101",
    status: "ok",
    data: { load: "12 stops left" },
  },
  {
    id: "v2",
    lng: 4.48,
    lat: 51.92,
    label: "Unit 102",
    status: "warning",
    data: { load: "Delayed 18 min" },
  },
  {
    id: "v3",
    lng: 5.12,
    lat: 52.09,
    label: "Unit 103",
    status: "ok",
    data: { load: "4 stops left" },
  },
  {
    id: "v4",
    lng: 4.3,
    lat: 52.08,
    label: "Depot",
    status: "info",
    data: { load: "Hub" },
  },
]

const FLEET_ROUTES = [
  {
    id: "r1",
    label: "Route A: Depot to Unit 101",
    coordinates: [
      [4.3, 52.08],
      [4.55, 52.2],
      [4.75, 52.3],
      [4.9, 52.37],
    ] as [number, number][],
  },
  {
    id: "r2",
    label: "Route B (planned)",
    dashed: true,
    coordinates: [
      [4.3, 52.08],
      [4.7, 52.02],
      [5.12, 52.09],
    ] as [number, number][],
  },
]

const OUTAGES: MapViewMarker[] = [
  {
    id: "s1",
    lng: -122.43,
    lat: 37.77,
    label: "Substation 1",
    status: "critical",
  },
  { id: "s2", lng: -122.27, lat: 37.8, label: "Substation 2", status: "ok" },
  {
    id: "s3",
    lng: -122.4,
    lat: 37.74,
    label: "Substation 3",
    status: "warning",
  },
  {
    id: "s4",
    lng: -122.48,
    lat: 37.74,
    label: "Substation 4",
    status: "offline",
  },
]

const OUTAGE_AREAS = [
  {
    id: "a1",
    label: "Affected zone 1",
    tone: "destructive" as const,
    coordinates: [
      [-122.46, 37.79],
      [-122.39, 37.8],
      [-122.38, 37.74],
      [-122.45, 37.73],
    ] as [number, number][],
  },
]

export default function MapViewDemo() {
  const [tab, setTab] = React.useState("fleet")
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full gap-3">
      <TabsList>
        <TabsTrigger value="fleet">Fleet</TabsTrigger>
        <TabsTrigger value="outages">Outages</TabsTrigger>
      </TabsList>
      <TabsContent value="fleet">
        <div className="h-[560px] w-full overflow-hidden rounded-lg border bg-background">
          <MapView
            markers={FLEET}
            routes={FLEET_ROUTES}
            fitToData
            defaultSelectedId="v2"
            labels={{ list: "Vehicles", count: (n) => `${n} units` }}
            renderListItem={(m) => (
              <span className="text-xs text-muted-foreground">
                {m.data?.load}
              </span>
            )}
          />
        </div>
      </TabsContent>
      <TabsContent value="outages">
        <div className="h-[560px] w-full overflow-hidden rounded-lg border bg-background">
          <MapView
            markers={OUTAGES}
            areas={OUTAGE_AREAS}
            fitToData
            labels={{
              list: "Sites",
              count: (n) => `${n} sites`,
              status: { critical: "Outage", ok: "Online" },
            }}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
