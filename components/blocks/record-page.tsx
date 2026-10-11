"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/ui/page-header"
import { Stat, StatGroup, type StatProps } from "@/components/ui/stat"
import {
  StatusIndicator,
  type StatusIndicatorProps,
  type StatusTone,
} from "@/components/ui/status-indicator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timeline, type TimelineItemData } from "@/components/ui/timeline"

export type RecordStatus = {
  label: string
  tone?: StatusTone
}

export type RecordSummaryItem = Pick<
  StatProps,
  "label" | "value" | "hint" | "delta" | "icon"
> & { id?: string }

export type RecordField = {
  id?: string
  label: React.ReactNode
  value: React.ReactNode
  /** Render the value in mono (IDs, dates, amounts). */
  mono?: boolean
  /** Span two columns when the grid has room. */
  wide?: boolean
}

export type RecordRelated = {
  id: string
  title: React.ReactNode
  /** Secondary line, e.g. type or reference. */
  meta?: React.ReactNode
  status?: RecordStatus
  href?: string
  onSelect?: () => void
}

export type RecordTab = {
  id: string
  label: React.ReactNode
  content: React.ReactNode
}

export type RecordPageLabels = {
  details: string
  activity: string
  related: string
  emptyValue: string
  noFields: string
  noActivity: string
  noRelated: string
  summary: string
  tabs: string
}

export type RecordPageProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Record identifier, shown in mono above the title. */
  id?: string
  status?: RecordStatus
  /** Buttons or menus for the header. */
  actions?: React.ReactNode
  /** Breadcrumb or back link above the header. */
  breadcrumb?: React.ReactNode
  summary?: RecordSummaryItem[]
  fields?: RecordField[]
  activity?: TimelineItemData[]
  related?: RecordRelated[]
  /** Replaces the default Details and Activity tabs. */
  tabs?: RecordTab[]
  /** Active tab (controlled). */
  tab?: string
  defaultTab?: string
  onTabChange?: (id: string) => void
  labels?: Partial<RecordPageLabels>
  className?: string
}

export const DEFAULT_RECORD_LABELS: RecordPageLabels = {
  details: "Details",
  activity: "Activity",
  related: "Related",
  emptyValue: "—",
  noFields: "No details yet",
  noActivity: "No activity yet",
  noRelated: "Nothing related",
  summary: "Summary",
  tabs: "Record sections",
}

type StatusShape = NonNullable<StatusIndicatorProps["shape"]>

const toneShape: Record<StatusTone, StatusShape> = {
  success: "dot",
  warning: "half",
  destructive: "ring",
  brand: "square",
  muted: "dash",
}

function RecordStatusBadge({ status }: { status: RecordStatus }) {
  const tone = status.tone ?? "muted"
  return (
    <StatusIndicator
      data-slot="record-page-status"
      tone={tone}
      shape={toneShape[tone]}
      label={status.label}
    />
  )
}

