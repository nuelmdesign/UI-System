"use client"

import * as React from "react"
import { motion } from "motion/react"
import { ArrowUpRight, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { duration, ease, spring } from "@/lib/motion"
import {
  SITE,
  aiPrompt,
  aiPromptInline,
  chatgptUrl,
  claudeUrl,
} from "@/lib/site"
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  ENTRY_BY_SLUG,
  GUIDES,
  entriesIn,
} from "@/components/docs/entries"
import { useDocsNav, useSiteBase } from "@/components/docs/docs-nav"
import { CodeBlock } from "@/components/agents/code-block"
import { ThemeBuilder } from "@/components/site/theme-builder"
import { CopyButton } from "@/components/motion/copy-button"
import { PixelField } from "@/components/motion/pixel-field"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useCases from "@/content/ai/use-cases.json"
import { toast } from "sonner"

export function GuidePage({ slug }: { slug: string }) {
  const guide = GUIDES.find((g) => g.slug === slug)
  if (!guide) return null
  const Body = BODIES[slug]

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      <p className="flex items-center gap-2 eyebrow text-muted-foreground">
        <span className="size-2 bg-primary" /> Get started
      </p>
      <h1 className="mt-4 heading text-4xl leading-tight sm:text-5xl">
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
  return <h2 className="border-b pb-3 heading text-2xl">{children}</h2>
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
          <strong>opendraft</strong> is a personal design system for apps and
          agent interfaces. Behavior comes from Radix, the look comes from one
          token file, and every state change moves with the same set of springs.
        </p>
        <p>
          Components install as source through a shadcn registry. You own the
          code once it&apos;s in your project, and token names match
          shadcn&apos;s, so stock shadcn components pick up the theme too.
        </p>
      </Prose>
      <div className="grid border-t border-l sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORY_ORDER.map((c) => (
          <nav.Link
            key={c}
            href={nav.href("")}
            className="grid gap-2 border-r border-b bg-card p-5 transition-colors hover:bg-accent"
          >
            <span className="heading text-3xl">{entriesIn(c).length}</span>
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

/* -------------------------------- Use with AI ------------------------------- */

const SAVE_RULES = `curl -o opendraft.md ${SITE.files}/llms-full.txt`

function UseWithAi() {
  const nav = useDocsNav()
  const base = useSiteBase()
  const prompt = aiPrompt()
  const [copyingInline, setCopyingInline] = React.useState(false)

  async function copyInline() {
    setCopyingInline(true)
    try {
      const res = await fetch(`${base}llms.txt`)
      if (!res.ok) throw new Error(String(res.status))
      await navigator.clipboard.writeText(aiPromptInline(await res.text()))
      toast.success("Copied the prompt with the rules inside")
    } catch {
      toast.error("Couldn't copy the prompt")
    } finally {
      setCopyingInline(false)
    }
  }
  const files = [
    {
      href: `${base}llms.txt`,
      name: "llms.txt",
      about:
        "The setup steps, design rules and tokens, followed by an index of every component with its install command. This is the link in the prompt.",
    },
    {
      href: `${base}llms-full.txt`,
      name: "llms-full.txt",
      about:
        "The rules plus every component page in one file, for tools that can't follow links.",
    },
    {
      href: `${base}llms/prompt-bar.md`,
      name: "llms/<slug>.md",
      about:
        "One page per component: install command, import, props and types, and a working example. The Copy for AI button on each component page copies it.",
    },
  ]

  return (
    <>
      <Prose>
        <p>
          Paste one link into an AI assistant and it learns opendraft&apos;s
          setup steps, design rules, tokens and the full component list. It then
          installs the real components instead of inventing look-alikes.
        </p>
      </Prose>
      <section className="grid gap-4">
        <H2>1. Paste the prompt</H2>
        <Prose>
          <p>
            Start a chat with this prompt and replace the last line with what
            you want to build.
          </p>
        </Prose>
        <CodeBlock
          filename="prompt"
          language="text"
          code={prompt}
          status="complete"
          copyable={false}
          showLineNumbers={false}
          wrap
        />
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton value={prompt} variant="outline" size="icon-sm" />
          <Button size="sm" asChild>
            <a href={claudeUrl(prompt)} target="_blank" rel="noreferrer">
              Open in Claude <ArrowUpRight />
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={chatgptUrl(prompt)} target="_blank" rel="noreferrer">
              Open in ChatGPT <ArrowUpRight />
            </a>
          </Button>
          <Button
            size="sm"
            variant="outline"
            loading={copyingInline}
            onClick={copyInline}
          >
            <Copy /> Copy with rules included
          </Button>
        </div>
        <Prose>
          <p>
            Some assistants can&apos;t open links, and ChatGPT often can&apos;t
            open GitHub files. &quot;Copy with rules included&quot; puts the
            rules and component index in the prompt itself, so nothing needs
            fetching. The assistant writes the code and lists the install
            commands; you run them in your project.
          </p>
        </Prose>
      </section>
      <section className="grid gap-4">
        <H2>2. What the assistant reads</H2>
        <div className="grid border-t border-l">
          {files.map((file) => (
            <a
              key={file.name}
              href={file.href}
              target="_blank"
              rel="noreferrer"
              className="grid gap-1 border-r border-b bg-card p-4 transition-colors hover:bg-accent"
            >
              <span className="flex items-center gap-1.5 font-mono text-sm text-brand">
                {file.name} <ArrowUpRight className="size-3.5" />
              </span>
              <span className="text-sm text-muted-foreground">
                {file.about}
              </span>
            </a>
          ))}
        </div>
        <Prose>
          <p>
            All three are generated from the same sources as these docs, so they
            list the same components and props.
          </p>
        </Prose>
      </section>
      <section className="grid gap-4">
        <H2>3. Editors with project rules</H2>
        <Prose>
          <p>
            Tools that read a rules file from the project (Cursor rules, Claude
            Code&apos;s <code>CLAUDE.md</code>, and similar) work best with the
            rules saved locally. Download <code>llms-full.txt</code> into the
            project:
          </p>
        </Prose>
        <CodeBlock
          filename="terminal"
          language="bash"
          code={SAVE_RULES}
          status="complete"
          showLineNumbers={false}
        />
        <Prose>
          <p>
            Then reference it from the rules file, for example a line in{" "}
            <code>CLAUDE.md</code> that says{" "}
            <code>Build UI with opendraft. Follow @opendraft.md.</code> Download
            it again when you want the latest components.
          </p>
        </Prose>
      </section>
      <section className="grid gap-4">
        <H2>What to expect</H2>
        <Prose>
          <ul className="grid list-disc gap-2 pl-5">
            <li>
              It installs <code>@opendraft</code> components with the shadcn
              CLI, starting with <code>@opendraft/theme</code>, and imports them
              from <code>@/components</code>.
            </li>
            <li>
              It styles only with tokens such as <code>bg-primary</code> and{" "}
              <code>text-muted-foreground</code>, never raw palette colors.
            </li>
            <li>
              It writes a new component only when nothing in the{" "}
              <nav.Link
                href={nav.href("")}
                className="text-brand underline-offset-4 hover:underline"
              >
                component list
              </nav.Link>{" "}
              fits, and builds it from existing parts.
            </li>
          </ul>
        </Prose>
      </section>
    </>
  )
}

/* ------------------------------- Installation ------------------------------ */

const COMPONENTS_JSON = `{
  "registries": {
    "@opendraft": "https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/r/{name}.json"
  }
}`

const COMMANDS = `npx shadcn@latest add @opendraft/theme      # tokens, light and dark
npx shadcn@latest add @opendraft/button     # any single component
npx shadcn@latest add @opendraft/all        # everything`

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
            <code>components.json</code>), add the <code>@opendraft</code>{" "}
            registry:
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
        <H2>Make it yours</H2>
        <Prose>
          <p>
            The look below is opendraft&apos;s default. Seven brand tokens at
            the top of the theme change it everywhere: heading, body and code
            fonts, heading weight, the primary color, and corner radius for
            controls (buttons, inputs, tabs) and for surfaces (cards, menus,
            dialogs). Pick yours here, then copy the CSS, or copy the prompt and
            Claude will make the change for you.
          </p>
        </Prose>
        <ThemeBuilder />
      </section>
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
          <p className="heading text-4xl leading-none">
            Newsreader, light, for headings (the default)
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
            By default corners are nearly square (2px on controls, 3px on
            surfaces), set by <code>--control-radius</code> and{" "}
            <code>--surface-radius</code>; <code>rounded-full</code> is only for
            avatars, dots and radios. Hairline borders carry structure; shadows
            only lift floating layers. Use <code>bg-dots</code> or{" "}
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

