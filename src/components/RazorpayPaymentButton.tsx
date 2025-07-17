import { Button } from "@/components/ui/button"
import { toast }  from "sonner"
import { useCart } from "@/hooks/useCart"
import medusa      from "@/lib/medusaClient"
import useRazorpay from "react-razorpay"
import { useState } from "react"

interface PaymentSession {
  id: string
  provider_id: string
  amount: number          // paise
  currency_code: string
  data: { razorpay_order_id: string }
}

export default function RazorpayPaymentButton({ session }: { session: PaymentSession }) {
  const { cart, clearCart } = useCart()
  const Razorpay            = useRazorpay()
  const [busy, setBusy]     = useState(false)

  const orderId = session?.data?.razorpay_order_id
  if (!orderId) return null

  const pay = () => {
    setBusy(true)

    const rzp = new Razorpay({
      key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: orderId,
      amount:   session.amount,
      currency: session.currency_code.toUpperCase(),
      callback_url: `${import.meta.env.VITE_MEDUSA_BACKEND_URL}/razorpay/hooks`,
      prefill: {
        name: `${cart?.billing_address?.first_name ?? ""} ${cart?.billing_address?.last_name ?? ""}`,
        email: cart?.email,
        contact: cart?.shipping_address?.phone,
      },
      handler: async (resp: any) => {
        try {
          await medusa.carts.capturePaymentSession(cart.id, { data: resp })
          await medusa.carts.complete(cart.id)
          clearCart()
          window.location.href = "/order-confirmation"
        } catch {
          toast.error("Couldn’t complete payment")
          setBusy(false)
        }
      },
    })

    rzp.open()
    rzp.on("payment.failed", () => {
      toast.error("Payment failed")
      setBusy(false)
    })
  }

  return (
    <Button onClick={pay} disabled={busy} className="w-full">
      {busy ? "Processing…" : `Pay ₹${(session.amount / 100).toFixed(2)}`}
    </Button>
  )
}