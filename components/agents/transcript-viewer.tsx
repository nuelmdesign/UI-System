// Adapted from ElevenLabs UI (https://github.com/elevenlabs/ui), MIT License, Copyright (c) 2025 Eleven Labs Inc.
"use client"

import * as React from "react"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ScrubBarContainer,
  ScrubBarProgress,
  ScrubBarThumb,
  ScrubBarTimeLabel,
  ScrubBarTrack,
} from "@/components/agents/scrub-bar"

/** One spoken word with its timing in seconds. Words must be sorted by `start`. */
type TranscriptWord = {
  text: string
  start: number
  end: number
}

type TranscriptWordStatus = "spoken" | "current" | "unspoken"

/** Index of the last word that has started by `time`, or -1 before the first. */
function findCurrentIndex(words: TranscriptWord[], time: number) {
  let low = 0
  let high = words.length - 1
  let found = -1
  while (low <= high) {
    const mid = (low + high) >> 1
    if (words[mid].start <= time) {
      found = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return found
}

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

/**
 * Drives a time-aligned transcript from an `<audio>` element. The current word
 * is derived from the playback time, so there is no extra state to keep in sync.
 */
function useTranscriptViewer({
  words,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onDurationChange,
}: UseTranscriptViewerProps): UseTranscriptViewerResult {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const scrubbingRef = React.useRef(false)

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isScrubbing, setIsScrubbing] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [mediaDuration, setMediaDuration] = React.useState<number | undefined>()

  const guessedDuration = words.length ? words[words.length - 1].end : 0
  const duration = mediaDuration ?? guessedDuration

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
      if (!scrubbingRef.current) setCurrentTime(audio.currentTime)
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

  const started = findCurrentIndex(words, currentTime)
  const last = words.length - 1
  const currentIndex =
    started === last && currentTime >= words[last].end ? words.length : started
  const currentWord = words[currentIndex] ?? null

  const seekToTime = (time: number) => {
    const audio = audioRef.current
    if (!audio) return
    const next = Math.min(Math.max(time, 0), duration || time)
    audio.currentTime = next
    setCurrentTime(next)
  }

  const syncDuration = (audio: HTMLAudioElement) => {
    const value = Number.isFinite(audio.duration) ? audio.duration : undefined
    setMediaDuration(value)
    if (value !== undefined) onDurationChange?.(value)
  }

  const audioProps: React.ComponentProps<"audio"> = {
    ref: audioRef,
    preload: "metadata",
    onPlay: () => {
      setIsPlaying(true)
      startTicker()
      onPlay?.()
    },
    onPause: (event) => {
      setIsPlaying(false)
      stopTicker()
      setCurrentTime(event.currentTarget.currentTime)
      onPause?.()
    },
    onEnded: (event) => {
      setIsPlaying(false)
      stopTicker()
      setCurrentTime(event.currentTarget.currentTime)
      onEnded?.()
    },
    onTimeUpdate: (event) => {
      if (!scrubbingRef.current) setCurrentTime(event.currentTarget.currentTime)
      onTimeUpdate?.(event.currentTarget.currentTime)
    },
    onSeeked: (event) => setCurrentTime(event.currentTarget.currentTime),
    onLoadedMetadata: (event) => syncDuration(event.currentTarget),
    onDurationChange: (event) => syncDuration(event.currentTarget),
    onEmptied: () => {
      // The source changed: start over.
      setIsPlaying(false)
      stopTicker()
      setCurrentTime(0)
      setMediaDuration(undefined)
    },
  }

  return {
    words,
    currentIndex,
    currentWord,
    currentTime,
    duration,
    isPlaying,
    isScrubbing,
    play: () => {
      audioRef.current?.play().catch(() => {
        // Autoplay policy or an aborted load. The pause/error events report state.
      })
    },
    pause: () => audioRef.current?.pause(),
    seekToTime,
    seekToWord: (word) => {
      const target = typeof word === "number" ? words[word] : word
      if (target) seekToTime(target.start)
    },
    startScrubbing: () => {
      scrubbingRef.current = true
      setIsScrubbing(true)
    },
    endScrubbing: () => {
      scrubbingRef.current = false
      setIsScrubbing(false)
    },
    audioProps,
  }
}

const TranscriptViewerContext =
  React.createContext<UseTranscriptViewerResult | null>(null)

/** Access the viewer state. Must be used inside `TranscriptViewerContainer`. */
function useTranscriptViewerContext() {
  const context = React.useContext(TranscriptViewerContext)
  if (!context) {
    throw new Error(
      "useTranscriptViewerContext must be used within TranscriptViewerContainer"
    )
  }
  return context
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

/** Owns the hidden audio element and shares playback state with the other parts. */
function TranscriptViewerContainer({
  src,
  words,
  onPlay,
  onPause,
  onTimeUpdate,
  onEnded,
  onDurationChange,
  className,
  children,
  ...props
}: TranscriptViewerContainerProps) {
  const viewer = useTranscriptViewer({
    words,
    onPlay,
    onPause,
    onTimeUpdate,
    onEnded,
    onDurationChange,
  })

  return (
    <TranscriptViewerContext.Provider value={viewer}>
      <div
        data-slot="transcript-viewer-root"
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <audio
          {...viewer.audioProps}
          src={src || undefined}
          className="hidden"
        />
        {children}
      </div>
    </TranscriptViewerContext.Provider>
  )
}

type TranscriptViewerWordProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  word: TranscriptWord
  status: TranscriptWordStatus
  children?: React.ReactNode
}

/** A single word. A real button, so it can be focused and activated by keyboard. */
function TranscriptViewerWord({
  word,
  status,
  className,
  children,
  ...props
}: TranscriptViewerWordProps) {
  return (
    <button
      type="button"
      data-slot="transcript-word"
      data-status={status}
      aria-current={status === "current" ? "true" : undefined}
      className={cn(
        "rounded-sm px-0.5 text-left transition-colors outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring",
        status === "spoken" && "text-foreground hover:bg-accent",
        status === "unspoken" &&
          "text-muted-foreground hover:bg-accent hover:text-foreground",
        status === "current" && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {children ?? word.text}
    </button>
  )
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

/**
 * The transcript text. The current word is highlighted and clicking any word
 * seeks to it. Only one word is in the tab order; arrow keys move between words.
 */
function TranscriptViewerWords({
  className,
  renderWord,
  wordClassName,
  onKeyDown,
  ...props
}: TranscriptViewerWordsProps) {
  const { words, currentIndex, seekToWord } = useTranscriptViewerContext()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const tabbable = Math.min(Math.max(currentIndex, 0), words.length - 1)

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0
    if (!delta) return
    const buttons = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-slot=transcript-word]"
      ) ?? []
    )
    const from = buttons.indexOf(document.activeElement as HTMLButtonElement)
    if (from === -1) return
    event.preventDefault()
    buttons[Math.min(Math.max(from + delta, 0), buttons.length - 1)]?.focus()
  }

  return (
    <div
      ref={containerRef}
      data-slot="transcript-words"
      role="group"
      aria-label="Transcript. Select a word to jump to it."
      className={cn("text-xl leading-relaxed", className)}
      onKeyDown={moveFocus}
      {...props}
    >
      {words.map((word, index) => {
        const status: TranscriptWordStatus =
          index < currentIndex
            ? "spoken"
            : index === currentIndex
              ? "current"
              : "unspoken"
        return (
          <React.Fragment key={`${index}-${word.start}`}>
            <TranscriptViewerWord
              word={word}
              status={status}
              tabIndex={index === tabbable ? 0 : -1}
              className={wordClassName}
              onClick={() => seekToWord(index)}
            >
              {renderWord ? renderWord({ word, status }) : undefined}
            </TranscriptViewerWord>{" "}
          </React.Fragment>
        )
      })}
    </div>
  )
}

