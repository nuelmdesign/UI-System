"use client"

import * as React from "react"

export type DocsLinkProps = {
  href: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
  "aria-current"?: "page"
}

export type DocsNav = {
  /** "" = docs index, "home" = landing page, anything else = a docs page slug. */
  href: (to: string) => string
  Link: React.ComponentType<DocsLinkProps>
  navigate: (href: string) => void
  /** Where the registry JSON lives, e.g. "/r/". */
  registryBase: string
}

function PlainLink({ href, children, ...props }: DocsLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}

/** Hash routing for hosts that serve the site from one page (the live preview). */
export const hashNav: DocsNav = {
  href: (to) => (to === "home" ? "#" : to ? `#docs.${to}` : "#docs"),
  Link: PlainLink,
  navigate: (href) => {
    window.location.hash = href.replace(/^#/, "")
  },
  registryBase: "r/",
}

const DocsNavContext = React.createContext<DocsNav>({
  href: (to) => (to === "home" ? "/" : to ? `/docs/${to}` : "/docs"),
  Link: PlainLink,
  navigate: (href) => {
    window.location.href = href
  },
  registryBase: "/r/",
})

export const DocsNavProvider = DocsNavContext.Provider

export function useDocsNav() {
  return React.useContext(DocsNavContext)
}
