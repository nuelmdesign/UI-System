import { PixelField } from "@/components/motion/pixel-field"

export default function PixelFieldDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      {(["mosaic", "matrix", "equalizer"] as const).map((variant) => (
        <div key={variant} className="grid gap-2">
          <PixelField variant={variant} className="h-40 border" />
          <p className="eyebrow text-muted-foreground">{variant}</p>
        </div>
      ))}
    </div>
  )
}
