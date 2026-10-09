"use client"

import { ChatPanel } from "@/components/agents/chat-panel"

export default function ChatPanelDemo() {
  return (
    <div className="flex w-full justify-center">
      <ChatPanel
        suggestions={["Flavors", "Suppliers"]}
        onSend={(text) => console.log("sent:", text)}
      />
    </div>
  )
}
