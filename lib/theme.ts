/**
 * The brand knobs a project can change, and how a set of choices turns into
 * CSS (for the theme file) and plain instructions (for an AI assistant).
 * Defaults match app/globals.css.
 */

/** A Google Font, as listed in lib/google-fonts.json. */
export type FontPick = {
  family: string
  /** Static weights the family ships (a variable font covers the range). */
  weights: number[]
  variable?: boolean
  /** False for families with no Latin subset (Arabic, Devanagari, …). */
  latin?: boolean
}

/** Parses one [family, weights, flags] row of lib/google-fonts.json. */
export function fontFromRow([family, weights, flags]: [
  string,
  string,
  string,
]): FontPick {
  return {
    family,
    weights: weights.split(";").filter(Boolean).map(Number),
    variable: flags.includes("v"),
    latin: !flags.includes("x"),
  }
}

const SERIF_HINT =
  /serif|garamond|baskerville|bodoni|caslon|playfair|merriweather|lora|newsreader|fraunces|spectral|cormorant|crimson|literata|gelasio|cardo|alegreya(?! sans)|domine|vollkorn|prata|marcellus|cinzel|tinos|rozha|abhaya|aleo|arvo|bitter|zilla|young serif|instrument serif|dm serif|libre caslon|eb garamond|old standard|ovo|petrona|rufina|sorts mill|unna|yrsa|rasa|gloock|bagnard|besley|brygada|castoro|frank ruhl|hahmlet|kurale|lusitana|neuton|noticia|radley|trirong|cambo|halant|amiri|scheherazade/i

/** A sensible fallback stack for a family, from its name. */
export function fontStack(family: string) {
  if (/mono|code|consol/i.test(family)) return "ui-monospace, monospace"
  if (SERIF_HINT.test(family) && !/sans/i.test(family))
    return "ui-serif, Georgia, serif"
  return "ui-sans-serif, system-ui, sans-serif"
}

export const isSerif = (family: string) =>
  fontStack(family).includes("serif") && !fontStack(family).includes("sans")

/** The CSS variable next/font would expose, e.g. "--font-ibm-plex-sans". */
export const fontVariable = (family: string) =>
  `--font-${family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`

/** The next/font/google export name, e.g. "IBM_Plex_Sans". */
export const nextFontExport = (family: string) =>
  family.replace(/[^A-Za-z0-9]+/g, "_")

/** The available weight closest to a target. */
export function nearestWeight(font: FontPick, target: number) {
  if (!font.weights.length) return 400
  return font.weights.reduce((best, w) =>
    Math.abs(w - target) < Math.abs(best - target) ? w : best
  )
}

/** A heading weight that suits the family: light serifs, firmer sans faces. */
export function suggestedHeadingWeight(font: FontPick) {
  if (font.family === "Newsreader") return 300
  return nearestWeight(font, isSerif(font.family) ? 400 : 600)
}

export const headingTracking = (font: FontPick) =>
  isSerif(font.family) ? "-0.02em" : "-0.03em"

/** Google Fonts stylesheet URL for a family at the given weights. */
export function googleFontsUrl(font: FontPick, wanted: number[]) {
  const name = font.family.replace(/ /g, "+")
  const weights = [...new Set(wanted.map((w) => nearestWeight(font, w)))].sort(
    (a, b) => a - b
  )
  const axis =
    weights.length === 1 && weights[0] === 400
      ? ""
      : `:wght@${weights.join(";")}`
  return `https://fonts.googleapis.com/css2?family=${name}${axis}&display=swap`
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
  heading: FontPick
  body: FontPick
  headingWeight: number
  primary: PrimaryId
  /** Hex color used when primary is "custom". */
  customColor: string
  /** Buttons, inputs, tabs, chips. */
  controlRadius: number
  /** Cards, menus, popovers, dialogs. */
  surfaceRadius: number
  /** Multiplier for every text size; 1 is the default. */
  textScale: number
}

