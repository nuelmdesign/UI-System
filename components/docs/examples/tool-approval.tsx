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
