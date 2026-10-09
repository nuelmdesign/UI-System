# Dialog

Modal dialog that springs in, with header, body and footer slots.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/dialog
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
```

## Dependencies

- npm: `radix-ui`, `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>)

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>)

function DialogContent(props: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
})

function DialogDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>)

function DialogFooter(props: React.ComponentProps<"div">)

function DialogHeader(props: React.ComponentProps<"div">)

function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>)

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>)
```

## Example

```tsx
"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite teammates</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammates</DialogTitle>
          <DialogDescription>
            They&apos;ll get an email with a link to join your workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="invite">Email addresses</Label>
          <Input id="invite" placeholder="ada@example.com, alan@example.com" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => toast.success("Invites sent")}>
              Send invites
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

Live docs: https://opendraft-ui.vercel.app/docs/dialog. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
