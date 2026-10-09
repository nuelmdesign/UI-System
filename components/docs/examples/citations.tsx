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
