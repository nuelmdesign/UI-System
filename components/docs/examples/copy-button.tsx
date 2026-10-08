import { CopyButton } from "@/components/motion/copy-button"

const COMMAND = "npx shadcn add @nuelm/button"

export default function CopyButtonDemo() {
  return (
    <div className="flex h-10 items-center gap-2 border bg-surface pr-1 pl-3 font-mono text-sm">
      <span className="text-brand">$</span> {COMMAND}
      <CopyButton value={COMMAND} />
    </div>
  )
}
