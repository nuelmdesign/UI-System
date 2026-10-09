# Code Block

Streaming code with Shiki highlighting, line highlights and copy.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/code-block
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { CodeBlock } from "@/components/agents/code-block"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/agent-code`

## Props and types

```ts
export type CodeBlockStatus = "streaming" | "complete"

export interface CodeBlockProps {
  code: string
  language?: AgentCodeLanguage
  filename?: ReactNode
  status?: CodeBlockStatus
  showLineNumbers?: boolean
  highlightLines?: number[]
  maxHeight?: number
  wrap?: boolean
  copyable?: boolean
  onCopy?: () => void | Promise<void>
  className?: string
}
```

## Example

```tsx
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
```

Live docs: https://opendraft-ui.vercel.app/docs/code-block. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
