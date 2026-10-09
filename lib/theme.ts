/**
 * The brand knobs a project can change, and how a set of choices turns into
 * CSS (for the theme file) and plain instructions (for an AI assistant).
 * Defaults match app/globals.css.
 */

export type FontId = "newsreader" | "geist" | "inter" | "plex"

export const FONTS: Record<
  FontId,
  {
    label: string
    /** CSS variable a Next.js app gets from next/font. */
    variable: string
    stack: string
    /** Weight and tracking that suit this face as a heading. */
    headingWeight: number
    headingTracking: string
  }
> = {
  newsreader: {
    label: "Newsreader",
    variable: "--font-newsreader",
    stack: "ui-serif, Georgia, serif",
    headingWeight: 300,
    headingTracking: "-0.02em",
  },
  geist: {
    label: "Geist",
    variable: "--font-geist",
    stack: "ui-sans-serif, system-ui, sans-serif",
    headingWeight: 500,
    headingTracking: "-0.03em",
  },
  inter: {
    label: "Inter",
    variable: "--font-inter",
    stack: "ui-sans-serif, system-ui, sans-serif",
    headingWeight: 600,
    headingTracking: "-0.03em",
  },
  plex: {
    label: "IBM Plex Sans",
    variable: "--font-ibm-plex-sans",
    stack: "ui-sans-serif, system-ui, sans-serif",
    headingWeight: 600,
    headingTracking: "-0.02em",
  },
}

export type PrimaryId = "blue" | "black" | "green" | "custom"

export const PRIMARIES: Record<
  Exclude<PrimaryId, "custom">,
  { label: string; light: string; dark: string; foreground?: string }
> = {
  blue: { label: "Blue", light: "var(--blue-600)", dark: "var(--blue-500)" },
  black: {
    label: "Black",
    light: "var(--ink)",
    dark: "var(--ink)",
    foreground: "var(--ink-foreground)",
  },
  green: { label: "Green", light: "var(--success)", dark: "var(--success)" },
}

export type ThemeChoice = {
  heading: FontId
  body: FontId
  primary: PrimaryId
  /** Hex color used when primary is "custom". */
  customColor: string
  /** Buttons, inputs, tabs, chips. */
  controlRadius: number
  /** Cards, menus, popovers, dialogs. */
  surfaceRadius: number
}

export const DEFAULT_THEME: ThemeChoice = {
  heading: "newsreader",
  body: "geist",
  primary: "blue",
  customColor: "#0f766e",
  controlRadius: 2,
  surfaceRadius: 3,
}

/** Black or white text, whichever reads better on a hex background. */
export function readableOn(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return "#ffffff"
  const n = parseInt(m[1], 16)
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.4 ? "#0e0e10" : "#ffffff"
}

export function isHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value.trim())
}

function primaryValues(t: ThemeChoice) {
  if (t.primary === "custom") {
    const color = isHex(t.customColor)
      ? t.customColor
      : DEFAULT_THEME.customColor
    return { light: color, dark: color, foreground: readableOn(color) }
  }
  const p = PRIMARIES[t.primary]
  return {
    light: p.light,
    dark: p.dark,
    foreground: p.foreground ?? "var(--primary-foreground)",
  }
}

const fontValue = (id: FontId) =>
  `var(${FONTS[id].variable}), ${FONTS[id].stack}`

/** CSS custom properties for a live preview of the choice. */
export function themeStyle(t: ThemeChoice, dark: boolean) {
  const p = primaryValues(t)
  const color = dark ? p.dark : p.light
  return {
    "--font-heading": fontValue(t.heading),
    "--font-body": fontValue(t.body),
    "--heading-weight": String(FONTS[t.heading].headingWeight),
    "--heading-tracking": FONTS[t.heading].headingTracking,
    "--primary": color,
    "--brand": color,
    "--primary-foreground": p.foreground,
    "--ring": `color-mix(in oklch, ${color} 45%, transparent)`,
    "--control-radius": `${t.controlRadius}px`,
    "--surface-radius": `${t.surfaceRadius}px`,
  } as Record<string, string>
}

/** The lines to change in the theme file (app/globals.css). */
export function themeCss(t: ThemeChoice) {
  const p = primaryValues(t)
  const fg =
    t.primary === "custom" || t.primary === "black"
      ? `\n  --primary-foreground: ${p.foreground};`
      : ""
  return `:root {
  --font-heading: ${fontValue(t.heading)};
  --font-body: ${fontValue(t.body)};
  --heading-weight: ${FONTS[t.heading].headingWeight};
  --heading-tracking: ${FONTS[t.heading].headingTracking};
  --control-radius: ${t.controlRadius}px;
  --surface-radius: ${t.surfaceRadius}px;
  --primary: ${p.light};
  --brand: ${p.light};${fg}
}

.dark {
  --primary: ${p.dark};
  --brand: ${p.dark};${fg}
}`
}

/** Plain-language overrides for an assistant. Empty when nothing changed. */
export function themeNotes(t: ThemeChoice) {
  const d = DEFAULT_THEME
  const notes: string[] = []
  if (t.heading !== d.heading)
    notes.push(
      `headings in ${FONTS[t.heading].label} (weight ${FONTS[t.heading].headingWeight})`
    )
  if (t.body !== d.body) notes.push(`body text in ${FONTS[t.body].label}`)
  if (t.primary !== d.primary)
    notes.push(
      `primary color ${t.primary === "custom" ? t.customColor : PRIMARIES[t.primary].label.toLowerCase()}`
    )
  if (t.controlRadius !== d.controlRadius)
    notes.push(`${t.controlRadius}px corners on buttons, inputs and tabs`)
  if (t.surfaceRadius !== d.surfaceRadius)
    notes.push(`${t.surfaceRadius}px corners on cards, menus and dialogs`)
  if (!notes.length) return ""
  return `Theme: ${notes.join("; ")}. Apply these by changing opendraft's brand tokens in the global stylesheet (see "Make it yours" in llms.txt), not by restyling components.`
}
