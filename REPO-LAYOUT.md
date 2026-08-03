# Majestic Car Wash — Repo Layout & Implementation Summary

A Next.js 16 full-stack app for **Majestic Car Wash** (Beverly Grove, LA): multi-page marketing site (menu, membership, deals, contact), Stripe subscriptions, Firebase Auth + Firestore, member dashboard, and staff admin tools. Built with React 19, TypeScript, and Tailwind CSS v4.

**Business model (marketing site):** loyalty club — not unlimited. Members pay a low monthly fee for member pricing, perks, and included washes on higher tiers. Online signup CTAs currently point to **Call to Join**; Stripe signup still exists as an alternate path.

---

## File structure (tree)

```
majestic-car-wash/
├── public/
│   ├── majestic/                         # Real on-site photography
│   │   ├── alacarte-board-1.jpg
│   │   ├── alacarte-board-2.jpg
│   │   ├── detailing-bay.jpg
│   │   ├── service-menu-card.jpg
│   │   ├── storefront.jpg
│   │   └── wash-menu-sign.jpg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                      # Home
│   │   ├── menu/
│   │   │   └── page.tsx                  # Wash & detail menu
│   │   ├── membership/
│   │   │   └── page.tsx                  # Club tiers + FAQ
│   │   ├── deals/
│   │   │   └── page.tsx                  # Coupons & specials
│   │   ├── contact/
│   │   │   └── page.tsx                  # About + reviews + location + form
│   │   ├── signup/
│   │   │   ├── page.tsx                  # Multi-step signup + Stripe Payment Element
│   │   │   └── success/
│   │   │       └── page.tsx              # Legacy Checkout redirect success
│   │   ├── api/
│   │   │   ├── create-subscription/
│   │   │   │   └── route.ts              # Primary Stripe Subscription + clientSecret
│   │   │   ├── create-checkout-session/
│   │   │   │   └── route.ts              # Alternate Stripe Checkout redirect
│   │   │   ├── verify-session/
│   │   │   │   └── route.ts              # Verify Checkout session
│   │   │   └── webhooks/
│   │   │       └── stripe/
│   │   │           └── route.ts          # Stripe webhook handler
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── member/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── staff-login/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   └── privacy/
│   │       └── page.tsx
│   ├── components/
│   │   ├── About.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CtaBand.tsx
│   │   ├── CtaSlim.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx                   # Present; not on current home route
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Icons.tsx                     # Shared SVG icon set
│   │   ├── Location.tsx
│   │   ├── Marquee.tsx
│   │   ├── Membership.tsx
│   │   ├── MembershipFAQ.tsx
│   │   ├── Navbar.tsx
│   │   ├── PageHero.tsx
│   │   ├── RevealOnScroll.tsx
│   │   ├── Reviews.tsx
│   │   ├── Services.tsx
│   │   └── Specials.tsx
│   └── lib/
│       ├── firebase.ts
│       ├── firestore.ts
│       └── stripe.ts
├── .env.local                            # Secrets (not committed)
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── REPO-LAYOUT.md                        ← this file
└── tsconfig.json
```

*Excluded: `node_modules/`, `.next/`.*

---

## What's implemented

### Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 + custom CSS in `globals.css` |
| Fonts | Archivo Black, Outfit, Playfair Display, DM Mono |
| Images | Local photos under `public/majestic/` |
| Database | Firebase Firestore |
| Auth | Firebase Auth (email/password + phone OTP) |
| Payments | Stripe (`stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`) |
| QR | `qrcode` (member), `html5-qrcode` (admin scanner) |

---

### App shell

| File | Role |
|------|------|
| `layout.tsx` | Root metadata, scroll restoration, Google Fonts, global CSS. |
| `globals.css` | Marketing, menu, membership, deals, contact, signup, login, member, admin (`a2-*`), legal, mobile nav drawer, sticky mobile CTA. |
| `page.tsx` | Home composition (see below). |

---

### Marketing pages

