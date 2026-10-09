"use client"

import * as React from "react"
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronUp,
  Image as ImageIcon,
  MapPin,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { QuantityStepper } from "@/components/ui/quantity-stepper"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Stat, StatGroup } from "@/components/ui/stat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type DetailTier = {
  id: string
  name: string
  description?: string
  /** Unit price in major currency units. */
  price: number
  /** Total seats / units in this tier. */
  capacity: number
  /** Units still available. 0 means sold out. */
  remaining: number
}

export type DetailScheduleItem = {
  time: string
  title: string
  description?: string
}

export type DetailFaq = { question: string; answer: string }

export type DetailFact = { label: string; value: string; hint?: string }

export type DetailHost = { name: string; role?: string; avatar?: string }

export type DetailItem = {
  title: string
  /** Optional hero image URL. Falls back to a muted placeholder. */
  image?: string
  imageAlt?: string
  category?: string
  date: string
  location: string
  host: DetailHost
  currency?: string
  facts: DetailFact[]
  tiers: DetailTier[]
  sections: {
    about: string[]
    schedule: DetailScheduleItem[]
    faqs: DetailFaq[]
  }
}

export type DetailCheckout = { tierId: string; quantity: number }

export type DetailPageProps = {
  item?: DetailItem
  onCheckout?: (selection: DetailCheckout) => void
  onWaitlist?: (tierId: string) => void
  onSaveChange?: (saved: boolean) => void
  /** Label for the back link. */
  backLabel?: string
  onBack?: () => void
  className?: string
}

export const SAMPLE_DETAIL_ITEM: DetailItem = {
  title: "Design Systems in Practice: a two-day workshop",
  category: "Workshop",
  date: "Sat 14 Nov 2026, 09:30 to 17:00",
  location: "Studio 4, Harbour Works, Lisbon",
  host: { name: "Amara Lindqvist", role: "Principal designer" },
  currency: "USD",
  facts: [
    { label: "Duration", value: "2 days", hint: "14 and 15 Nov" },
    { label: "Level", value: "Intermediate", hint: "Some Figma required" },
    { label: "Group size", value: "24", hint: "Small cohort" },
    { label: "Language", value: "English", hint: "Notes in PDF" },
  ],
  tiers: [
    {
      id: "standard",
      name: "Standard",
      description: "Both days, materials and lunch.",
      price: 420,
      capacity: 16,
      remaining: 9,
    },
    {
      id: "plus",
      name: "Plus",
      description: "Adds a 45 minute portfolio review.",
      price: 590,
      capacity: 6,
      remaining: 2,
    },
    {
      id: "team",
      name: "Team pack",
      description: "Four seats with a shared follow-up call.",
      price: 1400,
      capacity: 4,
      remaining: 0,
    },
  ],
  sections: {
    about: [
      "Two focused days on building and maintaining a design system that teams actually adopt. You will audit a real product, define tokens, and ship a small component library with documentation.",
      "The format is roughly one third talk and two thirds hands-on. Every participant leaves with a working starter kit and a rollout checklist they can take back to their team.",
    ],
    schedule: [
      {
        time: "09:30",
        title: "Audit and inventory",
        description: "Find duplication and gaps in a live product.",
      },
      {
        time: "11:30",
        title: "Tokens and foundations",
        description: "Color, type, spacing and motion as shared decisions.",
      },
      {
        time: "14:00",
        title: "Building components",
        description: "API design, states and accessibility.",
      },
      {
        time: "16:00",
        title: "Documentation and rollout",
        description: "Write once, adopt everywhere.",
      },
    ],
    faqs: [
      {
        question: "Do I need to bring a laptop?",
        answer:
          "Yes. Bring a laptop with Figma and a code editor installed. A setup guide is emailed a week before.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Full refunds are available up to 14 days before the start. After that you can transfer your seat to a colleague.",
      },
      {
        question: "Is lunch included?",
        answer:
          "Lunch and refreshments are included on both days. Tell us about dietary needs at checkout.",
      },
    ],
  },
}

const MAX_PER_ORDER = 8

