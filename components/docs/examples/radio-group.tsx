import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="balanced">
      {[
        ["fast", "Fast", "Quick answers for simple tasks"],
        ["balanced", "Balanced", "Good default for most work"],
        ["deep", "Deep thinking", "Slower, for hard problems"],
      ].map(([value, label, hint]) => (
        <div key={value} className="flex items-start gap-3">
          <RadioGroupItem value={value} id={value} className="mt-0.5" />
          <Label htmlFor={value} className="grid gap-1">
            {label}
            <span className="text-xs font-normal text-muted-foreground">
              {hint}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
