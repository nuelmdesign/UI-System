"use client"

import * as React from "react"
import { motion, type HTMLMotionProps } from "motion/react"

import { ease, variants as presets } from "@/lib/motion"

type RevealProps = HTMLMotionProps<"div"> & {
  variant?: keyof typeof presets
  delay?: number
  /** Only animate the first time it scrolls into view. */
  once?: boolean
}

/** Fades content in as it scrolls into view. Wrap any block. */
function Reveal({
  variant = "fadeUp",
  delay = 0,
  once = true,
  transition,
  ...props
}: RevealProps) {
  return (
    <motion.div
      data-slot="reveal"
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={presets[variant]}
      transition={{ duration: 0.5, ease: ease.out, delay, ...transition }}
      {...props}
    />
  )
}

export { Reveal }
