"use client"

import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Copy,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { SITE, aiPrompt, claudeUrl } from "@/lib/site"
import {
  CATEGORY_LABEL,
  ENTRY_BY_SLUG,
  GUIDES,
  READING_ORDER,
  type DocEntry,
} from "@/components/docs/entries"
import { useDocsNav, useSiteBase } from "@/components/docs/docs-nav"
import { EXAMPLES } from "@/components/docs/examples"
import { CodeBlock } from "@/components/agents/code-block"
import { CopyButton } from "@/components/motion/copy-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RegistryFile = { path: string; content?: string; target?: string }
type RegistryItem = {
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
}

const SECTIONS = [
  ["preview", "Preview"],
  ["installation", "Installation"],
  ["dependencies", "Dependencies"],
  ["source", "Source"],
] as const

/** One component's page: live preview, example code, install and source. */
export function ComponentPage({
  entry,
  exampleCode,
}: {
  entry: DocEntry
  exampleCode: string
}) {
  const nav = useDocsNav()
  const Example = EXAMPLES[entry.slug]
  const registryName = entry.registry ?? entry.slug
  const install = `npx shadcn@latest add @opendraft/${registryName}`
  const [run, setRun] = React.useState(0)
  const item = useRegistryItem(nav.registryBase, registryName)

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-10 sm:px-8 sm:py-14">
      <article className="min-w-0 flex-1">
        <p className="flex items-center gap-2 eyebrow text-muted-foreground">
          <span className="size-2 bg-primary" />
          <nav.Link href={nav.href("")} className="hover:text-foreground">
            {CATEGORY_LABEL[entry.category]}
          </nav.Link>
          <span>/</span>
          <span className="text-foreground">{entry.title}</span>
        </p>
        <h1 className="mt-4 flex items-center gap-3 font-display text-4xl leading-tight font-light tracking-[-0.02em] sm:text-5xl">
          {entry.title}
          {entry.isNew ? (
            <Badge variant="brand" className="font-mono text-[10px] uppercase">
              New
            </Badge>
          ) : null}
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
          {entry.description}
        </p>
        <AiActions entry={entry} />

        <section id="preview" className="mt-10 scroll-mt-20">
          <Tabs defaultValue="preview" variant="underline">
            <div className="flex items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground"
                onClick={() => setRun((r) => r + 1)}
              >
                <RotateCcw /> Replay
              </Button>
            </div>
            <TabsContent value="preview" className="mt-1">
              <div className="flex min-h-80 items-center justify-center border bg-dots p-6 sm:p-10">
                <div key={run} className="flex w-full min-w-0 justify-center">
                  {Example ? <Example /> : null}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="code" className="mt-1">
              <CodeBlock
                filename={`${entry.slug}-demo.tsx`}
                language="tsx"
                code={exampleCode}
                status="complete"
                maxHeight={560}
              />
            </TabsContent>
          </Tabs>
        </section>

        <Heading id="installation">Installation</Heading>
        <div className="flex h-11 items-center gap-2 border bg-surface pr-1.5 pl-4 font-mono text-sm">
          <span className="text-brand">$</span>
          <span className="min-w-0 flex-1 truncate">{install}</span>
          <CopyButton value={install} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Needs the{" "}
          <code className="font-mono text-foreground">@opendraft</code> registry
          in your{" "}
          <code className="font-mono text-foreground">components.json</code>.
          See{" "}
          <nav.Link
            href={nav.href("installation")}
            className="text-brand underline-offset-4 hover:underline"
          >
            Installation
          </nav.Link>
          .
        </p>

        <Heading id="dependencies">Dependencies</Heading>
        {item.status === "loading" ? (
          <Skeleton className="h-8 w-2/3" />
        ) : item.status === "error" ? (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load the registry entry.
          </p>
        ) : (
          <Dependencies item={item.data} />
        )}

        <Heading id="source">Source</Heading>
        <p className="mb-4 text-sm text-muted-foreground">
          The files the install command adds to your project. They&apos;re yours
          to edit.
        </p>
        {item.status === "loading" ? (
          <Skeleton className="h-64 w-full" />
        ) : item.status === "ready" ? (
          <div className="grid gap-4">
            {(item.data.files ?? []).map((file) => (
              <CodeBlock
                key={file.path}
                filename={file.target ?? file.path}
                language={
                  file.path.endsWith(".ts") || file.path.endsWith(".tsx")
                    ? "tsx"
                    : "text"
                }
                code={file.content ?? ""}
                status="complete"
                maxHeight={420}
              />
            ))}
          </div>
        ) : null}

        <PrevNext slug={entry.slug} />
      </article>

      <aside className="sticky top-24 hidden h-fit w-48 shrink-0 xl:block">
        <p className="mb-3 eyebrow text-muted-foreground">On this page</p>
        <nav className="grid gap-1.5 text-sm">
          {SECTIONS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-left text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>
    </div>
  )
}

