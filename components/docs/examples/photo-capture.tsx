"use client"

import { PhotoCapture } from "@/components/ui/photo-capture"

export default function PhotoCaptureDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-8 sm:grid-cols-2">
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Site inspection</h3>
        <PhotoCapture
          captions
          max={6}
          labels={{
            label: "Evidence photos",
            empty: "Add photos of the defect",
            captionPlaceholder: "What does this show?",
          }}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Parcel condition</h3>
        <PhotoCapture
          max={3}
          labels={{
            label: "Delivery photos",
            take: "Photo of parcel",
            choose: "Pick from gallery",
            empty: "No delivery photos",
          }}
        />
      </section>
    </div>
  )
}
