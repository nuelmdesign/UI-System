import { Reveal } from "@/components/motion/reveal"

const STEPS = ["Tokens", "Components", "Motion"]

export default function RevealDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {STEPS.map((step, i) => (
        <Reveal key={step} delay={i * 0.12} className="border bg-card p-5">
          <p className="eyebrow text-muted-foreground">0{i + 1}</p>
          <p className="mt-3 font-display text-2xl font-light">{step}</p>
        </Reveal>
      ))}
    </div>
  )
}
