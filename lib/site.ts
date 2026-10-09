/** Public facts about the site, shared by the landing page, docs and llms.txt. */
export const SITE = {
  name: "opendraft",
  version: "0.2",
  /** Where the site is deployed. The registry and llms.txt live here too. */
  url: "https://opendraft-ui.vercel.app",
  github: "https://github.com/nuelmdesign/UI-System",
} as const

/** The one link people paste into an AI assistant. */
export const LLMS_URL = `${SITE.url}/llms.txt`

/** A ready-to-paste prompt that points an assistant at opendraft. */
export function aiPrompt(task = "[describe what you want to build]") {
  return `Use the opendraft design system for this. Read ${LLMS_URL} first and follow its rules: install components from the @opendraft registry and style only with its tokens.\n\nBuild: ${task}`
}

/** Opens a new Claude chat with the prompt filled in. */
export function claudeUrl(prompt: string) {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
}
