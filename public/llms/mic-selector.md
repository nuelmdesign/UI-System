# Mic Selector

Microphone picker in a dropdown with a mute toggle and a live level preview; handles permission denied and no devices. Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/mic-selector
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { MicSelector } from "@/components/agents/mic-selector"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/dropdown-menu`, `@opendraft/live-waveform`

## Props and types

```ts
type AudioDevice = {
  deviceId: string
  label: string
  groupId: string
}

type AudioDevicesStatus = "loading" | "ready" | "denied" | "unsupported"

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
```

## Example

```tsx
"use client"

import * as React from "react"

import { MicSelector } from "@/components/agents/mic-selector"

export default function MicSelectorDemo() {
  const [deviceId, setDeviceId] = React.useState<string>()
  const [muted, setMuted] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <MicSelector
        value={deviceId}
        onValueChange={setDeviceId}
        muted={muted}
        onMutedChange={setMuted}
      />
      <p className="eyebrow text-muted-foreground">
        {muted ? "Muted" : "Open the menu to preview your input level"}
      </p>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/mic-selector. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
