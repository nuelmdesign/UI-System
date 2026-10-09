import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardDescription>Monthly recurring revenue</CardDescription>
        <CardTitle className="heading text-4xl">$48,210</CardTitle>
        <CardAction>
          <Badge variant="success" dot>
            +12.4%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Up from $42,890 last month, driven by 38 new team plans.
      </CardContent>
      <CardFooter className="justify-end border-t pt-6">
        <Button variant="ghost" size="sm">
          View report <ArrowUpRight />
        </Button>
      </CardFooter>
    </Card>
  )
}
