import { Sparkles } from "lucide-react"

import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageBubbleCollapsible,
  MessageBubbleContent,
  MessageContent,
  MessageGroup,
  MessageTyping,
} from "@/components/agents/message"

const VARIANTS = ["solid", "soft", "tint", "outline", "danger"] as const

export default function MessageBubbleDemo() {
  return (
    <MessageGroup spacing="default" className="w-full max-w-xl">
      <Message from="assistant">
        <MessageAvatar>
          <Sparkles />
        </MessageAvatar>
        <MessageContent>
          <MessageBubble variant="soft">
            <MessageBubbleContent>
              <MessageBubbleCollapsible collapsedLines={2}>
                <p>
                  Launch in three phases. First, an internal beta with the core
                  chat flow and streaming. Second, a private preview with tool
                  results, approvals and citations. Third, general availability
                  with the full sidebar, voice input and analytics.
                </p>
                <p>
                  Each phase ends with a short review of reliability and
                  latency.
                </p>
              </MessageBubbleCollapsible>
            </MessageBubbleContent>
          </MessageBubble>
        </MessageContent>
      </Message>
      <div className="flex flex-wrap gap-2 pt-2">
        {VARIANTS.map((variant) => (
          <MessageBubble key={variant} variant={variant} className="w-auto">
            <MessageBubbleContent className="max-w-none">
              {variant}
            </MessageBubbleContent>
          </MessageBubble>
        ))}
        <MessageBubble variant="soft" className="w-auto">
          <MessageBubbleContent className="max-w-none text-muted-foreground">
            <MessageTyping />
          </MessageBubbleContent>
        </MessageBubble>
      </div>
    </MessageGroup>
  )
}
