// Generates the AI-readable docs into public/:
//   llms.txt        rules (content/ai/guidelines.md) + an index of every component
//   llms/<slug>.md  one page per component: install, import, props, example
//   llms-full.txt   rules + every component page in one file
// Reads the docs entries, the built registry (public/r) and the example
// sources, so run it after `pnpm registry:build` and `pnpm docs:build`.
// Output is deterministic: no dates, stable ordering.

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"

import { loadUseCases } from "./use-cases.mjs"

/** Components that render ice-cream-shop demo content until given real data. */
const SAMPLE_CONTENT = new Set([
  "agent-screen",
  "chat-panel",
  "code-panel",
  "context-cards",
  "diff-table",
  "filter-table",
  "fine-tune-card",
  "flowchart",
  "insight-cards",
  "prompt-bar",
  "question-card",
  "records-table",
  "search-list",
  "sidebar-nav",
  "streaming-answer",
  "thinking-trace",
  "tool-chips",
])

/** Description plus a warning when the component ships demo content. */
const describe = (entry) =>
  SAMPLE_CONTENT.has(entry.slug)
    ? `${entry.description} Shows sample content (an ice cream shop) until you pass your own data through its props.`
    : entry.description

const root = new URL("../", import.meta.url)
const read = (path) => readFileSync(new URL(path, root), "utf8")

/* ---------------------------------- Inputs --------------------------------- */

const siteSrc = read("lib/site.ts")
const SITE_URL = siteSrc.match(/\burl:\s*"([^"]+)"/)?.[1]
if (!SITE_URL) throw new Error("Couldn't find SITE.url in lib/site.ts")
const FILES_URL = siteSrc.match(/\bfiles:\s*"([^"]+)"/)?.[1]
if (!FILES_URL) throw new Error("Couldn't find SITE.files in lib/site.ts")

const guidelines = read("content/ai/guidelines.md").trim()
const examples = JSON.parse(read("components/docs/example-sources.json"))
const entriesSrc = read("components/docs/entries.ts")

