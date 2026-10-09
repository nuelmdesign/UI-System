import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-6">
      <Avatar className="size-10">
        <AvatarFallback>NM</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {["NM", "AL", "GH", "KT"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  )
}
