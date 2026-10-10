# Audio Player

Audio provider with play and pause, previous and next, seek, speed menu, volume, playlist and error state. Takes a source or a list of tracks. Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/audio-player
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { AudioPlayer, AudioPlayerProvider, AudioPlayerButton, AudioPlayerSkip, AudioPlayerProgress, AudioPlayerTime, AudioPlayerDuration, AudioPlayerSpeed, AudioPlayerVolume, AudioPlayerPlaylist } from "@/components/agents/audio-player"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/dropdown-menu`, `@opendraft/slider`

## Props and types

```ts
type AudioPlayerTrack<TData = unknown> = {
  id: string | number
  src: string
  title?: string
  subtitle?: string
  /** Anything the host app wants to carry along with the track. */
  data?: TData
}

type AudioPlayerApi<TData = unknown> = {
  ref: React.RefObject<HTMLAudioElement | null>
  tracks: AudioPlayerTrack<TData>[]
  activeTrack: AudioPlayerTrack<TData> | null
  /** Seconds, or undefined until metadata has loaded. */
  duration: number | undefined
  isPlaying: boolean
  isBuffering: boolean
  hasError: boolean
  playbackRate: number
  /** 0 to 1. */
  volume: number
  muted: boolean
  hasNext: boolean
  hasPrevious: boolean
  isTrackActive: (id: string | number) => boolean
  /** Resume, or switch to the given track (by object or id) and play it. */
  play: (track?: AudioPlayerTrack<TData> | string | number) => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  next: () => void
  previous: () => void
  setPlaybackRate: (rate: number) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
}

type AudioPlayerProviderProps<TData = unknown> = {
  /** A single audio source. Ignored when `tracks` is given. */
  src?: string
  /** A playlist. The first track is active until another is played. */
  tracks?: AudioPlayerTrack<TData>[]
  /** Play the next track when one ends. Defaults to true. */
  autoAdvance?: boolean
  children?: React.ReactNode
}

type AudioPlayerButtonProps<TData = unknown> = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  /** Play this track instead of the active one. Shows its own play state. */
  track?: AudioPlayerTrack<TData>
}

type AudioPlayerSpeedProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  /** Selectable rates. */
  speeds?: readonly number[]
}

type AudioPlayerProps<TData = unknown> = Omit<
  React.ComponentProps<"div">,
  "children"
> &
  Pick<AudioPlayerProviderProps<TData>, "src" | "tracks" | "autoAdvance"> & {
    /** Heading for a single `src`. Tracks use their own `title`. */
    title?: string
    /** Selectable playback rates. */
    speeds?: readonly number[]
    /** Show the volume control. Defaults to true. */
    showVolume?: boolean
    /** List the tracks under the controls when there is more than one. Defaults to true. */
    showPlaylist?: boolean
  }

function AudioPlayer(props: AudioPlayerProps<TData>)

function AudioPlayerProvider(props: AudioPlayerProviderProps<TData>)

function AudioPlayerButton(props: AudioPlayerButtonProps<TData>)

function AudioPlayerSkip(props: Omit<React.ComponentProps<typeof Button>, "children"> & {
  direction: "previous" | "next"
})

function AudioPlayerProgress(props: Omit<
  React.ComponentProps<typeof Slider>,
  "min" | "max" | "value" | "defaultValue" | "onValueChange" | "aria-label"
>)

function AudioPlayerTime(props: React.ComponentProps<"span">)

function AudioPlayerDuration(props: React.ComponentProps<"span">)

function AudioPlayerVolume(props: Omit<React.ComponentProps<"div">, "children">)

function AudioPlayerPlaylist(props: Omit<React.ComponentProps<"ul">, "children">)
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  AudioPlayer,
  type AudioPlayerTrack,
} from "@/components/agents/audio-player"

const RATE = 8000

/** Builds a mono 16-bit PCM WAV from a sample function and returns a blob URL. */
function makeWavUrl(seconds: number, sample: (t: number) => number) {
  const count = Math.floor(seconds * RATE)
  const view = new DataView(new ArrayBuffer(44 + count * 2))
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i))
    }
  }
  text(0, "RIFF")
  view.setUint32(4, 36 + count * 2, true)
  text(8, "WAVEfmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, RATE, true)
  view.setUint32(28, RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  text(36, "data")
  view.setUint32(40, count * 2, true)
  for (let i = 0; i < count; i++) {
    const value = Math.max(-1, Math.min(1, sample(i / RATE)))
    view.setInt16(44 + i * 2, value * 0x7fff, true)
  }
  return URL.createObjectURL(new Blob([view.buffer], { type: "audio/wav" }))
}

/** A repeating melody: one note per beat with a soft attack and decay. */
function melody(notes: number[], beat: number) {
  return (t: number) => {
    const index = Math.floor(t / beat)
    const local = t - index * beat
    const envelope = Math.min(local / 0.02, 1) * Math.exp(-local * 4)
    const hz = notes[index % notes.length]
    return 0.25 * envelope * Math.sin(2 * Math.PI * hz * t)
  }
}

const SOURCES = [
  {
    id: "arpeggio",
    title: "Morning arpeggio",
    seconds: 12,
    beat: 0.4,
    notes: [262, 330, 392, 523],
  },
  {
    id: "pulse",
    title: "Slow pulse",
    seconds: 16,
    beat: 0.8,
    notes: [196, 196, 247, 220],
  },
  {
    id: "scale",
    title: "Rising scale",
    seconds: 9,
    beat: 0.3,
    notes: [262, 294, 330, 349, 392, 440, 494, 523],
  },
]

let cached: AudioPlayerTrack[] | undefined

// Built once on the client, so the server render and hydration both see no tracks first.
function getTracks() {
  cached ??= SOURCES.map(({ id, title, seconds, beat, notes }) => ({
    id,
    title,
    subtitle: `${seconds}s`,
    src: makeWavUrl(seconds, melody(notes, beat)),
  }))
  return cached
}

const subscribe = () => () => {}
const getServerTracks = () => undefined

export default function AudioPlayerDemo() {
  const tracks = React.useSyncExternalStore(
    subscribe,
    getTracks,
    getServerTracks
  )

  return (
    <div className="w-full max-w-md">
      <AudioPlayer tracks={tracks ?? []} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/audio-player. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
