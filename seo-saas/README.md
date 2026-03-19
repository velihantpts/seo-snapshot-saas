# SEO Snapshot SaaS

Full-stack SEO analyzer. Enter any URL, get a complete audit with fix recommendations.

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS + TypeScript
- **Auth:** NextAuth.js + Google OAuth
- **DB:** Prisma + SQLite (dev) / Postgres (prod)
- **Payments:** Stripe (monthly + lifetime)
- **SEO Engine:** Server-side Cheerio-based analyzer
- **Deploy:** Vercel

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Setup database
npx prisma db push

# 4. Run dev server
npm run dev
```

Open http://localhost:3000

## Environment Setup

### Google OAuth
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Set redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID + Secret to `.env`

### Stripe
1. Go to https://dashboard.stripe.com/apikeys
2. Copy Secret Key + Publishable Key to `.env`
3. Create two products in Stripe:
   - **Pro Monthly:** $1.99/mo recurring → copy Price ID to `STRIPE_PRICE_MONTHLY`
   - **Pro Lifetime:** $7.99 one-time → copy Price ID to `STRIPE_PRICE_LIFETIME`
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy Webhook Secret to `STRIPE_WEBHOOK_SECRET`

### NextAuth
```bash
# Generate secret
openssl rand -base64 32
```

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init"
gh repo create seo-snapshot-saas --public --push

# 2. Deploy
vercel

# 3. Add env vars in Vercel dashboard
# 4. Switch DATABASE_URL to Postgres (Vercel Postgres or Supabase)
# 5. Update NEXTAUTH_URL to your production URL
```

For Postgres, change `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run `npx prisma db push`.

## Features

### Free Tier (3/day)
- SEO score 0-100
- Title, description, canonical, robots, lang
- H1-H6 heading analysis
- Image alt text check
- Internal/external link count
- Open Graph & Twitter cards
- JSON-LD schema detection
- Copy & JSON export

### Pro Tier ($1.99/mo or $7.99 lifetime)
- Unlimited analyses
- Server-side HTTP security headers (HSTS, CSP, X-Frame, etc.)
- Top 15 keywords with density
- Content quality & Flesch readability
- Accessibility audit
- Mobile friendliness check
- Resource analysis (JS/CSS/image sizes)
- Robots.txt & sitemap.xml check
- Schema validation
- Link quality (empty/generic anchors, duplicates)
- Full analysis history & dashboard
- All fix recommendations
- PDF export

### Server-side Advantages (vs Chrome Extension)
| Feature | Extension | Web App |
|---------|-----------|---------|
| HTTP security headers | ✗ | ✓ Real headers |
| Response time | ✗ | ✓ Server-measured |
| robots.txt analysis | Limited | ✓ Full parse |
| Requires install | ✓ | ✗ |
| Works on mobile | ✗ | ✓ |
| Shareable reports | ✗ | ✓ URL-based |
| Analysis history | ✗ | ✓ Dashboard |

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage with URL input
│   ├── layout.tsx            # Root layout + auth provider
│   ├── globals.css           # Tailwind + custom styles
│   ├── analyze/page.tsx      # Full results page
│   ├── dashboard/page.tsx    # History & past analyses
│   ├── pricing/page.tsx      # Pricing plans + Stripe checkout
│   ├── login/page.tsx        # Google OAuth login
│   └── api/
│       ├── analyze/route.ts  # POST: run SEO analysis
│       ├── auth/[...nextauth]/route.ts
│       └── stripe/
│           ├── route.ts      # POST: create checkout session
│           └── webhook/route.ts # Stripe webhook handler
├── components/
│   └── AuthProvider.tsx      # NextAuth session wrapper
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── prisma.ts             # Prisma singleton
│   ├── stripe.ts             # Stripe helpers
│   └── seo-analyzer.ts       # Core SEO engine (server-side)
└── prisma/
    └── schema.prisma         # DB schema
```
