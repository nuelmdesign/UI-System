"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { duration, ease, spring } from "@/lib/motion"
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  GUIDES,
  entriesIn,
} from "@/components/docs/entries"
import { useDocsNav } from "@/components/docs/docs-nav"
import { CodeBlock } from "@/components/agents/code-block"
import { PixelField } from "@/components/motion/pixel-field"
import { Button } from "@/components/ui/button"

export function GuidePage({ slug }: { slug: string }) {
  const guide = GUIDES.find((g) => g.slug === slug)
  if (!guide) return null
  const Body = BODIES[slug]

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      <p className="flex items-center gap-2 eyebrow text-muted-foreground">
        <span className="size-2 bg-primary" /> Get started
      </p>
      <h1 className="mt-4 font-display text-4xl leading-tight font-light tracking-[-0.02em] sm:text-5xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-pretty text-muted-foreground">
        {guide.description}
      </p>
      <div className="mt-10 grid gap-10">
        <Body />
      </div>
    </div>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b pb-3 font-display text-2xl font-light tracking-[-0.01em]">
      {children}
    </h2>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 text-[15px] leading-7 text-muted-foreground [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground [&_strong]:font-medium [&_strong]:text-foreground">
      {children}
    </div>
  )
}

/* ------------------------------- Introduction ------------------------------ */

function Introduction() {
  const nav = useDocsNav()
  return (
    <>
      <Prose>
        <p>
          <strong>nuelm/ui</strong> is a personal design system for apps and
          agent interfaces. Behavior comes from Radix, the look comes from one
          token file, and every state change moves with the same set of springs.
        </p>
        <p>
          Components install as source through a shadcn registry. You own the
          code once it&apos;s in your project, and token names match
          shadcn&apos;s, so stock shadcn components pick up the theme too.
        </p>
      </Prose>
      <div className="grid border-t border-l sm:grid-cols-3">
        {CATEGORY_ORDER.map((c) => (
          <nav.Link
            key={c}
            href={nav.href("")}
            className="grid gap-2 border-r border-b bg-card p-5 transition-colors hover:bg-accent"
          >
            <span className="font-display text-3xl font-light">
              {entriesIn(c).length}
            </span>
            <span className="text-sm text-muted-foreground">
              {CATEGORY_LABEL[c]}
            </span>
          </nav.Link>
        ))}
      </div>
      <section className="grid gap-4">
        <H2>How it&apos;s organised</H2>
        <Prose>
          <p>
            <code>components/ui</code> holds the core set: buttons, inputs,
            menus, dialogs. <code>components/motion</code> holds animated and
            app-level pieces: the sidebar, data table, command palette and
            textures. <code>components/agents</code> holds everything for chat,
            tools, approvals and voice.
          </p>
          <p>
            Tokens live in <code>app/globals.css</code>; motion lives in{" "}
            <code>lib/motion.ts</code>. Components never hard-code colors,
            shadows, easings or springs.
          </p>
        </Prose>
      </section>
    </>
  )
}

/* ------------------------------- Installation ------------------------------ */

const COMPONENTS_JSON = `{
  "registries": {
    "@nuelm": "https://nuelm-ui.vercel.app/r/{name}.json"
  }
}`

const COMMANDS = `npx shadcn@latest add @nuelm/theme      # tokens, light and dark
npx shadcn@latest add @nuelm/button     # any single component
npx shadcn@latest add @nuelm/all        # everything`

const MOTION_CONFIG = `import { MotionConfig } from "motion/react"

export function Providers({ children }: { children: React.ReactNode }) {
  // Respect the OS "reduce motion" setting in every component.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}`

function Installation() {
  return (
    <>
      <section className="grid gap-4">
        <H2>1. Add the registry</H2>
        <Prose>
          <p>
            In a project that already uses shadcn (Tailwind v4, a{" "}
            <code>components.json</code>), add the <code>@nuelm</code> registry:
          </p>
        </Prose>
        <CodeBlock
          filename="components.json"
          language="json"
          code={COMPONENTS_JSON}
          status="complete"
        />
      </section>
      <section className="grid gap-4">
        <H2>2. Install the theme, then components</H2>
        <CodeBlock
          filename="terminal"
          language="bash"
          code={COMMANDS}
          status="complete"
        />
        <Prose>
          <p>
            Dependencies come along automatically: installing{" "}
            <code>chat-app</code> also brings the sidebar, messages and the
            motion tokens it needs.
          </p>
        </Prose>
      </section>
      <section className="grid gap-4">
        <H2>3. Wrap your app once</H2>
        <CodeBlock
          filename="providers.tsx"
          language="tsx"
          code={MOTION_CONFIG}
          status="complete"
        />
      </section>
      <section className="grid gap-4">
        <H2>4. Fonts</H2>
        <Prose>
          <p>
            The theme expects three font variables: <code>--font-geist</code>{" "}
            (interface), <code>--font-newsreader</code> (display) and{" "}
            <code>--font-geist-mono</code> (labels). In Next.js, load them with{" "}
            <code>next/font/google</code> and put their variables on{" "}
            <code>&lt;html&gt;</code>.
          </p>
        </Prose>
      </section>
    </>
  )
}

/* --------------------------------- Theming --------------------------------- */

