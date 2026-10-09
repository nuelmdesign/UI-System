"use client"

import * as React from "react"
import {
  Accessibility,
  Bot,
  Braces,
  Component,
  FolderCode,
  Moon,
  Palette,
  Route,
  Waves,
  Workflow,
} from "lucide-react"

import { LLMS_URL } from "@/lib/site"
import { Reveal } from "@/components/motion/reveal"
import { PixelField } from "@/components/motion/pixel-field"
import { COUNTS, Section, SectionIntro } from "@/components/site/landing/shared"

const STEPS = [
  {
    title: "Share the link",
    body: "Paste the opendraft prompt into Claude, or add the link to your project's rules file once.",
    code: LLMS_URL.replace("https://", ""),
  },
  {
    title: "Claude reads the system",
    body: "It learns how to set up a project, the design rules, every token, and what each component is for.",
    code: "rules · tokens · 78 components",
  },
  {
    title: "Real components land in your repo",
    body: "Claude installs them with the shadcn CLI and builds from them. The code is yours to read and change.",
    code: "npx shadcn add @opendraft/card",
  },
]

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="scroll-mt-24">
      <SectionIntro
        icon={<Route />}
        label="How it works"
        title="One link turns Claude into an opendraft developer"
      >
        Without it, an assistant guesses at your UI and every screen comes out a
        little different. With it, Claude works from the same parts and rules
        you do.
      </SectionIntro>

      <div className="mt-14 grid gap-px border bg-border md:grid-cols-3">
        {STEPS.map((step, i) => (
          <Reveal
            key={step.title}
            delay={i * 0.06}
            className="flex flex-col gap-3 bg-card p-6 sm:p-8"
          >
            <span className="font-mono text-xs text-brand">0{i + 1}</span>
            <h3 className="text-lg font-medium tracking-[-0.01em]">
              {step.title}
            </h3>
            <p className="text-sm text-pretty text-muted-foreground">
              {step.body}
            </p>
            <code className="mt-auto block truncate border bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
              {step.code.replace("78", String(COUNTS.total))}
            </code>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

const FEATURES = [
  {
    icon: <Component />,
    title: `${COUNTS.core} core components`,
    body: "Buttons, inputs, dialogs, menus, tables and date pickers, built on Radix.",
  },
  {
    icon: <Bot />,
    title: `${COUNTS.agents} AI agent patterns`,
    body: "Streaming answers, tool calls, approvals and reasoning traces for chat products.",
  },
  {
    icon: <Workflow />,
    title: "Data and workflows",
    body: "Records tables, diffs, flowcharts and insight charts for internal tools.",
  },
  {
    icon: <Palette />,
    title: "One theme file",
    body: "Every color, radius and shadow is a token. Change one and every screen follows.",
  },
  {
    icon: <Moon />,
    title: "Light and dark",
    body: "Each token has a dark value. Any section can go dark with one class.",
  },
  {
    icon: <Waves />,
    title: "Shared motion",
    body: "One set of springs and easings, so every component moves the same way.",
  },
  {
    icon: <Accessibility />,
    title: "Accessible",
    body: "Keyboard and screen-reader support comes from Radix primitives.",
  },
  {
    icon: <Braces />,
    title: "TypeScript",
    body: "Typed props, with the types exported for your own code.",
  },
  {
    icon: <FolderCode />,
    title: "Source you own",
    body: "No package to update or work around. The files live in your repo.",
  },
]

export function Inside() {
  return (
    <section className="dark relative overflow-hidden border-b bg-background px-4 py-20 text-foreground sm:px-8 sm:py-28">
      <PixelField
        variant="equalizer"
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,black_80%)]"
      />
      <div className="relative">
        <SectionIntro
          icon={<Component />}
          label="What's inside"
          title="Everything a product screen needs"
        >
          The usual app components, plus the AI and data pieces most kits leave
          out. All of it shares one set of tokens.
        </SectionIntro>
        <div className="mx-auto mt-14 grid max-w-5xl gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 3) * 0.05}
              className="flex flex-col items-center gap-2 bg-background px-6 py-9 text-center"
            >
              <span className="text-brand [&_svg]:size-5">{f.icon}</span>
              <h3 className="mt-2 text-[15px] font-medium">{f.title}</h3>
              <p className="max-w-64 text-sm text-pretty text-muted-foreground">
                {f.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
