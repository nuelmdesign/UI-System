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

/**
 * A prompt that carries the rules itself, for assistants that can't open links
 * or run commands. They write the code; the person installs the components.
 */
export function aiPromptInline(
  rules: string,
  task = "[describe what you want to build]",
  theme = ""
) {
  return `Use the opendraft design system for this. You can't open links or run commands here, so the rules and component index are below. Follow them: use only components from the index, style only with its tokens, and import from the paths the rules give (for example @/components/ui/button).

When you finish, list every opendraft component you used with its install command, like \`npx shadcn@latest add @opendraft/button\`, so I can install them. Only use props you're sure exist; if unsure, ask me to paste that component's page from ${SITE.files}/llms/<name>.md.${theme ? `\n\n${theme}` : ""}

Build: ${task}

--- opendraft rules and components ---

${rules}`
}
