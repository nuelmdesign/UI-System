"use client"

import * as React from "react"
import { Check, Copy, Moon, RotateCcw, Sun } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { aiPrompt, claudeUrl } from "@/lib/site"
import {
  DEFAULT_THEME,
  PRIMARIES,
  isHex,
  nextFontSnippet,
  suggestedHeadingWeight,
  themeCss,
  themeNotes,
  themeStyle,
  type FontPick,
  type PrimaryId,
  type ThemeChoice,
} from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FontPicker, useGoogleFont } from "@/components/site/font-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CONTROL_PRESETS = [0, 2, 6, 12, 16]
const SURFACE_PRESETS = [0, 3, 8, 16, 24]

/**
 * Pick fonts, a primary color and corner radii, see them applied to real
 * components, then copy either the CSS or a prompt that carries the choices.
 */
export function ThemeBuilder({ className }: { className?: string }) {
  const [t, setT] = React.useState<ThemeChoice>(DEFAULT_THEME)
  const [dark, setDark] = React.useState(false)
  const set = <K extends keyof ThemeChoice>(key: K, value: ThemeChoice[K]) =>
    setT((v) => ({ ...v, [key]: value }))

  const notes = themeNotes(t)
  const prompt = aiPrompt(undefined, notes)
  const css = themeCss(t)
  const changed = notes !== ""

  // Fetch the chosen families from Google Fonts for the preview.
  useGoogleFont(t.heading, [t.headingWeight])
  useGoogleFont(t.body, [400, 500, 600])

  return (
    <div className={cn("border bg-card shadow-sm", className)}>
      <div className="grid lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        {/* Controls */}
        <div className="grid content-start gap-6 border-b p-5 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-muted-foreground">Your theme</p>
            <Button
              variant="ghost"
              size="xs"
              disabled={!changed}
              onClick={() => setT(DEFAULT_THEME)}
            >
              <RotateCcw /> Reset
            </Button>
          </div>

          <FontField
            label="Headings"
            value={t.heading}
            onChange={(font) =>
              setT((v) => ({
                ...v,
                heading: font,
                headingWeight: suggestedHeadingWeight(font),
              }))
            }
          >
            <WeightField
              font={t.heading}
              value={t.headingWeight}
              onChange={(w) => set("headingWeight", w)}
            />
          </FontField>
          <FontField
            label="Body text"
            value={t.body}
            onChange={(font) => set("body", font)}
          />

          <fieldset className="grid gap-2.5">
            <legend className="mb-2.5 text-sm font-medium">
              Primary color
            </legend>
            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(PRIMARIES) as Exclude<PrimaryId, "custom">[]).map(
                (id) => (
                  <Swatch
                    key={id}
                    label={PRIMARIES[id].label}
                    color={PRIMARIES[id].light}
                    selected={t.primary === id}
                    onClick={() => set("primary", id)}
                  />
                )
              )}
              <Swatch
                label="Custom"
                color={isHex(t.customColor) ? t.customColor : "transparent"}
                selected={t.primary === "custom"}
                onClick={() => set("primary", "custom")}
              />
            </div>
            {t.primary === "custom" ? (
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Pick a color"
                  value={isHex(t.customColor) ? t.customColor : "#000000"}
                  onChange={(e) => set("customColor", e.target.value)}
                  className="size-9 shrink-0 cursor-pointer border bg-transparent p-0.5"
                />
                <Input
                  aria-label="Hex color"
                  value={t.customColor}
                  onChange={(e) => set("customColor", e.target.value)}
                  className="font-mono"
                  aria-invalid={!isHex(t.customColor)}
                />
              </div>
            ) : null}
          </fieldset>

          <RadiusField
            label="Buttons and inputs"
            value={t.controlRadius}
            presets={CONTROL_PRESETS}
            max={20}
            onChange={(v) => set("controlRadius", v)}
          />
          <RadiusField
            label="Cards and menus"
            value={t.surfaceRadius}
            presets={SURFACE_PRESETS}
            max={28}
            onChange={(v) => set("surfaceRadius", v)}
          />
        </div>

        {/* Preview */}
        <div className="relative min-w-0">
          <div className="absolute top-3 right-3 z-10 flex border bg-card">
            {[false, true].map((d) => (
              <button
                key={String(d)}
                type="button"
                aria-label={d ? "Preview dark mode" : "Preview light mode"}
                aria-pressed={dark === d}
                onClick={() => setDark(d)}
                className={cn(
                  "grid size-8 place-items-center transition-colors [&_svg]:size-4",
                  dark === d
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {d ? <Moon /> : <Sun />}
              </button>
            ))}
          </div>
          <div
            className={cn(
              "grid h-full min-h-[520px] place-items-center bg-dots p-4 pt-14 font-sans text-foreground sm:p-8",
              dark && "dark bg-background"
            )}
            style={themeStyle(t, dark) as React.CSSProperties}
          >
            <Specimen />
          </div>
        </div>
      </div>

      {/* Output */}
      <Tabs defaultValue="prompt" className="gap-0 border-t">
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <TabsList>
            <TabsTrigger value="prompt">Prompt for Claude</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="prompt" className="p-4">
          <Output text={prompt} label="prompt">
            <Button variant="outline" size="sm" asChild>
              <a href={claudeUrl(prompt)} target="_blank" rel="noreferrer">
                Open in Claude
              </a>
            </Button>
          </Output>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {changed
              ? "The theme line tells Claude which tokens to change. Replace the last line with what you want to build."
              : "Change a setting above and the prompt picks it up. With the defaults, Claude uses opendraft's own look."}
          </p>
        </TabsContent>
        <TabsContent value="css" className="p-4">
          <Output text={css} label="CSS" />
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            Paste over the matching lines in your global stylesheet, then load
            the fonts. In Next.js:
          </p>
          <div className="mt-3">
            <Output text={nextFontSnippet(t)} label="font setup" />
          </div>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            Outside Next.js, add the fonts from fonts.google.com with a{" "}
            <code className="font-mono text-foreground">&lt;link&gt;</code>; the
            CSS falls back to the family name, so it works either way.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FontField({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: FontPick
  onChange: (font: FontPick) => void
  children?: React.ReactNode
}) {
  const id = React.useId()
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-1.5">
        <div className="min-w-0 flex-1">
          <FontPicker id={id} value={value} onChange={onChange} />
        </div>
        {children}
      </div>
    </div>
  )
}

/** Heading weight, limited to the weights the family ships. */
function WeightField({
  font,
  value,
  onChange,
}: {
  font: FontPick
  value: number
  onChange: (weight: number) => void
}) {
  const weights = font.weights.length ? font.weights : [400]
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger
        aria-label="Heading weight"
        className="w-20 font-mono text-xs"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {weights.map((w) => (
          <SelectItem key={w} value={String(w)} className="font-mono text-xs">
            {w}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Swatch({
  label,
  color,
  selected,
  onClick,
}: {
  label: string
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      title={label}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center border transition-colors",
        selected ? "border-foreground" : "hover:bg-accent"
      )}
    >
      <span
        className={cn(
          "size-4 rounded-full",
          color === "transparent" && "border border-dashed border-input"
        )}
        style={{ background: color === "transparent" ? undefined : color }}
      />
    </button>
  )
}

function RadiusField({
  label,
  value,
  presets,
  max,
  onChange,
}: {
  label: string
  value: number
  presets: number[]
  max: number
  onChange: (v: number) => void
}) {
  const id = React.useId()
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {value}px
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex gap-1">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={value === p}
            className={cn(
              "h-7 flex-1 border font-mono text-[11px] transition-colors",
              value === p
                ? "border-foreground text-foreground"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

function Output({
  text,
  label,
  children,
}: {
  text: string
  label: string
  children?: React.ReactNode
}) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <div className="border bg-muted">
      <pre className="max-h-64 overflow-auto p-4 font-mono text-xs leading-5 break-words whitespace-pre-wrap text-foreground/85">
        {text}
      </pre>
      <div className="flex flex-wrap items-center gap-2 border-t bg-card px-3 py-2">
        <Button
          size="sm"
          variant="ink"
          onClick={async () => {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast(`Copied the ${label}`)
          }}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : `Copy ${label}`}
        </Button>
        {children}
      </div>
    </div>
  )
}

/** A small screen of real components that shows every knob at once. */
function Specimen() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <div>
        <p className="heading text-3xl leading-tight">Invite your team</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Teammates get an email with a link to join this workspace.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Send invites</CardTitle>
          <CardDescription>Add people by email.</CardDescription>
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
          <Label htmlFor="builder-guests" className="font-normal">
            Allow guest access
          </Label>
          <Switch id="builder-guests" defaultChecked />
        </CardFooter>
      </Card>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  )
}
