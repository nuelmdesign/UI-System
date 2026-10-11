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
