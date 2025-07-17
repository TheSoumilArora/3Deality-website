import { useCart } from "@/hooks/useCart";
import medusa from "@/lib/medusaClient";
import useRazorpay from "react-razorpay";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function RazorpayPaymentButton({ session }: any) {
  const { cart, clearCart } = useCart();
  const Razorpay = useRazorpay();
  const [busy, setBusy] = useState(false);

  if (!session?.data?.razorpay_order_id) return null;

  const pay = () => {
    setBusy(true);

    const rzp = new Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: session.data.razorpay_order_id,
      amount: session.amount,
      currency: session.currency_code.toUpperCase(),
      handler: async (resp: any) => {
        try {
          await medusa.carts.capturePaymentSession(cart.id, { data: resp });
          await medusa.carts.complete(cart.id);
          clearCart();
          window.location.href = "/order-confirmation";
        } catch {
          toast.error("Couldn’t complete payment");
        }
      },
    });

    rzp.open();
    rzp.on("payment.failed", () => {
      toast.error("Payment failed");
      setBusy(false);
    });
  };

  return (
    <Button onClick={pay} disabled={busy} className="w-full">
      {busy ? "Processing…" : `Pay ₹${(session.amount / 100).toFixed(2)}`}
    </Button>
  );
}