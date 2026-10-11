"use client"

import * as React from "react"
import {
  Check,
  ChevronDown,
  CircleMinus,
  CircleX,
  Info,
  Minus,
  Plus,
  Scan,
  TriangleAlert,
} from "lucide-react"
import type {
  ExpressionSpecification,
  GeoJSONSource,
  Map as MapLibreMap,
  Marker as MapLibreMarker,
  StyleSpecification,
} from "maplibre-gl"
// Global stylesheet for the map canvas, markers container and attribution.
// Next 16 accepts global CSS imported from node_modules inside any component.
import "maplibre-gl/dist/maplibre-gl.css"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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

const DEFAULT_LABELS: MapViewLabels = {
  map: "Map",
  loading: "Loading map",
  list: "Locations",
  showList: "Show list",
  hideList: "Hide list",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  fit: "Fit to all locations",
  empty: "No locations to show.",
  routes: "Routes",
  areas: "Areas",
  selected: "Selected",
  errorTitle: "The map could not be loaded",
  errorDescription:
    "This browser could not start WebGL. The list still has every location.",
  count: (n) => `${n} ${n === 1 ? "location" : "locations"}`,
  status: {
    ok: "Normal",
    warning: "Warning",
    critical: "Critical",
    info: "Info",
    offline: "Offline",
  },
}

/* -------------------------------------------------------------------------- */
/* Sample data (neutral, real-looking coordinates)                            */
/* -------------------------------------------------------------------------- */

const SAMPLE_MAP_MARKERS: MapViewMarker[] = [
  { id: "m1", lng: -87.65, lat: 41.88, label: "Item 1", status: "ok" },
  { id: "m2", lng: -87.72, lat: 41.93, label: "Item 2", status: "warning" },
  { id: "m3", lng: -87.6, lat: 41.82, label: "Item 3", status: "critical" },
  { id: "m4", lng: -87.8, lat: 41.86, label: "Item 4", status: "offline" },
]

/* -------------------------------------------------------------------------- */
/* Tokens -> concrete colors MapLibre can parse                               */
/* -------------------------------------------------------------------------- */

const TOKEN_NAMES = [
  "brand",
  "foreground",
  "border",
  "muted",
  "background",
  "success",
  "warning",
  "destructive",
] as const

type TokenColors = Record<(typeof TOKEN_NAMES)[number], string>

/**
 * Tokens are oklch()/color-mix() values, which MapLibre's color parser cannot
 * read. Resolve each token with a probe element, then let a canvas convert the
 * computed color to plain rgba.
 */
