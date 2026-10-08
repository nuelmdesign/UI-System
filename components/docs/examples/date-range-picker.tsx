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
