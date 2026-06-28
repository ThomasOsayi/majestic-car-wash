# Majestic Car Wash — Repo Layout & Implementation Summary

A Next.js 16 full-stack membership app for **Majestic Car Wash** (Beverly Grove, LA): marketing site, Stripe subscriptions, Firebase Auth + Firestore, member dashboard, and staff admin tools. Built with React 19, TypeScript, and Tailwind CSS v4.

---

## File structure (tree)

```
majestic-car-wash/
├── public/
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
│   │   ├── page.tsx
│   │   ├── signup/
│   │   │   ├── page.tsx              # Multi-step signup + embedded Stripe Payment Element
│   │   │   └── success/
│   │   │       └── page.tsx          # Legacy Checkout redirect success handler
│   │   ├── api/
│   │   │   ├── create-subscription/
│   │   │   │   └── route.ts          # Primary payment flow — Stripe Subscription + clientSecret
│   │   │   ├── create-checkout-session/
│   │   │   │   └── route.ts          # Alternate Stripe Checkout redirect flow
│   │   │   ├── verify-session/
│   │   │   │   └── route.ts          # Verify Checkout session after redirect
│   │   │   └── webhooks/
│   │   │       └── stripe/
│   │   │           └── route.ts      # Stripe webhook handler
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
│   │   ├── CtaBand.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   ├── Hero.tsx
│   │   ├── Location.tsx
│   │   ├── Marquee.tsx
│   │   ├── Membership.tsx
│   │   ├── Navbar.tsx
│   │   ├── RevealOnScroll.tsx
│   │   ├── Reviews.tsx
│   │   └── Services.tsx
│   └── lib/
│       ├── firebase.ts               # Firebase app, Firestore db, Auth
│       ├── firestore.ts              # Member & visit CRUD + dashboard stats
│       └── stripe.ts                 # Server + client Stripe helpers
├── .env.local                        # Firebase, Stripe keys (not committed)
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── REPO-LAYOUT.md                    ← this file
└── tsconfig.json
```

*Excluded from tree: `node_modules/`, `.next/` (build output).*

---

## What's implemented

### Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 + custom CSS in `globals.css` |
| Fonts | Google Fonts — Archivo Black, Outfit, Playfair Display |
| Database | Firebase Firestore |
| Auth | Firebase Auth (email/password + phone OTP) |
| Payments | Stripe Subscriptions via Payment Element (`stripe`, `@stripe/stripe-js`, `@stripe/react-stripe-js`) |
| QR codes | `qrcode` (member dashboard), `html5-qrcode` (admin scanner) |

---

### App shell

| File | Role |
|------|------|
| `src/app/layout.tsx` | Root layout: metadata, scroll-restoration script, font links, global CSS. |
| `src/app/globals.css` | Global + section styles (marketing, signup, login, member, admin `a2-*`, legal). |
| `src/app/page.tsx` | Home: Navbar → Hero → Marquee → About → Services → Membership → Gallery → Reviews → Location → CtaBand → Footer. |

---

### Pages

| Route | File | Summary |
|-------|------|--------|
| `/` | `page.tsx` | Single-page marketing site with smooth-scroll anchors. |
| `/signup` | `signup/page.tsx` | Multi-step signup: plan (+ monthly/annual toggle) → vehicle → info + password → embedded Stripe payment → inline confirmation. Creates Firebase Auth user + Firestore member. |
| `/signup/success` | `signup/success/page.tsx` | Legacy path for Stripe Checkout redirect: verifies session, creates Auth user + Firestore member. Primary flow confirms on `/signup` step 5 instead. |
| `/login` | `login/page.tsx` | Member login via email/password (Firebase Auth) or phone OTP (Firebase Phone Auth + invisible reCAPTCHA). Falls back to Firestore lookup for pre-auth members. |
| `/member` | `member/page.tsx` | Member dashboard: QR code (`MCW:{id}`), status/billing, vehicle, visit history, savings calc, pause/cancel/reactivate. |
| `/staff-login` | `staff-login/page.tsx` | 4-digit PIN gate; any complete PIN routes to `/admin` (placeholder auth). |
| `/admin` | `admin/page.tsx` | Staff dashboard: stats, MRR breakdown, QR scanner, manual lookup, check-in, members table. |
| `/terms` | `terms/page.tsx` | Terms of Service (membership, billing, cancellation, liability). |
| `/privacy` | `privacy/page.tsx` | Privacy Policy (data collection, SMS, Firebase/Stripe storage, visit history). |

