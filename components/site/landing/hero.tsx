"use client"

import * as React from "react"
import { ArrowRight, Blocks, Bot, FileText, Palette } from "lucide-react"

import { LLMS_URL, SITE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/motion/copy-button"
import { PixelField } from "@/components/motion/pixel-field"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { LogoMark } from "@/components/site/logo-mark"
import { useDocsNav } from "@/components/docs/docs-nav"
import {
  COUNTS,
  CopyPromptButton,
  GitHubIcon,
} from "@/components/site/landing/shared"

const NAV = [
  { to: "", label: "Components" },
  { to: "ai", label: "Use with AI" },
  { to: "introduction", label: "Docs" },
  { to: "theming", label: "Theming" },
]

export function Header() {
  const nav = useDocsNav()
  return (
    <>
      <div className="sticky top-0 z-40 bg-linear-to-b from-background from-60% to-transparent px-3 pt-3 pb-3 sm:px-6">
        <header className="mx-auto flex h-14 max-w-5xl items-center gap-6 border bg-background/90 px-3 shadow-sm backdrop-blur-xl sm:px-4">
          <a
            href="#"
            className="flex items-center gap-2"
            aria-label="opendraft home"
          >
            <LogoMark />
            <span className="text-lg tracking-[-0.01em]">{SITE.name}</span>
            <span className="hidden border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              v{SITE.version}
            </span>
          </a>
          <nav className="hidden items-center gap-5 text-[13px] text-muted-foreground md:flex">
            {NAV.map((item) => (
              <nav.Link
                key={item.label}
                href={nav.href(item.to)}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </nav.Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon-sm" asChild>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                aria-label="opendraft on GitHub"
              >
                <GitHubIcon />
              </a>
            </Button>
            <ThemeToggle />
            <Button variant="ink" size="sm" caps asChild className="ml-1">
              <nav.Link href={nav.href("installation")}>Get started</nav.Link>
            </Button>
          </div>
        </header>
      </div>
      <Notice />
    </>
  )
}

/** The one-line "what's new" tab that hangs under the header. */
function Notice() {
  const nav = useDocsNav()
  return (
    <nav.Link
      href={nav.href("ai")}
      className="relative z-30 mx-auto -mt-3 flex w-fit max-w-[calc(100%-2rem)] items-center gap-2 border border-t-0 bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="size-1.5 shrink-0 bg-primary" />
      <span className="truncate">
        <span className="text-foreground">New:</span> give Claude the whole
        system with one link
      </span>
      <ArrowRight className="size-3.5 shrink-0" />
    </nav.Link>
  )
}

const PILLARS = [
  {
    icon: <Blocks />,
    title: `${COUNTS.total} components`,
    body: "From buttons to data tables, installed as source.",
  },
  {
    icon: <Bot />,
    title: `${COUNTS.agents} AI patterns`,
    body: "Chat, tool calls, approvals and thinking traces.",
  },
  {
    icon: <Palette />,
    title: "One theme file",
    body: "Light and dark mode from the same tokens.",
  },
  {
    icon: <FileText />,
    title: "Docs AI can read",
    body: "An llms.txt index and a plain page per component.",
  },
]

export function Hero() {
  const nav = useDocsNav()
  return (
    <section className="border-b">
      <div className="relative overflow-hidden">
        <PixelField
          variant="matrix"
          className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_65%_at_center,transparent_70%,black_100%)] opacity-60"
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-8 sm:pt-28">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 eyebrow text-muted-foreground">
            <span>React</span>
            <span aria-hidden className="size-1 bg-border" />
            <span>Tailwind CSS v4</span>
            <span aria-hidden className="size-1 bg-border" />
            <span>shadcn registry</span>
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] font-light tracking-[-0.03em] text-balance sm:text-7xl">
            A design system your <span className="text-brand">AI</span> builds
            with
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            Paste one link into Claude. It learns opendraft&apos;s components,
            tokens and design rules, then builds your screens from them instead
            of inventing its own.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CopyPromptButton variant="ink" size="lg" />
            <Button variant="outline" size="lg" asChild className="bg-card">
              <nav.Link href={nav.href("")}>
                Browse components <ArrowRight />
              </nav.Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-1 border bg-card py-1 pr-1 pl-3 font-mono text-xs text-muted-foreground">
            <span className="text-brand">→</span>
            <span className="ml-1 truncate">
              {LLMS_URL.replace("https://", "")}
            </span>
            <CopyButton value={LLMS_URL} aria-label="Copy the llms.txt link" />
          </div>
        </div>
      </div>

      <ul className="grid gap-px border-t bg-border sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <li
            key={p.title}
            className="flex flex-col items-center gap-2 bg-background px-6 py-8 text-center"
          >
            <span className="grid size-9 place-items-center border bg-card text-brand [&_svg]:size-4">
              {p.icon}
            </span>
            <p className="mt-1 text-sm font-medium">{p.title}</p>
            <p className="max-w-56 text-sm text-pretty text-muted-foreground">
              {p.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
