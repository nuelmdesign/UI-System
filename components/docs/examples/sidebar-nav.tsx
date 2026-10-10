import { SAMPLE_RECENTS, SidebarNav } from "@/components/agents/sidebar-nav"

export default function SidebarNavDemo() {
  return (
    <div className="flex h-[600px] overflow-hidden rounded-lg border bg-background">
      <SidebarNav fill recents={SAMPLE_RECENTS} />
      <div className="flex-1 bg-dots" />
    </div>
  )
}
