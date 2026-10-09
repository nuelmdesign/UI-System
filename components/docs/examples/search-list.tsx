"use client"

import { SearchList } from "@/components/agents/search-list"

export default function SearchListDemo() {
  return (
    <div className="flex w-full justify-center">
      <SearchList onSelect={(item) => console.log("picked:", item)} />
    </div>
  )
}
