import { products } from "./data/products";

export interface Env {
  ASSETS: Fetcher;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  CASHFREE_CLIENT_ID?: string;
  CASHFREE_CLIENT_SECRET?: string;
  CASHFREE_ENVIRONMENT?: string;
  CASHFREE_WEBHOOK_SECRET?: string;
}

const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });

const cashfreeBase = (env: Env) =>
  (env.CASHFREE_ENVIRONMENT || "").toUpperCase() === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const cfHeaders = (env: Env, requestId: string, idempotencyKey?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": env.CASHFREE_CLIENT_ID || "",
    "x-client-secret": env.CASHFREE_CLIENT_SECRET || "",
    "x-api-version": "2025-01-01",
    "x-request-id": requestId,
  };
  if (idempotencyKey) headers["x-idempotency-key"] = idempotencyKey;
  return headers;
};

const makeOrderId = () =>
  `STORE_${Date.now()}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;

function getClientIp(request: Request) {
  return request.headers.get("CF-Connecting-IP") || "";
}

async function verifyWebhookSignature(
  timestamp: string,
  rawBody: string,
  signature: string,
  secret: string
) {
  const data = new TextEncoder().encode(timestamp + rawBody);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, data);
  const bytes = new Uint8Array(digest);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  const expected = btoa(binary);

  const a = new TextEncoder().encode(expected);
  const b = new TextEncoder().encode(signature);
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function validateCart(items: Array<{ slug: string; quantity: number }>) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
    throw new Error("Invalid cart.");
  }

  const normalized = [];
  for (const item of items) {
    const slug = String(item?.slug || "").trim();
    const quantity = Number(item?.quantity);
    if (!slug || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new Error("Invalid product quantity.");
    }

    const product = products.find((p) => p.slug === slug);
    if (!product || product.stock < quantity) {
      throw new Error(`Product unavailable: ${slug}`);
    }

    normalized.push({ product, quantity });
  }

  return normalized;
}

async function createCashfreeOrder(request: Request, env: Env) {
  if (!env.CASHFREE_CLIENT_ID || !env.CASHFREE_CLIENT_SECRET) {
    return json({ error: "Cashfree credentials are not configured." }, 503);
  }

  const body = await request.json() as {
    items?: Array<{ slug: string; quantity: number }>;
    customer?: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };

  const cart = validateCart(body.items || []);
  const customer = body.customer || {};

  const name = String(customer.name || "").trim();
  const email = String(customer.email || "").trim();
  const phone = String(customer.phone || "").replace(/\D/g, "");

  if (!name || !email || phone.length < 10) {
    return json({ error: "Valid customer name, email and phone are required." }, 400);
  }

  // IMPORTANT: Amount is calculated from the server-side product catalogue.
  // Never trust a total sent by the browser.
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  // Keep the existing Store shipping rule, but calculate it server-side.
  const shipping = subtotal < 999 ? 75 : 0;
  const total = Math.max(0, subtotal + shipping);

  if (total < 1) {
    return json({ error: "Order amount must be greater than zero." }, 400);
  }

  const orderId = makeOrderId();
  const origin = new URL(request.url).origin;
  const returnUrl =
    `${origin}/store/checkout?cashfree=return&order_id=${encodeURIComponent(orderId)}`;

  const payload = {
    order_id: orderId,
    order_amount: Number(total.toFixed(2)),
    order_currency: "INR",
    customer_details: {
      customer_id: `store_${phone.slice(-10)}`,
      customer_name: name.slice(0, 100),
      customer_email: email.slice(0, 100),
      customer_phone: phone.slice(-10),
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: `${origin}/api/store/cashfree/webhook`,
    },
    order_note: "Sanatan Seva Store product purchase",
    order_tags: {
      transaction_type: "STORE_PURCHASE",
    },
  };

  const response = await fetch(`${cashfreeBase(env)}/orders`, {
    method: "POST",
    headers: cfHeaders(env, crypto.randomUUID(), crypto.randomUUID()),
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Cashfree create order failed", {
      status: response.status,
      requestId: response.headers.get("x-request-id"),
      clientIp: getClientIp(request),
    });
    return json({ error: "Cashfree could not create the payment order." }, 502);
  }

  return json({
    success: true,
    orderId,
    paymentSessionId: result.payment_session_id,
    amount: total,
    currency: "INR",
  });
}

async function verifyCashfreeOrder(request: Request, env: Env) {
  if (!env.CASHFREE_CLIENT_ID || !env.CASHFREE_CLIENT_SECRET) {
    return json({ error: "Cashfree credentials are not configured." }, 503);
  }

  const body = await request.json() as { orderId?: string };
  const orderId = String(body.orderId || "");

  if (!/^STORE_[A-Za-z0-9_]+$/.test(orderId)) {
    return json({ error: "Invalid store order ID." }, 400);
  }

  const response = await fetch(
    `${cashfreeBase(env)}/orders/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      headers: cfHeaders(env, crypto.randomUUID()),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    return json({ error: "Unable to verify payment status." }, 502);
  }

  return json({
    success: true,
    orderId,
    orderStatus: result.order_status,
    paid: result.order_status === "PAID",
    amount: result.order_amount,
    currency: result.order_currency,
  });
}

async function handleWebhook(request: Request, env: Env) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature") || "";
  const timestamp = request.headers.get("x-webhook-timestamp") || "";
  const secret = env.CASHFREE_WEBHOOK_SECRET || env.CASHFREE_CLIENT_SECRET || "";

  if (!signature || !timestamp || !secret) {
    return json({ error: "Webhook verification configuration missing." }, 400);
  }

  const valid = await verifyWebhookSignature(timestamp, rawBody, signature, secret);
  if (!valid) {
    return json({ error: "Invalid webhook signature." }, 401);
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid webhook JSON." }, 400);
  }

  const orderId = payload?.data?.order?.order_id;
  const paymentStatus = payload?.data?.payment?.payment_status;

  if (typeof orderId === "string" && orderId.startsWith("STORE_")) {
    // This endpoint intentionally does not trust the webhook as the sole source
    // of truth. The customer return path also calls Get Order API, and both
    // must reflect PAID before the application treats the order as successful.
    console.log("Verified Store Cashfree webhook", {
      orderId,
      paymentStatus,
      eventType: payload?.type,
    });
  }

  return json({ received: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        status: "ok",
        service: "Sanatan Seva Store",
        environment: env.CASHFREE_ENVIRONMENT || "not-configured",
        supabaseConfigured: Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
        cashfreeConfigured: Boolean(
          env.CASHFREE_CLIENT_ID &&
          env.CASHFREE_CLIENT_SECRET &&
          env.CASHFREE_ENVIRONMENT
        ),
        storeCashfreeWebhook: "/api/store/cashfree/webhook",
        timestamp: new Date().toISOString(),
      });
    }

    if (request.method === "POST" && url.pathname === "/api/store/cashfree/create-order") {
      try {
        return await createCashfreeOrder(request, env);
      } catch (error) {
        console.error("Store create-order error", error);
        return json({ error: "Unable to create payment order." }, 500);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/store/cashfree/verify") {
      try {
        return await verifyCashfreeOrder(request, env);
      } catch (error) {
        console.error("Store verify-order error", error);
        return json({ error: "Unable to verify payment." }, 500);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/store/cashfree/webhook") {
      try {
        return await handleWebhook(request, env);
      } catch (error) {
        console.error("Store webhook error", error);
        return json({ error: "Webhook processing failed." }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
