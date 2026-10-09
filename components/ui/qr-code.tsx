import * as React from "react"
import { encode } from "uqr"

import { cn } from "@/lib/utils"

type QrCodeErrorCorrection = "L" | "M" | "Q" | "H"

type QrCodeProps = Omit<React.ComponentProps<"svg">, "children"> & {
  /** The text or URL to encode. */
  value: string
  /** Rendered width and height in px. */
  size?: number
  /** Error correction level: L 7%, M 15%, Q 25%, H 30%. */
  errorCorrection?: QrCodeErrorCorrection
  /** Accessible name for the code. */
  label?: string
}

/** Quiet zone, in modules. The QR spec asks for 4. */
const QUIET_ZONE = 4

function QrCode({
  value,
  size = 160,
  errorCorrection = "M",
  label = "QR code",
  className,
  style,
  ...props
}: QrCodeProps) {
  const { path, count } = React.useMemo(() => {
    const { data } = encode(value, { ecc: errorCorrection, border: 0 })
    let d = ""
    data.forEach((row, y) => {
      let x = 0
      while (x < row.length) {
        if (!row[x]) {
          x++
          continue
        }
        const start = x
        while (x < row.length && row[x]) x++
        d += `M${start + QUIET_ZONE} ${y + QUIET_ZONE}h${x - start}v1h${start - x}z`
      }
    })
    return { path: d, count: data.length + QUIET_ZONE * 2 }
  }, [value, errorCorrection])

  // Scanners need dark modules on a light field in both themes, so the tile
  // uses `ink` (which inverts) against `ink-foreground` in dark mode.
  return (
    <svg
      data-slot="qr-code"
      role="img"
      aria-label={label}
      viewBox={`0 0 ${count} ${count}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={cn(
        "block max-w-full shrink-0 rounded-sm bg-card fill-foreground dark:bg-ink dark:fill-ink-foreground",
        className
      )}
      style={style}
      {...props}
    >
      <path d={path} />
    </svg>
  )
}

export { QrCode }
export type { QrCodeProps, QrCodeErrorCorrection }
