// api/medusa/pay.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { cartId, providerId = 'manual' } = (req.body || {}) as { cartId?: string; providerId?: string }
  if (!cartId) return res.status(400).json({ message: 'cartId required' })

  const BASE =
    process.env.VITE_MEDUSA_BACKEND_URL ||
    process.env.MEDUSA_BACKEND_URL
  const PUB =
    process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY ||
    process.env.MEDUSA_PUBLISHABLE_API_KEY

  const headers = {
    'content-type': 'application/json',
    'x-publishable-api-key': String(PUB),
  }

  try {
    // v1+v2 compatible flow: create -> set -> complete
    await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, { method: 'POST', headers })
    await fetch(`${BASE}/store/carts/${cartId}/payment-session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ provider_id: providerId }),
    })
    const done = await fetch(`${BASE}/store/carts/${cartId}/complete`, { method: 'POST', headers })

    const payload = await done.json().catch(() => ({}))
    return res.status(done.status).json(payload)
  } catch (e: any) {
    console.error('pay proxy failed:', e?.message || e)
    return res.status(500).json({ message: 'proxy-failed' })
  }
}