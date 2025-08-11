import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
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
import { toast } from "sonner"
import { stateCodes } from "@/lib/stateCodes"
import { formatINR } from "@/lib/money"

async function createSessions(cartId: string) {
  try {
    // try the SDK path first
    await medusa.carts.createPaymentSessions(cartId)
    await medusa.carts.setPaymentSession(cartId, { provider_id: "manual" })
    return
  } catch (e) {
    // fallback to raw endpoints to dodge any redirect/preflight quirks
    const BASE = import.meta.env.VITE_MEDUSA_BACKEND_URL
    const PUB  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_API_KEY as string
    const headers = { "x-publishable-api-key": PUB }

    // POST (no slash)
    let r = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
      method: "POST", credentials: "include", headers,
    })
    // if server expects a trailing slash
    if (!r.ok) {
      r = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions/`, {
        method: "POST", credentials: "include", headers,
      })
    }
    if (!r.ok) throw new Error(await r.text())

    // select the provider
    const r2 = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
      method: "PUT",
      credentials: "include",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ provider_id: "manual" }),
    })
    if (!r2.ok) throw new Error(await r2.text())
  }
}

export default function Checkout ()
{
  const {cart, items, cartCount, clearCart, refreshCart} = useCart()
  const [step, setStep] = useState<"ship" | "pay">("ship")
  const navigate = useNavigate()

  const [busy,       setBusy]   = useState(false)
  const [promoBusy,  setPB]     = useState(false)
  const [code,       setCode]   = useState("")

  /* address ----------------------------------------------------------- */
  const [addr, setAddr] = useState
  ({
    first_name:"", last_name:"", email:"", phone:"",
    address_1:"", address_2:"", landmark:"",
    city:"", province:"", postal_code:"", country_code:"in",
  })
  const [lock, setLock] = useState({city:true, province:true})

  /* shipping options --------------------------------------------------- */
  const [options,     setOpt]   = useState<any[]>([])
  const [selected,    setSel]   = useState<string|undefined>()
  const selectedCost  = options.find(o=>o.id===selected)?.amount ?? 0

  /* helpers ------------------------------------------------------------ */
  const lineTotal = (li:any) => li.unit_price * li.quantity
  const cartSubtotal = items.reduce((s,li) => s + lineTotal(li),0)
  const cartDiscount = (cart?.discount_total ?? 0) + (cart?.gift_card_total ?? 0)
  const calcTotal    = cartSubtotal + selectedCost - cartDiscount                 // GST is not collected yet

  /* --------------------------------------------------------------------- FX */
  /* fetch shipping opts AFTER address saved */
  const fetchOpts = async () =>
  {
    if (!cart) return
    const BASE = import.meta.env.VITE_MEDUSA_BACKEND_URL
    const PUB  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_API_KEY as string

    const res = await fetch(`${BASE}/store/shipping-options?cart_id=${cart.id}`,
    {
      credentials: "include",
      headers: { "x-publishable-api-key": PUB },
    })
    const data = await res.json()
    console.log("shipping options (raw):", data)
    // handles either { shipping_options: [...] } or [...]
    const ops = Array.isArray(data) ? data : (data.shipping_options ?? [])
    setOpt(ops)
  }

  /* pincode → autofill city/state ------------------------------------- */
  const handlePinBlur = async () => 
  {
    if (addr.postal_code.length!==6) return
    try
    {
      const res = await fetch(`https://api.postalpincode.in/pincode/${addr.postal_code}`)
                     .then(r=>r.json())
      setLock({city:false,province:false})
      
      if(res[0].Status==="Success")
      {
        const {District, State}= res[0].PostOffice[0]
        setAddr(a=>({...a, city:District, province:stateCodes[State]||""}))
        setLock({city:true, province:true})
      }
      
      else
      {
        setLock({city:false,province:false})
      }
    }

    catch{ setLock({city:false,province:false}) }
  }

  /* save address & load options --------------------------------------- */
  const saveAddress = async (e: React.FormEvent) => 
  {
    e.preventDefault()
    if (!cart) return
    setBusy(true)

    try 
    {
      const { landmark, email, country_code, ...address } = addr

      const BASE = import.meta.env.VITE_MEDUSA_BACKEND_URL
      const PUB  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_API_KEY as string
      
      const res = await fetch(`${BASE}/store/carts/${cart.id}`, 
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUB,
        },

        body: JSON.stringify
        ({
          email,
          shipping_address: 
          {
            ...address,
            country_code: country_code || "in",
            metadata: landmark ? { landmark } : undefined
          }
        })
      })

      if (!res.ok) throw new Error(await res.text())

      await refreshCart()
      await fetchOpts()
      toast.success("Address saved – choose your shipping")
    }
    
    catch (err)
    {
      console.error(err)
      toast.error("Server rejected the address")
    }
    
    finally
    {
      setBusy(false)
    }
  }

  /* add / change shipping method -------------------------------------- */
  const chooseShipping = async(optId:string)=>
  {
    if(!cart) return
    try{
      await medusa.carts.addShippingMethod(cart.id, {option_id:optId})
      setSel(optId)
      await refreshCart()
      setStep("pay")
      toast.success("Shipping updated")
    }
    
    catch(err)
    {
      toast.error("Couldn’t set shipping, try again")
    }
  }

  /* promotions --------------------------------------------------------- */
  const applyCode = async () => 
  {
    if (!cart || !code.trim()) return
    setPB(true)
    try {
      const BASE = import.meta.env.VITE_MEDUSA_BACKEND_URL
      const PUB  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_API_KEY as string

      const res = await fetch(`${BASE}/store/carts/${cart.id}/promotions`,
      {
        method: "POST",
        credentials: "include",
        headers:
        {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUB,
        },
        body: JSON.stringify({ promo_codes: [code.trim()] }),
      })

      if (!res.ok) throw new Error(await res.text())

      await refreshCart() // pulls new totals + promotions[]
      toast.success("Promotion applied")
    }
    
    catch (e)
    {
      console.error(e)
      toast.error("Invalid code")
    }
    
    finally
    {
      setPB(false)
    }
  }

  /* pay --------------------------------------------------------------- */
  const pay = async () => {
    if (!cart || !selected) {
      toast.error("Select a shipping method first")
      return
    }

    setBusy(true)
    try {
      const res = await fetch('/api/medusa/pay', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cartId: cart.id, providerId: 'manual' }),
      })

      if (!res.ok) throw new Error(await res.text())
      const { order } = await res.json()

      if (order) {
        sessionStorage.setItem("last_order", JSON.stringify(order))
        sessionStorage.setItem("last_order_display_id", String(order.display_id ?? ""))
      }

      clearCart()
      navigate('/order-confirmation')
    } catch (err) {
      console.error(err)
      toast.error('Payment failed')
    } finally {
      setBusy(false)
    }
  }


  /* ---------------------------------------------------------------- guards */
  if(!cart)            return null
  if(cartCount===0)    return (
      <div className="min-h-screen"><Navbar/>
        <div className="py-32 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4"/>
          <Button onClick={()=>navigate("/store")}>Browse Products</Button>
        </div>
      </div>)

  return (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    <Navbar/>
    <div className="container mx-auto px-4 py-10">
      <Button variant="ghost" className="mb-6" onClick={()=>navigate("/cart")}>
        <ArrowLeft className="mr-1 h-4 w-4"/> Cart
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ---------------- left column */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
              <Truck className="h-4 w-4"/> Shipping
            </CardTitle>
            </CardHeader>

            <CardContent>
              {/* address form ------------------------------------------------ */}
              <form onSubmit={saveAddress} className="space-y-4">
                {/* names */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First name *</Label>
                    <Input required value={addr.first_name}
                      onChange={e=>setAddr({...addr,first_name:e.target.value})}/>
                  </div>
                  <div>
                    <Label>Last name *</Label>
                    <Input required value={addr.last_name}
                      onChange={e=>setAddr({...addr,last_name:e.target.value})}/>
                  </div>
                </div>
                {/* email / phone */}
                <Label>Email *</Label>
                <Input required type="email" value={addr.email}
                  onChange={e=>setAddr({...addr,email:e.target.value})}/>
                <Label>Phone *</Label>
                <Input required value={addr.phone}
                  onChange={e=>setAddr({...addr,phone:e.target.value})}/>
                {/* address lines */}
                <Label>Address line 1 *</Label>
                <Input required value={addr.address_1}
                  onChange={e=>setAddr({...addr,address_1:e.target.value})}/>
                <Label>Address line 2</Label>
                <Input value={addr.address_2}
                  onChange={e=>setAddr({...addr,address_2:e.target.value})}/>
                <Label>Landmark</Label>
                <Input value={addr.landmark}
                  onChange={e=>setAddr({...addr,landmark:e.target.value})}/>
                {/* city / state / pin */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input readOnly={lock.city} className={lock.city?"bg-muted":""}
                      value={addr.city}
                      onChange={e=>setAddr({...addr,city:e.target.value})}/>
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input readOnly className="bg-muted"
                      value={addr.province}/>
                  </div>
                  <div>
                    <Label>Pincode *</Label>
                    <Input required value={addr.postal_code}
                      onBlur={handlePinBlur}
                      onChange={e=> setAddr({...addr,
                        postal_code:e.target.value.replace(/\D/g,"")})}/>
                  </div>
                </div>

                <Button disabled={busy} className="w-full mt-6">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save & continue"}
                </Button>
              </form>

              {/* shipping options (after save) -------------------------------- */}
              {options.length>0 && (
                <div className="mt-8 space-y-3">
                  <h4 className="font-medium mb-2">Choose shipping method</h4>
                  {options.map(opt=>(
                    <label key={opt.id}
                      className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer
                        ${selected===opt.id?"border-primary bg-primary/5":"border-muted hover:border-primary/50"}`}>
                      <span>{opt.name} — {formatINR(opt.amount)}</span>
                      <input type="radio" checked={selected===opt.id}
                        onChange={()=> chooseShipping(opt.id)}/>
                    </label>
                  ))}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
        {/* ---------------- right column – summary */}
          <div className="space-y-8">

            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">

                {items.map(li=>(
                  <div key={li.id} className="flex justify-between text-sm">
                    <span>{li.title} × {li.quantity}</span>
                    <span>{formatINR(lineTotal(li))}</span>
                  </div>
                ))}

                {/* promo ----------------------------------------------------- */}
                <div className="flex gap-2 mt-4">
                  <Input placeholder="Promo code"
                         value={code} onChange={e=>setCode(e.target.value)}/>
                  <Button onClick={applyCode} disabled={promoBusy}>
                    {promoBusy? <Loader2 className="h-4 w-4 animate-spin"/>:<Percent className="h-4 w-4"/>}
                  </Button>
                </div>

                <Separator className="my-4"/>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatINR(cartSubtotal)}</span>
                    </div>
                  {cartDiscount>0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span>-{formatINR(cartDiscount)}</span>
                      </div>
                  )}
                  <div className="flex justify-between"><span>Shipping</span>
                    <span>{selected ? formatINR(selectedCost) : "—"}</span>
                    </div>
                </div>

                <Separator/>

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(calcTotal)}</span>
                </div>

                {selectedCost===0 && selected && (
                  <Badge variant="secondary" className="justify-center w-full">
                    Free shipping applied!
                  </Badge>
                )}
              </CardContent>
            </Card>
              
            {/* PAYMENT */}

            {step === "pay" && (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payment
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Button className="w-full h-12" onClick={pay} disabled={busy || !selected}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place Order"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    You won’t be charged online for this test flow.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>)
}