import { AuthScreen } from "@/components/blocks/auth-screen"

export default function AuthScreenDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <AuthScreen
        onSubmit={async ({ password }) => {
          await new Promise((r) => setTimeout(r, 1200))
          if (password === "password1")
            throw new Error("Incorrect email or password.")
        }}
      />
    </div>
  )
}
