import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Truck,
  Package,
  Percent,
  CreditCard,
  ShoppingCart,
  Loader2
} from "lucide-react"
import medusa from "@/lib/medusaClient"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useCart } from "@/hooks/useCart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { stateCodes } from "@/lib/stateCodes"
import { formatINR } from "@/lib/money"

/* helper to keep math in one place */
const computeTotal = (c: any, extraShip = 0) =>
  c.subtotal +
  extraShip -
  c.discount_total -
  c.gift_card_total +
  c.tax_total

export default function Checkout() {
  const { cart, items, clearCart } = useCart()
  const navigate = useNavigate()

  /* ────────────── state ────────────── */
  const [busy, setBusy] = useState(false)
  const [promoBusy, setPromoBusy] = useState(false)
  const [code, setCode] = useState("")

  const [addr, setAddr] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    address_2: "",
    landmark: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "in",
  })
  const [locked, setLocked] = useState({ city: true, province: true })

  const [shipOpts, setShipOpts] = useState<any[]>([])
  const [chosenShip, setChosenShip] = useState<any | null>(null)

  /* ────────────── helpers ────────────── */
  const lineTotal = (li: any) => li.unit_price * li.quantity

  const fetchShipOpts = async () => {
    if (!cart) return
    const { shipping_options } = await medusa.shippingOptions.list({
      cart_id: cart.id,
    })
    setShipOpts(shipping_options)
  }

  const pinLookup = async () => {
    if (addr.postal_code.length !== 6) return
    try {
      const r = await fetch(
        `https://api.postalpincode.in/pincode/${addr.postal_code}`
      ).then((x) => x.json())
      if (r[0].Status === "Success") {
        setLocked({ city: false, province: false })  // unlock if lookup failed
        const { District, State } = r[0].PostOffice[0]
        setAddr((a) => ({
          ...a,
          city: District,
          province: stateCodes[State] || "",
        }))
      } else {
        setLocked({ city: false, province: false })
      }
    } catch {
      setLocked({ city: false, province: false })
    }
  }

  /* save / update address + load ship options */
  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart) return
    setBusy(true)
    try {
      const { landmark, ...core } = addr
      await medusa.carts.update(cart.id, {
        email: addr.email,
        shipping_address: {
          ...core,
          metadata: landmark ? { landmark } : undefined,
        },
      })
      await fetchShipOpts()
      toast.success("Address saved. Pick a shipping method below.")
    } catch {
      toast.error("Couldn’t save address – check the fields again.")
    } finally {
      setBusy(false)
    }
  }

  /* promo / gift */
  const applyCode = async () => {
    if (!cart || !code.trim()) return
    const c = code.trim()
    setPromoBusy(true)
    try {
      await medusa.carts
        .applyPromotion(cart.id, { code: c.trim() })
        .catch(() => medusa.carts.applyGiftCard(cart.id, { code: c.trim() }))

      const { cart: fresh } = await medusa.carts.retrieve(cart.id)
      toast.success("Code applied")
      window.location.reload() // easiest sync
    } catch {
      toast.error("Invalid code")
    } finally {
      setPromoBusy(false)
    }
  }

  /* attach shipping, start payment */
  const pay = async () => {
    if (!cart || !chosenShip) {
      toast.error("Choose a shipping option first")
      return
    }
    setBusy(true)
    try {
      await medusa.carts.addShippingMethod(cart.id, {
        option_id: chosenShip.id,
      })
      await medusa.carts.createPaymentSessions(cart.id)
      await medusa.carts.setPaymentSession(cart.id, "razorpay")
      toast.success("Pretend payment succeeded 🙂")
      await medusa.carts.complete(cart.id)
      clearCart()
      navigate("/order-confirmation")
    } catch {
      toast.error("Payment failed")
    } finally {
      setBusy(false)
    }
  }

  /* guards */
  if (!cart) return null
  if (items.length === 0)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-32 text-center">
          <Package className="mx-auto w-16 h-16 text-muted-foreground mb-6" />
          <Button onClick={() => navigate("/store")}>Browse products</Button>
        </div>
      </div>
    )

  /* current shipping price (picked or from cart) */
  const shipAmount =
    chosenShip?.amount ?? (cart.shipping_total ? cart.shipping_total : 0)
  const calcTotal = computeTotal(cart, shipAmount)

  /* ────────────── UI ────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Cart
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT column – everything stacked */}
          <div className="lg:col-span-2 space-y-8">
            {/* ── Address ── */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Shipping address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={saveAddress}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First name *</Label>
                      <Input
                        required
                        value={addr.first_name}
                        onChange={(e) =>
                          setAddr({ ...addr, first_name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Last name *</Label>
                      <Input
                        required
                        value={addr.last_name}
                        onChange={(e) =>
                          setAddr({ ...addr, last_name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Label>Email *</Label>
                  <Input
                    required
                    type="email"
                    value={addr.email}
                    onChange={(e) =>
                      setAddr({ ...addr, email: e.target.value })
                    }
                  />

                  <Label>Phone *</Label>
                  <Input
                    required
                    value={addr.phone}
                    onChange={(e) =>
                      setAddr({ ...addr, phone: e.target.value })
                    }
                  />

                  <Label>Address line 1 *</Label>
                  <Input
                    required
                    value={addr.address_1}
                    onChange={(e) =>
                      setAddr({ ...addr, address_1: e.target.value })
                    }
                  />

                  <Label>Address line 2</Label>
                  <Input
                    value={addr.address_2}
                    onChange={(e) =>
                      setAddr({ ...addr, address_2: e.target.value })
                    }
                  />

                  <Label>Landmark</Label>
                  <Textarea
                    rows={2}
                    value={addr.landmark}
                    onChange={(e) =>
                      setAddr({ ...addr, landmark: e.target.value })
                    }
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>City</Label>
                      <Input
                        readOnly={locked.city}
                        className={locked.city ? "bg-muted" : ""}
                        value={addr.city}
                        onChange={(e) =>
                          setAddr({ ...addr, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>State (code)</Label>
                      <Input
                        readOnly={locked.province}
                        className={locked.province ? "bg-muted" : ""}
                        value={addr.province}
                        onChange={(e) =>
                          setAddr({
                            ...addr,
                            province: e.target.value.toUpperCase(),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Pincode *</Label>
                      <Input
                        required
                        value={addr.postal_code}
                        onChange={(e) =>
                          setAddr({
                            ...addr,
                            postal_code: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        onBlur={pinLookup}
                      />
                    </div>
                  </div>

                  <Button disabled={busy} className="w-full mt-6">
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save & continue"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* ── Shipping method & promo – visible once options loaded ── */}
            {shipOpts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Shipping method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {shipOpts.map((o) => (
                    <label
                      key={o.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                        chosenShip?.id === o.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <span>
                        {o.name} – {formatINR(o.amount)}
                      </span>
                      <input
                        type="radio"
                        checked={chosenShip?.id === o.id}
                        onChange={() => setChosenShip(o)}
                      />
                    </label>
                  ))}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo / Gift-card code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <Button onClick={applyCode} disabled={promoBusy}>
                      {promoBusy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Percent className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    onClick={pay}
                    disabled={busy}
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Pay ${formatINR(calcTotal)} with Razorpay`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT column – order summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((li) => (
                  <div
                    key={li.id}
                    className="flex justify-between text-sm items-center"
                  >
                    <span>
                      {li.title} × {li.quantity}
                    </span>
                    <span>{formatINR(lineTotal(li))}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatINR(cart.subtotal)}</span>
                  </div>

                  {cart.discount_total > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-{formatINR(cart.discount_total)}</span>
                    </div>
                  )}

                  {cart.gift_card_total > 0 && (
                    <div className="flex justify-between">
                      <span>Gift card</span>
                      <span>-{formatINR(cart.gift_card_total)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipAmount ? formatINR(shipAmount) : "—"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(calcTotal)}</span>
                </div>

                {shipAmount === 0 && (
                  <Badge variant="secondary" className="w-full justify-center">
                    Free shipping applied!
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}