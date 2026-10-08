import { Loader, type LoaderVariant } from "@/components/motion/loader"

const VARIANTS: LoaderVariant[] = [
  "spinner",
  "dots",
  "bars",
  "dot-matrix",
  "dither",
  "morph",
  "comet",
  "metaballs",
  "newton",
  "helix",
  "ascii",
  "ascii-braille",
  "ascii-blocks",
  "scramble",
  "percent",
]

export default function LoaderDemo() {
  return (
    <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5">
      {VARIANTS.map((variant) => (
        <div
          key={variant}
          className="flex h-24 min-w-0 flex-col items-center justify-center gap-3 bg-muted/50"
        >
          <Loader variant={variant} size={28} label={variant} />
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            {variant}
          </span>
        </div>
      ))}
    </div>
  )
}
