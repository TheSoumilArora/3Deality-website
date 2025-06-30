// src/components/RazorpayPaymentButton.tsx
import React, { useState, useEffect, useCallback } from "react"
import useRazorpay from "react-razorpay"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import medusa from "@/lib/medusaClient"
import { useCart } from "@/hooks/useCart"

interface RazorpayPaymentButtonProps {
  /** one of cart.payment_sessions, filtered to provider_id === "razorpay" */
  session: {
    id: string
    provider_id: string
    amount: number
    currency_code: string
    data: { razorpayOrder: { id: string } }
  }
  /** disable until the session has been created & data is populated */
  notReady: boolean
}

/**
 * Drops into your checkout > pay step, renders a Razorpay-powered button
 */
export const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({
  session,
  notReady,
}) => {
  const Razorpay = useRazorpay()
  const { cart, clearCart } = useCart()
  const [submitting, setSubmitting]   = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [orderId, setOrderId]         = useState<string>("")

  // once Medusa plugin has created the order, pull it out
  useEffect(() => {
    const data = session.data
    if (data?.razorpayOrder?.id) {
      setOrderId(data.razorpayOrder.id)
    }
  }, [session.data])

  const handlePayment = useCallback(() => {
    if (!cart) {
      toast.error("No cart found")
      return
    }
    setSubmitting(true)
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID!,     // your publishable key
      amount: session.amount,                         // in paise
      currency: session.currency_code.toUpperCase(),
      order_id: orderId,                              // created by the plugin
      name: "3Deality",
      description: "Your order",
      handler: async (response: any) => {
        try {
          // capture & complete
          await medusa.carts.capturePaymentSession(cart.id, { data: response })
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
      setErrorMessage(err.error?.description || "Payment failed")
      setSubmitting(false)
    })
  }, [Razorpay, cart, clearCart, session, orderId])

  return (
    <div>
      <Button
        onClick={handlePayment}
        disabled={notReady || submitting || !orderId}
        className="w-full h-12 bg-gradient-to-r from-primary to-primary/80"
      >
        {submitting
          ? "Processing…"
          : `Pay ₹${(session.amount / 100).toFixed(2)} with Razorpay`}
      </Button>
      {errorMessage && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </div>
  )
}