/** The text of `export const NAME ... = [ ... ]` / `{ ... }` in entries.ts. */
function constBlock(name) {
  const start = entriesSrc.search(new RegExp(`export const ${name}\\b`))
  if (start === -1) throw new Error(`Missing ${name} in entries.ts`)
  const open = entriesSrc.slice(start).search(/=\s*[[{]/) + start
  const first = entriesSrc.slice(open).search(/[[{]/) + open
  const close = { "[": "]", "{": "}" }[entriesSrc[first]]
  let depth = 0
  for (let i = first; i < entriesSrc.length; i++) {
    if (entriesSrc[i] === entriesSrc[first]) depth++
    if (entriesSrc[i] === close && --depth === 0)
      return entriesSrc.slice(first + 1, i)
  }
  throw new Error(`Unclosed ${name} in entries.ts`)
}

/** Object literals of string / boolean fields, in source order. */
function objects(body) {
  return [...body.matchAll(/\{([^{}]*)\}/g)].map(([, fields]) => {
    const obj = {}
    for (const [, key, value] of fields.matchAll(
      /(\w+):\s*("(?:[^"\\]|\\.)*"|true|false)/g
    ))
      obj[key] = JSON.parse(value)
    return obj
  })
}

const GUIDES = objects(constBlock("GUIDES"))
const ENTRIES = objects(constBlock("ENTRIES"))
const CATEGORY_LABEL = Object.fromEntries(
  [
    ...constBlock("CATEGORY_LABEL").matchAll(/(\w+):\s*("(?:[^"\\]|\\.)*")/g),
  ].map(([, k, v]) => [k, JSON.parse(v)])
)
const CATEGORY_ORDER = [
  ...constBlock("CATEGORY_ORDER").matchAll(/"(\w+)"/g),
].map((m) => m[1])

/* ------------------------------ Source parsing ----------------------------- */

const isPascal = (name) => /^[A-Z][A-Za-z0-9]*$/.test(name)

/** Splits `{ A, type B, C as D }` into [{ name, isType }]. */
function specifiers(list) {
  return list
    .split(",")
    .map((s) => s.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, "").trim())
    .filter(Boolean)
    .map((s) => {
      const isType = s.startsWith("type ")
      const parts = s.replace(/^type\s+/, "").split(/\s+as\s+/)
      return { name: parts[parts.length - 1].trim(), isType }
    })
}

/** Public names of a module: values (components) and types. */
function exportsOf(src) {
  const values = new Set()
  const types = new Set()
  for (const [, name] of src.matchAll(
    /^export\s+(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/gm
  ))
    values.add(name)
  for (const [, name] of src.matchAll(
    /^export\s+(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm
  ))
    values.add(name)
  for (const [, typeOnly, list] of src.matchAll(
    /^export\s+(type\s+)?\{([^}]*)\}/gm
  ))
    for (const s of specifiers(list))
      (typeOnly || s.isType ? types : values).add(s.name)
  for (const [, name] of src.matchAll(
    /^export\s+(?:declare\s+)?(?:type|interface|enum)\s+([A-Za-z_$][\w$]*)/gm
  ))
    types.add(name)
  return { values, types }
}

/**
 * Top-level `type` / `interface` declarations (exported or not), verbatim,
 * with the doc comment right above them. Returns [{ name, code }].
 */
function typeDeclarations(src) {
  const out = []
  const re = /^(?:export\s+)?(type|interface)\s+([A-Za-z_$][\w$]*)/gm
  let m
  while ((m = re.exec(src))) {
    const start = m.index
    const end = declarationEnd(src, start, m[1] === "interface")
    let from = start
    const doc = src.slice(0, start).match(/\/\*\*(?:(?!\*\/)[\s\S])*\*\/\s*$/)
    if (doc) from = start - doc[0].length
    out.push({ name: m[2], code: src.slice(from, end).trimEnd() })
    re.lastIndex = end
  }
  return out
}

/** Index of the bracket that closes the one at `open`, skipping strings. */
function matching(src, open) {
  const pairs = { "(": ")", "{": "}", "[": "]", "<": ">" }
  const stack = []
  for (let i = open; i < src.length; i++) {
    const c = src[i]
    if (c === '"' || c === "'" || c === "`") {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === "\\") i++
      continue
    }
    if (src.startsWith("=>", i)) {
      i++
      continue
    }
    if (c in pairs && (c !== "<" || stack.at(-1) === ">" || i === open)) {
      stack.push(pairs[c])
    } else if (c === stack.at(-1)) {
      stack.pop()
      if (!stack.length) return i
    }
  }
  return -1
}

/**
 * The props annotation of `function Name(...)`, e.g.
 * `React.ComponentProps<"div"> & { size?: number }`, or null.
 */
function propsAnnotation(src, name) {
  const m = new RegExp(`^(?:export\\s+)?function\\s+${name}\\b`, "m").exec(src)
  if (!m) return null
  let i = m.index + m[0].length
  if (src[i] === "<") i = matching(src, i) + 1
  if (src[i] !== "(") return null
  const close = matching(src, i)
  const params = src.slice(i + 1, close)
  // Skip the destructuring pattern / parameter name, then read the type.
  let j = 0
  while (j < params.length && /\s/.test(params[j])) j++
  if (params[j] === "{" || params[j] === "[") j = matching(params, j) + 1
  else while (j < params.length && /[\w$]/.test(params[j])) j++
  const rest = params.slice(j).trim()
  if (!rest.startsWith(":")) return null
  return rest.slice(1).trim().replace(/,\s*$/, "")
}

/** `variant: default | ink | …` lines from a cva() call's variants block. */
function cvaVariants(src) {
  const out = []
  for (const m of src.matchAll(/^(?:export\s+)?const\s+(\w+)\s*=\s*cva\(/gm)) {
    const call = src.slice(m.index, matching(src, m.index + m[0].length - 1))
    const v = call.search(/\bvariants:\s*\{/)
    if (v === -1) continue
    const open = call.indexOf("{", v)
    const body = call.slice(open + 1, matching(call, open))
    const defaults = {}
    const d = call.search(/\bdefaultVariants:\s*\{/)
    if (d !== -1) {
      const dOpen = call.indexOf("{", d)
      for (const [, k, val] of call
        .slice(dOpen + 1, matching(call, dOpen))
        .matchAll(/("?[\w-]+"?):\s*("[^"]*"|\w+)/g))
        defaults[k.replace(/"/g, "")] = val.replace(/"/g, "")
    }
    const groups = []
    let depth = 0
    let group = null
    for (const line of body
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")
      .split("\n")) {
      const key = line.match(/^\s*("[^"]+"|[\w-]+)\s*:/)?.[1]?.replace(/"/g, "")
      if (depth === 0 && key) {
        group = { name: key, options: [] }
        groups.push(group)
      } else if (depth === 1 && key && group) {
        group.options.push(key)
      }
      const stripped = line.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, "")
      depth += (stripped.match(/\{/g) ?? []).length
      depth -= (stripped.match(/\}/g) ?? []).length
    }
    for (const g of groups)
      out.push(
        `- \`${g.name}\`: ${g.options
          .map((o) => `\`${o}\`${defaults[g.name] === o ? " (default)" : ""}`)
          .join(", ")}`
      )
  }
  return out
}

/** Type names referenced in a piece of code. */
const referencedNames = (code) =>
  new Set([...code.matchAll(/\b([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1]))

/** Index just past a type declaration, skipping strings and comments. */
function declarationEnd(src, start, isInterface) {
  let depth = 0
  let seenBody = false
  for (let i = start; i < src.length; i++) {
    const c = src[i]
    const two = src.slice(i, i + 2)
    if (two === "//") {
      i = src.indexOf("\n", i) - 1
      if (i < 0) return src.length
      continue
    }
    if (two === "/*") {
      i = src.indexOf("*/", i + 2) + 1
      continue
    }
    if (c === '"' || c === "'" || c === "`") {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === "\\") i++
      continue
    }
    if (c === "{" || c === "(" || c === "[" || c === "<") {
      depth++
      seenBody = true
      continue
    }
    if (c === ">" && src[i - 1] === "=") continue
    if (c === "}" || c === ")" || c === "]" || c === ">") {
      depth--
      if (isInterface && depth === 0 && c === "}") return i + 1
      continue
    }
    if (depth > 0) continue
    if (c === ";") return i + 1
    if (c === "\n" && !isInterface) {
      // A type alias ends at a line break unless the next line continues it.
      const rest = src.slice(i + 1)
      const next = rest.match(/^[^\n]*/)[0]
      const head = src.slice(start, i)
      const continues =
        /^\s/.test(next) ||
        /^[|&]/.test(next) ||
        /[=|&,<(:]\s*$/.test(head) ||
        (!seenBody && !/=/.test(head))
      if (!continues) return i
    }
  }
  return src.length
}

/* ---------------------------------- Pages ---------------------------------- */

const pageUrl = (slug) => `${FILES_URL}/llms/${slug}.md`
const docsUrl = (slug) => `${SITE_URL}/docs/${slug}`
const installCmd = (name) => `npx shadcn@latest add @opendraft/${name}`

function registryItem(name) {
  return JSON.parse(read(`public/r/${name}.json`))
}

/** "components/agents/prompt-bar.tsx" -> "@/components/agents/prompt-bar" */
const modulePath = (file) =>
  `@/${(file.target || file.path).replace(/\.(tsx?|jsx?)$/, "").replace(/\/index$/, "")}`

/** Resolves `./x` relative to a file's path, matching an item file. */
function resolveRelative(files, fromFile, spec) {
  const dir = fromFile.path.split("/").slice(0, -1)
  for (const part of spec.split("/")) {
    if (part === "..") dir.pop()
    else if (part !== ".") dir.push(part)
  }
  const base = dir.join("/")
  return files.find((f) =>
    [".ts", ".tsx", "/index.ts", "/index.tsx"].some(
      (ext) => f.path === base + ext
    )
  )
}

function componentPage(entry) {
  const name = entry.registry ?? entry.slug
  const item = registryItem(name)
  const files = item.files ?? []
  const primary = files[0]
  const src = primary?.content ?? ""
  const { values, types } = exportsOf(src)

  // Types the primary module re-exports from sibling files count as public.
  const typeSources = [src]
  for (const [, spec] of src.matchAll(
    /^export\s+(?:type\s+)?\{[^}]*\}\s*from\s*"(\.[^"]+)"/gm
  )) {
    const file = resolveRelative(files, primary, spec)
    if (file?.content && !typeSources.includes(file.content))
      typeSources.push(file.content)
  }
  for (const [, spec] of src.matchAll(/^export\s+\*\s+from\s*"(\.[^"]+)"/gm)) {
    const file = resolveRelative(files, primary, spec)
    if (!file?.content) continue
    const sub = exportsOf(file.content)
    sub.values.forEach((v) => values.add(v))
    sub.types.forEach((t) => types.add(t))
    typeSources.push(file.content)
  }

  const components = [...values].filter(isPascal)

  // Props: each component's annotation, plus the declarations it relies on.
  // Public types, local *Props types and anything they reference are shown.
  const allDecls = typeSources.flatMap(typeDeclarations)
  const signatures = []
  const wanted = new Set([...types].filter((t) => !values.has(t)))
  for (const name of components) {
    const annotation = propsAnnotation(src, name)
    if (!annotation) continue
    referencedNames(annotation).forEach((n) => wanted.add(n))
    if (!/^[A-Z]\w*$/.test(annotation))
      signatures.push(`function ${name}(props: ${annotation})`)
  }
  const byName = new Map()
  for (const d of allDecls) if (!byName.has(d.name)) byName.set(d.name, d)
  for (let grew = true; grew;) {
    grew = false
    for (const name of [...wanted]) {
      const d = byName.get(name)
      if (!d) continue
      for (const n of referencedNames(
        d.code.replace(/^[\s\S]*?(?:type|interface)\s+\w+/, "")
      ))
        if (byName.has(n) && !wanted.has(n)) {
          wanted.add(n)
          grew = true
        }
    }
  }
  const declarations = allDecls.filter(
    (d, i) =>
      wanted.has(d.name) && allDecls.findIndex((x) => x.name === d.name) === i
  )
  const variants = cvaVariants(src)

  const npm = item.dependencies ?? []
  const registryDeps = item.registryDependencies ?? []
  const example = examples[entry.slug]

  const lines = [
    `# ${entry.title}`,
    "",
    describe(entry),
    "",
    `Category: ${CATEGORY_LABEL[entry.category]}`,
    "",
    "## Install",
    "",
    "```bash",
    installCmd(name),
    "```",
    "",
    "Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See " +
      `${FILES_URL}/llms.txt.`,
    "",
  ]

  if (primary) {
    lines.push("## Import", "", "```tsx")
    lines.push(
      components.length
        ? `import { ${components.join(", ")} } from "${modulePath(primary)}"`
        : `import "${modulePath(primary)}"`
    )
    lines.push("```", "")
    if (files.length > 1) {
      lines.push(
        "Files added to the project:",
        "",
        ...files.map((f) => `- \`${f.target || f.path}\``),
        ""
      )
    }
  }

  lines.push("## Dependencies", "")
  if (!npm.length && !registryDeps.length) {
    lines.push("None beyond React and Tailwind.", "")
  } else {
    if (npm.length)
      lines.push(`- npm: ${npm.map((d) => `\`${d}\``).join(", ")}`)
    if (registryDeps.length)
      lines.push(
        `- Registry (installed with it): ${registryDeps.map((d) => `\`${d}\``).join(", ")}`
      )
    lines.push("")
  }

  if (declarations.length || signatures.length) {
    lines.push(
      "## Props and types",
      "",
      "```ts",
      [...declarations.map((d) => d.code), ...signatures].join("\n\n"),
      "```",
      ""
    )
  }

  if (variants.length) {
    lines.push("## Variants", "", ...variants, "")
  }

  if (example) {
    lines.push("## Example", "", "```tsx", example, "```", "")
  }

  lines.push(
    `Live docs: ${docsUrl(entry.slug)}. Rules for building with opendraft: ${FILES_URL}/llms.txt`
  )
  return lines.join("\n") + "\n"
}

