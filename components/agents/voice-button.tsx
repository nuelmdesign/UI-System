// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"
import { Check, Mic, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { LiveWaveform } from "@/components/agents/live-waveform"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

type VoiceButtonState =
  "idle" | "recording" | "processing" | "success" | "error"

const STATE_TEXT: Record<VoiceButtonState, string> = {
  idle: "Ready",
  recording: "Recording",
  processing: "Processing",
  success: "Done",
  error: "Something went wrong",
}

type VoiceButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "onClick"
> & {
  /** Current state. Owned by the caller, who does the actual recording work. */
  state?: VoiceButtonState
  /** `toggle`: click to start and stop. `push-to-talk`: record while held. */
  mode?: "toggle" | "push-to-talk"
  /** Fires when the user asks to start recording. */
  onRecordStart?: () => void
  /** Fires when the user asks to stop recording. */
  onRecordEnd?: () => void
  /** Text label shown before the waveform. */
  label?: React.ReactNode
  /** Shortcut hint rendered with `Kbd`, e.g. "Space". */
  shortcut?: string
  /** `KeyboardEvent.code` that triggers the button globally, e.g. "Space". */
  hotkey?: string
  /** Icon for the `icon` size when idle. */
  icon?: React.ReactNode
  /** How long success and error feedback stays visible, in ms. */
  feedbackDuration?: number
  /** Extra classes for the waveform well. */
  waveformClassName?: string
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  )
}

/** A record button with idle, recording, processing, success and error states. */
function VoiceButton({
  state = "idle",
  mode = "toggle",
  onRecordStart,
  onRecordEnd,
  label = "Record",
  shortcut,
  hotkey,
  icon,
  variant = "outline",
  size = "default",
  feedbackDuration = 1500,
  waveformClassName,
  disabled,
  className,
  onKeyDown,
  onKeyUp,
  ...props
}: VoiceButtonProps) {
  const [dismissed, setDismissed] = React.useState<VoiceButtonState | null>(
    null
  )
  const holding = React.useRef(false)
  const latest = React.useRef({ state, onRecordStart, onRecordEnd, mode })

  React.useEffect(() => {
    latest.current = { state, onRecordStart, onRecordEnd, mode }
  })

  React.useEffect(() => {
    if (state !== "success" && state !== "error") return
    const timer = setTimeout(() => setDismissed(state), feedbackDuration)
    return () => {
      clearTimeout(timer)
      setDismissed(null)
    }
  }, [state, feedbackDuration])

  const start = React.useCallback(() => {
    const s = latest.current
    if (s.state === "recording" || s.state === "processing") return
    holding.current = true
    s.onRecordStart?.()
  }, [])

  const end = React.useCallback(() => {
    if (!holding.current && latest.current.state !== "recording") return
    holding.current = false
    latest.current.onRecordEnd?.()
  }, [])

  // Optional global hotkey.
  React.useEffect(() => {
    if (!hotkey) return
    const down = (event: KeyboardEvent) => {
      if (event.code !== hotkey || event.repeat || isTypingTarget(event.target))
        return
      if (event.target instanceof HTMLButtonElement) return
      event.preventDefault()
      if (latest.current.mode === "push-to-talk") start()
      else if (latest.current.state === "recording") end()
      else start()
    }
    const up = (event: KeyboardEvent) => {
      if (event.code !== hotkey || latest.current.mode !== "push-to-talk")
        return
      end()
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [hotkey, start, end])

  const pushToTalk = mode === "push-to-talk"
  const recording = state === "recording"
  const processing = state === "processing"
  const feedback =
    (state === "success" || state === "error") && dismissed !== state
  const showWaveform = recording || processing || feedback
  const isIcon = typeof size === "string" && size.startsWith("icon")

  const handlers: Partial<React.ComponentProps<"button">> = pushToTalk
    ? {
        onPointerDown: (event) => {
          if (event.button !== 0) return
          event.currentTarget.setPointerCapture(event.pointerId)
          start()
        },
        onPointerUp: end,
        onPointerCancel: end,
        onKeyDown: (event) => {
          onKeyDown?.(event)
          if ((event.key === " " || event.key === "Enter") && !event.repeat) {
            event.preventDefault()
            start()
          }
        },
        onKeyUp: (event) => {
          onKeyUp?.(event)
          if (event.key === " " || event.key === "Enter") end()
        },
        onBlur: end,
      }
    : {
        onClick: () => (recording ? end() : start()),
      }

  return (
    <Button
      data-slot="voice-button"
      data-state={state}
      type="button"
      variant={variant}
      size={size}
      disabled={disabled || processing}
      aria-pressed={recording}
      aria-label={typeof label === "string" ? label : "Voice input"}
      className={cn("touch-none", className)}
      {...props}
      {...handlers}
    >
      {!isIcon && label}
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-sm",
          isIcon ? "size-5" : "h-5 w-24 border",
          recording ? "border-brand/40 bg-brand/10" : "bg-muted",
          waveformClassName
        )}
      >
        {showWaveform && (
          <LiveWaveform
            active={recording}
            processing={processing || (feedback && state === "success")}
            barWidth={2}
            barGap={1}
            barRadius={4}
            fadeEdges={false}
            sensitivity={1.8}
            smoothingTimeConstant={0.85}
            height={20}
            mode="static"
            aria-hidden
            className="absolute inset-0 size-full animate-pop-in"
          />
        )}
        {!showWaveform &&
          (isIcon ? (
            (icon ?? <Mic className="size-3.5" />)
          ) : shortcut ? (
            <Kbd className="h-4 border-0 bg-transparent">{shortcut}</Kbd>
          ) : null)}
        {feedback && (
          <span className="absolute inset-0 flex animate-pop-in items-center justify-center bg-background/80">
            {state === "success" ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <X className="size-3.5 text-destructive" />
            )}
          </span>
        )}
      </span>
      <span role="status" className="sr-only">
        {STATE_TEXT[state]}
      </span>
    </Button>
  )
}

export { VoiceButton }
export type { VoiceButtonProps, VoiceButtonState }
