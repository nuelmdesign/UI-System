"use client"

import * as React from "react"

import { StepNav, type StepNavStep } from "@/components/ui/step-nav"

const lessons: StepNavStep[] = [
  {
    id: "l1",
    label: "Lesson 1",
    description: "Getting started",
    status: "complete",
  },
  {
    id: "l2",
    label: "Lesson 2",
    description: "Core ideas",
    status: "complete",
  },
  { id: "l3", label: "Lesson 3", description: "Worked examples" },
  {
    id: "l4",
    label: "Lesson 4",
    description: "Final quiz",
    status: "locked",
    lockedReason: "Pass lesson 3 to unlock",
  },
]

const onboarding: StepNavStep[] = [
  {
    id: "docs",
    label: "Identity check",
    description: "Upload documents",
    status: "complete",
  },
  { id: "policy", label: "Policy review", description: "Read and accept" },
  {
    id: "equipment",
    label: "Equipment",
    description: "Request devices",
    status: "locked",
    lockedReason: "Awaiting manager approval",
  },
]

export default function StepNavDemo() {
  const [lesson, setLesson] = React.useState("l3")
  const [task, setTask] = React.useState("policy")

  return (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Course lessons</h3>
        <StepNav
          steps={lessons}
          current={lesson}
          onSelect={(s) => setLesson(s.id)}
          labels={{ navigation: "Lessons" }}
        />
      </section>
      <section className="flex flex-col gap-3">
        <h3 className="heading text-xl">Employee onboarding</h3>
        <StepNav
          orientation="vertical"
          steps={onboarding}
          current={task}
          onSelect={(s) => setTask(s.id)}
          labels={{
            navigation: "Onboarding tasks",
            summary: "{done} of {total} tasks done",
          }}
        />
      </section>
    </div>
  )
}
