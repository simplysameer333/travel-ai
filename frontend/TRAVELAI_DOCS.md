# TravelAI Frontend — Complete Project Documentation

> Single source of truth for any AI agent or new developer. Read this before writing any code.

---

## 1. Project Overview

**TravelAI** is a full-stack AI-powered travel planning and booking platform targeting Indian travellers (with international coverage). Users can search for Flights, Hotels, Holiday Packages, Bus tickets, and Car rentals through a Skyscanner-style search UI, or let an AI agent plan their trip conversationally.

**Tech Stack**
| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) — **not standard Next.js 13–15, read AGENTS.md** |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (configured via CSS `@theme`, no tailwind.config.js) |
| Animations | Framer Motion 12 |
| Icons | lucide-react |
| UI Primitives | shadcn/ui (components/ui/) |
| State | Zustand 5 (authStore, searchStore, tripsStore) |
| Forms | react-hook-form + zod |
| Auth | @clerk/nextjs (+ custom authStore with JWT) |
| HTTP | Axios (lib/api.ts) — backend at `NEXT_PUBLIC_API_URL` (default localhost:8000) |
| Toasts | Sonner |
| Fonts | Google Fonts (Inter) |

**Backend** (separate repo, not in this directory)
- FastAPI (Python) at `http://localhost:8000`
- Endpoints: `/api/search/flights`, `/api/search/hotels`, `/api/search/trains`, `/api/search/buses`, `/api/ai/query`
- Currently returns **mock data** — Amadeus API integration is the agreed next step

---

## 2. Running the Project

```bash
cd E:\AI_Projects\travel-ai\frontend
npm install
npm run dev          # http://localhost:3000
npx tsc --noEmit    # type-check (must return no output)
```

---

## 3. Directory Structure

```
frontend/
├── app/
│   ├── (auth)/                  # Auth pages — no navbar/footer
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── verify-success/page.tsx
│   │   ├── verify-expired/page.tsx
│   │   ├── check-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── account-locked/page.tsx
│   ├── (main)/
│   │   ├── (dashboard)/         # Authenticated dashboard area
│   │   │   ├── layout.tsx       # Dashboard layout: sidebar + mobile bottom nav
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── trips/page.tsx + [tripId]/page.tsx
│   │   │   ├── bookings/page.tsx + [bookingId]/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   ├── wallet/page.tsx
│   │   │   ├── alerts/page.tsx
│   │   │   ├── chat/page.tsx
│   │   │   ├── saved/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── support/page.tsx
│   │   │   └── profile/
│   │   │       ├── page.tsx
│   │   │       ├── preferences/page.tsx   # Language, Currency, notifications
│   │   │       ├── security/page.tsx
│   │   │       └── travel-documents/page.tsx
│   │   ├── deals/page.tsx
│   │   ├── packages/
│   │   │   ├── page.tsx
│   │   │   ├── [packageId]/page.tsx
│   │   │   └── create-with-ai/page.tsx
│   │   └── search/page.tsx      # Universal search results page
│   ├── layout.tsx               # Root layout: Navbar + Footer + Toaster (all pages)
│   ├── page.tsx                 # Home/landing page
│   └── globals.css              # Tailwind v4 theme + base styles
├── components/
│   ├── cards/
│   │   ├── DestinationCard.tsx
│   │   ├── FeatureCard.tsx
│   │   └── TripCard.tsx
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx
│   │   └── MobileBottomNav.tsx
│   ├── home/
│   │   ├── HeroSection.tsx          # MAIN: tabs + search bars + title
│   │   ├── AIChatInput.tsx          # AI textarea with chips (compact prop)
│   │   ├── PackageStrip.tsx         # Horizontal scroll of packages
│   │   ├── DealsSection.tsx
│   │   ├── DestinationsSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── SocialProofSection.tsx
│   │   ├── CTASection.tsx
│   │   └── search/
│   │       ├── FlightSearchBar.tsx
│   │       ├── HotelSearchBar.tsx
│   │       ├── PackageSearchBar.tsx
│   │       ├── BusSearchBar.tsx
│   │       ├── CarSearchBar.tsx
│   │       ├── CitySearchInput.tsx   # Reusable city autocomplete
│   │       └── DatePickerCell.tsx    # Reusable date picker popup
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── packages/
│   │   └── PackageCard.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── CityDropdown.tsx
│   │   ├── SearchFilters.tsx
│   │   ├── TopFilters.tsx
│   │   ├── SidebarSection.tsx
│   │   ├── cities.ts
│   │   ├── intentMeta.ts
│   │   └── types.ts
│   └── ui/                      # shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── tabs.tsx
├── hooks/
│   └── useSearch.ts
├── lib/
│   ├── api.ts                   # Axios instance + typed API calls
│   ├── api/auth.ts              # Auth-specific API (register/login/verify etc.)
│   ├── packages.ts              # Package types, constants, coverImage helper
│   ├── destinationImages.ts     # Unsplash destination photo URLs
│   └── utils.ts                 # cn() utility (clsx + tailwind-merge)
├── store/
│   ├── authStore.ts             # User session (persisted to localStorage)
│   ├── searchStore.ts           # Search state (active tab, params, results)
│   └── tripsStore.ts            # Trips + saved items
├── public/                      # Static assets
├── AGENTS.md                    # IMPORTANT: Next.js version warning
├── CLAUDE.md                    # Points to AGENTS.md
└── TRAVELAI_DOCS.md             # This file
```

