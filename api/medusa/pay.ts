// api/medusa/pay.ts  (Medusa v2)
import type { VercelRequest, VercelResponse } from "@vercel/node";
export const config = { runtime: "nodejs" };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { cartId, providerId = 'system' } = (req.body || {}) as {
    cartId?: string;
    providerId?: string
  };
  if (!cartId) return res.status(400).json({ message: "cartId required" });

  const BASE = process.env.VITE_MEDUSA_BACKEND_URL;
  const PUB = process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY;

  const headers = { "content-type": "application/json", "x-publishable-api-key": String(PUB), };

  try 
  {
    // 1) Ensure a payment collection exists
    let pcId: string | undefined;
    try 
    {
      const c = await fetch(`${BASE}/store/carts/${cartId}`, { headers }).then(r => r.json()).catch(() => ({} as any));
      pcId = c?.cart?.payment_collection?.id ?? c?.payment_collection?.id
    }
    catch {}

    if (!pcId)
    {
      const r = await fetch(`${BASE}/store/payment-collections`, {
        method: "POST",
        headers,
        body: JSON.stringify({ cart_id: cartId }),
      });
      if (!r.ok)
      {
        return res.status(r.status).json({ step: "create-payment-collection", status: r.status, error: await r.text(), });
      }
      const j = await r.json().catch(() => ({}));
      pcId = j?.payment_collection?.id ?? j?.id;
      if (!pcId)
        return res.status(500).json({ message: "payment_collection not returned" });
    }

    // 2) Create a payment session for that collection (v2 path)
    const ps = await fetch(`${BASE}/store/payment-collections/${pcId}/payment-sessions`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ provider_id: providerId }),
      });
    if (!ps.ok)
    {
      return res.status(ps.status).json({ step: "create-payment-session", status: ps.status, error: await ps.text(), });
    }

    // 3) Complete the cart
    const done = await fetch(`${BASE}/store/carts/${cartId}/complete`, { method: "POST", headers, });
    const payload = await done.json().catch(() => ({}));
    return res.status(done.status).json(payload);
  }
  
  catch (e: any)
  {
    return res.status(502).json({ message: "proxy-failed", error: String(e?.message || e) });
  }
}