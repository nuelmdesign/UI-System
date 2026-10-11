# Video Player

Accessible video player with seek, volume, speed, captions, chapters, keyboard shortcuts and an error state.

Category: Components

## Install

```bash
npx shadcn@latest add @opendraft/video-player
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { VideoPlayer } from "@/components/ui/video-player"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/dropdown-menu`, `@opendraft/slider`, `@opendraft/kbd`, `@opendraft/scrub-bar`

## Props and types

```ts
type VideoChapter = {
  /** Start of the chapter, in seconds. */
  time: number
  label: string
}

type VideoCaptionTrack = {
  /** URL of a WebVTT file. */
  src: string
  /** Shown in the captions menu, e.g. "English". */
  label: string
  /** BCP 47 language tag, e.g. "en". */
  srcLang?: string
  kind?: "captions" | "subtitles"
  /** Show this track at first. */
  default?: boolean
}

type VideoPlayerLabels = {
  player: string
  play: string
  pause: string
  seek: string
  mute: string
  unmute: string
  volume: string
  speed: string
  normalSpeed: string
  captions: string
  captionsOff: string
  fullscreen: string
  exitFullscreen: string
  shortcuts: string
  shortcutsHint: string
  shortcutPlay: string
  shortcutSeek: string
  shortcutVolume: string
  shortcutMute: string
  shortcutFullscreen: string
  shortcutCaptions: string
  chapters: string
  error: string
  retry: string
  loading: string
  playing: string
  paused: string
}

type VideoPlayerProps = Omit<
  React.ComponentProps<"div">,
  "children" | "title" | "onProgress"
> & {
  /** URL of the video file or stream the browser can play. */
  src: string
  /** Image shown before playback starts. */
  poster?: string
  /** Heading above the video. Also names the player for assistive tech. */
  title?: React.ReactNode
  /** Short text under the title, e.g. a date or an owner. */
  description?: React.ReactNode
  /** WebVTT caption or subtitle tracks. Adds a captions control when given. */
  tracks?: VideoCaptionTrack[]
  /** Named positions in the video. Rendered as a list that seeks, and as ticks on the seek bar. */
  chapters?: VideoChapter[]
  /** Reports the position in seconds: every `progressInterval` seconds while playing, and on pause and end. Use it to save where the viewer stopped. */
  onProgress?: (seconds: number) => void
  /** Seconds between `onProgress` calls while playing. Defaults to 5. */
  progressInterval?: number
  /** Position in seconds to resume from once the video is ready. */
  startAt?: number
  /** Called when the video fails to load or decode. */
  onError?: () => void
  /** Selectable playback rates. */
  speeds?: readonly number[]
  /** Fixed copy. Merged over neutral English defaults. */
  labels?: Partial<VideoPlayerLabels>
}
```

## Example

```tsx
"use client"

import * as React from "react"

import { formatTimestamp } from "@/components/agents/scrub-bar"
import { VideoPlayer } from "@/components/ui/video-player"

// The sources below are placeholders and may 404. The player then shows its
// error state with a retry button instead of a blank frame.
export default function VideoPlayerDemo() {
  const [trainingSeconds, setTrainingSeconds] = React.useState(0)
  const [briefingSeconds, setBriefingSeconds] = React.useState(0)

  return (
    <div className="flex w-full max-w-[960px] flex-col gap-10">
      <section className="flex flex-col gap-3">
        <p className="eyebrow">Training video</p>
        <VideoPlayer
          src="https://example.com/media/forklift-safety-training.mp4"
          poster="https://example.com/media/forklift-safety-training.jpg"
          title="Forklift safety, module 2"
          description="Warehouse operations onboarding"
          tracks={[
            { src: "/media/forklift-en.vtt", label: "English", srcLang: "en" },
            { src: "/media/forklift-es.vtt", label: "Español", srcLang: "es" },
          ]}
          chapters={[
            { time: 0, label: "Pre-shift inspection" },
            { time: 95, label: "Load limits and stability" },
            { time: 240, label: "Pedestrian zones" },
            { time: 410, label: "Parking and charging" },
          ]}
          onProgress={setTrainingSeconds}
        />
        <p className="font-mono text-xs text-muted-foreground">
          Saved position {formatTimestamp(trainingSeconds)}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <p className="eyebrow">Surgical briefing</p>
        <VideoPlayer
          src="https://example.com/media/procedure-briefing.mp4"
          title="Laparoscopic cholecystectomy briefing"
          description="Pre-operative team review"
          tracks={[
            {
              src: "/media/briefing-en.vtt",
              label: "English",
              srcLang: "en",
              default: true,
            },
          ]}
          chapters={[
            { time: 0, label: "Patient and consent" },
            { time: 60, label: "Equipment check" },
            { time: 150, label: "Approach and ports" },
            { time: 330, label: "Contingencies" },
          ]}
          speeds={[0.75, 1, 1.5]}
          onProgress={setBriefingSeconds}
          labels={{
            error:
              "The briefing recording is unavailable. Contact the surgical coordinator.",
          }}
        />
        <p className="font-mono text-xs text-muted-foreground">
          Reviewed up to {formatTimestamp(briefingSeconds)}
        </p>
      </section>
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/video-player. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
