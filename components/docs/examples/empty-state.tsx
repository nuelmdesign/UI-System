import { Inbox, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function EmptyStateDemo() {
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-6">
      <EmptyState
        bordered
        icon={<Inbox />}
        title="No items yet"
        description="Items you create will show up here. Start by adding your first one."
        action={
          <Button size="sm">
            <Plus /> New item
          </Button>
        }
        secondaryAction={
          <Button size="sm" variant="outline">
            Import
          </Button>
        }
      />
      <div className="rounded-lg border">
        <EmptyState
          live
          size="sm"
          icon={<Search />}
          title="No results"
          description="Try a different search term or clear your filters."
          action={
            <Button size="sm" variant="outline">
              Clear filters
            </Button>
          }
        />
      </div>
    </div>
  )
}
