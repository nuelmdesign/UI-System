// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Mic, MicOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { LiveWaveform } from "@/components/agents/live-waveform"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type AudioDevice = {
  deviceId: string
  label: string
  groupId: string
}

type AudioDevicesStatus = "loading" | "ready" | "denied" | "unsupported"

function toAudioInputs(list: MediaDeviceInfo[]): AudioDevice[] {
  return list
    .filter((device) => device.kind === "audioinput")
    .map((device, index) => ({
      deviceId: device.deviceId,
      groupId: device.groupId,
      label:
        device.label.replace(/\s*\([^)]*\)/g, "").trim() ||
        `Microphone ${index + 1}`,
    }))
}

/**
 * Lists audio input devices. Labels stay generic until `requestAccess` is
 * called, which briefly opens (and immediately releases) a stream to
 * unlock real device names. Re-enumerates on `devicechange`.
 */
function useAudioDevices() {
  const [devices, setDevices] = React.useState<AudioDevice[]>([])
  const [status, setStatus] = React.useState<AudioDevicesStatus>("loading")
  const [granted, setGranted] = React.useState(false)
  const alive = React.useRef(true)

  React.useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const refresh = React.useCallback(async (askPermission: boolean) => {
    const media =
      typeof navigator === "undefined" ? null : navigator.mediaDevices
    if (!media?.enumerateDevices) {
      if (alive.current) setStatus("unsupported")
      return
    }
    try {
      if (askPermission) {
        const stream = await media.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
        if (alive.current) setGranted(true)
      }
      const list = toAudioInputs(await media.enumerateDevices())
      if (!alive.current) return
      setDevices(list)
      setStatus("ready")
    } catch (error) {
      if (!alive.current) return
      const name = error instanceof DOMException ? error.name : ""
      setStatus(
        name === "NotAllowedError" || name === "SecurityError"
          ? "denied"
          : "ready"
      )
    }
  }, [])

  React.useEffect(() => {
    void Promise.resolve().then(() => refresh(false))
    const media = navigator.mediaDevices
    if (!media?.addEventListener) return
    const onChange = () => void refresh(false)
    media.addEventListener("devicechange", onChange)
    return () => media.removeEventListener("devicechange", onChange)
  }, [refresh])

  const requestAccess = React.useCallback(() => refresh(true), [refresh])

  return { devices, status, granted, requestAccess }
}

type MicSelectorProps = Omit<
  React.ComponentProps<typeof Button>,
  "value" | "onChange" | "children"
> & {
  /** Selected device id (controlled). Defaults to the first device. */
  value?: string
  /** Called when the user picks a device. */
  onValueChange?: (deviceId: string) => void
  /** Muted state (controlled). */
  muted?: boolean
  /** Called when the user toggles mute. */
  onMutedChange?: (muted: boolean) => void
}

/** A microphone picker with a live level preview while the menu is open. */
function MicSelector({
  value,
  onValueChange,
  muted,
  onMutedChange,
  disabled,
  className,
  ...props
}: MicSelectorProps) {
  const { devices, status, granted, requestAccess } = useAudioDevices()
  const [internalValue, setInternalValue] = React.useState("")
  const [internalMuted, setInternalMuted] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const isMuted = muted ?? internalMuted
  const wanted = value ?? internalValue
  const current = devices.find((d) => d.deviceId === wanted) ?? devices[0]
  const deviceId = current?.deviceId || undefined

  const triggerLabel =
    status === "loading"
      ? "Loading..."
      : status === "unsupported"
        ? "Unsupported"
        : status === "denied"
          ? "Access blocked"
          : (current?.label ?? "No microphone")

  function select(id: string) {
    setInternalValue(id)
    onValueChange?.(id)
  }

  function toggleMute() {
    setInternalMuted(!isMuted)
    onMutedChange?.(!isMuted)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next && !granted && status !== "denied" && status !== "unsupported") {
      void requestAccess()
    }
  }

  const unavailable = status === "unsupported"

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          data-slot="mic-selector"
          variant="ghost"
          size="sm"
          aria-label={`Microphone: ${triggerLabel}`}
          disabled={disabled || unavailable || status === "loading"}
          className={cn("w-40 min-w-0 shrink justify-start sm:w-48", className)}
          {...props}
        >
          {isMuted ? <MicOff /> : <Mic />}
          <span className="min-w-0 flex-1 truncate text-left text-xs sm:text-sm">
            {triggerLabel}
          </span>
          <ChevronsUpDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="top"
        className="w-72 max-w-[calc(100vw-2rem)]"
      >
        {status === "denied" ? (
          <DropdownMenuItem disabled>
            Microphone access was blocked. Allow it in your browser settings.
          </DropdownMenuItem>
        ) : devices.length === 0 ? (
          <DropdownMenuItem disabled>No microphones found</DropdownMenuItem>
        ) : (
          devices.map((device) => (
            <DropdownMenuItem
              key={device.deviceId || device.label}
              onSelect={(event) => {
                event.preventDefault()
                select(device.deviceId)
              }}
              className="justify-between"
            >
              <span className="truncate">{device.label}</span>
              {current?.deviceId === device.deviceId && (
                <Check className="shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
        {devices.length > 0 && status !== "denied" && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 p-2">
              <Button variant="ghost" size="sm" onClick={toggleMute}>
                {isMuted ? <MicOff /> : <Mic />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <div
                role="img"
                aria-label="Input level preview"
                className="ml-auto w-16 overflow-hidden rounded-md bg-muted p-1.5"
              >
                <LiveWaveform
                  active={open && !isMuted}
                  deviceId={deviceId}
                  mode="static"
                  height={15}
                  barWidth={3}
                  barGap={1}
                  aria-hidden
                />
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { MicSelector, useAudioDevices }
export type { AudioDevice, AudioDevicesStatus, MicSelectorProps }
