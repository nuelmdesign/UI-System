"use client"

import * as React from "react"
import { ChevronDown, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FilterOption = {
  value: string
  label: string
  /** Optional count shown next to the option. */
  count?: number
}

type FilterBase = {
  /** Key of this filter in the values object. */
  key: string
  label: string
}

export type TextFilter = FilterBase & {
  type: "text"
  placeholder?: string
}

export type SelectFilter = FilterBase & {
  type: "select"
  options: FilterOption[]
}

export type MultiSelectFilter = FilterBase & {
  type: "multi-select"
  options: FilterOption[]
}

export type FilterConfig = TextFilter | SelectFilter | MultiSelectFilter

/** text and select store a string ("" = unset); multi-select stores string[]. */
export type FilterValues = Record<string, string | string[] | undefined>

export type FilterBarLabels = {
  clearAll: string
  /** Select placeholder suffix, e.g. "All" + label is built as `${all} ${label}`. */
  all: string
  /** Multi-select summary, receives the label and number selected. */
  selected: (label: string, count: number) => string
  /** aria-label for the group. */
  group: string
  /** aria-label for the remove button on an option chip. */
  remove: (label: string) => string
}

const defaultLabels: FilterBarLabels = {
  clearAll: "Clear all",
  all: "All",
  selected: (label, count) => `${label} (${count})`,
  group: "Filters",
  remove: (label) => `Remove filter ${label}`,
}

export type FilterBarProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  filters: FilterConfig[]
  value?: FilterValues
  defaultValue?: FilterValues
  onValueChange?: (value: FilterValues) => void
  labels?: Partial<FilterBarLabels>
}

const ALL = "__all__"

function isActive(v: string | string[] | undefined) {
  return Array.isArray(v) ? v.length > 0 : !!v
}

/** Number of filters that currently have a value. */
export function countActiveFilters(values: FilterValues) {
  return Object.values(values).filter(isActive).length
}

function MultiSelectControl({
  filter,
  value,
  onChange,
  labels,
}: {
  filter: MultiSelectFilter
  value: string[]
  onChange: (next: string[]) => void
  labels: FilterBarLabels
}) {
  const id = React.useId()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-active={value.length > 0 || undefined}
          className="gap-2 data-[active]:border-brand/50"
        >
          {value.length > 0
            ? labels.selected(filter.label, value.length)
            : filter.label}
          <ChevronDown className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        <ul role="group" aria-label={filter.label} className="flex flex-col">
          {filter.options.map((o) => {
            const checked = value.includes(o.value)
            const oid = `${id}-${o.value}`
            return (
              <li key={o.value}>
                <label
                  htmlFor={oid}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <Checkbox
                    id={oid}
                    checked={checked}
                    onCheckedChange={(c) =>
                      onChange(
                        c === true
                          ? [...value, o.value]
                          : value.filter((x) => x !== o.value)
                      )
                    }
                  />
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {o.count !== undefined && (
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {o.count}
                    </span>
                  )}
                </label>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

function FilterBar({
  filters,
  value,
  defaultValue,
  onValueChange,
  labels: labelsProp,
  className,
  ...props
}: FilterBarProps) {
  const labels = { ...defaultLabels, ...labelsProp }
  const [internal, setInternal] = React.useState<FilterValues>(
    defaultValue ?? {}
  )
  const values = value ?? internal

  function set(key: string, next: string | string[] | undefined) {
    const merged = { ...values, [key]: next }
    if (value === undefined) setInternal(merged)
    onValueChange?.(merged)
  }

  function clearAll() {
    if (value === undefined) setInternal({})
    onValueChange?.({})
  }

  const active = filters.filter((f) => isActive(values[f.key]))

  return (
    <div
      data-slot="filter-bar"
      role="group"
      aria-label={labels.group}
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {filters.map((f) => {
        if (f.type === "text") {
          const v =
            typeof values[f.key] === "string" ? (values[f.key] as string) : ""
          return (
            <div
              key={f.key}
              data-slot="filter-bar-text"
              className="relative min-w-40 flex-1 sm:max-w-64"
            >
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={v}
                aria-label={f.label}
                placeholder={f.placeholder ?? f.label}
                onChange={(e) => set(f.key, e.target.value)}
                className="h-8 pl-8"
              />
            </div>
          )
        }
        if (f.type === "select") {
          const v =
            typeof values[f.key] === "string" ? (values[f.key] as string) : ""
          return (
            <Select
              key={f.key}
              value={v || ALL}
              onValueChange={(next) => set(f.key, next === ALL ? "" : next)}
            >
              <SelectTrigger
                size="sm"
                aria-label={f.label}
                data-active={v ? "" : undefined}
                className="data-[active]:border-brand/50"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>
                  {labels.all} {f.label}
                </SelectItem>
                {f.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
        const arr = Array.isArray(values[f.key])
          ? (values[f.key] as string[])
          : []
        return (
          <MultiSelectControl
            key={f.key}
            filter={f}
            value={arr}
            labels={labels}
            onChange={(next) => set(f.key, next)}
          />
        )
      })}
      {active.length > 0 && (
        <>
          <ul
            data-slot="filter-bar-chips"
            className="flex flex-wrap items-center gap-1.5"
          >
            {active.flatMap((f) => {
              const v = values[f.key]
              if (f.type === "text") return []
              const sel = Array.isArray(v) ? v : [v as string]
              return sel.map((s) => {
                const label = f.options.find((o) => o.value === s)?.label ?? s
                return (
                  <li key={`${f.key}:${s}`}>
                    <Badge variant="secondary" className="gap-1 pr-0.5">
                      <span className="text-muted-foreground">{f.label}:</span>{" "}
                      {label}
                      <button
                        type="button"
                        aria-label={labels.remove(`${f.label}: ${label}`)}
                        onClick={() =>
                          set(
                            f.key,
                            Array.isArray(v) ? v.filter((x) => x !== s) : ""
                          )
                        }
                        className="inline-flex size-4 items-center justify-center rounded-sm outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring"
                      >
                        <X aria-hidden />
                      </button>
                    </Badge>
                  </li>
                )
              })
            })}
          </ul>
          <Button variant="ghost" size="xs" onClick={clearAll}>
            {labels.clearAll}
          </Button>
        </>
      )}
    </div>
  )
}

export { FilterBar }
