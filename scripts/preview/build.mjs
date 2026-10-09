// Builds the site as a plain React bundle (no Next runtime) into
// preview-dist/: index.html + app.js + app.css + r/*.json + llms*. Pages are
// hash-routed (#docs, #docs.<slug>) by components/docs/hash-app.tsx. Used to publish live previews
// to hosts that serve from a sub-path, where Next's own runtime won't boot.
import { execFileSync } from "node:child_process"
import { copyFileSync, cpSync, mkdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"

const root = fileURLToPath(new URL("../..", import.meta.url))
const out = `${root}preview-dist`
mkdirSync(out, { recursive: true })

// The docs fetch component source from the registry, so ship it alongside.
execFileSync("node", ["scripts/build-docs.mjs"], {
  cwd: root,
  stdio: "inherit",
})
cpSync(`${root}public/r`, `${out}/r`, { recursive: true })
// The AI-readable docs (llms.txt and friends) are linked from the docs too.
execFileSync("node", ["scripts/build-llms.mjs"], {
  cwd: root,
  stdio: "inherit",
})
copyFileSync(`${root}public/llms.txt`, `${out}/llms.txt`)
copyFileSync(`${root}public/llms-full.txt`, `${out}/llms-full.txt`)
cpSync(`${root}public/llms`, `${out}/llms`, { recursive: true })

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
