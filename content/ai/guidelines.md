## How to build with opendraft

You are building a React interface with the opendraft design system. Follow these rules. They matter more than your own taste, but the person you're building for comes first: when they ask for their own fonts, colors or corner radius, apply them through the brand tokens in section 4.

### 1. Set up the project once

opendraft ships through a shadcn registry. Components install as source files into the project. There is no npm package to import.

Requirements: React 19, Tailwind CSS v4, TypeScript, and a shadcn `components.json`. Next.js is supported but not required.

1. If the project has no `components.json`, run `npx shadcn@latest init`.
2. Add the registry to `components.json`:

```json
{
  "registries": {
    "@opendraft": "https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/r/{name}.json"
  }
}
```

3. Install the theme first. It writes the tokens into the global stylesheet:

```bash
npx shadcn@latest add @opendraft/theme
```

4. Clean up the starter stylesheet. Projects made with `create-next-app` leave rules at the bottom of `app/globals.css` that fight the theme. Delete them:
   - the `@media (prefers-color-scheme: dark) { :root { … } }` block (dark mode here is the `dark` class, not the operating system setting)
   - the starter's `body { background: …; color: …; font-family: Arial, … }` rule (the theme sets the body styles)
   - the starter's own `:root { --background; --foreground }` values, if they remain after the theme's (the theme's must win)
5. Install each component you use, by name:

```bash
npx shadcn@latest add @opendraft/button @opendraft/card @opendraft/prompt-bar
```

6. Load three fonts and expose them as CSS variables: Geist as `--font-geist`, Geist Mono as `--font-geist-mono`, Newsreader as `--font-newsreader`. In Next.js use `next/font/google` (the starter's `--font-geist-sans` is not the same variable; rename it).
7. Dark mode is the `dark` class on `<html>`. To follow the visitor's system setting, toggle that class with a small script, or use `next-themes` with `attribute="class"`.
8. Wrap the app once so motion respects the user's "reduce motion" setting:

```tsx
import { MotionConfig } from "motion/react"

;<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

### 2. Use components before writing your own

- If the user asks for a whole screen (a dashboard, settings page, sign-in, CRM board, agent chat), check the Blocks list first. A block is a complete, working screen. Install it, then change the content through its props (it renders sample data when given none). Restyle it with tokens, not by rewriting it, and trim sections the user didn't ask for.
- Check the component list below before building any UI. If a component fits, install and use it, even if you'd only use part of it.
- Import from where the CLI installs them: `@/components/ui/*` for core pieces, `@/components/motion/*` for motion pieces, `@/components/agents/*` for AI and data pieces.
- Compose screens from components. Don't copy a component's internals into a page.
- Many components render sample content when you give them no data (ice-cream shop names, example transactions, demo prompts). Always pass the real content through their props: rows, items, labels, options, callbacks. Check the component's page for its props. Leaving the defaults in a real screen is a bug.
- Some components have a `fill` or `demo` prop. `demo` runs a self-playing walkthrough, so set `demo={false}` in a real screen. `fill` makes a scrolling area take its container's height instead of a fixed maximum, so give the container a height.
- Only write a new component when nothing fits. Build it from the existing parts and follow the rules below.

### 3. Style only with tokens

Never hard-code colors, shadows, radii, easings or spring values. Use these Tailwind classes, which read the theme tokens:

| Purpose                                         | Use                                                                                                 |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Page background / text                          | `bg-background`, `text-foreground`                                                                  |
| Cards and panels                                | `bg-card`, `border` (a hairline)                                                                    |
| Quiet areas, inputs, wells                      | `bg-muted`, `bg-surface`                                                                            |
| Secondary text                                  | `text-muted-foreground`                                                                             |
| Hover background                                | `bg-accent`                                                                                         |
| Primary action                                  | `bg-primary text-primary-foreground` (blue by default)                                              |
| Accent text, links, focus strokes               | `text-brand`, `border-brand`                                                                        |
| Solid black buttons and bands                   | `bg-ink text-ink-foreground` (inverts in dark mode)                                                 |
| Status                                          | `text-success`, `text-warning`, `text-destructive` (tints: `bg-success/10`, etc.)                   |
| Lines                                           | `border-border`, `border-input`                                                                     |
| Floating layers only (menus, popovers, dialogs) | `bg-popover shadow-md`                                                                              |
| Extra blues for charts and textures             | `bg-blue-50` … `bg-blue-950`                                                                        |
| Headings                                        | `heading` (the heading font at its weight and tracking)                                             |
| Corners                                         | `rounded-md` / `rounded-control` for controls, `rounded-lg` / `rounded-surface` for cards and menus |

Don't use Tailwind's palette colors (`bg-gray-100`, `text-emerald-600`, …) and don't add `dark:` color twins. The tokens already switch between light and dark.

### 4. The look, and making it yours

opendraft ships with a look: editorial headings, square corners, hairline borders, a blue primary. Treat it as the default. If the person asks for something different, their request wins, and you apply it by changing the brand tokens at the top of `:root` in the global stylesheet. Never restyle individual components to get a new look; change the token and every component follows.

| They ask for                                                  | Change                                                                                                                                                                                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A heading font (any Google Font, e.g. Inter)                  | `--font-heading`, plus `--heading-weight` (about 300 for light serifs like the default Newsreader, 500 to 600 for sans faces like Inter) and `--heading-tracking`                                                                                |
| A body / interface font (any Google Font, e.g. IBM Plex Sans) | `--font-body`                                                                                                                                                                                                                                    |
| A code font                                                   | `--font-code`                                                                                                                                                                                                                                    |
| A primary color (e.g. black)                                  | `--primary` and `--brand` in `:root` and in `.dark`. Set `--primary-foreground` to a color that reads on it (white on dark colors, near-black on light ones). For black, use `var(--ink)` and `var(--ink-foreground)`: they invert in dark mode. |
| Rounder buttons and inputs (e.g. 12px)                        | `--control-radius`                                                                                                                                                                                                                               |
| Rounder cards, menus and dialogs                              | `--surface-radius` (usually the same as or a little larger than `--control-radius`)                                                                                                                                                              |
| Larger or smaller text                                        | `--text-scale` (1 is the default; 1.1 makes every text size 10% larger, 0.9 10% smaller). Spacing stays the same.                                                                                                                                |

Any of the roughly 1,900 Google Fonts works. Load it with `next/font/google` (the export name replaces spaces with underscores, e.g. `IBM_Plex_Sans`; pass `variable: "--font-ibm-plex-sans"`, and `weight` for fonts that aren't variable), or with a `<link>` from fonts.google.com outside Next.js. Point the token at the variable, falling back to the family name and a generic stack so it works either way:

```css
:root {
  --font-heading:
    var(--font-inter, "Inter"), ui-sans-serif, system-ui, sans-serif;
  --font-body:
    var(--font-ibm-plex-sans, "IBM Plex Sans"), ui-sans-serif, system-ui,
    sans-serif;
  --heading-weight: 600;
  --heading-tracking: -0.03em;
  --primary: var(--ink);
  --brand: var(--ink);
  --primary-foreground: var(--ink-foreground);
  --control-radius: 12px;
  --surface-radius: 16px;
  --text-scale: 1.1;
}
```

The defaults, for anything they haven't asked to change:

- **Corners.** Controls use `rounded-md`, cards and menus `rounded-lg`; both follow the radius tokens. Use `rounded-full` only for avatars, status dots and spinners.
- **Hairlines over shadows.** Structure comes from 1px borders. Shadows are only for things that float above the page.
- **One primary color.** Use it for the main action and focus. Keep everything else neutral.
- **Type.** Headings use the `heading` utility. Interface text uses the default sans (`font-sans`, which is `--font-body`). Labels, counts and metadata use `font-mono`; small uppercase section labels use the `eyebrow` utility.
- **Texture.** Use `bg-dots` or the `PixelField` component for background texture. Don't use gradients or blobs.
- **Dark sections.** Add the `dark` class to any section to render it dark in either theme.

### 5. Motion

- Import timings from `@/lib/motion` (installed with any animated component): `spring.snappy` for presses and toggles, `spring.smooth` for panels and layout, `spring.pop` for arrivals, `ease.out` with `duration.base` for fades.
- For menus, popovers and tooltips use the CSS utilities `animate-pop-in` and `animate-pop-out`. For entrances use `animate-fade-up` and stagger with `animation-delay`.
- Use Motion (`motion/react`) for state changes: layout, enter and exit, springs.
- Animate `transform` and `opacity`, not layout properties, and keep motion short.

### 6. Accessibility

Components use Radix primitives and come with keyboard and screen-reader support. Keep it: give icon-only buttons an `aria-label`, keep visible focus rings (`focus-visible:ring-ring`), and don't remove roles or labels when you customise a component.

### 7. Before you finish

- Every color, radius, shadow and timing comes from a token, and any look the person asked for lives in the brand tokens, not in component overrides.
- Every piece of UI that exists in opendraft uses the opendraft component.
- The screen works in both light and dark mode.
- Headings use the `heading` utility; nothing else does.
