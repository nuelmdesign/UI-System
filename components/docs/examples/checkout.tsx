import { Checkout } from "@/components/blocks/checkout"

export default function CheckoutDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <Checkout
        onPay={async ({ payment }) => {
          await new Promise((r) => setTimeout(r, 1200))
          if (payment.last4 === "0002")
            throw new Error("Your card was declined.")
        }}
      />
    </div>
  )
}
