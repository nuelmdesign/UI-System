"use client"

import { SlidersHorizontal } from "lucide-react"

import { ThemeBuilder } from "@/components/site/theme-builder"
import { Section, SectionIntro } from "@/components/site/landing/shared"

export function Theming() {
  return (
    <Section id="theming" className="scroll-mt-24">
      <SectionIntro
        icon={<SlidersHorizontal />}
        label="Make it yours"
        title="Your fonts, your colors, your corners"
      >
        opendraft&apos;s look is a starting point, not a rule. Pick a heading
        font, a body font, a primary color and how round things should be. Copy
        the prompt and Claude applies it to every component, or copy the CSS and
        paste it in yourself.
      </SectionIntro>
      <ThemeBuilder className="mt-12" />
    </Section>
  )
}
