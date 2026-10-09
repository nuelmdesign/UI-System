import { SpotlightCard } from "@/components/motion/spotlight-card"

export default function SpotlightCardDemo() {
  return (
    <SpotlightCard className="w-full max-w-sm">
      <p className="mb-4 eyebrow text-muted-foreground">Spotlight</p>
      <h3 className="heading text-2xl">Move your cursor over me</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The border and surface follow the pointer with a blue glow.
      </p>
    </SpotlightCard>
  )
}
