'use client'
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, ChevronLeft, ChevronRight } from 'lucide-react'
import { FlightRouteCard } from '@/components/cards'

// ── Data types ────────────────────────────────────────────────────────────────
export type { FlightRouteCardProps as PopularRoute } from '@/components/cards'

// ── Mock data — swap fetchPopularRoutes() with real API call when backend ready ─
const MOCK_ROUTES = [
  { from: 'Delhi',     fromCode: 'DEL', to: 'Mumbai',    toCode: 'BOM', duration: '2h',     price: 2499,  drop: 12, hot: true  },
  { from: 'Mumbai',    fromCode: 'BOM', to: 'Goa',       toCode: 'GOI', duration: '1h 20m', price: 1899,  drop: 18, hot: true  },
  { from: 'Delhi',     fromCode: 'DEL', to: 'Bangalore', toCode: 'BLR', duration: '2h 45m', price: 2799,  drop: 8,  hot: false },
  { from: 'Bangalore', fromCode: 'BLR', to: 'Dubai',     toCode: 'DXB', duration: '3h 30m', price: 8999,  drop: 22, hot: true  },
  { from: 'Mumbai',    fromCode: 'BOM', to: 'Singapore', toCode: 'SIN', duration: '5h 30m', price: 11499, drop: 15, hot: false },
  { from: 'Delhi',     fromCode: 'DEL', to: 'Bangkok',   toCode: 'BKK', duration: '4h 10m', price: 9299,  drop: 9,  hot: false },
  { from: 'Chennai',   fromCode: 'MAA', to: 'Colombo',   toCode: 'CMB', duration: '1h 20m', price: 5499,  drop: 20, hot: true  },
  { from: 'Hyderabad', fromCode: 'HYD', to: 'Bali',      toCode: 'DPS', duration: '7h 15m', price: 13999, drop: 11, hot: false },
  { from: 'Delhi',     fromCode: 'DEL', to: 'London',    toCode: 'LHR', duration: '9h',     price: 32999, drop: 14, hot: false },
  { from: 'Mumbai',    fromCode: 'BOM', to: 'New York',  toCode: 'JFK', duration: '16h',    price: 45999, drop: 6,  hot: false },
]

// TODO: replace mock with real API — GET /api/flights/popular-routes?limit=10
async function fetchPopularRoutes() {
  return MOCK_ROUTES
}
// ─────────────────────────────────────────────────────────────────────────────

export default function PopularRoutesStrip() {
  const router    = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [routes,   setRoutes]   = useState(MOCK_ROUTES)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)

  useEffect(() => {
    fetchPopularRoutes().then(setRoutes)
  }, [])

  const sync = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    return () => el.removeEventListener('scroll', sync)
  }, [routes])

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' })

  if (!routes.length) return null

  return (
    <section className="bg-slate-50 py-8 sm:py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Plane className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">Popular Flights</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Trending routes right now
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} disabled={!canLeft}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-all disabled:opacity-25 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} disabled={!canRight}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-sky-300 hover:text-sky-500 transition-all disabled:opacity-25 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          {canRight && (
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          )}
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {routes.map(r => (
              <FlightRouteCard
                key={`${r.fromCode}-${r.toCode}`}
                {...r}
                onClick={() => router.push(`/search?tab=flight&from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
