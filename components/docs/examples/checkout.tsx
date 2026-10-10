import {
  Checkout,
  SAMPLE_CHECKOUT_DISCOUNTS,
  SAMPLE_CHECKOUT_FEES,
} from "@/components/blocks/checkout"

export default function CheckoutDemo() {
  return (
    <div className="h-[680px] w-full overflow-hidden rounded-lg border bg-background">
      <Checkout
        fees={SAMPLE_CHECKOUT_FEES}
        discountCodes={SAMPLE_CHECKOUT_DISCOUNTS}
        onPay={async ({ payment }) => {
          await new Promise((r) => setTimeout(r, 1200))
          if (payment.last4 === "0002")
            throw new Error("Your card was declined.")
        }}
      />
    </div>
  )
}
