# opendraft

A personal design system for everything I build. **shadcn structure, Motion feel, one set of tokens.**

- **Structure & accessibility:** [Radix](https://www.radix-ui.com/) primitives, shadcn-style APIs
- **Motion:** [Motion](https://motion.dev/) springs and easings from one shared file, in the spirit of [beUI](https://beui.dev)
- **Look:** editorial-technical. Square corners, hairline borders, a blue primary scale (periwinkle to royal), Newsreader display serif with Geist and Geist Mono, and pixel textures (`PixelField`)
- **Distribution:** a public shadcn registry: components install as source you own

## Using it in a project

Add the registry to your project's `components.json`:

```json
{
  "registries": {
    "@opendraft": "https://opendraft-ui.vercel.app/r/{name}.json"
  }
}
```

Then:

```bash
npx shadcn add @opendraft/theme      # tokens (do this first)
npx shadcn add @opendraft/button     # any single component
npx shadcn add @opendraft/all        # everything
```

> The registry URL assumes this repo is deployed to Vercel as `opendraft-ui`. If you deploy elsewhere, update the URL in `components.json`.

Wrap your app once so Motion respects the OS "reduce motion" setting:

```tsx
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

## What's inside

| Layer | Files |
|---|---|
| Tokens | `app/globals.css`: color, radius, elevation, easing, keyframes (light + dark) |
| Motion tokens | `lib/motion.ts`: `spring`, `ease`, `duration`, `variants`, `stagger` |
| Core components | `components/ui/`: button, badge, input, textarea, label, card, separator, kbd, skeleton, avatar, switch, checkbox, tabs, accordion, dialog, dropdown-menu, select, popover, tooltip, sonner |
| Motion components | `components/motion/`: animated-number, blur-text, shimmer-text, spotlight-card, marquee, reveal, magnetic, copy-button, preview-rail |
| AI agent components | `components/agents/`: voice-orb, message, message-bubble, message-scroller, prompt-input, streaming-response, citations, agent-disclosure |
| Hooks | `lib/hooks/`: use-dismiss, use-tap-gesture, use-hover-gesture, use-favicon |
| Showcase | `app/page.tsx` → `components/site/showcase.tsx` |

## Bringing in components from shadcn or beUI

Token names match shadcn's (`background`, `primary`, `muted`, `border`, …), so stock shadcn and beUI components pick up this theme automatically. To make one *part of the library*:

1. Install it into this repo: `npx shadcn add @beui/<name>` (or a shadcn component).
2. Replace hard-coded colors with tokens (`bg-brand`, `text-muted-foreground`, …).
3. Replace hard-coded timings with `lib/motion.ts` (`spring.snappy`, `ease.out`, …).
4. Add it to the list in `scripts/build-registry.mjs` and to the showcase.

## Deploying (Vercel)

The repo deploys with zero config: Vercel detects Next.js, and `pnpm build`
regenerates the registry before building, so `public/r/*.json` ships with the site.

1. Go to [vercel.com/new](https://vercel.com/new) and import `nuelmdesign/UI-System`.
2. Name the project **`opendraft-ui`**, so the site lands at `https://opendraft-ui.vercel.app`,
   the URL `components.json` points the `@opendraft` registry at. If that name is taken,
   pick another and update the `registries` URL in `components.json` and this README.
3. Leave the framework (Next.js), build command and output settings on their defaults.
4. Until the pull request is merged into `main`, set **Settings → Git → Production Branch**
   to `claude/wizardly-fermat-q17vrj` (or use that branch's preview URL).
5. Check it worked: `https://opendraft-ui.vercel.app/r/button.json` should return JSON.

## Development

```bash
pnpm install
pnpm dev              # showcase at http://localhost:3000
pnpm registry:build   # regenerate registry.json + public/r/*.json
pnpm build            # registry + production build
pnpm lint
pnpm format           # prettier (with Tailwind class sorting)
```

Components adapted from [beUI](https://beui.dev) (MIT) are credited in `THIRD_PARTY_NOTICES.md` and at the top of each file.
