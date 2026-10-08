"use client"

import * as React from "react"
import { AnimatePresence } from "motion/react"
import { MessageSquare, PanelLeft, Sparkles, SquarePen } from "lucide-react"

import { ChatApp } from "@/components/agents/chat-app"
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageBubbleContent,
  MessageContent,
  MessageScroller,
  MessageTyping,
} from "@/components/agents/message"
import { PromptInput } from "@/components/agents/prompt-input"
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarInset,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
} from "@/components/motion/animated-sidebar"
import { Badge } from "@/components/ui/badge"

type Turn = { id: string; from: "user" | "assistant"; text: string }

const CONVERSATIONS: {
  id: string
  title: string
  when: string
  turns: Turn[]
}[] = [
  {
    id: "release",
    title: "First release scope",
    when: "Now",
    turns: [
      { id: "1", from: "user", text: "What should the first release include?" },
      {
        id: "2",
        from: "assistant",
        text: "A prompt, a streamed answer and a way to recover from errors.",
      },
    ],
  },
  {
    id: "tokens",
    title: "Blue scale for charts",
    when: "2h",
    turns: [
      { id: "1", from: "user", text: "Which blues should charts use?" },
      {
        id: "2",
        from: "assistant",
        text: "Steps 300, 500 and 700 stay distinct in both themes.",
      },
    ],
  },
  {
    id: "motion",
    title: "Spring tuning notes",
    when: "Yesterday",
    turns: [
      { id: "1", from: "user", text: "Is snappy too fast for dialogs?" },
      {
        id: "2",
        from: "assistant",
        text: "Use smooth for panels; keep snappy for toggles and presses.",
      },
    ],
  },
]

export default function ChatAppDemo() {
  const [activeId, setActiveId] = React.useState(CONVERSATIONS[0].id)
  const [turns, setTurns] = React.useState<Record<string, Turn[]>>(
    Object.fromEntries(CONVERSATIONS.map((c) => [c.id, c.turns]))
  )
  const [thinking, setThinking] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  const active =
    CONVERSATIONS.find((c) => c.id === activeId) ?? CONVERSATIONS[0]

  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const send = (text: string) => {
    const id = activeId
    setTurns((all) => ({
      ...all,
      [id]: [...all[id], { id: crypto.randomUUID(), from: "user", text }],
    }))
    setThinking(true)
    timer.current = window.setTimeout(() => {
      setThinking(false)
      setTurns((all) => ({
        ...all,
        [id]: [
          ...all[id],
          {
            id: crypto.randomUUID(),
            from: "assistant",
            text: "Noted. I'll fold that into the plan.",
          },
        ],
      }))
    }, 900)
  }

  return (
    <ChatApp sidebarWidth="15rem" className="h-[560px] rounded-none">
      <AnimatedSidebar
        ariaLabel="Conversations"
        collapsible="offcanvas"
        className="min-h-0 w-full"
        panelClassName="h-full bg-surface"
      >
        <AnimatedSidebarContent className="gap-4 px-2 py-4">
          <AnimatedSidebarGroup className="px-1 py-0">
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu>
                <AnimatedSidebarMenuItem>
                  <AnimatedSidebarMenuButton
                    icon={<SquarePen className="size-4" />}
                    onSelect={() => {}}
                  >
                    New chat
                  </AnimatedSidebarMenuButton>
                </AnimatedSidebarMenuItem>
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
          <AnimatedSidebarGroup className="px-1 py-0">
            <AnimatedSidebarGroupLabel className="mb-1 h-8 px-2 eyebrow">
              Recent
            </AnimatedSidebarGroupLabel>
            <AnimatedSidebarGroupContent>
              <AnimatedSidebarMenu className="gap-0.5">
                {CONVERSATIONS.map((c) => (
                  <AnimatedSidebarMenuItem key={c.id}>
                    <AnimatedSidebarMenuButton
                      icon={<MessageSquare className="size-4" />}
                      isActive={c.id === activeId}
                      badge={
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {c.when}
                        </span>
                      }
                      onSelect={() => setActiveId(c.id)}
                      className="font-normal"
                    >
                      {c.title}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                ))}
              </AnimatedSidebarMenu>
            </AnimatedSidebarGroupContent>
          </AnimatedSidebarGroup>
        </AnimatedSidebarContent>
        <AnimatedSidebarRail />
      </AnimatedSidebar>

      <AnimatedSidebarInset className="min-h-0 bg-background">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <AnimatedSidebarTrigger className="size-8 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <PanelLeft aria-hidden className="size-4" />
          </AnimatedSidebarTrigger>
          <p className="min-w-0 truncate font-display text-lg font-light">
            {active.title}
          </p>
          <Badge variant="brand" className="ml-auto">
            Agent 5.6
          </Badge>
        </header>
        <MessageScroller
          className="min-h-0 flex-1"
          contentClassName="flex flex-col gap-5 p-4"
        >
          <AnimatePresence initial={false}>
            {turns[activeId].map((turn) => (
              <Message
                key={`${activeId}-${turn.id}`}
                from={turn.from}
                animateIn
              >
                <MessageAvatar
                  className={
                    turn.from === "user" ? "bg-brand/15 text-brand" : undefined
                  }
                >
                  {turn.from === "user" ? "NM" : <Sparkles />}
                </MessageAvatar>
                <MessageContent>
                  <MessageBubble
                    variant={turn.from === "user" ? "solid" : "ghost"}
                    animateIn
                  >
                    <MessageBubbleContent>{turn.text}</MessageBubbleContent>
                  </MessageBubble>
                </MessageContent>
              </Message>
            ))}
            {thinking ? (
              <Message key="thinking" from="assistant" animateIn>
                <MessageAvatar>
                  <Sparkles />
                </MessageAvatar>
                <MessageContent>
                  <MessageBubble>
                    <MessageBubbleContent>
                      <MessageTyping />
                    </MessageBubbleContent>
                  </MessageBubble>
                </MessageContent>
              </Message>
            ) : null}
          </AnimatePresence>
        </MessageScroller>
        <div className="border-t p-3">
          <PromptInput
            minRows={1}
            loading={thinking}
            onSubmit={send}
            placeholder="Send a message…"
          />
        </div>
      </AnimatedSidebarInset>
    </ChatApp>
  )
}