type PlayPauseChildren = (state: { isPlaying: boolean }) => React.ReactNode

type TranscriptViewerPlayPauseButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  /** Custom content, or a function of the playing state. Defaults to a play/pause icon. */
  children?: React.ReactNode | PlayPauseChildren
}

/** Play/pause toggle. */
function TranscriptViewerPlayPauseButton({
  className,
  children,
  onClick,
  ...props
}: TranscriptViewerPlayPauseButtonProps) {
  const { isPlaying, play, pause } = useTranscriptViewerContext()
  const Icon = isPlaying ? Pause : Play
  const content =
    typeof children === "function" ? children({ isPlaying }) : children

  return (
    <Button
      data-slot="transcript-play-pause-button"
      type="button"
      variant="outline"
      size="icon"
      aria-label={isPlaying ? "Pause" : "Play"}
      className={className}
      onClick={(event) => {
        if (isPlaying) pause()
        else play()
        onClick?.(event)
      }}
      {...props}
    >
      {content ?? <Icon aria-hidden />}
    </Button>
  )
}

type TranscriptViewerScrubBarProps = Omit<
  React.ComponentProps<typeof ScrubBarContainer>,
  "duration" | "value" | "onScrub" | "onScrubStart" | "onScrubEnd" | "children"
> & {
  /** Show elapsed and remaining time. Defaults to true. */
  showTimeLabels?: boolean
}

