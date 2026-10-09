import { BlurText } from "@/components/motion/blur-text"

export default function BlurTextDemo() {
  return (
    <div className="grid gap-4">
      <BlurText
        as="h2"
        text="Text that arrives, word by word."
        className="heading text-4xl"
      />
      <BlurText
        by="char"
        delay={0.6}
        text="Or one character at a time."
        className="text-muted-foreground"
      />
    </div>
  )
}
