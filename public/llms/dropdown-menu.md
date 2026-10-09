# Dropdown Menu

Menu with shortcuts, checkbox items and sub-menus.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/dropdown-menu
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
```

## Dependencies

- npm: `radix-ui`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>)

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>)

function DropdownMenuContent(props: React.ComponentProps<typeof DropdownMenuPrimitive.Content>)

function DropdownMenuGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.Group>)

function DropdownMenuLabel(props: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
})

function DropdownMenuItem(props: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
})

function DropdownMenuCheckboxItem(props: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>)

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>)

function DropdownMenuRadioItem(props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>)

function DropdownMenuSeparator(props: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>)

function DropdownMenuShortcut(props: React.ComponentProps<"span">)

function DropdownMenuSub(props: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>)

function DropdownMenuSubTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
})

function DropdownMenuSubContent(props: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>)
```

## Example

```tsx
"use client"

import * as React from "react"
import { CreditCard, LogOut, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuDemo() {
  const [digest, setDigest] = React.useState(true)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>
          <User /> Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard /> Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Settings /> Settings
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>General</DropdownMenuItem>
            <DropdownMenuItem>Security</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={digest} onCheckedChange={setDigest}>
          Weekly digest
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/dropdown-menu. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
