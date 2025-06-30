// src/components/RazorpayPaymentButton.tsx
import React, { useState, useEffect, useCallback } from "react"
import useRazorpay from "react-razorpay"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import medusa from "@/lib/medusaClient"
import { useCart } from "@/hooks/useCart"

interface RazorpaySession {
  id: string
  provider_id: string
  amount: number
  currency_code: string
  data: { razorpay_order_id: string }
}

export const RazorpayPaymentButton: React.FC<{ session: RazorpaySession }> = ({
  session,
}) => {
  const Razorpay = useRazorpay()
  const { cart, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  // grab the Razorpay order ID once Medusa has returned it
  useEffect(() => {
    if (session.data.razorpay_order_id) {
      setOrderId(session.data.razorpay_order_id)
    }
  }, [session.data])

  const handleClick = useCallback(() => {
    if (!cart || !orderId) {
      return toast.error("Payment not ready")
    }
    setLoading(true)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID!,
      amount: session.amount,                // paise
      currency: session.currency_code.toUpperCase(),
      order_id: orderId,                     // from session.data
      name: "3Deality",
      description: "Your Order",
      prefill: {
        name: `${cart.shipping_address?.first_name} ${cart.shipping_address?.last_name}`,
        email: cart.email,
        contact: cart.shipping_address?.phone,
      },
      handler: async (resp: any) => {
        try {
          await medusa.carts.capturePaymentSession(cart.id, { data: resp })
          await medusa.carts.complete(cart.id)
          clearCart()
          window.location.href = "/order-confirmation"
        } catch (err) {
          console.error(err)
          toast.error("Couldn’t complete payment")
        }
      },
    }

    const rzp = new Razorpay(options)
    rzp.open()
    rzp.on("payment.failed", (err: any) => {
      console.error(err)
      toast.error(err.error?.description || "Payment failed")
      setLoading(false)
    })
  }, [cart, orderId, session, Razorpay, clearCart])

  return (
    <Button
      onClick={handleClick}
      disabled={!orderId || loading}
      className="w-full h-12 bg-gradient-to-r from-primary to-primary/80"
    >
      {loading
        ? "Processing…"
        : `Pay ₹${(session.amount / 100).toFixed(2)} with Razorpay`}
    </Button>
  )
}