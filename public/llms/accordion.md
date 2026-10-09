# Accordion

Stacked sections that expand with a spring-driven height animation.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/accordion
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
```

## Dependencies

- npm: `radix-ui`, `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>)

function AccordionItem(props: React.ComponentProps<typeof AccordionPrimitive.Item>)

function AccordionTrigger(props: React.ComponentProps<typeof AccordionPrimitive.Trigger>)

function AccordionContent(props: React.ComponentProps<typeof AccordionPrimitive.Content>)
```

## Example

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="a"
      className="w-full max-w-md"
    >
      <AccordionItem value="a">
        <AccordionTrigger>Can I use this in any project?</AccordionTrigger>
        <AccordionContent>
          Yes. Components install as source, so they work in any React project
          with Tailwind.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>
          Does it work with shadcn components?
        </AccordionTrigger>
        <AccordionContent>
          The token names match shadcn&apos;s, so stock shadcn components pick
          up this theme.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>What about reduced motion?</AccordionTrigger>
        <AccordionContent>
          Motion respects the OS setting everywhere.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/accordion. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
