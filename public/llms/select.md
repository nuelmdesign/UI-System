# Select

Dropdown select with groups and labels.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/select
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
```

## Dependencies

- npm: `radix-ui`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>)

function SelectContent(props: React.ComponentProps<typeof SelectPrimitive.Content>)

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>)

function SelectItem(props: React.ComponentProps<typeof SelectPrimitive.Item>)

function SelectLabel(props: React.ComponentProps<typeof SelectPrimitive.Label>)

function SelectScrollDownButton(props: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>)

function SelectScrollUpButton(props: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>)

function SelectSeparator(props: React.ComponentProps<typeof SelectPrimitive.Separator>)

function SelectTrigger(props: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
})

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>)
```

## Example

```tsx
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectDemo() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label>Plan</Label>
      <Select defaultValue="pro">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Plans</SelectLabel>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/select. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
