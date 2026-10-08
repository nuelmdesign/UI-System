"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { CodeBlock } from "@/components/agents/code-block"

const CODE = [
  'import { motion } from "motion/react"',
  'import { spring } from "@/lib/motion"',
  "",
  "export function Indicator({ active }: { active: boolean }) {",
  "  return (",
  "    <motion.span",
  "      layout",
  "      transition={spring.smooth}",
  '      className={active ? "bg-brand" : "bg-muted"}',
  "    />",
  "  )",
  "}",
]

export default function CodeBlockDemo() {
  const reduce = useReducedMotion() ?? false
  const [lines, setLines] = React.useState(1)

  React.useEffect(() => {
    if (reduce || lines >= CODE.length) return
    const t = window.setTimeout(() => setLines((v) => v + 1), 220)
    return () => window.clearTimeout(t)
  }, [lines, reduce])

  const shown = reduce ? CODE.length : lines
  return (
    <CodeBlock
      filename="indicator.tsx"
      language="tsx"
      code={CODE.slice(0, shown).join("\n")}
      status={shown === CODE.length ? "complete" : "streaming"}
      highlightLines={[7, 8]}
      maxHeight={240}
    />
  )
}
