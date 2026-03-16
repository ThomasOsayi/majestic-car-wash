# Majestic Car Wash — Repo Layout & Implementation Summary

A Next.js 16 marketing site for **Majestic Car Wash** (Beverly Grove, LA): hand car wash, detailing, and unlimited memberships. Built with React 19, TypeScript, and Tailwind CSS v4.

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
│   │   │   └── page.tsx
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
│       ├── firebase.ts
│       └── firestore.ts
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── REPO-LAYOUT.md          ← this file
└── tsconfig.json
```

*Excluded from tree: `node_modules/`, `.next/` (build output).*

---

## What’s implemented

### Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, custom CSS in `globals.css`
- **Fonts:** Google Fonts — Archivo Black, Outfit, Playfair Display (loaded in `layout.tsx`)

---

### App shell

| File | Role |
|------|------|
| `src/app/layout.tsx` | Root layout: HTML lang, metadata (title/description), scroll-restoration script, font links, global CSS. |
| `src/app/globals.css` | Global styles, Tailwind, and component-specific classes (hero, nav, sections, signup, etc.). |
| `src/app/page.tsx` | Home page: composes Navbar → Hero → Marquee → About → Services → Membership → Gallery → Reviews → Location → CtaBand → Footer. |

---

### Pages

| Route | File | Summary |
|-------|------|--------|
| `/` | `src/app/page.tsx` | Single-page marketing site with all sections and smooth scroll anchors. |
| `/signup` | `src/app/signup/page.tsx` | Multi-step membership signup (plan → vehicle → info → payment) that creates a member record in Firestore and sets pricing/status metadata. |
| `/login` | `src/app/login/page.tsx` | Member login by phone or email; looks up an existing member in Firestore and stores `memberId` in `localStorage`, then routes to `/member`. |
| `/member` | `src/app/member/page.tsx` | Member dashboard: shows QR code, membership status, billing info, vehicle, visit history, monthly wash count, estimated savings, and pause/cancel/reactivate controls (backed by Firestore). |
| `/staff-login` | `src/app/staff-login/page.tsx` | Simple 4-digit PIN screen for staff; currently routes to `/admin` on any 4-digit PIN (placeholder auth). |
| `/admin` | `src/app/admin/page.tsx` | Staff dashboard: daily stats, recent check-ins, quick actions, member check-in/lookup by plate/name/phone, and full members table with visit counts — all powered by Firestore queries. |
| `/terms` | `src/app/terms/page.tsx` | Terms of Service page describing membership agreement, billing, cancellation, usage, liability, and other legal sections. |
| `/privacy` | `src/app/privacy/page.tsx` | Privacy Policy page explaining data collection, usage, SMS, security, visit history, cookies/analytics, and user rights. |

---

### Home page sections (components)

| Component | Purpose |
|-----------|--------|
| **Navbar** | Sticky nav with logo, links (About, Services, Membership, Gallery, Reviews, Location), “Join Now,” scroll-to-section behavior, and scrolled state styling. |
| **Hero** | Full-width hero with parallax background image, tagline (“Beverly Grove Since 1984”), headline (“The Hand Wash Your Car Deserves”), CTA buttons (View Membership Plans, Explore Services). |
| **Marquee** | Horizontal ticker: “100% Hand Wash”, “Full Interior Detail”, “Scratch-Free Guarantee”, “Unlimited Memberships”, “Shell Gas On-Site”, “Beverly Grove, LA”, “Open 7 Days”, “40+ Years of Trust”. |
| **About** | “Our Story” — 42 years, one promise; animated counter (42); short copy and value props. |
| **Services** | “From Quick Wash to Full Detail” — grid of 6 services (Exterior Hand Wash, Full-Service Wash, Premium Detail, Paint Protection, Interior Deep Clean, Sap & Stain Removal) with images, descriptions, and prices; uses `RevealOnScroll`. |
| **Membership** | “Unlimited Memberships” — three tiers (Essential $34.99, Premium $49.99 featured, Ultimate $64.99) with feature lists and CTAs to `/signup?plan=…`; promo strip “First month $14.99”; background image. |
| **Gallery** | “See the Majestic Difference” — image mosaic (6 Unsplash images, some wide). |
| **Reviews** | “Don’t Take Our Word For It” — three testimonial cards (avatar, stars, quote, name, “Google Review”). |
| **Location** | “Visit Us” — embedded Google Map + address (8017 W 3rd St, LA 90048), phone, hours, gas station note, “Drive in — no appointment” CTA. |
| **CtaBand** | Full-width CTA: “Ready for the Cleanest Car on Your Block?” with membership pitch and button to `#membership`. |
| **Footer** | Placeholder footer (structure only, minimal content). |

---

### Shared / UX components

| Component | Purpose |
|-----------|--------|
| **RevealOnScroll** | Wraps content and reveals it when it enters viewport (IntersectionObserver); supports `className`, `delay`, and `as` for wrapper element. Used across About, Services, Membership, Gallery, Reviews, Location, CtaBand. |

---

### Signup flow (`/signup`)

- **Client-only:** `"use client"`, `useSearchParams` for `?plan=essential|premium|ultimate`.
- **Plans:** Essential $34.99, Premium $49.99, Ultimate $64.99; first month promo $14.99.
- **Steps (when no `?plan`):** 1) Plan → 2) Vehicle → 3) Info → 4) Payment.  
  **With `?plan`:** 1) Vehicle → 2) Info → 3) Payment.
