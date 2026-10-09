"use client"

import * as React from "react"
import { ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageContainer, PageHeader } from "@/components/ui/page-header"

function Crumbs() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-muted-foreground">
        <li>
          <a href="#" className="hover:text-foreground">
            Workspace
          </a>
        </li>
        <ChevronRight aria-hidden className="size-3.5" />
        <li aria-current="page" className="text-foreground">
          Projects
        </li>
      </ol>
    </nav>
  )
}

export default function PageHeaderDemo() {
  return (
    <div className="w-full max-w-[640px] overflow-hidden rounded-lg border bg-background">
      <PageContainer size="full">
        <PageHeader
          bordered
          breadcrumb={<Crumbs />}
          eyebrow="Overview"
          title="Projects"
          description="Everything your team is building, in one place."
          actions={
            <>
              <Button variant="outline">Export</Button>
              <Button>
                <Plus /> New project
              </Button>
            </>
          }
        />
        <PageHeader
          as="h2"
          eyebrow="Settings"
          title="Notifications"
          description="Choose what you hear about and where."
        />
      </PageContainer>
    </div>
  )
}
