"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { aiPrompt } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion/reveal"
import { ENTRIES, entriesIn } from "@/components/docs/entries"

/** Live counts, so the page never claims more (or fewer) components than exist. */
export const COUNTS = {
  total: ENTRIES.length,
  agents: entriesIn("Agents").length,
  data: entriesIn("Data").length,
  core: entriesIn("Components").length,
  motion: entriesIn("Motion").length,
}

/** Small boxed label above a section title. */
export function SectionLabel({
  icon,
  children,
  className,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 border bg-card px-2.5 eyebrow text-muted-foreground [&_svg]:size-3.5 [&_svg]:text-brand",
        className
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/** Centered label, title and one line of support copy. */
export function SectionIntro({
  id,
  icon,
  label,
  title,
  children,
  className,
}: {
  id?: string
  icon?: React.ReactNode
  label: string
  title: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal
      id={id}
      className={cn(
        "mx-auto flex max-w-2xl scroll-mt-28 flex-col items-center text-center",
        className
      )}
    >
      <SectionLabel icon={icon}>{label}</SectionLabel>
      <h2 className="mt-5 heading text-4xl leading-[1.05] text-balance sm:text-5xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
          {children}
        </p>
      ) : null}
    </Reveal>
  )
}

/** Vertical rhythm and the hairline between sections. */
export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("border-b px-4 py-20 sm:px-8 sm:py-28", className)}
      {...props}
    >
      {children}
    </section>
  )
}

/** Copies the ready-made prompt that points an assistant at opendraft. */
export function CopyPromptButton({
  label = "Copy prompt for Claude",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick" | "children"> & {
  label?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <Button
      className={className}
      onClick={async () => {
        await navigator.clipboard.writeText(aiPrompt())
        setCopied(true)
        toast("Prompt copied", {
          description: "Paste it into Claude and describe what to build.",
        })
      }}
      {...props}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Copied" : label}
    </Button>
  )
}

/** GitHub's mark. lucide no longer ships brand icons. */
export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-4", className)}
      fill="currentColor"
    >
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  )
}
