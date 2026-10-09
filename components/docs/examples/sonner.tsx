"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast("Deployment queued", {
            description: "Building main@4f2c1a, about 40 seconds.",
            action: { label: "View", onClick: () => {} },
          })
        }
      >
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Settings saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Payment failed")}>
        Error
      </Button>
    </div>
  )
}
