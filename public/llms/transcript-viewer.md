# Transcript Viewer

Time-aligned transcript that highlights the current word and seeks when a word is clicked, from plain word timings. Adapted from ElevenLabs UI (MIT).

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/transcript-viewer
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { TranscriptViewer, TranscriptViewerContainer, TranscriptViewerWords, TranscriptViewerWord, TranscriptViewerPlayPauseButton, TranscriptViewerScrubBar } from "@/components/agents/transcript-viewer"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/scrub-bar`

## Props and types

```ts
/** One spoken word with its timing in seconds. Words must be sorted by `start`. */
type TranscriptWord = {
  text: string
  start: number
  end: number
}

type TranscriptWordStatus = "spoken" | "current" | "unspoken"

type UseTranscriptViewerProps = {
  words: TranscriptWord[]
  onPlay?: () => void
  onPause?: () => void
  onTimeUpdate?: (time: number) => void
  onEnded?: () => void
  onDurationChange?: (duration: number) => void
}

type UseTranscriptViewerResult = {
  words: TranscriptWord[]
  /**
   * Index of the word being spoken. Between words it stays on the last word
   * that started. -1 before the first word, `words.length` once playback has
   * passed the end of the last word.
   */
  currentIndex: number
  currentWord: TranscriptWord | null
  currentTime: number
  /** Seconds. Taken from the audio element, or from the last word until metadata loads. */
  duration: number
  isPlaying: boolean
  isScrubbing: boolean
  play: () => void
  pause: () => void
  seekToTime: (time: number) => void
  seekToWord: (word: number | TranscriptWord) => void
  startScrubbing: () => void
  endScrubbing: () => void
  /** Spread onto the `<audio>` element. Carries the ref and all event handlers. */
  audioProps: React.ComponentProps<"audio">
}

type TranscriptViewerContainerProps = Omit<
  React.ComponentProps<"div">,
  "children"
> &
  Omit<UseTranscriptViewerProps, "words"> & {
    /** URL of the audio the words are aligned to. Any playable URL, including blob URLs. */
    src: string
    /** Word timings in seconds, sorted by `start`. */
    words: TranscriptWord[]
    children?: React.ReactNode
  }

type TranscriptViewerWordProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  word: TranscriptWord
  status: TranscriptWordStatus
  children?: React.ReactNode
}

type TranscriptViewerWordsProps = Omit<
  React.ComponentProps<"div">,
  "children"
> & {
  /** Replace how a word renders. Receives its status. */
  renderWord?: (props: {
    word: TranscriptWord
    status: TranscriptWordStatus
  }) => React.ReactNode
  /** Class names applied to every word button. */
  wordClassName?: string
}

type PlayPauseChildren = (state: { isPlaying: boolean }) => React.ReactNode

type TranscriptViewerPlayPauseButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  /** Custom content, or a function of the playing state. Defaults to a play/pause icon. */
  children?: React.ReactNode | PlayPauseChildren
}

type TranscriptViewerScrubBarProps = Omit<
  React.ComponentProps<typeof ScrubBarContainer>,
  "duration" | "value" | "onScrub" | "onScrubStart" | "onScrubEnd" | "children"
> & {
  /** Show elapsed and remaining time. Defaults to true. */
  showTimeLabels?: boolean
}

type TranscriptViewerProps = Omit<TranscriptViewerContainerProps, "children">
```

## Example

```tsx
"use client"

import * as React from "react"

import {
  TranscriptViewer,
  type TranscriptWord,
} from "@/components/agents/transcript-viewer"

const RATE = 8000

const SCRIPT =
  "Welcome back to the weekly review. Three things shipped this week: the new onboarding flow, faster search, and a cleaner settings page. Next week we focus on reliability, so expect fewer features and more polish."

/** Word timings: about 0.32s per word plus a pause after each sentence. */
const WORDS: TranscriptWord[] = (() => {
  let cursor = 0.3
  return SCRIPT.split(" ").map((text) => {
    const start = cursor
    const end = start + 0.18 + Math.min(text.length, 9) * 0.02
    cursor = end + (/[.:]$/.test(text) ? 0.5 : 0.1)
    return { text, start, end }
  })
})()

/** Builds a mono 16-bit PCM WAV with one soft tone per word and returns a blob URL. */
function makeWavUrl(words: TranscriptWord[]) {
  const seconds = words[words.length - 1].end + 0.4
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
  let w = 0
  for (let i = 0; i < count; i++) {
    const t = i / RATE
    while (w < words.length - 1 && t >= words[w].end) w++
    const word = words[w]
    let value = 0
    if (t >= word.start && t < word.end) {
      const local = t - word.start
      const envelope =
        Math.min(local / 0.015, 1) * Math.min((word.end - t) / 0.04, 1)
      const hz = 180 + (w % 5) * 40
      value = 0.18 * envelope * Math.sin(2 * Math.PI * hz * t)
    }
    view.setInt16(44 + i * 2, value * 0x7fff, true)
  }
  return URL.createObjectURL(new Blob([view.buffer], { type: "audio/wav" }))
}

let cached: string | undefined

// Built once on the client; the server render and hydration both start without audio.
function getSrc() {
  cached ??= makeWavUrl(WORDS)
  return cached
}

const subscribe = () => () => {}
const getServerSrc = () => undefined

export default function TranscriptViewerDemo() {
  const src = React.useSyncExternalStore(subscribe, getSrc, getServerSrc)

  return (
    <div className="w-full max-w-xl">
      <TranscriptViewer src={src ?? ""} words={WORDS} />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/transcript-viewer. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
