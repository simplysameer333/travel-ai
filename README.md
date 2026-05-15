# TravelAI — AI-Powered Cheap Travel Discovery

Find the cheapest domestic and international travel for Indian travelers, powered by AI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Framer Motion |
| Backend | FastAPI, Python 3.12, Pydantic v2 |
| Database | MongoDB Atlas (Motor async driver) |
| Auth | Clerk (structure ready) |
| State | Zustand |

## Project Structure

```
travel-ai/
├── frontend/          # Next.js 15 App Router
│   ├── app/
│   │   ├── (auth)/login       # Login page
│   │   ├── (auth)/register    # Register page
│   │   ├── (main)/search      # Search page (Flights/Hotels/Trains/Buses)
│   │   ├── (main)/trips       # Saved trips
│   │   ├── (main)/profile     # User profile
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── layout/    # Navbar, Footer
│   │   ├── home/      # HeroSection, FeaturesSection, DestinationsSection
│   │   ├── cards/     # DestinationCard, FeatureCard, TripCard
│   │   ├── search/    # SearchBar
│   │   └── ui/        # shadcn/ui components
│   ├── store/         # Zustand stores (auth, search, trips)
│   ├── hooks/         # useSearch
│   └── lib/           # api.ts (axios client)
│
└── backend/           # FastAPI
    ├── app/
    │   ├── api/       # Routes
    │   ├── core/      # Config (pydantic-settings)
    │   ├── db/        # MongoDB Motor connection
    │   ├── schemas/   # Pydantic request/response models
    │   ├── services/  # Business logic + mock data
    │   └── agents/    # AI agent structure (future)
    └── main.py
```

## Quick Start

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in NEXT_PUBLIC_API_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI, DATABASE_NAME, OPENAI_API_KEY
pip install -r requirements.txt
python main.py
```

API runs at [http://localhost:8000](http://localhost:8000)  
Swagger docs at [http://localhost:8000/docs](http://localhost:8000/docs)

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Backend (`.env`)

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/
DATABASE_NAME=travel_ai
OPENAI_API_KEY=sk-...
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| POST | /api/search/flights | Search flights (mock) |
| POST | /api/search/hotels | Search hotels (mock) |
| POST | /api/search/trains | Search trains (mock) |
| POST | /api/search/buses | Search buses (mock) |
| POST | /api/ai/query | AI travel query (placeholder) |

## Pages

| Route | Description |
|---|---|
| / | Home — Hero, Features, Destinations |
| /login | Login with email or Google |
| /register | Create account |
| /search | Multi-tab search (Flights/Hotels/Trains/Buses) |
| /trips | Saved trips + recommendations |
| /profile | User info, preferences, notifications |
