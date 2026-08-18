# Sanatan Seva Store — Standalone Store

This folder contains ONLY the e-commerce Store portion extracted from the Sanatan Dharma Seva Trust project.

## Store routes
- `/` — Store home
- `/product/:slug` — Product details
- `/cart` — Cart
- `/checkout` — Checkout
- `/login` — Store account login
- `/account` — Customer account
- `/admin` — Admin dashboard

## Main Trust website
https://www.sanatandharmasevatrust.in/

## Product images
Add/edit product images in `public/products/`.

## Products
Edit `src/data/products.ts` to add or update products.

## Environment
Copy `.env.example` to `.env.local` for local Supabase configuration. Never commit production secrets.

## Deployment
Deploy this as a separate Cloudflare project/Worker and connect:
`store.sanatandharmasevatrust.in`

Do not replace or overwrite the existing Trust website deployment.

## Customer sign-up
The `/login` page includes customer sign-up with name, phone, email, password and password confirmation. When Supabase is configured, registration uses the existing Supabase Auth integration.


## Cloudflare Worker deployment

This version is configured as a **Worker + Static Assets** project, not a static-assets-only Worker.

Cloudflare configuration:
- Worker entry point: `src/worker.ts`
- Static asset directory: `dist`
- SPA fallback: enabled
- Worker name: `sanatandharmasevatruststore`

### Cloudflare build settings
Use:
- Build command: `npm run build` (or `bun run build`)
- Deploy command: `npx wrangler deploy`
- Output directory: `dist`

### Variables and Secrets
After the Worker is deployed, add these in Cloudflare **Settings → Variables and Secrets**:
- `SUPABASE_URL` — variable
- `SUPABASE_ANON_KEY` — secret or variable as appropriate
- `CASHFREE_CLIENT_ID` — secret
- `CASHFREE_CLIENT_SECRET` — secret
- `CASHFREE_ENVIRONMENT` — variable (`sandbox` or `production`)

The Worker health endpoint is:
`/api/health`

Do not put service-role keys, Cashfree secret keys, or webhook secrets in React/Vite client-side code.


### Cloudflare dependency note
The project pins `@cloudflare/workers-types` to a published stable version so Bun can resolve dependencies during Cloudflare builds.
