"use client"

import * as React from "react"
import { PenLine, Trash2, Undo2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SignaturePadMode = "draw" | "type"

type SignaturePadLabels = {
  /** Visible label above the pad. */
  label: string
  /** Placeholder shown while the pad is empty. */
  empty: string
  clear: string
  undo: string
  /** Confirm button, shown when `onSign` is set. */
  sign: string
  draw: string
  type: string
  typedLabel: string
  typedPlaceholder: string
  /** Accessible name of the drawing surface. */
  canvas: string
  /** Live announcement once a signature exists. */
  captured: string
  /** Live announcement after clearing. */
  cleared: string
}

type SignaturePadResult = {
  dataUrl: string
  mode: SignaturePadMode
  /** The typed name, when mode is "type". */
  name?: string
}

type SignaturePadProps = Omit<
  React.ComponentProps<"div">,
  "onChange" | "children"
> & {
  /** Called with a PNG data URL after each stroke, undo or typed change, or null when empty. */
  onChange?: (dataUrl: string | null) => void
  /** Called when the person confirms with the sign button. The button is hidden when omitted. */
  onSign?: (result: SignaturePadResult) => void
  /** Offer a typed-name alternative for keyboard and assistive-tech users. */
  allowTyped?: boolean
  disabled?: boolean
  /** Stroke width in CSS pixels. */
  strokeWidth?: number
  /** Height of the drawing surface in CSS pixels. */
  height?: number
  labels?: Partial<SignaturePadLabels>
}

const DEFAULT_LABELS: SignaturePadLabels = {
  label: "Signature",
  empty: "Sign here",
  clear: "Clear",
  undo: "Undo",
  sign: "Confirm signature",
  draw: "Draw",
  type: "Type",
  typedLabel: "Type your full name",
  typedPlaceholder: "Full name",
  canvas: "Signature drawing area",
  captured: "Signature captured",
  cleared: "Signature cleared",
}

type Point = { x: number; y: number }

function SignaturePad({
  onChange,
  onSign,
  allowTyped = false,
  disabled = false,
  strokeWidth = 2.5,
  height = 160,
  labels: labelsProp,
  className,
  ...props
}: SignaturePadProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const inkRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const strokes = React.useRef<Point[][]>([])
  const active = React.useRef<Point[] | null>(null)
  const typedId = React.useId()
  const labelId = React.useId()

  const [mode, setMode] = React.useState<SignaturePadMode>("draw")
  const [strokeCount, setStrokeCount] = React.useState(0)
  const [name, setName] = React.useState("")
  const [announce, setAnnounce] = React.useState("")
  const [drawing, setDrawing] = React.useState(false)

  /** Paint every stroke. Colors are read from the element's computed style now, so theme changes apply. */
  const paint = React.useCallback(() => {
    const canvas = canvasRef.current
    const ink = inkRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ink || !ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const color = getComputedStyle(ink).color
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = strokeWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    for (const stroke of [
      ...strokes.current,
      ...(active.current ? [active.current] : []),
    ]) {
      if (stroke.length === 1) {
        ctx.beginPath()
        ctx.arc(stroke[0].x, stroke[0].y, strokeWidth / 2, 0, Math.PI * 2)
        ctx.fill()
        continue
      }
      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)
      for (let i = 1; i < stroke.length - 1; i++) {
        const mx = (stroke[i].x + stroke[i + 1].x) / 2
        const my = (stroke[i].y + stroke[i + 1].y) / 2
        ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, mx, my)
      }
      const last = stroke[stroke.length - 1]
      ctx.lineTo(last.x, last.y)
      ctx.stroke()
    }
  }, [strokeWidth])

  // Size the backing store to the element and device pixel ratio.
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fit = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      paint()
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [paint, mode])

  const exportDrawn = () => canvasRef.current?.toDataURL("image/png") ?? null

  const emit = (dataUrl: string | null) => {
    onChange?.(dataUrl)
    setAnnounce(dataUrl ? labels.captured : labels.cleared)
  }

  const point = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || (e.pointerType === "mouse" && e.button !== 0)) return
    e.currentTarget.setPointerCapture(e.pointerId)
    active.current = [point(e)]
    setDrawing(true)
    paint()
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!active.current) return
    const events =
      typeof e.nativeEvent.getCoalescedEvents === "function"
        ? e.nativeEvent.getCoalescedEvents()
        : []
    const rect = e.currentTarget.getBoundingClientRect()
    if (events.length) {
      for (const ev of events)
        active.current.push({
          x: ev.clientX - rect.left,
          y: ev.clientY - rect.top,
        })
    } else {
      active.current.push(point(e))
    }
    paint()
  }

  const endStroke = () => {
    const stroke = active.current
    if (!stroke) return
    active.current = null
    setDrawing(false)
    strokes.current = [...strokes.current, stroke]
    setStrokeCount(strokes.current.length)
    paint()
    emit(exportDrawn())
  }

  const undo = () => {
    if (!strokes.current.length) return
    strokes.current = strokes.current.slice(0, -1)
    setStrokeCount(strokes.current.length)
    paint()
    emit(strokes.current.length ? exportDrawn() : null)
  }

  const renderTyped = (value: string): string | null => {
    const trimmed = value.trim()
    if (!trimmed || !inkRef.current) return null
    const ink = getComputedStyle(inkRef.current)
    const canvas = document.createElement("canvas")
    const width = 600
    const h = 200
    canvas.width = width
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.fillStyle = ink.color
    ctx.textBaseline = "middle"
    ctx.font = `italic 300 64px ${ink.fontFamily}`
    ctx.fillText(trimmed, 16, h / 2, width - 32)
    return canvas.toDataURL("image/png")
  }

  const clear = () => {
    strokes.current = []
    active.current = null
    setStrokeCount(0)
    setName("")
    paint()
    emit(null)
  }

  const switchMode = (next: SignaturePadMode) => {
    if (next === mode) return
    strokes.current = []
    active.current = null
    setStrokeCount(0)
    setName("")
    setMode(next)
    emit(null)
  }

  const hasSignature = mode === "draw" ? strokeCount > 0 : name.trim() !== ""

  const sign = () => {
    const dataUrl = mode === "draw" ? exportDrawn() : renderTyped(name)
    if (!dataUrl) return
    onSign?.({
      dataUrl,
      mode,
      name: mode === "type" ? name.trim() : undefined,
    })
  }

  return (
    <div
      data-slot="signature-pad"
      data-state={hasSignature ? "signed" : "empty"}
      data-disabled={disabled || undefined}
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span id={labelId} className="eyebrow text-muted-foreground">
          {labels.label}
        </span>
        {allowTyped && (
          <div
            role="group"
            aria-label={labels.label}
            className="flex gap-1"
            data-slot="signature-pad-modes"
          >
            {(["draw", "type"] as const).map((m) => (
              <Button
                key={m}
                type="button"
                size="xs"
                variant={mode === m ? "ink" : "outline"}
                aria-pressed={mode === m}
                disabled={disabled}
                onClick={() => switchMode(m)}
              >
                {m === "draw" ? labels.draw : labels.type}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div
        ref={inkRef}
        className="relative rounded-md border border-input bg-background font-display text-foreground has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring data-[disabled]:opacity-50"
        data-disabled={disabled || undefined}
        style={{ height }}
      >
        {mode === "draw" ? (
          <>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={labels.canvas}
              data-slot="signature-pad-canvas"
              className={cn(
                "absolute inset-0 size-full touch-none",
                disabled ? "cursor-not-allowed" : "cursor-crosshair"
              )}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
            />
            {strokeCount === 0 && !drawing && (
              <div
                data-slot="signature-pad-empty"
                className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <PenLine aria-hidden className="size-4" />
                {labels.empty}
              </div>
            )}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-4 bottom-8 border-b border-dashed border-border"
            />
          </>
        ) : (
          <div className="flex size-full flex-col justify-center gap-2 px-4">
            <label htmlFor={typedId} className="text-sm font-medium">
              {labels.typedLabel}
            </label>
            <Input
              id={typedId}
              value={name}
              disabled={disabled}
              placeholder={labels.typedPlaceholder}
              autoComplete="name"
              className="font-display text-xl italic"
              onChange={(e) => {
                setName(e.target.value)
                emit(renderTyped(e.target.value))
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {mode === "draw" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || strokeCount === 0}
            onClick={undo}
          >
            <Undo2 aria-hidden />
            {labels.undo}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !hasSignature}
          onClick={clear}
        >
          <Trash2 aria-hidden />
          {labels.clear}
        </Button>
        {onSign && (
          <Button
            type="button"
            size="sm"
            className="ml-auto"
            disabled={disabled || !hasSignature}
            onClick={sign}
          >
            {labels.sign}
          </Button>
        )}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  )
}

export { SignaturePad, DEFAULT_LABELS as SIGNATURE_PAD_LABELS }
export type {
  SignaturePadProps,
  SignaturePadLabels,
  SignaturePadMode,
  SignaturePadResult,
}
