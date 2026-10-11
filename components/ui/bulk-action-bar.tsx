"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type BulkAction = {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect: () => void
  destructive?: boolean
  disabled?: boolean
}

export type BulkActionBarLabels = {
  /** Summary text for the current count. */
  selected: (count: number) => string
  clear: string
  /** aria-label for the toolbar. */
  toolbar: string
}

const defaultLabels: BulkActionBarLabels = {
  selected: (count) => `${count} selected`,
  clear: "Clear selection",
  toolbar: "Bulk actions",
}

export type BulkActionBarProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Number of selected items. The bar renders nothing visible at 0. */
  count: number
  actions: BulkAction[]
  onClear?: () => void
  labels?: Partial<BulkActionBarLabels>
}

function BulkActionBar({
  count,
  actions,
  onClear,
  labels: labelsProp,
  className,
  ...props
}: BulkActionBarProps) {
  const labels = { ...defaultLabels, ...labelsProp }
  return (
    <div
      data-slot="bulk-action-bar"
      data-open={count > 0 || undefined}
      className={cn("contents", className)}
      {...props}
    >
      {/* The live region stays mounted so count changes are announced. */}
      <span className="sr-only" role="status" aria-live="polite">
        {count > 0 ? labels.selected(count) : ""}
      </span>
      {count > 0 && (
        <div
          role="toolbar"
          aria-label={labels.toolbar}
          className="flex animate-pop-in flex-wrap items-center gap-2 border bg-ink px-3 py-2 text-ink-foreground [--pop-y:6px]"
        >
          <span
            aria-hidden
            className="font-mono text-sm tabular-nums"
            data-slot="bulk-action-bar-count"
          >
            {labels.selected(count)}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1">
            {actions.map((a) => (
              <Button
                key={a.id}
                size="xs"
                variant="ghost"
                disabled={a.disabled}
                onClick={a.onSelect}
                className={cn(
                  "text-current hover:bg-ink-foreground/15 hover:text-current",
                  a.destructive &&
                    "underline decoration-dotted underline-offset-4"
                )}
              >
                {a.icon}
                {a.label}
              </Button>
            ))}
            {onClear && (
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label={labels.clear}
                onClick={onClear}
                className="text-current hover:bg-ink-foreground/15 hover:text-current"
              >
                <X />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { BulkActionBar }