function readTokens(host: HTMLElement): TokenColors {
  const probe = document.createElement("span")
  probe.setAttribute("aria-hidden", "true")
  probe.style.display = "none"
  host.appendChild(probe)
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  const out = {} as TokenColors
  for (const name of TOKEN_NAMES) {
    probe.style.color = ""
    probe.style.color = `var(--${name})`
    const computed = getComputedStyle(probe).color
    let rgba = computed
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1)
      ctx.fillStyle = "#000"
      ctx.fillStyle = computed
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
      rgba = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`
    }
    out[name] = rgba
  }
  probe.remove()
  return out
}

function toneExpression(c: TokenColors): ExpressionSpecification {
  return [
    "match",
    ["get", "tone"],
    "destructive",
    c.destructive,
    "success",
    c.success,
    "warning",
    c.warning,
    "neutral",
    c.foreground,
    c.brand,
  ]
}

/* -------------------------------------------------------------------------- */
/* Map helpers                                                                */
/* -------------------------------------------------------------------------- */

const SRC_ROUTES = "od-routes"
const SRC_AREAS = "od-areas"

/** Offline-safe default: no tiles, no network, just a background layer. */
function blankStyle(background: string): StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": background },
      },
    ],
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function statusTone(status?: MapStatus): MapTone {
  switch (status) {
    case "ok":
      return "success"
    case "warning":
      return "warning"
    case "critical":
      return "destructive"
    case "info":
      return "brand"
    default:
      return "neutral"
  }
}

function dataBounds(
  markers: MapViewMarker[],
  routes: MapViewRoute[],
  areas: MapViewArea[]
): [LngLat, LngLat] | null {
  let w = Infinity
  let s = Infinity
  let e = -Infinity
  let n = -Infinity
  const add = (lng: number, lat: number) => {
    w = Math.min(w, lng)
    e = Math.max(e, lng)
    s = Math.min(s, lat)
    n = Math.max(n, lat)
  }
  markers.forEach((m) => add(m.lng, m.lat))
  routes.forEach((r) => r.coordinates.forEach(([x, y]) => add(x, y)))
  areas.forEach((a) => a.coordinates.forEach(([x, y]) => add(x, y)))
  return Number.isFinite(w)
    ? [
        [w, s],
        [e, n],
      ]
    : null
}

function overlayData(routes: MapViewRoute[], areas: MapViewArea[]) {
  return {
    routes: {
      type: "FeatureCollection" as const,
      features: routes.map((r) => ({
        type: "Feature" as const,
        properties: {
          id: r.id,
          dashed: !!r.dashed,
          tone: r.tone ?? "brand",
        },
        geometry: { type: "LineString" as const, coordinates: r.coordinates },
      })),
    },
    areas: {
      type: "FeatureCollection" as const,
      features: areas.map((a) => {
        const ring = [...a.coordinates]
        const first = ring[0]
        const last = ring[ring.length - 1]
        if (first && last && (first[0] !== last[0] || first[1] !== last[1]))
          ring.push(first)
        return {
          type: "Feature" as const,
          properties: { id: a.id, tone: a.tone ?? "destructive" },
          geometry: { type: "Polygon" as const, coordinates: [ring] },
        }
      }),
    },
  }
}

/** Idempotent: adds sources/layers if missing, then refreshes data + colors. */
function applyOverlays(
  map: MapLibreMap,
  routes: MapViewRoute[],
  areas: MapViewArea[],
  c: TokenColors,
  ownsStyle: boolean
) {
  try {
    const data = overlayData(routes, areas)
    if (!map.getSource(SRC_AREAS)) {
      map.addSource(SRC_AREAS, { type: "geojson", data: data.areas })
      map.addSource(SRC_ROUTES, { type: "geojson", data: data.routes })
      map.addLayer({
        id: "od-area-fill",
        type: "fill",
        source: SRC_AREAS,
        paint: { "fill-opacity": 0.16 },
      })
      map.addLayer({
        id: "od-area-line",
        type: "line",
        source: SRC_AREAS,
        paint: { "line-width": 1.5, "line-dasharray": [3, 2] },
      })
      map.addLayer({
        id: "od-route-casing",
        type: "line",
        source: SRC_ROUTES,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-width": 6, "line-opacity": 0.85 },
      })
      map.addLayer({
        id: "od-route-solid",
        type: "line",
        source: SRC_ROUTES,
        filter: ["!=", ["get", "dashed"], true],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-width": 3 },
      })
      map.addLayer({
        id: "od-route-dashed",
        type: "line",
        source: SRC_ROUTES,
        filter: ["==", ["get", "dashed"], true],
        layout: { "line-join": "round" },
        paint: { "line-width": 3, "line-dasharray": [2, 2] },
      })
    } else {
      ;(map.getSource(SRC_AREAS) as GeoJSONSource).setData(data.areas)
      ;(map.getSource(SRC_ROUTES) as GeoJSONSource).setData(data.routes)
    }
    const tone = toneExpression(c)
    map.setPaintProperty("od-area-fill", "fill-color", tone)
    map.setPaintProperty("od-area-line", "line-color", tone)
    map.setPaintProperty("od-route-casing", "line-color", c.background)
    map.setPaintProperty("od-route-solid", "line-color", tone)
    map.setPaintProperty("od-route-dashed", "line-color", tone)
    if (ownsStyle && map.getLayer("background"))
      map.setPaintProperty("background", "background-color", c.muted)
  } catch {
    // Style not ready yet; the "style.load" handler runs this again.
  }
}

/* -------------------------------------------------------------------------- */
/* DOM marker                                                                 */
/* -------------------------------------------------------------------------- */

const GLYPHS: Record<MapStatus | "none", string> = {
  ok: '<path d="M3 8.5l3.2 3.2L13 4.8"/>',
  warning: '<path d="M8 3v6M8 12v.01"/>',
  critical: '<path d="M4 4l8 8M12 4l-8 8"/>',
  info: '<path d="M8 7v5M8 4v.01"/>',
  offline: '<path d="M4 8h8"/>',
  none: '<circle cx="8" cy="8" r="2.5"/>',
}

const TONE_BORDER: Record<MapTone, string> = {
  brand: "border-brand",
  success: "border-success",
  warning: "border-warning",
  destructive: "border-destructive",
  neutral: "border-foreground/60",
}

function buildMarkerElement(
  marker: MapViewMarker,
  statusText: string | undefined,
  onPick: () => void
) {
  const tone = marker.tone ?? statusTone(marker.status)
  const el = document.createElement("button")
  el.type = "button"
  el.dataset.slot = "map-view-marker"
  el.className = "group relative block size-7 cursor-pointer outline-none"
  el.setAttribute(
    "aria-label",
    statusText ? `${marker.label}, ${statusText}` : marker.label
  )
  el.setAttribute("aria-pressed", "false")

  const body = document.createElement("span")
  body.className = cn(
    "grid size-7 place-items-center rounded-sm border-2 bg-card text-foreground transition-transform duration-150 ease-out",
    "group-hover:scale-110 group-focus-visible:ring-[3px] group-focus-visible:ring-ring group-data-[selected=true]:scale-110 group-data-[selected=true]:bg-foreground group-data-[selected=true]:text-background",
    TONE_BORDER[tone]
  )
  body.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[marker.status ?? "none"]}</svg>`

  const tip = document.createElement("span")
  tip.setAttribute("aria-hidden", "true")
  tip.className = cn(
    "pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 rounded-sm border bg-popover px-2 py-1 text-left text-xs whitespace-nowrap text-popover-foreground",
    "group-hover:block group-focus-visible:block group-data-[selected=true]:block"
  )
  const name = document.createElement("span")
  name.className = "block font-medium"
  name.textContent = marker.label
  tip.appendChild(name)
  if (statusText) {
    const st = document.createElement("span")
    st.className = "eyebrow block"
    st.textContent = statusText
    tip.appendChild(st)
  }

  el.append(body, tip)
  el.addEventListener("click", (event) => {
    event.stopPropagation()
    onPick()
  })
  return el
}

