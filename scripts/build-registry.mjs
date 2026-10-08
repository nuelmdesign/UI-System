// Generates registry.json from the component list below and the tokens in
// app/globals.css, so the theme has one source of truth. Run via
// `pnpm registry:build`, which then calls `shadcn build` to emit public/r/*.json.

import { readFileSync, writeFileSync } from "node:fs"

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")

function block(selector) {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`Missing ${selector} block in globals.css`)
  let depth = 0
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++
    if (css[i] === "}" && --depth === 0) return css.slice(css.indexOf("{", start) + 1, i)
  }
  throw new Error(`Unclosed ${selector} block`)
}

function vars(body) {
  const out = {}
  for (const decl of body.split(";")) {
    const m = decl.trim().match(/^--([\w-]+):\s*([\s\S]+)$/)
    if (m) out[m[1]] = m[2].replace(/\s+/g, " ").trim()
  }
  return out
}

function keyframes(body) {
  const out = {}
  const re = /@keyframes\s+([\w-]+)\s*\{/g
  let m
  while ((m = re.exec(body))) {
    let depth = 0
    const open = re.lastIndex - 1
    for (let i = open; i < body.length; i++) {
      if (body[i] === "{") depth++
      if (body[i] === "}" && --depth === 0) {
        out[`@keyframes ${m[1]}`] = parseRules(body.slice(open + 1, i))
        break
      }
    }
  }
  return out
}

function parseRules(body) {
  const out = {}
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m
  while ((m = re.exec(body))) {
    const decls = {}
    for (const d of m[2].split(";")) {
      const [k, ...v] = d.split(":")
      if (k.trim()) decls[k.trim()] = v.join(":").replace(/\s+/g, " ").trim()
    }
    out[m[1].trim()] = decls
  }
  return out
}

const motionTheme = block("@theme")
const themeVars = {
  ...vars(block("@theme inline")),
  ...vars(motionTheme.replace(/@keyframes[\s\S]*$/, "")),
}
// Fonts come from the consuming app.
delete themeVars["font-sans"]
delete themeVars["font-mono"]

const ui = (name, { deps = [], reg = [], description } = {}) => ({
  name,
  type: "registry:ui",
  title: name.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()),
  description,
  dependencies: deps,
  registryDependencies: ["@nuelm/utils", ...reg],
  files: [{ path: `components/ui/${name}.tsx`, type: "registry:ui" }],
})

const motionComponent = (name, { deps = [], reg = [], description } = {}) => ({
  name,
  type: "registry:component",
  title: name.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()),
  description,
  dependencies: ["motion", ...deps],
  registryDependencies: ["@nuelm/utils", "@nuelm/motion", ...reg],
  files: [
    {
      path: `components/motion/${name}.tsx`,
      type: "registry:component",
      target: `components/motion/${name}.tsx`,
    },
  ],
})

// AI agent components. Most are adapted from beUI (MIT); see THIRD_PARTY_NOTICES.md.
const agent = (name, { deps = [], reg = [], extra = [], description } = {}) => ({
  name,
  type: "registry:component",
  title: name.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()),
  description,
  dependencies: deps,
  registryDependencies: ["@nuelm/utils", ...reg],
  files: [`${name}.tsx`, ...extra].map((file) => ({
    path: `components/agents/${file}`,
    type: "registry:component",
    target: `components/agents/${file}`,
  })),
})

const hook = (name, { reg = [] } = {}) => ({
  name,
  type: "registry:hook",
  title: name,
  registryDependencies: reg,
  files: [{ path: `lib/hooks/${name}.ts`, type: "registry:hook", target: `lib/hooks/${name}.ts` }],
})

const lib = (name) => ({
  name,
  type: "registry:lib",
  title: name,
  files: [{ path: `lib/${name}.ts`, type: "registry:lib" }],
})

