# Switch

On / off toggle with a spring-driven thumb.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/switch
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Switch } from "@/components/ui/switch"
```

## Dependencies

- npm: `radix-ui`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
function Switch(props: React.ComponentProps<typeof SwitchPrimitive.Root>)
```

## Example

```tsx
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchDemo() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications">Email notifications</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="digest" />
        <Label htmlFor="digest">Weekly digest</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="locked" disabled />
        <Label htmlFor="locked">Managed by your admin</Label>
      </div>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/switch. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
