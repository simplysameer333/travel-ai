# TravelAI — AI-Powered Cheap Travel Discovery

Find the cheapest domestic and international travel for Indian travelers, powered by AI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16.2.6, TypeScript, TailwindCSS v4, shadcn/ui, Framer Motion 12 |
| Backend | FastAPI, Python 3.12, Pydantic v2 |
| AI Agent | LangGraph ≥0.2.28, LangChain OpenAI ≥0.2.0, GPT-4o (streaming SSE) |
| Database | MongoDB Atlas (Motor async driver) |
| Auth | Custom JWT (FastAPI) + authStore (Zustand + localStorage) |
| State | Zustand 5 (authStore, searchStore, tripsStore, chatStore) |
| Deployment | Railway (frontend + backend + MongoDB) |

## Project Structure

```
travel-ai/
├── frontend/                    # Next.js 16 App Router
│   ├── app/
│   │   ├── (auth)/              # Login, Register, Verify, Reset Password, etc.
│   │   ├── (main)/
│   │   │   ├── (dashboard)/     # Authenticated: chat, trips, bookings, profile, etc.
│   │   │   ├── deals/
│   │   │   ├── packages/
│   │   │   └── search/
│   │   ├── icon.tsx             # Dynamic purple favicon (Next.js ImageResponse)
│   │   ├── layout.tsx           # Root layout: Navbar + Footer + TravelBuddyWidget
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Top nav (purple logo/branding)
│   │   │   ├── Footer.tsx
│   │   │   └── TravelBuddyWidget.tsx  # Floating AI chat widget (all non-/chat pages)
│   │   ├── home/                # HeroSection, QuickDestBar, FeaturesSection, etc.
│   │   ├── dashboard/           # DashboardSidebar, MobileBottomNav
│   │   ├── cards/               # DestinationCard, FeatureCard, TripCard
│   │   ├── search/              # SearchBar, SearchFilters, etc.
│   │   └── ui/                  # shadcn/ui primitives
│   ├── store/
│   │   ├── authStore.ts         # User session (JWT, persisted to localStorage)
│   │   ├── chatStore.ts         # Chat messages + widget state (persisted to localStorage)
│   │   ├── searchStore.ts       # Active tab, search params, results
│   │   └── tripsStore.ts        # Saved trips
│   ├── lib/
│   │   ├── api.ts               # Axios instance
│   │   ├── api/auth.ts          # Auth API calls
│   │   ├── chat.ts              # streamChat() — SSE streaming helper
│   │   └── config.ts            # API_BASE_URL
│   └── TRAVELAI_DOCS.md         # Full project documentation for AI agents
│
└── backend/                     # FastAPI
    ├── app/
    │   ├── agents/
    │   │   └── travel_agent.py  # LangGraph Travel Buddy AI agent
    │   ├── api/
    │   │   ├── auth.py          # Auth routes (register/login/verify/reset)
    │   │   ├── chat.py          # POST /api/chat/stream (SSE)
    │   │   └── search.py        # Search routes (mock data)
    │   ├── core/                # Config (pydantic-settings)
    │   ├── db/                  # MongoDB Motor connection
    │   ├── schemas/
    │   │   ├── auth.py
    │   │   └── chat.py          # ChatMessageSchema, ChatRequest
    │   └── services/            # Business logic
    ├── prompts/
    │   └── chatAIAgent          # System prompt source
    ├── requirements.txt
    └── main.py
```

## Quick Start

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Set: NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
cp .env.example .env
# Set: MONGO_URI, DATABASE_NAME, OPENAI_API_KEY, JWT_SECRET
pip install -r requirements.txt
python main.py
```

API at [http://localhost:8000](http://localhost:8000) · Swagger at [http://localhost:8000/docs](http://localhost:8000/docs)

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`.env`)

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/
DATABASE_NAME=travel_ai
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-here
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| POST | /api/auth/verify-email | Verify email token |
| POST | /api/auth/forgot-password | Send reset email |
| POST | /api/auth/reset-password | Reset password with token |
| POST | /api/chat/stream | Travel Buddy AI (SSE streaming) |
| POST | /api/search/flights | Search flights (mock) |
| POST | /api/search/hotels | Search hotels (mock) |
| POST | /api/search/trains | Search trains (mock) |
| POST | /api/search/buses | Search buses (mock) |

## Travel Buddy AI Agent

The AI chat feature is powered by a **LangGraph agent** (`backend/app/agents/travel_agent.py`):

- Uses `ChatOpenAI(model="gpt-4o", streaming=True, temperature=0.7)`
- Full system prompt tuned for Indian travel context (flights, trains, hotels, itineraries)
- Streaming responses via SSE: `data: {"token": "..."}\n\n` … `data: [DONE]\n\n`
- Shared chat state (`chatStore`) persists conversation across the mini widget and full `/chat` page
- Mini widget (`TravelBuddyWidget`) floats on all pages; hides on `/chat` to avoid duplication

## Pages

| Route | Description |
|---|---|
| / | Landing — Hero, Features, Destinations |
| /login | Login |
| /register | Create account |
| /chat | Full Travel Buddy AI chat page |
| /dashboard | Dashboard with stats + AI recommendations |
| /search | Multi-tab search (Flights/Hotels/Trains/Buses/Cars) |
| /trips | Saved trips |
| /packages | Holiday packages |
| /deals | Deals |
| /profile | User info, preferences, security, travel documents |

## Deployment (Railway)

Three Railway services:
- **Frontend** (`travel-ai-frontend`) — Next.js, Scale to Zero enabled
- **Backend** (`travel-ai-backend`) — FastAPI, Scale to Zero enabled
- **MongoDB** (`travel-ai-mongodb`) — Atlas-compatible, Scale to Zero enabled

Secrets (API keys, Railway/GitHub tokens) are stored locally only — never committed.
