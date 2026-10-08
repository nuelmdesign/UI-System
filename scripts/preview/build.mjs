// Builds the showcase as a plain React bundle (no Next runtime) into
// preview-dist/: index.html + app.js + app.css. Used to publish live previews
// to hosts that serve from a sub-path, where Next's own runtime won't boot.
import { execFileSync } from "node:child_process"
import { copyFileSync, mkdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"

const root = fileURLToPath(new URL("../..", import.meta.url))
const out = `${root}preview-dist`
mkdirSync(out, { recursive: true })

await build({
  entryPoints: [`${root}scripts/preview/entry.tsx`],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outfile: `${out}/app.js`,
  tsconfig: `${root}tsconfig.json`,
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
  logOverride: { "unsupported-directive": "silent" },
})

execFileSync(
  "tailwindcss",
  ["-i", "app/globals.css", "-o", `${out}/app.css`, "--minify"],
  { cwd: root, stdio: "inherit" }
)
copyFileSync(`${root}scripts/preview/index.html`, `${out}/index.html`)
console.log("preview-dist/ ready")
