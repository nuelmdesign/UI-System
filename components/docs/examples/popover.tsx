import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="grid gap-3">
        <p className="eyebrow text-muted-foreground">Dimensions</p>
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
          <Label htmlFor="height">Height</Label>
          <Input id="height" defaultValue="auto" className="col-span-2 h-8" />
        </div>
      </PopoverContent>
    </Popover>
  )
}
