import * as React from "react"

import { cn } from "@/lib/utils"

type MarqueeProps = React.ComponentProps<"div"> & {
  /** Seconds per loop. */
  duration?: number
  gap?: string
  reverse?: boolean
  pauseOnHover?: boolean
  /** Fade the edges out. */
  fade?: boolean
}

function Marquee({
  className,
  children,
  duration = 30,
  gap = "1rem",
  reverse = false,
  pauseOnHover = true,
  fade = true,
  style,
  ...props
}: MarqueeProps) {
  return (
    <div
      data-slot="marquee"
      className={cn(
        "group flex overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]",
        className
      )}
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-gap": gap,
          gap,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className={cn(
            "flex shrink-0 animate-marquee items-center justify-around",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={{ gap }}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

export { Marquee }
