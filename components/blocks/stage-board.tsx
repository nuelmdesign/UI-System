"use client"

import * as React from "react"
import { AlertTriangle, MoreHorizontal, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ease, spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

export interface StageBoardStage {
  id: string
  label: string
  /** Work-in-progress limit. Counts above it show an over-limit state. */
  limit?: number
}

export interface StageBoardCardState {
  stage: StageBoardStage
  /** Zero-based position inside the stage. */
  index: number
  dragging: boolean
  /** The stage holds more items than its limit. */
  overLimit: boolean
}

export interface StageBoardDetailContext {
  stage: StageBoardStage
  stages: StageBoardStage[]
  close: () => void
  /** Move the open item to another stage (appended at the end). */
  moveTo: (stageId: string) => void
}

export interface StageBoardLabels {
  eyebrow: string
  title: string
  /** Summary under the title. Tokens: {count}. */
  summary: string
  /** Empty column text. */
  empty: string
  /** Empty column text while an item is being dragged over it. */
  emptyDrop: string
  /** Aggregate caption on each column, e.g. "Total". */
  total: string
  limit: string
  atLimit: string
  overLimit: string
  /** Tokens: {stage}, {limit}. */
  limitReached: string
  openDetails: string
  /** Menu button name. Tokens: {item}. */
  actionsFor: string
  moveTo: string
  stage: string
  close: string
  detail: string
  /** Keyboard hint read with every card. */
  keyboardHint: string
  /** Live announcement. Tokens: {item}, {stage}, {position}, {total}. */
  moved: string
  /** Column landmark name. Tokens: {stage}. */
  stageRegion: string
}

export const STAGE_BOARD_LABELS: StageBoardLabels = {
  eyebrow: "",
  title: "Board",
  summary: "{count} items",
  empty: "No items",
  emptyDrop: "Drop here",
  total: "Total",
  limit: "Limit",
  atLimit: "At limit",
  overLimit: "Over limit",
  limitReached: "{stage} is at its limit of {limit}.",
  openDetails: "Open details",
  actionsFor: "Actions for {item}",
  moveTo: "Move to",
  stage: "Stage",
  close: "Close",
  detail: "Details",
  keyboardHint:
    "Press Alt with the left or right arrow to move between stages, or up or down to reorder.",
  moved: "{item} moved to {stage}, position {position} of {total}.",
  stageRegion: "{stage} stage",
}

export interface StageBoardProps<T> {
  stages: StageBoardStage[]
  items: T[]
  getItemId: (item: T) => string
  /** Stage id the item belongs to. Items with an unknown stage are not shown. */
  getStage: (item: T) => string
  /** Card content. Avoid interactive elements inside; the card is one button. */
  renderCard?: (item: T, state: StageBoardCardState) => React.ReactNode
  /** Plain-text name for announcements and menus. Defaults to the id. */
  getItemLabel?: (item: T) => string
  /**
   * Called for every move (drag, menu, keyboard). `index` is the item's
   * position in the destination stage after the move. The board is
   * controlled: update `items` in response.
   */
  onMove?: (itemId: string, toStage: string, index: number) => void
  /** Numeric value per item, summed into a per-stage aggregate. */
  getValue?: (item: T) => number
  /** Format the aggregate. Defaults to a plain locale number. */
  formatValue?: (value: number) => string
  /** Refuse moves into a stage that is already at its limit. Default false. */
  enforceLimits?: boolean
  /** Side panel content for the opened item. Omit to disable the panel. */
  renderDetail?: (item: T, ctx: StageBoardDetailContext) => React.ReactNode
  onOpen?: (item: T) => void
  /** Buttons or filters shown at the right of the header. */
  actions?: React.ReactNode
  labels?: Partial<StageBoardLabels>
  className?: string
}

export interface StageBoardSampleItem {
  id: string
  title: string
  stage: string
  assignee: string
  amount: number
}

export const SAMPLE_STAGE_BOARD_STAGES: StageBoardStage[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in-progress", label: "In progress", limit: 3 },
  { id: "review", label: "Review", limit: 2 },
  { id: "done", label: "Done" },
]

export const SAMPLE_STAGE_BOARD_ITEMS: StageBoardSampleItem[] = [
  {
    id: "item-1",
    title: "Item 1",
    stage: "backlog",
    assignee: "Alex Morgan",
    amount: 4,
  },
  {
    id: "item-2",
    title: "Item 2",
    stage: "backlog",
    assignee: "Sam Lee",
    amount: 2,
  },
  {
    id: "item-3",
    title: "Item 3",
    stage: "in-progress",
    assignee: "Alex Morgan",
    amount: 6,
  },
  {
    id: "item-4",
    title: "Item 4",
    stage: "in-progress",
    assignee: "Jo Rivera",
    amount: 3,
  },
  {
    id: "item-5",
    title: "Item 5",
    stage: "review",
    assignee: "Sam Lee",
    amount: 5,
  },
  {
    id: "item-6",
    title: "Item 6",
    stage: "done",
    assignee: "Jo Rivera",
    amount: 1,
  },
]

function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m
  )
}

