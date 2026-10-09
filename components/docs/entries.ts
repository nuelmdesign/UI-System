/** Every page in the docs: guides plus one page per installable component. */

export type DocCategory = "Blocks" | "Agents" | "Data" | "Components" | "Motion"

export type DocEntry = {
  slug: string
  title: string
  category: DocCategory
  description: string
  /** Shown with a NEW tag in the sidebar and index. */
  isNew?: boolean
  /** Registry item name, when it differs from the slug. */
  registry?: string
}

export type GuideEntry = { slug: string; title: string; description: string }

export const GUIDES: GuideEntry[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description: "What opendraft is and how it's put together.",
  },
  {
    slug: "ai",
    title: "Use with AI",
    description:
      "Give an AI assistant one link so it builds with opendraft's components and tokens.",
  },
  {
    slug: "installation",
    title: "Installation",
    description: "Add the registry to a project and install components.",
  },
  {
    slug: "theming",
    title: "Theming",
    description: "Color, type, shape and texture tokens, in both themes.",
  },
  {
    slug: "motion",
    title: "Motion",
    description: "The shared springs, easings and durations in lib/motion.ts.",
  },
]

export const CATEGORY_LABEL: Record<DocCategory, string> = {
  Blocks: "Blocks",
  Agents: "AI Agents",
  Data: "Data & Workflows",
  Components: "Components",
  Motion: "Motion",
}

export const CATEGORY_ORDER: DocCategory[] = [
  "Blocks",
  "Agents",
  "Data",
  "Components",
  "Motion",
]