/* -------------------------------------------------------------------------- */
/* Status icon (React, for the list)                                          */
/* -------------------------------------------------------------------------- */

const STATUS_ICON = {
  ok: Check,
  warning: TriangleAlert,
  critical: CircleX,
  info: Info,
  offline: CircleMinus,
} as const

const TONE_TEXT: Record<MapTone, string> = {
  brand: "text-brand",
  success: "text-success",
  warning: "text-[color-mix(in_oklch,var(--warning)_70%,var(--foreground))]",
  destructive: "text-destructive",
  neutral: "text-muted-foreground",
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

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

function MapView<T = unknown>({
  markers = SAMPLE_MAP_MARKERS as MapViewMarker<T>[],
  routes,
  areas,
  styleUrl,
  attribution,
  center = [0, 0],
  zoom = 2,
  bounds,
  fitToData = false,
  selectedId: selectedIdProp,
  defaultSelectedId = null,
  onSelect,
  onMove,
  renderListItem,
  defaultListOpen = true,
  labels: labelsProp,
  className,
  ...props
}: MapViewProps<T>) {
  const labels = React.useMemo<MapViewLabels>(
    () => ({
      ...DEFAULT_LABELS,
      ...labelsProp,
      status: { ...DEFAULT_LABELS.status, ...labelsProp?.status },
    }),
    [labelsProp]
  )
  const statusKey = Object.values(labels.status).join("|")
  const routeList = React.useMemo(() => routes ?? [], [routes])
  const areaList = React.useMemo(() => areas ?? [], [areas])

  const listId = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<MapLibreMap | null>(null)
  const glRef = React.useRef<typeof import("maplibre-gl") | null>(null)
  const markerRefs = React.useRef<Map<string, MapLibreMarker>>(new Map())
  const fittedRef = React.useRef(false)
  const selectedMarkerId = React.useRef<string | null>(null)
  const styleRef = React.useRef<MapViewProps["styleUrl"]>(styleUrl)

  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const [tokens, setTokens] = React.useState<TokenColors | null>(null)
  const [listOpen, setListOpen] = React.useState(defaultListOpen)
  const [innerSelected, setInnerSelected] = React.useState<string | null>(
    defaultSelectedId
  )
  const selectedId =
    selectedIdProp !== undefined ? selectedIdProp : innerSelected
  const selected = markers.find((m) => m.id === selectedId)

  const select = (id: string | null) => {
    if (selectedIdProp === undefined) setInnerSelected(id)
    onSelect?.(id, id ? markers.find((m) => m.id === id) : undefined)
  }

  // Latest props for async callbacks, without writing refs during render.
  const latest = React.useRef({
    markers,
    routes: routeList,
    areas: areaList,
    tokens,
    center,
    zoom,
    bounds,
    fitToData,
    styleUrl,
    attribution,
    onMove,
    select,
    labels,
  })
  React.useEffect(() => {
    latest.current = {
      markers,
      routes: routeList,
      areas: areaList,
      tokens,
      center,
      zoom,
      bounds,
      fitToData,
      styleUrl,
      attribution,
      onMove,
      select,
      labels,
    }
  })

  const fitBoundsKey = React.useMemo(() => {
    const b =
      bounds ?? (fitToData ? dataBounds(markers, routeList, areaList) : null)
    return b ? b.flat().join(",") : ""
  }, [bounds, fitToData, markers, routeList, areaList])

  // Create the map once, in the browser only.
  React.useEffect(() => {
    let cancelled = false
    let observer: MutationObserver | undefined
    const host = rootRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return

    void (async () => {
      let gl: typeof import("maplibre-gl")
      try {
        const probe = document.createElement("canvas")
        if (!probe.getContext("webgl2") && !probe.getContext("webgl"))
          throw new Error("webgl")
        gl = await import("maplibre-gl")
      } catch {
        if (!cancelled) setFailed(true)
        return
      }
      if (cancelled) return
      glRef.current = gl
      const colors = readTokens(host)
      const cur = latest.current
      let map: MapLibreMap
      try {
        map = new gl.Map({
          container: canvas,
          style: cur.styleUrl ?? blankStyle(colors.muted),
          center: cur.center,
          zoom: cur.zoom,
          attributionControl: {
            compact: true,
            customAttribution: cur.attribution,
          },
        })
      } catch {
        setFailed(true)
        return
      }
      mapRef.current = map
      map.keyboard.enable()
      map.on("style.load", () => {
        const l = latest.current
        if (l.tokens)
          applyOverlays(map, l.routes, l.areas, l.tokens, !l.styleUrl)
      })
      map.on("load", () => {
        if (!cancelled) setReady(true)
      })
      map.on("moveend", () => {
        const l = latest.current
        if (!l.onMove) return
        const c = map.getCenter()
        const b = map.getBounds()
        l.onMove({
          center: [c.lng, c.lat],
          zoom: map.getZoom(),
          bounds: [
            [b.getWest(), b.getSouth()],
            [b.getEast(), b.getNorth()],
          ],
        })
      })
      map.on("error", (e) => {
        // Tile/style fetch problems are not fatal; the overlay data still draws.
        if (process.env.NODE_ENV !== "production") console.warn(e.error)
      })
      setTokens(colors)
      observer = new MutationObserver(() => {
        if (!cancelled) setTokens(readTokens(host))
      })
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "style"],
      })
    })()

    const markerMap = markerRefs.current
    return () => {
      cancelled = true
      observer?.disconnect()
      markerMap.forEach((m) => m.remove())
      markerMap.clear()
      mapRef.current?.remove()
      mapRef.current = null
      setReady(false)
    }
  }, [])

  // Swap the style when the prop changes after mount.
  React.useEffect(() => {
    const map = mapRef.current
    if (!ready || !map || styleRef.current === styleUrl) return
    styleRef.current = styleUrl
    map.setStyle(styleUrl ?? blankStyle(tokens?.muted ?? "#eee"))
  }, [styleUrl, ready, tokens])

  // Routes, areas and theme colors.
  React.useEffect(() => {
    const map = mapRef.current
    if (!ready || !map || !tokens) return
    applyOverlays(map, routeList, areaList, tokens, !styleUrl)
  }, [ready, tokens, routeList, areaList, styleUrl])

  // DOM markers.
  React.useEffect(() => {
    const map = mapRef.current
    const gl = glRef.current
    if (!ready || !map || !gl) return
    const store = markerRefs.current
    markers.forEach((m) => {
      const statusText = m.status
        ? latest.current.labels.status[m.status]
        : undefined
      const el = buildMarkerElement(m, statusText, () =>
        latest.current.select(m.id === selectedMarkerId.current ? null : m.id)
      )
      el.setAttribute("data-marker-id", m.id)
      const marker = new gl.Marker({ element: el, anchor: "center" })
        .setLngLat([m.lng, m.lat])
        .addTo(map)
      store.set(m.id, marker)
    })
    return () => {
      store.forEach((m) => m.remove())
      store.clear()
    }
  }, [ready, markers, statusKey])

  React.useEffect(() => {
    selectedMarkerId.current = selectedId
    markerRefs.current.forEach((marker, id) => {
      const el = marker.getElement()
      const on = id === selectedId
      el.setAttribute("aria-pressed", String(on))
      el.dataset.selected = String(on)
      marker.getElement().style.zIndex = on ? "2" : ""
    })
  }, [selectedId, ready, markers, statusKey])

  // Initial/explicit view and refits.
  React.useEffect(() => {
    const map = mapRef.current
    if (!ready || !map || !fitBoundsKey) return
    const l = latest.current
    const target =
      l.bounds ??
      (l.fitToData ? dataBounds(l.markers, l.routes, l.areas) : null)
    if (!target) return
    const animate = fittedRef.current && !prefersReducedMotion()
    fittedRef.current = true
    map.fitBounds(target, {
      padding: 56,
      maxZoom: 14,
      duration: animate ? 600 : 0,
    })
  }, [ready, fitBoundsKey])

  // Fly to the selected marker.
  React.useEffect(() => {
    const map = mapRef.current
    if (!ready || !map || !selectedId) return
    const m = latest.current.markers.find((x) => x.id === selectedId)
    if (!m) return
    const target = {
      center: [m.lng, m.lat] as LngLat,
      zoom: Math.max(map.getZoom(), 4),
    }
    if (prefersReducedMotion()) map.jumpTo(target)
    else map.flyTo({ ...target, essential: false })
  }, [selectedId, ready])

  const zoomBy = (delta: number) => {
    const map = mapRef.current
    if (!map) return
    if (prefersReducedMotion()) map.jumpTo({ zoom: map.getZoom() + delta })
    else map.easeTo({ zoom: map.getZoom() + delta, duration: 200 })
  }
  const fitAll = () => {
    const map = mapRef.current
    const b = dataBounds(markers, routeList, areaList)
    if (!map || !b) return
    map.fitBounds(b, {
      padding: 56,
      maxZoom: 14,
      duration: prefersReducedMotion() ? 0 : 600,
    })
  }

  const selectedStatus = selected?.status
    ? labels.status[selected.status]
    : undefined

  return (
    <div
      data-slot="map-view"
      className={cn("@container/map-view h-full min-h-72 w-full", className)}
      {...props}
    >
      <div
        ref={rootRef}
        className="flex h-full min-h-0 flex-col border bg-background @3xl/map-view:flex-row"
      >
        <div
          role="region"
          aria-label={labels.map}
          className="relative min-h-64 flex-1 overflow-hidden bg-muted"
        >
          <div
            ref={canvasRef}
            data-slot="map-view-canvas"
            className="absolute inset-0"
            hidden={failed}
          />
          {failed && (
            <div
              role="alert"
              className="absolute inset-0 grid place-items-center"
            >
              <EmptyState
                size="sm"
                icon={<TriangleAlert />}
                title={labels.errorTitle}
                description={labels.errorDescription}
              />
            </div>
          )}
          {!ready && !failed && (
            <p
              role="status"
              className="absolute top-3 left-3 border bg-card px-2 py-1 eyebrow text-muted-foreground"
            >
              {labels.loading}
            </p>
          )}
          {!failed && (
            <div
              data-slot="map-view-controls"
              className="absolute top-3 right-3 flex flex-col gap-1"
            >
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={labels.zoomIn}
                onClick={() => zoomBy(1)}
              >
                <Plus />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={labels.zoomOut}
                onClick={() => zoomBy(-1)}
              >
                <Minus />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={labels.fit}
                onClick={fitAll}
              >
                <Scan />
              </Button>
            </div>
          )}
          <p aria-live="polite" className="sr-only">
            {selected
              ? `${labels.selected}: ${selected.label}${selectedStatus ? `, ${selectedStatus}` : ""}`
              : ""}
          </p>
        </div>

        <section
          data-slot="map-view-list"
          aria-label={labels.list}
          className={cn(
            "flex min-h-0 flex-col border-t bg-card @3xl/map-view:w-72 @3xl/map-view:shrink-0 @3xl/map-view:border-t-0 @3xl/map-view:border-l",
            listOpen && "max-h-[45%] @3xl/map-view:max-h-none"
          )}
        >
          <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
            <div className="flex min-w-0 items-baseline gap-2">
              <h3 className="eyebrow">{labels.list}</h3>
              <span className="font-mono text-xs text-muted-foreground">
                {labels.count(markers.length)}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              aria-expanded={listOpen}
              aria-controls={listId}
              onClick={() => setListOpen((v) => !v)}
            >
              {listOpen ? labels.hideList : labels.showList}
              <ChevronDown
                className={cn("transition-transform", listOpen && "rotate-180")}
              />
            </Button>
          </div>
          <div
            id={listId}
            hidden={!listOpen}
            className="min-h-0 flex-1 overflow-y-auto"
          >
            {markers.length === 0 ? (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                {labels.empty}
              </p>
            ) : (
              <ul className="divide-y">
                {markers.map((m) => {
                  const tone = m.tone ?? statusTone(m.status)
                  const Icon = m.status ? STATUS_ICON[m.status] : null
                  const isSelected = m.id === selectedId
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => select(isSelected ? null : m.id)}
                        className={cn(
                          "flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset",
                          isSelected && "bg-accent"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {Icon && (
                            <Icon
                              aria-hidden
                              className={cn(
                                "size-3.5 shrink-0",
                                TONE_TEXT[tone]
                              )}
                            />
                          )}
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {m.label}
                          </span>
                          {m.status && (
                            <span className="shrink-0 eyebrow">
                              {labels.status[m.status]}
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {m.lat.toFixed(3)}, {m.lng.toFixed(3)}
                        </span>
                        {renderListItem?.(m)}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
            {routeList.some((r) => r.label) && (
              <OverlayNames
                title={labels.routes}
                names={routeList.flatMap((r) => (r.label ? [r.label] : []))}
              />
            )}
            {areaList.some((a) => a.label) && (
              <OverlayNames
                title={labels.areas}
                names={areaList.flatMap((a) => (a.label ? [a.label] : []))}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function OverlayNames({ title, names }: { title: string; names: string[] }) {
  return (
    <div className="border-t px-3 py-2">
      <h4 className="mb-1 eyebrow">{title}</h4>
      <ul className="text-sm text-muted-foreground">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  )
}

export { MapView, SAMPLE_MAP_MARKERS, DEFAULT_LABELS as MAP_VIEW_LABELS }
export type {
  LngLat,
  MapStatus,
  MapTone,
  MapViewArea,
  MapViewLabels,
  MapViewMarker,
  MapViewProps,
  MapViewRoute,
  MapViewport,
}
