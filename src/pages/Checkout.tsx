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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { stateCodes } from "@/lib/stateCodes"
import { formatINR } from "@/lib/money"

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout () {
  const {cart, items, cartCount, clearCart, refreshCart} = useCart()
  const [step, setStep] = useState<"ship" | "pay">("ship")
  const navigate = useNavigate()

  const [busy,       setBusy]   = useState(false)
  const [promoBusy,  setPB]     = useState(false)
  const [code,       setCode]   = useState("")

  /* address ----------------------------------------------------------- */
  const [addr, setAddr] = useState({
    first_name:"", last_name:"", email:"", phone:"",
    address_1:"", address_2:"", landmark:"",
    city:"", province:"", postal_code:"", country_code:"IN"
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
  const fetchOpts = async()=> {
    if(!cart) return
    // @ts-ignore: cart_id
    const {shipping_options}= await medusa.shippingOptions.list({cart_id:cart.id})
    setOpt(shipping_options)
  }

  /* pincode → autofill city/state ------------------------------------- */
  const handlePinBlur = async () => {
    if (addr.postal_code.length!==6) return
    try{
      const res = await fetch(`https://api.postalpincode.in/pincode/${addr.postal_code}`)
                     .then(r=>r.json())
      setLock({city:false,province:false})
      if(res[0].Status==="Success"){
        const {District, State}= res[0].PostOffice[0]
        setAddr(a=>({...a, city:District, province:stateCodes[State]||""}))
        setLock({city:true, province:true})
      }
      else{
        setLock({city:false,province:false})
      }
    }
    catch{ setLock({city:false,province:false}) }
  }

  /* save address & load options --------------------------------------- */
  const saveAddress = async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!cart) return
    setBusy(true)
    try{
      const {landmark,email, ...core}=addr
      await medusa.carts.update(cart.id,{
        email,
        shipping_address:{...core, metadata:landmark?{landmark}:undefined}
      })
      await fetchOpts()
      await refreshCart()
      toast.success("Address saved – choose your shipping")
    }catch(err){
      console.error(err)
      toast.error("Server rejected the address")
    }finally{setBusy(false)}
  }

  /* add / change shipping method -------------------------------------- */
  const chooseShipping = async(optId:string)=>{
    if(!cart) return
    try{
      await medusa.carts.addShippingMethod(cart.id, {option_id:optId})
      setSel(optId)
      await refreshCart()
      setStep("pay")
      toast.success("Shipping updated")
    }catch(err){
      toast.error("Couldn’t set shipping, try again")
    }
  }

  /* promotions --------------------------------------------------------- */
  const applyCode = async () => {
    if (!cart || !code.trim()) return
    setPB(true)
    try {
      await medusa.client.post(`/store/carts/${cart.id}/promotions`, {
        promo_codes: [code.trim()]
      })
      await refreshCart()          // pulls the new totals + promotions[]
      toast.success("Promotion applied")
    } catch {
      toast.error("Invalid code")
    } finally {
      setPB(false)
    }
  }

  /* pay ---------------------------------------- */
  const pay = async() => {
    if(!cart || !selected){
      toast.error("Select a shipping method first")
      return
    }
    setBusy(true)
    
    try {
      // 1) create & select the Razorpay session
      await medusa.carts.createPaymentSessions(cart.id)
      // await medusa.carts.setPaymentSession(cart.id, "razorpay")

      // 2) fetch the full cart so we can grab the session data
      const { cart: full } = await medusa.carts.retrieve(cart.id, { expand: ["payment_sessions"] })

      const rzSess = full.payment_sessions?.find( s => s.provider_id === "razorpay")
      if (!rzSess?.data) { throw new Error("No Razorpay session returned") }



      // 3) open the widget  (hook already loaded the SDK)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID!,  // from Vite env
        order_id: rzSess.data.order_id,              // generated by Medusa
        amount: rzSess.data.amount,                  // plugin puts it here
        currency: full.region.currency_code,
        name: "3Deality",
        description: "Your Order",
        prefill: {
          name: `${addr.first_name} ${addr.last_name}`,
          email: addr.email,
          contact: addr.phone,
        },
        handler: async (response: any) => {
          // 5) capture & complete
         // await medusa.carts.capturePaymentSession(cart.id, {data: response,})
          await medusa.carts.complete(cart.id)
          clearCart()
          navigate("/order-confirmation")
        },
      }

      // new Razorpay(options).open()
    } catch (err) {
      console.error(err)
      toast.error("Payment failed")
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
                  <Button
                    onClick={pay}
                    disabled={busy}
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80"
                  >
                    {busy
                      ? <Loader2 className="w-4 h-4 animate-spin"/>
                      : `Pay ${formatINR(cart.total || 0)} with Razorpay`}
                  </Button>
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