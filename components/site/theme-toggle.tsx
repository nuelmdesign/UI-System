"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { spring } from "@/lib/motion"

type Theme = "light" | "dark"

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

export function useTheme(): Theme {
  return React.useSyncExternalStore(
    subscribe,
    () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    () => "light"
  )
}

export function ThemeToggle() {
  const theme = useTheme()
  const next = theme === "dark" ? "light" : "dark"

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Switch to ${next} theme`}
      onClick={() => {
        document.documentElement.classList.toggle("dark", next === "dark")
        try {
          localStorage.setItem("theme", next)
        } catch {}
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={spring.snappy}
          className="flex"
        >
          {theme === "dark" ? <Moon /> : <Sun />}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
