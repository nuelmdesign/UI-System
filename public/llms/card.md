# Card

Bordered surface with header, action, content and footer slots.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/card
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "@/components/ui/card"
```

## Dependencies

- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
function Card(props: React.ComponentProps<"div">)

function CardHeader(props: React.ComponentProps<"div">)

function CardFooter(props: React.ComponentProps<"div">)

function CardTitle(props: React.ComponentProps<"div">)

function CardAction(props: React.ComponentProps<"div">)

function CardDescription(props: React.ComponentProps<"div">)

function CardContent(props: React.ComponentProps<"div">)
```

## Example

```tsx
import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardDescription>Monthly recurring revenue</CardDescription>
        <CardTitle className="heading text-4xl">$48,210</CardTitle>
        <CardAction>
          <Badge variant="success" dot>
            +12.4%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Up from $42,890 last month, driven by 38 new team plans.
      </CardContent>
      <CardFooter className="justify-end border-t pt-6">
        <Button variant="ghost" size="sm">
          View report <ArrowUpRight />
        </Button>
      </CardFooter>
    </Card>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/card. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
