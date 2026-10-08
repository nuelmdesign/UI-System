"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

import { spring } from "@/lib/motion"

/** Pulls its child gently toward the cursor. Use on a single CTA, not a list. */
function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const x = useSpring(useMotionValue(0), spring.smooth)
  const y = useSpring(useMotionValue(0), spring.smooth)

  return (
    <motion.div
      data-slot="magnetic"
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - rect.left - rect.width / 2) * strength)
        y.set((e.clientY - rect.top - rect.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export { Magnetic }
