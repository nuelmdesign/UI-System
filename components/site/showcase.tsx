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
  Trash2,
  User,
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
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-32 sm:px-6">
        <Hero />
        <Foundations />
        <Components />
        <MotionSection />
        <AgentsSection
          heading={
            <SectionHeading
              id="agents"
              eyebrow="04 — AI Agents"
              title="Built for agent interfaces"
              description="Pieces for voice, chat and tool-using agents, adapted from beUI and tuned to the same tokens."
            />
          }
        />
        <Compose />
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        nuelm/ui — built on shadcn, Radix and Motion.
      </footer>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a
          href="#"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Logo />
          nuelm<span className="text-muted-foreground">/ui</span>
        </a>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <span className="grid size-6 place-items-center rounded-md bg-brand text-brand-foreground [box-shadow:var(--highlight),var(--shadow-sm)]">
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden>
        <path
          d="M3.5 12.5V3.5l9 9V3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function Hero() {
  const install = "npx shadcn add @nuelm/button"
  return (
    <section className="relative py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-20 -z-10 mx-auto h-80 max-w-3xl rounded-full bg-brand/15 blur-3xl"
      />
      <Badge variant="brand" dot className="mb-6">
        v0.1 — foundations
      </Badge>
      <BlurText
        as="h1"
        text="One system for everything you build."
        className="max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl"
      />
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.35 }}
        className="mt-5 max-w-xl text-lg text-pretty text-muted-foreground"
      >
        shadcn structure, Motion feel, one set of tokens. Every component is
        source you own, installed straight into your project.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring.gentle, delay: 0.45 }}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <Magnetic>
          <Button variant="brand" size="lg" asChild>
            <a href="#components">
              Browse components <ArrowRight />
            </a>
          </Button>
        </Magnetic>
        <div className="flex h-10 items-center gap-2 rounded-md border bg-surface pr-1 pl-3 font-mono text-sm text-muted-foreground">
          <span className="text-brand">$</span> {install}
          <CopyButton value={install} />
        </div>
      </motion.div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

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
    <Reveal className="mb-10 scroll-mt-24 pt-16" id={id}>
      <p className="mb-2 font-mono text-xs tracking-wider text-brand uppercase">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
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
    <Reveal
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-card [box-shadow:var(--highlight),var(--shadow-xs)]",
        className
      )}
    >
      <div className="flex h-10 items-center border-b px-4 text-xs font-medium text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-3 p-6">
        {children}
      </div>
    </Reveal>
  )
}

/* -------------------------------------------------------------------------- */

const COLORS = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["card", "bg-card"],
  ["muted", "bg-muted"],
  ["border", "bg-border"],
  ["muted-foreground", "bg-muted-foreground"],
  ["foreground", "bg-foreground"],
  ["primary", "bg-primary"],
  ["brand", "bg-brand"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["destructive", "bg-destructive"],
] as const

const TYPE = [
  ["Display", "text-5xl font-semibold tracking-tighter", "48 / semibold"],
  ["Heading 1", "text-3xl font-semibold tracking-tight", "30 / semibold"],
  ["Heading 2", "text-xl font-semibold tracking-tight", "20 / semibold"],
  ["Body", "text-base", "16 / regular"],
  ["Small", "text-sm text-muted-foreground", "14 / regular"],
  ["Mono", "font-mono text-sm", "14 / Geist Mono"],
] as const

function Foundations() {
  return (
    <>
      <SectionHeading
        id="foundations"
        eyebrow="01 — Foundations"
        title="Tokens decide the look"
        description="Every component reads from these. Change a token and the whole library follows — including anything you install from shadcn or beUI, since the names match."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen title="Color" className="lg:col-span-2">
          <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-6">
            {COLORS.map(([name, cls]) => (
              <div key={name} className="space-y-2">
                <div
                  className={cn(
                    "h-14 rounded-lg ring-1 ring-border ring-inset",
                    cls
                  )}
                />
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen title="Typography — Inter">
          <div className="w-full space-y-3">
            {TYPE.map(([name, cls, meta]) => (
              <div
                key={name}
                className="flex items-baseline justify-between gap-4"
              >
                <span className={cn("truncate", cls)}>{name}</span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                  {meta}
                </span>
              </div>
            ))}
          </div>
        </Specimen>

        <div className="grid gap-4">
          <Specimen title="Radius">
            {[
              "rounded-sm",
              "rounded-md",
              "rounded-lg",
              "rounded-xl",
              "rounded-2xl",
              "rounded-full",
            ].map((r) => (
              <div key={r} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "size-12 border-2 border-brand/60 bg-brand/10",
                    r
                  )}
                />
                <span className="font-mono text-[11px] text-muted-foreground">
                  {r.replace("rounded-", "")}
                </span>
              </div>
            ))}
          </Specimen>
          <Specimen title="Elevation">
            {[
              "shadow-xs",
              "shadow-sm",
              "shadow-md",
              "shadow-lg",
              "shadow-xl",
            ].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={cn("size-12 rounded-lg border bg-card", s)} />
                <span className="font-mono text-[11px] text-muted-foreground">
                  {s.replace("shadow-", "")}
                </span>
              </div>
            ))}
          </Specimen>
        </div>

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
    <Specimen title="Motion — lib/motion.ts" className="lg:col-span-2">
      <div className="w-full space-y-3">
        {springs.map(([name, config]) => (
          <div key={name} className="flex items-center gap-4">
            <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">
              {name}
            </span>
            <div className="relative h-8 flex-1 rounded-md bg-muted">
              <motion.div
                className="absolute top-1 size-6 rounded-[5px] bg-brand [box-shadow:var(--highlight),var(--shadow-sm)]"
                animate={{ left: on ? "calc(100% - 1.75rem)" : "0.25rem" }}
                transition={config}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-end pt-1">
          <Button variant="outline" size="sm" onClick={() => setOn((v) => !v)}>
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
        eyebrow="02 — Components"
        title="The core set"
        description="Radix handles accessibility and keyboard behavior; tokens handle the look; Motion handles state changes."
      />
      <div className="grid gap-4 md:grid-cols-2">
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
        eyebrow="03 — Motion"
        title="The feel layer"
        description="Animated pieces in the spirit of beUI, all tuned to the same spring and easing tokens so they feel like one product."
      />
      <div className="grid gap-4 md:grid-cols-2">
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

        <SpotlightCard>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            SpotlightCard
          </p>
          <h3 className="text-lg font-semibold tracking-tight">
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
        eyebrow="05 — Compose"
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
