import { createRoot } from "react-dom/client"
import { Providers } from "@/components/site/providers"
import { HashApp } from "@/components/docs/hash-app"
import exampleSources from "@/components/docs/example-sources.json"

createRoot(document.getElementById("root")!).render(
  <Providers>
    <HashApp sources={exampleSources as Record<string, string>} />
  </Providers>
)
