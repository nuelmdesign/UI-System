import type { Metadata } from "next"

import { DocsProvider } from "./docs-provider"

export const metadata: Metadata = {
  title: "Components · nuelm/ui",
  description: "Every nuelm/ui component with a live preview, example code, install command and source.",
}

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return <DocsProvider>{children}</DocsProvider>
}
