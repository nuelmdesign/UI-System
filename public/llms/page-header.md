# Page Header

Page title block with eyebrow, description, actions and breadcrumb slots, plus a container that gives every route the same width and gutters.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/page-header
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { PageHeader, PageContainer } from "@/components/ui/page-header"
```

## Dependencies

- npm: `class-variance-authority`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type PageContainerProps = React.ComponentProps<"div"> &
  VariantProps<typeof pageContainerVariants>

type PageHeaderProps = Omit<React.ComponentProps<"header">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Buttons or menus aligned to the right (stacked below on narrow screens). */
  actions?: React.ReactNode
  /** Breadcrumb or back link rendered above the eyebrow. */
  breadcrumb?: React.ReactNode
  /** Draw a hairline under the header. */
  bordered?: boolean
  /** Heading level for the title. Defaults to h1. */
  as?: "h1" | "h2" | "h3"
}
```

## Variants

- `size`: `sm`, `default` (default), `lg`, `full`

## Example

```tsx
"use client"

import * as React from "react"
import { ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/ui/page-header"

function Crumbs() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-muted-foreground">
        <li>
          <a href="#" className="hover:text-foreground">
            Workspace
          </a>
        </li>
        <ChevronRight aria-hidden className="size-3.5" />
        <li aria-current="page" className="text-foreground">
          Projects
        </li>
      </ol>
    </nav>
  )
}

export default function PageHeaderDemo() {
  return (
    <div className="w-full max-w-[640px] overflow-hidden rounded-lg border bg-background">
      <PageContainer size="full">
        <PageHeader
          bordered
          breadcrumb={<Crumbs />}
          eyebrow="Overview"
          title="Projects"
          description="Everything your team is building, in one place."
          actions={
            <>
              <Button variant="outline">Export</Button>
              <Button>
                <Plus /> New project
              </Button>
            </>
          }
        />
        <PageHeader
          as="h2"
          eyebrow="Settings"
          title="Notifications"
          description="Choose what you hear about and where."
        />
      </PageContainer>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/page-header. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
