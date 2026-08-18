export interface Env {
  ASSETS: Fetcher;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  CASHFREE_CLIENT_ID?: string;
  CASHFREE_CLIENT_SECRET?: string;
  CASHFREE_ENVIRONMENT?: string;
}

const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Server-side health/configuration check.
    // Never return secret values to the browser.
    if (url.pathname === "/api/health") {
      return json({
        status: "ok",
        service: "Sanatan Seva Store",
        environment: env.CASHFREE_ENVIRONMENT || "not-configured",
        supabaseConfigured: Boolean(
          env.SUPABASE_URL && env.SUPABASE_ANON_KEY
        ),
        cashfreeConfigured: Boolean(
          env.CASHFREE_CLIENT_ID &&
          env.CASHFREE_CLIENT_SECRET &&
          env.CASHFREE_ENVIRONMENT
        ),
        timestamp: new Date().toISOString(),
      });
    }

    // All other requests are served by the Vite/React static assets.
    // `single-page-application` in wrangler.jsonc makes client-side
    // routes such as /cart, /checkout and /admin resolve to index.html.
    return env.ASSETS.fetch(request);
  },
};
