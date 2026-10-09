# Radio Group

Single choice from a set, with a spring-in indicator.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/radio-group
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
```

## Dependencies

- npm: `radix-ui`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
function RadioGroup(props: React.ComponentProps<typeof RadioGroupPrimitive.Root>)

function RadioGroupItem(props: React.ComponentProps<typeof RadioGroupPrimitive.Item>)
```

## Example

```tsx
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="balanced">
      {[
        ["fast", "Fast", "Quick answers for simple tasks"],
        ["balanced", "Balanced", "Good default for most work"],
        ["deep", "Deep thinking", "Slower, for hard problems"],
      ].map(([value, label, hint]) => (
        <div key={value} className="flex items-start gap-3">
          <RadioGroupItem value={value} id={value} className="mt-0.5" />
          <Label htmlFor={value} className="grid gap-1">
            {label}
            <span className="text-xs font-normal text-muted-foreground">
              {hint}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/radio-group. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