function FieldGrid({
  fields,
  labels,
}: {
  fields: RecordField[]
  labels: RecordPageLabels
}) {
  if (fields.length === 0) {
    return (
      <p className="py-6 text-sm text-muted-foreground">{labels.noFields}</p>
    )
  }
  return (
    <dl
      data-slot="record-page-fields"
      className="grid grid-cols-1 gap-x-8 gap-y-5 @md/record:grid-cols-2 @3xl/record:grid-cols-3"
    >
      {fields.map((f, i) => {
        const empty = f.value == null || f.value === "" || f.value === false
        return (
          <div
            key={f.id ?? i}
            className={cn(
              "flex min-w-0 flex-col gap-1 border-t pt-3",
              f.wide && "@md/record:col-span-2"
            )}
          >
            <dt className="eyebrow text-muted-foreground">{f.label}</dt>
            <dd
              className={cn(
                "min-w-0 text-sm break-words",
                f.mono && "font-mono tabular-nums",
                empty && "text-muted-foreground"
              )}
            >
              {empty ? labels.emptyValue : f.value}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function RelatedList({
  items,
  labels,
}: {
  items: RecordRelated[]
  labels: RecordPageLabels
}) {
  return (
    <section data-slot="record-page-related" className="flex flex-col gap-3">
      <h3 className="eyebrow text-muted-foreground">{labels.related}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labels.noRelated}</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {items.map((r) => {
            const interactive = Boolean(r.href || r.onSelect)
            const body = (
              <>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {r.title}
                  </span>
                  {r.meta && (
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {r.meta}
                    </span>
                  )}
                </span>
                {r.status && <RecordStatusBadge status={r.status} />}
                {interactive && (
                  <ChevronRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                )}
              </>
            )
            const cls =
              "flex w-full items-center gap-3 px-4 py-3 text-left outline-none"
            const hover =
              "transition-colors hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-inset"
            return (
              <li key={r.id}>
                {r.href ? (
                  <a href={r.href} className={cn(cls, hover)}>
                    {body}
                  </a>
                ) : r.onSelect ? (
                  <button
                    type="button"
                    onClick={r.onSelect}
                    className={cn(cls, hover)}
                  >
                    {body}
                  </button>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export function RecordPage({
  title,
  subtitle,
  id,
  status,
  actions,
  breadcrumb,
  summary,
  fields = [],
  activity = [],
  related = [],
  tabs,
  tab,
  defaultTab,
  onTabChange,
  labels: labelsProp,
  className,
}: RecordPageProps) {
  const labels = { ...DEFAULT_RECORD_LABELS, ...labelsProp }

  const resolved: RecordTab[] = tabs ?? [
    {
      id: "details",
      label: labels.details,
      content: (
        <div className="flex flex-col gap-8">
          <FieldGrid fields={fields} labels={labels} />
          {related.length > 0 && (
            <RelatedList items={related} labels={labels} />
          )}
        </div>
      ),
    },
    {
      id: "activity",
      label: labels.activity,
      content: (
        <Timeline
          items={activity}
          newestFirst
          aria-label={labels.activity}
          emptyLabel={labels.noActivity}
        />
      ),
    },
  ]

  const eyebrow =
    id || status ? (
      <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {id && (
          <span data-slot="record-page-id" className="font-mono">
            {id}
          </span>
        )}
        {status && (
          <span className="tracking-normal text-foreground normal-case">
            <RecordStatusBadge status={status} />
          </span>
        )}
      </span>
    ) : undefined

  return (
    <div
      data-slot="record-page"
      className={cn(
        "@container/record h-full min-h-0 w-full overflow-y-auto",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 @md/record:px-6">
        <PageHeader
          bordered
          breadcrumb={breadcrumb}
          eyebrow={eyebrow}
          title={title}
          description={subtitle}
          actions={actions}
        />

        {summary && summary.length > 0 && (
          <StatGroup
            aria-label={labels.summary}
            columns={summary.length >= 4 ? 4 : summary.length === 3 ? 3 : 2}
          >
            {summary.map((s, i) => (
              <Stat
                key={s.id ?? i}
                bare
                label={s.label}
                value={s.value}
                hint={s.hint}
                delta={s.delta}
                icon={s.icon}
              />
            ))}
          </StatGroup>
        )}

        <Tabs
          variant="underline"
          value={tab}
          defaultValue={defaultTab ?? resolved[0]?.id}
          onValueChange={onTabChange}
          className="gap-6"
        >
          <TabsList
            aria-label={labels.tabs}
            className="max-w-full overflow-x-auto"
          >
            {resolved.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {resolved.map((t) => (
            <TabsContent key={t.id} value={t.id}>
              {t.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export const SAMPLE_RECORD_FIELDS: RecordField[] = [
  { label: "Owner", value: "Alex Morgan" },
  { label: "Created", value: "2026-03-02", mono: true },
  { label: "Reference", value: "REF-0001", mono: true },
  { label: "Category", value: "Category A" },
  { label: "Contact", value: "alex@example.com", mono: true },
  { label: "Notes", value: "Sample note for this record.", wide: true },
]

export const SAMPLE_RECORD_ACTIVITY: TimelineItemData[] = [
  {
    time: "Mar 4, 10:20",
    timestamp: "2026-03-04T10:20:00Z",
    title: "Status changed",
    description: "Moved to In progress.",
    meta: "Alex Morgan",
    status: "current",
  },
  {
    time: "Mar 2, 09:05",
    timestamp: "2026-03-02T09:05:00Z",
    title: "Record created",
    meta: "Sam Rivera",
    status: "success",
  },
]

export const SAMPLE_RECORD_RELATED: RecordRelated[] = [
  {
    id: "r1",
    title: "Item 12",
    meta: "REF-0012",
    status: { label: "Open", tone: "brand" },
  },
  {
    id: "r2",
    title: "Item 7",
    meta: "REF-0007",
    status: { label: "Closed", tone: "muted" },
  },
]

export const SAMPLE_RECORD_SUMMARY: RecordSummaryItem[] = [
  { label: "Total", value: "24" },
  { label: "Open", value: "3" },
  { label: "Age", value: "12 d" },
]
