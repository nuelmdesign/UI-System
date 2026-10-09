# Tool Approval

Permission prompt for a tool call: parameters, allow once or always, deny.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/tool-approval
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ToolApprovalCode, ToolApproval } from "@/components/agents/tool-approval"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/agent-disclosure`, `@opendraft/agent-code`

## Props and types

```ts
export type ToolApprovalStatus =
  | "pending"
  | "approving"
  | "approved"
  | "denied"
  | "running"
  | "complete"
  | "error"

export interface ToolApprovalParameter {
  id: string
  label: ReactNode
  value: ReactNode
}

export interface ToolApprovalCodeProps {
  code: string
  language?: AgentCodeLanguage
  className?: string
}

export interface ToolApprovalProps {
  tool: ReactNode
  title?: ReactNode
  description?: ReactNode
  parameters?: ToolApprovalParameter[]
  status?: ToolApprovalStatus
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onApprove?: () => void
  onAlwaysAllow?: () => void
  onDeny?: () => void
  className?: string
}
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "@/components/agents/tool-approval"

/** Runs `fn` after `ms`; pending timers clear on unmount. */
function useTimers() {
  const timers = React.useRef<number[]>([])
  React.useEffect(() => () => timers.current.forEach(window.clearTimeout), [])
  return React.useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
}

export default function ToolApprovalDemo() {
  const [status, setStatus] = React.useState<ToolApprovalStatus>("pending")
  const [open, setOpen] = React.useState(true)
  const later = useTimers()
  const approve = () => {
    setStatus("approving")
    later(() => setStatus("approved"), 600)
    later(() => setStatus("running"), 1150)
    later(() => setStatus("complete"), 2200)
  }
  return (
    <ToolApproval
      tool="terminal.run"
      title={
        status === "pending" ? "Allow this tool to run?" : "Terminal access"
      }
      description="The agent wants to run the build and registry checks in this workspace."
      status={status}
      open={open}
      onOpenChange={setOpen}
      parameters={[
        {
          id: "command",
          label: "Command",
          value: <ToolApprovalCode code="pnpm build" language="bash" />,
        },
        { id: "directory", label: "Directory", value: "UI-System" },
      ]}
      onApprove={approve}
      onAlwaysAllow={approve}
      onDeny={() => setStatus("denied")}
    />
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/tool-approval. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
