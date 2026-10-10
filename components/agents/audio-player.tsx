// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"
import {
  LoaderCircle,
  Pause,
  Play,
  SkipBack,
  SkipForward,
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
import { Slider } from "@/components/ui/slider"

/** Formats seconds as `m:ss`, or `h:mm:ss` from one hour up. */
function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = String(total % 60).padStart(2, "0")
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${secs}`
    : `${minutes}:${secs}`
}

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

const AudioPlayerContext = React.createContext<AudioPlayerApi<unknown> | null>(
  null
)
const AudioPlayerTimeContext = React.createContext<number | null>(null)

/** Access the player state and controls. Must be used inside `AudioPlayerProvider`. */
function useAudioPlayer<TData = unknown>() {
  const api = React.useContext(AudioPlayerContext)
  if (!api) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider")
  }
  return api as AudioPlayerApi<TData>
}

/** Current playback position in seconds. Updates every frame while playing. */
function useAudioPlayerTime() {
  const time = React.useContext(AudioPlayerTimeContext)
  if (time === null) {
    throw new Error(
      "useAudioPlayerTime must be used within AudioPlayerProvider"
    )
  }
  return time
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

/**
 * Owns a hidden `<audio>` element and exposes its state through context. Works
 * with any `src` the browser can play, including blob and data URLs.
 */
function AudioPlayerProvider<TData = unknown>({
  src,
  tracks: tracksProp,
  autoAdvance = true,
  children,
}: AudioPlayerProviderProps<TData>) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const rafRef = React.useRef<number | null>(null)
  const playOnLoadRef = React.useRef(false)

  const [activeId, setActiveId] = React.useState<string | number | null>(null)
  const [time, setTime] = React.useState(0)
  const [duration, setDuration] = React.useState<number | undefined>()
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isBuffering, setIsBuffering] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [playbackRate, setRate] = React.useState(1)
  const [volume, setVolumeState] = React.useState(1)
  const [muted, setMutedState] = React.useState(false)

  const tracks = React.useMemo<AudioPlayerTrack<TData>[]>(
    () => tracksProp ?? (src ? [{ id: "default", src }] : []),
    [tracksProp, src]
  )
  const activeIndex = Math.max(
    0,
    tracks.findIndex((track) => track.id === activeId)
  )
  const activeTrack = tracks[activeIndex] ?? null
  const hasNext = activeIndex < tracks.length - 1
  const hasPrevious = activeIndex > 0

  const stopTicker = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }

  const startTicker = () => {
    if (rafRef.current != null) return
    const tick = () => {
      const audio = audioRef.current
      if (!audio) {
        rafRef.current = null
        return
      }
      setTime(audio.currentTime)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  React.useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    },
    []
  )

  const startPlayback = () => {
    audioRef.current?.play().catch(() => {
      // Autoplay policy or an aborted load. The pause/error events report state.
    })
  }

  const play = (target?: AudioPlayerTrack<TData> | string | number) => {
    const id = typeof target === "object" ? target.id : target
    if (id === undefined || id === activeTrack?.id) {
      startPlayback()
      return
    }
    // A different track: swap the source, then start once it can play.
    playOnLoadRef.current = true
    setActiveId(id)
  }

  const goTo = (index: number) => {
    const track = tracks[index]
    if (!track) return
    playOnLoadRef.current = isPlaying
    setActiveId(track.id)
  }

  const api: AudioPlayerApi<TData> = {
    ref: audioRef,
    tracks,
    activeTrack,
    duration,
    isPlaying,
    isBuffering,
    hasError,
    playbackRate,
    volume,
    muted,
    hasNext,
    hasPrevious,
    isTrackActive: (id) => activeTrack?.id === id,
    play,
    pause: () => audioRef.current?.pause(),
    toggle: () => (isPlaying ? audioRef.current?.pause() : startPlayback()),
    seek: (to) => {
      const audio = audioRef.current
      if (!audio) return
      audio.currentTime = to
      setTime(to)
    },
    next: () => goTo(activeIndex + 1),
    previous: () => {
      // Like most players: restart first, go back when already near the start.
      if (time > 3 || !hasPrevious) {
        const audio = audioRef.current
        if (audio) audio.currentTime = 0
        setTime(0)
        return
      }
      goTo(activeIndex - 1)
    },
    setPlaybackRate: (rate) => {
      const audio = audioRef.current
      if (!audio) return
      // defaultPlaybackRate survives a source change, playbackRate does not.
      audio.defaultPlaybackRate = rate
      audio.playbackRate = rate
    },
    setVolume: (next) => {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = Math.min(Math.max(next, 0), 1)
      if (next > 0 && audio.muted) audio.muted = false
    },
    setMuted: (next) => {
      if (audioRef.current) audioRef.current.muted = next
    },
  }

  return (
    <AudioPlayerContext.Provider value={api as AudioPlayerApi<unknown>}>
      <AudioPlayerTimeContext.Provider value={time}>
        <audio
          ref={audioRef}
          src={activeTrack?.src}
          preload="metadata"
          className="hidden"
          onLoadStart={() => {
            setTime(0)
            setDuration(undefined)
            setHasError(false)
            setIsBuffering(true)
          }}
          onLoadedMetadata={(event) => {
            const value = event.currentTarget.duration
            setDuration(Number.isFinite(value) ? value : undefined)
          }}
          onDurationChange={(event) => {
            const value = event.currentTarget.duration
            setDuration(Number.isFinite(value) ? value : undefined)
          }}
          onCanPlay={() => {
            setIsBuffering(false)
            if (playOnLoadRef.current) {
              playOnLoadRef.current = false
              startPlayback()
            }
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onPlay={() => {
            setIsPlaying(true)
            startTicker()
          }}
          onPause={(event) => {
            setIsPlaying(false)
            stopTicker()
            setTime(event.currentTarget.currentTime)
          }}
          onSeeked={(event) => setTime(event.currentTarget.currentTime)}
          onEnded={() => {
            setIsPlaying(false)
            stopTicker()
            if (autoAdvance && hasNext) {
              playOnLoadRef.current = true
              setActiveId(tracks[activeIndex + 1].id)
            }
          }}
          onError={() => {
            setHasError(true)
            setIsBuffering(false)
            setIsPlaying(false)
            stopTicker()
          }}
          onRateChange={(event) => setRate(event.currentTarget.playbackRate)}
          onVolumeChange={(event) => {
            setVolumeState(event.currentTarget.volume)
            setMutedState(event.currentTarget.muted)
          }}
        />
        {children}
      </AudioPlayerTimeContext.Provider>
    </AudioPlayerContext.Provider>
  )
}

type AudioPlayerButtonProps<TData = unknown> = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  /** Play this track instead of the active one. Shows its own play state. */
  track?: AudioPlayerTrack<TData>
}

/** Play/pause toggle with a buffering state. */
function AudioPlayerButton<TData = unknown>({
  track,
  className,
  onClick,
  ...props
}: AudioPlayerButtonProps<TData>) {
  const player = useAudioPlayer<TData>()
  const mine = track ? player.isTrackActive(track.id) : true
  const playing = mine && player.isPlaying
  const loading = mine && player.isPlaying && player.isBuffering

  return (
    <Button
      data-slot="audio-player-button"
      type="button"
      size="icon"
      aria-label={playing ? "Pause" : "Play"}
      className={className}
      onClick={(event) => {
        if (playing) player.pause()
        else player.play(track)
        onClick?.(event)
      }}
      {...props}
    >
      {loading ? (
        <LoaderCircle
          className="animate-spin motion-reduce:animate-none"
          aria-hidden
        />
      ) : playing ? (
        <Pause aria-hidden />
      ) : (
        <Play aria-hidden />
      )}
    </Button>
  )
}

/** Previous/next track buttons. Previous restarts the track when it has played a few seconds. */
function AudioPlayerSkip({
  direction,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  direction: "previous" | "next"
}) {
  const player = useAudioPlayer()
  const previous = direction === "previous"
  return (
    <Button
      data-slot="audio-player-skip"
      type="button"
      variant="ghost"
      size="icon"
      aria-label={previous ? "Previous track" : "Next track"}
      disabled={previous ? false : !player.hasNext}
      className={className}
      onClick={previous ? player.previous : player.next}
      {...props}
    >
      {previous ? <SkipBack aria-hidden /> : <SkipForward aria-hidden />}
    </Button>
  )
}

/** Seek slider built on `Slider`. Space toggles playback while it has focus. */
function AudioPlayerProgress({
  className,
  onPointerDown,
  onPointerUp,
  onKeyDown,
  ...props
}: Omit<
  React.ComponentProps<typeof Slider>,
  "min" | "max" | "value" | "defaultValue" | "onValueChange" | "aria-label"
>) {
  const player = useAudioPlayer()
  const time = useAudioPlayerTime()
  const resumeRef = React.useRef(false)
  const duration = player.duration ?? 0

  return (
    <Slider
      data-slot="audio-player-progress"
      aria-label="Seek"
      min={0}
      max={duration}
      step={0.25}
      value={[Math.min(time, duration)]}
      disabled={!duration}
      onValueChange={([to]) => player.seek(to)}
      onPointerDown={(event) => {
        resumeRef.current = player.isPlaying
        player.pause()
        onPointerDown?.(event)
      }}
      onPointerUp={(event) => {
        if (resumeRef.current) player.play()
        resumeRef.current = false
        onPointerUp?.(event)
      }}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault()
          player.toggle()
        }
        onKeyDown?.(event)
      }}
      className={className}
      {...props}
    />
  )
}

/** Elapsed time. */
function AudioPlayerTime({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const time = useAudioPlayerTime()
  return (
    <span
      data-slot="audio-player-time"
      className={cn(
        "font-mono text-xs text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {formatTime(time)}
    </span>
  )
}

/** Total length, or `--:--` until metadata loads. */
function AudioPlayerDuration({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { duration } = useAudioPlayer()
  return (
    <span
      data-slot="audio-player-duration"
      className={cn(
        "font-mono text-xs text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {duration === undefined ? "--:--" : formatTime(duration)}
    </span>
  )
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

type AudioPlayerSpeedProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  /** Selectable rates. */
  speeds?: readonly number[]
}

/** Playback speed menu. */
function AudioPlayerSpeed({
  speeds = PLAYBACK_SPEEDS,
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: AudioPlayerSpeedProps) {
  const { playbackRate, setPlaybackRate } = useAudioPlayer()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-slot="audio-player-speed"
          type="button"
          variant={variant}
          size={size}
          aria-label={`Playback speed, ${playbackRate}x`}
          className={cn("font-mono text-xs tabular-nums", className)}
          {...props}
        >
          {playbackRate}x
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuLabel>Speed</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={String(playbackRate)}
          onValueChange={(value) => setPlaybackRate(Number(value))}
        >
          {speeds.map((speed) => (
            <DropdownMenuRadioItem key={speed} value={String(speed)}>
              <span className="font-mono tabular-nums">
                {speed === 1 ? "Normal" : `${speed}x`}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Mute button and volume slider. */
function AudioPlayerVolume({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  const { volume, muted, setVolume, setMuted } = useAudioPlayer()
  const silent = muted || volume === 0
  return (
    <div
      data-slot="audio-player-volume"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={silent ? "Unmute" : "Mute"}
        aria-pressed={silent}
        onClick={() => (volume === 0 ? setVolume(1) : setMuted(!muted))}
      >
        {silent ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
      </Button>
      <Slider
        aria-label="Volume"
        className="w-20"
        min={0}
        max={1}
        step={0.05}
        value={[muted ? 0 : volume]}
        onValueChange={([next]) => setVolume(next)}
      />
    </div>
  )
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

/** A complete player: transport, seek bar, speed, volume and an optional playlist. */
function AudioPlayer<TData = unknown>({
  src,
  tracks,
  autoAdvance,
  title,
  speeds,
  showVolume = true,
  showPlaylist = true,
  className,
  ...props
}: AudioPlayerProps<TData>) {
  return (
    <AudioPlayerProvider<TData>
      src={src}
      tracks={tracks}
      autoAdvance={autoAdvance}
    >
      <div
        data-slot="audio-player"
        role="group"
        aria-label="Audio player"
        className={cn(
          "flex w-full flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground",
          className
        )}
        {...props}
      >
        <AudioPlayerBody
          title={title}
          speeds={speeds}
          showVolume={showVolume}
        />
        {showPlaylist && <AudioPlayerPlaylist<TData> />}
      </div>
    </AudioPlayerProvider>
  )
}

function AudioPlayerBody({
  title,
  speeds,
  showVolume,
}: {
  title?: string
  speeds?: readonly number[]
  showVolume: boolean
}) {
  const { activeTrack, tracks, hasError } = useAudioPlayer()
  const heading = activeTrack?.title ?? title
  return (
    <>
      <div className="flex items-center gap-3">
        {tracks.length > 1 && <AudioPlayerSkip direction="previous" />}
        <AudioPlayerButton />
        {tracks.length > 1 && <AudioPlayerSkip direction="next" />}
        <div className="min-w-0 flex-1">
          {heading && <p className="truncate text-sm font-medium">{heading}</p>}
          {activeTrack?.subtitle && (
            <p className="truncate text-xs text-muted-foreground">
              {activeTrack.subtitle}
            </p>
          )}
        </div>
      </div>
      {hasError && (
        <p role="alert" className="text-xs text-destructive">
          This audio could not be loaded.
        </p>
      )}
      <div className="flex items-center gap-3">
        <AudioPlayerTime className="w-10 shrink-0" />
        <AudioPlayerProgress />
        <AudioPlayerDuration className="w-10 shrink-0 text-right" />
      </div>
      <div className="-mx-1 flex flex-wrap items-center justify-between gap-2">
        <AudioPlayerSpeed speeds={speeds} />
        {showVolume && <AudioPlayerVolume />}
      </div>
    </>
  )
}

/** Track list for the active player. Clicking a row plays that track. */
function AudioPlayerPlaylist<TData = unknown>({
  className,
  ...props
}: Omit<React.ComponentProps<"ul">, "children">) {
  const player = useAudioPlayer<TData>()
  if (player.tracks.length < 2) return null
  return (
    <ul
      data-slot="audio-player-playlist"
      aria-label="Tracks"
      className={cn("flex flex-col border-t pt-2", className)}
      {...props}
    >
      {player.tracks.map((track, index) => {
        const active = player.isTrackActive(track.id)
        return (
          <li key={track.id}>
            <button
              type="button"
              aria-current={active ? "true" : undefined}
              onClick={() => player.play(track)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm outline-none",
                "transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <span className="w-4 shrink-0 font-mono text-xs tabular-nums">
                {active && player.isPlaying ? (
                  <Play
                    className="size-3 fill-current text-brand"
                    aria-hidden
                  />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  active && "font-medium"
                )}
              >
                {track.title ?? `Track ${index + 1}`}
              </span>
              {track.subtitle && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {track.subtitle}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export {
  AudioPlayer,
  AudioPlayerProvider,
  AudioPlayerButton,
  AudioPlayerSkip,
  AudioPlayerProgress,
  AudioPlayerTime,
  AudioPlayerDuration,
  AudioPlayerSpeed,
  AudioPlayerVolume,
  AudioPlayerPlaylist,
  useAudioPlayer,
  useAudioPlayerTime,
}
export type {
  AudioPlayerProps,
  AudioPlayerProviderProps,
  AudioPlayerTrack,
  AudioPlayerApi,
  AudioPlayerButtonProps,
  AudioPlayerSpeedProps,
}
