"use client"

import * as React from "react"
import { motion } from "motion/react"
import { toast } from "sonner"
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Command,
  CreditCard,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  SquareStack,
  Trash2,
  User,
  Zap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AnimatedNumber } from "@/components/motion/animated-number"
import { BlurText } from "@/components/motion/blur-text"
import { ShimmerText } from "@/components/motion/shimmer-text"
import { SpotlightCard } from "@/components/motion/spotlight-card"
import { Marquee } from "@/components/motion/marquee"
import { Reveal } from "@/components/motion/reveal"
import { Magnetic } from "@/components/motion/magnetic"
import { CopyButton } from "@/components/motion/copy-button"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { AgentsSection } from "@/components/site/agents-section"
import { CELLS } from "@/components/site/cells"
import {
  CommandPaletteDemo,
  DataTableDemo,
  DateRangeDemo,
  DrawerDemo,
} from "@/components/site/app-demos"
import { PixelField } from "@/components/motion/pixel-field"
import { PromptInput } from "@/components/agents/prompt-input"

const NAV = [
  { href: "#foundations", label: "Foundations" },
  { href: "#components", label: "Components" },
  { href: "#motion", label: "Motion" },
  { href: "#agents", label: "Agents" },
  { href: "#compose", label: "Compose" },
]

