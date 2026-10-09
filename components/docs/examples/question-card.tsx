"use client"

import { QuestionCard } from "@/components/agents/question-card"

export default function QuestionCardDemo() {
  return (
    <div className="flex w-full justify-center">
      <QuestionCard
        questions={[
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
        ]}
        onSubmitted={(answers) => console.log(answers)}
      />
    </div>
  )
}