/** A `ScrubBar` wired to the viewer: dragging or using the arrow keys seeks the audio. */
function TranscriptViewerScrubBar({
  className,
  showTimeLabels = true,
  ...props
}: TranscriptViewerScrubBarProps) {
  const { duration, currentTime, seekToTime, startScrubbing, endScrubbing } =
    useTranscriptViewerContext()
  return (
    <ScrubBarContainer
      data-slot="transcript-scrub-bar"
      duration={duration}
      value={currentTime}
      onScrub={seekToTime}
      onScrubStart={startScrubbing}
      onScrubEnd={endScrubbing}
      className={cn("flex-col items-stretch gap-1", className)}
      {...props}
    >
      <ScrubBarTrack label="Seek transcript">
        <ScrubBarProgress />
        <ScrubBarThumb />
      </ScrubBarTrack>
      {showTimeLabels && (
        <div className="flex items-center justify-between">
          <ScrubBarTimeLabel time={currentTime} />
          <ScrubBarTimeLabel
            time={duration - currentTime}
            format={(t) => `-${formatRemaining(t)}`}
          />
        </div>
      )}
    </ScrubBarContainer>
  )
}

function formatRemaining(seconds: number) {
  const total = Math.max(0, Math.floor(seconds))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

type TranscriptViewerProps = Omit<TranscriptViewerContainerProps, "children">

/** A complete viewer: transcript text, scrub bar and a play/pause button. */
function TranscriptViewer({ className, ...props }: TranscriptViewerProps) {
  return (
    <TranscriptViewerContainer
      className={cn("rounded-lg border bg-card p-4", className)}
      {...props}
    >
      <TranscriptViewerWords />
      <div className="flex items-center gap-3">
        <TranscriptViewerPlayPauseButton />
        <TranscriptViewerScrubBar className="flex-1" />
      </div>
    </TranscriptViewerContainer>
  )
}

export {
  TranscriptViewer,
  TranscriptViewerContainer,
  TranscriptViewerWords,
  TranscriptViewerWord,
  TranscriptViewerPlayPauseButton,
  TranscriptViewerScrubBar,
  useTranscriptViewer,
  useTranscriptViewerContext,
  findCurrentIndex,
}
export type {
  TranscriptWord,
  TranscriptWordStatus,
  TranscriptViewerProps,
  TranscriptViewerContainerProps,
  TranscriptViewerWordsProps,
  UseTranscriptViewerProps,
  UseTranscriptViewerResult,
}
