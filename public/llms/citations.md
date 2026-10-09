# Citations

Inline citation markers, favicon stacks and a collapsible source list.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/citations
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Citation, CitationFavicon, CitationStack, CitationList, Citations } from "@/components/agents/citations"
```

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/agent-disclosure`, `@opendraft/use-favicon`

## Props and types

```ts
export interface CitationItem {
  id: string
  title: ReactNode
  domain?: ReactNode
  url?: string
}

export interface CitationsProps {
  citations: CitationItem[]
  title?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  idPrefix?: string
  className?: string
}

export interface CitationProps {
  citationId: string
  index: number
  /** Must match the related Citations idPrefix. */
  idPrefix: string
  className?: string
}

export interface CitationListProps {
  citations: CitationItem[]
  idPrefix?: string
  className?: string
}

export interface CitationStackProps {
  citations: CitationItem[]
  limit?: number
  className?: string
}

function CitationFavicon(props: {
  url?: string
  className?: string
})
```

## Example

```tsx
import {
  Citation,
  Citations,
  type CitationItem,
} from "@/components/agents/citations"

const SOURCES: CitationItem[] = [
  {
    id: "motion",
    title: "Motion for React",
    domain: "motion.dev",
    url: "https://motion.dev/docs/react",
  },
  {
    id: "radix",
    title: "Radix Primitives",
    domain: "radix-ui.com",
    url: "https://www.radix-ui.com/primitives",
  },
  {
    id: "tailwind",
    title: "Tailwind CSS v4",
    domain: "tailwindcss.com",
    url: "https://tailwindcss.com/docs",
  },
]

export default function CitationsDemo() {
  return (
    <div className="grid w-full max-w-xl gap-4 text-sm leading-6">
      <p>
        Springs come from Motion
        <Citation citationId="motion" index={1} idPrefix="demo" />, behavior
        from Radix
        <Citation citationId="radix" index={2} idPrefix="demo" /> and styling
        from Tailwind
        <Citation citationId="tailwind" index={3} idPrefix="demo" />.
      </p>
      <Citations citations={SOURCES} idPrefix="demo" defaultOpen />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/citations. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
