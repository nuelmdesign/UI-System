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
