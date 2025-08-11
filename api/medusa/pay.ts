// api/medusa/pay.ts  (V2-only: Payment Collections)
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { cartId, providerId = 'manual' } =
    (req.body || {}) as { cartId?: string; providerId?: string }
  if (!cartId) return res.status(400).json({ message: 'cartId required' })

  const BASE =
    process.env.VITE_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL
  const PUB =
    process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY || process.env.MEDUSA_PUBLISHABLE_API_KEY
  if (!BASE || !PUB) return res.status(500).json({ message: 'Missing MEDUSA env vars' })

  const call = async (path: string, init?: RequestInit) => {
    const r = await fetch(`${BASE.replace(/\/$/, '')}${path}`, {
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        'x-publishable-api-key': String(PUB),
        ...(init?.headers || {}),
      },
      ...init,
    })
    const ct = r.headers.get('content-type') || ''
    const data = ct.includes('application/json') ? await r.json().catch(() => ({})) : await r.text()
    return { ok: r.ok, status: r.status, data }
  }

  try {
    // 1) Ensure a Payment Collection exists for the cart
    const created = await call(`/store/carts/${cartId}/payment-collections`, { method: 'POST' })
    let pcId =
      (created.data as any)?.payment_collection?.id ||
      (created.data as any)?.id

    if (!pcId) {
      // If it already existed, fetch from the cart
      const cart = await call(`/store/carts/${cartId}`, { method: 'GET' })
      pcId =
        (cart.data as any)?.cart?.payment_collection_id ||
        (cart.data as any)?.cart?.payment_collection?.id
    }
    if (!pcId) {
      return res.status(502).json({ step: 'create-payment-collection', status: created.status, error: created.data })
    }

    // 2) Create a session for the provider (manual/offline)
    const session = await call(`/store/payment-collections/${pcId}/sessions`, {
      method: 'POST',
      body: JSON.stringify({ provider_id: providerId }),
    })
    // some backends may return 409 if the session already exists — that’s fine
    if (!session.ok && session.status !== 409) {
      return res.status(502).json({ step: 'create-session', status: session.status, error: session.data })
    }

    // 3) Complete the cart → creates the order for manual payments
    const done = await call(`/store/carts/${cartId}/complete`, { method: 'POST' })
    if (!done.ok) {
      return res.status(done.status).json({ step: 'complete', status: done.status, error: done.data })
    }

    return res.status(200).json(done.data)
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'proxy-failed' })
  }
}