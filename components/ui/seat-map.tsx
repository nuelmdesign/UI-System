"use client"

import * as React from "react"
import { Ban, Check, Star, X } from "lucide-react"

import { cn } from "@/lib/utils"

/* ── types ── */

type SeatState = "available" | "selected" | "occupied" | "blocked" | "premium"

type SeatInfo = {
  /** Defaults to "available". "selected" is derived from the selection. */
  state?: Exclude<SeatState, "selected">
  /** Price in the smallest display unit you pass to `formatValue`. */
  price?: number
  /** Free text tier name, e.g. "Exit row" or "Circle". Shown in the readout. */
  tier?: string
}

/**
 * Layout rows, one string per row. `s` is a seat, `.` an aisle (narrow gap),
 * `_` an empty cell the size of a seat (a missing seat, a pillar).
 */
type SeatLayoutObject = {
  rows: string[]
  /** One label per row; defaults to A, B, C... */
  rowLabels?: string[]
  /** One label per grid column (aisles included, ignored for them); defaults to 1, 2, 3... counted per row. */
  columnLabels?: string[]
}
type SeatLayout = string[] | SeatLayoutObject

type SeatMapLabels = {
  legend: string
  front: string
  available: string
  selected: string
  occupied: string
  blocked: string
  premium: string
  none: string
  total: string
  maxReached: (max: number) => string
  /** Row label shown to assistive tech. */
  row: (label: string) => string
  /** Accessible description of one seat. */
  seat: (p: {
    id: string
    stateLabel: string
    price?: string
    tier?: string
  }) => string
  map: string
}

type SeatMapChange = { id: string; row: number; col: number } & SeatInfo

type SeatMapProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "defaultValue" | "children"
> & {
  layout?: SeatLayout
  /** Per-seat info by seat id (row label + column label, e.g. "12A"). */
  seats?: Record<string, SeatInfo>
  /** Computed alternative to `seats`; takes precedence when it returns a value. */
  getSeat?: (id: string, row: number, col: number) => SeatInfo | undefined
  /** Controlled selection (seat ids). */
  value?: string[]
  defaultValue?: string[]
  /** Maximum selectable seats. With 1, picking another seat replaces the first. */
  max?: number
  onChange?: (ids: string[], seats: SeatMapChange[]) => void
  /** Formats prices. Defaults to `Intl` with `currency` if given, else plain number. */
  formatValue?: (value: number) => string
  currency?: string
  locale?: string
  /** Hide the legend or the selection summary. */
  showLegend?: boolean
  showSummary?: boolean
  readOnly?: boolean
  labels?: Partial<SeatMapLabels>
}

const DEFAULT_LABELS: SeatMapLabels = {
  legend: "Legend",
  front: "Front",
  available: "Available",
  selected: "Selected",
  occupied: "Occupied",
  blocked: "Not available",
  premium: "Premium",
  none: "No seats selected",
  total: "Total",
  maxReached: (max) => `Maximum of ${max} reached`,
  row: (label) => `Row ${label}`,
  seat: ({ id, stateLabel, price, tier }) =>
    [id, stateLabel, tier !== stateLabel ? tier : undefined, price]
      .filter(Boolean)
      .join(", "),
  map: "Seat map",
}

/* ── sample data ── */

const SAMPLE_SEAT_LAYOUT: SeatLayoutObject = {
  rows: [
    "ss.ss.ss",
    "ss.ss.ss",
    "ss.ss.ss",
    "ss.ss.ss",
    "ss.ss.ss",
    "ss.ss.ss",
  ],
  rowLabels: ["A", "B", "C", "D", "E", "F"],
}

const SAMPLE_SEATS: Record<string, SeatInfo> = {
  A1: { state: "premium", price: 40 },
  A2: { state: "premium", price: 40 },
  A4: { state: "premium", price: 40 },
  A5: { state: "premium", price: 40 },
  A7: { state: "premium", price: 40 },
  A8: { state: "premium", price: 40 },
  B3: { state: "occupied" },
  B4: { state: "occupied" },
  C1: { state: "blocked" },
  D6: { state: "occupied" },
  D7: { state: "occupied" },
}

/* ── helpers ── */

