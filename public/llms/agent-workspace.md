# Agent Workspace

AI agent chat workspace: conversation rail, thread with thinking, tool calls and streamed answers, prompt bar and a live task panel.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/agent-workspace
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { AgentWorkspace } from "@/components/blocks/agent-workspace"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/sidebar-nav`, `@opendraft/prompt-bar`, `@opendraft/thinking-trace`, `@opendraft/tool-chips`, `@opendraft/streaming-answer`, `@opendraft/todo-list`, `@opendraft/shimmer-text`

## Props and types

```ts
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
  /** Workspace shown at the top of the history rail. */
  workspace?: SidebarWorkspace
  className?: string
}
```

## Example

```tsx
import { AgentWorkspace } from "@/components/blocks/agent-workspace"

export default function AgentWorkspaceDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <AgentWorkspace />
    </div>
  )
}
```

Live docs: https://ui-system-virid.vercel.app/docs/agent-workspace. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
