# Auth Screen

Split sign-in and sign-up screen with validation, social providers, loading and error states, and a brand panel.

Category: Blocks

## Install

```bash
npx shadcn@latest add @opendraft/auth-screen
```

Install `@opendraft/theme` first (once per project) so the tokens exist, and add the `@opendraft` registry to `components.json`. See https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt.

## Import

```tsx
import { AuthScreen } from "@/components/blocks/auth-screen"
```

## Dependencies

- npm: `lucide-react`, `motion`
- Registry (installed with it): `@opendraft/utils`, `@opendraft/button`, `@opendraft/input`, `@opendraft/label`, `@opendraft/checkbox`, `@opendraft/tabs`, `@opendraft/pixel-field`

## Props and types

```ts
export type AuthMode = "sign-in" | "sign-up"

export type AuthValues = {
  mode: AuthMode
  email: string
  password: string
  remember: boolean
}

export type AuthProvider = {
  id: string
  label: string
  icon?: React.ReactNode
}

export type AuthBrand = {
  name: string
  quote: string
  author: string
  role?: string
}

export type AuthScreenProps = {
  /** Async. Throw (or reject) to show the error message above the button. */
  onSubmit?: (values: AuthValues) => void | Promise<void>
  /** Called when a "Continue with" button is pressed. */
  onProvider?: (providerId: string) => void
  onForgotPassword?: () => void
  providers?: AuthProvider[]
  brand?: AuthBrand
  defaultMode?: AuthMode
  /** Replaces the default monogram mark. */
  logo?: React.ReactNode
  /** Show `brand.name` next to the logo. Set false when `logo` already contains the name. Default true. */
  showBrandName?: boolean
  /** Text before the provider label on each button. Default "Continue with". */
  providerPrefix?: string
  /** Full control of the provider button text (overrides `providerPrefix`), e.g. to shorten long labels. */
  providerLabel?: (provider: AuthProvider) => string
  className?: string
  /** Extra classes for inner parts. `providers` targets the provider button grid. */
  classNames?: { providers?: string }
}
```

## Example

```tsx
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
```

Live docs: https://ui-system-virid.vercel.app/docs/auth-screen. Rules for building with opendraft: https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt
