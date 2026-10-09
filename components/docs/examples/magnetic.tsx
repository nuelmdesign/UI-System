import { Magnetic } from "@/components/motion/magnetic"
import { Button } from "@/components/ui/button"

export default function MagneticDemo() {
  return (
    <Magnetic strength={0.4}>
      <Button size="lg" caps>
        Hover near me
      </Button>
    </Magnetic>
  )
}
