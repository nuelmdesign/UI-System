// Collects the source of every docs example into one JSON map so the docs can
// show exactly the code that renders each preview. Run before `next build`.

import { readdirSync, readFileSync, writeFileSync } from "node:fs"

const dir = new URL("../components/docs/examples/", import.meta.url)
const sources = {}
for (const file of readdirSync(dir).sort()) {
  if (!file.endsWith(".tsx")) continue
  sources[file.replace(/\.tsx$/, "")] = readFileSync(new URL(file, dir), "utf8").trimEnd()
}
writeFileSync(
  new URL("../components/docs/example-sources.json", import.meta.url),
  JSON.stringify(sources, null, 2) + "\n"
)
console.log(`example-sources.json: ${Object.keys(sources).length} examples`)
