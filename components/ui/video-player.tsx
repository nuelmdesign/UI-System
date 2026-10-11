"use client"

import * as React from "react"
import {
  Captions,
  CaptionsOff,
  Keyboard,
  LoaderCircle,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCw,
  TriangleAlert,
  Volume2,
  VolumeX,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Slider } from "@/components/ui/slider"
import {
  formatTimestamp,
  ScrubBarContainer,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
  ScrubBarTrack,
} from "@/components/agents/scrub-bar"

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

const DEFAULT_LABELS: VideoPlayerLabels = {
  player: "Video player",
  play: "Play",
  pause: "Pause",
  seek: "Seek",
  mute: "Mute",
  unmute: "Unmute",
  volume: "Volume",
  speed: "Playback speed",
  normalSpeed: "Normal",
  captions: "Captions",
  captionsOff: "Captions off",
  fullscreen: "Full screen",
  exitFullscreen: "Exit full screen",
  shortcuts: "Keyboard shortcuts",
  shortcutsHint: "Focus the player, then use these keys.",
  shortcutPlay: "Play or pause",
  shortcutSeek: "Back or forward 5 seconds",
  shortcutVolume: "Volume up or down",
  shortcutMute: "Mute",
  shortcutFullscreen: "Full screen",
  shortcutCaptions: "Captions",
  chapters: "Chapters",
  error: "This video could not be loaded.",
  retry: "Try again",
  loading: "Loading",
  playing: "Playing",
  paused: "Paused",
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const
const SEEK_STEP = 5
const VOLUME_STEP = 0.1
const NO_TRACKS: VideoCaptionTrack[] = []
const NO_CHAPTERS: VideoChapter[] = []

/** Neutral sample chapters for docs and tests. */
const SAMPLE_VIDEO_CHAPTERS: VideoChapter[] = [
  { time: 0, label: "Introduction" },
  { time: 45, label: "Part 1" },
  { time: 130, label: "Part 2" },
  { time: 260, label: "Summary" },
]

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

/**
 * An accessible player on the native `<video>` element, with transport, seek
 * bar, volume, speed, captions, full screen, chapters and keyboard shortcuts.
 * Works with any URL the browser can play; a failed load shows an error state
 * with a retry button instead of a blank frame.
 *
 * Shortcuts apply while focus is inside the player: Space or K play and pause,
 * Left and Right seek 5 seconds, Up and Down change volume, M mutes, F toggles
 * full screen, C toggles captions.
 */
function VideoPlayer({ src, ...props }: VideoPlayerProps) {
  // Keyed by source so every state resets cleanly when the video changes.
  return <VideoPlayerInner key={src} src={src} {...props} />
}

function VideoPlayerInner({
  src,
  poster,
  title,
  description,
  tracks = NO_TRACKS,
  chapters = NO_CHAPTERS,
  onProgress,
  progressInterval = 5,
  startAt,
  onError,
  speeds = PLAYBACK_SPEEDS,
  labels: labelsProp,
  className,
  ...props
}: VideoPlayerProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp }
  const playerRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const lastReportedRef = React.useRef(0)
  const resumedRef = React.useRef(false)

  const [time, setTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const [buffering, setBuffering] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [muted, setMuted] = React.useState(false)
  const [rate, setRate] = React.useState(1)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [showHelp, setShowHelp] = React.useState(false)
  const [captionIndex, setCaptionIndex] = React.useState(() =>
    tracks.findIndex((track) => track.default)
  )

  const helpId = React.useId()
  const titleId = React.useId()

  // Text tracks are DOM state, so mirror the selected caption into them.
  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return
    for (let i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = i === captionIndex ? "showing" : "disabled"
    }
  }, [captionIndex, tracks])

  React.useEffect(() => {
    const onChange = () =>
      setFullscreen(document.fullscreenElement === playerRef.current)
    document.addEventListener("fullscreenchange", onChange)
    return () => document.removeEventListener("fullscreenchange", onChange)
  }, [])

  const report = (seconds: number) => {
    lastReportedRef.current = seconds
    onProgress?.(seconds)
  }

  const play = () => {
    videoRef.current?.play().catch(() => {
      // Autoplay policy or an aborted load. The pause and error events report state.
    })
  }
  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) play()
    else video.pause()
  }
  const seek = (to: number) => {
    const video = videoRef.current
    if (!video) return
    const max = Number.isFinite(video.duration) ? video.duration : to
    const next = Math.min(Math.max(to, 0), max)
    video.currentTime = next
    setTime(next)
  }
  const changeVolume = (next: number) => {
    const video = videoRef.current
    if (!video) return
    video.volume = Math.min(Math.max(next, 0), 1)
    if (next > 0 && video.muted) video.muted = false
  }
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    if (video.volume === 0) video.volume = 1
    video.muted = !video.muted
  }
  const changeRate = (next: number) => {
    if (videoRef.current) videoRef.current.playbackRate = next
  }
  const toggleFullscreen = () => {
    const player = playerRef.current
    if (!player) return
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      player.requestFullscreen?.().catch(() => {})
    }
  }
  const toggleCaptions = () => {
    if (tracks.length === 0) return
    setCaptionIndex((current) => (current === -1 ? 0 : -1))
  }
  const retry = () => {
    setHasError(false)
    setBuffering(true)
    videoRef.current?.load()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target as HTMLElement
    // Menus render in a portal but still bubble through React. Leave them alone.
    if (target.closest("[role^='menu']")) return
    const onControl = target.closest("button,a,input,[role='slider']")
    const onAdjustable = target.closest("input,[role='slider']")

    switch (event.key) {
      case " ":
        if (onControl) return
        event.preventDefault()
        toggle()
        break
      case "k":
      case "K":
        event.preventDefault()
        toggle()
        break
      case "ArrowLeft":
      case "ArrowRight":
        if (onAdjustable) return
        event.preventDefault()
        seek(time + (event.key === "ArrowLeft" ? -SEEK_STEP : SEEK_STEP))
        break
      case "ArrowUp":
      case "ArrowDown":
        if (onAdjustable) return
        event.preventDefault()
        changeVolume(volume + (event.key === "ArrowUp" ? 1 : -1) * VOLUME_STEP)
        break
      case "m":
      case "M":
        toggleMute()
        break
      case "f":
      case "F":
        toggleFullscreen()
        break
      case "c":
      case "C":
        toggleCaptions()
        break
    }
  }

  const silent = muted || volume === 0
  const captionsOn = captionIndex !== -1
  const activeChapter = chapters.reduce(
    (found, chapter, index) => (chapter.time <= time ? index : found),
    -1
  )
  const shortcutRows: { keys: React.ReactNode; label: string }[] = [
    {
      keys: (
        <>
          <Kbd>Space</Kbd>
          <Kbd>K</Kbd>
        </>
      ),
      label: labels.shortcutPlay,
    },
    {
      keys: (
        <>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </>
      ),
      label: labels.shortcutSeek,
    },
    {
      keys: (
        <>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
        </>
      ),
      label: labels.shortcutVolume,
    },
    { keys: <Kbd>M</Kbd>, label: labels.shortcutMute },
    { keys: <Kbd>F</Kbd>, label: labels.shortcutFullscreen },
    ...(tracks.length > 0
      ? [{ keys: <Kbd>C</Kbd>, label: labels.shortcutCaptions }]
      : []),
  ]

  return (
    <div
      data-slot="video-player"
      className={cn("@container/video-player w-full", className)}
      {...props}
    >
      <div
        className={cn(
          "grid gap-4",
          chapters.length > 0 && "@3xl/video-player:grid-cols-[1fr_16rem]"
        )}
      >
        <div className="flex min-w-0 flex-col gap-3">
          {(title || description) && (
            <div className="flex flex-col gap-1">
              {title && (
                <h3 id={titleId} className="heading text-xl">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          <div
            ref={playerRef}
            data-slot="video-player-frame"
            data-fullscreen={fullscreen || undefined}
            role="group"
            tabIndex={0}
            aria-label={title ? undefined : labels.player}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={showHelp ? helpId : undefined}
            onKeyDown={onKeyDown}
            className={cn(
              "flex flex-col border bg-card text-card-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
              fullscreen && "h-full"
            )}
          >
            <div
              className={cn(
                "relative flex items-center justify-center overflow-hidden bg-ink",
                fullscreen ? "min-h-0 flex-1" : "aspect-video"
              )}
            >
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                preload="metadata"
                playsInline
                className="size-full object-contain"
                onClick={toggle}
                onLoadStart={() => setBuffering(true)}
                onLoadedMetadata={(event) => {
                  const video = event.currentTarget
                  setDuration(
                    Number.isFinite(video.duration) ? video.duration : 0
                  )
                  if (startAt && !resumedRef.current) {
                    resumedRef.current = true
                    video.currentTime = startAt
                    setTime(startAt)
                  }
                }}
                onDurationChange={(event) => {
                  const value = event.currentTarget.duration
                  setDuration(Number.isFinite(value) ? value : 0)
                }}
                onCanPlay={() => setBuffering(false)}
                onWaiting={() => setBuffering(true)}
                onPlaying={() => setBuffering(false)}
                onPlay={() => {
                  setPlaying(true)
                  setStarted(true)
                }}
                onPause={(event) => {
                  setPlaying(false)
                  setTime(event.currentTarget.currentTime)
                  report(event.currentTarget.currentTime)
                }}
                onEnded={(event) => {
                  setPlaying(false)
                  report(event.currentTarget.currentTime)
                }}
                onTimeUpdate={(event) => {
                  const current = event.currentTarget.currentTime
                  setTime(current)
                  if (
                    onProgress &&
                    Math.abs(current - lastReportedRef.current) >=
                      progressInterval
                  ) {
                    report(current)
                  }
                }}
                onSeeked={(event) => setTime(event.currentTarget.currentTime)}
                onError={() => {
                  setHasError(true)
                  setBuffering(false)
                  setPlaying(false)
                  onError?.()
                }}
                onVolumeChange={(event) => {
                  setVolume(event.currentTarget.volume)
                  setMuted(event.currentTarget.muted)
                }}
                onRateChange={(event) =>
                  setRate(event.currentTarget.playbackRate)
                }
              >
                {tracks.map((track) => (
                  <track
                    key={track.src}
                    src={track.src}
                    label={track.label}
                    srcLang={track.srcLang}
                    kind={track.kind ?? "captions"}
                  />
                ))}
              </video>

              {!hasError && !started && !buffering && (
                <Button
                  type="button"
                  size="icon"
                  aria-label={labels.play}
                  onClick={play}
                  className="absolute size-14"
                >
                  <Play aria-hidden className="size-6" />
                </Button>
              )}
              {!hasError && buffering && (
                <LoaderCircle
                  aria-hidden
                  className="pointer-events-none absolute size-8 animate-spin text-background motion-reduce:animate-none"
                />
              )}
              {hasError && (
                <div
                  role="alert"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-4 text-center"
                >
                  <TriangleAlert
                    aria-hidden
                    className="size-6 text-destructive"
                  />
                  <p className="text-sm">{labels.error}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={retry}
                  >
                    <RotateCw aria-hidden /> {labels.retry}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1 border-t px-3 pt-2 pb-2">
              <ScrubBarContainer
                duration={duration}
                value={time}
                onScrub={seek}
              >
                <ScrubBarTrack label={labels.seek} step={1}>
                  <ScrubBarProgress />
                  {duration > 0 &&
                    chapters
                      .filter((chapter) => chapter.time > 0)
                      .map((chapter) => (
                        <span
                          key={`${chapter.time}-${chapter.label}`}
                          aria-hidden
                          className="pointer-events-none absolute h-1.5 w-px bg-foreground/40"
                          style={{
                            left: `${Math.min((chapter.time / duration) * 100, 100)}%`,
                          }}
                        />
                      ))}
                  <ScrubBarThumb />
                </ScrubBarTrack>
              </ScrubBarContainer>
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={playing ? labels.pause : labels.play}
                  disabled={hasError}
                  onClick={toggle}
                >
                  {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
                </Button>
                <div className="flex items-center gap-1 px-1" aria-hidden>
                  <ScrubBarTimeLabel time={time} />
                  <span className="text-xs text-muted-foreground">/</span>
                  <ScrubBarTimeLabel time={duration} />
                </div>
                <div className="ml-auto flex flex-wrap items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={silent ? labels.unmute : labels.mute}
                    aria-pressed={silent}
                    onClick={toggleMute}
                  >
                    {silent ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
                  </Button>
                  <Slider
                    aria-label={labels.volume}
                    className="hidden w-20 @md/video-player:flex"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[muted ? 0 : volume]}
                    onValueChange={([next]) => changeVolume(next)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`${labels.speed}, ${rate}x`}
                        className="font-mono text-xs tabular-nums"
                      >
                        {rate}x
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-32">
                      <DropdownMenuLabel>{labels.speed}</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={String(rate)}
                        onValueChange={(value) => changeRate(Number(value))}
                      >
                        {speeds.map((speed) => (
                          <DropdownMenuRadioItem
                            key={speed}
                            value={String(speed)}
                          >
                            <span className="font-mono tabular-nums">
                              {speed === 1 ? labels.normalSpeed : `${speed}x`}
                            </span>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {tracks.length === 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={labels.captions}
                      aria-pressed={captionsOn}
                      onClick={toggleCaptions}
                    >
                      {captionsOn ? (
                        <Captions aria-hidden />
                      ) : (
                        <CaptionsOff aria-hidden />
                      )}
                    </Button>
                  )}
                  {tracks.length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={labels.captions}
                        >
                          {captionsOn ? (
                            <Captions aria-hidden />
                          ) : (
                            <CaptionsOff aria-hidden />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-36">
                        <DropdownMenuLabel>{labels.captions}</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                          value={String(captionIndex)}
                          onValueChange={(value) =>
                            setCaptionIndex(Number(value))
                          }
                        >
                          <DropdownMenuRadioItem value="-1">
                            {labels.captionsOff}
                          </DropdownMenuRadioItem>
                          {tracks.map((track, index) => (
                            <DropdownMenuRadioItem
                              key={track.src}
                              value={String(index)}
                            >
                              {track.label}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={labels.shortcuts}
                    aria-expanded={showHelp}
                    aria-controls={helpId}
                    onClick={() => setShowHelp((open) => !open)}
                  >
                    <Keyboard aria-hidden />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      fullscreen ? labels.exitFullscreen : labels.fullscreen
                    }
                    onClick={toggleFullscreen}
                  >
                    {fullscreen ? (
                      <Minimize aria-hidden />
                    ) : (
                      <Maximize aria-hidden />
                    )}
                  </Button>
                </div>
              </div>
              {showHelp && (
                <div
                  id={helpId}
                  className="mt-1 flex flex-col gap-2 border-t pt-2"
                >
                  <p className="text-xs text-muted-foreground">
                    {labels.shortcutsHint}
                  </p>
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-1.5 @md/video-player:grid-cols-2">
                    {shortcutRows.map((row, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <dt className="text-muted-foreground">{row.label}</dt>
                        <dd>
                          <KbdGroup>{row.keys}</KbdGroup>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              {hasError
                ? labels.error
                : buffering && !started
                  ? labels.loading
                  : started
                    ? playing
                      ? labels.playing
                      : labels.paused
                    : ""}
            </p>
          </div>
        </div>

        {chapters.length > 0 && (
          <nav
            data-slot="video-player-chapters"
            aria-label={labels.chapters}
            className="flex min-w-0 flex-col gap-2"
          >
            <p className="eyebrow">{labels.chapters}</p>
            <ol className="flex flex-col border-t">
              {chapters.map((chapter, index) => {
                const active = index === activeChapter
                return (
                  <li key={`${chapter.time}-${chapter.label}`}>
                    <button
                      type="button"
                      aria-current={active ? "true" : undefined}
                      disabled={hasError}
                      onClick={() => {
                        seek(chapter.time)
                        play()
                      }}
                      className={cn(
                        "flex w-full items-baseline gap-3 border-b px-2 py-2 text-left text-sm outline-none",
                        "transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring disabled:opacity-50",
                        active
                          ? "border-l-2 border-l-brand font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <span className="w-12 shrink-0 font-mono text-xs tabular-nums">
                        {formatTimestamp(chapter.time)}
                      </span>
                      <span className="min-w-0 flex-1">{chapter.label}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        )}
      </div>
    </div>
  )
}

export { VideoPlayer, SAMPLE_VIDEO_CHAPTERS, PLAYBACK_SPEEDS }
export type {
  VideoPlayerProps,
  VideoPlayerLabels,
  VideoChapter,
  VideoCaptionTrack,
}
