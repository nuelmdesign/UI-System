// Adapted from Beautiful UI by Turbo (https://beautifului.dev).
"use client"

import { Check, ChevronDown, ChevronUp, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { GlideMenu } from "@/components/motion/glide-menu"
import { Button } from "@/components/ui/button"
import { ease } from "@/lib/motion"
import { cn } from "@/lib/utils"

/* One question at a time. The stack slides vertically as you move between
 * questions (the card's height animates to fit), the step counter rolls like
 * an odometer, and single-choice answers auto-advance; multi-select waits. */

export type QuestionCardQuestion = {
  q: string
  type: "radio" | "check"
  options: string[]
}

export type QuestionCardLabels = {
  skip: string
  continue: string
  send: string
  customPlaceholder: string
  sentMessage: string
}

export type QuestionCardAnswers = Record<number, number[]>

export interface QuestionCardProps {
  questions?: QuestionCardQuestion[]
  labels?: Partial<QuestionCardLabels>
  onSubmitted?: (answers: QuestionCardAnswers) => void
  onAnswerChange?: (questionIndex: number, answer: number[]) => void
  /** Show a "Start over" action after sending. */
  resettable?: boolean
  className?: string
}

const QUESTIONS: QuestionCardQuestion[] = [
  {
    q: "How many flavors should we launch?",
    type: "radio",
    options: ["Three (core line)", "Five (full case)", "Just one hero"],
  },
  {
    q: "Which mix-ins should we stock?",
    type: "check",
    options: ["Chocolate chips", "Waffle bits", "Sprinkles"],
  },
  {
    q: "Which market do we enter first?",
    type: "radio",
    options: ["Food trucks", "Grocery freezers", "Scoop shops"],
  },
]

const DEFAULT_LABELS: QuestionCardLabels = {
  skip: "Skip",
  continue: "Continue",
  send: "Send",
  customPlaceholder: "Something else…",
  sentMessage: "Answers sent",
}

const AUTO_ADVANCE_MS = 480

/* Odometer digits: each character that changes rolls up (or down). */
function RollingDigits({ value }: { value: string }) {
  const reduce = useReducedMotion() ?? false
  const [prev, setPrev] = useState(value)
  const [dir, setDir] = useState<1 | -1>(1)

  if (prev !== value) {
    const from = parseInt(prev, 10)
    const to = parseInt(value, 10)
    setDir(Number.isFinite(from) && Number.isFinite(to) && to < from ? -1 : 1)
    setPrev(value)
  }

  return (
    <>
      {Array.from(value).map((char, i) => (
        <span
          key={i}
          className="relative inline-flex h-[1em] overflow-hidden leading-none"
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.span
              key={char}
              custom={dir}
              variants={{
                enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%" }),
                center: { y: 0 },
                exit: (d: number) => ({ y: d > 0 ? "-100%" : "100%" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                reduce ? { duration: 0 } : { duration: 0.35, ease: ease.inOut }
              }
              className="inline-block h-[1em] leading-none whitespace-pre"
            >
              {char}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </>
  )
}

export function QuestionCard({
  questions = QUESTIONS,
  labels,
  onSubmitted,
  onAnswerChange,
  resettable = true,
  className,
}: QuestionCardProps) {
  const t = { ...DEFAULT_LABELS, ...labels }
  const reduce = useReducedMotion() ?? false
  const [qi, setQi] = useState(0)
  const [answers, setAnswers] = useState<QuestionCardAnswers>({})
  const [custom, setCustom] = useState<Record<number, string>>({})
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState(true)

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const questionRefs = useRef<(HTMLDivElement | null)[]>([])
  const measured = useRef(false)
  const [viewportH, setViewportH] = useState<number | undefined>(undefined)
  const [trackY, setTrackY] = useState(0)
  const [animate, setAnimate] = useState(false)
  // Until the first question is measured, render only the active one so the
  // initial (and SSR) height is Q1's height, not every question stacked.
  const [ready, setReady] = useState(false)

  const last = qi === questions.length - 1
  const selected = answers[qi] ?? []
  const hasAnswer = selected.length > 0 || Boolean(custom[qi]?.trim())

  useLayoutEffect(() => {
    const item = questionRefs.current[qi]
    if (!item) return
    const withAnim = measured.current && !reduce
    measured.current = true
    setViewportH(item.offsetHeight)
    setTrackY(item.offsetTop)
    setAnimate(withAnim)
    setReady(true)
  }, [qi, answers, custom, open, sent, ready, reduce])

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    },
    []
  )

  const goTo = (next: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    setQi(Math.min(Math.max(next, 0), questions.length - 1))
  }

  const send = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    setSent(true)
    onSubmitted?.(answers)
  }

  const advance = () => {
    if (last) send()
    else goTo(qi + 1)
  }

  const toggle = (index: number) => {
    const type = questions[qi].type
    const picked = answers[qi] ?? []
    const next =
      type === "radio"
        ? [index]
        : picked.includes(index)
          ? picked.filter((item) => item !== index)
          : [...picked, index]
    const nextAnswers = { ...answers, [qi]: next }
    setAnswers(nextAnswers)
    onAnswerChange?.(qi, next)
    if (type === "radio") {
      setCustom((current) => ({ ...current, [qi]: "" }))
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
      advanceTimer.current = setTimeout(() => {
        if (last) {
          setSent(true)
          onSubmitted?.(nextAnswers)
        } else {
          setQi((current) => Math.min(questions.length - 1, current + 1))
        }
      }, AUTO_ADVANCE_MS)
    }
  }

  const reset = () => {
    setQi(0)
    setAnswers({})
    setCustom({})
    setSent(false)
    setOpen(true)
    setReady(false)
    measured.current = false
  }

  if (!open) {
    return (
      <Button
        data-slot="question-card"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className={className}
      >
        Open questions
      </Button>
    )
  }

  if (sent) {
    return (
      <div
        data-slot="question-card"
        data-state="sent"
        className={cn(
          "flex w-full max-w-80 animate-pop-in items-center gap-3",
          className
        )}
      >
        <span className="inline-flex items-center gap-1.5 rounded-md bg-success/10 py-1 pr-2.5 pl-1 text-[12.5px] font-medium text-success">
          <span className="flex size-4.5 items-center justify-center rounded-full bg-success text-primary-foreground">
            <Check className="size-3" strokeWidth={3} />
          </span>
          {t.sentMessage}
        </span>
        {resettable && (
          <button
            type="button"
            onClick={reset}
            className="text-xs font-medium text-muted-foreground/70 transition-colors duration-150 hover:text-foreground"
          >
            Start over
          </button>
        )}
      </div>
    )
  }

  return (
    <div data-slot="question-card" className={cn("w-full max-w-80", className)}>
      <div className="relative animate-fade-up overflow-hidden rounded-lg border bg-card">
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setOpen(false)}
          className="absolute top-2.5 right-2.5 z-10 flex size-7 items-center justify-center rounded-md text-muted-foreground/70 transition-colors duration-100 hover:bg-accent hover:text-foreground"
        >
          <X className="size-3.5" strokeWidth={2.2} />
        </button>
        <div className="p-3">
          {/* the question itself is the heading */}
          <div
            data-slot="question-card-viewport"
            className={cn(
              "overflow-hidden",
              animate && "transition-[height] duration-[360ms] ease-out"
            )}
            style={{ height: viewportH }}
            aria-live="polite"
          >
            <div
              className={cn(
                "flex flex-col gap-[26px] will-change-transform",
                animate && "transition-transform duration-[360ms] ease-out"
              )}
              style={{ transform: `translate3d(0, ${-trackY}px, 0)` }}
            >
              {questions.map((question, qIdx) => {
                const active = qIdx === qi
                if (!ready && !active) return null
                const picked = answers[qIdx] ?? []
                return (
                  <div
                    key={qIdx}
                    ref={(el) => {
                      questionRefs.current[qIdx] = el
                    }}
                    data-slot="question-card-question"
                    aria-hidden={active ? undefined : true}
                    className={cn(
                      animate && "transition-opacity duration-[360ms] ease-out",
                      active ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                  >
                    <div className="pr-7 text-sm font-medium text-foreground">
                      {question.q}
                    </div>
                    <GlideMenu
                      className="mt-2.5 flex flex-col gap-1"
                      highlightClassName="inset-x-0 rounded-md bg-accent"
                    >
                      {question.options.map((option, i) => {
                        const on = picked.includes(i)
                        return (
                          <button
                            key={option}
                            type="button"
                            data-menu-row
                            aria-pressed={on}
                            tabIndex={active ? 0 : -1}
                            onClick={() => {
                              if (active) toggle(i)
                            }}
                            className="relative z-10 flex items-center gap-1.5 rounded-md py-1 pr-2 pl-1 text-left outline-none"
                          >
                            <span
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center transition-colors duration-200",
                                question.type === "radio"
                                  ? "rounded-full"
                                  : "rounded-[2px]",
                                on
                                  ? "bg-primary text-primary-foreground"
                                  : "text-transparent ring-[1.5px] ring-input ring-inset"
                              )}
                            >
                              {question.type === "radio" ? (
                                <span
                                  className={cn(
                                    "size-1.5 rounded-full bg-primary-foreground transition-transform duration-200",
                                    on ? "scale-100" : "scale-0"
                                  )}
                                />
                              ) : (
                                <Check className="size-3" strokeWidth={3} />
                              )}
                            </span>
                            <span
                              className={cn(
                                "text-[13px] leading-none transition-colors duration-200",
                                on ? "text-foreground" : "text-muted-foreground"
                              )}
                            >
                              {option}
                            </span>
                          </button>
                        )
                      })}
                      <label
                        data-menu-row
                        className="relative z-10 flex items-center gap-1.5 rounded-md py-1 pr-2 pl-1"
                      >
                        <input
                          value={custom[qIdx] ?? ""}
                          tabIndex={active ? 0 : -1}
                          onChange={(event) => {
                            if (!active) return
                            const value = event.target.value
                            setCustom((current) => ({
                              ...current,
                              [qIdx]: value,
                            }))
                            if (question.type === "radio")
                              setAnswers((current) => ({
                                ...current,
                                [qIdx]: [],
                              }))
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && hasAnswer) {
                              event.preventDefault()
                              advance()
                            }
                          }}
                          placeholder={t.customPlaceholder}
                          aria-label="Custom answer"
                          className="min-w-0 flex-1 bg-transparent pl-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
                        />
                      </label>
                    </GlideMenu>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* footer: step nav (rolling counter) + actions */}
        <div className="flex items-center justify-between gap-3 border-t px-3 py-2">
          <div className="flex items-center gap-1 text-muted-foreground/70">
            <button
              type="button"
              aria-label="Previous question"
              disabled={qi <= 0}
              onClick={() => goTo(qi - 1)}
              className="flex size-[18px] items-center justify-center rounded-[2px] transition-colors duration-100 enabled:hover:text-foreground disabled:opacity-30"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <span
              data-slot="question-card-step"
              className="inline-flex items-center font-mono text-xs leading-none text-muted-foreground/70 tabular-nums"
            >
              <span className="sr-only">
                Question {qi + 1} of {questions.length}
              </span>
              <span aria-hidden className="inline-flex">
                <RollingDigits value={`${qi + 1} / ${questions.length}`} />
              </span>
            </span>
            <button
              type="button"
              aria-label="Next question"
              disabled={last}
              onClick={() => goTo(qi + 1)}
              className="flex size-[18px] items-center justify-center rounded-[2px] transition-colors duration-100 enabled:hover:text-foreground disabled:opacity-30"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>

          <div className="-mr-0.5 flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => (last ? setOpen(false) : goTo(qi + 1))}
            >
              {t.skip}
            </Button>
            <Button size="xs" disabled={!hasAnswer} onClick={advance}>
              {last ? t.send : t.continue}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
