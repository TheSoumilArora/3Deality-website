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

/* utils */
const inr = (v = 0) =>
  `₹${v.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
const paiseToRupee = (p = 0) => inr(p / 100)

export default function Checkout() {
  const { cart, items, clearCart, cartCount } = useCart()
  const navigate = useNavigate()

  /* --------------------------------------- state */
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

  const [autoLock, setAutoLock] = useState({ city: false, province: false })
  const [options, setOptions] = useState<any[]>([])
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)

  /* --------------------------------------- helpers */
  const refreshCart = async () => {
    if (!cart) return
    const { cart: fresh } = await medusa.carts.retrieve(cart.id)
    window.location.reload() // simplest way to sync totals across contexts
    return fresh
  }

  const fetchOptions = async () => {
    if (!cart) return
    const { shipping_options } = await medusa.shippingOptions.listCart(cart.id)
    setOptions(shipping_options)
  }

  /* PIN → autofill District/State */
  const handlePinBlur = async () => {
    if (addr.postal_code.length !== 6) return
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${addr.postal_code}`
      ).then((r) => r.json())
      if (res[0].Status === "Success") {
        const { District, State } = res[0].PostOffice[0]
        setAddr((p) => ({
          ...p,
          city: District,
          province: stateCodes[State] || "",
        }))
        setAutoLock({ city: true, province: true })
      }
    } catch {
      /* fail silently */
    }
  }

  /* submit address */
  const handleShip = async (e: React.FormEvent) => {
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
      await fetchOptions()
      setStep("pay")
      toast.success("Address saved")

    } catch {
      toast.error("Could not save address – check required fields")
    } finally {
      setBusy(false)
    }
  }

  /* promo / gift */
  const applyCode = async () => {
    if (!cart || !code.trim()) return
    setPromoBusy(true)
    const c = code.trim()
    try {
      await medusa.carts.addDiscount(cart.id, c).catch(() =>
        medusa.carts.addGiftCard(cart.id, c)
      )
      toast.success("Code applied")
      await refreshCart()
    } catch {
      toast.error("Invalid code")
    } finally {
      setPromoBusy(false)
    }
  }

  /* shipping → pay */
  const pay = async () => {
    if (!cart || !selectedOpt) {
      toast.error("Choose a shipping method")
      return
    }
    setBusy(true)
    try {
      await medusa.carts.addShippingMethod(cart.id, { option_id: selectedOpt })
      await medusa.carts.createPaymentSessions(cart.id)
      await medusa.carts.setPaymentSession(cart.id, "razorpay")

      /* REAL widget here */
      toast.success("Pretend Razorpay succeeded 🙂")
      await medusa.carts.complete(cart.id)

      clearCart()
      navigate("/order-confirmation")
    } catch (e) {
      toast.error("Payment failed")
    } finally {
      setBusy(false)
    }
  }

  /* guards */
  if (!cart) return null
  if (cartCount === 0)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-32 text-center">
          <ShoppingCart className="mx-auto w-16 h-16 text-muted-foreground mb-6" />
          <Button onClick={() => navigate("/store")}>Browse Products</Button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Cart
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── left ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {step === "ship" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleShip}>
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
                          readOnly={autoLock.city}
                          className={autoLock.city ? "bg-muted" : ""}
                          onChange={(e) =>
                            setAddr({ ...addr, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>State (code)</Label>
                        <Input
                          value={addr.province}
                          readOnly={autoLock.province}
                          className={autoLock.province ? "bg-muted" : ""}
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

            {step === "pay" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Payment & Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* promo */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Percent className="w-4 h-4" /> Promo / Gift Code
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="ENTER CODE"
                      />
                      <Button onClick={applyCode} disabled={promoBusy}>
                        {promoBusy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* shipping opts */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Shipping method</h4>
                    {options.map((o) => (
                      <label
                        key={o.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                          selectedOpt === o.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }`}
                      >
                        <span>
                          {o.name} – {paiseToRupee(o.amount)}
                        </span>
                        <input
                          type="radio"
                          checked={selectedOpt === o.id}
                          onChange={() => setSelectedOpt(o.id)}
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
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Pay ${paiseToRupee(cart.total || 0)} with Razorpay`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── right summary ───────────────────── */}
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
                    <span>{paiseToRupee(li.unit_price * li.quantity)}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{paiseToRupee(cart.subtotal || 0)}</span>
                  </div>
                  {cart.discount_total > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-{paiseToRupee(cart.discount_total)}</span>
                    </div>
                  )}
                  {cart.gift_card_total > 0 && (
                    <div className="flex justify-between">
                      <span>Gift Card</span>
                      <span>-{paiseToRupee(cart.gift_card_total)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {cart.shipping_total
                        ? paiseToRupee(cart.shipping_total)
                        : "—"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {paiseToRupee(cart.total || 0)}
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