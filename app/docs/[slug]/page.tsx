import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComponentPage } from "@/components/docs/component-page"
import { DocsShell } from "@/components/docs/docs-shell"
import { ENTRIES, ENTRY_BY_SLUG, GUIDES } from "@/components/docs/entries"
import { GuidePage } from "@/components/docs/guides"
import exampleSources from "@/components/docs/example-sources.json"

const SOURCES = exampleSources as Record<string, string>

export function generateStaticParams() {
  return [...GUIDES, ...ENTRIES].map(({ slug }) => ({ slug }))
}

export async function generateMetadata(props: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const page = ENTRY_BY_SLUG[slug] ?? GUIDES.find((g) => g.slug === slug)
  return page ? { title: `${page.title} · nuelm/ui`, description: page.description } : {}
}

export default async function DocPage(props: PageProps<"/docs/[slug]">) {
  const { slug } = await props.params
  const entry = ENTRY_BY_SLUG[slug]
  const guide = GUIDES.some((g) => g.slug === slug)
  if (!entry && !guide) notFound()

  return (
    <DocsShell current={slug}>
      {entry ? (
        // Only this page's example source is sent to the browser.
        <ComponentPage entry={entry} exampleCode={SOURCES[slug] ?? ""} />
      ) : (
        <GuidePage slug={slug} />
      )}
    </DocsShell>
  )
}
