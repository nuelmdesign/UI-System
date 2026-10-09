"use client"

import { Header, Hero } from "@/components/site/landing/hero"
import { Demo } from "@/components/site/landing/demo"
import { HowItWorks, Inside } from "@/components/site/landing/features"
import { Theming } from "@/components/site/landing/theming"
import { Gallery } from "@/components/site/landing/gallery"
import { Closing, Faq, Footer } from "@/components/site/landing/closing"

/**
 * The landing page, top to bottom:
 * what it is (hero) → watch it build (demo) → how the link works →
 * what's inside → theming → components → questions → start → footer.
 */
export function Showcase() {
  return (
    <div className="relative flex-1">
      <Header />
      <div className="mx-auto -mt-px w-full max-w-6xl border-x">
        <main>
          <Hero />
          <Demo />
          <HowItWorks />
          <Inside />
          <Theming />
          <Gallery />
          <Faq />
          <Closing />
        </main>
        <Footer />
      </div>
    </div>
  )
}
