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
│   │   └── signup/
│   │       └── page.tsx
│   └── components/
│       ├── About.tsx
│       ├── CtaBand.tsx
│       ├── Footer.tsx
│       ├── Gallery.tsx
│       ├── Hero.tsx
│       ├── Location.tsx
│       ├── Marquee.tsx
│       ├── Membership.tsx
│       ├── Navbar.tsx
│       ├── RevealOnScroll.tsx
│       ├── Reviews.tsx
│       ├── Services.tsx
│       └── (no ScrollToTopOnLoad in src — build may reference cached artifact)
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
| `/signup` | `src/app/signup/page.tsx` | Multi-step membership signup (plan → vehicle → info → payment). |

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
- **UI:** Top bar (logo + “Back to site”), step progress indicator, single card layout; form state and validation handled in component (no backend).

---

### Data and content

- **Copy:** All content is in-component (no CMS). Services, membership tiers, reviews, location, and signup plans are defined in the respective components or `signup/page.tsx`.
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

## Not implemented (or placeholder)

- **Footer:** Markup only; no links, social, or legal copy.
- **Backend:** No API routes, DB, or auth; signup is front-end only.
- **Payments:** Card fields are UI only; no Stripe or other processor.
- **ScrollToTopOnLoad:** Referenced in build output but not present under `src/` (likely legacy/cache).

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