---

## 4. All Routes

| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Landing page — public |
| `/login` | `(auth)/login` | |
| `/register` | `(auth)/register` | |
| `/verify-email` | `(auth)/verify-email` | |
| `/verify-success` | `(auth)/verify-success` | |
| `/verify-expired` | `(auth)/verify-expired` | |
| `/check-email` | `(auth)/check-email` | |
| `/forgot-password` | `(auth)/forgot-password` | |
| `/reset-password` | `(auth)/reset-password` | |
| `/account-locked` | `(auth)/account-locked` | |
| `/dashboard` | `(dashboard)/dashboard` | Auth required |
| `/trips` | `(dashboard)/trips` | |
| `/trips/[tripId]` | `(dashboard)/trips/[tripId]` | |
| `/bookings` | `(dashboard)/bookings` | |
| `/bookings/[bookingId]` | `(dashboard)/bookings/[bookingId]` | |
| `/payments` | `(dashboard)/payments` | |
| `/wallet` | `(dashboard)/wallet` | |
| `/alerts` | `(dashboard)/alerts` | |
| `/chat` | `(dashboard)/chat` | |
| `/saved` | `(dashboard)/saved` | |
| `/notifications` | `(dashboard)/notifications` | |
| `/support` | `(dashboard)/support` | |
| `/profile` | `(dashboard)/profile` | |
| `/profile/preferences` | `(dashboard)/profile/preferences` | Language + Currency + notifications |
| `/profile/security` | `(dashboard)/profile/security` | |
| `/profile/travel-documents` | `(dashboard)/profile/travel-documents` | |
| `/packages` | `(main)/packages` | |
| `/packages/[packageId]` | `(main)/packages/[packageId]` | |
| `/packages/create-with-ai` | `(main)/packages/create-with-ai` | |
| `/deals` | `(main)/deals` | |
| `/search` | `(main)/search` | Universal results (tab=flight/hotel/bus/car) |

---

## 5. Key Components Deep-Dive

### HeroSection (`components/home/HeroSection.tsx`)

The most complex component. Structure:

```
<div>
  <section style="height: min(500px, calc(100vh - 170px))">
    <div absolute overflow-hidden>   ← image clipping wrapper (NOT section)
      <img Unsplash mountain photo>
      <div gradient overlay>
    </div>
    <div relative z-10 flex-col items-center justify-center>  ← content
      <h1> Your AI Travel Agent. Always On. </h1>
      <p>  Flights · Hotels · Packages · Bus · Cars </p>
      <div max-w-4xl>
        <div flex justify-center mb-3>   ← Tab row
          [AI Agent] [Flights] [Hotels] [Packages] [Bus] [Cars]
        </div>
        <div min-h-[150px]>             ← Fixed height prevents title shift
          <AnimatePresence mode="wait">
            AIChatInput | FlightSearchBar | HotelSearchBar |
            PackageSearchBar | BusSearchBar | CarSearchBar
          </AnimatePresence>
        </div>
      </div>
    </div>
  </section>
  <div bg-slate-900>  ← Trust bar (sibling, NOT inside section)
    35% cheaper · 2M+ trips · Secure · Instant
  </div>
</div>
```

