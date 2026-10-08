"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { duration, ease } from "@/lib/motion"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-[5px] border border-input bg-background shadow-xs outline-none dark:bg-input/20",
        "transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-90",
        "data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground",
        "data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand data-[state=indeterminate]:text-brand-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring",
        "aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
          {props.checked === "indeterminate" ? (
            <motion.path
              d="M4 8h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: duration.fast, ease: ease.out }}
            />
          ) : (
            <motion.path
              d="M3.5 8.5l3 3 6-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: duration.base, ease: ease.out }}
            />
          )}
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
