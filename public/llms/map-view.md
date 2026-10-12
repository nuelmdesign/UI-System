# Map View

Token-styled MapLibre GL map with focusable markers, routes and areas, and a synced keyboard list, for fleets, outages, assets and stores.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/map-view
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { MapView } from "@/components/ui/map-view"
```

## Dependencies

- npm: `maplibre-gl`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/utils`, `@opendraft/button`, `@opendraft/empty-state`

## Props and types

```ts
type LngLat = [lng: number, lat: number]

type MapStatus = "ok" | "warning" | "critical" | "info" | "offline"

type MapTone = "brand" | "success" | "warning" | "destructive" | "neutral"

type MapViewMarker<T = unknown> = {
  id: string
  lng: number
  lat: number
  /** Visible on hover/focus, used as the accessible name and in the list. */
  label: string
  /** Shown as an icon plus text (never by color alone). */
  status?: MapStatus
  /** Overrides the color implied by `status`. */
  tone?: MapTone
  /** Your own record, handed back to `renderListItem`. */
  data?: T
}

type MapViewRoute = {
  id: string
  coordinates: LngLat[]
  label?: string
  dashed?: boolean
  tone?: MapTone
}

type MapViewArea = {
  id: string
  /** One outer ring; it is closed automatically. */
  coordinates: LngLat[]
  label?: string
  tone?: MapTone
}

type MapViewport = {
  center: LngLat
  zoom: number
  bounds: [LngLat, LngLat]
}

type MapViewLabels = {
  map: string
  loading: string
  list: string
  showList: string
  hideList: string
  zoomIn: string
  zoomOut: string
  fit: string
  empty: string
  routes: string
  areas: string
  selected: string
  errorTitle: string
  errorDescription: string
  count: (n: number) => string
  status: Record<MapStatus, string>
}

type MapViewProps<T = unknown> = Omit<
  React.ComponentProps<"div">,
  "onSelect" | "children"
> & {
  markers?: MapViewMarker<T>[]
  routes?: MapViewRoute[]
  areas?: MapViewArea[]
  /**
   * A MapLibre style URL or object. The default is an inline blank style (one
   * background layer) so the component works offline. Real products pass a tile
   * style, e.g. an OpenFreeMap, Protomaps or MapTiler style URL. Check that
   * provider's terms: most require visible attribution (OpenStreetMap
   * contributors plus the provider), which MapLibre shows in its attribution
   * control. Add `attribution` for sources the style does not declare.
   */
  /**
   * URL of MapLibre's worker file (`maplibre-gl/dist/maplibre-gl-worker.mjs`).
   * Bundlers such as Next/Turbopack and Vite move the library out of
   * node_modules, so its default worker location (next to the bundled chunk)
   * no longer exists. Copy that file to a public path (for example
   * `/maplibre/maplibre-gl-worker.mjs`) and pass the URL here.
   */
  workerUrl?: string
  styleUrl?: string | StyleSpecification
  /** Extra attribution text for the corner control. */
  attribution?: string | string[]
  center?: LngLat
  zoom?: number
  /** Initial/explicit view: [[west, south], [east, north]]. */
  bounds?: [LngLat, LngLat]
  /** Fit the view to markers, routes and areas, and refit when they change. */
  fitToData?: boolean
  selectedId?: string | null
  defaultSelectedId?: string | null
  onSelect?: (id: string | null, marker?: MapViewMarker<T>) => void
  /** Fires when a pan/zoom ends (not on every frame). */
  onMove?: (view: MapViewport) => void
  /** Extra row content in the list (type-safe via `marker.data`). */
  renderListItem?: (marker: MapViewMarker<T>) => React.ReactNode
  /** Start with the list expanded. Default true. */
  defaultListOpen?: boolean
  labels?: Partial<Omit<MapViewLabels, "status">> & {
    status?: Partial<MapViewLabels["status"]>
  }
}

function MapView(props: MapViewProps<T>)
```

## Example

```tsx
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
            workerUrl="/maplibre/maplibre-gl-worker.mjs"
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
            workerUrl="/maplibre/maplibre-gl-worker.mjs"
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
```

Live docs: https://ui-system-virid.vercel.app/docs/map-view. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
