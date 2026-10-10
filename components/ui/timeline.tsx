"use client"

import * as React from "react"
import { Check, ChevronDown, TriangleAlert, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

type TimelineStatus =
  "default" | "success" | "warning" | "destructive" | "current" | "upcoming"

type TimelineAlign = "left" | "right-time"

type TimelineItemData = {
  /** Display time. Rendered in mono. */
  time?: React.ReactNode
  /** ISO 8601 value; renders the time inside a `<time dateTime>` element. */
  timestamp?: string
  title: React.ReactNode
  description?: React.ReactNode
  /** Secondary line, e.g. location or actor. */
  meta?: React.ReactNode
  /** Replaces the status glyph inside the marker. */
  icon?: React.ReactNode
  status?: TimelineStatus
  /** Screen-reader text for the status. Defaults to a built-in label. */
  statusLabel?: string
  /** Expandable detail or attachments, shown in a disclosure. */
  children?: React.ReactNode
  /** Label of the disclosure toggle. */
  detailLabel?: React.ReactNode
  /** Start with the detail open. */
  defaultOpen?: boolean
}

type TimelineItemProps = TimelineItemData &
  Omit<React.ComponentProps<"li">, "title" | "children">

type TimelineProps = Omit<React.ComponentProps<"ol">, "children"> & {
  /** Array form. Rendered before any `children`. */
  items?: TimelineItemData[]
  /** Composable form: `<TimelineItem />` elements. */
  children?: React.ReactNode
  /** `right-time` moves the time to a left column on wide containers. */
  align?: TimelineAlign
  /** Marks the list as newest-first in its label. Does not reorder. */
  newestFirst?: boolean
  loading?: boolean
  /** Shown when there are no items. */
  emptyLabel?: React.ReactNode
  /** Show only the first `max` items behind a toggle. */
  collapsible?: boolean
  max?: number
}

const statusLabels: Record<TimelineStatus, string> = {
  default: "Event",
  success: "Completed",
  warning: "Warning",
  destructive: "Failed",
  current: "In progress",
  upcoming: "Upcoming",
}

const markerClass: Record<TimelineStatus, string> = {
  default: "border-border bg-background text-muted-foreground",
  success: "border-success bg-success text-white",
  warning: "border-warning bg-warning/15 text-warning",
  destructive: "border-destructive bg-destructive text-white",
  current: "border-brand bg-background text-brand",
  upcoming: "border-dashed border-border bg-background text-muted-foreground",
}

const TimelineContext = React.createContext<{ align: TimelineAlign }>({
  align: "left",
})

function StatusGlyph({ status }: { status: TimelineStatus }) {
  switch (status) {
    case "success":
      return <Check className="size-3.5" strokeWidth={3} />
    case "warning":
      return <TriangleAlert className="size-3.5" />
    case "destructive":
      return <X className="size-3.5" strokeWidth={3} />
    case "current":
      return <span className="size-2 bg-brand motion-safe:animate-pulse" />
    case "upcoming":
      return null
    default:
      return <span className="size-1.5 bg-current" />
  }
}

function TimelineItem({
  time,
  timestamp,
  title,
  description,
  meta,
  icon,
  status = "default",
  statusLabel,
  children,
  detailLabel = "Details",
  defaultOpen = false,
  className,
  ...props
}: TimelineItemProps) {
  const { align } = React.useContext(TimelineContext)
  const right = align === "right-time"
  const hasTime = time !== undefined && time !== null && time !== false

  return (
    <li
      data-slot="timeline-item"
      data-status={status}
      aria-current={status === "current" ? "step" : undefined}
      className={cn(
        "group/tl grid grid-cols-[1.5rem_1fr] gap-x-3",
        right && "@md:grid-cols-[7rem_1.5rem_1fr]",
        className
      )}
      {...props}
    >
      <div
        data-slot="timeline-rail"
        className={cn(
          "row-span-2 row-start-1 flex flex-col items-center",
          right && "@md:col-start-2 @md:row-span-1"
        )}
      >
        <span
          data-slot="timeline-marker"
          aria-hidden
          className={cn(
            "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-sm border",
            markerClass[status]
          )}
        >
          {icon ?? <StatusGlyph status={status} />}
        </span>
        <span
          aria-hidden
          data-slot="timeline-connector"
          className={cn(
            "mt-1 w-0 flex-1 border-l group-last/tl:hidden",
            status === "upcoming" && "border-dashed"
          )}
        />
      </div>

      {hasTime && (
        <div
          data-slot="timeline-time"
          className={cn(
            "col-start-2 row-start-1 pt-0.5 font-mono text-xs text-muted-foreground tabular-nums",
            right && "@md:col-start-1 @md:pt-1 @md:text-right"
          )}
        >
          {timestamp ? <time dateTime={timestamp}>{time}</time> : time}
        </div>
      )}

      <div
        data-slot="timeline-body"
        className={cn(
          "col-start-2 min-w-0 pb-6 group-last/tl:pb-0",
          hasTime ? "row-start-2" : "row-start-1 pt-0.5",
          right && "@md:col-start-3 @md:row-start-1 @md:pt-0.5"
        )}
      >
        <p
          data-slot="timeline-title"
          className={cn(
            "text-sm leading-5 font-medium",
            status === "upcoming" && "text-muted-foreground"
          )}
        >
          <span className="sr-only">
            {statusLabel ?? statusLabels[status]}:{" "}
          </span>
          {title}
        </p>
        {description && (
          <div className="mt-1 text-sm text-muted-foreground">
            {description}
          </div>
        )}
        {meta && (
          <div className="mt-1.5 eyebrow text-muted-foreground">{meta}</div>
        )}
        {children && (
          <details
            data-slot="timeline-detail"
            open={defaultOpen || undefined}
            className="group/detail mt-2"
          >
            <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-sm text-xs font-medium text-brand outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
              {detailLabel}
              <ChevronDown className="size-3.5 transition-transform group-open/detail:rotate-180" />
            </summary>
            <div className="mt-2 rounded-md border bg-surface p-3 text-sm">
              {children}
            </div>
          </details>
        )}
      </div>
    </li>
  )
}

function TimelineSkeleton({ align }: { align: TimelineAlign }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          aria-hidden
          className={cn(
            "grid grid-cols-[1.5rem_1fr] gap-x-3",
            align === "right-time" && "@md:grid-cols-[7rem_1.5rem_1fr]"
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center",
              align === "right-time" && "@md:col-start-2"
            )}
          >
            <Skeleton className="size-6" />
            {i < 2 && <span className="mt-1 w-0 flex-1 border-l" />}
          </div>
          <div
            className={cn(
              "col-start-2 flex flex-col gap-2 pb-6",
              align === "right-time" && "@md:col-start-3"
            )}
          >
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </li>
      ))}
    </>
  )
}

