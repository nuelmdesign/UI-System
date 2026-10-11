# Code Reveal

Code backdrop that appears under the pointer, with a slower glow trailing behind.

Category: Motion

## Install

```bash
npx shadcn@latest add @opendraft/code-reveal
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { CodeReveal } from "@/components/motion/code-reveal"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
type CodeRevealProps = React.ComponentProps<"div"> & {
  /** The code to hide. Plain text with newlines. */
  code: string
  /** Radius in px of the bright spot under the cursor. */
  radius?: number
  /**
   * Where the code sits. "sides" keeps it out of the middle column so the
   * headline stays clear; "full" fills the whole area.
   */
  area?: "sides" | "full"
}
```

## Example

```tsx
import { CodeReveal } from "@/components/motion/code-reveal"

const CODE = `import { Button } from "@/components/ui/button"

:root {
  --primary: var(--blue-600);
  --control-radius: 2px;
}

// move the pointer over this panel
export function Save() {
  return <Button variant="ink">Save</Button>
}`

export default function CodeRevealDemo() {
  return (
    <div className="relative grid h-72 w-full place-items-center overflow-hidden border bg-card">
      <CodeReveal code={CODE} area="full" radius={120} />
      <p className="relative eyebrow text-muted-foreground">Move your cursor</p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/code-reveal. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