| Route | File | Composition |
|-------|------|-------------|
| `/` | `app/page.tsx` | Navbar → Hero → Marquee → About → Services → Membership → Specials → Reviews → Location → CtaBand → Footer |
| `/menu` | `app/menu/page.tsx` | Navbar → PageHero → Services → CtaSlim → Footer |
| `/membership` | `app/membership/page.tsx` | Navbar → PageHero → Membership → HowItWorks → MembershipFAQ → CtaSlim → Footer |
| `/deals` | `app/deals/page.tsx` | Navbar → PageHero → Specials → CtaSlim → Footer |
| `/contact` | `app/contact/page.tsx` | Navbar → PageHero → About → Reviews → Location → ContactForm → Footer |
| `/terms` | `app/terms/page.tsx` | Terms of Service |
| `/privacy` | `app/privacy/page.tsx` | Privacy Policy |

Each dedicated marketing page exports its own `metadata` (title/description).

---

### App / account pages

| Route | File | Summary |
|-------|------|---------|
| `/signup` | `signup/page.tsx` | Multi-step flow: plan (monthly/annual) → vehicle → info + password → Stripe Payment Element → confirmation. Creates Firebase Auth user + Firestore member. Plans still coded as Essential / Premium / Ultimate (legacy unlimited model). |
| `/signup/success` | `signup/success/page.tsx` | Legacy Checkout redirect: verify session → Auth + Firestore member. |
| `/login` | `login/page.tsx` | Email/password or phone OTP (reCAPTCHA); Firestore member lookup; `memberId` in `localStorage`. |
| `/member` | `member/page.tsx` | QR (`MCW:{id}`), status/billing, vehicle, visits, savings, pause/cancel/reactivate. |
| `/staff-login` | `staff-login/page.tsx` | 4-digit PIN → `/admin` (placeholder auth). |
| `/admin` | `admin/page.tsx` | Dashboard stats, MRR breakdown, QR scanner, check-in lookup, members table. |

---

### Home & shared marketing components

| Component | Purpose |
|-----------|---------|
| **Navbar** | Multi-page links (Home, Menu, Membership, Deals, Contact), active route highlight, **Join Now**, mobile burger + full-screen drawer with call CTA. |
| **Hero** | Full-bleed hero with local photo, tagline, CTAs to `/menu` and `/deals`, photo strip thumbnails. |
| **Marquee** | Horizontal trust ticker. |
| **About** | “Hand Car Wash Is Simply Better” — local photos, 100% hand wash badge, feature icons (Hand, Shield, Sparkles, Fuel). |
| **Services** | Full menu: **Silver / Gold / Diamond** washes ($29.99–$39.99), detailing services grid, à la carte list. |
| **Membership** | **Majestic Club** ($19.99), **Club Plus** ($44.99), **Club Elite** ($89.99) — member pricing & included washes; **Call to Join** (`tel:+13239337393`). |
| **Specials** | Valpak coupon cards, weekly specials (Thu / senior / Uber-Lyft / student), frequent wash card, wash books, gift certificates, Shell gas discount. |
| **Reviews** | Testimonial cards. |
| **Location** | Map embed, address, phone, hours, Shell note. |
| **CtaBand** | Full-width membership CTA band. |
| **Footer** | Brand, menu/save/connect columns, legal links, social SVG icons, **mobile sticky CTA bar** (call + Join). |
| **PageHero** | Reusable inner-page hero (image + label + title + sub). |
| **HowItWorks** | 4-step membership enrollment explainer. |
| **MembershipFAQ** | Accordion FAQ (unlimited? cancel? rollover? SUV?). |
| **CtaSlim** | Compact mid/end-page CTA with link button. |
| **ContactForm** | Contact UI (name, phone, email, message); **mock** — `preventDefault` + note to wire email/CRM. |
| **Icons** | Shared Lucide-style SVG set (`Hand`, `Shield`, `Ticket`, `Phone`, etc.). |
| **RevealOnScroll** | IntersectionObserver reveal with delay. |
| **Gallery** | Image mosaic component exists; **not used** on current home page. |

---

### Membership model (marketing)

