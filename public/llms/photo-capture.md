# Photo Capture

Take or pick photos with thumbnails, remove, a max count and optional captions.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/photo-capture
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { PhotoCapture } from "@/components/ui/photo-capture"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/input`

## Props and types

```ts
type CapturedPhoto = {
  id: string
  file: File
  caption: string
}

type PhotoCaptureLabels = {
  /** Visible label above the control. */
  label: string
  /** Button that opens the device camera. */
  take: string
  /** Button that opens the file picker. */
  choose: string
  /** Shown while there are no photos. */
  empty: string
  captionLabel: string
  captionPlaceholder: string
  /** Prefix of the remove button's accessible name, followed by the file name. */
  remove: string
  /** Shown when `max` is reached. */
  limitReached: string
  /** Live announcement after adding photos. */
  added: string
  /** Live announcement after removing a photo. */
  removed: string
}

type PhotoCaptureProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "children"
> & {
  /** Maximum number of photos. Further picks are ignored and the buttons disable. */
  max?: number
  /** Show a caption field under each photo. */
  captions?: boolean
  /** Which camera to prefer on phones. */
  facing?: "environment" | "user"
  /** Same syntax as the input `accept` attribute. */
  accept?: string
  disabled?: boolean
  /** Fires on add, remove and caption edits. `files` is the plain list; `photos` carries captions. */
  onChange?: (files: File[], photos: CapturedPhoto[]) => void
  labels?: Partial<PhotoCaptureLabels>
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/photo-capture. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
