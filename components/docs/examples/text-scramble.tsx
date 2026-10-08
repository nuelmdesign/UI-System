"use client"

import * as React from "react"

import { TextScramble } from "@/components/motion/text-scramble"
import { Button } from "@/components/ui/button"

const WORDS = ["Thinking", "Searching", "Reasoning", "Composing"]

export default function TextScrambleDemo() {
  const [index, setIndex] = React.useState(0)

  return (
    <div className="flex flex-wrap items-center gap-6">
      <TextScramble
        text={WORDS[index]}
        className="w-48 font-mono text-2xl tracking-wide uppercase"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIndex((i) => (i + 1) % WORDS.length)}
      >
        Next word
      </Button>
    </div>
  )
}
