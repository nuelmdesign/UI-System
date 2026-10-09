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
