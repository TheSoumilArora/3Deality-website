// api/medusa/pay.ts
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const { cartId, providerId = "manual" } = await req.json().catch(() => ({}));
  if (!cartId)
    return json({ message: "cartId required" }, 400);

  const BASE =
    process.env.VITE_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL;
  const PUB =
    process.env.VITE_MEDUSA_PUBLISHABLE_API_KEY || process.env.MEDUSA_PUBLISHABLE_API_KEY;

  if (!BASE || !PUB)
    return json({ message: "Missing MEDUSA env vars on function" }, 500);

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-publishable-api-key": String(PUB),
  };

  try {
    // 1) create sessions (ok if they already exist)
    const c = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
      method: "POST",
      headers,
    });
    if (!c.ok && c.status !== 409) {
      const t = await c.text();
      console.error("create payment-sessions failed:", c.status, t);
      return json({ step: "create", status: c.status, error: t }, 502);
    }

    // 2) select provider (v1 path)
    const s = await fetch(`${BASE}/store/carts/${cartId}/payment-session`, {
      method: "POST",
      headers,
      body: JSON.stringify({ provider_id: providerId }),
    });

    // fallback to v2-style setter if needed
    if (!s.ok) {
      const s2 = await fetch(`${BASE}/store/carts/${cartId}/payment-sessions`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ provider_id: providerId }),
      });
      if (!s2.ok) {
        const t = await s2.text();
        console.error("set payment session failed:", s2.status, t);
        return json({ step: "set", status: s2.status, error: t }, 502);
      }
    }

    // 3) complete cart → order
    const done = await fetch(`${BASE}/store/carts/${cartId}/complete`, {
      method: "POST",
      headers,
    });

    // pass through Medusa response as-is
    const body = await done.text();
    return new Response(body, {
      status: done.status,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    console.error("pay proxy crashed:", err?.message || err);
    return json({ message: "proxy-failed" }, 500);
  }
}

/* small helper */
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}