type Cell = {
  kind: "seat" | "aisle" | "gap"
  col: number
  id?: string
}

function parseLayout(layout: SeatLayout) {
  const obj: SeatLayoutObject = Array.isArray(layout)
    ? { rows: layout }
    : layout
  const rowLabels = obj.rowLabels ?? []
  const rows = obj.rows.map((line, r) => {
    const rowLabel =
      rowLabels[r] ??
      String.fromCharCode(65 + (r % 26)).repeat(Math.floor(r / 26) + 1)
    let seatNo = 0
    const cells: Cell[] = [...line].map((ch, col) => {
      if (ch === ".") return { kind: "aisle", col }
      if (ch === "_" || ch === " ") return { kind: "gap", col }
      seatNo += 1
      const colLabel = obj.columnLabels?.[col] ?? String(seatNo)
      return { kind: "seat", col, id: `${rowLabel}${colLabel}` }
    })
    return { rowLabel, cells }
  })
  return rows
}

const STATE_ICON = {
  premium: Star,
  occupied: X,
  blocked: Ban,
  selected: Check,
  available: null,
} as const

const SEAT_STYLE: Record<SeatState, string> = {
  available: "border-foreground/40 bg-background hover:border-foreground",
  premium: "border-brand bg-brand/10 text-brand hover:bg-brand/20 border-2",
  selected: "border-ink bg-ink text-ink-foreground",
  occupied:
    "cursor-not-allowed border-dashed border-border bg-muted text-muted-foreground",
  blocked:
    "cursor-not-allowed border-dotted border-border bg-transparent text-muted-foreground",
}

function Swatch({
  state,
  className,
}: {
  state: SeatState
  className?: string
}) {
  const Icon = STATE_ICON[state]
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-7 items-center justify-center rounded-sm border",
        SEAT_STYLE[state],
        "pointer-events-none cursor-default",
        className
      )}
    >
      {Icon && <Icon className="size-3.5" />}
    </span>
  )
}

/* ── component ── */

