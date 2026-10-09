"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/ui/site-header"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const links = ["Product", "Pricing", "Docs", "Changelog"]

export default function SiteHeaderDemo() {
  const [active, setActive] = React.useState("Product")

  return (
    <div className="w-full max-w-[640px] overflow-hidden border">
      <SiteHeader
        className="static"
        brand={
          <a href="#" className="font-display text-lg">
            Acme
          </a>
        }
        nav={links.map((label) => ({
          label,
          href: `#${label.toLowerCase()}`,
          active: label === active,
        }))}
        renderLink={({ children, onClick, ...props }) => (
          <a
            {...props}
            onClick={(e) => {
              e.preventDefault()
              setActive(String(children))
              onClick?.()
            }}
          >
            {children}
          </a>
        )}
        actions={
          <>
            <ThemeToggle />
            <Button size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
          </>
        }
      />
      <div className="h-32 bg-dots" />
    </div>
  )
}
