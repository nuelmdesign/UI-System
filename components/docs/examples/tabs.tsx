import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDemo() {
  return (
    <div className="grid w-full max-w-md gap-8">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-sm text-muted-foreground">
          The indicator slides between tabs with a spring from lib/motion.
        </TabsContent>
        <TabsContent value="activity" className="text-sm text-muted-foreground">
          12 events in the last 24 hours.
        </TabsContent>
        <TabsContent value="settings" className="text-sm text-muted-foreground">
          Workspace settings live here.
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="all" variant="underline">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
