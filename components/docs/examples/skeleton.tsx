import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3.5 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