/* -------------------------------- Use cases -------------------------------- */

const useCases = loadUseCases(root)
const slugTitle = Object.fromEntries(ENTRIES.map((e) => [e.slug, e.title]))
const FIT = { ready: "Ready", adapt: "Adapt", gap: "Gap" }

// A playbook may only name components that exist, so it can't go stale.
for (const d of useCases.domains) {
  const named = [
    ...d.kit,
    ...d.needs.flatMap((n) => n.use),
    ...d.screens.flatMap((x) => x.compose),
  ]
  const missing = [...new Set(named.filter((n) => !slugTitle[n]))]
  if (missing.length)
    throw new Error(
      `use-cases.json: "${d.id}" names components that don't exist: ${missing.join(", ")}`
    )
  for (const n of d.needs) {
    if (!FIT[n.status])
      throw new Error(`use-cases.json: bad status "${n.status}" in "${d.id}"`)
    if (n.status !== "ready" && !n.gap)
      throw new Error(
        `use-cases.json: "${n.need}" in "${d.id}" needs a "gap" note`
      )
  }
}

const useCaseUrl = (id) => `${FILES_URL}/llms/use-cases/${id}.md`
const link = (slug) => `[${slugTitle[slug]}](${pageUrl(slug)})`

function useCasePage(d) {
  const gaps = d.needs.filter((n) => n.gap)
  const lines = [
    `# Building ${d.title} products with opendraft`,
    "",
    `> ${d.summary}`,
    "",
    "Read this before building for this domain. Follow the rules in " +
      `${FILES_URL}/llms.txt as well. Names below link to each component's page (props, types, example).`,
    "",
    "## Use this playbook when the product involves",
    "",
    d.signals.join(", ") + ".",
    "",
    "## Principles for this domain",
    "",
    ...d.principles.map((p) => `- ${p}`),
    "",
    "## What the product needs, and what to use",
    "",
    "Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.",
    "",
  ]
  for (const n of d.needs) {
    lines.push(`### ${n.need}`, "")
    lines.push(`- Fit: **${FIT[n.status]}**`)
    lines.push(`- Use: ${n.use.map(link).join(", ")}`)
    if (n.notes) lines.push(`- How: ${n.notes}`)
    if (n.gap) lines.push(`- Missing: ${n.gap}`)
    lines.push("")
  }
  if (d.integrations?.length) {
    lines.push("## Libraries and services that pair well", "")
    for (const i of d.integrations)
      lines.push(`- ${i.for}: ${i.options.join(", ")}. ${i.note}`)
    lines.push("")
  }
  lines.push("## Typical screens", "")
  for (const x of d.screens)
    lines.push(`- **${x.name}**: ${x.compose.map(link).join(" + ")}`)
  lines.push(
    "",
    "## Install the starter kit",
    "",
    "One command installs the theme and the components this playbook uses:",
    "",
    "```bash",
    installCmd(`kit-${d.id}`),
    "```",
    ""
  )
  if (gaps.length) {
    lines.push("## Known gaps", "")
    for (const n of gaps) lines.push(`- ${n.need}: ${n.gap}`)
    lines.push("")
  }
  lines.push(`Docs: ${SITE_URL}/docs/use-cases`)
  return lines.join("\n") + "\n"
}

