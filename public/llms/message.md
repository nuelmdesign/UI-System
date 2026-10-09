# Message

Message rows with avatar, header, footer, markers and a typing indicator.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/message
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { Message, MessageGroup, MessageAvatar, MessageContent, MessageHeader, MessageFooter, MessageMarker, MessageTyping, MessageBubble, MessageBubbleCollapsible, MessageBubbleContent, MessageBubbleGroup, MessageScroller } from "@/components/agents/message"
```

## Dependencies

- npm: `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`, `@opendraft/message-bubble`, `@opendraft/message-scroller`

## Props and types

```ts
export type MessageFrom = "user" | "assistant"

export interface MessageProps extends Omit<
  ComponentPropsWithRef<typeof motion.article>,
  "children"
> {
  from: MessageFrom
  /** Plays a trailing-edge pop-up once when this message row mounts. */
  animateIn?: boolean
  children: ReactNode
}

export interface MessageGroupProps extends ComponentPropsWithRef<"div"> {
  spacing?: "compact" | "default"
}

export interface MessageAvatarProps extends ComponentPropsWithRef<"div"> {
  /** Keep an empty avatar slot so grouped messages remain aligned. */
  placeholder?: boolean
}

export type MessageContentProps = ComponentPropsWithRef<"div">

export type MessageHeaderProps = ComponentPropsWithRef<"div">

export type MessageFooterProps = ComponentPropsWithRef<"div">

export type MessageMarkerProps = ComponentPropsWithRef<"div">

export interface MessageTypingProps extends ComponentPropsWithRef<"span"> {
  label?: string
}
```

## Example

```tsx
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
```

Live docs: https://opendraft-ui.vercel.app/docs/message. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
