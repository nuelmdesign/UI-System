"use client"

import * as React from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { SITE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/motion/reveal"
import { LogoMark } from "@/components/site/logo-mark"
import { useDocsNav } from "@/components/docs/docs-nav"
import {
  CopyPromptButton,
  GitHubIcon,
  Section,
  SectionLabel,
} from "@/components/site/landing/shared"

const FAQ: { group: string; items: [string, React.ReactNode][] }[] = [
  {
    group: "Using it with AI",
    items: [
      [
        "How do I use opendraft with Claude?",
        "Copy the prompt from this page and paste it into Claude along with what you want to build. The prompt points Claude at llms.txt, which explains the setup, the design rules and every component.",
      ],
      [
        "Does it work with other AI tools?",
        "Yes. Any assistant that can open a link can read llms.txt. For tools that work from files in your project, like Cursor or Claude Code, save llms-full.txt into the project and point your rules file at it.",
      ],
      [
        "Can I use my own fonts, colors and corner radius?",
        "Yes. opendraft's look is a default. Tell Claude what you want, like Inter for headings, IBM Plex Sans for body text, a black primary and 12px buttons, and it changes the brand tokens so every component follows. The theme builder on this page writes that prompt for you.",
      ],
      [
        "Will the assistant still write its own components?",
        "Only when nothing in opendraft fits. The rules tell it to install existing components first, and to build anything new from opendraft parts and tokens.",
      ],
    ],
  },
  {
    group: "Code",
    items: [
      [
        "What does my project need?",
        "React 19, Tailwind CSS v4 and a shadcn components.json. Next.js works well but isn't required.",
      ],
      [
        "Is there an npm package?",
        "No. Components install through the shadcn CLI as source files in your project, so you can read and change all of it.",
      ],
      [
        "Can I add it to an existing shadcn project?",
        "Yes. opendraft keeps shadcn's token names, so your current components pick up the theme and opendraft components sit alongside them.",
      ],
    ],
  },
  {
    group: "Cost and credits",
    items: [
      [
        "Is opendraft free?",
        "Yes. Once a component is installed, the code is in your project and yours to change.",
      ],
      [
        "Where do the components come from?",
        "Most are original. Some are adapted from beUI (MIT) and Beautiful UI and restyled to opendraft's tokens. The credits are in THIRD_PARTY_NOTICES.md on GitHub.",
      ],
    ],
  },
]

export function Faq() {
  return (
    <Section id="faq" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-5 heading text-4xl leading-[1.05] sm:text-5xl">
            Questions, answered
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Something missing? Open an issue on GitHub and it&apos;ll be added
            here.
          </p>
        </Reveal>
        <div className="grid gap-10">
          {FAQ.map(({ group, items }) => (
            <div key={group}>
              <p className="eyebrow text-muted-foreground">{group}</p>
              <Accordion type="single" collapsible className="mt-2">
                {items.map(([q, a]) => (
                  <AccordionItem key={q} value={q}>
                    <AccordionTrigger className="text-[15px]">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-pretty text-muted-foreground">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function Closing() {
  const nav = useDocsNav()
  return (
    <Section className="text-center">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center">
        <LogoMark className="size-10" />
        <h2 className="mt-6 heading text-4xl leading-[1.05] text-balance sm:text-6xl">
          Build your next screen with opendraft
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          Copy the prompt, tell Claude what you need, and start from real
          components.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CopyPromptButton variant="ink" size="lg" />
          <Button variant="outline" size="lg" asChild className="bg-card">
            <nav.Link href={nav.href("installation")}>
              Install by hand <ArrowRight />
            </nav.Link>
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.06} className="mx-auto mt-16 max-w-md">
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-4 border bg-card p-5 text-left transition-colors hover:bg-accent"
        >
          <span className="grid size-11 shrink-0 place-items-center border bg-background">
            <GitHubIcon className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">
              Follow along on GitHub
            </span>
            <span className="block text-sm text-pretty text-muted-foreground">
              Report a bug, ask for a component or read the source.
            </span>
          </span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </Reveal>
    </Section>
  )
}

export function Footer() {
  const nav = useDocsNav()
  const base = nav.registryBase.replace(/r\/$/, "")

  const columns: {
    title: string
    links: { label: string; href: string; external?: boolean }[]
  }[] = [
    {
      title: "Components",
      links: [
        { label: "All components", href: nav.href("") },
        { label: "AI agents", href: nav.href("thinking-trace") },
        { label: "Data & workflows", href: nav.href("records-table") },
        { label: "Motion", href: nav.href("animated-number") },
      ],
    },
    {
      title: "Docs",
      links: [
        { label: "Introduction", href: nav.href("introduction") },
        { label: "Installation", href: nav.href("installation") },
        { label: "Use with AI", href: nav.href("ai") },
        { label: "Theming", href: nav.href("theming") },
        { label: "Motion", href: nav.href("motion") },
      ],
    },
    {
      title: "For AI",
      links: [
        { label: "llms.txt", href: `${base}llms.txt`, external: true },
        {
          label: "llms-full.txt",
          href: `${base}llms-full.txt`,
          external: true,
        },
        {
          label: "Registry index",
          href: `${base}r/registry.json`,
          external: true,
        },
      ],
    },
    {
      title: "Project",
      links: [
        { label: "GitHub", href: SITE.github, external: true },
        {
          label: "Third-party notices",
          href: `${SITE.github}/blob/main/THIRD_PARTY_NOTICES.md`,
          external: true,
        },
      ],
    },
  ]

  return (
    <footer className="relative overflow-hidden">
      <div className="grid gap-10 px-4 py-14 sm:px-8 md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
        <div>
          <a href="#" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-lg tracking-[-0.01em]">{SITE.name}</span>
          </a>
          <p className="mt-3 max-w-56 text-sm text-muted-foreground">
            A design system your AI builds with.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-muted-foreground">{col.title}</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <nav.Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </nav.Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-5 text-xs text-muted-foreground sm:px-8">
        <span>© 2026 opendraft · v{SITE.version}</span>
        <span>Built on shadcn/ui, Radix, Tailwind CSS and Motion.</span>
      </div>
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] text-center heading text-[22vw] leading-none text-transparent select-none [-webkit-text-stroke:1px_var(--input)] lg:text-[15rem]"
      >
        opendraft
      </p>
    </footer>
  )
}
