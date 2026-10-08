import { Marquee } from "@/components/motion/marquee"

const STACK = [
  "shadcn/ui",
  "Radix",
  "Motion",
  "Tailwind CSS",
  "Shiki",
  "Next.js",
  "Geist",
]

export default function MarqueeDemo() {
  return (
    <Marquee duration={25} gap="3rem" className="w-full py-2">
      {STACK.map((name) => (
        <span
          key={name}
          className="font-display text-2xl text-muted-foreground"
        >
          {name}
        </span>
      ))}
    </Marquee>
  )
}
