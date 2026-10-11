import { ImageGallery, type GalleryImage } from "@/components/ui/image-gallery"

function art(label: string, shade: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="hsl(220 8% ${shade}%)"/><text x="400" y="306" font-family="monospace" font-size="32" text-anchor="middle" fill="hsl(220 8% 40%)">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const apparel: GalleryImage[] = ["Front", "Back", "Detail", "Worn"].map(
  (v, i) => ({
    src: art(`Overshirt - ${v}`, 92 - i * 5),
    alt: `Linen overshirt, ${v.toLowerCase()} view`,
  })
)

const property: GalleryImage[] = ["Living room", "Kitchen", "Bedroom"].map(
  (v, i) => ({ src: art(v, 88 - i * 5), alt: `${v} of the apartment` })
)

export default function ImageGalleryDemo() {
  return (
    <div className="@container grid w-full grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <h3 className="eyebrow">Apparel product</h3>
        <ImageGallery images={apparel} aspect="4 / 5" className="max-w-sm" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="eyebrow">Property listing</h3>
        <ImageGallery
          images={property}
          labels={{
            counter: (c, t) => `Photo ${c} of ${t}`,
            zoom: "Open photo viewer",
            next: "Next photo",
            previous: "Previous photo",
          }}
        />
      </div>
    </div>
  )
}
