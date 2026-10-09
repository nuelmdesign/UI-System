"use client"

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { Code2, FileText, Globe, Table2 } from "lucide-react"

import {
  PromptBar,
  type PromptBarCommand,
  type PromptBarModel,
  type PromptBarSource,
} from "@/components/agents/prompt-bar"
import { SidebarNav, type SidebarRecent } from "@/components/agents/sidebar-nav"
import {
  StreamingAnswer,
  type StreamingSource,
  type StreamingToken,
} from "@/components/agents/streaming-answer"
import {
  ThinkingTrace,
  type ThinkingTraceRow,
} from "@/components/agents/thinking-trace"
import { type TodoItem, TodoList } from "@/components/agents/todo-list"
import {
  ToolChips,
  type ToolChipsLabels,
  type ToolDiff,
  type ToolDiffLine,
  type ToolStep,
} from "@/components/agents/tool-chips"
import { ShimmerText } from "@/components/motion/shimmer-text"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────
 * AGENT WORKSPACE
 * Chat workspace for an AI agent: conversation history rail,
 * a thread whose assistant turns play thinking → tools →
 * streamed answer, a prompt bar, and a live task panel.
 *
 *   send   user message lands, task added
 *  ~0ms    thinking trace plays
 *  settle  tool chips run (700ms per step)
 *  after   answer streams word by word; task completes
 * ───────────────────────────────────────────────────────── */

export type AgentConversation = SidebarRecent

export type AgentUserMessage = {
  id: string
  role: "user"
  text: string
}

export type AgentReply = {
  /** Trace rows shown while the agent thinks. */
  thinking?: ThinkingTraceRow[]
  /** Tool calls run after thinking. */
  tools?: {
    steps: ToolStep[]
    diffs?: ToolDiff[]
    diffLines?: Record<string, ToolDiffLine[]>
    labels?: Partial<ToolChipsLabels>
  }
  /** The streamed answer. */
  answer: StreamingToken[]
  sources?: StreamingSource[]
  followUps?: string[]
}

export type AgentAssistantMessage = AgentReply & {
  id: string
  role: "assistant"
  /** Play thinking and tools before the answer. Defaults to false for history. */
  live?: boolean
}

export type AgentMessage = AgentUserMessage | AgentAssistantMessage

export type AgentWorkspaceProps = {
  conversations?: AgentConversation[]
  messages?: AgentMessage[]
  tasks?: TodoItem[]
  /**
   * Supply the reply for a prompt. When omitted the workspace simulates one;
   * when it returns nothing no reply is added.
   */
  onSend?: (text: string) => AgentReply | void | Promise<AgentReply | void>
  /** Title shown above the thread. */
  title?: string
  placeholder?: string
  className?: string
}

const words = (text: string): StreamingToken[] =>
  text.split(" ").map((word) => ({ text: word }))

export const SAMPLE_CONVERSATIONS: AgentConversation[] = [
  { id: "q3-report", label: "Q3 revenue report" },
  { id: "onboarding", label: "Onboarding checklist" },
  { id: "api-errors", label: "Why are API calls failing?" },
  { id: "pricing", label: "Pricing page copy" },
  { id: "migration", label: "Database migration plan" },
  { id: "standup", label: "Weekly standup summary" },
]

const SAMPLE_TOOLS: NonNullable<AgentReply["tools"]> = {
  steps: [
    {
      icon: "read",
      label: "Read export",
      chip: "revenue-q3.csv",
      mono: true,
      detailMono: false,
      detail: [
        { text: "12,480 rows · 9 columns." },
        { text: "Covers July through September." },
      ],
    },
    {
      icon: "run",
      label: "Aggregate by region",
      chip: "python summarize.py",
      mono: true,
      detailMono: true,
      detail: [
        { text: "✓ 5 regions grouped" },
        { text: "✓ totals reconciled" },
      ],
    },
    {
      icon: "write",
      label: "Write summary",
      chip: "q3-summary.md",
      mono: true,
      detailMono: true,
      detail: [
        { text: "+ ## Q3 highlights", tone: "add" },
        { text: "+ Revenue grew 18% quarter over quarter.", tone: "add" },
      ],
    },
  ],
  diffs: [{ file: "q3-summary.md", add: 42, del: 0 }],
  diffLines: {
    "q3-summary.md": [
      { text: "## Q3 highlights", tone: "add" },
      { text: "Revenue grew 18% quarter over quarter.", tone: "add" },
      { text: "EMEA led growth at 27%.", tone: "add" },
    ],
  },
  labels: { header: "3 tool calls", more: "" },
}

