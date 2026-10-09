"use client"

import { ThemeToggle, useThemePreference } from "@/components/ui/theme-toggle"

export default function ThemeToggleDemo() {
  const [preference] = useThemePreference()

  return (
    <div className="flex w-full max-w-[640px] items-center justify-between gap-4 border p-4">
      <div className="min-w-0">
        <p className="eyebrow text-muted-foreground">Appearance</p>
        <p className="mt-1 text-sm">
          Preference: <span className="font-mono">{preference}</span>
        </p>
      </div>
      <ThemeToggle />
    </div>
  )
}
