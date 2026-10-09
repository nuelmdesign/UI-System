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

// `@utility name { ... }` blocks (eyebrow, bg-dots, …) so installs get them too.
function utilities() {
  const out = {}
  const re = /@utility\s+([\w-]+)\s*\{/g
  let m
  while ((m = re.exec(css))) {
    let depth = 0
    const open = re.lastIndex - 1
    for (let i = open; i < css.length; i++) {
      if (css[i] === "{") depth++
      if (css[i] === "}" && --depth === 0) {
        out[`@utility ${m[1]}`] = declarations(css.slice(open + 1, i))
        break
      }
    }
  }
  return out
}

// Declarations plus one level of nested rules (e.g. `&::-webkit-scrollbar`).
function declarations(body) {
  const out = {}
  const nested = /([^{};]+)\{([^{}]*)\}/g
  for (const [, selector, inner] of body.matchAll(nested)) {
    out[selector.trim()] = declarations(inner)
  }
  for (const d of body.replace(nested, "").split(";")) {
    const [k, ...v] = d.split(":")
    if (k.trim()) out[k.trim()] = v.join(":").replace(/\s+/g, " ").trim()
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
// Font families resolve through the --font-heading/body/code knobs in :root,
// which fall back to system stacks when the app hasn't loaded the fonts.

const ui = (name, { deps = [], reg = [], description } = {}) => ({
  name,
  type: "registry:ui",
  title: name.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()),
  description,
  dependencies: deps,
  registryDependencies: ["@opendraft/utils", ...reg],
  files: [{ path: `components/ui/${name}.tsx`, type: "registry:ui" }],
})

const motionComponent = (name, { deps = [], reg = [], description } = {}) => ({
  name,
  type: "registry:component",
  title: name.replace(/(^|-)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()),
  description,
  dependencies: ["motion", ...deps],
  registryDependencies: ["@opendraft/utils", "@opendraft/motion", ...reg],
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
  registryDependencies: ["@opendraft/utils", ...reg],
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

// Base styles every project needs for the tokens to take effect. Mirrors the
// `@layer base` block in app/globals.css, written as plain CSS so the shadcn
// CLI can merge it into a project's stylesheet.
const BASE_LAYER = {
  "@layer base": {
    "*": {
      "border-color": "var(--border)",
      "outline-color": "color-mix(in oklab, var(--ring) 50%, transparent)",
    },
    html: { "color-scheme": "light" },
    "html.dark": { "color-scheme": "dark" },
    body: {
      "background-color": "var(--background)",
      color: "var(--foreground)",
      "font-family": "var(--font-body)",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    "h1, h2, h3, h4": { "letter-spacing": "-0.025em", "text-wrap": "balance" },
    "::selection": {
      background: "color-mix(in oklch, var(--brand) 28%, transparent)",
    },
  },
}

const items = [
  {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description: "opendraft color, radius, elevation and motion tokens (light + dark).",
    cssVars: {
      theme: themeVars,
      light: vars(block(":root")),
      dark: vars(block(".dark")),
    },
    css: { ...BASE_LAYER, ...keyframes(motionTheme), ...utilities() },
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
  hook("use-hover-gesture", { reg: ["@opendraft/touch"] }),
  hook("use-favicon", { reg: ["@opendraft/favicon"] }),
  hook("use-hover-capable"),
  hook("use-touch-capable"),
  hook("use-on-open"),
  hook("use-row-cursor"),
  lib("touch"),
  lib("favicon"),
  lib("text-shimmer"),
  lib("command-search"),
  { ...lib("presence-gate"), files: [{ path: "lib/presence-gate.tsx", type: "registry:lib" }] },

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
  ui("switch", { deps: ["radix-ui", "motion"], reg: ["@opendraft/motion"] }),
  ui("checkbox", { deps: ["radix-ui", "motion"], reg: ["@opendraft/motion"] }),
  ui("tabs", { deps: ["radix-ui", "motion"], reg: ["@opendraft/motion"] }),
  ui("accordion", { deps: ["radix-ui", "motion", "lucide-react"], reg: ["@opendraft/motion"] }),
  ui("dialog", { deps: ["radix-ui", "motion", "lucide-react"], reg: ["@opendraft/motion"] }),
  ui("dropdown-menu", { deps: ["radix-ui", "lucide-react"] }),
  ui("select", { deps: ["radix-ui", "lucide-react"] }),
  ui("popover", { deps: ["radix-ui"] }),
  ui("radio-group", { deps: ["radix-ui", "motion"], reg: ["@opendraft/motion"] }),
  ui("tooltip", { deps: ["radix-ui"] }),
  ui("sonner", { deps: ["sonner"] }),

  motionComponent("animated-number"),
  motionComponent("blur-text"),
  motionComponent("shimmer-text"),
  {
    ...motionComponent("glide-menu"),
    dependencies: [],
    registryDependencies: ["@opendraft/utils"],
    description: "List whose hover highlight glides between rows.",
  },
  motionComponent("spotlight-card"),
  motionComponent("marquee"),
  motionComponent("reveal"),
  motionComponent("magnetic"),
  {
    ...motionComponent("preview-rail", {
      reg: ["@opendraft/use-dismiss", "@opendraft/use-hover-gesture", "@opendraft/use-tap-gesture"],
    }),
    description: "Tick rail with hover previews for jumping between sections.",
  },
  {
    ...motionComponent("loader"),
    description: "Fifteen loading animations: spinner, dots, matrix, ASCII, metaballs and more.",
  },
  {
    ...motionComponent("text-scramble"),
    description: "Character scramble that resolves to its text.",
  },
  {
    ...motionComponent("action-swap"),
    description: "Animated label and icon swaps (roll, blur, cascade) for buttons and counters.",
    files: ["action-swap.tsx", "action-swap-roll.tsx"].map((file) => ({
      path: `components/motion/${file}`,
      type: "registry:component",
      target: `components/motion/${file}`,
    })),
  },
  {
    ...motionComponent("pixel-field"),
    dependencies: [],
    registryDependencies: ["@opendraft/utils", "@opendraft/theme"],
    description: "Canvas pixel textures in the blue scale: mosaic, dot matrix and equalizer.",
  },
  {
    ...motionComponent("animated-sidebar", { deps: ["lucide-react"] }),
    description: "Full sidebar system: docked, icon rail or off-canvas, mobile sheet, menus and sub-menus.",
    files: ["animated-sidebar.tsx", "shared-layout-bg.tsx"].map((file) => ({
      path: `components/motion/${file}`,
      type: "registry:component",
      target: `components/motion/${file}`,
    })),
  },
  {
    ...motionComponent("drawer"),
    registryDependencies: ["@opendraft/utils", "@opendraft/motion", "@opendraft/presence-gate"],
    description: "Side sheet with backdrop, focus handling and Esc / outside-click close.",
  },
  {
    ...motionComponent("command-palette", { deps: ["lucide-react"] }),
    registryDependencies: ["@opendraft/utils", "@opendraft/motion", "@opendraft/presence-gate", "@opendraft/command-search", "@opendraft/use-on-open", "@opendraft/use-row-cursor", "@opendraft/use-touch-capable"],
    description: "⌘K command palette with fuzzy search, groups, hints and keyboard navigation.",
  },
  {
    ...motionComponent("date-range-picker", { deps: ["lucide-react"] }),
    registryDependencies: ["@opendraft/utils", "@opendraft/motion", "@opendraft/popover", "@opendraft/use-hover-capable"],
    description: "Range calendar in a popover or inline, with month/year choosers and min/max.",
    files: ["date-range-picker.tsx", "date-range-picker/context.ts", "date-range-picker/date-utils.ts", "date-range-picker/types.ts", "date-range-picker/use-date-range-picker.ts"].map((file) => ({
      path: `components/motion/${file}`,
      type: "registry:component",
      target: `components/motion/${file}`,
    })),
  },
  {
    ...motionComponent("table", { deps: ["lucide-react", "@tanstack/react-virtual"] }),
    registryDependencies: ["@opendraft/utils", "@opendraft/motion", "@opendraft/checkbox", "@opendraft/touch"],
    description: "Virtualized data table: sort, resize, reorder columns, select rows, edit cells.",
    files: ["index.tsx", "editable-cell.tsx", "row-handle.tsx", "skeleton-rows.tsx", "table-header.tsx", "table-menu.tsx", "types.ts", "use-column-reorder.ts", "use-column-resize.ts", "use-column-sort.ts", "use-row-selection.ts", "utils.ts"].map((file) => ({
      path: `components/motion/table/${file}`,
      type: "registry:component",
      target: `components/motion/table/${file}`,
    })),
  },
  motionComponent("copy-button", { deps: ["lucide-react"], reg: ["@opendraft/button"] }),

  agent("voice-orb", {
    deps: ["motion"],
    reg: ["@opendraft/motion"],
    extra: ["voice-orb/renderer.ts"],
    description: "Breathing WebGL liquid orb that reacts to a voice level or an AnalyserNode.",
  }),
  agent("agent-disclosure", {
    deps: ["motion"],
    reg: ["@opendraft/motion"],
    description: "Shared clip-path reveal for collapsible agent content.",
  }),
  agent("citations", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/agent-disclosure", "@opendraft/use-favicon"],
    description: "Inline citation markers, favicon stacks and a collapsible source list.",
  }),
  agent("message-bubble", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion"],
    extra: ["message-context.tsx"],
    description: "Chat bubble surfaces with variants, pop-in entrance and a collapsible body.",
  }),
  agent("message-scroller", {
    deps: ["motion"],
    reg: ["@opendraft/preview-rail"],
    description: "Transcript viewport that follows streamed output and offers a turn-by-turn rail.",
  }),
  agent("message", {
    deps: ["motion"],
    reg: ["@opendraft/motion", "@opendraft/message-bubble", "@opendraft/message-scroller"],
    description: "Message rows with avatar, header, footer, markers and a typing indicator.",
  }),
  agent("prompt-input", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/button", "@opendraft/popover", "@opendraft/select"],
    description: "Auto-growing prompt box with model picker, action menu and send/stop.",
  }),
  agent("agent-code", {
    deps: ["shiki"],
    description: "Shared Shiki tokenizer and code renderer used by agent components.",
  }),
  agent("todo-list", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/agent-disclosure", "@opendraft/action-swap"],
    description: "Live task plan with per-item progress and a rolling completed count.",
  }),
  agent("tool-result", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/agent-disclosure", "@opendraft/action-swap", "@opendraft/agent-code"],
    description: "Tool call card for terminal, request and file output with status, copy and retry.",
  }),
  agent("code-block", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/agent-code"],
    description: "Streaming code block with Shiki highlighting, line highlights and copy.",
  }),
  agent("file-diff", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/agent-disclosure", "@opendraft/agent-code"],
    description: "Streaming unified diff with added/removed counts.",
  }),
  {
    ...agent("agent-activity", {
      deps: ["motion", "lucide-react"],
      reg: ["@opendraft/motion", "@opendraft/agent-disclosure", "@opendraft/loading-states"],
      description: "Collapsible run log of steps, searches and tool calls.",
    }),
    files: ["index.tsx", "activity-row.tsx", "types.ts"].map((file) => ({
      path: `components/agents/agent-activity/${file}`,
      type: "registry:component",
      target: `components/agents/agent-activity/${file}`,
    })),
  },
  {
    ...agent("loading-states", {
      deps: ["motion"],
      reg: ["@opendraft/motion", "@opendraft/shimmer-text", "@opendraft/text-scramble", "@opendraft/loader", "@opendraft/text-shimmer"],
      description: "Thinking shimmer, elapsed-time progress and rotating reasoning text.",
    }),
    files: ["index.ts", "agent-progress.tsx", "reasoning-text.tsx", "thinking-shimmer.tsx"].map((file) => ({
      path: `components/agents/loading-states/${file}`,
      type: "registry:component",
      target: `components/agents/loading-states/${file}`,
    })),
  },
  {
    ...agent("approval-card", {
      deps: ["motion", "lucide-react"],
      reg: ["@opendraft/motion", "@opendraft/agent-disclosure", "@opendraft/action-swap", "@opendraft/button", "@opendraft/checkbox", "@opendraft/radio-group", "@opendraft/input"],
      description: "Human-in-the-loop card: stepped questions or approve / request changes / reject.",
    }),
    files: ["index.tsx", "types.ts"].map((file) => ({
      path: `components/agents/approval-card/${file}`,
      type: "registry:component",
      target: `components/agents/approval-card/${file}`,
    })),
  },
  agent("tool-approval", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/agent-disclosure", "@opendraft/agent-code"],
    description: "Permission prompt for a tool call with parameters, allow once / always and deny.",
  }),
  agent("image-generation", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/use-hover-capable"],
    description: "Image generation frame with queued, generating, refining and complete states.",
  }),
  agent("ai-sidebar", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/popover", "@opendraft/use-touch-capable"],
    description: "Resource tree for agent workspaces: select, expand, drag to move and rename.",
  }),
  agent("chat-app", {
    reg: ["@opendraft/animated-sidebar"],
    description: "Chat application shell that folds its sidebar away when the shell gets narrow.",
  }),
  agent("streaming-response", {
    deps: ["motion", "lucide-react"],
    reg: ["@opendraft/motion", "@opendraft/citations", "@opendraft/agent-disclosure"],
    description: "Streamed answer with copy, retry, feedback and a sources footer.",
  }),
  agent("question-card", {
    deps: ["lucide-react", "motion"],
    reg: ["@opendraft/button", "@opendraft/glide-menu", "@opendraft/motion"],
    description: "One question at a time in a sliding stack with an odometer step counter and auto-advance on single choice.",
  }),
  agent("chat-panel", {
    deps: ["lucide-react"],
    description: "Chat panel with context tabs, a scripted reply sequence that starts on send, and a composer.",
  }),
  agent("recommendation-card", {
    deps: ["lucide-react"],
    reg: ["@opendraft/button"],
    description: "Recommendation with a confidence meter, an alternatives drawer that swaps the pick, and a confirm action.",
  }),
  agent("context-cards", {
    deps: ["lucide-react"],
    description: "Retrieved context chunks that stagger in, then reveal their source file chips.",
  }),
  agent("search-list", {
    deps: ["lucide-react"],
    reg: ["@opendraft/glide-menu"],
    description: "Command-style search with live filtering, a clear action, a gliding hover highlight and an empty state.",
  }),
  agent("filter-table", {
    description: "Task table filtered by status chips; rows collapse in place and status pills are tinted by meaning.",
  }),
  agent("flowchart", {
    deps: ["lucide-react"],
    reg: ["@opendraft/glide-menu"],
    description: "Workflow canvas with draggable Trigger and If/Else cards joined by a live bezier connector.",
  }),
  agent("insight-cards", {
    deps: ["lucide-react", "motion"],
    reg: ["@opendraft/button", "@opendraft/motion"],
    description: "Insights carousel with comparison, anomaly and allocation mini-charts and a blurred page crossfade.",
  }),
  agent("prompt-bar", {
    deps: ["lucide-react", "motion"],
    reg: ["@opendraft/glide-menu", "@opendraft/motion"],
    description: "A composer with @ sources, / commands, a model picker, dictation and attachments, plus a self-running demo.",
  }),
  agent("selection-actions", {
    deps: ["lucide-react", "motion"],
    reg: ["@opendraft/button", "@opendraft/shimmer-text", "@opendraft/motion"],
    description: "A contextual AI bar under selected text that animates its width between modes and streams in a rewrite.",
  }),
  agent("pixel-loader", {
    reg: ["@opendraft/shimmer-text"],
    description: "A 3×3 pixel-grid loader with a shimmering status label and a live elapsed timer, in four motion variants.",
  }),
  agent("thinking-trace", {
    deps: ["lucide-react"],
    reg: ["@opendraft/shimmer-text"],
    description: "An expandable agent trace that shimmers while working, then settles. Steps, reasoning, search and coding variants.",
  }),
  agent("streaming-answer", {
    deps: ["lucide-react"],
    description: "An answer that streams in word by word with an inline citation, then shows actions, sources and follow-ups.",
  }),
  agent("task-rows", {
    deps: ["lucide-react"],
    description: "Task rows with progress rings, status pills and expandable details, run through a failed, retry, done sequence.",
  }),
  agent("tool-chips", {
    deps: ["lucide-react"],
    description: "An agent run as compact tool-call rows with inline chips, then file-diff chips that preview their diff on hover.",
  }),
  agent("agent-screen", {
    deps: ["lucide-react"],
    reg: ["@opendraft/button"],
    description: "Live agent-screen card that expands to a full-screen viewer with Teach-a-task recording.",
  }),
  agent("code-panel", {
    deps: ["lucide-react"],
    description: "Light editor panel with a line-numbered Code view and a unified Diff view with word-level highlights.",
  }),
  agent("fine-tune-card", {
    deps: ["lucide-react"],
    reg: ["@opendraft/glide-menu", "@opendraft/shimmer-text"],
    description: "Compact inspector with scrub-able number fields, a sliding segmented control and a Type menu.",
  }),
  agent("sidebar-nav", {
    deps: ["lucide-react"],
    reg: ["@opendraft/button", "@opendraft/glide-menu", "@opendraft/motion"],
    description: "Workspace switcher, primary nav and searchable chats that collapse to an aligned icon rail.",
  }),
  agent("records-table", {
    deps: ["lucide-react"],
    reg: ["@opendraft/glide-menu", "@opendraft/checkbox", "@opendraft/switch"],
    description: "AI spreadsheet grid with property popovers, row-by-row calculation, resizable sticky columns and sorting.",
  }),
  agent("diff-table", {
    deps: ["lucide-react"],
    reg: ["@opendraft/button"],
    description: "A proposed table edit that plays once; click each changed row to keep or drop it before applying.",
  }),
]

// Strip the motion dependency from the two pure-CSS motion components.
for (const item of items) {
  if (item.name === "shimmer-text" || item.name === "marquee") {
    item.dependencies = []
    item.registryDependencies = ["@opendraft/utils"]
  }
  if (!item.description) delete item.description
}

items.push({
  name: "all",
  type: "registry:item",
  title: "Everything",
  description: "The theme plus every opendraft component.",
  registryDependencies: items.map((i) => `@opendraft/${i.name}`),
})

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "opendraft",
  homepage: "https://github.com/nuelmdesign/UI-System",
  items,
}

writeFileSync(
  new URL("../registry.json", import.meta.url),
  JSON.stringify(registry, null, 2) + "\n"
)
console.log(`registry.json: ${items.length} items`)