---

### Home page sections (components)

| Component | Purpose |
|-----------|--------|
| **Navbar** | Sticky nav, section links, **Member Login** (`/login`), **Join Now** CTA. |
| **Hero** | Parallax hero, tagline, headline, CTAs to membership and services. |
| **Marquee** | Scrolling trust badges (hand wash, memberships, Shell gas, 40+ years, etc.). |
| **About** | "42 Years. One Promise." with animated counter and value props. |
| **Services** | 6 service cards with images, descriptions, and prices. |
| **Membership** | 3 tiers with **monthly/annual billing toggle** (Save 15%), feature lists, CTAs to `/signup?plan=…&interval=…`. |
| **Gallery** | 6-image mosaic. |
| **Reviews** | 3 Google-style testimonial cards. |
| **Location** | Google Maps embed, address, phone, hours, gas station note. |
| **CtaBand** | Full-width membership CTA. |
| **Footer** | Brand copy, service/membership links, social (Instagram, Facebook, Yelp, Maps), legal links (`/terms`, `/privacy`), staff link (`/staff-login`). |

---

### Shared / UX components

| Component | Purpose |
|-----------|--------|
| **RevealOnScroll** | IntersectionObserver reveal with optional delay; used across marketing sections. |

---

### Signup flow (`/signup`) — primary path

**Steps (no `?plan`):** Plan → Vehicle → Info → Payment → Confirmation  
**With `?plan`:** Vehicle → Info → Payment → Confirmation  
**Query params:** `?plan=essential|premium|ultimate`, `?interval=annual` (optional)

| Step | Details |
|------|---------|
| **Plan** | Monthly/annual toggle. Essential ($34.99/mo or $349.99/yr), Premium ($49.99/$499.99), Ultimate ($64.99/$649.99). Monthly promo: first month $14.99. Annual: pay upfront, save ~15%. |
| **Vehicle** | Sedan / SUV / Van (+$5/mo or +$60/yr surcharge). Type-ahead make search (30+ brands), model chips, color, license plate. |
| **Info** | First/last name, email, phone, password + confirm (min 6 chars). |
| **Payment** | Calls `/api/create-subscription` → Stripe Payment Element (cards, Apple Pay, Google Pay). Monthly: $14.99 due today. Annual: full year due today. |
| **Confirmation** | Creates Firebase Auth account + Firestore member with `stripeCustomerId`, `stripeSubscriptionId`, `authUid`, `billingInterval`. Stores `memberId` in `localStorage`. |

---

### Member login & dashboard

**Login (`/login`)**
- **Email tab:** Firebase `signInWithEmailAndPassword` → lookup member by `authUid` (fallback: email in Firestore).
- **Phone tab:** Firebase Phone Auth with invisible reCAPTCHA → 6-digit OTP → lookup by `authUid` or phone. Firestore-only fallback if phone auth unavailable.

**Dashboard (`/member`)**
- Scannable QR code (`MCW:{memberId}`) via `qrcode` library.
- Membership status grid: plan, monthly total, next billing, member since, status, plate.
- Vehicle on file with type icon and surcharge note.
- Recent visits (last 10) + monthly wash count + savings vs retail.
- Manage subscription: upgrade (UI), update payment (UI), pause, cancel with confirmation.

---

### Staff tools (`/staff-login`, `/admin`)

**Staff login:** 4-digit PIN UI; routes to admin on any filled PIN.

**Admin dashboard (redesigned `a2-*` UI):**

| Tab | Features |
|-----|----------|
| **Dashboard** | Check-ins today, active members (by tier), **MRR with tier breakdown** (monthly/annual normalized), washes this month, recent check-ins list, quick actions. |
| **Check-In** | **Live QR scanner** (`html5-qrcode`, parses `MCW:{id}`), manual search (plate/name/phone), member profile card, check-in button (logs visit via `logVisit`), interval badge (Monthly/Annual). |
| **Members** | Searchable table: name, vehicle, plan, price (with interval), tenure, visit count, status. |

---

### Backend & data layer

**Firebase (`src/lib/firebase.ts`)**
- Initializes Firebase app from `NEXT_PUBLIC_FIREBASE_*` env vars.
- Exports `db` (Firestore) and `auth` (Firebase Auth).