export const SAMPLE_MESSAGES: AgentMessage[] = [
  {
    id: "m1",
    role: "user",
    text: "Summarize last quarter's revenue by region and flag anything unusual.",
  },
  {
    id: "m2",
    role: "assistant",
    thinking: [
      { primary: "Reading the revenue export" },
      { primary: "Grouping by region" },
      { primary: "Comparing against Q2", secondary: "5 regions" },
      { primary: "Drafting the summary" },
    ],
    tools: SAMPLE_TOOLS,
    answer: [
      ...words(
        "Revenue grew 18% quarter over quarter, led by EMEA at 27%. North America was flat, and APAC dipped 4% in September after a delayed launch."
      ),
      { text: "", cite: true },
      ...words("I saved the full breakdown to q3-summary.md."),
    ],
    sources: [
      {
        name: "Revenue export",
        domain: "internal.example.com",
        href: "https://example.com/revenue",
        icon: <Table2 />,
      },
    ],
    followUps: ["Chart revenue by region", "Why did APAC dip in September?"],
  },
]

export const SAMPLE_TASKS: TodoItem[] = [
  { id: "t1", title: "Read the Q3 revenue export", status: "completed" },
  { id: "t2", title: "Group totals by region", status: "completed" },
  {
    id: "t3",
    title: "Flag unusual movements",
    status: "in-progress",
    progress: 60,
  },
  { id: "t4", title: "Draft the stakeholder summary", status: "pending" },
  { id: "t5", title: "Share with the finance channel", status: "pending" },
]

const SOURCES: PromptBarSource[] = [
  {
    key: "attach",
    name: "Add photos & files",
    description: "Upload from your computer",
    icon: <FileText />,
    attach: true,
  },
  {
    key: "data",
    name: "Revenue data",
    description: "Billing and usage tables",
    icon: <Table2 />,
  },
  {
    key: "web",
    name: "Web search",
    description: "Real-time news and info",
    icon: <Globe />,
  },
  {
    key: "repo",
    name: "Codebase",
    description: "Read and edit project files",
    icon: <Code2 />,
  },
]

const COMMANDS: PromptBarCommand[] = [
  { key: "summarize", name: "/summarize", description: "Digest the thread" },
  { key: "plan", name: "/plan", description: "Break work into tasks" },
  { key: "review", name: "/review", description: "Review the latest changes" },
]

const MODELS: PromptBarModel[] = [
  { key: "pro", name: "Pro", tag: "Flagship", flagship: true },
  { key: "standard", name: "Standard", tag: "Balanced" },
  { key: "fast", name: "Fast", tag: "Quick" },
]

const SIMULATED: AgentReply[] = [
  {
    thinking: [
      { primary: "Understanding the request" },
      { primary: "Checking relevant files" },
      { primary: "Outlining an approach" },
    ],
    tools: SAMPLE_TOOLS,
    answer: words(
      "Done. I looked through the data, ran the numbers and wrote up the findings. The biggest change is a steady rise in repeat usage, and nothing looks out of range. Want me to turn this into a chart?"
    ),
    followUps: ["Turn this into a chart", "Share it with the team"],
  },
  {
    thinking: [
      { primary: "Reading the question" },
      { primary: "Weighing two options" },
    ],
    tools: {
      steps: SAMPLE_TOOLS.steps.slice(0, 2),
      labels: { header: "2 tool calls", more: "" },
    },
    answer: words(
      "I would start with the smaller change first. It is easy to review, it unblocks the rest, and you can roll it back on its own if something looks off."
    ),
    followUps: ["Show me the smaller change"],
  },
]

const STEP_MS = 700

type Phase = "thinking" | "tools" | "answer"

function AssistantTurn({
  message,
  onDone,
  onAsk,
}: {
  message: AgentAssistantMessage
  onDone?: (id: string) => void
  onAsk?: (text: string) => void
}) {
  const [phase, setPhase] = useState<Phase>(
    message.live ? "thinking" : "answer"
  )
  const steps = message.tools?.steps.length ?? 0

  /* tools run for one tick per step plus the diff chips, then the answer */
  useEffect(() => {
    if (phase !== "tools") return
    const t = setTimeout(() => setPhase("answer"), (steps + 2) * STEP_MS)
    return () => clearTimeout(t)
  }, [phase, steps])

  const settled = () => setPhase(message.tools ? "tools" : "answer")

  return (
    <div
      data-slot="agent-workspace-assistant"
      className="flex min-w-0 flex-col gap-3"
    >
      {message.live && message.thinking && (
        <ThinkingTrace
          variant="steps"
          rows={message.thinking}
          onSettled={settled}
          className="min-h-0 max-w-full"
        />
      )}
      {message.live && message.tools && phase !== "thinking" && (
        <ToolChips
          steps={message.tools.steps}
          diffs={message.tools.diffs ?? []}
          diffLines={message.tools.diffLines}
          labels={message.tools.labels}
          className="min-h-0 max-w-full"
        />
      )}
      {(phase === "answer" || (message.live && !message.thinking)) && (
        <StreamingAnswer
          loop={false}
          fill
          content={message.answer}
          sources={message.sources ?? []}
          followUps={message.followUps ?? []}
          onDone={() => onDone?.(message.id)}
          onFollowUp={(text) => onAsk?.(text)}
          className="min-h-0"
        />
      )}
    </div>
  )
}

function Header({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b px-4 md:px-6">
      <div className="flex min-w-0 items-baseline gap-3">
        <h2 className="truncate heading text-lg">{title}</h2>
        <span className="hidden eyebrow sm:inline">Agent</span>
      </div>
      {aside}
    </header>
  )
}

