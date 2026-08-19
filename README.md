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

## Cashfree Store checkout

This version uses Cashfree Hosted Web Checkout. The browser never receives the Cashfree secret.
The Cloudflare Worker creates the Cashfree order and the Store webhook verifies Cashfree signatures.

### Required Cloudflare secrets/variables

- `CASHFREE_CLIENT_ID` — Secret
- `CASHFREE_CLIENT_SECRET` — Secret
- `CASHFREE_ENVIRONMENT` — Variable: `PRODUCTION`
- `CASHFREE_WEBHOOK_SECRET` — Secret (optional; if omitted, the client secret is used for webhook verification)
- `SUPABASE_URL` — Variable
- `SUPABASE_ANON_KEY` — Variable

### Cashfree webhook URL

Configure a separate Store webhook in Cashfree:

`https://store.sanatandharmasevatrust.in/api/store/cashfree/webhook`

Subscribe to successful/failed payment events as required by your Cashfree account.

### Cashfree domain whitelisting

Cashfree requires the web domain used to open Hosted Checkout to be whitelisted. Whitelist:

`store.sanatandharmasevatrust.in`

### Product seed

Run `supabase_store_product_seed.sql` once in the Store Supabase project before live payments. The Worker validates cart slugs and prices against its server-side catalogue, so it never trusts the browser's total.

### Important

The Cashfree payment integration is separate from the Trust donation webhook. It uses:
`/api/store/cashfree/create-order`
`/api/store/cashfree/verify`
`/api/store/cashfree/webhook`

Do not point the Store webhook at the Trust donation webhook.


## Admin security
- Admin login uses Supabase Auth.
- Admin role is read from `public.profiles.role`; email address and frontend metadata cannot grant admin access.
- `/admin` is route-guarded in the frontend.
- Database writes must still pass Supabase RLS using `public.is_admin()`.
- Do not use or restore demo admin credentials or client-side role switching in production.
- To make an account an admin, assign its Supabase Auth user ID `role = 'admin'` in `public.profiles` from a trusted administrator workflow.

## Authentication hardening
The production build no longer accepts arbitrary email/password combinations. Customer and Admin login both require Supabase Auth. No demo fallback is used. Admin authorization is read from `public.profiles.role`, not from email addresses or browser storage. Supabase email confirmation should be enabled in Authentication settings.

## Important deployment requirement
Cloudflare Worker runtime variables named `SUPABASE_URL` and `SUPABASE_ANON_KEY` are not automatically available to Vite's `import.meta.env`. The Store must be built with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (publishable key) or use a runtime config endpoint. If Supabase is not configured in the frontend build, the app now refuses authentication and clears legacy demo auth storage.

## Critical auth deployment check
For Vite, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Cloudflare Pages/Workers build environment before building. `SUPABASE_URL` and `SUPABASE_ANON_KEY` alone are Worker runtime variables and are not read by `import.meta.env`.
After deployment, test in a private window. If arbitrary credentials still appear to log in, the browser is not running this build or the frontend is not connected to Supabase Auth.


## Authentication configuration
The frontend reads `VITE_SUPABASE_PUBLISHABLE_KEY` (preferred) and also accepts the legacy `VITE_SUPABASE_ANON_KEY`. There is no demo login fallback. If neither key is present at Vite build time, authentication is disabled and login cannot succeed.