**Critical constraints:**
- `section` has NO `overflow:hidden` — dropdowns must escape it visually
- Image clipping uses its own inner `overflow-hidden` wrapper
- `min-h-[150px]` on AnimatePresence wrapper prevents title shift when switching tabs (AIChatInput is ~146px, other bars ~94px)
- **No `overflow-x-auto`** anywhere in this component — it breaks dropdown positioning
- The `z-10` on content div creates a stacking context, making dropdowns (z-[60]/z-[70]) paint above the trust bar below

**Tab colours:**
| Tab | Gradient | Accent |
|---|---|---|
| AI Agent | violet-500 → purple-600 | — |
| Flights | sky-500 → blue-600 | sky-300 |
| Hotels | rose-400 → pink-500 | rose-300 |
| Packages | amber-400 → orange-500 | amber-300 |
| Bus | orange-500 → red-500 | orange-300 |
| Cars | emerald-500 → teal-600 | emerald-300 |

---

### Search Bar System (`components/home/search/`)

All 5 search bars share the same design language:

**Bar container** (NO `overflow:hidden`):
```tsx
<div className="flex items-stretch bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
```

**Cell pattern** (each field inside the bar):
```
cellCls = 'px-3 py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors cursor-text'
```
- First cell: `+ rounded-l-2xl`
- Last element (Search button): `+ rounded-r-2xl`

**CitySearchInput** (reusable, `components/home/search/CitySearchInput.tsx`):
- Props: `label`, `placeholder`, `value`, `onChange`, `icon` (ReactNode), `iconBg` (Tailwind class), `className`
- 50 cities: 30 Indian + 20 international; POPULAR list shown before typing
- Dropdown: `absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl w-72 max-h-64 overflow-y-auto z-[70]`
- Keyboard nav: ArrowUp/Down highlight, Enter select, Escape close
- `onMouseDown={e => e.preventDefault()}` on items prevents blur-before-click
- **The outer div IS the flex cell** — it has `relative flex items-center gap-2` + whatever `className` is passed

**DatePickerCell** (reusable, `components/home/search/DatePickerCell.tsx`):
- Props: `label`, `value`, `min`, `onChange`, `iconColor` (e.g. `"text-sky-300"`), `doneClass` (e.g. `"bg-sky-500 hover:bg-sky-600"`), `className`
- Trigger: Calendar icon + label + formatted date (or "Select date" in white/40)
- Popup: `absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl p-4 w-56 z-[60]`
- Contains: section label, styled `<input type="date">`, optional "Clear date" button, coloured Done button
- Outer div always has `border-r border-white/15` (date fields are never last in bar)

**Traveller/Guest/Passenger pickers** (inline in each bar):
- Popup: `absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-60 z-[60]`
- 4 age groups: Adults (13–60), Young (2–12), Seniors (60+), Infants (Under 2)
- Stepper buttons: themed with each tab's accent colour

**Options row** (above the search bar): Trip type / Cabin class / Bus class / Drive type / Car type / Property type / Star rating — all open downward (`top-full mt-1.5`) into white `rounded-xl` popups

**Per-tab theming:**

| Tab | iconBox | Done button | Stepper hover |
|---|---|---|---|
| Flights | bg-sky-500/25 | bg-sky-500 | sky-400/600 |
| Hotels | bg-rose-500/25 | bg-rose-500 | rose-400/500 |
| Packages | bg-amber-500/25 | bg-amber-500 | amber-400/600 |
| Bus | bg-orange-500/25 | bg-orange-500 | orange-400/600 |
| Cars | bg-emerald-500/25 | bg-emerald-500 | emerald-500/600 |

---

### Navbar (`components/layout/Navbar.tsx`)

- Sticky top, `py-5` ≈ 84px tall
- Logo position is **identical on all pages** (no dashboard shift — sidebar sits below navbar at `top-[84px]`)
- Desktop links: Home, Dashboard, Bookings, AI Scout + Sign In / Get Started
- Mobile: hamburger opens a slide-down menu