| Tier | Price | Highlights |
|------|-------|------------|
| Majestic Club | $19.99/mo | 20% off washes & details, free air freshener, every 10th wash free, member texts |
| Club Plus | $44.99/mo | 2 Silver Washes/mo included, 25% off extras |
| Club Elite | $89.99/mo | 3 Silver Washes/mo included, 30% off everything else, free tire shine |

Enrollment on the marketing site is **phone-based** (“Call to Join”). Online Stripe signup (`/signup`) still implements the older Essential/Premium/Ultimate unlimited plans.

---

### Signup / payments (app path)

**Primary:** `/api/create-subscription` → Stripe Subscription + Payment Element on `/signup`.

| Feature | Status |
|---------|--------|
| Monthly / annual toggle | Implemented on signup |
| First-month $14.99 promo (monthly) | Implemented via Stripe coupon |
| Vehicle surcharge (SUV/van) | Implemented |
| Password + Firebase Auth account | Implemented |
| Firestore member with Stripe IDs | Implemented |
| Alternate Checkout session + `/signup/success` | Still present |
| Stripe webhooks | Signature verified; events logged only (no Firestore sync yet) |

---

### Auth, member, admin

| Area | Implemented |
|------|-------------|
| **Login** | Email/password; phone OTP + invisible reCAPTCHA; fallbacks for pre-auth members |
| **Member dashboard** | QR, visits, savings, pause/cancel/reactivate |
| **Admin** | Today’s check-ins, active members, MRR by tier, monthly washes, QR camera scan (`html5-qrcode`), search check-in, members table |
| **Staff login** | PIN UI only (any 4 digits) |

---

### Backend libs

| File | Role |
|------|------|
| `lib/firebase.ts` | Firebase app, `db`, `auth` |
| `lib/firestore.ts` | `Member` / `Visit` types; CRUD; search; visit logging; dashboard stats / visit counts |
| `lib/stripe.ts` | `getServerStripe()`, `getStripe()` |

**Member fields include:** plan, pricing, vehicle, status, `stripeCustomerId`, `stripeSubscriptionId`, `billingInterval`, `authUid`.

---

### Environment variables (`.env.local`)

| Variable | Use |
|----------|-----|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Payment Element |
| `STRIPE_SECRET_KEY` | API routes |
| `STRIPE_WEBHOOK_SECRET` | Webhooks |
| `NEXT_PUBLIC_BASE_URL` | Checkout success/cancel URLs |

---

## Not implemented / placeholders

| Area | Notes |
|------|-------|
| **Marketing vs signup plan mismatch** | Site sells Club / Plus / Elite; `/signup` still Essential / Premium / Ultimate. |
| **Online join from marketing** | Membership CTAs call the shop; no link to `/signup` from Club cards. |
| **Contact form** | UI only — not wired to email/CRM. |
| **Staff auth** | Dummy PIN. |
| **Webhook → Firestore** | Renewals / failures / cancel not synced. |
| **Member self-service** | Update vehicle / payment / upgrade mostly UI. |
| **Gallery on home** | Component unused on `/`. |
| **Member search scale** | Client-side filter over all members. |

---

## Quick reference

| Need to… | Look at… |
|----------|----------|
| SEO / fonts | `src/app/layout.tsx` |
| Home section order | `src/app/page.tsx` |
| Wash & detail menu | `src/components/Services.tsx`, `/menu` |
| Club tiers & copy | `src/components/Membership.tsx`, `/membership` |
| Coupons / specials | `src/components/Specials.tsx`, `/deals` |
| Contact page | `src/app/contact/page.tsx`, `ContactForm.tsx` |
| Nav / mobile drawer | `src/components/Navbar.tsx` |
| Icons | `src/components/Icons.tsx` |
| Stripe signup | `src/app/signup/page.tsx`, `api/create-subscription` |
| Login / member / admin | `login/`, `member/`, `admin/` |
| Firestore | `src/lib/firestore.ts` |
| Styles | `src/app/globals.css` |
| Photos | `public/majestic/` |

---

*Repo layout and implementation summary for Majestic Car Wash.*
