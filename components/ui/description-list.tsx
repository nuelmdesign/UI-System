"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/motion/copy-button"

type DescriptionItem = {
  label: React.ReactNode
  value?: React.ReactNode
  /** Columns this entry spans (clamped to the available columns). */
  span?: number
  /** Show a copy button. Needs `copyValue` or a string/number `value`. */
  copyable?: boolean
  /** Text to copy when it differs from the displayed value. */
  copyValue?: string
  /** Render the value in mono, for IDs, codes and dates. */
  mono?: boolean
}

type DescriptionListLabels = {
  /** Shown when a value is empty. */
  empty: string
  copy: string
}

const defaultLabels: DescriptionListLabels = {
  empty: "Not provided",
  copy: "Copy",
}

const SAMPLE_DESCRIPTION_ITEMS: DescriptionItem[] = [
  { label: "Name", value: "Item 12" },
  { label: "Reference", value: "REF-0012", mono: true, copyable: true },
  { label: "Owner", value: "Alex Example" },
  { label: "Email", value: "alex@example.com", copyable: true },
  { label: "Updated", value: "2026-01-12", mono: true },
  { label: "Notes", value: "", span: 2 },
]

const colClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 @md:grid-cols-2",
  3: "grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3",
  4: "grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4",
}

const spanClass: Record<number, string> = {
  1: "",
  2: "@md:col-span-2",
  3: "@md:col-span-2 @2xl:col-span-3",
  4: "@md:col-span-2 @2xl:col-span-3 @4xl:col-span-4",
}

function isEmpty(v: React.ReactNode) {
  return v === undefined || v === null || v === false || v === ""
}

type DescriptionListProps = Omit<React.ComponentProps<"dl">, "children"> & {
  items?: DescriptionItem[]
  /** Maximum columns. The list steps down as its container narrows. */
  columns?: 1 | 2 | 3 | 4
  /** Wrap the list in a hairline-bordered card with dividers. */
  bordered?: boolean
  labels?: Partial<DescriptionListLabels>
}

function DescriptionList({
  items = SAMPLE_DESCRIPTION_ITEMS,
  columns = 3,
  bordered = false,
  labels,
  className,
  ...props
}: DescriptionListProps) {
  const l = { ...defaultLabels, ...labels }

  return (
    <div data-slot="description-list-frame" className="@container w-full">
      <dl
        data-slot="description-list"
        className={cn(
          "grid gap-x-6 gap-y-5",
          colClass[columns],
          bordered && "rounded-lg border bg-card p-4",
          className
        )}
        {...props}
      >
        {items.map((item, i) => {
          const empty = isEmpty(item.value)
          const copyText =
            item.copyValue ??
            (typeof item.value === "string" || typeof item.value === "number"
              ? String(item.value)
              : undefined)
          const span = Math.min(Math.max(item.span ?? 1, 1), columns)
          return (
            <div
              key={i}
              data-slot="description-list-item"
              className={cn("flex min-w-0 flex-col gap-1", spanClass[span])}
            >
              <dt className="eyebrow">{item.label}</dt>
              <dd className="flex min-w-0 items-center gap-1 text-sm">
                {empty ? (
                  <span className="text-muted-foreground">{l.empty}</span>
                ) : (
                  <span
                    className={cn(
                      "min-w-0 break-words",
                      item.mono && "font-mono tabular-nums"
                    )}
                  >
                    {item.value}
                  </span>
                )}
                {item.copyable && !empty && copyText && (
                  <CopyButton
                    value={copyText}
                    size="icon-xs"
                    className="shrink-0 text-muted-foreground"
                    title={l.copy}
                  />
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

export { DescriptionList, SAMPLE_DESCRIPTION_ITEMS }
export type { DescriptionItem, DescriptionListLabels, DescriptionListProps }
