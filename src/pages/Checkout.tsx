import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Truck, CreditCard, ShoppingCart, Loader2 } from "lucide-react"
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

const formatINR = (rupees = 0) =>
  `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export default function Checkout() {
  const { cart, items, clearCart, cartCount } = useCart()
  const navigate = useNavigate()

  const [step, setStep] = useState<"shipping" | "payment">("shipping")
  const [busy, setBusy] = useState(false)

  const [ship, setShip] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "in",
  })

  const [options, setOptions] = useState<any[]>([])
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null)

  /* promo / gift card */
  const [code, setCode] = useState("")
  const [promoBusy, setPromoBusy] = useState(false)

  const lineTotal = (li: any) => li.unit_price * li.quantity

  const fetchShippingOptions = async (id: string) => {
    const { shipping_options } = await medusa.shippingOptions.listCart(id)
    setOptions(shipping_options)
  }

  /* autofill city & state on PIN blur */
  const handlePincodeBlur = async () => {
    if (ship.postal_code.length !== 6) return
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${ship.postal_code}`
      ).then((r) => r.json())
      if (res[0].Status === "Success") {
        const { District, State } = res[0].PostOffice[0]
        setShip((p) => ({
          ...p,
          city: District,
          province: stateCodes[State] || "",
        }))
      }
    } catch {/* silent */}
  }

  const handleShipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart) return
    setBusy(true)
    try {
      const { email, ...addr } = ship // <- strip email out
      await medusa.carts.update(cart.id, {
        email,
        shipping_address: { ...addr, country_code: "in" },
      })
      await fetchShippingOptions(cart.id)
      setStep("payment")
      toast.success("Address saved")
    } catch (err) {
      console.error(err)
      toast.error("Could not save address – check fields")
    } finally {
      setBusy(false)
    }
  }

  /*──────── APPLY PROMO / GIFT ────────*/
  const handleApplyCode = async () => {
    if (!cart || !code.trim()) return
    setPromoBusy(true)
    try {
      await medusa.carts.addDiscount(cart.id, code.trim()).catch(async () => {
        // if not a discount, try gift-card
        await medusa.carts.addGiftCard(cart.id, code.trim())
      })
      const { cart: refreshed } = await medusa.carts.retrieve(cart.id)
      toast.success("Code applied")
      // quick way to refresh totals: hard reload cart in hook
      window.location.reload()
    } catch {
      toast.error("Invalid code")
    } finally {
      setPromoBusy(false)
    }
  }

  /*──────── SHIPPING → PAYMENT ────────*/
  const attachShippingAndPay = async () => {
    if (!cart || !selectedOpt) {
      toast.error("Choose a shipping method")
      return
    }
    setBusy(true)
    try {
      await medusa.carts.addShippingMethod(cart.id, { option_id: selectedOpt })
      await medusa.carts.createPaymentSessions(cart.id)
      await medusa.carts.setPaymentSession(cart.id, "razorpay")

      /* TODO: real Razorpay widget here */
      toast.success("Pretend Razorpay succeeded 🙂")
      await medusa.carts.complete(cart.id)

      clearCart()
      navigate("/order-confirmation")
    } catch (err) {
      console.error(err)
      toast.error("Checkout failed")
    } finally {
      setBusy(false)
    }
  }

  /*──────── guards ────────*/
  if (!cart) return null
  if (cartCount === 0)
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="py-32 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <Button onClick={() => navigate("/store")}>Browse Products</Button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => navigate("/cart")}>
          <ArrowLeft className="h-4 w-4" /> Cart
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COL */}
          <div className="lg:col-span-2 space-y-8">

            {/* SHIPPING STEP */}
            {step === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleShipSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First name</Label>
                        <Input required value={ship.first_name} onChange={(e) => setShip({ ...ship, first_name: e.target.value })}/>
                      </div>
                      <div>
                        <Label>Last name</Label>
                        <Input required value={ship.last_name} onChange={(e) => setShip({ ...ship, last_name: e.target.value })}/>
                      </div>
                    </div>

                    <Label>Email</Label>
                    <Input required type="email" value={ship.email} onChange={(e) => setShip({ ...ship, email: e.target.value })}/>

                    <Label>Phone</Label>
                    <Input required value={ship.phone} onChange={(e) => setShip({ ...ship, phone: e.target.value })}/>

                    <Label>Address</Label>
                    <Textarea required value={ship.address_1} onChange={(e) => setShip({ ...ship, address_1: e.target.value })}/>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input required value={ship.city} onChange={(e) => setShip({ ...ship, city: e.target.value })}/>
                      </div>
                      <div>
                        <Label>State (code)</Label>
                        <Input required value={ship.province} onChange={(e) => setShip({ ...ship, province: e.target.value.toUpperCase() })}/>
                      </div>
                      <div>
                        <Label>Pincode</Label>
                        <Input required value={ship.postal_code} onChange={(e) => setShip({ ...ship, postal_code: e.target.value.replace(/\D/g, "") })} onBlur={handlePincodeBlur}/>
                      </div>
                    </div>

                    <Button disabled={busy} className="w-full mt-4">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* PAYMENT STEP */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment & Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* code input */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Percent className="h-4 w-4" /> Promo / Gift Card
                    </Label>
                    <div className="flex gap-2">
                      <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ENTER CODE"/>
                      <Button disabled={promoBusy} onClick={handleApplyCode}>
                        {promoBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                      </Button>
                    </div>
                  </div>

                  {/* shipping methods */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Choose shipping method</h4>
                    {options.map((opt) => (
                      <label key={opt.id} className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${selectedOpt === opt.id ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}>
                        <span>
                          {opt.name} – {formatINR(opt.amount)}
                        </span>
                        <input type="radio" checked={selectedOpt === opt.id} onChange={() => setSelectedOpt(opt.id)}/>
                      </label>
                    ))}
                  </div>

                  <Button disabled={busy} className="w-full bg-gradient-to-r from-primary to-primary/80" onClick={attachShippingAndPay}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Pay ${formatINR(cart.total || 0)} with Razorpay`}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT COL */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((li) => (
                  <div key={li.id} className="flex justify-between text-sm items-center">
                    <span>{li.title} × {li.quantity}</span>
                    <span>{formatINR(lineTotal(li))}</span>
                  </div>
                ))}

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(cart.subtotal || 0)}</span></div>
                  {cart.discount_total > 0 && (<div className="flex justify-between"><span>Discount</span><span>-{formatINR(cart.discount_total)}</span></div>)}
                  {cart.gift_card_total > 0 && (<div className="flex justify-between"><span>Gift Card</span><span>-{formatINR(cart.gift_card_total)}</span></div>)}
                  <div className="flex justify-between"><span>Shipping</span><span>{cart.shipping_total ? formatINR(cart.shipping_total) : "—"}</span></div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(cart.total || 0)}</span>
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