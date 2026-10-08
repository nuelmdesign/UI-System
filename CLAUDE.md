@AGENTS.md

# nuelm/ui conventions

- Tokens live in `app/globals.css`; motion timings live in `lib/motion.ts`. Never hard-code colors, shadows, easings or spring values in components. Use the tokens.
- Keep shadcn token names (`background`, `primary`, `muted`, …) so third-party shadcn/beUI components stay compatible. Extra tokens: `brand` (accent text/strokes), `ink` (solid black buttons and bands, inverts in dark), `surface`, `success`, `warning`, and the `--blue-50…950` scale.
- Visual direction: square corners (radius 0–6px; `rounded-full` only for avatars and dots), hairline borders over shadows, blue as primary. Headings use `font-display` (Newsreader, light weight); labels use the `eyebrow` utility (mono uppercase); textures use `bg-dots` or `PixelField`. A section can go dark in either theme by adding the `dark` class to it.
- Components follow shadcn style: function components, `data-slot` attributes, `cn()` for class merging, CVA for variants, Radix (`radix-ui` package) for behavior.
- Prefer CSS animation (`animate-pop-in` / `animate-pop-out`) for popovers, menus and tooltips; use Motion for state changes (layout, springs, enter/exit).
- New component checklist: add the file, register it in `scripts/build-registry.mjs`, add a specimen to `components/site/showcase.tsx`, run `pnpm build`.
- Porting from beUI (github.com/starc007/ui-components, MIT): keep the credit header, map `@/lib/ease` to `@/lib/motion` (EASE_OUT→ease.out, SPRING_LAYOUT/PANEL→spring.smooth, SPRING_SWAP/PRESS→spring.snappy, local one-off springs→the closest token), swap beUI's own button/select/popover/text-shimmer for ours in `components/ui` / `components/motion`, and replace Tailwind palette colors with tokens (emerald→success, rose→destructive, blue→brand; drop the `dark:` twin). Run `pnpm format` on ported files.