export const ENTRIES: DocEntry[] = [
  // AI agents
  {
    slug: "voice-orb",
    title: "Voice Orb",
    category: "Agents",
    description:
      "Breathing WebGL liquid orb that reacts to a voice level or an audio analyser.",
    isNew: true,
  },
  {
    slug: "message-bubble",
    title: "Message Bubble",
    category: "Agents",
    description:
      "Chat bubble surfaces with variants, a pop-in entrance and a collapsible body.",
  },
  {
    slug: "message",
    title: "Message",
    category: "Agents",
    description:
      "Message rows with avatar, header, footer, markers and a typing indicator.",
  },
  {
    slug: "message-scroller",
    title: "Message Scroller",
    category: "Agents",
    description:
      "Transcript that follows streamed output, with a rail for jumping between turns.",
  },
  {
    slug: "prompt-input",
    title: "Prompt Input",
    category: "Agents",
    description:
      "Auto-growing prompt box with a model picker, an action menu and send / stop.",
  },
  {
    slug: "streaming-response",
    title: "Streaming Response",
    category: "Agents",
    description:
      "Streamed answer with copy, retry, feedback and a sources footer.",
  },
  {
    slug: "citations",
    title: "Citations",
    category: "Agents",
    description:
      "Inline citation markers, favicon stacks and a collapsible source list.",
  },
  {
    slug: "agent-activity",
    title: "Agent Activity",
    category: "Agents",
    description: "Collapsible run log of steps, web searches and tool calls.",
  },
  {
    slug: "loading-states",
    title: "Agent Loading States",
    category: "Agents",
    description:
      "Thinking shimmer, elapsed-time progress and rotating reasoning text.",
  },
  {
    slug: "todo-list",
    title: "Todo List",
    category: "Agents",
    description:
      "Live task plan with per-item progress and a rolling completed count.",
  },
  {
    slug: "tool-result",
    title: "Tool Result",
    category: "Agents",
    description:
      "Tool call card for terminal, request and file output with status, copy and retry.",
  },
  {
    slug: "code-block",
    title: "Code Block",
    category: "Agents",
    description:
      "Streaming code with Shiki highlighting, line highlights and copy.",
  },
  {
    slug: "file-diff",
    title: "File Diff",
    category: "Agents",
    description: "Streaming unified diff with added and removed counts.",
  },
  {
    slug: "approval-card",
    title: "Approval Card",
    category: "Agents",
    description:
      "Human-in-the-loop card: stepped questions, or approve / request changes / reject.",
  },
  {
    slug: "tool-approval",
    title: "Tool Approval",
    category: "Agents",
    description:
      "Permission prompt for a tool call: parameters, allow once or always, deny.",
  },
  {
    slug: "image-generation",
    title: "Image Generation",
    category: "Agents",
    description:
      "Image frame with queued, generating, refining and complete states.",
  },
  {
    slug: "ai-sidebar",
    title: "AI Sidebar",
    category: "Agents",
    description:
      "Resource tree for agent workspaces: select, expand, drag to move and rename.",
  },
  {
    slug: "chat-app",
    title: "Chat App",
    category: "Agents",
    description:
      "Chat shell with a conversation sidebar that folds away when space runs out.",
  },

  // Components
  {
    slug: "accordion",
    title: "Accordion",
    category: "Components",
    description:
      "Stacked sections that expand with a spring-driven height animation.",
  },
  {
    slug: "animated-sidebar",
    title: "Sidebar",
    category: "Components",
    description:
      "Docked, icon rail or off-canvas sidebar with a mobile sheet, menus and sub-menus.",
    isNew: true,
  },
  {
    slug: "avatar",
    title: "Avatar",
    category: "Components",
    description: "Image or initials, alone or overlapped in a group.",
  },
  {
    slug: "badge",
    title: "Badge",
    category: "Components",
    description: "Small square status label, with an optional dot.",
  },
  {
    slug: "button",
    title: "Button",
    category: "Components",
    description:
      "Primary, ink, secondary, outline, ghost, destructive and link, with a loading state.",
  },
  {
    slug: "card",
    title: "Card",
    category: "Components",
    description:
      "Bordered surface with header, action, content and footer slots.",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    category: "Components",
    description: "Checkbox with a drawn check and an indeterminate state.",
  },
  {
    slug: "command-palette",
    title: "Command Palette",
    category: "Components",
    description:
      "⌘K palette with fuzzy search, groups, hints and keyboard navigation.",
    isNew: true,
  },
  {
    slug: "table",
    title: "Data Table",
    category: "Components",
    description:
      "Virtualized table: sort, resize and reorder columns, select rows, edit cells.",
    isNew: true,
  },
  {
    slug: "date-range-picker",
    title: "Date Range Picker",
    category: "Components",
    description:
      "Range calendar in a popover, with month and year choosers and min / max.",
    isNew: true,
  },
  {
    slug: "dialog",
    title: "Dialog",
    category: "Components",
    description:
      "Modal dialog that springs in, with header, body and footer slots.",
  },
  {
    slug: "drawer",
    title: "Drawer",
    category: "Components",
    description:
      "Side sheet with a backdrop that closes on Esc or an outside click.",
    isNew: true,
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    category: "Components",
    description: "Menu with shortcuts, checkbox items and sub-menus.",
  },
  {
    slug: "input",
    title: "Input",
    category: "Components",
    description: "Text field with focus, invalid and disabled states.",
  },
  {
    slug: "kbd",
    title: "Kbd",
    category: "Components",
    description: "Keyboard keys and shortcuts.",
  },
  {
    slug: "label",
    title: "Label",
    category: "Components",
    description: "Accessible label for form controls.",
  },
  {
    slug: "popover",
    title: "Popover",
    category: "Components",
    description: "Floating panel anchored to a trigger.",
  },
  {
    slug: "radio-group",
    title: "Radio Group",
    category: "Components",
    description: "Single choice from a set, with a spring-in indicator.",
    isNew: true,
  },
  {
    slug: "select",
    title: "Select",
    category: "Components",
    description: "Dropdown select with groups and labels.",
  },
  {
    slug: "separator",
    title: "Separator",
    category: "Components",
    description: "Horizontal or vertical hairline.",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    category: "Components",
    description: "Shimmering placeholder while content loads.",
  },
  {
    slug: "switch",
    title: "Switch",
    category: "Components",
    description: "On / off toggle with a spring-driven thumb.",
  },
  {
    slug: "tabs",
    title: "Tabs",
    category: "Components",
    description: "Tabs with a sliding indicator, in pill or underline style.",
  },
  {
    slug: "textarea",
    title: "Textarea",
    category: "Components",
    description: "Multi-line text field that grows with its content.",
  },
  {
    slug: "sonner",
    title: "Toast",
    category: "Components",
    description: "Stacked notifications with actions, themed to the tokens.",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    category: "Components",
    description: "Short hint on hover or focus, with optional shortcuts.",
  },

  // Motion
  {
    slug: "action-swap",
    title: "Action Swap",
    category: "Motion",
    description:
      "Buttons whose label and icon roll, blur or cascade between states.",
  },
  {
    slug: "animated-number",
    title: "Animated Number",
    category: "Motion",
    description: "Spring-animated number with Intl formatting.",
  },
  {
    slug: "blur-text",
    title: "Blur Text",
    category: "Motion",
    description: "Text that arrives word by word or character by character.",
  },
  {
    slug: "copy-button",
    title: "Copy Button",
    category: "Motion",
    description: "Copies a value and morphs its icon into a check.",
  },
  {
    slug: "loader",
    title: "Loader",
    category: "Motion",
    description:
      "Fifteen loading animations, from spinners to ASCII and metaballs.",
  },
  {
    slug: "magnetic",
    title: "Magnetic",
    category: "Motion",
    description: "Pulls its child gently toward the cursor.",
  },
  {
    slug: "marquee",
    title: "Marquee",
    category: "Motion",
    description: "Seamless scrolling row with faded edges.",
  },
  {
    slug: "pixel-field",
    title: "Pixel Field",
    category: "Motion",
    description:
      "Canvas pixel textures in the blue scale: mosaic, dot matrix and equalizer.",
    isNew: true,
  },
  {
    slug: "preview-rail",
    title: "Preview Rail",
    category: "Motion",
    description: "Tick rail with hover previews for jumping between sections.",
  },
  {
    slug: "reveal",
    title: "Reveal",
    category: "Motion",
    description: "Fades and lifts content into view as it scrolls in.",
  },
  {
    slug: "shimmer-text",
    title: "Shimmer Text",
    category: "Motion",
    description: "A light sweep across text, for thinking and loading labels.",
  },
  {
    slug: "spotlight-card",
    title: "Spotlight Card",
    category: "Motion",
    description: "Card whose border and surface light up under the cursor.",
  },
  {
    slug: "text-scramble",
    title: "Text Scramble",
    category: "Motion",
    description: "Characters scramble, then resolve to the new text.",
  },
  {
    slug: "question-card",
    title: "Question Card",
    category: "Agents",
    description:
      "One question at a time in a sliding stack with an odometer step counter and auto-advance on single choice.",
    isNew: true,
  },
  {
    slug: "chat-panel",
    title: "Chat Panel",
    category: "Agents",
    description:
      "Chat panel with context tabs, a scripted reply sequence that starts on send, and a composer.",
    isNew: true,
  },
  {
    slug: "recommendation-card",
    title: "Recommendation Card",
    category: "Agents",
    description:
      "Recommendation with a confidence meter, an alternatives drawer that swaps the pick, and a confirm action.",
    isNew: true,
  },
  {
    slug: "context-cards",
    title: "Context Cards",
    category: "Agents",
    description:
      "Retrieved context chunks that stagger in, then reveal their source file chips.",
    isNew: true,
  },
  {
    slug: "search-list",
    title: "Search List",
    category: "Components",
    description:
      "Command-style search with live filtering, a clear action, a gliding hover highlight and an empty state.",
    isNew: true,
  },
  {
    slug: "filter-table",
    title: "Filter Table",
    category: "Data",
    description:
      "Task table filtered by status chips; rows collapse in place and status pills are tinted by meaning.",
    isNew: true,
  },
  {
    slug: "flowchart",
    title: "Flowchart",
    category: "Data",
    description:
      "Workflow canvas with draggable Trigger and If/Else cards joined by a live bezier connector.",
    isNew: true,
  },
  {
    slug: "insight-cards",
    title: "Insight Cards",
    category: "Data",
    description:
      "Insights carousel with comparison, anomaly and allocation mini-charts and a blurred page crossfade.",
    isNew: true,
  },
  {
    slug: "prompt-bar",
    title: "Prompt Bar",
    category: "Agents",
    description:
      "A composer with @ sources, / commands, a model picker, dictation and attachments, plus a self-running demo.",
    isNew: true,
  },
  {
    slug: "selection-actions",
    title: "Selection Actions",
    category: "Agents",
    description:
      "A contextual AI bar under selected text that animates its width between modes and streams in a rewrite.",
    isNew: true,
  },
  {
    slug: "pixel-loader",
    title: "Pixel Loader",
    category: "Agents",
    description:
      "A 3×3 pixel-grid loader with a shimmering status label and a live elapsed timer, in four motion variants.",
    isNew: true,
  },
  {
    slug: "thinking-trace",
    title: "Thinking Trace",
    category: "Agents",
    description:
      "An expandable agent trace that shimmers while working, then settles. Steps, reasoning, search and coding variants.",
    isNew: true,
  },
  {
    slug: "streaming-answer",
    title: "Streaming Answer",
    category: "Agents",
    description:
      "An answer that streams in word by word with an inline citation, then shows actions, sources and follow-ups.",
    isNew: true,
  },
  {
    slug: "task-rows",
    title: "Task Rows",
    category: "Agents",
    description:
      "Task rows with progress rings, status pills and expandable details, run through a failed, retry, done sequence.",
    isNew: true,
  },
  {
    slug: "tool-chips",
    title: "Tool Chips",
    category: "Agents",
    description:
      "An agent run as compact tool-call rows with inline chips, then file-diff chips that preview their diff on hover.",
    isNew: true,
  },
  {
    slug: "agent-screen",
    title: "Agent Screen",
    category: "Agents",
    description:
      "Live agent-screen card that expands to a full-screen viewer with Teach-a-task recording.",
    isNew: true,
  },
  {
    slug: "code-panel",
    title: "Code Panel",
    category: "Agents",
    description:
      "Light editor panel with a line-numbered Code view and a unified Diff view with word-level highlights.",
    isNew: true,
  },
  {
    slug: "fine-tune-card",
    title: "Fine-tune Card",
    category: "Data",
    description:
      "Compact inspector with scrub-able number fields, a sliding segmented control and a Type menu.",
    isNew: true,
  },
  {
    slug: "sidebar-nav",
    title: "Sidebar Nav",
    category: "Components",
    description:
      "Workspace switcher, primary nav and searchable chats that collapse to an aligned icon rail.",
    isNew: true,
  },
  {
    slug: "records-table",
    title: "Records Table",
    category: "Data",
    description:
      "AI spreadsheet grid with property popovers, row-by-row calculation, resizable sticky columns and sorting.",
    isNew: true,
  },
  {
    slug: "diff-table",
    title: "Diff Table",
    category: "Data",
    description:
      "A proposed table edit that plays once; click each changed row to keep or drop it before applying.",
    isNew: true,
  },
  {
    slug: "crm-pipeline",
    title: "CRM Pipeline",
    category: "Blocks",
    description:
      "Sales pipeline with a stage board, sortable list view, search, drag or menu moves, and a deal detail panel with an activity timeline.",
    isNew: true,
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    category: "Blocks",
    description:
      "Analytics screen with range tabs, KPI cards, a metric chart, a sortable top-pages table and a channel breakdown.",
    isNew: true,
  },
  {
    slug: "settings-page",
    title: "Settings Page",
    category: "Blocks",
    description:
      "Settings with profile, notifications, team and billing sections, an unsaved-changes bar and a type-to-confirm danger zone.",
    isNew: true,
  },
  {
    slug: "auth-screen",
    title: "Auth Screen",
    category: "Blocks",
    description:
      "Split sign-in and sign-up screen with validation, social providers, loading and error states, and a brand panel.",
    isNew: true,
  },
  {
    slug: "agent-workspace",
    title: "Agent Workspace",
    category: "Blocks",
    description:
      "AI agent chat workspace: conversation rail, thread with thinking, tool calls and streamed answers, prompt bar and a live task panel.",
    isNew: true,
  },
  {
    slug: "quantity-stepper",
    title: "Quantity Stepper",
    category: "Components",
    description:
      "Minus, value and plus control with min, max and step, controlled or uncontrolled, with optional press-and-hold repeat.",
    isNew: true,
  },
  {
    slug: "progress",
    title: "Progress",
    category: "Components",
    description:
      "Horizontal progress bar with a label row and a tone that follows how full or empty it is, for quotas and stock.",
    isNew: true,
  },
  {
    slug: "stat",
    title: "Stat",
    category: "Components",
    description:
      "KPI tile with a label, a large value, a change chip and an optional toggle-button mode, plus a grouped grid.",
    isNew: true,
  },
  {
    slug: "empty-state",
    title: "Empty State",
    category: "Components",
    description:
      "Centered empty block with an optional icon, title, description and action slots, for tables, lists and cards.",
    isNew: true,
  },
  {
    slug: "stepper",
    title: "Stepper",
    category: "Components",
    description:
      "Numbered step indicator for multi-step flows like checkout, horizontal or vertical, that never overflows on mobile.",
    isNew: true,
  },
  {
    slug: "theme-toggle",
    title: "Theme Toggle",
    category: "Components",
    description:
      "Icon menu that switches between system, light and dark by toggling the dark class, and remembers the choice.",
    isNew: true,
  },
  {
    slug: "site-header",
    title: "Site Header",
    category: "Components",
    description:
      "Sticky top bar with a brand slot, nav links, an actions slot and a mobile menu.",
    isNew: true,
  },
  {
    slug: "qr-code",
    title: "QR Code",
    category: "Components",
    description:
      "A real, scannable QR code drawn as an inline SVG, readable in light and dark themes.",
    isNew: true,
  },
  {
    slug: "ticket-pass",
    title: "Ticket Pass",
    category: "Components",
    description:
      "Digital ticket card with a title band, details grid, tear line, QR stub and a status badge.",
    isNew: true,
  },
]

export const ENTRY_BY_SLUG = Object.fromEntries(ENTRIES.map((e) => [e.slug, e]))

export function entriesIn(category: DocCategory) {
  return ENTRIES.filter((e) => e.category === category)
}

/** Reading order for previous / next links: guides, then each category. */
export const READING_ORDER: string[] = [
  ...GUIDES.map((g) => g.slug),
  ...CATEGORY_ORDER.flatMap((c) => entriesIn(c).map((e) => e.slug)),
]