export function Showcase() {
  return (
    <div className="relative flex-1">
      <AnnouncementBar />
      <Header />
      <main className="mx-auto w-full max-w-6xl border-x">
        <Hero />
        <Section>
          <Foundations />
        </Section>
        <Section>
          <Components />
        </Section>
        <Band />
        <Section>
          <MotionSection />
        </Section>
        <Section>
          <AgentsSection
            heading={
              <SectionHeading
                id="agents"
                eyebrow="AI agents"
                title="Built for agent interfaces"
                description="Voice, chat and tool-use pieces adapted from beUI, restyled to the same tokens and motion."
              />
            }
          />
        </Section>
        <Section>
          <Compose />
        </Section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-x border-t px-4 py-6 text-muted-foreground sm:px-8">
        <span className="eyebrow">nuelm/ui · 0.2</span>
        <span className="text-sm">Built on shadcn, Radix and Motion.</span>
      </footer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function AnnouncementBar() {
  return (
    <a
      href="#agents"
      className="flex h-9 items-center justify-center gap-2 border-b bg-ink px-4 text-xs text-ink-foreground/80 transition-colors hover:text-ink-foreground dark:bg-surface dark:text-muted-foreground dark:hover:text-foreground"
    >
      <span className="truncate">
        <span className="text-ink-foreground dark:text-foreground">
          nuelm/ui 0.2
        </span>{" "}
        · A new editorial direction, plus 18 agent components
      </span>
      <ArrowRight className="size-3.5 shrink-0" />
    </a>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 border-x px-4 sm:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-xl tracking-[-0.01em]">
            nuelm<span className="text-muted-foreground">/ui</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ink" size="sm" caps asChild>
            <a href="#components">Get started</a>
          </Button>
        </div>
      </div>
    </header>
  )
}

/** 3×3 pixel mark: the blue scale stepping down a diagonal. */
function Logo() {
  const cells = [
    "bg-blue-700",
    "bg-blue-500",
    "bg-blue-300",
    "bg-blue-500",
    "bg-blue-300",
    "bg-blue-100",
    "bg-blue-300",
    "bg-blue-100",
    "bg-transparent",
  ]
  return (
    <span aria-hidden className="grid size-5 grid-cols-3 gap-px">
      {cells.map((c, i) => (
        <span key={i} className={c} />
      ))}
    </span>
  )
}

const HERO_MODELS = [
  { value: "fast", label: "Agent 5.6 · Fast", icon: <Zap /> },
  { value: "deep", label: "Agent 5.6 · Deep", icon: <Sparkles /> },
]

const STATS = [
  { value: "60+", label: "Components, hooks and tokens", icon: <Command /> },
  { value: "18", label: "Agent interface pieces", icon: <Sparkles /> },
  { value: "1", label: "Token file for both themes", icon: <SquareStack /> },
]

function Hero() {
  return (
    <section className="border-b">
      <div className="bg-dots px-4 pt-16 pb-12 sm:px-8 sm:pt-24">
        <Badge variant="outline" className="mb-8 gap-2 bg-card py-1 pr-2 pl-1">
          <span className="grid size-4 place-items-center bg-primary font-mono text-[9px] text-primary-foreground">
            N
          </span>
          Built on shadcn, Radix and Motion
        </Badge>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] font-light tracking-[-0.03em] sm:text-7xl">
          <span className="text-muted-foreground">Design once.</span> Build
          everything with it.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-muted-foreground">
          A personal design system for apps and agent interfaces. Every
          component is source you own, installed straight into your project from
          one registry.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button variant="outline" size="lg" caps asChild>
            <a href="#components">Browse components</a>
          </Button>
          <Button size="lg" caps asChild>
            <a href="#agents">
              <ArrowRight /> See agent pieces
            </a>
          </Button>
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-8 sm:pb-8">
        <PixelField
          variant="mosaic"
          className="grid min-h-[380px] place-items-center border p-4 sm:min-h-[460px]"
        >
          <div className="mx-auto w-[min(560px,100%)] border bg-card p-2 shadow-xl">
            <p className="px-2 pt-1.5 pb-2.5 eyebrow text-muted-foreground">
              Automate tasks
            </p>
            <PromptInput
              models={HERO_MODELS}
              placeholder="How can I help you today?"
              onSubmit={(prompt) => {
                toast("Prompt sent", { description: prompt })
              }}
            />
          </div>
        </PixelField>
      </div>

      <div className={cn(CELLS, "border-t-0 border-l-0 sm:grid-cols-3")}>
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 px-4 py-6 last:border-r-0 sm:px-8"
          >
            <span className="grid size-10 shrink-0 place-items-center border text-foreground [&_svg]:size-4">
              {stat.icon}
            </span>
            <div>
              <p className="font-display text-3xl font-light tracking-[-0.02em]">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t py-6">
        <Marquee duration={40} gap="3.5rem">
          {STACK.map((name) => (
            <span
              key={name}
              className="font-display text-2xl tracking-[-0.01em] text-muted-foreground/70"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

const STACK = [
  "shadcn/ui",
  "Radix",
  "Motion",
  "Tailwind CSS",
  "beUI",
  "Shiki",
  "Next.js",
  "Geist",
]

/** Full-width black band (dark tokens in both themes) over an equalizer field. */
function Band() {
  return (
    <section className="dark border-b bg-background text-foreground">
      <PixelField variant="equalizer" className="px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="flex items-center gap-2 eyebrow text-muted-foreground">
            <span className="size-2 bg-primary" /> Motion
          </p>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] font-light tracking-[-0.02em] sm:text-5xl">
            One set of springs.{" "}
            <span className="text-muted-foreground">
              Every component moves the same way.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-sm text-muted-foreground">
            Easings, durations and springs live in lib/motion.ts. Anything
            brought in from beUI is retuned to them, so nothing feels borrowed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="ink" caps asChild>
              <a href="#foundations">
                See the springs <ArrowRight />
              </a>
            </Button>
            <Button variant="outline" caps asChild className="bg-transparent">
              <a href="#motion">Motion pieces</a>
            </Button>
          </div>
        </div>
      </PixelField>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-b px-4 py-16 sm:px-8 sm:py-20">
      {children}
    </section>
  )
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <Reveal
      id={id}
      className="mb-10 grid scroll-mt-28 gap-6 md:grid-cols-2 md:items-end"
    >
      <div>
        <p className="flex items-center gap-2 eyebrow text-muted-foreground">
          <span className="size-2 bg-primary" />
          {eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl leading-[1.05] font-light tracking-[-0.02em] sm:text-5xl">
          {title}
        </h2>
      </div>
      <p className="max-w-md text-pretty text-muted-foreground md:justify-self-end">
        {description}
      </p>
    </Reveal>
  )
}

function Specimen({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Reveal className={cn("flex flex-col bg-card", className)}>
      <div className="px-5 pt-5 eyebrow text-muted-foreground">{title}</div>
      <div className="flex flex-1 flex-wrap content-start items-center gap-3 p-5 sm:p-6">
        {children}
      </div>
    </Reveal>
  )
}

/* -------------------------------------------------------------------------- */

const BLUE_SCALE = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const

const NEUTRALS = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["card", "bg-card"],
  ["border", "bg-border"],
  ["muted-fg", "bg-muted-foreground"],
  ["ink", "bg-ink"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["destructive", "bg-destructive"],
] as const

function Foundations() {
  return (
    <>
      <SectionHeading
        id="foundations"
        eyebrow="Foundations"
        title="Tokens decide the look"
        description="Every component reads from one token file. Change a token and the library follows, including anything installed from shadcn or beUI, since the names match."
      />
      <div className={cn(CELLS, "lg:grid-cols-2")}>
        <Specimen title="Blue · primary scale" className="lg:col-span-2">
          <div className="grid w-full grid-cols-6 gap-px sm:grid-cols-11">
            {BLUE_SCALE.map((step) => (
              <div key={step} className="grid gap-2">
                <div
                  className="h-16 ring-1 ring-border ring-inset"
                  style={{ background: `var(--blue-${step})` }}
                />
                <p className="font-mono text-[10px] text-muted-foreground">
                  {step}
                  {step === "600" ? " · primary" : ""}
                </p>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen title="Neutrals & status">
          <div className="grid w-full grid-cols-3 gap-3">
            {NEUTRALS.map(([name, cls]) => (
              <div key={name} className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-6 shrink-0 ring-1 ring-border ring-inset",
                    cls
                  )}
                />
                <span className="truncate font-mono text-[11px] text-muted-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen title="Type · Newsreader / Geist / Geist Mono">
          <div className="grid w-full gap-4">
            <p className="font-display text-4xl leading-none font-light tracking-[-0.02em]">
              Conversations that build momentum
            </p>
            <p className="text-sm text-muted-foreground">
              Geist carries interface text: labels, inputs, body copy and data
              at 13 to 16px.
            </p>
            <p className="flex items-center gap-2 eyebrow text-muted-foreground">
              <span className="size-2 bg-primary" /> 01 / Eyebrow label
            </p>
          </div>
        </Specimen>

        <Specimen title="Shape · square corners, hairlines">
          <div className="flex w-full flex-wrap items-end gap-4">
            {[
              ["xs", "rounded-xs"],
              ["sm", "rounded-sm"],
              ["md", "rounded-md"],
              ["lg", "rounded-lg"],
              ["xl", "rounded-xl"],
              ["2xl", "rounded-2xl"],
            ].map(([name, r]) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "size-12 border border-primary/50 bg-primary/8",
                    r
                  )}
                />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen title="Texture · PixelField">
          <div className="grid w-full grid-cols-2 gap-3">
            <PixelField variant="matrix" className="h-28 border" />
            <PixelField variant="mosaic" cell={14} className="h-28 border" />
          </div>
        </Specimen>

        <MotionTokens />
      </div>
    </>
  )
}

function MotionTokens() {
  const [on, setOn] = React.useState(false)
  const springs = Object.entries(spring) as [
    keyof typeof spring,
    (typeof spring)[keyof typeof spring],
  ][]

  return (
    <Specimen title="Motion · lib/motion.ts" className="lg:col-span-2">
      <div className="w-full space-y-2.5">
        {springs.map(([name, config]) => (
          <div key={name} className="flex items-center gap-4">
            <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">
              {name}
            </span>
            <div className="relative h-7 flex-1 border bg-surface">
              <motion.div
                className="absolute top-[3px] size-5 bg-primary"
                animate={{ left: on ? "calc(100% - 1.5rem)" : "0.1875rem" }}
                transition={config}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-1">
          <Button
            variant="outline"
            size="sm"
            caps
            onClick={() => setOn((v) => !v)}
          >
            Play springs
          </Button>
        </div>
      </div>
    </Specimen>
  )
}

/* -------------------------------------------------------------------------- */

function Components() {
  const [loading, setLoading] = React.useState(false)

  return (
    <>
      <SectionHeading
        id="components"
        eyebrow="Components"
        title="The core set"
        description="Radix handles accessibility and keyboard behavior; tokens handle the look; Motion handles state changes."
      />
      <div className={cn(CELLS, "md:grid-cols-2")}>
        <Specimen title="Button" className="md:col-span-2">
          <Button>Default</Button>
          <Button variant="brand">
            <Sparkles /> Brand
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">
            <Trash2 /> Delete
          </Button>
          <Button variant="link">Link</Button>
          <Separator orientation="vertical" className="!h-6" />
          <Button size="sm" variant="outline">
            Small
          </Button>
          <Button size="icon" variant="outline" aria-label="Add">
            <Plus />
          </Button>
          <Button
            variant="brand"
            loading={loading}
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 1500)
            }}
          >
            Click to load
          </Button>
        </Specimen>

        <Specimen title="Badge">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="brand" dot>
            Brand
          </Badge>
          <Badge variant="success" dot>
            Paid
          </Badge>
          <Badge variant="warning" dot>
            Pending
          </Badge>
          <Badge variant="destructive" dot>
            Failed
          </Badge>
        </Specimen>

        <Specimen title="Switch & Checkbox">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Switch id="s1" defaultChecked />
              <Label htmlFor="s1">Email notifications</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="s2" />
              <Label htmlFor="s2">Weekly digest</Label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Checkbox id="c1" defaultChecked />
              <Label htmlFor="c1">Accept terms</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="c2" />
              <Label htmlFor="c2">Subscribe</Label>
            </div>
          </div>
        </Specimen>

        <Specimen title="Input, Select & Textarea">
          <div className="grid w-full gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label>Plan</Label>
              <Select defaultValue="pro">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Plans</SelectLabel>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" placeholder="Tell us a bit more…" />
            </div>
          </div>
        </Specimen>

        <Specimen title="Tabs — shared-layout indicator">
          <div className="grid w-full gap-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent
                value="overview"
                className="text-sm text-muted-foreground"
              >
                The pill slides with a spring from lib/motion.
              </TabsContent>
              <TabsContent
                value="activity"
                className="text-sm text-muted-foreground"
              >
                12 events in the last 24 hours.
              </TabsContent>
              <TabsContent
                value="settings"
                className="text-sm text-muted-foreground"
              >
                Workspace settings live here.
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="all" variant="underline">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Specimen>

        <Specimen title="Overlays">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite teammates</DialogTitle>
                <DialogDescription>
                  They&apos;ll get an email with a link to join your workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Label htmlFor="invite">Email addresses</Label>
                <Input
                  id="invite"
                  placeholder="ada@example.com, alan@example.com"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="brand"
                    onClick={() => toast.success("Invites sent")}
                  >
                    Send invites
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AccountMenu />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="grid gap-3">
              <p className="text-sm font-medium">Dimensions</p>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label htmlFor="w">Width</Label>
                <Input id="w" defaultValue="100%" className="col-span-2 h-8" />
                <Label htmlFor="h">Height</Label>
                <Input id="h" defaultValue="auto" className="col-span-2 h-8" />
              </div>
            </PopoverContent>
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Search">
                <Search />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Search{" "}
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="outline"
            onClick={() =>
              toast("Deployment queued", {
                description: "Building main@4f2c1a — about 40 seconds.",
                action: { label: "View", onClick: () => {} },
              })
            }
          >
            <Bell /> Toast
          </Button>
        </Specimen>

        <Specimen title="Accordion">
          <Accordion
            type="single"
            collapsible
            defaultValue="a"
            className="w-full"
          >
            <AccordionItem value="a">
              <AccordionTrigger>
                Can I use this in any project?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Components install as source, so they work in any React
                project with Tailwind.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>
                Does it work with shadcn components?
              </AccordionTrigger>
              <AccordionContent>
                The token names match shadcn&apos;s, so stock shadcn and beUI
                components pick up this theme automatically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="c">
              <AccordionTrigger>What about reduced motion?</AccordionTrigger>
              <AccordionContent>
                Motion respects the OS setting everywhere via MotionConfig.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Specimen>

        <Specimen title="Drawer · sheet">
          <DrawerDemo />
        </Specimen>

        <Specimen title="Command palette · ⌘K">
          <CommandPaletteDemo />
        </Specimen>

        <Specimen title="Date range picker">
          <DateRangeDemo />
        </Specimen>

        <Specimen
          title="Data table · sort · resize · reorder · select"
          className="md:col-span-2"
        >
          <DataTableDemo />
        </Specimen>

        <Specimen title="Avatar, Kbd & Skeleton">
          <div className="grid w-full gap-6">
            <div className="flex items-center gap-4">
              <AvatarGroup>
                {["NM", "AL", "GH", "KT"].map((i) => (
                  <Avatar key={i}>
                    <AvatarFallback>{i}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <KbdGroup>
                <Kbd>
                  <Command />
                </Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>P</Kbd>
              </KbdGroup>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="grid flex-1 gap-2">
                <Skeleton className="h-3.5 w-3/5" />
                <Skeleton className="h-3.5 w-2/5" />
              </div>
            </div>
          </div>
        </Specimen>
      </div>
    </>
  )
}

function AccountMenu() {
  const [digest, setDigest] = React.useState(true)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>
          <User /> Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard /> Billing <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Settings /> Settings
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>General</DropdownMenuItem>
            <DropdownMenuItem>Security</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={digest} onCheckedChange={setDigest}>
          Weekly digest
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* -------------------------------------------------------------------------- */

const LOGOS = [
  "Linear",
  "Vercel",
  "Stripe",
  "Raycast",
  "Arc",
  "Family",
  "Mercury",
]

function MotionSection() {
  const [value, setValue] = React.useState(128_430.52)

  return (
    <>
      <SectionHeading
        id="motion"
        eyebrow="Motion"
        title="The feel layer"
        description="Animated pieces in the spirit of beUI, all tuned to the same spring and easing tokens so they feel like one product."
      />
      <div className={cn(CELLS, "md:grid-cols-2")}>
        <Specimen title="AnimatedNumber">
          <div className="flex w-full items-end justify-between gap-4">
            <AnimatedNumber
              value={value}
              format={{ style: "currency", currency: "USD" }}
              className="text-4xl font-semibold tracking-tight"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setValue((v) => Math.max(0, v + (Math.random() - 0.4) * 20_000))
              }
            >
              Randomize
            </Button>
          </div>
        </Specimen>

        <Specimen title="BlurText & ShimmerText">
          <div className="grid gap-3">
            <BlurText
              inView
              text="Text that arrives, word by word."
              className="text-2xl font-semibold tracking-tight"
            />
            <ShimmerText className="text-sm font-medium">
              Thinking through your request…
            </ShimmerText>
          </div>
        </Specimen>

        <SpotlightCard className="rounded-none border-0 bg-card">
          <p className="mb-4 eyebrow text-muted-foreground">SpotlightCard</p>
          <h3 className="font-display text-2xl font-light tracking-[-0.01em]">
            Move your cursor over me
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The border and surface follow the pointer with a brand-tinted glow.
          </p>
        </SpotlightCard>

        <Specimen title="Magnetic & CopyButton">
          <Magnetic strength={0.4}>
            <Button variant="brand" size="lg">
              Hover near me
            </Button>
          </Magnetic>
          <div className="flex items-center gap-2 rounded-md border bg-surface pr-1 pl-3 font-mono text-sm">
            pnpm dlx shadcn add @nuelm/switch
            <CopyButton value="pnpm dlx shadcn add @nuelm/switch" />
          </div>
        </Specimen>

        <Specimen title="Marquee" className="md:col-span-2">
          <Marquee duration={25} gap="3rem" className="w-full py-2">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="text-xl font-semibold tracking-tight text-muted-foreground/70"
              >
                {name}
              </span>
            ))}
          </Marquee>
        </Specimen>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */

const TRANSACTIONS = [
  { name: "Figma", category: "Software", amount: -45, status: "success" },
  {
    name: "Acme Corp",
    category: "Invoice #1042",
    amount: 12_500,
    status: "success",
  },
  {
    name: "AWS",
    category: "Infrastructure",
    amount: -1_284.32,
    status: "warning",
  },
] as const

function Compose() {
  const [range, setRange] = React.useState("30d")
  const balances: Record<string, number> = {
    "7d": 84_210.18,
    "30d": 128_430.52,
    "90d": 342_118.9,
  }

  return (
    <>
      <SectionHeading
        id="compose"
        eyebrow="Compose"
        title="Put together"
        description="A sample banking view assembled only from library parts — the kind of screen this system is for."
      />
      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="min-w-0 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardDescription>Total balance</CardDescription>
              <CardTitle className="text-3xl font-semibold sm:text-4xl">
                <AnimatedNumber
                  value={balances[range]}
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
                  className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent"
                >
                  <Avatar className="size-9">
                    <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.category}
                    </p>
                  </div>
                  <Badge
                    variant={t.status}
                    dot
                    className="hidden sm:inline-flex"
                  >
                    {t.status === "success" ? "Cleared" : "Pending"}
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
            <CardFooter className="justify-between border-t pt-6">
              <span className="text-sm text-muted-foreground">
                3 of 248 transactions
              </span>
              <Button variant="ghost" size="sm">
                View all <ArrowUpRight />
              </Button>
            </CardFooter>
          </Card>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.08}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Send money</CardTitle>
              <CardDescription>Arrives in 1–2 business days.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="to">Recipient</Label>
                <Input id="to" placeholder="Name or account number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amt">Amount</Label>
                <Input id="amt" placeholder="$0.00" inputMode="decimal" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="recurring">Make recurring</Label>
                <Switch id="recurring" />
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                variant="brand"
                className="w-full"
                onClick={() => toast.success("Transfer scheduled")}
              >
                Review transfer
              </Button>
            </CardFooter>
          </Card>
        </Reveal>
      </div>
    </>
  )
}