const SEMANTIC = [
  ["background", "Page ground"],
  ["card", "Raised surfaces"],
  ["surface", "Inset areas, sidebars"],
  ["muted", "Quiet fills"],
  ["border", "Hairlines"],
  ["foreground", "Text"],
  ["muted-foreground", "Secondary text"],
  ["primary", "Actions, selection"],
  ["brand", "Accent text and strokes"],
  ["ink", "Solid black buttons and bands"],
  ["success", "Positive status"],
  ["warning", "Caution"],
  ["destructive", "Errors, deletes"],
] as const

const BLUES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
]

function Theming() {
  return (
    <>
      <section className="grid gap-4">
        <H2>Color</H2>
        <Prose>
          <p>
            Semantic tokens, redefined for dark mode under <code>.dark</code>.
            Use them through Tailwind (<code>bg-primary</code>,{" "}
            <code>text-muted-foreground</code>) and never reach for raw palette
            colors.
          </p>
        </Prose>
        <div className="grid border-t border-l sm:grid-cols-2">
          {SEMANTIC.map(([token, use]) => (
            <div
              key={token}
              className="flex items-center gap-3 border-r border-b bg-card p-3"
            >
              <span
                className="size-8 shrink-0 ring-1 ring-border ring-inset"
                style={{ background: `var(--${token})` }}
              />
              <div className="min-w-0">
                <p className="font-mono text-xs">--{token}</p>
                <p className="text-xs text-muted-foreground">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4">
        <H2>Blue scale</H2>
        <div className="grid grid-cols-6 gap-px sm:grid-cols-11">
          {BLUES.map((step) => (
            <div key={step} className="grid gap-1.5">
              <div
                className="h-14 ring-1 ring-border ring-inset"
                style={{ background: `var(--blue-${step})` }}
              />
              <p className="font-mono text-[10px] text-muted-foreground">
                {step}
              </p>
            </div>
          ))}
        </div>
        <Prose>
          <p>
            <code>--blue-600</code> is primary in light mode,{" "}
            <code>--blue-500</code> in dark. The whole scale is available as{" "}
            <code>bg-blue-*</code> for charts and textures.
          </p>
        </Prose>
      </section>
      <section className="grid gap-4">
        <H2>Type</H2>
        <div className="grid gap-5 border bg-card p-6">
          <p className="font-display text-4xl leading-none font-light tracking-[-0.02em]">
            Newsreader, light, for display
          </p>
          <p className="text-sm">
            Geist for interface text, labels, inputs and data.
          </p>
          <p className="eyebrow text-muted-foreground">
            Geist Mono · the eyebrow utility
          </p>
        </div>
      </section>
      <section className="grid gap-4">
        <H2>Shape and texture</H2>
        <Prose>
          <p>
            Corners stay square (0 to 6px); <code>rounded-full</code> is only
            for avatars, dots and radios. Hairline borders carry structure;
            shadows only lift floating layers. Use <code>bg-dots</code> or{" "}
            <code>PixelField</code> for texture, and add the <code>dark</code>{" "}
            class to any section to make it a dark band in either theme.
          </p>
        </Prose>
        <div className="dark grid h-32 overflow-hidden border bg-background">
          <PixelField variant="equalizer" className="h-full" />
        </div>
      </section>
    </>
  )
}

/* --------------------------------- Motion ---------------------------------- */

function MotionGuide() {
  const [on, setOn] = React.useState(false)
  const springs = Object.entries(spring) as [
    keyof typeof spring,
    (typeof spring)[keyof typeof spring],
  ][]

  return (
    <>
      <Prose>
        <p>
          Every animated component imports its timing from{" "}
          <code>lib/motion.ts</code>. Components brought in from beUI are
          retuned to these tokens, so the whole library moves the same way.
        </p>
      </Prose>
      <section className="grid gap-4">
        <H2>Springs</H2>
        <div className="grid gap-2.5 border bg-card p-5">
          {springs.map(([name, config]) => (
            <div key={name} className="flex items-center gap-4">
              <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">
                {name}
              </span>
              <div className="relative h-7 flex-1 border bg-surface">
                <motion.div
                  className="absolute top-[3px] size-5 bg-primary"
                  animate={{ left: on ? "calc(100% - 1.5rem)" : "0.1875rem" }}
                  transition={config}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              caps
              onClick={() => setOn((v) => !v)}
            >
              Play springs
            </Button>
          </div>
        </div>
        <Prose>
          <p>
            <strong>snappy</strong> for toggles and presses,{" "}
            <strong>smooth</strong> for panels and layout, <strong>pop</strong>{" "}
            for arriving messages, <strong>gentle</strong> for page-level
            movement, <strong>glide</strong> for values tracking live input,{" "}
            <strong>bouncy</strong> only for celebratory moments.
          </p>
        </Prose>
      </section>
      <section className="grid gap-4">
        <H2>Easings and durations</H2>
        <div className="grid border-t border-l sm:grid-cols-2">
          {Object.entries(ease).map(([name, curve]) => (
            <div
              key={name}
              className="grid gap-1 border-r border-b bg-card p-4"
            >
              <p className="font-mono text-xs">ease.{name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                cubic-bezier({(curve as readonly number[]).join(", ")})
              </p>
            </div>
          ))}
          {Object.entries(duration).map(([name, value]) => (
            <div
              key={name}
              className={cn("grid gap-1 border-r border-b bg-card p-4")}
            >
              <p className="font-mono text-xs">duration.{name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {value}s
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const BODIES: Record<string, React.ComponentType> = {
  introduction: Introduction,
  installation: Installation,
  theming: Theming,
  motion: MotionGuide,
}
