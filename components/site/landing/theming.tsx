"use client"

import * as React from "react"
import { Moon, SlidersHorizontal, Sun } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Section, SectionIntro } from "@/components/site/landing/shared"

/** Primary colors to try, all drawn from the existing tokens. */
const PRIMARIES = [
  {
    id: "blue",
    label: "Blue",
    value: "var(--blue-600)",
    dark: "var(--blue-500)",
  },
  {
    id: "deep",
    label: "Deep blue",
    value: "var(--blue-800)",
    dark: "var(--blue-300)",
  },
  {
    id: "ink",
    label: "Ink",
    value: "var(--ink)",
    dark: "var(--ink)",
    fg: "var(--ink-foreground)",
  },
  {
    id: "green",
    label: "Green",
    value: "var(--success)",
    dark: "var(--success)",
  },
] as const

const RADII = [0, 2, 6] as const

type Settings = {
  primary: (typeof PRIMARIES)[number]["id"]
  radius: (typeof RADII)[number]
  dark: boolean
}

export function Theming() {
  const [s, setS] = React.useState<Settings>({
    primary: "blue",
    radius: 2,
    dark: false,
  })
  const primary = PRIMARIES.find((p) => p.id === s.primary) ?? PRIMARIES[0]
  const color = s.dark ? primary.dark : primary.value
  const fg = "fg" in primary ? primary.fg : "var(--primary-foreground)"

  const css = `:root {
  --primary: ${primary.value};
  --brand: ${primary.value};
  --radius: ${s.radius}px;
}

.dark {
  --primary: ${primary.dark};
  --brand: ${primary.dark};
}`

  return (
    <Section id="theming" className="scroll-mt-24">
      <SectionIntro
        icon={<SlidersHorizontal />}
        label="Theming"
        title="Change one file. Every screen follows."
      >
        opendraft&apos;s look lives in a set of CSS tokens. Try the controls:
        the code on the left is all you&apos;d edit, and Claude edits the same
        file when you ask for a new look.
      </SectionIntro>

      <div className="mt-12 grid border bg-card shadow-sm lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)_auto]">
        <div className="flex min-w-0 flex-col border-b lg:border-r lg:border-b-0">
          <p className="flex h-10 items-center border-b px-4 font-mono text-xs text-muted-foreground">
            app/globals.css
          </p>
          <pre className="flex-1 overflow-x-auto p-4 font-mono text-[12.5px] leading-6 text-muted-foreground">
            {css.split("\n").map((line, i) => {
              const changed = /--(primary|brand|radius)/.test(line)
              return (
                <span
                  key={i}
                  className={cn(
                    "block",
                    changed && "-mx-4 bg-brand/8 px-4 text-foreground"
                  )}
                >
                  {line || " "}
                </span>
              )
            })}
          </pre>
        </div>

        <div
          className={cn(
            "grid min-h-[460px] place-items-center bg-dots p-4 sm:p-8",
            s.dark && "dark bg-background text-foreground"
          )}
          style={
            {
              "--primary": color,
              "--brand": color,
              "--ring": `color-mix(in oklch, ${color} 45%, transparent)`,
              "--primary-foreground": fg,
              "--radius": `${s.radius}px`,
            } as React.CSSProperties
          }
        >
          <InviteCard />
        </div>

        <div
          className="flex min-w-0 flex-row flex-wrap items-center justify-center gap-3 border-t p-3 lg:flex-col lg:flex-nowrap lg:justify-start lg:border-t-0 lg:border-l"
          aria-label="Theme controls"
        >
          <fieldset className="flex gap-1.5 lg:flex-col">
            <legend className="sr-only">Primary color</legend>
            {PRIMARIES.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-label={p.label}
                aria-pressed={s.primary === p.id}
                onClick={() => setS((v) => ({ ...v, primary: p.id }))}
                className={cn(
                  "grid size-8 place-items-center border transition-colors",
                  s.primary === p.id ? "border-foreground" : "hover:bg-accent"
                )}
              >
                <span
                  className="size-3.5 rounded-full"
                  style={{ background: p.value }}
                />
              </button>
            ))}
          </fieldset>
          <span aria-hidden className="h-6 w-px bg-border lg:h-px lg:w-6" />
          <fieldset className="flex gap-1.5 lg:flex-col">
            <legend className="sr-only">Mode</legend>
            {[false, true].map((dark) => (
              <button
                key={String(dark)}
                type="button"
                aria-label={dark ? "Dark" : "Light"}
                aria-pressed={s.dark === dark}
                onClick={() => setS((v) => ({ ...v, dark }))}
                className={cn(
                  "grid size-8 place-items-center border transition-colors [&_svg]:size-4",
                  s.dark === dark
                    ? "border-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {dark ? <Moon /> : <Sun />}
              </button>
            ))}
          </fieldset>
          <span aria-hidden className="h-6 w-px bg-border lg:h-px lg:w-6" />
          <fieldset className="flex gap-1.5 lg:flex-col">
            <legend className="sr-only">Corner radius</legend>
            {RADII.map((r) => (
              <button
                key={r}
                type="button"
                aria-label={`${r}px corners`}
                aria-pressed={s.radius === r}
                onClick={() => setS((v) => ({ ...v, radius: r }))}
                className={cn(
                  "grid size-8 place-items-center border transition-colors",
                  s.radius === r ? "border-foreground" : "hover:bg-accent"
                )}
              >
                <span
                  className="size-3.5 border-t-2 border-l-2 border-muted-foreground"
                  style={{ borderTopLeftRadius: r * 1.5 }}
                />
              </button>
            ))}
          </fieldset>
        </div>
      </div>
    </Section>
  )
}

function InviteCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-display text-2xl font-light">
          Invite your team
        </CardTitle>
        <CardDescription>
          They&apos;ll get an email with a link.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-2">
          <Input aria-label="Email address" placeholder="name@company.com" />
          <Button onClick={() => toast("Invite sent")}>Invite</Button>
        </div>
        <div className="grid gap-2.5">
          {[
            ["Ada Obi", "Owner"],
            ["Sam Reyes", "Editor"],
          ].map(([name, role]) => (
            <div key={name} className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="flex-1 text-sm">{name}</span>
              <Badge variant={role === "Owner" ? "default" : "outline"}>
                {role}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <Label htmlFor="guests" className="font-normal">
          Allow guest access
        </Label>
        <Switch id="guests" defaultChecked />
      </CardFooter>
    </Card>
  )
}
