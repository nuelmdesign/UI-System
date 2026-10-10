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
