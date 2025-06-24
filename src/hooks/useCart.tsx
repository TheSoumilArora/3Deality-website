'use client'
import React, {createContext, useContext, useState, useEffect, ReactNode,} from "react"
import medusa from "@/lib/medusaClient"

interface LineItem {
  id: string
  title: string
  variant_id: string
  quantity: number
  unit_price: number        // paise for INR
  total: number             // unit_price * quantity
}

interface CartContextType {
  cart: any | null
  items: LineItem[]
  cartCount: number
  addToCart: (variantId: string, qty?: number) => Promise<void>
  updateLine: (lineId: string, qty: number) => Promise<void>
  removeLine: (lineId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>

}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // ---------- helpers ----------
  const createFreshCart = async () => {
    const region_id = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID!
    const { cart: newCart } = await medusa.carts.create({ region_id,})
    localStorage.setItem("cart_id", newCart.id)
    return newCart
  }

  const fetchCart = async (id: string) => {
    try {
      const { cart: existing } = await medusa.carts.retrieve(id)
      return existing
    } catch {
      // cart might have been completed/expired
      return null
    }
  }

  // ---------- bootstrap ----------
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const savedId = localStorage.getItem("cart_id")
      let c: any | null = null
      if (savedId) c = await fetchCart(savedId)
      if (!c) c = await createFreshCart()
      setCart(c)
      setLoading(false)
    }
    init()
  }, [])

  // ---------- line-item helpers ----------
  const addToCart = async (variantId: string, qty = 1) => {
    if (!cart) return
    const { cart: updated } = await medusa.carts.lineItems.create(cart.id, {
      variant_id: variantId,
      quantity: qty,
    })
    setCart(updated)
  }

  const updateLine = async (lineId: string, qty: number) => {
    if (!cart) return
    const { cart: updated } = await medusa.carts.lineItems.update(cart.id, lineId, {
      quantity: qty,
    })
    setCart(updated)
  }

  const removeLine = async (lineId: string) => {
    if (!cart) return
    await medusa.carts.lineItems.delete(cart.id, lineId)
    // Always retrieve the authoritative cart after mutation
    const { cart: refreshed } = await medusa.carts.retrieve(cart.id)
    setCart(refreshed)
  }

  const clearCart = async () => {
    const fresh = await createFreshCart()
    setCart(fresh)
  }

  const refreshCart = async () => {
  if (!cart) return
  const { cart: fresh } = await medusa.carts.retrieve(cart.id, {
    // if you need totals make sure they’re expanded
    // fields: "subtotal,total,shipping_total,discount_total",
  })
  setCart(fresh)
}

  const items: LineItem[] = cart?.items?.map((li: any) => ({
    id: li.id,
    title: li.title,
    variant_id: li.variant_id,
    quantity: li.quantity,
    unit_price: li.unit_price,
    total: li.unit_price * li.quantity,
  })) || []

  const cartCount = items.reduce((sum, li) => sum + li.quantity, 0)

  const value: CartContextType = {
    cart,
    items,
    cartCount,
    addToCart,
    updateLine,
    removeLine,
    clearCart,
    refreshCart,
  }

  // Render nothing while the initial cart is loading (prevents flash)
  if (loading) return null

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}