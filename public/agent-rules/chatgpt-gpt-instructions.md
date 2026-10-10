Paste this into a custom GPT's Instructions (or the first message of a chat). You can't run commands here: write the code, then end your answer with the list of install commands (npx shadcn@latest add @opendraft/<name>) for every opendraft component you used, so the person can run them in their project. If you can't open links, ask them to paste the rules from https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt or use the "Copy with rules included" button on the docs.

## opendraft: build with it, don't reinvent it

opendraft is a React + Tailwind CSS v4 design system, installed as source files through a shadcn registry (no npm package). Use its components and theme tokens for all UI. The person you are building for comes first: if they ask for their own fonts, colors or corner radius, apply that through the brand tokens below, not by restyling components.

Full rules and the component list: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt (read it when you can open links). Everything below is the short version.

### 1. Choose before you build

- If the product is for an industry or job (security, IT and infrastructure, aviation, logistics, healthcare, fintech, ecommerce, education, energy, government, manufacturing, HR and others), read its playbook first: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/use-cases.json lists every domain with matching signals, and https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/use-cases/<id>.md has the details. A playbook names the components that serve each need, rates the fit (ready, adapt, gap), and gives a starter kit: `npx shadcn@latest add @opendraft/kit-<id>`.
- For a whole screen (dashboard, settings, sign-in, checkout, catalog, detail page, agent chat) check the blocks first. Install a block, then pass the real content through its props. Components and blocks show sample content when given no data: always pass your own, never leave the samples in a real screen.
- Only write a new component when nothing fits, and build it from existing parts.

### 2. Set up (once)

1. Needs React 19, Tailwind CSS v4, TypeScript and a shadcn `components.json` with this registry: `"registries": { "@opendraft": "https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/r/{name}.json" }`.
2. Install the theme first: `npx shadcn@latest add @opendraft/theme`. Without a CLI (Vite, Lovable, hosted builders): save https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/theme.css as your global stylesheet; it already includes the dark-mode setup and the fonts.
3. Install components by name: `npx shadcn@latest add @opendraft/button @opendraft/table`. Without a CLI: fetch https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/r/<name>.json for each item; write `files[].content` to `files[].path`; repeat for every name in `registryDependencies` (strip `@opendraft/`; a bare name like `utils` is also an item); add each item's `dependencies` with the package manager. Items named `kit-*` have no files, they only list other items.
4. Dark mode is the `dark` class on `<html>`. Use the `theme-toggle` component, and run its exported `themeScript` before paint to avoid a flash.
5. Next.js 16 with Cache Components: wrap anything that reads `usePathname`, `useSearchParams`, `params` or `searchParams` in `<Suspense>`. Don't pass icon components from server to client components.

### 3. Style only with tokens

Never hard-code colors, shadows, radii, easings or spring values, and never use Tailwind palette colors (`bg-gray-100`, `text-emerald-600`) or `dark:` color twins.

- Background and text: `bg-background text-foreground`. Cards and panels: `bg-card` with a hairline `border`. Quiet areas: `bg-muted`. Secondary text: `text-muted-foreground`. Hover: `bg-accent`.
- Primary action: `bg-primary text-primary-foreground`. Accent text and focus: `text-brand`, `border-brand`. Solid black: `bg-ink text-ink-foreground`.
- Status: `text-success`, `text-warning`, `text-destructive` (tints `bg-success/10`). Never show status by color alone: pair it with a word or icon.
- Lines: `border-border`, `border-input`. Floating layers only (menus, popovers, dialogs): `bg-popover shadow-md`. No gradients.
- Headings and big numbers: the `heading` utility. Small labels: `eyebrow`. Money, dates, IDs: `font-mono`. Corners: `rounded-md` for controls, `rounded-lg` for cards.
- Text over a texture (`PixelField`, `bg-dots`): put it in a `dark` section or on a solid panel.

### 4. Make it theirs: brand tokens

Change the brand tokens at the top of `:root` in the global stylesheet, and every component follows: `--font-heading` (+ `--heading-weight`, `--heading-tracking`), `--font-body`, `--font-code`, `--primary` and `--brand` (in `:root` and `.dark`; set `--primary-foreground` to something readable on it), `--control-radius` (buttons, inputs), `--surface-radius` (cards, menus), `--text-scale` (1 = default).

### 5. Motion and accessibility

- Timings come from `@/lib/motion`. Menus and popovers use `animate-pop-in` and `animate-pop-out`; state changes use Motion (`motion/react`). Animate transform and opacity only. Wrap the app in `<MotionConfig reducedMotion="user">`.
- Keep Radix keyboard and screen-reader support: label icon-only buttons, keep focus rings, never remove roles.

### 6. Before you finish

- Every color, radius, shadow and timing is a token.
- Every piece of UI that exists in opendraft uses the opendraft component, with your real data passed in.
- It works in light and dark and from 360px wide.
- Pages share one width (`PageContainer`) and one header (`PageHeader`); forms use `Field`.
