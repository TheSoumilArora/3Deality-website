// api/medusa/pay.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'

export const config = { runtime: 'nodejs' }

async function readBody(r: Response) {
  const t = await r.text().catch(() => '')
  try { return JSON.parse(t) } catch { return { raw: t } }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  const { cartId, providerId = 'manual' } =
    (req.body || {}) as { cartId?: string; providerId?: string }
  if (!cartId) return res.status(400).json({ message: 'cartId required' })

  const BASE =
    process.env.VITE_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL
  const PUB =
    process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY || process.env.MEDUSA_PUBLISHABLE_API_KEY

  if (!BASE || !PUB) {
    return res.status(500).json({ message: 'Missing MEDUSA env (BASE/PUB)' })
  }

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-publishable-api-key': String(PUB),
    'Idempotency-Key': randomUUID(),
  }

  try {
    // ---- Init session (v2)
    let r = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
      method: 'POST',
      headers,
    })

    // ---- If v2 init failed, try the v1 single-step “set provider”
    if (!r.ok) {
      const v1 = await fetch(`${BASE}/store/carts/${cartId}/payment-session`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ provider_id: providerId }),
      })
      if (!v1.ok) {
        return res.status(v1.status).json({ step: 'init(v1)', data: await readBody(v1) })
      }
    } else {
      // ---- v2 “select provider”
      const set = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ provider_id: providerId }),
      })
      if (!set.ok) {
        return res.status(set.status).json({ step: 'set(v2)', data: await readBody(set) })
      }
    }

    // ---- Complete cart
    const done = await fetch(`${BASE}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers,
    })
    const body = await readBody(done)
    return res.status(done.ok ? 200 : done.status).json(body)
  } catch (e: any) {
    console.error('pay proxy failed:', e?.stack || e)
    return res.status(500).json({ message: 'proxy-failed', error: String(e?.message || e) })
  }
}