# Chat Panel

Chat panel with context tabs, a scripted reply sequence that starts on send, and a composer.

Category: AI Agents

## Install

```bash
npx shadcn@latest add @opendraft/chat-panel
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { ChatPanel } from "@/components/agents/chat-panel"
```

## Dependencies

- npm: `lucide-react`
- Registry (installed with it): `@opendraft/utils`

## Props and types

```ts
/** One scripted agent reply in the thread. */
export type ChatPanelMessage = {
  label: string
  sub: string
  time: string
  body: string
}

export type ChatPanelLabels = {
  /** The pre-filled prompt shown in the first user bubble. */
  initialPrompt: string
  /** Composer input placeholder. */
  placeholder: string
}

export interface ChatPanelProps {
  /** Scripted agent replies revealed in sequence after the user sends. */
  messages?: ChatPanelMessage[]
  /** Header chips (tabs) for switching context. */
  suggestions?: string[]
  labels?: Partial<ChatPanelLabels>
  /** Fired with the trimmed prompt text when the user sends. */
  onSend?: (text: string) => void
  className?: string
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/chat-panel. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
