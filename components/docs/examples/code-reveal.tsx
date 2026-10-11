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
