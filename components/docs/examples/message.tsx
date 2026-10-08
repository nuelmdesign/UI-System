import { Sparkles } from "lucide-react"

import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageBubbleContent,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  MessageMarker,
  MessageTyping,
} from "@/components/agents/message"

export default function MessageDemo() {
  return (
    <MessageGroup spacing="default" className="w-full max-w-xl">
      <MessageMarker>Today</MessageMarker>
      <Message from="user">
        <MessageAvatar className="bg-brand/15 text-brand">NM</MessageAvatar>
        <MessageContent>
          <MessageHeader>You · 9:41</MessageHeader>
          <MessageBubble variant="solid">
            <MessageBubbleContent>
              Summarise yesterday&apos;s deploys.
            </MessageBubbleContent>
          </MessageBubble>
          <MessageFooter>Read</MessageFooter>
        </MessageContent>
      </Message>
      <Message from="assistant">
        <MessageAvatar>
          <Sparkles />
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Agent · 9:41</MessageHeader>
          <MessageBubble variant="ghost">
            <MessageBubbleContent>
              <p>
                Three deploys shipped. One rolled back after a failed health
                check.
              </p>
            </MessageBubbleContent>
          </MessageBubble>
        </MessageContent>
      </Message>
      <Message from="assistant">
        <MessageAvatar placeholder />
        <MessageContent>
          <MessageBubble>
            <MessageBubbleContent>
              <MessageTyping />
            </MessageBubbleContent>
          </MessageBubble>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
