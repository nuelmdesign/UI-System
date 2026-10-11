"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export type GalleryImage = {
  src: string
  /** Required. Describe the image; use "" only for purely decorative ones. */
  alt: string
  /** Smaller source for the thumbnail strip. Defaults to `src`. */
  thumb?: string
}

export type ImageGalleryLabels = {
  previous: string
  next: string
  zoom: string
  /** Lightbox title (screen readers). */
  lightbox: string
  lightboxDescription: string
  /** Text for the counter, e.g. "2 / 5". */
  counter: (current: number, total: number) => string
  thumbnail: (current: number, total: number) => string
  empty: string
  toggleZoom: string
}

export const DEFAULT_IMAGE_GALLERY_LABELS: ImageGalleryLabels = {
  previous: "Previous image",
  next: "Next image",
  zoom: "Zoom image",
  lightbox: "Image viewer",
  lightboxDescription: "Use the arrow keys to move between images.",
  counter: (c, t) => `${c} / ${t}`,
  thumbnail: (c, t) => `Show image ${c} of ${t}`,
  empty: "No images",
  toggleZoom: "Toggle magnification",
}

export type ImageGalleryProps = Omit<
  React.ComponentProps<"div">,
  "children" | "onChange"
> & {
  images: GalleryImage[]
  /** Controlled index. */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** Aspect ratio of the main frame as a CSS value. Default "4 / 3". */
  aspect?: string
  /** Disable the zoom lightbox. */
  zoomable?: boolean
  labels?: Partial<ImageGalleryLabels>
}

const SWIPE_PX = 40

function useSwipe(onStep: (dir: 1 | -1) => void) {
  const start = React.useRef<{ x: number; y: number } | null>(null)
  const swiped = React.useRef(false)
  return {
    consumeSwipe() {
      const was = swiped.current
      swiped.current = false
      return was
    },
    handlers: {
      onPointerDown(e: React.PointerEvent) {
        if (e.pointerType === "mouse") return
        start.current = { x: e.clientX, y: e.clientY }
        swiped.current = false
      },
      onPointerUp(e: React.PointerEvent) {
        const s = start.current
        start.current = null
        if (!s) return
        const dx = e.clientX - s.x
        const dy = e.clientY - s.y
        if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
          swiped.current = true
          onStep(dx < 0 ? 1 : -1)
        }
      },
      onPointerCancel() {
        start.current = null
      },
    },
  }
}

