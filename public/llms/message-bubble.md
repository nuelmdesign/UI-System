# Message Bubble

Chat bubble surfaces with variants, a pop-in entrance and a collapsible body.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/message-bubble
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://opendraft-ui.vercel.app/llms.txt.

## Import

```tsx
import { MessageBubble, MessageBubbleContent, MessageBubbleGroup, MessageBubbleCollapsible } from "@/components/agents/message-bubble"
```

Files added to the project:

- `components/agents/message-bubble.tsx`
- `components/agents/message-context.tsx`

## Dependencies

- npm: `motion`, `lucide-react`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/motion`

## Props and types

```ts
export type MessageBubbleVariant =
  "solid" | "soft" | "tint" | "outline" | "ghost" | "danger"

export type MessageBubbleAlign = "start" | "end"

export interface MessageBubbleProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  variant?: MessageBubbleVariant
  /** Defaults to the surrounding Message alignment when omitted. */
  align?: MessageBubbleAlign
  /** Plays the bubble entrance once when this component mounts. */
  animateIn?: boolean
  children?: ReactNode
}

export interface MessageBubbleContentProps extends ComponentPropsWithRef<"div"> {
  /** Replaces the content element while preserving bubble styling. */
  render?: ReactElement
}

export interface MessageBubbleGroupProps extends ComponentPropsWithRef<"div"> {
  spacing?: "compact" | "default"
}

export interface MessageBubbleCollapsibleProps extends ComponentPropsWithRef<"div"> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  collapsedLines?: 2 | 3 | 4 | 5 | 6
  moreLabel?: ReactNode
  lessLabel?: ReactNode
  contentClassName?: string
  triggerClassName?: string
  children?: ReactNode
}
```

## Example

```tsx
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
```

Live docs: https://opendraft-ui.vercel.app/docs/message-bubble. Rules for building with opendraft: https://opendraft-ui.vercel.app/llms.txt
