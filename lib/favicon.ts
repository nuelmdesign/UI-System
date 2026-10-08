// Adapted from beUI (https://beui.dev), MIT © 2026 Saurabh Chauhan.
/** Resolve a website URL to its conventional root favicon location. */
export function getFaviconUrl(value: string) {
  try {
    return new URL("/favicon.ico", value).toString()
  } catch {
    return null
  }
}
