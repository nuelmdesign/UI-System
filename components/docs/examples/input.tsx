import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="invalid">Workspace URL</Label>
        <Input id="invalid" defaultValue="my workspace" aria-invalid />
        <p className="text-xs text-destructive">
          Use letters, numbers and dashes.
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="disabled">Plan</Label>
        <Input id="disabled" defaultValue="Pro" disabled />
      </div>
    </div>
  )
}
