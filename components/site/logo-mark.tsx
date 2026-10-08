import { cn } from "@/lib/utils"

/** opendraft mark: an uneven ring in the foreground color (white in dark, near-black in light). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0 text-foreground", className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22.89 8.63C23.63 11.09 22.8 14.65 21.55 17.04C20.3 19.43 17.84 22.22 15.4 22.99C12.96 23.75 9.28 22.92 6.91 21.64C4.55 20.37 1.93 17.78 1.2 15.34C0.47 12.9 1.3 9.4 2.54 7.01C3.77 4.62 6.17 1.8 8.6 1.01C11.03 0.22 14.75 1 17.13 2.27C19.51 3.54 22.15 6.17 22.89 8.63ZM18.99 13.23C18.62 14.62 17 15.95 15.66 16.76C14.32 17.57 12.33 18.43 10.94 18.09C9.56 17.75 8.14 16.07 7.35 14.71C6.56 13.36 5.84 11.35 6.21 9.97C6.57 8.59 8.21 7.22 9.54 6.44C10.87 5.66 12.81 4.97 14.21 5.3C15.61 5.63 17.13 7.12 17.93 8.44C18.73 9.76 19.37 11.85 18.99 13.23Z"
      />
    </svg>
  )
}
