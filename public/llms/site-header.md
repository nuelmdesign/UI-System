# Site Header

Sticky top bar with a brand slot, nav links, an actions slot and a mobile menu.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/site-header
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { SiteHeader } from "@/components/ui/site-header"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`

## Props and types

```ts
type SiteHeaderLink = {
  label: string
  href: string
  active?: boolean
}

type RenderLinkProps = {
  href: string
  className?: string
  children: React.ReactNode
  onClick?: () => void
  "aria-current"?: "page"
}

type SiteHeaderProps = Omit<React.ComponentProps<"header">, "children"> & {
  /** Logo / wordmark, usually wrapped in a link. */
  brand: React.ReactNode
  nav?: SiteHeaderLink[]
  /** Inject a router link (e.g. Next's `Link`). Defaults to a plain `<a>`. */
  renderLink?: (props: RenderLinkProps) => React.ReactNode
  /** Right-hand slot: theme toggle, buttons, avatar. */
  actions?: React.ReactNode
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/ui/site-header"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const links = ["Product", "Pricing", "Docs", "Changelog"]

export default function SiteHeaderDemo() {
  const [active, setActive] = React.useState("Product")

  return (
    <div className="w-full max-w-[640px] overflow-hidden border">
      <SiteHeader
        className="static"
        brand={
          <a href="#" className="font-display text-lg">
            Acme
          </a>
        }
        nav={links.map((label) => ({
          label,
          href: `#${label.toLowerCase()}`,
          active: label === active,
        }))}
        renderLink={({ children, onClick, ...props }) => (
          <a
            {...props}
            onClick={(e) => {
              e.preventDefault()
              setActive(String(children))
              onClick?.()
            }}
          >
            {children}
          </a>
        )}
        actions={
          <>
            <ThemeToggle />
            <Button size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
          </>
        }
      />
      <div className="h-32 bg-dots" />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/site-header. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
