"use client"

import * as React from "react"

import { ComponentPage } from "@/components/docs/component-page"
import { DocsIndex } from "@/components/docs/docs-index"
import { DocsNavProvider, hashNav } from "@/components/docs/docs-nav"
import { DocsShell } from "@/components/docs/docs-shell"
import { ENTRY_BY_SLUG, GUIDES } from "@/components/docs/entries"
import { GuidePage } from "@/components/docs/guides"
import { Showcase } from "@/components/site/showcase"

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

/**
 * Single-page app for hosts that serve one HTML file (the live preview):
 * "#docs" is the components index, "#docs.<slug>" a docs page, and any
 * other hash is the landing page (scrolled to that section if it exists).
 */
export function HashApp({ sources }: { sources: Record<string, string> }) {
  const hash = React.useSyncExternalStore(
    subscribe,
    () => window.location.hash.replace(/^#/, ""),
    () => ""
  )
  const isDocs = hash === "docs" || hash.startsWith("docs.")
  const slug = hash.startsWith("docs.") ? hash.slice(5) : ""

  React.useEffect(() => {
    const section = !isDocs && hash ? document.getElementById(hash) : null
    if (section) section.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash, isDocs])

  let page: React.ReactNode
  if (!isDocs) {
    page = <Showcase />
  } else if (!slug) {
    page = (
      <DocsShell current="">
        <DocsIndex />
      </DocsShell>
    )
  } else if (ENTRY_BY_SLUG[slug]) {
    page = (
      <DocsShell current={slug}>
        <ComponentPage
          key={slug}
          entry={ENTRY_BY_SLUG[slug]}
          exampleCode={sources[slug] ?? ""}
        />
      </DocsShell>
    )
  } else if (GUIDES.some((g) => g.slug === slug)) {
    page = (
      <DocsShell current={slug}>
        <GuidePage slug={slug} />
      </DocsShell>
    )
  } else {
    page = (
      <DocsShell current="">
        <DocsIndex />
      </DocsShell>
    )
  }

  return <DocsNavProvider value={hashNav}>{page}</DocsNavProvider>
}