const useCasePages = useCases.domains.map((d) => [d.id, useCasePage(d)])

const useCaseIndex = [
  "### Pick by what the product does",
  "",
  "If the product is for a specific industry or job, read its playbook before choosing components. A playbook lists the domain's usual needs, the opendraft components that serve each (with a fit rating), the screens to assemble, and one install command for a starter kit. Match the request against each playbook's signals; if none matches, pick by need from the component list below.",
  "",
  ...useCases.domains.map(
    (d) =>
      `- [${d.title}](${useCaseUrl(d.id)}): ${d.summary} Signals: ${d.signals.slice(0, 8).join(", ")}. Kit: \`${installCmd(`kit-${d.id}`)}\``
  ),
  "",
  `Machine-readable index: ${FILES_URL}/use-cases.json`,
].join("\n")

const useCaseJson = {
  version: useCases.version,
  intro: useCases.intro,
  fit: {
    ready: "Use as is.",
    adapt: "Works with the caveat in `gap`.",
    gap: "Nothing fits yet; build from primitives and follow the principles.",
  },
  domains: useCases.domains.map((d) => ({
    id: d.id,
    title: d.title,
    short: d.short,
    summary: d.summary,
    signals: d.signals,
    principles: d.principles,
    playbook: useCaseUrl(d.id),
    kit: {
      name: `kit-${d.id}`,
      install: installCmd(`kit-${d.id}`),
      components: d.kit,
    },
    needs: d.needs.map((n) => ({
      need: n.need,
      fit: n.status,
      notes: n.notes ?? null,
      gap: n.gap ?? null,
      components: n.use.map((slug) => ({
        slug,
        title: slugTitle[slug],
        page: pageUrl(slug),
        install: installCmd(slug),
      })),
    })),
    screens: d.screens,
    integrations: d.integrations ?? [],
  })),
  integrations: useCases.integrations ?? [],
  crossDomainGaps: useCases.crossDomainGaps,
}

