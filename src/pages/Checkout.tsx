import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Truck,
  CreditCard,
  ShoppingCart,
  Loader2,
  Percent,
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

export default function Checkout() {
  const { cart, items, clearCart, cartCount } = useCart()
  const navigate = useNavigate()

  /* ───────── component state ───────── */
  const [step, setStep] = useState<"ship" | "pay">("ship")
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
  const [locked, setLocked] = useState({ city: false, province: false })
  const [shipOpts, setShipOpts] = useState<any[]>([])
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)

  /* ───────── helpers ───────── */
  const lineTotal = (li: any) => li.unit_price * li.quantity

  const fetchShipOpts = async () => {
    if (!cart) return
    const { shipping_options } = await medusa.shippingOptions.listCart(cart.id)
    setShipOpts(shipping_options)
  }

  /* PIN-code autofill */
  const handlePinBlur = async () => {
    if (addr.postal_code.length !== 6) return
    try {
      const r = await fetch(
        `https://api.postalpincode.in/pincode/${addr.postal_code}`
      ).then((x) => x.json())
      if (r[0].Status === "Success") {
        const { District, State } = r[0].PostOffice[0]
        setAddr((a) => ({
          ...a,
          city: District,
          province: stateCodes[State] || "",
        }))
        setLocked({ city: true, province: true })
      }
    } catch {
      /* ignore – leave editable */
    }
  }

  /* Submit address */
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
      setStep("pay")
      toast.success("Address saved")
    } catch (err: any) {
      console.error(err)
      toast.error("Could not save address – server rejected the data")
    } finally {
      setBusy(false)
    }
  }

  /* Apply promo / gift */
  const applyCode = async () => {
    if (!cart || !code.trim()) return
    setPromoBusy(true)
    const c = code.trim()
    try {
      await medusa.carts.addDiscount(cart.id, c).catch(() =>
        medusa.carts.addGiftCard(cart.id, c)
      )
      toast.success("Code applied")
      window.location.reload() // easiest way to sync totals
    } catch {
      toast.error("Invalid code")
    } finally {
      setPromoBusy(false)
    }
  }

  /* Pay */
  const pay = async () => {
    if (!cart || !selectedOpt) {
      toast.error("Please choose a shipping method")
      return
    }
    setBusy(true)
    try {
      await medusa.carts.addShippingMethod(cart.id, { option_id: selectedOpt })
      await medusa.carts.createPaymentSessions(cart.id)
      await medusa.carts.setPaymentSession(cart.id, "razorpay")
      /* TODO: real Razorpay widget here */
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

  /* ───────── guard screens ───────── */
  if (!cart) return null
  if (cartCount === 0)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-32 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <Button onClick={() => navigate("/store")}>Browse Products</Button>
        </div>
      </div>
    )

  /* ───────── UI ───────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/cart")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Cart
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT column */}
          <div className="lg:col-span-2 space-y-8">
            {/* SHIPPING STEP */}
            {step === "ship" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Shipping
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
                          value={addr.city}
                          readOnly={locked.city}
                          className={locked.city ? "bg-muted" : ""}
                          onChange={(e) =>
                            setAddr({ ...addr, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>State (code)</Label>
                        <Input
                          value={addr.province}
                          readOnly={locked.province}
                          className={locked.province ? "bg-muted" : ""}
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
                          onBlur={handlePinBlur}
                        />
                      </div>
                    </div>

                    <Button disabled={busy} className="w-full mt-6">
                      {busy ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* PAYMENT STEP */}
            {step === "pay" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment & Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* shipping */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Shipping method</h4>
                    {shipOpts.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                          selectedOpt === opt.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }`}
                      >
                        <span>
                          {opt.name} – {formatINR(opt.amount)}
                        </span>
                        <input
                          type="radio"
                          checked={selectedOpt === opt.id}
                          onChange={() => setSelectedOpt(opt.id)}
                        />
                      </label>
                    ))}
                  </div>

                  <Button
                    disabled={busy}
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                    onClick={pay}
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `Pay ${formatINR(cart.total || 0)} with Razorpay`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT column: Order summary + promo (always visible) */}
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

                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Promo / Gift-card"
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

                <Separator className="my-4" />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatINR(cart.subtotal || 0)}</span>
                  </div>
                  {cart.discount_total > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-{formatINR(cart.discount_total)}</span>
                    </div>
                  )}
                  {cart.gift_card_total > 0 && (
                    <div className="flex justify-between">
                      <span>Gift Card</span>
                      <span>-{formatINR(cart.gift_card_total)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {cart.shipping_total
                        ? formatINR(cart.shipping_total)
                        : "—"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatINR(cart.total || 0)}
                  </span>
                </div>

                {cart.shipping_total === 0 && (
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