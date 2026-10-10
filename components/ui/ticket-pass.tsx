import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { QrCode } from "@/components/ui/qr-code"

type TicketPassStatus = "valid" | "used" | "expired" | "void"

type TicketPassField = {
  label: string
  value: React.ReactNode
}

type TicketPassProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Event or trip title. */
  title: React.ReactNode
  /** Small label above the title, e.g. "Admit one". */
  eyebrow?: React.ReactNode
  /** Label/value pairs shown in the meta grid. */
  fields: TicketPassField[]
  /** The string encoded in the QR code and shown under it. */
  code: string
  status?: TicketPassStatus
  /** Render the header band dark in either theme. */
  dark?: boolean
  /** Header band colour: "brand" uses the primary colour. */
  tone?: "default" | "brand"
  /** Buttons or links rendered below the stub. */
  actions?: React.ReactNode
}

const statusMap: Record<
  TicketPassStatus,
  {
    label: string
    variant: "success" | "secondary" | "warning" | "destructive"
  }
> = {
  valid: { label: "Valid", variant: "success" },
  used: { label: "Used", variant: "secondary" },
  expired: { label: "Expired", variant: "warning" },
  void: { label: "Void", variant: "destructive" },
}

const bandVariants = cva("flex flex-col gap-2 border-b px-5 py-5 sm:px-6", {
  variants: {
    dark: {
      true: "",
      false: "",
    },
    tone: {
      default: "",
      brand: "border-transparent bg-primary text-primary-foreground",
    },
  },
  compoundVariants: [
    { tone: "default", dark: false, class: "bg-muted text-foreground" },
    { tone: "default", dark: true, class: "bg-ink text-ink-foreground" },
  ],
  defaultVariants: { dark: false, tone: "default" },
})

/** Half-circle notch punched out of the card edge at the tear line. */
function Notch({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute z-10 size-4 rounded-full border bg-background",
        className
      )}
    />
  )
}

function TicketPass({
  title,
  eyebrow,
  fields,
  code,
  status = "valid",
  dark = false,
  tone = "default",
  actions,
  className,
  ...props
}: TicketPassProps) {
  const inactive = status !== "valid"
  const s = statusMap[status]

  return (
    <div
      data-slot="ticket-pass"
      data-status={status}
      className={cn(
        "relative flex w-full max-w-3xl flex-col overflow-hidden rounded-lg border bg-card text-card-foreground sm:flex-row",
        className
      )}
      {...props}
    >
      <div className="@container/fields flex min-w-0 flex-1 flex-col">
        <div
          data-slot="ticket-pass-header"
          className={bandVariants({ dark, tone })}
        >
          {eyebrow && <span className="eyebrow opacity-70">{eyebrow}</span>}
          <h3 className="heading text-2xl leading-tight text-balance @lg/fields:text-3xl">
            {title}
          </h3>
        </div>
        <dl
          data-slot="ticket-pass-fields"
          className="grid grid-cols-1 gap-x-4 gap-y-5 p-5 sm:p-6 @xs/fields:grid-cols-2 @lg/fields:grid-cols-3"
        >
          {fields.map((f) => (
            <div key={f.label} className="min-w-0">
              <dt className="eyebrow text-muted-foreground">{f.label}</dt>
              <dd className="mt-1 text-sm font-medium text-pretty [overflow-wrap:anywhere] hyphens-auto">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Tear line: horizontal when stacked, vertical beside the stub. */}
      <div
        aria-hidden
        data-slot="ticket-pass-tear"
        className="relative h-0 border-t border-dashed sm:h-auto sm:w-0 sm:border-t-0 sm:border-l"
      >
        <Notch className="-top-2 -left-2 max-sm:-left-2 sm:-top-2 sm:-left-2 sm:-translate-y-0" />
        <Notch className="-top-2 -right-2 max-sm:-right-2 sm:top-auto sm:right-auto sm:-bottom-2 sm:-left-2" />
      </div>

      <div
        data-slot="ticket-pass-stub"
        className="flex flex-col items-center gap-4 p-5 sm:w-56 sm:shrink-0 sm:justify-center sm:p-6"
      >
        <Badge variant={s.variant} dot>
          {s.label}
        </Badge>
        <div className="relative">
          <QrCode
            value={code}
            size={136}
            label={`QR code for ticket ${code}`}
            className={cn(inactive && "opacity-30")}
          />
        </div>
        <span
          className={cn(
            "font-mono text-xs tracking-wider break-all text-muted-foreground",
            inactive && "line-through"
          )}
        >
          {code}
        </span>
        {actions && (
          <div className="flex w-full flex-wrap justify-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export { TicketPass }
export type { TicketPassProps, TicketPassField, TicketPassStatus }
