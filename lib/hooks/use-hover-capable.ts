// Adapted from beUI (https://beui.dev), MIT © 2026 Saurabh Chauhan.
"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(hover: hover) and (pointer: fine)"

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

/**
 * True only on devices with a real hover (mouse / trackpad). Touch devices
 * fire a sticky `:hover` on tap, so gate hover-only effects behind this.
 */
export function useHoverCapable() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  )
}
