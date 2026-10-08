import {
  AgentProgress,
  ReasoningText,
  ThinkingShimmer,
} from "@/components/agents/loading-states"

const PHRASES = [
  "Thinking",
  "Reading the request",
  "Working through the details",
  "Preparing the answer",
]

export default function LoadingStatesDemo() {
  return (
    <div className="grid w-full gap-8 sm:grid-cols-2">
      <div className="grid content-start gap-6">
        <Labeled label="ThinkingShimmer">
          <ThinkingShimmer className="text-base" />
        </Labeled>
        <Labeled label="AgentProgress">
          <AgentProgress
            label="Churning"
            initialSeconds={151.6}
            className="text-base"
          />
        </Labeled>
      </div>
      <div className="grid content-start gap-6">
        <Labeled label="ReasoningText · cascade">
          <ReasoningText
            variant="cascade"
            phrases={PHRASES}
            className="text-base"
          />
        </Labeled>
        <Labeled label="ReasoningText · swap">
          <ReasoningText
            variant="swap"
            phrases={PHRASES}
            className="text-base"
          />
        </Labeled>
        <Labeled label="ReasoningText · scramble">
          <ReasoningText
            variant="scramble"
            phrases={["Thinking", "Searching", "Reasoning", "Composing"]}
            className="text-base"
          />
        </Labeled>
      </div>
    </div>
  )
}

function Labeled({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <span className="eyebrow text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}
