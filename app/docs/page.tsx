import { DocsIndex } from "@/components/docs/docs-index"
import { DocsShell } from "@/components/docs/docs-shell"

export default function DocsIndexPage() {
  return (
    <DocsShell current="">
      <DocsIndex />
    </DocsShell>
  )
}
