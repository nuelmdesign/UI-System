# Tabs

Tabs with a sliding indicator, in pill or underline style.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/tabs
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
```

## Dependencies

- npm: `radix-ui`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
type TabsVariant = "pill" | "underline"

function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: TabsVariant
})

function TabsList(props: React.ComponentProps<typeof TabsPrimitive.List>)

function TabsTrigger(props: React.ComponentProps<typeof TabsPrimitive.Trigger>)

function TabsContent(props: React.ComponentProps<typeof TabsPrimitive.Content>)
```

## Example

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDemo() {
  return (
    <div className="grid w-full max-w-md gap-8">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-sm text-muted-foreground">
          The indicator slides between tabs with a spring from lib/motion.
        </TabsContent>
        <TabsContent value="activity" className="text-sm text-muted-foreground">
          12 events in the last 24 hours.
        </TabsContent>
        <TabsContent value="settings" className="text-sm text-muted-foreground">
          Workspace settings live here.
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="all" variant="underline">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/tabs. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
