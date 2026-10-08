import { createRoot } from "react-dom/client"
import { Providers } from "@/components/site/providers"
import { Showcase } from "@/components/site/showcase"

createRoot(document.getElementById("root")!).render(
  <Providers>
    <Showcase />
  </Providers>
)
