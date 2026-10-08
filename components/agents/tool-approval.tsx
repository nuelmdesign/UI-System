// Adapted from beUI (https://beui.dev), MIT © 2026 Saurabh Chauhan.
"use client"

import {
  Check,
  ChevronDown,
  CircleAlert,
  LoaderCircle,
  ShieldCheck,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import {
  AgentCode,
  type AgentCodeLanguage,
} from "@/components/agents/agent-code"
import { AgentDisclosure } from "@/components/agents/agent-disclosure"
import { ease, spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

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

function getStatusCopy(status: ToolApprovalStatus) {
  if (status === "approving") return "Approving"
  if (status === "approved") return "Approved"
  if (status === "denied") return "Denied"
  if (status === "running") return "Running"
  if (status === "complete") return "Completed"
  if (status === "error") return "Failed"
  return "Approval required"
}

function getStatusBadgeClass(status: ToolApprovalStatus) {
  if (status === "pending") {
    return "border-warning/30 bg-warning/10 text-warning"
  }
  if (status === "approving" || status === "running") {
    return "border-brand/30 bg-brand/10 text-brand"
  }
  if (status === "approved" || status === "complete") {
    return "border-success/30 bg-success/10 text-success"
  }
  return "border-destructive/30 bg-destructive/10 text-destructive"
}

export function ToolApprovalCode({
  code,
  language = "bash",
  className,
}: ToolApprovalCodeProps) {
  return (
    <AgentCode
      code={code}
      language={language}
      className={cn(
        // Parameter values sit in a narrow grid column with nowhere to scroll
        // on touch, so they wrap instead of clipping (as ToolResultOutput does).
        "rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2 break-words whitespace-pre-wrap",
        className
      )}
    />
  )
}

export function ToolApproval({
  tool,
  title = "Allow this tool to run?",
  description,
  parameters = [],
  status = "pending",
  open,
  defaultOpen = false,
  onOpenChange,
  onApprove,
  onAlwaysAllow,
  onDeny,
  className,
}: ToolApprovalProps) {
  const reduce = useReducedMotion() ?? false
  const baseId = useId()
  const detailsId = `${baseId}-details`
  const previousStatus = useRef(status)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const currentOpen = open ?? internalOpen
  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, open]
  )
  const busy = status === "approving" || status === "running"
  const pending = status === "pending"
  const error = status === "error"

  useEffect(() => {
    if (previousStatus.current === "pending" && status !== "pending") {
      setOpen(false)
    }
    previousStatus.current = status
  }, [setOpen, status])

  return (
    <div
      data-state={status}
      aria-busy={busy}
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20 text-sm",
        className
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border border-border/60 bg-background text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {busy ? (
            <LoaderCircle className={cn("size-4", !reduce && "animate-spin")} />
          ) : error ? (
            <CircleAlert className="size-4" />
          ) : status === "denied" ? (
            <X className="size-4" />
          ) : status === "approved" || status === "complete" ? (
            <Check className="size-4" />
          ) : (
            <ShieldCheck className="size-4" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-foreground">{title}</div>
              <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                {tool}
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-sm border px-2 py-0.5 text-[11px] font-medium transition-colors",
                getStatusBadgeClass(status)
              )}
            >
              {getStatusCopy(status)}
            </span>
          </div>
          {description ? (
            <p className="mt-2 leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}

          {parameters.length ? (
            <button
              type="button"
              aria-expanded={currentOpen}
              aria-controls={detailsId}
              onClick={() => setOpen(!currentOpen)}
              className="mt-2 inline-flex items-center gap-1 rounded-md text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              View details
              <motion.span
                aria-hidden="true"
                animate={{ rotate: currentOpen ? 180 : 0 }}
                transition={reduce ? { duration: 0 } : spring.snappy}
              >
                <ChevronDown className="size-3.5" />
              </motion.span>
            </button>
          ) : null}
        </div>
      </div>

      <AgentDisclosure id={detailsId} open={currentOpen}>
        <dl className="mx-4 mb-4 grid gap-2 rounded-xl border border-border/50 bg-background/70 p-3">
          {parameters.map((parameter) => (
            <div
              key={parameter.id}
              className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-3 text-xs"
            >
              <dt className="text-muted-foreground">{parameter.label}</dt>
              <dd className="min-w-0 font-mono break-words text-foreground/85">
                {parameter.value}
              </dd>
            </div>
          ))}
        </dl>
      </AgentDisclosure>

      <AnimatePresence initial={false}>
        {pending ? (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.12 : 0.22, ease: ease.out }}
            className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3"
          >
            <motion.button
              type="button"
              onClick={onApprove}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={spring.snappy}
              className="rounded-xl bg-foreground px-3 py-1.5 text-xs font-medium text-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Allow once
            </motion.button>
            {onAlwaysAllow ? (
              <motion.button
                type="button"
                onClick={onAlwaysAllow}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                transition={spring.snappy}
                className="rounded-xl border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                Always allow
              </motion.button>
            ) : null}
            <button
              type="button"
              onClick={onDeny}
              className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              Deny
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
