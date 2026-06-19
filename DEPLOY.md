# Deploy CREASE for free (no Vercel)

Stack: **Render** (free web service) + **Neon** (free Postgres) + **Upstash** (free Redis, optional).
All three have permanent free tiers and need no credit card.

> Note: Render's free web service sleeps after ~15 min idle and cold-starts on the
> next request (~30–60s). Fine for demos/portfolio.

## 1. Database — Neon (required)

1. Sign up at https://neon.tech → **New Project**.
2. Copy the **pooled** connection string (looks like
   `postgresql://USER:PASS@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`).
3. Keep it for step 3 (`DATABASE_URL`).

## 2. Redis — Upstash (optional, recommended)

1. Sign up at https://upstash.com → **Create Database** (Redis, free).
2. Copy the **TLS** URL (`rediss://default:PASS@xxx.upstash.io:6379`).
3. Keep it for `REDIS_URL`. Skip this and the app still runs (rate-limiting just degrades open).

## 3. Web app — Render

1. Sign up at https://render.com (log in with GitHub).
2. **New → Blueprint** → pick the `Novarispc/retailapp2` repo.
   Render reads `render.yaml` and provisions the `crease` web service.
3. When prompted, fill the env vars marked *(set value)*:
   - `DATABASE_URL` = Neon pooled string from step 1
   - `REDIS_URL` = Upstash URL from step 2 (or leave blank)
   - `NEXTAUTH_URL` = `https://crease.onrender.com` (use your real service URL)
   - `NEXT_PUBLIC_APP_URL` = same URL
   - `AUTH_SECRET` is auto-generated.
4. Click **Apply**. First build runs `prisma migrate deploy` then `next build`.

## 4. Seed the store (one time)

The storefront needs the default tenant + products. After the first deploy:

- Render Dashboard → `crease` service → **Shell** tab → run:
  ```
  npm run db:seed
  ```

Done. Visit your `*.onrender.com` URL.

Admin login (from seed): `admin@nova.test` / `Admin@12345`.

## Optional integrations

Add these env vars in Render later to enable the corresponding features
(all optional — app runs without them):

| Feature | Vars |
|---|---|
| Google / GitHub login | `AUTH_GOOGLE_ID`/`SECRET`, `AUTH_GITHUB_ID`/`SECRET` |
| Stripe payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| Razorpay payments | `RAZORPAY_KEY_ID`/`SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` |
| AI assistant | `ANTHROPIC_API_KEY` |
| Image uploads | `S3_*` (e.g. free Cloudflare R2 / Backblaze) |
| Email / push | `RESEND_API_KEY`, `VAPID_*` |

Without payment keys, checkout runs in mock-payment mode.

## Alternative free hosts

`render.yaml` + the existing `Dockerfile` also work on **Koyeb** (free) and
**Railway** (trial). Netlify needs the `@netlify/plugin-nextjs` adapter.
