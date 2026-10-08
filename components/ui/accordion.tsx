"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { motion } from "motion/react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { spring, duration, ease } from "@/lib/motion"

function Accordion(
  props: React.ComponentProps<typeof AccordionPrimitive.Root>
) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

const ItemOpenContext = React.createContext(false)

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)

  // Radix owns open state; mirror it so motion can animate height.
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const sync = () => setOpen(el.dataset.state === "open")
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] })
    return () => observer.disconnect()
  }, [])

  return (
    <ItemOpenContext.Provider value={open}>
      <AccordionPrimitive.Item
        ref={ref}
        data-slot="accordion-item"
        className={cn("border-b last:border-b-0", className)}
        {...props}
      />
    </ItemOpenContext.Provider>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none",
          "transition-colors hover:text-foreground/80 focus-visible:ring-[3px] focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[var(--ease-spring)] group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const open = React.useContext(ItemOpenContext)

  return (
    <AccordionPrimitive.Content forceMount asChild {...props}>
      <motion.div
        data-slot="accordion-content"
        initial={false}
        inert={!open}
        animate={
          open
            ? {
                height: "auto",
                opacity: 1,
                transition: {
                  height: spring.smooth,
                  opacity: { duration: duration.base, ease: ease.out },
                },
              }
            : {
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: duration.base, ease: ease.inOut },
                  opacity: { duration: duration.fast },
                },
              }
        }
        className="overflow-hidden text-sm text-muted-foreground"
      >
        <div className={cn("pb-4", className)}>{children}</div>
      </motion.div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
