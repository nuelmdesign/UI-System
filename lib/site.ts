/** Public facts about the site, shared by the landing page, docs and llms.txt. */
export const SITE = {
  name: "opendraft",
  version: "0.2",
  /** Where the docs site is deployed. */
  url: "https://ui-system-virid.vercel.app",
  /**
   * Where assistants and the shadcn CLI fetch files from: the public repo on
   * GitHub, so llms.txt and the registry work even before a custom domain.
   * HEAD is the repo's default branch.
   */
  files: "https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public",
  github: "https://github.com/nuelmdesign/UI-System",
} as const

/** The one link people paste into an AI assistant. */
export const LLMS_URL = `${SITE.files}/llms.txt`

/** The registry entry for components.json. */
export const REGISTRY_URL = `${SITE.files}/r/{name}.json`

/** A ready-to-paste prompt that points an assistant at opendraft. */
export function aiPrompt(
  task = "[describe what you want to build]",
  theme = ""
) {
  return `Use the opendraft design system for this. Read ${LLMS_URL} first and follow its rules: install components from the @opendraft registry and style only with its tokens. If you can't run shell commands, fetch each component's file from ${SITE.files}/r/<name>.json (each file's content is inside) and create them in the project yourself.${theme ? `\n\n${theme}` : ""}\n\nBuild: ${task}`
}

/** Opens a new Claude chat with the prompt filled in. */
export function claudeUrl(prompt: string) {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
}

/** Opens a new ChatGPT chat with the prompt filled in. */
export function chatgptUrl(prompt: string) {
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`
}
