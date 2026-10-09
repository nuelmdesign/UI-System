"use client"

import * as React from "react"
import { ArrowUpRight, Check, FileCode2, Play, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { LLMS_URL } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AnimatedNumber } from "@/components/motion/animated-number"
import { CodeBlock } from "@/components/agents/code-block"
import { ThinkingTrace } from "@/components/agents/thinking-trace"
import { StreamingAnswer } from "@/components/agents/streaming-answer"
import { PromptBar } from "@/components/agents/prompt-bar"
import {
  Section,
  SectionIntro,
  GitHubIcon,
} from "@/components/site/landing/shared"

type Example = {
  id: string
  label: string
  prompt: string
  install: string[]
  file: string
  code: string
  Preview: React.ComponentType
}

const EXAMPLES: Example[] = [
  {
    id: "sign-in",
    label: "A sign-in page",
    prompt:
      "A sign-in page with email and password, a “remember me” option, GitHub sign-in and a link to create an account.",
    install: ["card", "input", "label", "checkbox", "button", "separator"],
    file: "app/sign-in/page.tsx",
    code: `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SignInPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="heading text-2xl">
          Welcome back
        </CardTitle>
        <CardDescription>Sign in to your workspace.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <Label className="font-normal text-muted-foreground">
          <Checkbox defaultChecked /> Remember me for 30 days
        </Label>
        <Button className="w-full">Sign in</Button>
        <Separator />
        <Button variant="outline" className="w-full">
          Continue with GitHub
        </Button>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        No account? <a className="ml-1 text-brand">Create one</a>
      </CardFooter>
    </Card>
  )
}`,
    Preview: SignInPreview,
  },
  {
    id: "agent-chat",
    label: "An agent chat",
    prompt:
      "A support chat for our AI agent. Show its reasoning while it works, stream the answer with sources, and add a composer with a model picker.",
    install: ["thinking-trace", "streaming-answer", "prompt-bar"],
    file: "app/support/page.tsx",
    code: `import { PromptBar } from "@/components/agents/prompt-bar"
import { StreamingAnswer } from "@/components/agents/streaming-answer"
import { ThinkingTrace } from "@/components/agents/thinking-trace"

export default function SupportChat() {
  const [settled, setSettled] = useState(false)

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="ml-auto max-w-xs border bg-muted px-3 py-2 text-sm">
        Which flavor is growing fastest this month?
      </p>
      <ThinkingTrace variant="steps" onSettled={() => setSettled(true)} />
      {settled && <StreamingAnswer loop={false} fill />}
      <PromptBar demo={false} className="mt-auto" />
    </div>
  )
}`,
    Preview: AgentChatPreview,
  },
  {
    id: "billing",
    label: "A billing overview",
    prompt:
      "A billing overview with the current balance, a 7, 30 and 90-day switch, and the latest transactions with their status.",
    install: ["card", "tabs", "animated-number", "avatar", "badge", "button"],
    file: "app/billing/page.tsx",
    code: `import { AnimatedNumber } from "@/components/motion/animated-number"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription,
  CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Billing() {
  const [range, setRange] = useState("30d")

  return (
    <Card>
      <CardHeader>
        <CardDescription>Balance</CardDescription>
        <CardTitle className="text-3xl tabular-nums">
          <AnimatedNumber value={BALANCE[range]}
            format={{ style: "currency", currency: "USD" }} />
        </CardTitle>
        <CardAction>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        {TRANSACTIONS.map((t) => (
          <Row key={t.id} {...t} />  // Avatar, name, Badge, amount
        ))}
      </CardContent>
    </Card>
  )
}`,
    Preview: BillingPreview,
  },
]

