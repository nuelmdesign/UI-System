# Dropzone

Drag-and-drop or click-to-browse file area with size, type and count validation, camera capture and a file list with progress. No upload logic.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/dropzone
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { Dropzone, DropzoneFileList, FileListItem } from "@/components/ui/dropzone"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/progress`

## Props and types

```ts
type DropzoneRejectionReason =
  "file-too-large" | "file-invalid-type" | "too-many-files"

type DropzoneRejection = { file: File; reason: DropzoneRejectionReason }

type DropzoneFile = {
  id: string
  name: string
  size: number
  /** Upload progress, 0-100. Omit to hide the bar. */
  progress?: number
  /** Per-file error text. */
  error?: string
}

type DropzoneProps = Omit<
  React.ComponentProps<"div">,
  "onDrop" | "children"
> & {
  /** Same syntax as the input `accept` attribute. */
  accept?: string
  multiple?: boolean
  /** Maximum size per file, in bytes. */
  maxSize?: number
  maxFiles?: number
  /** Passes through to the input for phone camera capture. */
  capture?: boolean | "user" | "environment"
  disabled?: boolean
  onFiles?: (files: File[]) => void
  onReject?: (rejections: DropzoneRejection[]) => void
  /** Controlled list of files to render under the area. */
  files?: DropzoneFile[]
  onRemove?: (file: DropzoneFile) => void
  /** Custom prompt. Defaults to a generic drag or browse message. */
  children?: React.ReactNode
  /** Accessible name for the file input. */
  "aria-label"?: string
}

function FileListItem(props: {
  file: DropzoneFile
  onRemove?: (file: DropzoneFile) => void
  className?: string
})
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/dropzone. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
