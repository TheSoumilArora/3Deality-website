// api/medusa/pay.ts  (Vercel/Netlify Node function, ESM)
import type { VercelRequest, VercelResponse } from "@vercel/node"

export const config = { runtime: "nodejs" } // force Node runtime

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed")

  try {
    const { cartId, providerId = "pp_system", method } =
      (req.body || {}) as { cartId?: string; providerId?: string; method?: "cod" | "hdfc" }

    if (!cartId) return res.status(400).json({ message: "cartId required" })

    const BASE =
      process.env.VITE_MEDUSA_BACKEND_URL ||
      process.env.MEDUSA_BACKEND_URL
    const PUB =
      process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY ||
      process.env.MEDUSA_PUBLISHABLE_API_KEY

    if (!BASE || !PUB) {
      return res.status(500).json({ message: "Missing MEDUSA envs on server" })
    }

    const headers = {
      "content-type": "application/json",
      "x-publishable-api-key": String(PUB),
    }

    // Optional: tag the cart with the chosen method (for reporting)
    await fetch(`${BASE}/store/carts/${cartId}`, {
      method: "POST", // v2 uses POST to update
      headers,
      body: JSON.stringify({ metadata: { payment_method_choice: method ?? "unknown" } }),
    }).catch(() => {})

    // 1) Create (or ensure) a payment collection for this cart
    let pcId: string | undefined

    // if backend already attached a collection on the cart, reuse it
    try {
      const cR = await fetch(`${BASE}/store/carts/${cartId}`, { headers })
      const cJ = await cR.json().catch(() => ({}))
      pcId = cJ?.cart?.payment_collection?.id ?? cJ?.payment_collection?.id
    } catch {}

    if (!pcId) {
      const make = await fetch(`${BASE}/store/payment-collections`, {
        method: "POST",
        headers,
        body: JSON.stringify({ cart_id: cartId }),
      })
      if (!make.ok) {
        const err = await make.text()
        return res.status(make.status).json({ step: "create-payment-collection", error: err })
      }
      const mj = await make.json().catch(() => ({}))
      pcId = mj?.payment_collection?.id ?? mj?.id
      if (!pcId) return res.status(500).json({ message: "payment_collection not returned" })
    }

    // 2) Create a payment session against the collection (system provider)
    const ps = await fetch(`${BASE}/store/payment-collections/${pcId}/sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ provider_id: providerId }),
    })
    if (!ps.ok) {
      const err = await ps.text()
      return res.status(ps.status).json({ step: "create-payment-session", error: err })
    }

    // 3) Complete the cart → returns { order }
    const done = await fetch(`${BASE}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers,
    })

    const payload = await done.json().catch(() => ({}))
    return res.status(done.status).json(payload)
  } catch (e: any) {
    console.error("pay proxy error:", e?.message || e)
    return res.status(502).json({ message: "proxy-failed" })
  }
}