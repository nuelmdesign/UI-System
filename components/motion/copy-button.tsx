"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"
import { Button } from "@/components/ui/button"

/** Copies `value` and morphs its icon into a check. */
function CopyButton({
  value,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick" | "children"> & {
  value: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "Copied" : "Copy"}
      className={cn("overflow-hidden", className)}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
      }}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
          transition={spring.snappy}
          className="flex"
        >
          {copied ? <Check className="text-success" /> : <Copy />}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}

export { CopyButton }