/** "Copy for AI" and "Open in Claude", for handing this page to an assistant. */
function AiActions({ entry }: { entry: DocEntry }) {
  const base = useSiteBase()
  const [copying, setCopying] = React.useState(false)
  const pageUrl = `${base}llms/${entry.slug}.md`
  const prompt = aiPrompt(
    `Use the ${entry.title} component (${SITE.files}/llms/${entry.slug}.md) in my project.`
  )

  async function copy() {
    setCopying(true)
    try {
      const res = await fetch(pageUrl)
      if (!res.ok) throw new Error(String(res.status))
      await navigator.clipboard.writeText(await res.text())
      toast.success("Copied page for AI")
    } catch {
      toast.error("Couldn't copy the page")
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" loading={copying} onClick={copy}>
        <Copy /> Copy for AI
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={claudeUrl(prompt)} target="_blank" rel="noreferrer">
          Open in Claude <ArrowUpRight />
        </a>
      </Button>
    </div>
  )
}

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-14 mb-4 scroll-mt-20 border-b pb-3 font-display text-2xl font-light tracking-[-0.01em]"
    >
      {children}
    </h2>
  )
}

function Dependencies({ item }: { item: RegistryItem }) {
  const nav = useDocsNav()
  const npm = item.dependencies ?? []
  const internal = (item.registryDependencies ?? []).map((d) =>
    d.replace(/^@opendraft\//, "")
  )

  if (!npm.length && !internal.length) {
    return (
      <p className="text-sm text-muted-foreground">
        None beyond React and Tailwind.
      </p>
    )
  }
  return (
    <dl className="grid gap-4 text-sm">
      {npm.length ? (
        <div className="grid gap-2">
          <dt className="eyebrow text-muted-foreground">npm packages</dt>
          <dd className="flex flex-wrap gap-1.5">
            {npm.map((d) => (
              <Badge key={d} variant="outline" className="font-mono">
                {d}
              </Badge>
            ))}
          </dd>
        </div>
      ) : null}
      {internal.length ? (
        <div className="grid gap-2">
          <dt className="eyebrow text-muted-foreground">Installed with it</dt>
          <dd className="flex flex-wrap gap-1.5">
            {internal.map((d) =>
              ENTRY_BY_SLUG[d] ? (
                <nav.Link key={d} href={nav.href(d)}>
                  <Badge variant="brand" className="font-mono">
                    {d}
                  </Badge>
                </nav.Link>
              ) : (
                <Badge key={d} variant="secondary" className="font-mono">
                  {d}
                </Badge>
              )
            )}
          </dd>
        </div>
      ) : null}
    </dl>
  )
}

function PrevNext({ slug }: { slug: string }) {
  const nav = useDocsNav()
  const i = READING_ORDER.indexOf(slug)
  const title = (s: string) =>
    ENTRY_BY_SLUG[s]?.title ?? GUIDES.find((g) => g.slug === s)?.title ?? s
  const prev = i > 0 ? READING_ORDER[i - 1] : null
  const next =
    i >= 0 && i < READING_ORDER.length - 1 ? READING_ORDER[i + 1] : null

  return (
    <div className="mt-16 grid gap-3 border-t pt-6 sm:grid-cols-2">
      {prev ? (
        <nav.Link href={nav.href(prev)} className={cardLink}>
          <span className="flex items-center gap-1.5 eyebrow text-muted-foreground">
            <ArrowLeft className="size-3" /> Previous
          </span>
          <span className="font-medium">{title(prev)}</span>
        </nav.Link>
      ) : (
        <span />
      )}
      {next ? (
        <nav.Link
          href={nav.href(next)}
          className={cn(cardLink, "sm:text-right")}
        >
          <span className="flex items-center gap-1.5 eyebrow text-muted-foreground sm:justify-end">
            Next <ArrowRight className="size-3" />
          </span>
          <span className="font-medium">{title(next)}</span>
        </nav.Link>
      ) : null}
    </div>
  )
}

const cardLink =
  "grid gap-2 border bg-card p-4 transition-colors hover:border-foreground/25 hover:bg-accent"

type ItemState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: RegistryItem }

/** Loads a registry item (files with their source) from the published registry. */
function useRegistryItem(base: string, name: string): ItemState {
  const [state, setState] = React.useState<{ name: string; value: ItemState }>({
    name,
    value: { status: "loading" },
  })

  React.useEffect(() => {
    let cancelled = false
    fetch(`${base}${name}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: RegistryItem) => {
        if (!cancelled) setState({ name, value: { status: "ready", data } })
      })
      .catch(() => {
        if (!cancelled) setState({ name, value: { status: "error" } })
      })
    return () => {
      cancelled = true
    }
  }, [base, name])

  return state.name === name ? state.value : { status: "loading" }
}
