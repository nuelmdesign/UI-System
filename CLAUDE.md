@AGENTS.md

# nuelm/ui conventions

- Tokens live in `app/globals.css`; motion timings live in `lib/motion.ts`. Never hard-code colors, shadows, easings or spring values in components. Use the tokens.
- Keep shadcn token names (`background`, `primary`, `muted`, …) so third-party shadcn/beUI components stay compatible. Extra tokens: `brand`, `surface`, `success`, `warning`.
- Components follow shadcn style: function components, `data-slot` attributes, `cn()` for class merging, CVA for variants, Radix (`radix-ui` package) for behavior.
- Prefer CSS animation (`animate-pop-in` / `animate-pop-out`) for popovers, menus and tooltips; use Motion for state changes (layout, springs, enter/exit).
- New component checklist: add the file, register it in `scripts/build-registry.mjs`, add a specimen to `components/site/showcase.tsx`, run `pnpm build`.