/* ------------------------- Tool adapters and theme.css ------------------------ */

// One rules source (content/ai/core-rules.md), published in the shapes each AI
// tool reads. Nothing here is specific to one assistant.
const core = read("content/ai/core-rules.md")
  .replaceAll("{{FILES}}", FILES_URL)
  .trim()

const adapterDefs = {
  "AGENTS.md": `# opendraft\n\nSave this as AGENTS.md in the project root. Cursor, Codex, Copilot, Windsurf and many other coding agents read it. Claude Code reads CLAUDE.md: add the line @AGENTS.md to it.\n\n${core}\n`,
  "opendraft.mdc": `---\ndescription: Build UI with the opendraft design system: components, theme tokens and industry playbooks\nglobs: "**/*.{ts,tsx,css}"\nalwaysApply: false\n---\n\nSave this as .cursor/rules/opendraft.mdc.\n\n${core}\n`,
  "copilot-instructions.md": `Save this as .github/copilot-instructions.md.\n\n${core}\n`,
  "lovable-knowledge.md": `Paste this into Lovable: Project Settings, Knowledge. Lovable builds React, Vite and Tailwind apps and can't run the shadcn command, so use the by-hand steps: the theme from theme.css and components from the registry JSON.\n\n${core}\n`,
  "chatgpt-gpt-instructions.md": `Paste this into a custom GPT's Instructions (or the first message of a chat). You can't run commands here: write the code, then end your answer with the list of install commands (npx shadcn@latest add @opendraft/<name>) for every opendraft component you used, so the person can run them in their project. If you can't open links, ask them to paste the rules from ${FILES_URL}/llms.txt or use the "Copy with rules included" button on the docs.\n\n${core}\n`,
  "chatgpt-custom-instructions.md": `Build UI with the opendraft design system (React + Tailwind v4, shadcn registry at ${FILES_URL}/r/{name}.json). Rules: ${FILES_URL}/llms.txt. Industry playbooks: ${FILES_URL}/use-cases.json. Use its components and blocks, pass real data (never leave sample content), style only with theme tokens (no hard-coded colors, no palette colors, no gradients), \`heading\` for headings, never show status by color alone. End with the \`npx shadcn@latest add @opendraft/<name>\` commands for what you used.\n`,
}
const LIMITS = {
  "chatgpt-custom-instructions.md": 1500,
  "chatgpt-gpt-instructions.md": 8000,
}
for (const [name, body] of Object.entries(adapterDefs)) {
  const limit = LIMITS[name]
  if (limit && body.length > limit)
    throw new Error(`${name} is ${body.length} chars, over its ${limit} limit`)
}