const numberFormatter = new Intl.NumberFormat()

function StageBoard<T>({
  stages,
  items,
  getItemId,
  getStage,
  renderCard,
  getItemLabel,
  onMove,
  getValue,
  formatValue = (v) => numberFormatter.format(v),
  enforceLimits = false,
  renderDetail,
  onOpen,
  actions,
  labels: labelsProp,
  className,
}: StageBoardProps<T>) {
  const labels = React.useMemo(
    () => ({ ...STAGE_BOARD_LABELS, ...labelsProp }),
    [labelsProp]
  )
  const reduce = useReducedMotion()
  const hintId = React.useId()
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [over, setOver] = React.useState<{
    stage: string
    index: number
  } | null>(null)
  const [announcement, setAnnouncement] = React.useState("")
  const rootRef = React.useRef<HTMLDivElement>(null)
  const focusAfterMove = React.useRef<string | null>(null)

  const labelOf = React.useCallback(
    (item: T) => getItemLabel?.(item) ?? getItemId(item),
    [getItemLabel, getItemId]
  )

  const byStage = React.useMemo(() => {
    const map = new Map<string, T[]>(stages.map((s) => [s.id, []]))
    for (const item of items) map.get(getStage(item))?.push(item)
    return map
  }, [items, stages, getStage])

  const selected =
    selectedId === null
      ? null
      : (items.find((i) => getItemId(i) === selectedId) ?? null)

  // Keep keyboard focus on a card after it has moved to another column.
  React.useLayoutEffect(() => {
    const id = focusAfterMove.current
    if (!id) return
    focusAfterMove.current = null
    const el = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>("[data-card-open]") ?? []
    ).find((n) => n.dataset.cardOpen === id)
    el?.focus()
  }, [items])

  function isFull(stageId: string, itemId: string) {
    const stage = stages.find((s) => s.id === stageId)
    if (!enforceLimits || stage?.limit === undefined) return false
    const list = byStage.get(stageId) ?? []
    if (list.some((i) => getItemId(i) === itemId)) return false
    return list.length >= stage.limit
  }

  function move(itemId: string, toStage: string, index?: number) {
    const item = items.find((i) => getItemId(i) === itemId)
    const stage = stages.find((s) => s.id === toStage)
    if (!item || !stage) return
    const dest = (byStage.get(toStage) ?? []).filter(
      (i) => getItemId(i) !== itemId
    )
    const at = Math.max(0, Math.min(index ?? dest.length, dest.length))
    const sameStage = getStage(item) === toStage
    const current = (byStage.get(toStage) ?? []).findIndex(
      (i) => getItemId(i) === itemId
    )
    if (sameStage && current === at) return
    if (isFull(toStage, itemId)) {
      setAnnouncement(
        fill(labels.limitReached, {
          stage: stage.label,
          limit: stage.limit ?? 0,
        })
      )
      return
    }
    setAnnouncement(
      fill(labels.moved, {
        item: labelOf(item),
        stage: stage.label,
        position: at + 1,
        total: dest.length + 1,
      })
    )
    onMove?.(itemId, toStage, at)
  }

  function open(item: T) {
    setSelectedId(getItemId(item))
    onOpen?.(item)
  }

  function dropIndexFor(list: HTMLElement, clientY: number, skipId: string) {
    let index = 0
    for (const el of Array.from(
      list.querySelectorAll<HTMLElement>("[data-card-id]")
    )) {
      if (el.dataset.cardId === skipId) continue
      const r = el.getBoundingClientRect()
      if (clientY > r.top + r.height / 2) index++
    }
    return index
  }

  function keyMove(e: React.KeyboardEvent, item: T, stageId: string) {
    if (!e.altKey) return
    const id = getItemId(item)
    const si = stages.findIndex((s) => s.id === stageId)
    const list = byStage.get(stageId) ?? []
    const idx = list.findIndex((i) => getItemId(i) === id)
    let target: { stage: string; index: number } | null = null
    if (e.key === "ArrowLeft" && si > 0) {
      target = { stage: stages[si - 1].id, index: idx }
    } else if (e.key === "ArrowRight" && si < stages.length - 1) {
      target = { stage: stages[si + 1].id, index: idx }
    } else if (e.key === "ArrowUp" && idx > 0) {
      target = { stage: stageId, index: idx - 1 }
    } else if (e.key === "ArrowDown" && idx < list.length - 1) {
      target = { stage: stageId, index: idx + 1 }
    }
    e.preventDefault()
    if (!target) return
    focusAfterMove.current = id
    move(id, target.stage, target.index)
  }

  const shown = stages.reduce((n, s) => n + (byStage.get(s.id)?.length ?? 0), 0)

  return (
    <div
      ref={rootRef}
      data-slot="stage-board"
      className={cn(
        "@container/stage-board relative h-full min-h-0 w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex flex-col gap-3 border-b px-4 py-3 @md/stage-board:flex-row @md/stage-board:items-center">
          <div className="min-w-0 @md/stage-board:mr-auto">
            {labels.eyebrow && (
              <p className="eyebrow text-muted-foreground">{labels.eyebrow}</p>
            )}
            <h2 className="mt-1 flex flex-wrap items-baseline gap-x-3 heading text-2xl">
              {labels.title}
              <span className="font-mono text-sm text-muted-foreground">
                {fill(labels.summary, { count: shown })}
              </span>
            </h2>
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </header>

        <p id={hintId} className="sr-only">
          {labels.keyboardHint}
        </p>

        <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-4">
          {stages.map((stage) => {
            const list = byStage.get(stage.id) ?? []
            const count = list.length
            const limited = stage.limit !== undefined
            const overLimit = limited && count > stage.limit!
            const atLimit = limited && count === stage.limit
            const total = getValue
              ? list.reduce((s, i) => s + getValue(i), 0)
              : null
            const dropping = dragId !== null && over?.stage === stage.id
            const blocked = dragId !== null && isFull(stage.id, dragId)
            const dropIndex = dropping && !blocked ? over.index : -1
            let seen = 0
            return (
              <section
                key={stage.id}
                data-slot="stage-board-column"
                data-over-limit={overLimit || undefined}
                aria-label={fill(labels.stageRegion, { stage: stage.label })}
                onDragOver={(e) => {
                  if (!dragId) return
                  if (blocked) {
                    e.dataTransfer.dropEffect = "none"
                    setOver({ stage: stage.id, index: 0 })
                    return
                  }
                  e.preventDefault()
                  e.dataTransfer.dropEffect = "move"
                  const ul = e.currentTarget.querySelector<HTMLElement>("ul")
                  const index = ul ? dropIndexFor(ul, e.clientY, dragId) : 0
                  setOver((o) =>
                    o && o.stage === stage.id && o.index === index
                      ? o
                      : { stage: stage.id, index }
                  )
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOver((o) => (o?.stage === stage.id ? null : o))
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  const id = e.dataTransfer.getData("text/plain") || dragId
                  if (id && !blocked) {
                    const ul = e.currentTarget.querySelector<HTMLElement>("ul")
                    move(id, stage.id, ul ? dropIndexFor(ul, e.clientY, id) : 0)
                  } else if (id && blocked) {
                    move(id, stage.id)
                  }
                  setDragId(null)
                  setOver(null)
                }}
                className={cn(
                  "flex h-full w-[85cqw] shrink-0 flex-col rounded-lg border bg-surface transition-colors @md/stage-board:w-72",
                  dropping && !blocked && "border-brand bg-brand/5",
                  blocked && "border-dashed border-destructive",
                  overLimit && !dropping && "border-destructive"
                )}
              >
                <div className="flex flex-col gap-1.5 border-b px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate eyebrow">{stage.label}</h3>
                    <span
                      className="font-mono text-xs text-muted-foreground tabular-nums"
                      aria-label={
                        limited
                          ? `${count} / ${stage.limit} ${labels.limit.toLowerCase()}`
                          : undefined
                      }
                    >
                      {count}
                      {limited && ` / ${stage.limit}`}
                    </span>
                  </div>
                  {(overLimit || atLimit || total !== null) && (
                    <div className="flex items-center justify-between gap-2">
                      {overLimit ? (
                        <Badge variant="destructive">
                          <AlertTriangle aria-hidden />
                          {labels.overLimit}
                        </Badge>
                      ) : atLimit ? (
                        <Badge variant="warning">{labels.atLimit}</Badge>
                      ) : (
                        <span />
                      )}
                      {total !== null && (
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          <span className="sr-only">{labels.total} </span>
                          {formatValue(total)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
                  {count === 0 ? (
                    <li
                      className={cn(
                        "flex flex-1 items-center justify-center rounded-md border border-dashed bg-dots p-4 text-center text-xs text-muted-foreground",
                        dropping && !blocked && "border-brand text-brand"
                      )}
                    >
                      {dropping && !blocked ? labels.emptyDrop : labels.empty}
                    </li>
                  ) : (
                    list.map((item, index) => {
                      const id = getItemId(item)
                      const isDrag = dragId === id
                      const marker =
                        !isDrag && dropIndex === seen ? (
                          <li
                            key={`${id}-marker`}
                            aria-hidden
                            className="-my-1 h-0.5 shrink-0 bg-brand"
                          />
                        ) : null
                      if (!isDrag) seen++
                      return (
                        <React.Fragment key={id}>
                          {marker}
                          <BoardCard
                            id={id}
                            label={labelOf(item)}
                            hintId={hintId}
                            dragging={isDrag}
                            stages={stages}
                            currentStage={stage.id}
                            labels={labels}
                            isFull={(sid) => isFull(sid, id)}
                            onOpen={() => open(item)}
                            onMove={(to) => move(id, to)}
                            onKeyDown={(e) => keyMove(e, item, stage.id)}
                            onDragStart={() => setDragId(id)}
                            onDragEnd={() => {
                              setDragId(null)
                              setOver(null)
                            }}
                          >
                            {renderCard ? (
                              renderCard(item, {
                                stage,
                                index,
                                dragging: isDrag,
                                overLimit,
                              })
                            ) : (
                              <span className="text-sm font-medium">
                                {labelOf(item)}
                              </span>
                            )}
                          </BoardCard>
                        </React.Fragment>
                      )
                    })
                  )}
                  {dropIndex === seen && dropIndex > 0 && (
                    <li aria-hidden className="-my-1 h-0.5 shrink-0 bg-brand" />
                  )}
                </ul>
              </section>
            )
          })}
        </div>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      <AnimatePresence>
        {selected && renderDetail && (
          <>
            <motion.button
              key="scrim"
              type="button"
              aria-label={labels.close}
              tabIndex={-1}
              onClick={() => setSelectedId(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: ease.out }}
              className="absolute inset-0 z-20 cursor-default bg-background/60 backdrop-blur-[2px]"
            />
            <DetailPanel
              key="panel"
              title={labelOf(selected)}
              stages={stages}
              stageId={getStage(selected)}
              labels={labels}
              reduce={!!reduce}
              isFull={(sid) => isFull(sid, getItemId(selected))}
              onClose={() => setSelectedId(null)}
              onMove={(to) => move(getItemId(selected), to)}
            >
              {renderDetail(selected, {
                stage:
                  stages.find((s) => s.id === getStage(selected)) ?? stages[0],
                stages,
                close: () => setSelectedId(null),
                moveTo: (to) => move(getItemId(selected), to),
              })}
            </DetailPanel>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function BoardCard({
  id,
  label,
  hintId,
  dragging,
  stages,
  currentStage,
  labels,
  isFull,
  onOpen,
  onMove,
  onKeyDown,
  onDragStart,
  onDragEnd,
  children,
}: {
  id: string
  label: string
  hintId: string
  dragging: boolean
  stages: StageBoardStage[]
  currentStage: string
  labels: StageBoardLabels
  isFull: (stageId: string) => boolean
  onOpen: () => void
  onMove: (to: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onDragStart: () => void
  onDragEnd: () => void
  children: React.ReactNode
}) {
  return (
    <li
      data-slot="stage-board-card"
      data-card-id={id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", id)
        e.dataTransfer.effectAllowed = "move"
        onDragStart()
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative cursor-grab rounded-md border bg-card transition-[border-color,opacity] hover:border-foreground/25 active:cursor-grabbing",
        dragging && "opacity-40"
      )}
    >
      <button
        type="button"
        data-card-open={id}
        aria-describedby={hintId}
        onClick={onOpen}
        onKeyDown={onKeyDown}
        className="flex w-full flex-col gap-2 rounded-md p-3 pr-9 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
      >
        {children}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={fill(labels.actionsFor, { item: label })}
            className="absolute top-1.5 right-1.5"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={onOpen}>
            {labels.openDetails}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{labels.moveTo}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>{labels.stage}</DropdownMenuLabel>
              {stages.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  disabled={s.id === currentStage || isFull(s.id)}
                  onSelect={() => onMove(s.id)}
                >
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

function DetailPanel({
  title,
  stages,
  stageId,
  labels,
  reduce,
  isFull,
  onClose,
  onMove,
  children,
}: {
  title: string
  stages: StageBoardStage[]
  stageId: string
  labels: StageBoardLabels
  reduce: boolean
  isFull: (stageId: string) => boolean
  onClose: () => void
  onMove: (to: string) => void
  children: React.ReactNode
}) {
  const titleId = React.useId()
  const closeRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <motion.aside
      data-slot="stage-board-detail"
      role="dialog"
      aria-labelledby={titleId}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation()
          onClose()
        }
      }}
      initial={reduce ? { opacity: 0 } : { x: "100%" }}
      animate={reduce ? { opacity: 1 } : { x: 0 }}
      exit={reduce ? { opacity: 0 } : { x: "100%" }}
      transition={reduce ? { duration: 0.2, ease: ease.out } : spring.smooth}
      className="absolute inset-y-0 right-0 z-30 flex w-full max-w-md flex-col border-l bg-background"
    >
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <div className="min-w-0">
          <p className="eyebrow text-muted-foreground">{labels.detail}</p>
          <h3 id={titleId} className="mt-1 heading text-2xl">
            {title}
          </h3>
        </div>
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon-sm"
          aria-label={labels.close}
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
        <div className="space-y-1.5">
          <p className="eyebrow text-muted-foreground">{labels.stage}</p>
          <Select value={stageId} onValueChange={onMove}>
            <SelectTrigger aria-label={labels.stage} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.id}
                  disabled={s.id !== stageId && isFull(s.id)}
                >
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {children}
      </div>
    </motion.aside>
  )
}

export { StageBoard }
