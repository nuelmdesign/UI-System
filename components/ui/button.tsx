import * as React from "react"
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    "outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/88",
        brand:
          "bg-brand text-brand-foreground shadow-sm shadow-brand/20 [box-shadow:var(--highlight),var(--shadow-sm)] hover:bg-brand/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        outline:
          "border bg-background shadow-xs [box-shadow:var(--highlight),var(--shadow-xs)] hover:bg-accent dark:bg-input/20 dark:hover:bg-input/40",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        link: "text-brand underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        xs: "h-7 rounded-sm px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3",
        default: "h-9 px-4",
        lg: "h-10 px-5",
        xl: "h-12 rounded-lg px-6 text-base",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-xs": "size-7 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner />
            </span>
          )}
          <span
            className={cn(
              "inline-flex items-center gap-2",
              loading && "invisible"
            )}
          >
            {children}
          </span>
        </>
      )}
    </Comp>
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export { Button, buttonVariants, Spinner }
