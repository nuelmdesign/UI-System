import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function TextareaDemo() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Tell us a bit more…" />
      <p className="text-xs text-muted-foreground">
        Grows with its content up to the space available.
      </p>
    </div>
  )
}
