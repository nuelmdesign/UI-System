# Date Range Picker

Range calendar in a popover, with month and year choosers and min / max.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/date-range-picker
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DateRangePicker, DateRangePickerCalendar, DateRangePickerSummary, DateRangePickerHeader, DateRangePickerGrid, DateRangePickerSelection, DateRangePickerClear, DateRangePickerFooter, DateRangePickerPresets, DateRangePickerPreset, DateRangePickerTrigger, DateRangePickerContent, DateRangePickerDropdown } from "@/components/motion/date-range-picker"
```

Files added to the project:

- `components/motion/date-range-picker.tsx`
- `components/motion/date-range-picker/context.ts`
- `components/motion/date-range-picker/date-utils.ts`
- `components/motion/date-range-picker/types.ts`
- `components/motion/date-range-picker/use-date-range-picker.ts`

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/popover`, `@opendraft/use-hover-capable`

## Props and types

```ts
export interface DateRangePickerCalendarProps extends ComponentPropsWithoutRef<"section"> {
  showSummary?: boolean
}

export type DateRangePickerSummaryProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
>

export type DateRangePickerHeaderProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
>

export type DateRangePickerGridProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
>

export type DateRangePickerSelectionProps = ComponentPropsWithoutRef<"p">

export type DateRangePickerClearProps = ComponentPropsWithRef<"button">

export type DateRangePickerFooterProps = ComponentPropsWithoutRef<"div">

export type DateRangePickerPresetsProps = ComponentPropsWithoutRef<"div">

export interface DateRangePickerPresetProps extends Omit<
  ComponentPropsWithRef<"button">,
  "value"
> {
  value: DateRange
  /** Accessible preset name and selection announcement. */
  label: string
}

export interface DateRangePickerTriggerProps extends HTMLMotionProps<"button"> {
  placeholder?: string
}

export interface DateRangePickerContentProps {
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  /** Gap between trigger and panel, in px. Default 8. */
  sideOffset?: number
  /** Runs once the panel is open, with the panel element. */
  onOpenAutoFocus?: (content: HTMLDivElement) => void
  className?: string
  /** Move focus to the active calendar date when opened. Default true. */
  autoFocus?: boolean
}

export interface DateRangePickerDropdownProps extends Omit<
  DateRangePickerProps,
  "children"
> {
  placeholder?: string
  triggerClassName?: string
  calendarClassName?: string
}

/** Calendar dates, independent of a browser's timezone: YYYY-MM-DD. */
export interface DateRange {
  from: string
  to?: string
}

export interface DateRangePreset {
  label: string
  value: DateRange
}

export interface DateRangePickerProps {
  value?: DateRange | null
  defaultValue?: DateRange | null
  onValueChange?: (range: DateRange | null) => void
  defaultMonth?: string
  min?: string
  max?: string
  isDateDisabled?: (date: string) => boolean
  presets?: DateRangePreset[]
  locale?: string
  label?: string
  disabled?: boolean
  /** Move focus to the active date on mount, for use inside a popover. */
  autoFocus?: boolean
  /** Show the start/end summary above the calendar. Default true. */
  showSummary?: boolean
  className?: string
  /** Compose custom controls; omitted children render the inline calendar. */
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Close an open popover after a complete range or preset. Default false. */
  closeOnSelect?: boolean
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerClear,
  DateRangePickerContent,
  DateRangePickerFooter,
  DateRangePickerGrid,
  DateRangePickerHeader,
  DateRangePickerSelection,
  DateRangePickerTrigger,
} from "@/components/motion/date-range-picker"
import { Button } from "@/components/ui/button"

function isoDaysAgo(daysAgo: number) {
  const day = new Date()
  day.setDate(day.getDate() - daysAgo)
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`
}

const subscribeNever = () => () => {}

export default function DateRangePickerDemo() {
  // Dates are only known in the browser, so the server renders a placeholder.
  const today = React.useSyncExternalStore(
    subscribeNever,
    () => isoDaysAgo(0),
    () => null
  )
  if (!today) {
    return (
      <Button variant="outline" disabled>
        Reporting period
      </Button>
    )
  }

  return (
    <DateRangePicker
      label="Reporting period"
      defaultMonth={today}
      defaultValue={{ from: isoDaysAgo(6), to: today }}
      max={today}
    >
      <DateRangePickerTrigger />
      <DateRangePickerContent>
        <DateRangePickerCalendar className="w-full rounded-none border-0">
          <DateRangePickerHeader />
          <DateRangePickerGrid />
          <DateRangePickerFooter>
            <div className="flex items-center justify-between gap-2">
              <DateRangePickerSelection />
              <DateRangePickerClear />
            </div>
          </DateRangePickerFooter>
        </DateRangePickerCalendar>
      </DateRangePickerContent>
    </DateRangePicker>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/date-range-picker. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
