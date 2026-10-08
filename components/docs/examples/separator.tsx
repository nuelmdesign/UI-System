import { Separator } from "@/components/ui/separator"

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <p className="font-display text-xl font-light">nuelm/ui</p>
      <p className="text-sm text-muted-foreground">
        A design system for agent interfaces.
      </p>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Components</span>
        <Separator orientation="vertical" />
        <span>Registry</span>
      </div>
    </div>
  )
}