export const DEFAULT_THEME: ThemeChoice = {
  heading: {
    family: "Newsreader",
    weights: [200, 300, 400, 500, 600, 700, 800],
    variable: true,
    latin: true,
  },
  body: {
    family: "Geist",
    weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    variable: true,
    latin: true,
  },
  headingWeight: 300,
  primary: "blue",
  customColor: "#0f766e",
  controlRadius: 2,
  surfaceRadius: 3,
  textScale: 1,
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

/** Theme-file value: the next/font variable, else the family by name. */
const fontValue = (font: FontPick) =>
  `var(${fontVariable(font.family)}, "${font.family}"), ${fontStack(font.family)}`

/** CSS custom properties for a live preview of the choice. */
export function themeStyle(t: ThemeChoice, dark: boolean) {
  const p = primaryValues(t)
  const color = dark ? p.dark : p.light
  return {
    "--font-heading": fontValue(t.heading),
    "--font-body": fontValue(t.body),
    "--heading-weight": String(t.headingWeight),
    "--heading-tracking": headingTracking(t.heading),
    "--primary": color,
    "--brand": color,
    "--primary-foreground": p.foreground,
    "--ring": `color-mix(in oklch, ${color} 45%, transparent)`,
    "--control-radius": `${t.controlRadius}px`,
    "--surface-radius": `${t.surfaceRadius}px`,
    "--text-scale": String(t.textScale),
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
  --heading-weight: ${t.headingWeight};
  --heading-tracking: ${headingTracking(t.heading)};
  --control-radius: ${t.controlRadius}px;
  --surface-radius: ${t.surfaceRadius}px;
  --text-scale: ${t.textScale};
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
  if (
    t.heading.family !== d.heading.family ||
    t.headingWeight !== d.headingWeight
  )
    notes.push(
      `headings in ${t.heading.family} from Google Fonts (weight ${t.headingWeight})`
    )
  if (t.body.family !== d.body.family)
    notes.push(`body text in ${t.body.family} from Google Fonts`)
  if (t.primary !== d.primary)
    notes.push(
      `primary color ${t.primary === "custom" ? t.customColor : PRIMARIES[t.primary].label.toLowerCase()}`
    )
  if (t.controlRadius !== d.controlRadius)
    notes.push(`${t.controlRadius}px corners on buttons, inputs and tabs`)
  if (t.surfaceRadius !== d.surfaceRadius)
    notes.push(`${t.surfaceRadius}px corners on cards, menus and dialogs`)
  if (t.textScale !== d.textScale) {
    const pct = Math.round(Math.abs(t.textScale - 1) * 100)
    notes.push(
      `text ${pct}% ${t.textScale > 1 ? "larger" : "smaller"} than the default (--text-scale: ${t.textScale}; body text ${Math.round(14 * t.textScale * 10) / 10}px)`
    )
  }
  if (!notes.length) return ""
  return `Theme: ${notes.join("; ")}. Apply these by changing opendraft's brand tokens in the global stylesheet (see "Make it yours" in llms.txt), not by restyling components.`
}

/** How to load the chosen fonts in a Next.js app with next/font. */
export function nextFontSnippet(t: ThemeChoice) {
  const picks = [
    { role: "heading", font: t.heading, weights: [t.headingWeight] },
    { role: "body", font: t.body, weights: [400, 500, 600] },
  ].filter(
    (p, i, all) => all.findIndex((q) => q.font.family === p.font.family) === i
  )
  const imports = picks.map((p) => nextFontExport(p.font.family)).join(", ")
  const consts = picks
    .map((p) => {
      const opts = [
        p.font.latin === false ? "preload: false" : `subsets: ["latin"]`,
        `variable: "${fontVariable(p.font.family)}"`,
      ]
      if (!p.font.variable) {
        const weights = [
          ...new Set(
            (p.role === "heading" && t.body.family === t.heading.family
              ? [t.headingWeight, 400, 500, 600]
              : p.weights
            ).map((w) => nearestWeight(p.font, w))
          ),
        ].sort((a, b) => a - b)
        opts.push(`weight: [${weights.map((w) => `"${w}"`).join(", ")}]`)
      }
      return `const ${p.role} = ${nextFontExport(p.font.family)}({ ${opts.join(", ")} })`
    })
    .join("\n")
  const classes = picks.map((p) => `\${${p.role}.variable}`).join(" ")
  return `// app/layout.tsx
import { ${imports} } from "next/font/google"

${consts}

// <html className={\`${classes}\`}>`
}
