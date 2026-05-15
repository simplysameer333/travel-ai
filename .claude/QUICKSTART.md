# TravelAI — Claude Session Quickstart

## What this project is
Full-stack AI-powered travel search app for Indian travelers.
- Users type natural language queries ("flights to Goa next weekend") 
- GPT-4o-mini parses intent → returns mock results with filters/sorting
- Currently mock data; Amadeus API integration is the agreed next step

---

## Stack

| Layer     | Tech                                                        |
|-----------|-------------------------------------------------------------|
| Frontend  | Next.js 15, TypeScript, TailwindCSS (App Router)            |
| Backend   | FastAPI + Python 3.12, Pydantic v2                          |
| DB        | MongoDB Atlas (Motor async driver)                          |
| AI        | OpenAI GPT-4o-mini via LangSmith-wrapped client             |
| Auth      | Clerk (structure ready, not wired)                          |

---

## Repo layout

```
travel-ai/
├── frontend/                     # Next.js app
│   ├── app/(main)/search/        # Search results page (main UI)
│   ├── components/
│   │   ├── layout/Navbar.tsx
│   │   └── search/
│   │       ├── types.ts          # Shared TS types
│   │       ├── filters/SearchFilters.tsx
│   │       ├── cards/
│   │       │   ├── ResultCard.tsx   # Registry — picks FlightCard etc.
│   │       │   ├── FlightCard.tsx   # Two-zone card with OUT+RET legs
│   │       │   ├── HotelCard.tsx
│   │       │   ├── TrainCard.tsx
│   │       │   └── BusCard.tsx
│   │       └── INTENT_META (in page.tsx)
│   └── next.config.ts            # images.kiwi.com in remotePatterns
│
└── backend/
    ├── main.py                   # FastAPI entry point (port 8000)
    ├── .env                      # OPENAI_API_KEY, MONGO_URI, etc.
    ├── app/
    │   ├── api/routes.py
    │   ├── core/config.py
    │   ├── schemas/search.py
    │   └── services/
    │       ├── ai_service.py       # LLM parse + in-process intent cache
    │       ├── search_service.py   # Thin re-export of per-type services
    │       ├── flights_service.py  # Mock flights generator
    │       ├── hotels_service.py
    │       ├── trains_service.py
    │       └── buses_service.py
    └── venv/                     # Python venv (already set up)
```

---

## Starting the app

### Backend (terminal 1)
```powershell
cd E:\AI_Projects\travel-ai\backend
venv\Scripts\python.exe main.py
# Runs on http://localhost:8000
# Restart any time you change ai_service.py to clear the in-process LLM cache
```

### Frontend (terminal 2)
```powershell
cd E:\AI_Projects\travel-ai\frontend
npm run dev
# Runs on http://localhost:3000
```

---

## Environment variables (`backend/.env`)
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
MONGO_URI=mongodb+srv://...
DATABASE_NAME=travel_ai
LANGSMITH_API_KEY=...          # optional, enables LangSmith tracing
LANGSMITH_TRACING=true         # optional
```

---

## Key design decisions (don't undo without reason)

### LLM intent cache
`ai_service.py` caches parsed intent in a Python dict keyed by `"{today}|{normalized_query}"`.
- Same query in same day → no OpenAI call
- Date changes → auto-bust (new key)
- System prompt change same day → restart backend to clear

### Default to round trip
System prompt rule: assume round trip unless user says "one way", "one side", "single", "onward only".
Backend sets `return_date` ≈ 7 days after `travel_date` by default.

### Filter state (plain arrays, NOT Sets)
React `useMemo` with `Set` state is unreliable in Next.js Turbopack.
All filter state uses `number[]` / `string[]` with `.includes()` checks.
Inclusion model: empty array = show all; non-empty = show only those items.

### Airline logos
`FlightCard` fetches `https://images.kiwi.com/airlines/64/{IATA}.png`.
IATA map is hardcoded in `FlightCard.tsx`. New airlines need an entry added.
`next.config.ts` has `images.kiwi.com` in `remotePatterns`.

### Card layout (FlightCard)
Two-zone layout: left (flex-col justify-between) has logo + OUT leg + RET leg + footer meta row.
Right panel (w-40, border-l) has seats, per-person price, total, Select button.
Each leg row (`LegRow` component) includes its own airline logo.

---

## Agreed next steps (priority order)
1. **Amadeus API** — replace mock `flights_service.py` with real Amadeus SDK calls
2. Booking flow — "Select" button leads somewhere
3. Auth — wire up Clerk

---

## Copy / content rules
- Culturally grounded for Indian travelers; use "Desi", pair Indian + international references
- Avoid "for India" as a qualifier (condescending tone)
- Images: Unsplash / Pexels only (licensed)
- Fonts: Google Fonts only
