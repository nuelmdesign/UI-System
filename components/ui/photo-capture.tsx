"use client"

import * as React from "react"
import { Camera, ImagePlus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

const DEFAULT_LABELS: PhotoCaptureLabels = {
  label: "Photos",
  take: "Take photo",
  choose: "Choose photos",
  empty: "No photos added yet",
  captionLabel: "Caption",
  captionPlaceholder: "Add a caption",
  remove: "Remove",
  limitReached: "Maximum number of photos reached",
  added: "Photo added",
  removed: "Photo removed",
}

type Item = CapturedPhoto & { url: string }

function PhotoCapture({
  max,
  captions = false,
  facing = "environment",
  accept = "image/*",
  disabled = false,
  onChange,
  labels: labelsProp,
  className,
  ...props
}: PhotoCaptureProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const [items, setItems] = React.useState<Item[]>([])
  const [announce, setAnnounce] = React.useState("")
  const latest = React.useRef<Item[]>([])
  const counter = React.useRef(0)
  const labelId = React.useId()

  // Revoke every remaining object URL when the component unmounts.
  React.useEffect(() => {
    return () => {
      for (const item of latest.current) URL.revokeObjectURL(item.url)
    }
  }, [])

  const commit = (next: Item[]) => {
    latest.current = next
    setItems(next)
    onChange?.(
      next.map((i) => i.file),
      next.map(({ id, file, caption }) => ({ id, file, caption }))
    )
  }

  const add = (list: FileList | null) => {
    if (!list || disabled) return
    const room =
      max != null ? Math.max(max - latest.current.length, 0) : Infinity
    const picked = Array.from(list)
      .filter((f) => f.type.startsWith("image/") || accept !== "image/*")
      .slice(0, room)
    if (!picked.length) return
    const created: Item[] = picked.map((file) => ({
      id: `photo-${++counter.current}`,
      file,
      caption: "",
      url: URL.createObjectURL(file),
    }))
    setAnnounce(labels.added)
    commit([...latest.current, ...created])
  }

  const remove = (id: string) => {
    const target = latest.current.find((i) => i.id === id)
    if (target) URL.revokeObjectURL(target.url)
    setAnnounce(labels.removed)
    commit(latest.current.filter((i) => i.id !== id))
  }

  const setCaption = (id: string, caption: string) =>
    commit(latest.current.map((i) => (i.id === id ? { ...i, caption } : i)))

  const full = max != null && items.length >= max
  const blocked = disabled || full

  return (
    <div
      data-slot="photo-capture"
      data-state={items.length ? "filled" : "empty"}
      className={cn(
        "@container/photo-capture flex w-full flex-col gap-3",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span id={labelId} className="eyebrow text-muted-foreground">
          {labels.label}
        </span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {max != null ? `${items.length} / ${max}` : items.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <PickButton
          capture={facing}
          accept={accept}
          disabled={blocked}
          onFiles={add}
          icon={<Camera aria-hidden />}
          variant="default"
        >
          {labels.take}
        </PickButton>
        <PickButton
          accept={accept}
          multiple
          disabled={blocked}
          onFiles={add}
          icon={<ImagePlus aria-hidden />}
          variant="outline"
        >
          {labels.choose}
        </PickButton>
      </div>
      {full && (
        <p className="text-xs text-muted-foreground">{labels.limitReached}</p>
      )}

      {items.length === 0 ? (
        <p
          data-slot="photo-capture-empty"
          className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground"
        >
          {labels.empty}
        </p>
      ) : (
        <ul
          aria-labelledby={labelId}
          data-slot="photo-capture-list"
          className="grid grid-cols-2 gap-3 @md/photo-capture:grid-cols-3"
        >
          {items.map((item) => (
            <li
              key={item.id}
              data-slot="photo-capture-item"
              className="flex min-w-0 flex-col gap-2 rounded-md border bg-card p-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.caption || item.file.name}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(item.id)}
                  aria-label={`${labels.remove} ${item.file.name}`}
                  className="absolute top-1 right-1 inline-flex size-7 items-center justify-center rounded-sm border bg-background text-foreground outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring disabled:opacity-50"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
              {captions ? (
                <Input
                  value={item.caption}
                  disabled={disabled}
                  aria-label={`${labels.captionLabel}: ${item.file.name}`}
                  placeholder={labels.captionPlaceholder}
                  className="h-8 text-xs"
                  onChange={(e) => setCaption(item.id, e.target.value)}
                />
              ) : (
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {item.file.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  )
}

function PickButton({
  capture,
  accept,
  multiple,
  disabled,
  onFiles,
  icon,
  variant,
  children,
}: {
  capture?: "environment" | "user"
  accept: string
  multiple?: boolean
  disabled: boolean
  onFiles: (files: FileList | null) => void
  icon: React.ReactNode
  variant: "default" | "outline"
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={ref}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        accept={accept}
        capture={capture}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          onFiles(e.target.files)
          e.target.value = ""
        }}
      />
      <Button
        type="button"
        size="sm"
        variant={variant}
        disabled={disabled}
        onClick={() => ref.current?.click()}
      >
        {icon}
        {children}
      </Button>
    </>
  )
}

export { PhotoCapture, DEFAULT_LABELS as PHOTO_CAPTURE_LABELS }
export type { PhotoCaptureProps, PhotoCaptureLabels, CapturedPhoto }