- **Vehicle step:** Vehicle type (Sedan / SUV / Minivan) with +$5 for SUV/van; make/model: type-ahead make search (e.g. Tesla, BMW) with “Popular in Beverly Grove” vs “All Brands”, then model chips; color, plate.
- **Info step:** First name, last name, email, phone.
- **Payment step:** Card number (masked display, 4-group formatting), expiry (MM/YY), CVC; summary with plan, monthly total, next charge date, “Start membership” submit.
- **Persistence:** On successful “Start membership”, a new member document is created in Firestore with plan, pricing, status, vehicle, and billing metadata; the generated `memberId` is stored in `localStorage` for use by `/member`.
- **UI:** Top bar (logo + “Back to site”), step progress indicator, single card layout.

---

### Member login & dashboard (`/login`, `/member`)

- **Login options:** Phone or email tabs; each looks up a member via Firestore helpers (`getMemberByPhone`, `getMemberByEmail`).
- **Session storage:** On success, `memberId` is saved in `localStorage` and the user is redirected to `/member`; missing/invalid IDs redirect back to `/login`.
- **Dashboard content:** Shows scannable QR code (generated with `qrcode` and encoded as `MCW:{memberId}`), membership status and billing (plan, monthly price, next billing, member since), vehicle details, recent visit history, monthly wash count, and estimated savings vs retail pricing.
- **Membership management:** Buttons to pause, reactivate, and cancel membership, all calling Firestore helpers (e.g. `updateMemberStatus`) and updating local state.

---

### Staff tools (`/staff-login`, `/admin`)

- **Staff login:** 4-digit PIN UI with auto-advance and basic keyboard handling; currently any non-empty 4-digit PIN navigates to `/admin` (auth placeholder).
- **Admin dashboard:** Top nav with date and staff identity; cards showing “Washes Today”, “Active Members”, “Monthly MRR”, and “Member Washes Today`, fed by `getDashboardStats` and `getTodaysVisits`.
- **Recent check-ins:** List of today’s visits (time, initials, name, vehicle, plan) using Firestore `Visit` data.
- **Quick actions:** Buttons for scanning QR (placeholder), manual lookup, logging walk-in washes (UI only), and jumping to the members table.
- **Member check-in view:** Search by plate/name/phone with debounced Firestore-backed `searchMembers`; select a member to see full profile (plan, billing, contact, vehicle, “member for” duration) and log a visit via `logVisit`, updating visit counts and dashboard stats.
- **Members table:** Pageless table of all members (`getAllMembers`, `getAllVisitCounts`) with plan badges, monthly price, “member for” duration, total visits, and status indicator.

---

### Data and content

- **Copy:** All marketing, legal, and UI copy is in-component (no CMS). Services, membership tiers, reviews, location, legal text, and signup plans are defined in their respective components/pages.
- **Images:** Unsplash URLs (cars, detailing) and placeholder avatars; favicon in `src/app/favicon.ico`.
- **Maps:** Google Maps embed URL in `Location.tsx` (Beverly Grove).

---

### Styling and behavior

- **Tailwind + globals:** Utility classes and custom section/component classes in `globals.css` (hero, nav, marquee, about, services, membership, gallery, reviews, location, cta-band, footer, signup).
- **Scroll:** Manual scroll restoration and scroll-to-top on load via inline script in layout; smooth scroll for in-page anchors.
- **Responsive:** Layout and typography are built to work across viewports (breakpoints and section layout in CSS).

---

### Scripts and config

- **Package scripts:** `dev`, `build`, `start`, `lint`.
- **Config:** `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`.

---

### Backend & data layer (Firebase / Firestore)

- **Firebase app:** `src/lib/firebase.ts` initializes a single Firebase app using env vars (`NEXT_PUBLIC_FIREBASE_*`) and exports a shared Firestore `db` instance.
- **Members & visits collection:** `src/lib/firestore.ts` defines `Member` and `Visit` types and wraps all Firestore access.
- **Member operations:** Create member on signup, get member by ID, list all members, search members in-memory, update member fields/status/vehicle/plan, delete member, and count active members.
- **Visit / check-in operations:** Log check-in visit, get visits for a member, fetch recent/today’s visits, compute per-member monthly visit counts, load dashboard stats (active members, today’s washes, member washes, MRR), and get all visit counts for the admin table.
- **Lookup helpers:** `getMemberByPhone` / `getMemberByEmail` / `getMemberByPlate` power the login and admin flows.

---

## Not implemented (or placeholder)

- **Footer:** Markup only; no links, social, or legal copy.
- **Auth security:** Staff login uses a dummy 4-digit PIN flow with no real authentication; member auth is by phone/email lookup only (no passwords/OTP yet).
- **API routes:** No dedicated Next.js API routes; all Firestore access is from client components.
- **Payments:** Card fields are UI only; Stripe is mentioned in legal copy but not yet wired up in code.
- **QR scanning:** “Scan QR Code” flows in admin are UI placeholders; no camera/QR integration yet.
- **ScrollToTopOnLoad:** Still no dedicated component; scroll restoration handled via inline script in `layout.tsx`.

---

## Quick reference

| Need to… | Look at… |
|----------|----------|
| Change site title/SEO | `src/app/layout.tsx` (metadata) |
| Edit home section order or sections | `src/app/page.tsx` |
| Change services or membership tiers | `src/components/Services.tsx`, `src/components/Membership.tsx` |
| Adjust signup steps or plans | `src/app/signup/page.tsx` (PLANS, steps, form state) |
| Tweak scroll reveal behavior | `src/components/RevealOnScroll.tsx` |
| Update global styles | `src/app/globals.css` |
| Add new pages | New route under `src/app/` (e.g. `src/app/contact/page.tsx`) |

---

*Generated as a repo layout and implementation summary for Majestic Car Wash.*
