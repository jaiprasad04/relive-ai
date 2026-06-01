# 🎬 Relive AI — ReLive Video Studio SaaS

> **Dramatically bring your thoughts, memories, and start frames to life with state-of-the-art AI video models.** Upload a start frame picture, write a custom text prompt, select Google Veo or OpenAI Sora 2 Pro models directly in the control sidebar, and view high-definition cinematic video generations. A production-ready, self-hostable Next.js SaaS.

**Tech stack:** Next.js 16 (App Router) · Prisma · PostgreSQL · NextAuth (Google OAuth) · Stripe · Tailwind CSS (v4) · MuAPI (Veo 3.1 & Sora 2) · Webhook-backed async delivery  
**Use cases:** Cinematic memory preservation · AI advertising video · Creative storyboarding · Digital media staging portfolios

![ReLive AI Interface](https://cdn.muapi.ai/data/2/913205055314/Screenshot_2026-06-01_175446.png)

## 🌐 Project Details

**GitHub Repository:** [github.com/SamurAIGPT/relive-ai](https://github.com/SamurAIGPT/relive-ai)

**Live Demo:** [relive-ai.vercel.app](https://relive-ai.vercel.app/)

---

ReLive AI is a premium SaaS web application that generates photorealistic and dramatic video clips using advanced generative models. Users upload a starting image, select standard vs pro models, configure aspect ratios, duration, and target resolutions directly in the left sidebar, and track processing renders in real time.

## ✨ Core Features

### 🎬 AI Prediction Studio (Main Page `/`)
- Upload frame images via drag-and-drop or file selector, directly uploaded to S3 CDN for reliable pipeline handshakes.
- Fully interactive **guest preview mode** allowing unauthenticated users to explore dropdowns and options, displaying a high-contrast warning banner and prompting Google sign-in only when generations are submitted.
- **Dual AI Video Models**:
  - **Google Veo 3.1 (veo3-image-to-video)**: Highly detailed start frame animations and cinematic camera sweeps (500 credits flat for 8s clip).
  - **OpenAI Sora 2 Pro (openai-sora-2-pro-image-to-video)**: Cinematic quality, physics modeling, and premium rendering slots (60 credits/sec for 720p, 100 credits/sec for 1080p).
- **Control Parameters**:
  - 📏 **Aspect Ratio** — 16:9 Landscape and 9:16 Portrait options via custom select dropdowns.
  - ⏱️ **Duration** — Sora supports 4s, 8s, 12s, 16s, 20s options; Veo locks standard duration to 8s.
  - 🖥️ **Resolution** — Up to 1080p FHD targets supported on pro video rendering slots.
- Custom dropdowns engineered with `upward={true}` alignment near screen bounds and `overscroll-contain` scroll isolation.

### 🖼️ Showcase creations Gallery (`/gallery`)
- Responsive CSS grid of completed video clips with auto-refresh polling every 4 seconds.
- Full detail modal displaying inputs, prompts, metrics, and direct CORS-bypass proxy downloads.

### 💳 Stripe Credit Billing (`/pricing`)
- Four one-time credit packs (no subscriptions):
  - **Starter Pack** ($5 / 100 credits — 1 sec Sora 2 Pro 1080p or up to 1.6 sec Sora 2 Pro 720p)
  - **Standard Pack** ($10 / 250 credits — 2.5 sec Sora 2 Pro 1080p or up to 4 sec Sora 2 Pro 720p)
  - **Professional Pack** ($20 / 600 credits — 1x Google Veo 3.1 flat generation or up to 10 sec Sora 2 Pro 720p — Best Value)
  - **Enterprise Pack** ($50 / 2,000 credits — 4x Google Veo 3.1 flat generations or up to 33 sec Sora 2 Pro 720p)

### 🔐 Google Auth & balance syncing
- NextAuth Google Provider with Prisma PostgreSQL adapter.
- Pulsing credits displays in global sticky Header.

---

## ⚡ Deployment: Vercel & Production

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SamurAIGPT/relive-ai)

### 🔑 Required Environment Variables

| Service | Variable | Description |
| :--- | :--- | :--- |
| **Database** | `DATABASE_URL` | PostgreSQL connection string (Supabase pooled connection) |
| | `DIRECT_URL` | Direct PostgreSQL connection string |
| **NextAuth** | `NEXTAUTH_SECRET` | Secure random string via `openssl rand -base64 32` |
| | `NEXTAUTH_URL` | Your production domain |
| | `WEBHOOK_URL` | Public URL for MuAPI async callbacks |
| **Google OAuth** | `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth Client ID |
| | `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth Client Secret |
| **Stripe** | `STRIPE_SECRET_KEY` | Stripe Secret API Key |
| | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable API Key |
| | `STRIPE_WEBHOOK_SECRET` | Stripe checkout session webhook signing secret |
| **AI** | `MUAPIAPP_API_KEY` | Developer API key from [muapi.ai](https://muapi.ai) |

### 🚀 Production Deployment Setup

1. **Database**: Spin up a PostgreSQL database instance on Supabase.
2. **Import**: Import the forked repo into Vercel.
3. **Environment**: Add all required env keys listed in the variables table above.
4. **Build Script**: Project builds automatically using `prisma generate && next build`.
5. **Database sync**: Run `npx prisma db push` to generate tables.
6. **Callbacks**:
   - Google: `https://relive-ai.vercel.app/api/auth/callback/google`
   - Stripe Webhook: `https://relive-ai.vercel.app/api/webhook/stripe`
   - MuAPI: `https://relive-ai.vercel.app/api/webhook/muapi`

---

## 🛠️ Local Development

### Prerequisites
- Node.js v18+
- Active PostgreSQL database connection

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/SamurAIGPT/relive-ai
cd relive-ai

# 2. Install dependencies
npm install

# 3. Setup local environment variables
cp .env.example .env
# Fill in active credentials

# 4. Generate Client & Sync DB
npx prisma generate
npx prisma db push

# 5. Start dev server
npm run dev
```

---

## ⚠️ Database Safety Warning (Shared Pool)

The database is shared across multiple active applications in the workspace. Running `npx prisma db push` on a clean schema will drop other apps' tables. Always follow the **Pull-Declare-Push-Cleanup** sequence:

1. `npx prisma db pull` — Introspect all existing tables into `schema.prisma`
2. Add your `ReliveCreation` model and its `User` relation
3. `npx prisma db push` — Safely add new tables and relations
4. Clean `schema.prisma` to keep only `Account`, `Session`, `User`, `VerificationToken`, `ReliveCreation`
5. `npx prisma generate` — Rebuild the type-safe Prisma client

---

## 🏗️ Technical Architecture

```
relive-ai/
├── prisma.config.ts          # Dynamic datasource for Prisma v7
├── prisma/
│   └── schema.prisma         # ReliveCreation model + NextAuth tables
├── src/
│   ├── app/
│   │   ├── page.js           # Studio Page (upload, custom dropdown parameters, creations list)
│   │   ├── gallery/page.js   # Personal creations Showcase Portfolio
│   │   ├── pricing/page.js   # Stripe pricing plans and model tables
│   │   └── api/
│   │       ├── auth/         # NextAuth route handler
│   │       ├── upload/       # S3-backed CDN upload proxy (via MuAPI)
│   │       ├── relive/       # Credit deduction & task trigger
│   │       ├── creations/    # GET creations with self-healing webhook bypass
│   │       ├── download/     # CORS-bypass download proxy
│   │       ├── webhook/muapi/ # MuAPI async callback webhook
│   │       └── webhook/stripe/ # Stripe checkout session webhook
│   ├── components/
│   │   ├── SessionProvider.js # Auth session provider wrapper
│   │   └── Header.js         # Unified sticky header navigation and controls
│   └── lib/
│       ├── auth.js           # Auth config
│       ├── config.js         # Central config, models cost, and pricing plans
│       ├── prisma.js         # Singleton Prisma client connection pool
│       ├── stripe.js         # Stripe SDK configuration
│       └── services/
│           ├── user.js       # Credits ledger services
│           ├── billing.js    # Stripe session helper
│           └── ai.js         # Generation polling and check status logic
└── next.config.mjs           # Next image routing config
```

---

## 📄 License

MIT Licensed.

---

_ReLive AI: A premium, cyber-teal themed AI video generation SaaS built with the Inter font family, Google Veo 3.1, and OpenAI Sora 2._
