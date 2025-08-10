import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Package, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatINR } from "@/lib/money"

type Order = {
  id: string
  display_id?: number | string
  created_at?: string
  email?: string
  total?: number
  items?: Array<{ id: string; title: string; quantity: number; unit_price: number }>
  metadata?: Record<string, any>
}

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem("last_order")
    if (raw) {
      try { setOrder(JSON.parse(raw)) } catch {}
    }
  }, [])

  const total = useMemo(() => order?.total ?? 0, [order])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center text-muted-foreground">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground">
                1
              </div>
              <span className="ml-2 font-medium">Shopping Cart</span>
            </div>
            <div className="h-px w-16 bg-muted-foreground" />
            <div className="flex items-center text-muted-foreground">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-muted-foreground">
                2
              </div>
              <span className="ml-2 font-medium">Checkout</span>
            </div>
            <div className="h-px w-16 bg-primary" />
            <div className="flex items-center text-primary">
              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-primary bg-primary text-primary-foreground">
                3
              </div>
              <span className="ml-2 font-medium">Order Complete</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Thank You */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">THANK YOU!</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your order was placed successfully. We’ll email you the details shortly.
            </p>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Order Number
                    </div>
                    
                    <div className="font-bold text-lg">
                      {order?.display_id ?? sessionStorage.getItem("last_order_display_id") ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant="secondary">Processing</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">
                      {order?.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-bold text-lg text-primary">{formatINR(total)}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{order?.email ?? "—"}</div>
                </div>
                {order?.metadata?.shiprocket_order_id && (
                  <div>
                    <div className="text-sm text-muted-foreground">Shiprocket ID</div>
                    <div className="font-medium">{String(order.metadata.shiprocket_order_id)}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>What's Next?</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3"><Mail className="w-5 h-5 text-primary mt-0.5" /><div><div className="font-medium">Order Confirmation</div><div className="text-sm text-muted-foreground">You’ll receive an email shortly.</div></div></div>
                <div className="flex items-start gap-3"><Package className="w-5 h-5 text-primary mt-0.5" /><div><div className="font-medium">Processing</div><div className="text-sm text-muted-foreground">We’ll start preparing your items soon.</div></div></div>
                <div className="flex items-start gap-3"><Phone className="w-5 h-5 text-primary mt-0.5" /><div><div className="font-medium">Updates</div><div className="text-sm text-muted-foreground">We’ll keep you updated via email/SMS.</div></div></div>
                <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><div><div className="font-medium">Delivery</div><div className="text-sm text-muted-foreground">Expected 3–5 business days.</div></div></div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Items */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Card>
              <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {(order?.items ?? []).map((it) => (
                  <div key={it.id} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {it.quantity}</div>
                    </div>
                    <div className="font-bold">{formatINR((it.unit_price ?? 0) * it.quantity)}</div>
                  </div>
                ))}
                {!order?.items?.length && (
                  <p className="text-sm text-muted-foreground">Item details not available after a full page refresh.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button onClick={() => navigate("/my-orders")} className="bg-gradient-to-r from-primary to-primary/80">Track Your Orders</Button>
            <Button variant="outline" onClick={() => navigate("/store")}>Continue Shopping</Button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}