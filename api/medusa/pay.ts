// api/medusa/pay.ts  (Medusa v2)
import type { VercelRequest, VercelResponse } from '@vercel/node'
export const config = { runtime: 'nodejs' } // force Node (not Edge)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { cartId, providerId = 'manual' } =
    (req.body || {}) as { cartId?: string; providerId?: string }
  if (!cartId) return res.status(400).json({ message: 'cartId required' })

  // IMPORTANT: your backend is mounted under /app
  const RAW_BASE =
    process.env.VITE_MEDUSA_BACKEND_URL ||
    process.env.MEDUSA_BACKEND_URL ||
    ''
  const BASE = RAW_BASE.endsWith('/app') ? RAW_BASE : RAW_BASE.replace(/\/$/, '') + '/app'
  const PUB =
    process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY ||
    process.env.MEDUSA_PUBLISHABLE_API_KEY

  if (!BASE || !PUB) return res.status(500).json({ message: 'Missing MEDUSA envs on server' })

  const headers = {
    'content-type': 'application/json',
    'x-publishable-api-key': String(PUB),
  }

  try {
    // 1) ensure there is a payment collection
    let pcId: string | undefined
    try {
      const cR = await fetch(`${BASE}/store/carts/${cartId}`, { headers })
      const cJ = await cR.json().catch(() => ({}))
      pcId = cJ?.cart?.payment_collection?.id ?? cJ?.payment_collection?.id
    } catch {}

    if (!pcId) {
      const make = await fetch(`${BASE}/store/payment-collections`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ cart_id: cartId }),
      })
      if (!make.ok) {
        const err = await make.text()
        console.error('create-payment-collection failed:', make.status, err)
        return res.status(make.status).json({ step: 'create-payment-collection', status: make.status, error: err })
      }
      const mj = await make.json().catch(() => ({}))
      pcId = mj?.payment_collection?.id ?? mj?.id
      if (!pcId) return res.status(500).json({ message: 'payment_collection not returned' })
    }

    // 2) create a payment session for that collection  (v2 path is ".../sessions", not ".../payment-sessions")
    const ps = await fetch(`${BASE}/store/payment-collections/${pcId}/sessions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ provider_id: providerId }),
    })
    if (!ps.ok) {
      const err = await ps.text()
      console.error('create-payment-session failed:', ps.status, err)
      return res.status(ps.status).json({ step: 'create-payment-session', status: ps.status, error: err })
    }

    // 3) complete the cart
    const done = await fetch(`${BASE}/store/carts/${cartId}/complete`, { method: 'POST', headers })
    const payload = await done.json().catch(() => ({}))
    if (!done.ok) console.error('complete-cart failed:', done.status, payload)
    return res.status(done.status).json(payload)
  } catch (e: any) {
    console.error('proxy error:', e)
    return res.status(502).json({ message: 'proxy-failed', error: String(e?.message || e) })
  }
}