### Dashboard Layout (`app/(main)/(dashboard)/layout.tsx`)

- Sidebar: `fixed left-0 top-[84px] bottom-0 w-64 bg-slate-900` (desktop only, `md:block`)
- Main content: `md:pl-64` to leave room for sidebar
- Mobile: sidebar hidden, `MobileBottomNav` shown at bottom

### Dashboard Page (`app/(main)/(dashboard)/dashboard/page.tsx`)

**AI Recommendations section** (only recommendations — Featured Packages was removed):
```tsx
const AI_RECS = [
  { destination: 'Goa',    title: 'Goa Beach Escape',    tag: '-18%',     tagBg: 'bg-rose-500',   price: 2890,  originalPrice: 3530,  savings: 640  },
  { destination: 'Manali', title: 'Manali Hill Retreat',  tag: 'AI Pick',  tagBg: 'bg-violet-600', price: 8499,  originalPrice: 11200, savings: 2701 },
  { destination: 'Jaipur', title: 'Jaipur Heritage Tour', tag: 'Trending', tagBg: 'bg-amber-500',  price: 890,   originalPrice: 1100,  savings: 210  },
]
```
Cards: full-bleed 120px destination image + tag badge + destination overlay + title + price + savings (Zap icon).

### Profile Preferences (`app/(main)/(dashboard)/profile/preferences/page.tsx`)

Sections:
1. Travel Preferences (budget, purpose, interests, pace, accommodation)
2. **Language** — 16 options in 4-col grid (en, hi, ta, te, bn, mr, gu, pa, fr, de, es, ja, zh, ar, pt, ru)
3. **Currency** — 20 options in 5-col compact grid (INR, USD, EUR, GBP, AED, SGD, THB, MYR, JPY, AUD, CAD, CHF, HKD, SAR, QAR, KWD, LKR, NPR, BDT, IDR)
4. Notification preferences

---

## 6. Design System

### Glassmorphic Dark Hero (search bars, AI chat)
```
bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl
```

### Dropdown Popups (all)
```
bg-white rounded-2xl shadow-2xl border border-slate-100
```
- City: `w-72 max-h-64 overflow-y-auto` — `z-[70]`
- Traveller/Date/Options: `p-4 w-56–w-60` — `z-[60]`
- All open **downward**: `top-full mt-2` (pickers) or `top-full mt-1.5` (option dropdowns)

### Options Row Pills (above search bars)
```
bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl text-xs font-semibold text-white/70
```

### Label Micro Text (inside search cells)
```
text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5
```

### Colour Palette
- Primary CTA: `bg-gradient-to-r from-emerald-500 to-sky-500`
- Sidebar: `bg-slate-900`
- Page background: white (light pages), slate-950 (dark sections)
- Trust items: `text-emerald-400` icons

### Typography
- Headings: `font-extrabold` or `font-bold`, `tracking-tight`
- Body: `font-medium` or `font-semibold`
- Micro labels: `text-[10px] font-semibold uppercase tracking-wider`
- Input text: `text-sm font-medium`

### Image Sources
- Hero: Unsplash mountain photo (hardcoded URL in HeroSection)
- Destinations: `lib/destinationImages.ts` — Unsplash photo IDs mapped per destination
- Packages: `lib/packages.ts` → `packageCoverImage()` — Unsplash
- **Copyright rule**: Only use Unsplash/Pexels for images, MIT/ISC/Apache for code, Google Fonts

---

## 7. User Requirements & Decisions

### Tone & Copy
- Culturally grounded for Indian travellers
- Pair Indian + international references (e.g. "Goa, Bali, Switzerland")
- Use "Desi" where appropriate; avoid "for India" restrictions
- Price formatting: `₹` prefix, Indian number formatting (₹1,00,000 not ₹100,000)