function useMoney(currency: string) {
  return React.useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency }),
    [currency]
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function DetailPage({
  item = SAMPLE_DETAIL_ITEM,
  onCheckout,
  onWaitlist,
  onSaveChange,
  backLabel = "All workshops",
  onBack,
  className,
}: DetailPageProps) {
  const uid = React.useId()
  const money = useMoney(item.currency ?? "USD")
  const firstOpen = item.tiers.find((t) => t.remaining > 0)
  const [tierId, setTierId] = React.useState(firstOpen?.id ?? "")
  const [quantity, setQuantity] = React.useState(1)
  const [saved, setSaved] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [waitlisted, setWaitlisted] = React.useState<string[]>([])

  const tier = item.tiers.find((t) => t.id === tierId)
  const maxQty = tier ? Math.min(tier.remaining, MAX_PER_ORDER) : 1
  const qty = Math.min(quantity, Math.max(maxQty, 1))
  const total = tier ? tier.price * qty : 0

  function toggleSave() {
    const next = !saved
    setSaved(next)
    onSaveChange?.(next)
  }

  function checkout() {
    if (!tier) return
    onCheckout?.({ tierId: tier.id, quantity: qty })
  }

  function waitlist(id: string) {
    setWaitlisted((w) => (w.includes(id) ? w : [...w, id]))
    onWaitlist?.(id)
  }

  const panelBody = (
    <div
      className={cn(
        "flex-col gap-4",
        open ? "flex" : "hidden @3xl/detail:flex"
      )}
    >
      <RadioGroup
        aria-label="Choose an option"
        value={tierId}
        onValueChange={setTierId}
        className="gap-2"
      >
        {item.tiers.map((t) => {
          const soldOut = t.remaining <= 0
          const selected = t.id === tierId
          const inputId = `${uid}-${t.id}`
          const onList = waitlisted.includes(t.id)
          return (
            <div
              key={t.id}
              data-selected={selected ? "" : undefined}
              className={cn(
                "flex flex-col gap-3 rounded-lg border bg-card p-3 transition-colors",
                selected && "border-brand",
                !selected && !soldOut && "hover:border-foreground/25",
                soldOut && "bg-muted/40"
              )}
            >
              <label
                htmlFor={inputId}
                className={cn(
                  "flex items-start gap-3",
                  soldOut ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                <RadioGroupItem
                  id={inputId}
                  value={t.id}
                  disabled={soldOut}
                  className="mt-0.5"
                />
                <span
                  className={cn(
                    "flex min-w-0 flex-1 flex-col gap-0.5",
                    soldOut && "opacity-60"
                  )}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="font-mono text-sm tabular-nums">
                      {money.format(t.price)}
                    </span>
                  </span>
                  {t.description && (
                    <span className="text-xs text-muted-foreground">
                      {t.description}
                    </span>
                  )}
                </span>
              </label>
              {soldOut ? (
                <div className="flex items-center justify-between gap-3 pl-7">
                  <Badge variant="secondary">Sold out</Badge>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    disabled={onList}
                    onClick={() => waitlist(t.id)}
                  >
                    {onList ? "On the waitlist" : "Join waitlist"}
                  </Button>
                </div>
              ) : (
                <div className="pl-7">
                  <Progress
                    size="sm"
                    tone="auto"
                    invert
                    lowThreshold={0.35}
                    value={t.remaining}
                    max={t.capacity}
                    aria-label={`${t.name} availability`}
                    label="Available"
                    valueLabel={`${t.remaining} of ${t.capacity} left`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </RadioGroup>

      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-muted-foreground">Quantity</span>
        <QuantityStepper
          value={qty}
          min={1}
          max={Math.max(maxQty, 1)}
          disabled={!tier}
          onValueChange={setQuantity}
          aria-label="Quantity"
        />
      </div>
    </div>
  )

  return (
    <div
      data-slot="detail-page"
      className={cn(
        "@container/detail h-full min-h-0 w-full overflow-y-auto bg-background text-foreground",
        className
      )}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-8 px-4 pt-4 @3xl/detail:grid-cols-[minmax(0,1fr)_20rem] @3xl/detail:px-8 @3xl/detail:pt-6">
        <div className="flex min-w-0 flex-col gap-6 pb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Button
              type="button"
              variant="link"
              size="xs"
              className="px-0 text-muted-foreground"
              onClick={onBack}
            >
              <ArrowLeft aria-hidden />
              {backLabel}
            </Button>
            {item.category && (
              <>
                <span aria-hidden className="text-muted-foreground">
                  /
                </span>
                <span className="eyebrow" aria-current="page">
                  {item.category}
                </span>
              </>
            )}
          </nav>

          <div className="relative flex aspect-[16/7] w-full items-center justify-center overflow-hidden rounded-lg border bg-muted bg-dots text-muted-foreground">
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.imageAlt ?? item.title}
                className="size-full object-cover"
              />
            ) : (
              <ImageIcon aria-hidden className="size-8" />
            )}
          </div>

          <header className="flex flex-col gap-4">
            <h1 className="heading text-3xl @xl/detail:text-4xl">
              {item.title}
            </h1>
            <dl className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Date</dt>
                <CalendarDays
                  aria-hidden
                  className="size-4 text-muted-foreground"
                />
                <dd>{item.date}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Location</dt>
                <MapPin aria-hidden className="size-4 text-muted-foreground" />
                <dd>{item.location}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Host</dt>
                <dd className="flex items-center gap-2">
                  <Avatar className="size-6">
                    {item.host.avatar && (
                      <AvatarImage src={item.host.avatar} alt="" />
                    )}
                    <AvatarFallback className="text-[10px]">
                      {initials(item.host.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {item.host.name}
                    {item.host.role && (
                      <span className="text-muted-foreground">
                        {" "}
                        · {item.host.role}
                      </span>
                    )}
                  </span>
                </dd>
              </div>
            </dl>
          </header>

          <StatGroup columns={4} aria-label="Key facts">
            {item.facts.map((f) => (
              <Stat
                key={f.label}
                label={f.label}
                value={f.value}
                hint={f.hint}
              />
            ))}
          </StatGroup>

          <Tabs defaultValue="about" variant="underline">
            <TabsList aria-label="Details">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="flex flex-col gap-3 pt-2">
              {item.sections.about.map((p, i) => (
                <p
                  key={i}
                  className="max-w-prose text-sm/relaxed text-muted-foreground"
                >
                  {p}
                </p>
              ))}
            </TabsContent>
            <TabsContent value="schedule" className="pt-2">
              <ol className="flex flex-col divide-y rounded-lg border">
                {item.sections.schedule.map((s) => (
                  <li key={s.time + s.title} className="flex gap-4 p-3">
                    <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                      {s.time}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{s.title}</span>
                      {s.description && (
                        <span className="text-xs text-muted-foreground">
                          {s.description}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="faq" className="pt-2">
              <Accordion type="single" collapsible>
                {item.sections.faqs.map((f, i) => (
                  <AccordionItem key={f.question} value={`faq-${i}`}>
                    <AccordionTrigger>{f.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">
                        {f.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>

        <aside
          aria-label="Purchase"
          data-slot="detail-purchase"
          className={cn(
            "sticky bottom-0 z-10 -mx-4 flex flex-col gap-4 border-t bg-background p-4",
            "@3xl/detail:top-6 @3xl/detail:bottom-auto @3xl/detail:mx-0 @3xl/detail:self-start @3xl/detail:rounded-lg @3xl/detail:border"
          )}
        >
          <div className="hidden items-baseline justify-between @3xl/detail:flex">
            <h2 className="heading text-xl">Reserve your seat</h2>
          </div>

          {panelBody}

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-expanded={open}
              aria-label={open ? "Hide options" : "Show options"}
              onClick={() => setOpen((o) => !o)}
              className="flex min-w-0 flex-1 flex-col items-start rounded-md text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring @3xl/detail:pointer-events-none"
            >
              <span className="flex items-center gap-1 eyebrow text-muted-foreground">
                Total
                <ChevronUp
                  aria-hidden
                  className={cn(
                    "size-3 transition-transform @3xl/detail:hidden",
                    open && "rotate-180"
                  )}
                />
              </span>
              <span
                aria-live="polite"
                className="font-mono text-lg tabular-nums"
              >
                {money.format(total)}
              </span>
            </button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-pressed={saved}
              aria-label={saved ? "Remove from saved" : "Save"}
              onClick={toggleSave}
            >
              <Bookmark aria-hidden className={cn(saved && "fill-current")} />
            </Button>
            <Button
              type="button"
              disabled={!tier}
              onClick={checkout}
              className="flex-1 @3xl/detail:flex-none @3xl/detail:px-6"
            >
              Check out
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export { DetailPage }