function Timeline({
  items,
  children,
  align = "left",
  newestFirst = false,
  loading = false,
  emptyLabel = "No events yet",
  collapsible = false,
  max = 3,
  className,
  "aria-label": ariaLabel = "Timeline",
  ...props
}: TimelineProps) {
  const [expanded, setExpanded] = React.useState(false)
  const listId = React.useId()

  const nodes: React.ReactNode[] = [
    ...(items ?? []).map((item, i) => <TimelineItem key={i} {...item} />),
    ...React.Children.toArray(children),
  ]
  const limit = Math.max(1, max)
  const clipped = collapsible && !expanded && nodes.length > limit
  const hidden = nodes.length - limit
  const visible = clipped ? nodes.slice(0, limit) : nodes
  const label = newestFirst ? `${ariaLabel}, newest first` : ariaLabel

  if (!loading && nodes.length === 0) {
    return (
      <p
        data-slot="timeline-empty"
        className={cn("py-6 text-sm text-muted-foreground", className)}
      >
        {emptyLabel}
      </p>
    )
  }

  return (
    <TimelineContext.Provider value={{ align }}>
      <div data-slot="timeline-root" className="@container">
        <ol
          id={listId}
          data-slot="timeline"
          data-align={align}
          aria-label={label}
          aria-busy={loading || undefined}
          className={cn("m-0 list-none p-0", className)}
          {...props}
        >
          {loading ? <TimelineSkeleton align={align} /> : visible}
        </ol>
        {loading && <span className="sr-only">Loading</span>}
        {!loading && collapsible && nodes.length > limit && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 rounded-sm text-xs font-medium text-brand outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {expanded ? "Show less" : `Show ${hidden} more`}
            <ChevronDown className={cn("size-3.5", expanded && "rotate-180")} />
          </button>
        )}
      </div>
    </TimelineContext.Provider>
  )
}

export { Timeline, TimelineItem }
export type {
  TimelineProps,
  TimelineItemProps,
  TimelineItemData,
  TimelineStatus,
  TimelineAlign,
}