/* -------------------------------- Use cases -------------------------------- */

const FIT_BADGE = {
  ready: { label: "Ready", variant: "success" },
  adapt: { label: "Adapt", variant: "warning" },
  gap: { label: "Gap", variant: "secondary" },
} as const

function UseCasesGuide() {
  const nav = useDocsNav()
  return (
    <>
      <Prose>
        <p>{useCases.intro}</p>
        <p>
          Assistants read the same playbooks: the Use cases list in{" "}
          <code>llms.txt</code> points to one page per domain, and{" "}
          <a
            href={`${SITE.files}/use-cases.json`}
            className="text-brand underline-offset-4 hover:underline"
          >
            use-cases.json
          </a>{" "}
          has everything as data. Each playbook has a starter kit that installs
          the theme and the components it recommends in one command.
        </p>
      </Prose>
      <section className="grid gap-4">
        <H2>Pick a domain</H2>
        <Tabs defaultValue={useCases.domains[0].id} className="gap-6">
          <TabsList className="h-auto w-full flex-wrap justify-start">
            {useCases.domains.map((d) => (
              <TabsTrigger key={d.id} value={d.id}>
                {d.short}
              </TabsTrigger>
            ))}
          </TabsList>
          {useCases.domains.map((d) => {
            const kit = `npx shadcn@latest add @opendraft/kit-${d.id}`
            return (
              <TabsContent key={d.id} value={d.id} className="grid gap-8">
                <div className="grid gap-3">
                  <h3 className="heading text-2xl">{d.title}</h3>
                  <Prose>
                    <p>{d.summary}</p>
                    <p>
                      <strong>Signals:</strong> {d.signals.join(", ")}.
                    </p>
                  </Prose>
                  <CodeBlock
                    code={kit}
                    language="bash"
                    status="complete"
                    copyable={false}
                    showLineNumbers={false}
                    wrap
                  />
                  <div>
                    <CopyButton value={kit} variant="outline" size="icon-sm" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <h4 className="eyebrow text-muted-foreground">Principles</h4>
                  <ul className="grid gap-2 text-[15px] leading-7 text-muted-foreground">
                    {d.principles.map((p) => (
                      <li key={p} className="flex gap-3">
                        <span
                          aria-hidden
                          className="mt-2.5 size-1.5 shrink-0 bg-primary"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-3">
                  <h4 className="eyebrow text-muted-foreground">
                    What it needs, and what to use
                  </h4>
                  <div className="grid border-t">
                    {d.needs.map((n) => {
                      const fit = FIT_BADGE[n.status as keyof typeof FIT_BADGE]
                      return (
                        <div
                          key={n.need}
                          className="grid gap-2 border-b py-4 text-[15px]"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{n.need}</span>
                            <Badge variant={fit.variant}>{fit.label}</Badge>
                          </div>
                          <p className="flex flex-wrap gap-x-3 gap-y-1">
                            {n.use.map((slug) => (
                              <nav.Link
                                key={slug}
                                href={nav.href(slug)}
                                className="font-mono text-[13px] text-brand underline-offset-4 hover:underline"
                              >
                                {ENTRY_BY_SLUG[slug]?.title ?? slug}
                              </nav.Link>
                            ))}
                          </p>
                          {n.notes && (
                            <p className="text-muted-foreground">{n.notes}</p>
                          )}
                          {"gap" in n && n.gap && (
                            <p className="text-muted-foreground">
                              <strong className="font-medium text-foreground">
                                Missing:
                              </strong>{" "}
                              {n.gap}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="grid gap-3">
                  <h4 className="eyebrow text-muted-foreground">
                    Typical screens
                  </h4>
                  <ul className="grid gap-2 text-[15px] text-muted-foreground">
                    {d.screens.map((x) => (
                      <li key={x.name}>
                        <strong className="font-medium text-foreground">
                          {x.name}
                        </strong>
                        :{" "}
                        {x.compose
                          .map((c) => ENTRY_BY_SLUG[c]?.title ?? c)
                          .join(" + ")}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </section>
      <section className="grid gap-4">
        <H2>Missing across every domain</H2>
        <Prose>
          <p>
            These gaps came up in more than one playbook. They are the next
            components to build, in rough order of how often they are needed.
          </p>
        </Prose>
        <ul className="grid border-t">
          {useCases.crossDomainGaps.map((g) => (
            <li key={g.id} className="grid gap-1 border-b py-3 text-[15px]">
              <span className="font-medium">{g.title}</span>
              <span className="text-muted-foreground">{g.why}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

const BODIES: Record<string, React.ComponentType> = {
  introduction: Introduction,
  ai: UseWithAi,
  "use-cases": UseCasesGuide,
  installation: Installation,
  theming: Theming,
  motion: MotionGuide,
}
