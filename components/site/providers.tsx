"use client"

import * as React from "react"
import { MotionConfig } from "motion/react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { useTheme } from "@/components/site/theme-toggle"

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return (
    // Respect the OS "reduce motion" setting across every Motion component.
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        {children}
        <Toaster theme={theme} position="bottom-right" />
      </TooltipProvider>
    </MotionConfig>
  )
}