const items = [
  {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description: "nuelm/ui color, radius, elevation and motion tokens (light + dark).",
    cssVars: {
      theme: themeVars,
      light: vars(block(":root")),
      dark: vars(block(".dark")),
    },
    css: keyframes(motionTheme),
  },
  {
    name: "utils",
    type: "registry:lib",
    title: "Utils",
    dependencies: ["clsx", "tailwind-merge"],
    files: [{ path: "lib/utils.ts", type: "registry:lib" }],
  },
  {
    name: "motion",
    type: "registry:lib",
    title: "Motion tokens",
    description: "Springs, easings, durations and variants shared by every animated component.",
    dependencies: ["motion"],
    files: [{ path: "lib/motion.ts", type: "registry:lib" }],
  },

  hook("use-dismiss"),
  hook("use-tap-gesture"),
  hook("use-hover-gesture", { reg: ["@nuelm/touch"] }),
  hook("use-favicon", { reg: ["@nuelm/favicon"] }),
  lib("touch"),
  lib("favicon"),

  ui("button", { deps: ["radix-ui", "class-variance-authority"] }),
  ui("badge", { deps: ["radix-ui", "class-variance-authority"] }),
  ui("input"),
  ui("textarea"),
  ui("label", { deps: ["radix-ui"] }),
  ui("card"),
  ui("separator", { deps: ["radix-ui"] }),
  ui("kbd"),
  ui("skeleton"),
  ui("avatar", { deps: ["radix-ui"] }),
  ui("switch", { deps: ["radix-ui", "motion"], reg: ["@nuelm/motion"] }),
  ui("checkbox", { deps: ["radix-ui", "motion"], reg: ["@nuelm/motion"] }),
  ui("tabs", { deps: ["radix-ui", "motion"], reg: ["@nuelm/motion"] }),
  ui("accordion", { deps: ["radix-ui", "motion", "lucide-react"], reg: ["@nuelm/motion"] }),
  ui("dialog", { deps: ["radix-ui", "motion", "lucide-react"], reg: ["@nuelm/motion"] }),
  ui("dropdown-menu", { deps: ["radix-ui", "lucide-react"] }),
  ui("select", { deps: ["radix-ui", "lucide-react"] }),
  ui("popover", { deps: ["radix-ui"] }),
  ui("tooltip", { deps: ["radix-ui"] }),
  ui("sonner", { deps: ["sonner"] }),

  motionComponent("animated-number"),
  motionComponent("blur-text"),
  motionComponent("shimmer-text"),
  motionComponent("spotlight-card"),
  motionComponent("marquee"),
  motionComponent("reveal"),
  motionComponent("magnetic"),
  {
    ...motionComponent("preview-rail", {
      reg: ["@nuelm/use-dismiss", "@nuelm/use-hover-gesture", "@nuelm/use-tap-gesture"],
    }),
    description: "Tick rail with hover previews for jumping between sections.",
  },
  motionComponent("copy-button", { deps: ["lucide-react"], reg: ["@nuelm/button"] }),

  agent("voice-orb", {
    deps: ["motion"],
    reg: ["@nuelm/motion"],
    extra: ["voice-orb/renderer.ts"],
    description: "Breathing WebGL liquid orb that reacts to a voice level or an AnalyserNode.",
  }),
  agent("agent-disclosure", {
    deps: ["motion"],
    reg: ["@nuelm/motion"],
    description: "Shared clip-path reveal for collapsible agent content.",
  }),
  agent("citations", {
    deps: ["motion", "lucide-react"],
    reg: ["@nuelm/motion", "@nuelm/agent-disclosure", "@nuelm/use-favicon"],
    description: "Inline citation markers, favicon stacks and a collapsible source list.",
  }),
  agent("message-bubble", {
    deps: ["motion", "lucide-react"],
    reg: ["@nuelm/motion"],
    extra: ["message-context.tsx"],
    description: "Chat bubble surfaces with variants, pop-in entrance and a collapsible body.",
  }),
  agent("message-scroller", {
    deps: ["motion"],
    reg: ["@nuelm/preview-rail"],
    description: "Transcript viewport that follows streamed output and offers a turn-by-turn rail.",
  }),
  agent("message", {
    deps: ["motion"],
    reg: ["@nuelm/motion", "@nuelm/message-bubble", "@nuelm/message-scroller"],
    description: "Message rows with avatar, header, footer, markers and a typing indicator.",
  }),
  agent("prompt-input", {
    deps: ["motion", "lucide-react"],
    reg: ["@nuelm/motion", "@nuelm/button", "@nuelm/popover", "@nuelm/select"],
    description: "Auto-growing prompt box with model picker, action menu and send/stop.",
  }),
  agent("streaming-response", {
    deps: ["motion", "lucide-react"],
    reg: ["@nuelm/motion", "@nuelm/citations", "@nuelm/agent-disclosure"],
    description: "Streamed answer with copy, retry, feedback and a sources footer.",
  }),
]

// Strip the motion dependency from the two pure-CSS motion components.
for (const item of items) {
  if (item.name === "shimmer-text" || item.name === "marquee") {
    item.dependencies = []
    item.registryDependencies = ["@nuelm/utils"]
  }
  if (!item.description) delete item.description
}

items.push({
  name: "all",
  type: "registry:item",
  title: "Everything",
  description: "The theme plus every nuelm/ui component.",
  registryDependencies: items.map((i) => `@nuelm/${i.name}`),
})

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "nuelm",
  homepage: "https://github.com/nuelmdesign/UI-System",
  items,
}

writeFileSync(
  new URL("../registry.json", import.meta.url),
  JSON.stringify(registry, null, 2) + "\n"
)
console.log(`registry.json: ${items.length} items`)