function SeatMap({
  layout = SAMPLE_SEAT_LAYOUT,
  seats = SAMPLE_SEATS,
  getSeat,
  value,
  defaultValue,
  max = Infinity,
  onChange,
  formatValue,
  currency,
  locale = "en-US",
  showLegend = true,
  showSummary = true,
  readOnly = false,
  labels: labelsProp,
  className,
  ...props
}: SeatMapProps) {
  const labels = React.useMemo(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  )
  const rows = React.useMemo(() => parseLayout(layout), [layout])
  const [inner, setInner] = React.useState<string[]>(defaultValue ?? [])
  const selected = value ?? inner
  const selectedSet = React.useMemo(() => new Set(selected), [selected])
  const [notice, setNotice] = React.useState("")
  const [active, setActive] = React.useState<[number, number] | null>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const fmt = React.useCallback(
    (n: number) => {
      if (formatValue) return formatValue(n)
      return new Intl.NumberFormat(
        locale,
        currency
          ? { style: "currency", currency }
          : { maximumFractionDigits: 2 }
      ).format(n)
    },
    [formatValue, currency, locale]
  )

  const infoFor = React.useCallback(
    (id: string, r: number, c: number): SeatInfo =>
      getSeat?.(id, r, c) ?? seats[id] ?? {},
    [getSeat, seats]
  )

  // Seat positions as [rowIndex, cellIndex] for keyboard navigation.
  const seatPositions = React.useMemo(
    () =>
      rows.map((row) =>
        row.cells
          .map((c, i) => (c.kind === "seat" ? i : -1))
          .filter((i) => i >= 0)
      ),
    [rows]
  )
  const firstRow = seatPositions.findIndex((l) => l.length > 0)
  const firstSeat: [number, number] | null =
    firstRow >= 0 ? [firstRow, seatPositions[firstRow][0]] : null

  const focusSeat = active ?? firstSeat

  function commit(ids: string[]) {
    if (value === undefined) setInner(ids)
    const details: SeatMapChange[] = []
    rows.forEach((row, r) =>
      row.cells.forEach((c) => {
        if (c.kind === "seat" && c.id && ids.includes(c.id))
          details.push({
            id: c.id,
            row: r,
            col: c.col,
            ...infoFor(c.id, r, c.col),
          })
      })
    )
    onChange?.(ids, details)
  }

  function toggle(id: string, r: number, c: number) {
    if (readOnly) return
    const state = infoFor(id, r, c).state ?? "available"
    if (state === "occupied" || state === "blocked") return
    setNotice("")
    if (selectedSet.has(id)) return commit(selected.filter((s) => s !== id))
    if (max === 1) return commit([id])
    if (selected.length >= max) return setNotice(labels.maxReached(max))
    commit([...selected, id])
  }

  function move(r: number, i: number, dr: number, di: number) {
    let nr = r
    let ni = i
    if (di !== 0) {
      const list = seatPositions[r]
      const at = list.indexOf(i)
      const to = list[at + di]
      if (to === undefined) return
      ni = to
    } else {
      nr = r + dr
      while (nr >= 0 && nr < rows.length && !seatPositions[nr].length) nr += dr
      if (nr < 0 || nr >= rows.length) return
      // nearest column in the target row
      const col = rows[r].cells[i].col
      ni = seatPositions[nr].reduce((best, idx) =>
        Math.abs(rows[nr].cells[idx].col - col) <
        Math.abs(rows[nr].cells[best].col - col)
          ? idx
          : best
      )
    }
    setActive([nr, ni])
    requestAnimationFrame(() =>
      gridRef.current
        ?.querySelector<HTMLElement>(`[data-pos="${nr}-${ni}"]`)
        ?.focus()
    )
  }

  function onKeyDown(
    e: React.KeyboardEvent,
    r: number,
    i: number,
    id: string,
    col: number
  ) {
    const k = e.key
    if (k === "ArrowRight") move(r, i, 0, 1)
    else if (k === "ArrowLeft") move(r, i, 0, -1)
    else if (k === "ArrowDown") move(r, i, 1, 0)
    else if (k === "ArrowUp") move(r, i, -1, 0)
    else if (k === "Home" || k === "End") {
      let rr = r
      if (e.ctrlKey) {
        const filled = seatPositions.flatMap((l, idx) =>
          l.length ? [idx] : []
        )
        rr = k === "Home" ? filled[0] : filled[filled.length - 1]
      }
      const list = seatPositions[rr]
      const target = list[k === "Home" ? 0 : list.length - 1]
      setActive([rr, target])
      requestAnimationFrame(() =>
        gridRef.current
          ?.querySelector<HTMLElement>(`[data-pos="${rr}-${target}"]`)
          ?.focus()
      )
    } else if (k === " " || k === "Enter") toggle(id, r, col)
    else return
    e.preventDefault()
  }

  const stateLabel: Record<SeatState, string> = {
    available: labels.available,
    selected: labels.selected,
    occupied: labels.occupied,
    blocked: labels.blocked,
    premium: labels.premium,
  }

  let total = 0
  let anyPrice = false
  const selectedDetails: { id: string; info: SeatInfo }[] = []
  rows.forEach((row, r) =>
    row.cells.forEach((c) => {
      if (c.kind === "seat" && c.id && selectedSet.has(c.id)) {
        const info = infoFor(c.id, r, c.col)
        selectedDetails.push({ id: c.id, info })
        if (info.price !== undefined) {
          total += info.price
          anyPrice = true
        }
      }
    })
  )

  return (
    <div
      data-slot="seat-map"
      className={cn(
        "@container/seatmap flex w-full min-w-0 flex-col gap-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-3 @xl/seatmap:flex-row @xl/seatmap:items-start @xl/seatmap:justify-between">
        <div className="max-w-full overflow-x-auto">
          {labels.front && (
            <div className="mx-auto mb-3 w-full border-b border-dashed pb-1.5 text-center eyebrow text-muted-foreground">
              {labels.front}
            </div>
          )}
          <div
            ref={gridRef}
            role="grid"
            aria-label={labels.map}
            aria-multiselectable={max !== 1}
            aria-readonly={readOnly || undefined}
            className="mx-auto flex w-max flex-col gap-1.5 px-1 py-1"
          >
            {rows.map((row, r) => (
              <div
                key={r}
                role="row"
                aria-label={labels.row(row.rowLabel)}
                className="flex items-center gap-1.5"
              >
                <span
                  aria-hidden
                  className="w-6 shrink-0 text-right font-mono text-[11px] text-muted-foreground tabular-nums"
                >
                  {row.rowLabel}
                </span>
                {row.cells.map((c, i) => {
                  if (c.kind !== "seat" || !c.id) {
                    return (
                      <span
                        key={i}
                        role="presentation"
                        aria-hidden
                        className={c.kind === "aisle" ? "w-4" : "size-9"}
                      />
                    )
                  }
                  const info = infoFor(c.id, r, c.col)
                  const base = info.state ?? "available"
                  const isSel = selectedSet.has(c.id)
                  const state: SeatState = isSel ? "selected" : base
                  const disabled = base === "occupied" || base === "blocked"
                  const Icon = STATE_ICON[state]
                  const priceText =
                    info.price !== undefined ? fmt(info.price) : undefined
                  const isTab =
                    focusSeat !== null &&
                    focusSeat[0] === r &&
                    focusSeat[1] === i
                  const colText = c.id.slice(row.rowLabel.length)
                  return (
                    <div
                      key={i}
                      role="gridcell"
                      data-pos={`${r}-${i}`}
                      data-state={state}
                      aria-selected={disabled ? undefined : isSel}
                      aria-disabled={disabled || undefined}
                      aria-label={labels.seat({
                        id: c.id,
                        stateLabel: stateLabel[state],
                        price: priceText,
                        tier: info.tier,
                      })}
                      title={labels.seat({
                        id: c.id,
                        stateLabel: stateLabel[state],
                        price: priceText,
                        tier: info.tier,
                      })}
                      tabIndex={isTab ? 0 : -1}
                      onFocus={() => setActive([r, i])}
                      onClick={() => toggle(c.id!, r, c.col)}
                      onKeyDown={(e) => onKeyDown(e, r, i, c.id!, c.col)}
                      className={cn(
                        "relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm border text-[11px] font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                        SEAT_STYLE[state]
                      )}
                    >
                      {Icon && state !== "premium" ? (
                        <Icon aria-hidden className="size-4" />
                      ) : (
                        <span aria-hidden className="font-mono tabular-nums">
                          {colText}
                        </span>
                      )}
                      {state === "premium" && (
                        <Star
                          aria-hidden
                          className="absolute top-0.5 right-0.5 size-2.5 fill-current"
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {(showLegend || showSummary) && (
          <div className="flex w-full flex-col gap-4 @xl/seatmap:w-56 @xl/seatmap:shrink-0">
            {showLegend && (
              <ul
                data-slot="seat-map-legend"
                aria-label={labels.legend}
                className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs @xl/seatmap:grid-cols-1"
              >
                {(
                  [
                    "available",
                    "premium",
                    "selected",
                    "occupied",
                    "blocked",
                  ] as const
                ).map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <Swatch state={s} />
                    {stateLabel[s]}
                  </li>
                ))}
              </ul>
            )}
            {showSummary && (
              <div
                data-slot="seat-map-summary"
                className="flex flex-col gap-2 border-t pt-3 text-sm"
              >
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col gap-1.5"
                >
                  {selectedDetails.length === 0 ? (
                    <span className="text-muted-foreground">{labels.none}</span>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {selectedDetails.map(({ id, info }) => (
                        <li key={id} className="flex justify-between gap-2">
                          <span className="font-mono">
                            {id}
                            {info.tier && (
                              <span className="ml-2 font-sans text-xs text-muted-foreground">
                                {info.tier}
                              </span>
                            )}
                          </span>
                          {info.price !== undefined && (
                            <span className="font-mono tabular-nums">
                              {fmt(info.price)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {notice && (
                    <span className="text-xs text-muted-foreground">
                      {notice}
                    </span>
                  )}
                </div>
                {anyPrice && (
                  <div className="flex justify-between border-t pt-2 font-medium">
                    <span>{labels.total}</span>
                    <span className="font-mono tabular-nums">{fmt(total)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { SeatMap, SAMPLE_SEAT_LAYOUT, SAMPLE_SEATS }
export type {
  SeatMapProps,
  SeatMapLabels,
  SeatMapChange,
  SeatInfo,
  SeatState,
  SeatLayout,
  SeatLayoutObject,
}
