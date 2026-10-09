## How to build with opendraft

You are building a React interface with the opendraft design system. Follow these rules. They matter more than your own taste.

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

4. Install each component you use, by name:

```bash
npx shadcn@latest add @opendraft/button @opendraft/card @opendraft/prompt-bar
```

5. Load three fonts and expose them as CSS variables: Geist as `--font-geist`, Geist Mono as `--font-geist-mono`, Newsreader as `--font-newsreader`. In Next.js use `next/font/google`.
6. Wrap the app once so motion respects the user's "reduce motion" setting:

```tsx
import { MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

### 2. Use components before writing your own

- Check the component list below before building any UI. If a component fits, install and use it, even if you'd only use part of it.
- Import from where the CLI installs them: `@/components/ui/*` for core pieces, `@/components/motion/*` for motion pieces, `@/components/agents/*` for AI and data pieces.
- Compose screens from components. Don't copy a component's internals into a page.
- Only write a new component when nothing fits. Build it from the existing parts and follow the rules below.

### 3. Style only with tokens

Never hard-code colors, shadows, radii, easings or spring values. Use these Tailwind classes, which read the theme tokens:

| Purpose | Use |
|---|---|
| Page background / text | `bg-background`, `text-foreground` |
| Cards and panels | `bg-card`, `border` (a hairline) |
| Quiet areas, inputs, wells | `bg-muted`, `bg-surface` |
| Secondary text | `text-muted-foreground` |
| Hover background | `bg-accent` |
| Primary action | `bg-primary text-primary-foreground` (blue) |
| Accent text, links, focus strokes | `text-brand`, `border-brand` |
| Solid black buttons and bands | `bg-ink text-ink-foreground` (inverts in dark mode) |
| Status | `text-success`, `text-warning`, `text-destructive` (tints: `bg-success/10`, etc.) |
| Lines | `border-border`, `border-input` |
| Floating layers only (menus, popovers, dialogs) | `bg-popover shadow-md` |
| Extra blues for charts and textures | `bg-blue-50` … `bg-blue-950` |

Don't use Tailwind's palette colors (`bg-gray-100`, `text-emerald-600`, …) and don't add `dark:` color twins. The tokens already switch between light and dark.

### 4. The look

- **Square corners.** Radius is 0 to 6px: `rounded-md` for controls, `rounded-lg` at most for cards. Use `rounded-full` only for avatars, status dots and spinners.
- **Hairlines over shadows.** Structure comes from 1px borders. Shadows are only for things that float above the page.
- **Blue is the primary color.** Use it for the main action and focus. Keep everything else neutral.
- **Type.** Headings use `font-display` (Newsreader, `font-light`, tight tracking). Interface text uses the default sans (Geist). Labels, counts and metadata use `font-mono`; small uppercase section labels use the `eyebrow` utility.
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

- Every color, radius, shadow and timing comes from a token.
- Every piece of UI that exists in opendraft uses the opendraft component.
- The screen works in both light and dark mode.
- Headings use `font-display`; nothing else does.
