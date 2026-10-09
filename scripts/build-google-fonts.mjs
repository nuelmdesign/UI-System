// Builds lib/google-fonts.json, the font list behind the theme builder's
// picker, from the Google Fonts catalog that ships with next/font. Each entry
// is [family, weights, flags]: weights as a ";"-joined string, flags "v" for a
// variable font, "i" when it has italics and "x" when it has no Latin subset
// (scripts like Arabic or Devanagari). Run: pnpm fonts:build

import { createRequire } from "node:module"
import { writeFileSync } from "node:fs"

const require = createRequire(import.meta.url)
const data = require("next/dist/compiled/@next/font/dist/google/font-data.json")

const fonts = Object.entries(data)
  .map(([family, f]) => {
    const weights = f.weights.filter((w) => w !== "variable").join(";")
    const flags =
      (f.weights.includes("variable") ? "v" : "") +
      (f.styles?.includes("italic") ? "i" : "") +
      (f.subsets?.includes("latin") ? "" : "x")
    return [family, weights, flags]
  })
  .sort((a, b) => a[0].localeCompare(b[0]))

writeFileSync(
  new URL("../lib/google-fonts.json", import.meta.url),
  JSON.stringify(fonts) + "\n"
)
console.log(`google-fonts.json: ${fonts.length} families`)
