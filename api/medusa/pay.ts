import type { VercelRequest, VercelResponse } from '@vercel/node'
export const config = { runtime: 'nodejs18.x' }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    const { cartId, providerId = 'manual' } = body
    if (!cartId) return res.status(400).json({ error: 'cartId required' })

    const BASE =
      process.env.MEDUSA_BACKEND_URL || process.env.VITE_MEDUSA_BACKEND_URL
    const PUB =
      process.env.MEDUSA_PUBLISHABLE_API_KEY ||
      process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY
    if (!BASE || !PUB) return res.status(500).json({ error: 'Missing Medusa env vars' })

    const json = { 'Content-Type': 'application/json', 'x-publishable-api-key': PUB }

    // 1) create payment sessions
    let r1 = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
      method: 'POST',
      headers: json,
    })
    if (!r1.ok) {
      // Some setups require trailing slash
      r1 = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions/`, {
        method: 'POST',
        headers: json,
      })
    }
    if (!r1.ok) return res.status(r1.status).send(await r1.text())

    // 2) set/select provider (try both v1 shapes)
    let r2 = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
      method: 'PUT',
      headers: json,
      body: JSON.stringify({ provider_id: providerId }),
    })
    if (!r2.ok) {
      r2 = await fetch(
        `${BASE}/store/carts/${cartId}/payment-sessions/${providerId}`,
        { method: 'POST', headers: json }
      )
    }
    if (!r2.ok) return res.status(r2.status).send(await r2.text())

    // 3) complete -> order
    const r3 = await fetch(`${BASE}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers: { 'x-publishable-api-key': PUB },
    })
    const text = await r3.text()
    let payload: any
    try { payload = JSON.parse(text) } catch { payload = { raw: text } }

    return res.status(r3.status).json(payload)
  } catch (e: any) {
    console.error('pay function crashed:', e)
    return res.status(500).json({ error: e?.message || 'server error' })
  }
}