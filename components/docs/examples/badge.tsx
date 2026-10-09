import { Badge } from "@/components/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="brand" dot>
        Brand
      </Badge>
      <Badge variant="success" dot>
        Paid
      </Badge>
      <Badge variant="warning" dot>
        Pending
      </Badge>
      <Badge variant="destructive" dot>
        Failed
      </Badge>
    </div>
  )
}