function ImageGallery({
  images,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  aspect = "4 / 3",
  zoomable = true,
  labels: labelsProp,
  className,
  ...props
}: ImageGalleryProps) {
  const labels = { ...DEFAULT_IMAGE_GALLERY_LABELS, ...labelsProp }
  const [internal, setInternal] = React.useState(defaultIndex)
  const [open, setOpen] = React.useState(false)
  const [magnified, setMagnified] = React.useState(false)
  const total = images.length
  const raw = indexProp ?? internal
  const index = total === 0 ? 0 : Math.min(Math.max(raw, 0), total - 1)
  const thumbRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const go = (next: number) => {
    if (total === 0) return
    const wrapped = (next + total) % total
    setInternal(wrapped)
    setMagnified(false)
    onIndexChange?.(wrapped)
  }
  const step = (dir: 1 | -1) => go(index + dir)

  const mainSwipe = useSwipe(step)
  const boxSwipe = useSwipe(step)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      step(1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      step(-1)
    } else if (e.key === "Home") {
      e.preventDefault()
      go(0)
    } else if (e.key === "End") {
      e.preventDefault()
      go(total - 1)
    }
  }

  const onThumbKeyDown = (e: React.KeyboardEvent, i: number) => {
    onKeyDown(e)
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const next = (i + (e.key === "ArrowRight" ? 1 : -1) + total) % total
      thumbRefs.current[next]?.focus()
    }
  }

  if (total === 0) {
    return (
      <div
        data-slot="image-gallery"
        className={cn(
          "flex items-center justify-center rounded-lg border bg-surface p-8 text-sm text-muted-foreground",
          className
        )}
        style={{ aspectRatio: aspect }}
        {...props}
      >
        {labels.empty}
      </div>
    )
  }

  const current = images[index]

  return (
    <div
      data-slot="image-gallery"
      className={cn("flex min-w-0 flex-col gap-3", className)}
      {...props}
    >
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={current.alt || labels.lightbox}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="group/gallery relative overflow-hidden rounded-lg border bg-surface outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        style={{ aspectRatio: aspect }}
      >
        <button
          type="button"
          tabIndex={-1}
          disabled={!zoomable}
          aria-label={zoomable ? labels.zoom : undefined}
          onClick={() => {
            if (mainSwipe.consumeSwipe()) return
            setOpen(true)
          }}
          {...mainSwipe.handlers}
          className={cn(
            "block size-full touch-pan-y outline-none",
            zoomable ? "cursor-zoom-in" : "cursor-default"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt}
            draggable={false}
            className="size-full object-contain select-none"
          />
        </button>

        {total > 1 && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={labels.previous}
              onClick={() => step(-1)}
              className="absolute top-1/2 left-2 -translate-y-1/2"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={labels.next}
              onClick={() => step(1)}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              <ChevronRight />
            </Button>
          </>
        )}

        <div className="pointer-events-none absolute right-2 bottom-2 flex items-center gap-1.5 rounded-sm border bg-background px-1.5 py-0.5 font-mono text-xs">
          {zoomable && <Expand aria-hidden className="size-3" />}
          <span aria-live="polite" data-slot="image-gallery-counter">
            {labels.counter(index + 1, total)}
          </span>
        </div>
      </div>

      {total > 1 && (
        <ul
          data-slot="image-gallery-thumbs"
          className="-m-1 flex gap-2 overflow-x-auto p-1"
        >
          {images.map((img, i) => (
            <li key={`${img.src}-${i}`} className="shrink-0">
              <button
                type="button"
                ref={(el) => {
                  thumbRefs.current[i] = el
                }}
                aria-label={labels.thumbnail(i + 1, total)}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                onKeyDown={(e) => onThumbKeyDown(e, i)}
                className={cn(
                  "block size-16 overflow-hidden rounded-md border bg-surface outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                  i === index
                    ? "border-brand ring-1 ring-brand"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumb ?? img.src}
                  alt=""
                  draggable={false}
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoomable && (
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v)
            if (!v) setMagnified(false)
          }}
        >
          <DialogContent onKeyDown={onKeyDown} className="max-w-5xl gap-2 p-2">
            <DialogTitle className="sr-only">{labels.lightbox}</DialogTitle>
            <DialogDescription className="sr-only">
              {labels.lightboxDescription}
            </DialogDescription>
            <div
              {...boxSwipe.handlers}
              className={cn(
                "relative h-[70vh] touch-pan-y rounded-md bg-surface",
                magnified ? "overflow-auto" : "overflow-hidden"
              )}
            >
              <button
                type="button"
                aria-label={labels.toggleZoom}
                aria-pressed={magnified}
                onClick={() => {
                  if (boxSwipe.consumeSwipe()) return
                  setMagnified((m) => !m)
                }}
                className={cn(
                  "block outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
                  magnified
                    ? "h-[200%] w-[200%] cursor-zoom-out"
                    : "size-full cursor-zoom-in"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.src}
                  alt={current.alt}
                  draggable={false}
                  className="size-full object-contain select-none"
                />
              </button>
              {total > 1 && !magnified && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label={labels.previous}
                    onClick={() => step(-1)}
                    className="absolute top-1/2 left-2 -translate-y-1/2"
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label={labels.next}
                    onClick={() => step(1)}
                    className="absolute top-1/2 right-2 -translate-y-1/2"
                  >
                    <ChevronRight />
                  </Button>
                </>
              )}
            </div>
            <p
              aria-live="polite"
              className="text-center font-mono text-xs text-muted-foreground"
            >
              {labels.counter(index + 1, total)}
              {current.alt ? ` - ${current.alt}` : ""}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export { ImageGallery }
