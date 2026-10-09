import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SwitchDemo() {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Switch id="notifications" defaultChecked />
        <Label htmlFor="notifications">Email notifications</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="digest" />
        <Label htmlFor="digest">Weekly digest</Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch id="locked" disabled />
        <Label htmlFor="locked">Managed by your admin</Label>
      </div>
    </div>
  )
}
