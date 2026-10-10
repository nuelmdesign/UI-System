# Voice Button

Toggle or push-to-talk record button with idle, recording, processing, success and error states, a shortcut hint and a compact live waveform. Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/voice-button
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { VoiceButton } from "@/components/agents/voice-button"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/kbd`, `@opendraft/live-waveform`

## Props and types

```ts
type VoiceButtonState =
  "idle" | "recording" | "processing" | "success" | "error"

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
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  VoiceButton,
  type VoiceButtonState,
} from "@/components/agents/voice-button"

export default function VoiceButtonDemo() {
  const [state, setState] = React.useState<VoiceButtonState>("idle")
  const timers = React.useRef<number[]>([])

  React.useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((id) => window.clearTimeout(id))
  }, [])

  function stop() {
    setState("processing")
    timers.current.push(
      window.setTimeout(() => setState("success"), 1200),
      window.setTimeout(() => setState("idle"), 3000)
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <VoiceButton
        state={state}
        label="Dictate"
        shortcut="Space"
        hotkey="Space"
        onRecordStart={() => setState("recording")}
        onRecordEnd={stop}
      />
      <VoiceButton
        state={state}
        mode="push-to-talk"
        label="Hold to talk"
        onRecordStart={() => setState("recording")}
        onRecordEnd={stop}
      />
      <VoiceButton
        state={state}
        size="icon"
        aria-label="Record"
        onRecordStart={() => setState("recording")}
        onRecordEnd={stop}
      />
      <p className="eyebrow text-muted-foreground">State: {state}</p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/voice-button. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