/** A self-contained global stylesheet for projects that can't run the shadcn CLI (Vite, Lovable). */
function themeStylesheet() {
  const t = JSON.parse(read("public/r/theme.json"))
  const decl = (o, ind = "  ") =>
    Object.entries(o)
      .map(([k, v]) => `${ind}--${k}: ${v};`)
      .join("\n")
  const rule = (sel, o, ind = "") => {
    const lines = Object.entries(o).map(([k, v]) =>
      typeof v === "string" ? `${ind}  ${k}: ${v};` : rule(k, v, ind + "  ")
    )
    return `${ind}${sel} {\n${lines.join("\n")}\n${ind}}`
  }
  let css = `/* opendraft theme for projects without the shadcn CLI. Save as your global stylesheet (for example src/index.css). */\n`
  css += `@import url("https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400..600&family=Newsreader:opsz,wght@6..72,300;6..72,400&display=swap");\n@import "tailwindcss";\n\n`
  css += `@custom-variant dark (&:is(.dark, .dark *));\n\n`
  css += `:root {\n  --font-geist: "Geist";\n  --font-geist-mono: "Geist Mono";\n  --font-newsreader: "Newsreader";\n${decl(t.cssVars.light)}\n}\n\n.dark {\n${decl(t.cssVars.dark)}\n}\n\n@theme inline {\n${decl(t.cssVars.theme)}\n}\n\n`
  for (const [k, v] of Object.entries(t.css)) css += rule(k, v) + "\n\n"
  return css
}

