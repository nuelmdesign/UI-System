"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  DocsNavProvider,
  type DocsLinkProps,
  type DocsNav,
} from "@/components/docs/docs-nav"

function NextLink({ href, children, ...props }: DocsLinkProps) {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

/** Wires the docs to Next.js routing: /docs, /docs/[slug], client navigation. */
export function DocsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const nav = React.useMemo<DocsNav>(
    () => ({
      href: (to) => (to === "home" ? "/" : to ? `/docs/${to}` : "/docs"),
      Link: NextLink,
      navigate: (href) => router.push(href),
      registryBase: "/r/",
    }),
    [router]
  )
  return <DocsNavProvider value={nav}>{children}</DocsNavProvider>
}