### Search Experience
- Home hero search is the primary entry point
- All 5 search bars (Flights/Hotels/Packages/Bus/Cars) have:
  - City autocomplete with 50-city dropdown (30 Indian + 20 international)
  - Date pickers as custom white-card popups (not native inputs)
  - Traveller pickers with 4 age groups: Adults (13–60), Young (2–12), Seniors (60+), Infants (Under 2)
  - Dropdowns open **downward** — never upward (they'd be hidden behind the tab row)
  - **No `overflow:hidden` or `overflow-x-auto`** on any parent container — breaks dropdown visibility
- Cabin class, car type, bus class, property type, etc. are option-row dropdowns

### Dashboard
- Sidebar navigation identical across all dashboard pages
- AI Recommendations: 3-col card grid, full-bleed image, tag badge, price + savings
- Featured Packages section: **REMOVED** (user requested)
- Quick actions and stats retained

### Navbar / Layout
- Logo position **same on all pages** (no sidebar offset on desktop)
- Navbar height ≈ 84px (`py-5`)
- Dashboard sidebar: `top-[84px]` to sit flush under navbar

---

## 8. Shared Utility Patterns

### Closing dropdowns on outside click
```tsx
const ref = useRef<HTMLDivElement>(null)
useEffect(() => {
  const h = (e: MouseEvent) => {
    if (!ref.current?.contains(e.target as Node)) setOpen(false)
  }
  document.addEventListener('mousedown', h)
  return () => document.removeEventListener('mousedown', h)
}, [])
```

### Prevent blur-before-click in dropdowns
```tsx
<button onMouseDown={e => e.preventDefault()} onClick={() => select(item)}>
```

### `cn()` utility (always use this for Tailwind class merging)
```tsx
import { cn } from '@/lib/utils'
// combines clsx + tailwind-merge to safely merge conditional Tailwind classes
```

### Date formatting (for display, not input)
```tsx
new Date(isoDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
```

---

## 9. API Integration Status

| Endpoint | Status |
|---|---|
| Auth (register/login/verify/reset) | ✅ Integrated (FastAPI) |
| Search Flights | ⚠️ Mock data — Amadeus planned |
| Search Hotels | ⚠️ Mock data |
| Search Buses | ⚠️ Mock data |
| Search Cars | ⚠️ Mock data |
| AI Query | ⚠️ Mock data |
| GET /api/packages | ❌ Not yet built |
| GET /api/packages/{id} | ❌ Not yet built |
| GET /api/deals | ❌ Not yet built |

**Next integration priority**: Amadeus API for real flight data.

---

## 10. Known Constraints & Gotchas

1. **Next.js 16.2.6** — May have API changes vs training data. Check `node_modules/next/dist/docs/` before using Next.js-specific APIs.

2. **Tailwind v4** — Uses `@theme {}` CSS variables instead of `tailwind.config.js`. No `tailwind.config.ts` exists. Arbitrary values like `text-[10px]` and class patterns like `bg-white/10` work fine.

3. **`overflow` + dropdowns** — Any parent with `overflow-x: auto` or `overflow: hidden` will clip absolutely-positioned dropdowns. The hero section's `<section>` intentionally has no overflow constraint. The image clipping uses a separate inner div.

4. **AnimatePresence title shift** — Fixed by `min-h-[150px]` on the search widget container. If AIChatInput grows beyond 150px, this value must increase.

5. **Stacking contexts** — The content div in HeroSection has `relative z-10` creating a stacking context. Dropdowns at `z-[60]`/`z-[70]` within it paint above the trust bar (z-auto) which is a DOM sibling below the section.

6. **`onMouseDown` on city/option buttons** — Must include `e.preventDefault()` to prevent the input losing focus before the click registers.

7. **Image remote patterns** — Only `images.unsplash.com` and `images.kiwi.com` are whitelisted in `next.config.ts`. Add new domains before using `<Image>` with external sources.

8. **No `git init`** — The project is not a git repository (`Is a git repository: false`). Do not run git commands.

---

## 11. Pending / Future Work

- [ ] Amadeus API integration for real flight search results
- [ ] `GET /api/packages`, `GET /api/packages/{id}`, `GET /api/deals` backend endpoints
- [ ] Mobile-responsive search bars (currently overflow on narrow screens — `overflow-x-auto` was removed for dropdown support)
- [ ] Search results page: implement tab-based results for Bus and Car (currently only Flights/Hotels/Trains)
- [ ] Booking flow (select result → confirm → payment)
- [ ] Real user authentication flow testing with Clerk
- [ ] AI trip planner (`/chat` and `/packages/create-with-ai`) backend integration