export function AgentWorkspace({
  conversations = SAMPLE_CONVERSATIONS,
  messages: initialMessages = SAMPLE_MESSAGES,
  tasks: initialTasks = SAMPLE_TASKS,
  onSend,
  title = "Q3 revenue report",
  placeholder = "Ask the agent to do something…",
  className,
}: AgentWorkspaceProps) {
  const [messages, setMessages] = useState<AgentMessage[]>(initialMessages)
  const [tasks, setTasks] = useState<TodoItem[]>(initialTasks)
  const [pending, setPending] = useState(false)
  const [heading, setHeading] = useState(title)

  const counter = useRef(0)
  const mounted = useRef(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    mounted.current = true
    const pendingTimers = timers.current
    return () => {
      mounted.current = false
      pendingTimers.forEach(clearTimeout)
    }
  }, [])

  /* keep the thread pinned to the newest content as turns grow */
  useEffect(() => {
    const scroller = scrollRef.current
    const content = contentRef.current
    if (!scroller || !content) return
    const follow = () => scroller.scrollTo({ top: scroller.scrollHeight })
    follow()
    const observer = new ResizeObserver(follow)
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  const nextId = (prefix: string) => `${prefix}-${++counter.current}`

  const completeTask = useCallback((taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: "completed", progress: undefined }
          : task
      )
    )
  }, [])

  const handleSend = (raw: string) => {
    const text = raw.trim()
    if (!text) return
    const taskId = nextId("task")
    setMessages((current) => [
      ...current,
      { id: nextId("user"), role: "user", text },
    ])

    const reply = (content: AgentReply) =>
      setMessages((current) => [
        ...current,
        { ...content, id: taskId, role: "assistant", live: true },
      ])

    if (!onSend) {
      setTasks((current) => [
        ...current,
        {
          id: taskId,
          title: text.length > 44 ? `${text.slice(0, 44)}…` : text,
          status: "in-progress",
        },
      ])
      setPending(true)
      const t = setTimeout(() => {
        setPending(false)
        reply(SIMULATED[counter.current % SIMULATED.length])
      }, 600)
      timers.current.push(t)
      return
    }

    setPending(true)
    Promise.resolve(onSend(text))
      .then((result) => {
        if (!mounted.current) return
        setPending(false)
        if (result) reply(result)
      })
      .catch(() => {
        if (mounted.current) setPending(false)
      })
  }

  const reset = () => {
    setMessages([])
    setTasks([])
    setPending(false)
    setHeading("New chat")
  }

  const empty = messages.length === 0 && !pending

  return (
    <div
      data-slot="agent-workspace"
      className={cn(
        "flex h-full min-h-0 w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <div className="hidden h-full shrink-0 border-r md:block">
        <SidebarNav
          fill
          recents={conversations}
          activeTitle={heading}
          onNewChat={reset}
          onPick={(_, label) => setHeading(label)}
        />
      </div>

      <section
        aria-label="Conversation"
        className="flex min-w-0 flex-1 flex-col"
      >
        <Header title={heading} />
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto"
          role="log"
          aria-live="polite"
          aria-label="Messages"
        >
          <div
            ref={contentRef}
            className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6"
          >
            {empty && (
              <div className="flex flex-col items-start gap-1 py-10">
                <h3 className="heading text-2xl">What should we work on?</h3>
                <p className="text-sm text-muted-foreground">
                  Ask the agent to read, analyze or write something. Progress
                  shows up in the task panel.
                </p>
              </div>
            )}
            {messages.map((message) =>
              message.role === "user" ? (
                <div
                  key={message.id}
                  data-slot="agent-workspace-user"
                  className="ml-auto max-w-[85%] animate-fade-up rounded-lg border bg-muted px-3.5 py-2.5 text-sm leading-relaxed"
                >
                  {message.text}
                </div>
              ) : (
                <AssistantTurn
                  key={message.id}
                  message={message}
                  onDone={completeTask}
                  onAsk={handleSend}
                />
              )
            )}
            {pending && (
              <ShimmerText className="text-[13px] font-medium">
                Thinking
              </ShimmerText>
            )}
          </div>
        </div>

        <div className="shrink-0 px-4 pt-2 pb-4 md:px-6">
          <div className="mx-auto w-full max-w-2xl">
            <PromptBar
              demo={false}
              placeholder={placeholder}
              sources={SOURCES}
              commands={COMMANDS}
              models={MODELS}
              onSend={handleSend}
            />
          </div>
        </div>
      </section>

      <aside
        aria-label="Tasks"
        className="hidden h-full w-72 shrink-0 flex-col gap-3 overflow-y-auto border-l p-4 xl:flex"
      >
        <span className="eyebrow">Tasks</span>
        {tasks.length > 0 ? (
          <TodoList items={tasks} title="Plan" maxHeight={420} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Tasks appear here as the agent works.
          </p>
        )}
      </aside>
    </div>
  )
}
