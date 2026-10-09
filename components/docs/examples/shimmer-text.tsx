import { ShimmerText } from "@/components/motion/shimmer-text"

export default function ShimmerTextDemo() {
  return (
    <div className="grid gap-3">
      <ShimmerText className="text-lg font-medium">
        Thinking through your request…
      </ShimmerText>
      <ShimmerText duration={3.5} className="text-sm">
        Searching 14 sources
      </ShimmerText>
    </div>
  )
}
