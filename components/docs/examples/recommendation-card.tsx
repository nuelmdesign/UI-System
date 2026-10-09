"use client"

import { RecommendationCard } from "@/components/agents/recommendation-card"

export default function RecommendationCardDemo() {
  return (
    <div className="flex w-full justify-center">
      <RecommendationCard onAccept={(key) => console.log("accepted:", key)} />
    </div>
  )
}
