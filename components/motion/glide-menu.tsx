"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Box = { top: number; left: number; width: number; height: number }

/**
 * A list whose hover highlight glides between rows instead of each row
 * lighting up on its own. Mark each row with `data-menu-row` (or pass a
 * different `rowSelector`); the highlight follows the pointer and keyboard
 * focus, and fades out when neither is inside the list.
 */
function GlideMenu({
  className,
  highlightClassName,
  rowSelector = "[data-menu-row]",
  children,
  onPointerOver,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"div"> & {
  /** Classes for the moving highlight (color, inset, radius). */
  highlightClassName?: string
  rowSelector?: string
}) {
  const [box, setBox] = React.useState<Box | null>(null)
  const [visible, setVisible] = React.useState(false)

  const moveTo = (target: EventTarget | null, container: HTMLElement) => {
    if (!(target instanceof Element)) return
    const row = target.closest<HTMLElement>(rowSelector)
    if (!row || !container.contains(row)) return
    setBox({
      top: row.offsetTop,
      left: row.offsetLeft,
      width: row.offsetWidth,
      height: row.offsetHeight,
    })
    setVisible(true)
  }

  return (
    <div
      data-slot="glide-menu"
      className={cn("group/glide-menu relative", className)}
      onPointerOver={(event) => {
        moveTo(event.target, event.currentTarget)
        onPointerOver?.(event)
      }}
      onPointerLeave={(event) => {
        setVisible(false)
        onPointerLeave?.(event)
      }}
      onFocus={(event) => {
        if (event.target.matches(":focus-visible"))
          moveTo(event.target, event.currentTarget)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setVisible(false)
        onBlur?.(event)
      }}
      {...props}
    >
      <span
        aria-hidden
        data-slot="glide-menu-highlight"
        className={cn(
          "pointer-events-none absolute z-0 rounded-md bg-accent transition-[top,left,width,height,opacity] duration-200 ease-[var(--ease-out)]",
          highlightClassName
        )}
        style={{
          top: box?.top ?? 0,
          left: box?.left ?? 0,
          width: box?.width ?? 0,
          height: box?.height ?? 0,
          opacity: visible && box ? 1 : 0,
        }}
      />
      {children}
    </div>
  )
}

export { GlideMenu }
