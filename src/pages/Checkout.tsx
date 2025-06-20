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

export default function Checkout() {
  const { cart, items, clearCart } = useCart()
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

  const formatINR = (paise = 0) =>
    `₹${(paise / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  const lineTotal = (li: any) => li.unit_price * li.quantity

  const fetchOptions = async (id: string) => {
    const { shipping_options } = await medusa.shippingOptions.listCart(id)
    setOptions(shipping_options)
  }

  /* Autofill city + state from PIN */
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
          province: State || "",
        }))
      }
    } catch {
      /* silent - user can type manually */
    }
  }

  const handleShipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart) return

    setBusy(true)
    try {
      await medusa.carts.update(cart.id, {
        email: ship.email,
        shipping_address: {
          ...ship,
          country_code: "in",
        },
      })

      await fetchOptions(cart.id)
      setStep("payment")
      toast.success("Address saved")
    } catch (err) {
      console.error(err)
      toast.error("Could not save address")
    } finally {
      setBusy(false)
    }
  }

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

      /* TODO: open Razorpay widget here */
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

  /* -------------------------------------------------- */
  if (!cart) return null
  if (items.length === 0)
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
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate("/cart")}
        >
          <ArrowLeft className="h-4 w-4" /> Cart
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ---------------- LEFT COLUMN ---------------- */}
          <div className="lg:col-span-2 space-y-8">
            {/* ----- SHIPPING STEP ----- */}
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
                        <Input
                          required
                          value={ship.first_name}
                          onChange={(e) =>
                            setShip({ ...ship, first_name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Last name</Label>
                        <Input
                          required
                          value={ship.last_name}
                          onChange={(e) =>
                            setShip({ ...ship, last_name: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <Label>Email</Label>
                    <Input
                      required
                      type="email"
                      value={ship.email}
                      onChange={(e) =>
                        setShip({ ...ship, email: e.target.value })
                      }
                    />

                    <Label>Phone</Label>
                    <Input
                      required
                      value={ship.phone}
                      onChange={(e) =>
                        setShip({ ...ship, phone: e.target.value })
                      }
                    />

                    <Label>Address</Label>
                    <Textarea
                      required
                      value={ship.address_1}
                      onChange={(e) =>
                        setShip({ ...ship, address_1: e.target.value })
                      }
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          required
                          value={ship.city}
                          onChange={(e) =>
                            setShip({ ...ship, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          required
                          value={ship.province}
                          onChange={(e) =>
                            setShip({ ...ship, province: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Pincode</Label>
                        <Input
                          required
                          value={ship.postal_code}
                          onChange={(e) =>
                            setShip({
                              ...ship,
                              postal_code: e.target.value.replace(/\D/g, ""),
                            })
                          }
                          onBlur={handlePincodeBlur}
                        />
                      </div>
                    </div>

                    <Button disabled={busy} className="w-full mt-4">
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ----- PAYMENT STEP ----- */}
            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Payment & Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* shipping methods */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Choose shipping method</h4>
                    {options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                          selectedOpt === opt.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        }`}
                      >
                        <span>
                          {opt.name} –{" "}
                          {opt.amount
                            ? formatINR(opt.amount)
                            : "Calculated at next step"}
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
                    onClick={attachShippingAndPay}
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Pay ${formatINR(cart.total || 0)} with Razorpay`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ---------------- RIGHT COLUMN ---------------- */}
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
                    <span>{formatINR(cart.subtotal || 0)}</span>
                  </div>
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
                    {cart.total ? formatINR(cart.total) : "—"}
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