// Loads content/ai/use-cases.json and derives each domain's starter kit from
// the playbook itself, so a kit can never disagree with the playbook it
// belongs to: the foundation pieces plus every component the playbook names.

import { readFileSync } from "node:fs"

/** Installed by every kit: the pieces nearly every product screen needs. */
export const FOUNDATION = [
  "button",
  "card",
  "input",
  "label",
  "select",
  "dialog",
  "badge",
  "tabs",
  "field",
  "page-header",
  "theme-toggle",
  "sonner",
]

export function loadUseCases(root) {
  const data = JSON.parse(
    readFileSync(new URL("content/ai/use-cases.json", root), "utf8")
  )
  for (const d of data.domains) {
    d.kit = [
      ...new Set([
        ...FOUNDATION,
        ...d.needs.flatMap((n) => n.use),
        ...d.screens.flatMap((x) => x.compose),
      ]),
    ]
  }
  return data
}
