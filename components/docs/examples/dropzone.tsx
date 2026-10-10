"use client"

import * as React from "react"
import { CameraIcon } from "lucide-react"

import { Dropzone, type DropzoneFile } from "@/components/ui/dropzone"

export default function DropzoneDemo() {
  const [files, setFiles] = React.useState<DropzoneFile[]>([
    { id: "seed-1", name: "dock-door-4.jpg", size: 2_400_000, progress: 100 },
  ])
  const [counter, setCounter] = React.useState(0)

  return (
    <div className="grid w-full max-w-xl gap-8">
      <div className="grid gap-3">
        <p className="eyebrow">Shipment photos</p>
        <Dropzone
          multiple
          accept="image/png, image/jpeg"
          maxSize={5 * 1024 * 1024}
          maxFiles={4}
          aria-label="Upload shipment photos"
          files={files}
          onRemove={(f) => setFiles((p) => p.filter((x) => x.id !== f.id))}
          onFiles={(added) => {
            const next = added.map((f, i) => ({
              id: `file-${counter + i}`,
              name: f.name,
              size: f.size,
              progress: 100,
            }))
            setCounter((c) => c + added.length)
            setFiles((p) => [...p, ...next])
          }}
        />
      </div>
      <div className="grid gap-3">
        <p className="eyebrow">Proof of delivery</p>
        <Dropzone
          accept="image/*"
          capture="environment"
          aria-label="Take a delivery photo"
        >
          <CameraIcon aria-hidden className="size-5 text-muted-foreground" />
          <span className="text-sm font-medium">Take or choose a photo</span>
          <span className="text-xs text-muted-foreground">
            Opens the camera on phones.
          </span>
        </Dropzone>
      </div>
      <div className="grid gap-3">
        <p className="eyebrow">Disabled</p>
        <Dropzone disabled aria-label="Upload disabled" />
      </div>
    </div>
  )
}