/* ---------------------------------- Output --------------------------------- */

const summary =
  "> opendraft is a React + Tailwind CSS v4 design system distributed as a shadcn registry and built to be used by AI assistants. Components install as source files into your project with the shadcn CLI, behavior comes from Radix, and every color, radius and timing comes from a small set of theme tokens. Building for a specific industry (security, logistics, healthcare, fintech and others)? Read the matching playbook in the Use cases section below before choosing components."

const header = `# opendraft\n\n${summary}\n\n${guidelines}\n`

const ordered = CATEGORY_ORDER.flatMap((category) =>
  ENTRIES.filter((e) => e.category === category)
)

const componentIndex = CATEGORY_ORDER.map((category) => {
  const rows = ENTRIES.filter((e) => e.category === category).map(
    (e) =>
      `- [${e.title}](${pageUrl(e.slug)}): ${describe(e)} Install: \`${installCmd(e.registry ?? e.slug)}\``
  )
  return `### ${CATEGORY_LABEL[category]}\n\n${rows.join("\n")}`
}).join("\n\n")

const docsIndex = GUIDES.map(
  (g) => `- [${g.title}](${docsUrl(g.slug)}): ${g.description}`
).join("\n")

const llms = [
  header,
  `## Use cases\n\n${useCaseIndex}\n`,
  `## Components\n\n${componentIndex}\n`,
  `## Docs\n\n${docsIndex}\n`,
  `## Optional\n\n- [llms-full.txt](${FILES_URL}/llms-full.txt): these rules plus every component page (props, types, examples) in one file\n- [Registry index](${FILES_URL}/r/registry.json): every installable registry item as JSON\n`,
].join("\n")

const pages = ordered.map((e) => [e.slug, componentPage(e)])

const outDir = new URL("public/llms/", root)
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
for (const [slug, body] of pages)
  writeFileSync(new URL(`${slug}.md`, outDir), body)

mkdirSync(new URL("use-cases/", outDir), { recursive: true })
for (const [id, body] of useCasePages)
  writeFileSync(new URL(`use-cases/${id}.md`, outDir), body)
writeFileSync(
  new URL("public/use-cases.json", root),
  JSON.stringify(useCaseJson, null, 2) + "\n"
)

const rulesDir = new URL("public/agent-rules/", root)
rmSync(rulesDir, { recursive: true, force: true })
mkdirSync(rulesDir, { recursive: true })
for (const [name, body] of Object.entries(adapterDefs))
  writeFileSync(new URL(name, rulesDir), body)
writeFileSync(new URL("public/theme.css", root), themeStylesheet())

writeFileSync(new URL("public/llms.txt", root), llms)
writeFileSync(
  new URL("public/llms-full.txt", root),
  [
    header,
    ...useCasePages.map(([, body]) => body),
    ...pages.map(([, body]) => body),
  ].join("\n---\n\n")
)

console.log(
  `llms.txt, llms-full.txt, llms/: ${pages.length} component pages, ${useCasePages.length} use-case playbooks`
)