**Firestore (`src/lib/firestore.ts`)**

| Collection | Types / fields |
|------------|----------------|
| `members` | `Member`: name, email, phone, plan, planName, price, status, vehicle, surcharge, memberSince, nextBilling, `stripeCustomerId`, `stripeSubscriptionId`, `billingInterval`, `authUid`, createdAt |
| `visits` | `Visit`: memberId, memberName, initials, serviceType, plan, vehicleInfo, date, checkedInBy |

| Function | Purpose |
|----------|---------|
| `createMember` | Create member on signup |
| `getMember` / `getAllMembers` | Read members |
| `getMemberByPhone` / `getMemberByEmail` / `getMemberByPlate` / `getMemberByAuthUid` | Login & lookup |
| `searchMembers` | Client-side filter (plate, name, phone, email) |
| `updateMember` / `updateMemberStatus` / `updateMemberVehicle` / `updateMemberPlan` | Member updates |
| `deleteMember` | Remove member |
| `logVisit` / `getMemberVisits` / `getTodaysVisits` / `getMonthlyVisitCount` / `getMonthlyTotalVisits` | Visit tracking |
| `getDashboardStats` / `getAllVisitCounts` | Admin stats (active members, MRR, today's washes) |

---

### Payments & Stripe integration

**Stripe helpers (`src/lib/stripe.ts`)**
- `getServerStripe()` — server-side Stripe client (`STRIPE_SECRET_KEY`).
- `getStripe()` — client-side loader (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).

| API route | Purpose |
|-----------|---------|
| **`POST /api/create-subscription`** | **Primary flow.** Creates Stripe customer, recurring price (monthly or annual + surcharge), first-month promo coupon (monthly only), incomplete subscription, returns `clientSecret` for Payment Element. |
| **`POST /api/create-checkout-session`** | Alternate flow. Creates Stripe Checkout subscription session with promo coupon; redirects to hosted checkout. |
| **`POST /api/verify-session`** | Retrieves Checkout session, confirms payment, returns member payload from subscription metadata (used by `/signup/success`). |
| **`POST /api/webhooks/stripe`** | Verifies webhook signature; handles `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted` (logs only — Firestore sync TODO). |

**Billing intervals**
- **Monthly:** $14.99 first month via one-time Stripe coupon, then plan rate + surcharge.
- **Annual:** Full year upfront (plan annual price + surcharge × 12), ~15% savings vs monthly.

---

### Environment variables (`.env.local`)

| Variable | Used by |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase init |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Payment Element |
| `STRIPE_SECRET_KEY` | Server Stripe API routes |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `NEXT_PUBLIC_BASE_URL` | Checkout success/cancel URLs (Checkout flow) |

---

## Not implemented (or placeholder)

| Area | Status |
|------|--------|
| **Staff auth** | PIN accepts any 4 digits; no real staff accounts or session. |
| **Webhook → Firestore sync** | Renewals, failures, and cancellations logged but not written to Firestore. |
| **Member self-service** | "Update Vehicle" and "Update Payment" buttons are UI only. |
| **Upgrade plan** | Button present on member dashboard; no Stripe plan change wired up. |
| **Walk-in wash logging** | Removed from admin quick actions; no non-member wash tracking. |
| **CMS** | All copy is hardcoded in components. |
| **Firestore search** | `searchMembers` fetches all members and filters client-side (not scalable). |

---

## Quick reference

| Need to… | Look at… |
|----------|----------|
| Change site title/SEO | `src/app/layout.tsx` |
| Edit home section order | `src/app/page.tsx` |
| Change plans or annual pricing | `src/components/Membership.tsx`, `src/app/signup/page.tsx` (PLANS) |
| Adjust signup/payment flow | `src/app/signup/page.tsx`, `src/app/api/create-subscription/route.ts` |
| Change login behavior | `src/app/login/page.tsx`, `src/lib/firebase.ts` |
| Member dashboard features | `src/app/member/page.tsx` |
| Admin check-in / QR scan | `src/app/admin/page.tsx` |
| Firestore schema / queries | `src/lib/firestore.ts` |
| Stripe config / webhooks | `src/lib/stripe.ts`, `src/app/api/webhooks/stripe/route.ts` |
| Global styles | `src/app/globals.css` |

---

*Repo layout and implementation summary for Majestic Car Wash.*
