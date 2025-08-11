// api/shiprocket/order.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
export const config = { runtime: 'nodejs' }

type PayMethod = 'cod' | 'hdfc'

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in'

async function login() {
  const email = process.env.SHIPROCKET_EMAIL
  const password = process.env.SHIPROCKET_PASSWORD
  if (!email || !password) throw new Error('Missing SHIPROCKET_EMAIL/PASSWORD')

  const r = await fetch(`${SR_BASE}/v1/external/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!r.ok) throw new Error(`SR login failed: ${r.status} ${await r.text()}`)
  const j = await r.json()
  if (!j?.token) throw new Error('SR login: no token')
  return j.token as string
}

const paiseToRs = (n?: number) => (!n ? 0 : Math.round(n) / 100)

function toShiprocket(order: any, paymentMethod: 'COD' | 'Prepaid') {
  const a = order?.shipping_address || order?.billing_address || {}

  return {
    order_id: String(order.display_id ?? order.id),
    order_date: new Date(order.created_at || Date.now()).toISOString(),
    pickup_location: process.env.SHIPROCKET_DEFAULT_PICKUP,
    channel_id: process.env.SHIPROCKET_CHANNEL_ID || undefined,

    billing_customer_name: a.first_name || 'Customer',
    billing_last_name: a.last_name || '',
    billing_address: a.address_1 || '',
    billing_address_2: a.address_2 || '',
    billing_city: a.city || '',
    billing_pincode: String(a.postal_code || ''),
    billing_state: a.province || '',      // if you later store full state name, put it here
    billing_country: 'India',
    billing_email: order.email || '',
    billing_phone: a.phone || '',

    shipping_is_billing: true,

    order_items: (order?.items || []).map((it: any) => ({
      name: it.title,
      sku: it.variant_sku || it.sku || it.id,
      units: it.quantity,
      selling_price: paiseToRs(it.unit_price),
      discount: 0,
      tax: 0,
    })),

    payment_method: paymentMethod,
    sub_total: paiseToRs(order.subtotal ?? order.item_subtotal ?? 0),

    // basic default dims; refine later if you want
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')

  try {
    const { order, method, paid } = (req.body || {}) as {
      order?: any
      method?: PayMethod
      paid?: boolean
    }

    if (!order) return res.status(400).json({ message: 'order required' })

    // Default to COD if method not supplied (so your current FE keeps working)
    const m: PayMethod = (method || 'cod')

    // HDFC pathway: only create a Prepaid order after payment is captured
    if (m === 'hdfc' && !paid) return res.status(204).end()

    const token = await login()
    const body = toShiprocket(order, m === 'cod' ? 'COD' : 'Prepaid')

    const r = await fetch(`${SR_BASE}/v1/external/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const out = await r.json().catch(async () => ({ raw: await r.text() }))
    return res.status(r.status).json(out)
  } catch (e: any) {
    console.error('shiprocket/order error:', e?.message || e)
    return res.status(502).json({ message: 'shiprocket-failed' })
  }
}