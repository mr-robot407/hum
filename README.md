# HUM — Kashmir's Creator Economy Platform

Built at **Buildify Kashmir**. HUM connects local businesses with Kashmir's content creators — AI-matched campaigns, real ROI, launch in 48 hours.

---

## What it does

Businesses in Kashmir have no digital marketing playbook. Creators have no structured way to earn from brands. HUM fixes both sides.

**For businesses** — describe your goal in plain language, get a Claude-written campaign brief, and receive ranked creator matches based on niche fit and engagement. Send offers directly from the platform.

**For creators** — build a verified profile with your content niche, stats, and an AI-generated bio. Receive brand offers, accept or counter, and track your active campaigns.

The match engine runs every offer through Claude, scoring creator-business fit on niche, audience size, engagement rate, and content style — then writes the outreach message automatically.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript / React 19 |
| Database + Auth | Supabase (Postgres, Storage, Auth) |
| AI | Anthropic Claude (`claude-3-5-haiku`) |
| Animation | Motion (Framer successor), GSAP |
| Icons | Lucide React |
| Styling | Inline styles + Tailwind utilities |

---

## Running locally

**Prerequisites:** Node 18+, a Supabase project, an Anthropic API key.

```bash
git clone https://github.com/your-username/hum.git
cd hum
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Run the database schema (one time):

```
supabase-schema.sql → paste into Supabase SQL Editor and run
```

Start dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |

---

## Project structure

```
app/
  page.tsx              — root app shell, all routing logic
  globals.css           — base styles
  api/
    ai/                 — Claude endpoint (match engine, bio gen, briefs)
    profiles/           — creator profiles
    businesses/         — business profiles
    campaigns/          — campaign CRUD
    offers/             — offer send / accept / counter
    messages/           — in-offer messaging
    drops/              — creator content posts
    upload/             — Supabase Storage upload

components/ui/
  hum-landing.tsx       — landing page with story scroll
  auth-page.tsx         — sign in / sign up / skip (test mode)
  stepper-profile.tsx   — creator onboarding (5 steps)
  creator-dashboard.tsx — creator offers + drops view
  match-engine.tsx      — AI-powered creator-business matching
  hum-dock.tsx          — macOS-style bottom dock nav
  floating-action-menu.tsx
  business-digitizer.tsx
  story-scroll.tsx
  circular-testimonials.tsx

lib/
  supabase.ts           — Supabase client
  auth-context.tsx      — auth state provider
  utils.ts

supabase-schema.sql     — full database schema (run once in SQL editor)
```

---

## Features

**Auth** — sign in, sign up, or skip for testing. Email confirmation handled, loading state never hangs.

**Creator flow**
1. Profile setup — name, handles, audience stats (sliders), content niche (12 categories: Daily Vlogs, Travel, Food, Fashion, Tech, Education, Comedy, Fitness, Art, Music, Nature, Business)
2. Content format tags — Short Reels, Long Videos, Photo Content, Podcast, Live, Tutorials, Reviews, Behind the Scenes, Collabs
3. AI bio generation via Claude
4. Drop content (audio, image, video) with AI-generated tags
5. Dashboard — incoming offers, accept or counter with a rate, track active campaigns

**Business flow**
1. Business name + description
2. Industry picker — 7 categories (Food & Dining, Tourism & Hospitality, Handicrafts & Artisan, Retail & Products, Agriculture & Produce, Services, Other) each with 5–7 sub-specializations and a free-text fallback
3. AI strategy generated on setup
4. Campaign builder — goal, budget (quick-fill or custom), Claude-written brief
5. Match engine — AI scores every creator, sends ranked offer with outreach message

**Navigation** — macOS dock-style floating nav on landing, bottom dock on dashboards.

---

## Database

Run `supabase-schema.sql` in the Supabase SQL Editor. It creates:

- `profiles` — creator profiles with social handles + stats
- `businesses` — business profiles
- `campaigns` — brand campaigns with AI briefs
- `offers` — business → creator offers with AI match scores
- `messages` — threaded messaging per offer
- `drops` — creator content posts
- Storage bucket `hum-media` with public read policy
- RLS policies (public read/insert for all tables — tighten for production)

Enable **Email Auth** in Supabase Dashboard → Authentication → Providers → Email.

---

## Build

```bash
npm run build
npm run start
```

---

## Buildify Kashmir

HUM is a product of [Buildify Kashmir](https://buildifykashmir.com) — building the technology infrastructure for Kashmir's creator economy.