export function Demo() {
  const [active, setActive] = React.useState(EXAMPLES[0].id)
  const example = EXAMPLES.find((e) => e.id === active) ?? EXAMPLES[0]

  return (
    <Section id="how-it-builds" className="scroll-mt-24">
      <SectionIntro
        icon={<Sparkles />}
        label="See it build"
        title="You describe the screen. Claude assembles it from opendraft."
      >
        Every example starts with the same opendraft link and a plain request.
        Pick one to see what Claude installs, the code it writes and the result.
      </SectionIntro>

      <div
        role="tablist"
        aria-label="Example requests"
        className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2"
      >
        {EXAMPLES.map((e, i) => (
          <React.Fragment key={e.id}>
            {i > 0 && (
              <span
                aria-hidden
                className="hidden h-px w-6 bg-border sm:block"
              />
            )}
            <button
              type="button"
              role="tab"
              aria-selected={e.id === active}
              onClick={() => setActive(e.id)}
              className={cn(
                "flex h-10 items-center gap-2 border bg-card px-4 text-sm transition-colors",
                e.id === active
                  ? "border-brand text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[11px]",
                  e.id === active ? "text-brand" : "text-muted-foreground/70"
                )}
              >
                0{i + 1}
              </span>
              {e.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 border bg-card shadow-sm">
        <div className="flex h-10 items-center gap-3 border-b px-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2 bg-border" />
            <span className="size-2 bg-border" />
            <span className="size-2 bg-border" />
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <FileCode2 className="size-3.5" />
            {example.file}
          </span>
          <span className="ml-auto hidden items-center gap-1.5 font-mono text-xs text-muted-foreground sm:flex">
            <Play className="size-3" /> preview
          </span>
        </div>

        <div
          key={example.id}
          className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
        >
          <div className="flex min-w-0 flex-col gap-4 border-b p-4 sm:p-5 lg:border-r lg:border-b-0">
            <div className="animate-fade-up">
              <p className="eyebrow text-muted-foreground">You</p>
              <p className="mt-2 border bg-muted px-3 py-2.5 text-sm text-pretty">
                {example.prompt}
              </p>
            </div>
            <ol
              className="grid gap-1.5 font-mono text-xs text-muted-foreground"
              aria-label="What Claude did"
            >
              {[
                `Read ${LLMS_URL.replace("https://", "")}`,
                `npx shadcn add ${example.install.map((n) => `@opendraft/${n}`).join(" ")}`,
                `Wrote ${example.file}`,
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex animate-fade-up gap-2"
                  style={{ animationDelay: `${120 + i * 140}ms` }}
                >
                  <Check className="mt-px size-3.5 shrink-0 text-success" />
                  <span className="min-w-0 break-words">{step}</span>
                </li>
              ))}
            </ol>
            <CodeBlock
              code={example.code}
              language="tsx"
              filename={example.file.split("/").pop()}
              status="complete"
              maxHeight={340}
              className="min-w-0"
            />
          </div>
          <div className="grid min-h-[520px] place-items-center bg-dots p-4 sm:p-8">
            <div
              className="w-full animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              <example.Preview />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */

function SignInPreview() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="heading text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your workspace.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="demo-email">Email</Label>
          <Input id="demo-email" type="email" placeholder="you@company.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="demo-password">Password</Label>
          <Input id="demo-password" type="password" defaultValue="opendraft" />
        </div>
        <Label className="font-normal text-muted-foreground">
          <Checkbox defaultChecked /> Remember me for 30 days
        </Label>
        <Button className="w-full" onClick={() => toast.success("Signed in")}>
          Sign in
        </Button>
        <Separator />
        <Button variant="outline" className="w-full">
          <GitHubIcon /> Continue with GitHub
        </Button>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        No account?{" "}
        <a href="#" className="ml-1 text-brand hover:underline">
          Create one
        </a>
      </CardFooter>
    </Card>
  )
}

function AgentChatPreview() {
  const [settled, setSettled] = React.useState(false)
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 border bg-card p-4">
      <p className="ml-auto max-w-xs border bg-muted px-3 py-2 text-sm">
        Which flavor is growing fastest this month?
      </p>
      <ThinkingTrace variant="steps" onSettled={() => setSettled(true)} />
      {settled ? <StreamingAnswer loop={false} fill /> : null}
      <PromptBar demo={false} placeholder="Ask a follow-up…" />
    </div>
  )
}

const BALANCES: Record<string, number> = {
  "7d": 84_210.18,
  "30d": 128_430.52,
  "90d": 342_118.9,
}

const TRANSACTIONS = [
  { name: "Figma", note: "Software", amount: -45, cleared: true },
  { name: "Acme Corp", note: "Invoice #1042", amount: 12_500, cleared: true },
  { name: "AWS", note: "Infrastructure", amount: -1_284.32, cleared: false },
  { name: "Linear", note: "Software", amount: -96, cleared: true },
]

function BillingPreview() {
  const [range, setRange] = React.useState("30d")
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardDescription>Balance</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          <AnimatedNumber
            value={BALANCES[range]}
            format={{ style: "currency", currency: "USD" }}
          />
        </CardTitle>
        <CardAction>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-1">
        {TRANSACTIONS.map((t) => (
          <div
            key={t.name}
            className="-mx-2 flex items-center gap-3 px-2 py-2.5 transition-colors hover:bg-accent"
          >
            <Avatar className="size-8">
              <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">{t.note}</p>
            </div>
            <Badge
              variant={t.cleared ? "success" : "warning"}
              dot
              className="hidden sm:inline-flex"
            >
              {t.cleared ? "Cleared" : "Pending"}
            </Badge>
            <span
              className={cn(
                "w-24 text-right text-sm font-medium tabular-nums",
                t.amount > 0 && "text-success"
              )}
            >
              {t.amount > 0 ? "+" : "−"}$
              {Math.abs(t.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground">4 of 248</span>
        <Button variant="ghost" size="sm">
          View all <ArrowUpRight />
        </Button>
      </CardFooter>
    </Card>
  )
}
