'use client'

import { useEffect, useState, useCallback, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Sparkles, Loader2, AlertCircle, SlidersHorizontal,
  Search as SearchIcon, TrendingDown, Plane, Train, Bus, Car, Hotel,
} from 'lucide-react'
import type { Intent, TransportTab, SortKey, AIResponse } from '@/components/search/types'
import { ResultCard } from '@/components/search/cards/ResultCard'
import { SearchFilters } from '@/components/search/filters/SearchFilters'
import FlightSearchBar  from '@/components/home/search/FlightSearchBar'
import HotelSearchBar   from '@/components/home/search/HotelSearchBar'
import BusSearchBar     from '@/components/home/search/BusSearchBar'
import CarSearchBar     from '@/components/home/search/CarSearchBar'
import TrainSearchBar   from '@/components/home/search/TrainSearchBar'
import { TopFilters }   from '@/components/search/filters/TopFilters'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000'

// ---------------------------------------------------------------------------
// Transport tab config — add new modes here only
// ---------------------------------------------------------------------------

const TRANSPORT_TABS: { id: TransportTab; label: string; Icon: typeof Plane }[] = [
  { id: 'flight', label: 'Flights', Icon: Plane },
  { id: 'hotel',  label: 'Hotels',  Icon: Hotel },
  { id: 'train',  label: 'Trains',  Icon: Train },
  { id: 'bus',    label: 'Buses',   Icon: Bus   },
  { id: 'car',    label: 'Cars',    Icon: Car   },
]

const TAB_STYLES: Record<TransportTab, {
  activeBorderCls:  string
  iconBgActive:     string
  iconBgInactive:   string
  iconCls:          string
  labelBgActive:    string
}> = {
  flight: {
    activeBorderCls: 'border-sky-400 shadow-md shadow-sky-200',
    iconBgActive:    'bg-gradient-to-b from-sky-400 to-blue-600',
    iconBgInactive:  'bg-sky-50',
    iconCls:         'text-sky-500',
    labelBgActive:   'bg-sky-500',
  },
  train: {
    activeBorderCls: 'border-emerald-400 shadow-md shadow-emerald-200',
    iconBgActive:    'bg-gradient-to-b from-emerald-400 to-emerald-600',
    iconBgInactive:  'bg-emerald-50',
    iconCls:         'text-emerald-600',
    labelBgActive:   'bg-emerald-500',
  },
  bus: {
    activeBorderCls: 'border-violet-400 shadow-md shadow-violet-200',
    iconBgActive:    'bg-gradient-to-b from-violet-500 to-purple-600',
    iconBgInactive:  'bg-violet-50',
    iconCls:         'text-violet-500',
    labelBgActive:   'bg-violet-500',
  },
  car: {
    activeBorderCls: 'border-orange-400 shadow-md shadow-orange-200',
    iconBgActive:    'bg-gradient-to-b from-orange-500 to-amber-600',
    iconBgInactive:  'bg-orange-50',
    iconCls:         'text-orange-500',
    labelBgActive:   'bg-orange-500',
  },
  hotel: {
    activeBorderCls: 'border-rose-300 shadow-md shadow-rose-100',
    iconBgActive:    'bg-gradient-to-b from-rose-300 to-pink-400',
    iconBgInactive:  'bg-rose-50',
    iconCls:         'text-rose-400',
    labelBgActive:   'bg-rose-400',
  },
}

// ---------------------------------------------------------------------------
// Fare trend chart (flights only)
// ---------------------------------------------------------------------------

function seeded(i: number, base: number): number {
  const s = (base % 97) * 0.1 + i
  return Math.sin(s * 0.8) * 0.7 + Math.sin(s * 2.1 + 1.5) * 0.3
}

function FareTrendChart({ minPrice, travelDate }: { minPrice: number; travelDate: string | null }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dep = travelDate ? new Date(travelDate + 'T00:00:00') : null

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i)
    const price = Math.round(minPrice * (1 + seeded(i, minPrice) * 0.20))
    const isSelected = dep
      ? d.getFullYear() === dep.getFullYear() && d.getMonth() === dep.getMonth() && d.getDate() === dep.getDate()
      : false
    return { price, isSelected, label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) }
  })

  const prices = days.map(d => d.price)
  const minP = Math.min(...prices), maxP = Math.max(...prices)
  const range = maxP - minP || 1
  const MAX_PX = 48

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-xs font-semibold text-slate-700">Fare trend · 30 days</span>
        <span className="ml-auto text-[9px] font-semibold text-emerald-600">from ₹{minP.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex items-end gap-0.5" style={{ height: `${MAX_PX}px` }}>
        {days.map((day, i) => {
          const barPx = Math.round((0.15 + ((day.price - minP) / range) * 0.85) * MAX_PX)
          const isCheap = day.price <= minP * 1.05
          return (
            <div key={i} className="relative flex-1 flex items-end"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {hovered === i && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded px-1.5 py-0.5 whitespace-nowrap z-10 pointer-events-none text-center">
                  <div className="text-[9px] font-bold">₹{day.price.toLocaleString('en-IN')}</div>
                  <div className="text-[8px] text-white/60">{day.label}</div>
                </div>
              )}
              <div style={{ height: `${barPx}px` }} className={`w-full rounded-sm transition-colors ${
                day.isSelected ? 'bg-sky-500' : isCheap ? 'bg-emerald-400' : hovered === i ? 'bg-slate-400' : 'bg-slate-200'
              }`} />
            </div>
          )
        })}
      </div>
      <div className="flex items-start gap-0.5 mt-1">
        {days.map((day, i) => (
          <div key={i} className="flex-1 text-center">
            {i % 5 === 0 && (
              <span className={`text-[8px] leading-none ${day.isSelected ? 'text-sky-600 font-bold' : 'text-slate-400'}`}>{day.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main search component
// ---------------------------------------------------------------------------

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const tabParam = (searchParams.get('tab') as TransportTab | null) ?? 'flight'

  // ── Core state ─────────────────────────────────────────────────────────────
  const [loading, setLoading]       = useState(false)
  const [data, setData]             = useState<AIResponse | null>(null)
  const [error, setError]           = useState<string | null>(null)
  const [sortBy, setSortBy]         = useState<SortKey>('cheapest')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [activeTab, setActiveTab]   = useState<TransportTab>(tabParam)

  // ── Flight filter state ────────────────────────────────────────────────────
  const [selectedStops, setSelectedStops]                     = useState<number[]>([])
  const [selectedAirlines, setSelectedAirlines]               = useState<string[]>([])
  const [maxPrice, setMaxPrice]                               = useState<number>(Number.MAX_SAFE_INTEGER)
  const [depTimeRange, setDepTimeRange]                       = useState<[number, number]>([0, 1440])
  const [arrTimeRange, setArrTimeRange]                       = useState<[number, number]>([0, 1440])
  const [flightDurationRange, setFlightDurationRange]         = useState<[number, number]>([0, 1440])
  const [stopoverDurationRange, setStopoverDurationRange]     = useState<[number, number]>([0, 1440])
  const [selectedStopoverAirports, setSelectedStopoverAirports] = useState<string[]>([])
  const [cabinBags, setCabinBags]                             = useState(0)
  const [checkedBags, setCheckedBags]                         = useState(0)

  // ── Train filter state ─────────────────────────────────────────────────────
  const [selectedClasses, setSelectedClasses]         = useState<string[]>([])
  const [selectedQuotas, setSelectedQuotas]           = useState<string[]>([])
  const [selectedTrainOps, setSelectedTrainOps]       = useState<string[]>([])
  const [trainDepTimeRange, setTrainDepTimeRange]     = useState<[number, number]>([0, 1440])
  const [trainArrTimeRange, setTrainArrTimeRange]     = useState<[number, number]>([0, 1440])
  const [trainDurationRange, setTrainDurationRange]   = useState<[number, number]>([0, 1440])
  const [tatkalOnly, setTatkalOnly]                   = useState(false)
  const [availableOnly, setAvailableOnly]             = useState(false)
  const [selectedTrainTypes, setSelectedTrainTypes]   = useState<string[]>([])

  // ── Bus filter state ───────────────────────────────────────────────────────
  const [selectedBusTypes, setSelectedBusTypes]     = useState<string[]>([])
  const [selectedBusOps, setSelectedBusOps]         = useState<string[]>([])
  const [minRating, setMinRating]                   = useState(0)
  const [busDepTimeRange, setBusDepTimeRange]        = useState<[number, number]>([0, 1440])

  // ── Car filter state ───────────────────────────────────────────────────────
  const [selectedCarCategories, setSelectedCarCategories] = useState<string[]>([])
  const [selectedFuelTypes, setSelectedFuelTypes]         = useState<string[]>([])
  const [selectedCarCompanies, setSelectedCarCompanies]   = useState<string[]>([])
  const [acOnly, setAcOnly]                               = useState(false)

  // ── Hotel filter state ─────────────────────────────────────────────────────
  const [selectedStarRatings, setSelectedStarRatings]       = useState<number[]>([])
  const [selectedPropertyTypes, setSelectedPropertyTypes]   = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities]           = useState<string[]>([])
  const [selectedMealPlans, setSelectedMealPlans]           = useState<string[]>([])
  const [selectedBedTypes, setSelectedBedTypes]             = useState<string[]>([])
  const [freeCancellationOnly, setFreeCancellationOnly]     = useState(false)
  const [breakfastOnly, setBreakfastOnly]                   = useState(false)
  const [poolOnly, setPoolOnly]                             = useState(false)
  const [parkingOnly, setParkingOnly]                       = useState(false)
  const [noPrepaymentOnly, setNoPrepaymentOnly]             = useState(false)
  const [minHotelReviewScore, setMinHotelReviewScore]       = useState(0)

  // ── Banner state ──────────────────────────────────────────────────────────
  const [draftQuery, setDraftQuery] = useState(q)

  useEffect(() => { setDraftQuery(q) }, [q])

  const resetFilters = () => {
    // flight
    setSelectedStops([]); setSelectedAirlines([]); setMaxPrice(Number.MAX_SAFE_INTEGER)
    setDepTimeRange([0, 1440]); setArrTimeRange([0, 1440])
    setFlightDurationRange([0, 1440]); setStopoverDurationRange([0, 1440])
    setSelectedStopoverAirports([]); setCabinBags(0); setCheckedBags(0)
    // train
    setSelectedClasses([]); setSelectedQuotas([]); setSelectedTrainOps([])
    setTrainDepTimeRange([0, 1440]); setTrainArrTimeRange([0, 1440]); setTrainDurationRange([0, 1440])
    setTatkalOnly(false); setAvailableOnly(false); setSelectedTrainTypes([])
    // bus
    setSelectedBusTypes([]); setSelectedBusOps([]); setMinRating(0); setBusDepTimeRange([0, 1440])
    // car
    setSelectedCarCategories([]); setSelectedFuelTypes([]); setSelectedCarCompanies([]); setAcOnly(false)
    // hotel
    setSelectedStarRatings([]); setSelectedPropertyTypes([]); setSelectedAmenities([])
    setSelectedMealPlans([]); setSelectedBedTypes([])
    setFreeCancellationOnly(false); setBreakfastOnly(false)
    setPoolOnly(false); setParkingOnly(false); setNoPrepaymentOnly(false)
    setMinHotelReviewScore(0)
  }

  const runSearch = useCallback(async (query: string) => {
    if (!query.trim()) return
    setLoading(true); setError(null); setData(null)
    resetFilters(); setSortBy('cheapest')
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const json: AIResponse = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Unknown error')
      setData(json)
      const incoming = json.intent?.intent
      if (incoming) setActiveTab(incoming as TransportTab)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (q) runSearch(q) }, [q, runSearch])

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) return
    setDraftQuery(query); runSearch(query)
  }, [runSearch])

  const structuredSearch = useCallback(async (overrides: Record<string, unknown> = {}) => {
    if (!data?.intent) return
    setLoading(true); setError(null); setData(null)
    resetFilters(); setSortBy('cheapest')
    const body = { ...data.intent, ...overrides }
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/structured`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const json: AIResponse = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Unknown error')
      setData(json)
      const incoming = json.intent?.intent
      if (incoming) setActiveTab(incoming as TransportTab)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Switch tab → re-search with same route params but new intent
  const handleTabSwitch = useCallback((tab: TransportTab) => {
    setActiveTab(tab)
    setSortBy('cheapest')
    if (data?.intent) {
      structuredSearch({ intent: tab })
    }
  }, [data, structuredSearch])

  // ── Derived display values ─────────────────────────────────────────────────
  const intent = activeTab as Intent

  const displayReturnDate = useMemo(() => {
    if (!data?.intent) return null
    if (data.intent.return_date) return data.intent.return_date
    const t = data.intent.travel_date
    if (!t) return null
    const d = new Date(t); d.setDate(d.getDate() + 2)
    return d.toISOString().split('T')[0]
  }, [data])

  // ── Flight derived filter options ──────────────────────────────────────────
  const availableStops = useMemo((): number[] => {
    if (!data?.results || intent !== 'flight') return []
    const s = new Set<number>()
    data.results.forEach(r => { if (typeof r.stops === 'number') s.add(r.stops as number) })
    return [...s].sort((a, b) => a - b)
  }, [data, intent])

  const availableAirlines = useMemo((): string[] => {
    if (!data?.results || intent !== 'flight') return []
    return [...new Set(data.results.map(r => r.airline as string).filter(Boolean))].sort()
  }, [data, intent])

  const priceRange = useMemo((): [number, number] => {
    if (!data?.results || data.results.length === 0) return [0, 0]
    let mn = Number.MAX_SAFE_INTEGER, mx = 0
    data.results.forEach(r => {
      const p = ((r.total_price ?? r.price) as number) || 0
      if (p < mn) mn = p; if (p > mx) mx = p
    })
    return [mn === Number.MAX_SAFE_INTEGER ? 0 : mn, mx]
  }, [data])

  const stopCounts = useMemo((): Record<number, number> => {
    if (!data?.results || intent !== 'flight') return {}
    const c: Record<number, number> = {}
    data.results.forEach(r => { const s = r.stops as number; c[s] = (c[s] ?? 0) + 1 })
    return c
  }, [data, intent])

  const cheapestPerStop = useMemo((): Record<number, number> => {
    if (!data?.results || intent !== 'flight') return {}
    const c: Record<number, number> = {}
    data.results.forEach(r => {
      const s = r.stops as number; const p = (r.total_price ?? r.price) as number
      if (c[s] === undefined || p < c[s]) c[s] = p
    })
    return c
  }, [data, intent])

  const parseDurMins = (dur: string | undefined): number => {
    if (!dur) return 0
    const m = dur.match(/(\d+)h\s*(\d+)m/)
    return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : 0
  }

  const maxFlightDuration = useMemo((): number => {
    if (!data?.results || intent !== 'flight') return 0
    return Math.max(...data.results.map(r => parseDurMins(r.duration as string)), 60)
  }, [data, intent])

  useEffect(() => {
    if (maxFlightDuration > 0) setFlightDurationRange([0, maxFlightDuration])
  }, [maxFlightDuration])

  const maxTrainDuration = useMemo((): number => {
    if (!data?.results || intent !== 'train') return 0
    return Math.max(...data.results.map(r => parseDurMins(r.duration as string)), 60)
  }, [data, intent])

  useEffect(() => {
    if (maxTrainDuration > 0) setTrainDurationRange([0, maxTrainDuration])
  }, [maxTrainDuration])

  const availableStopoverAirports = useMemo((): string[] => {
    if (!data?.results || intent !== 'flight') return []
    const s = new Set<string>()
    data.results.forEach(r => {
      const via = r.via_airport ?? r.stopover_airport ?? r.connecting_airport
      if (via && typeof via === 'string') s.add(via)
    })
    return [...s].sort()
  }, [data, intent])

  // ── Apply filters + sort ───────────────────────────────────────────────────
  const filteredResults = useMemo(() => {
    if (!data?.results) return []
    let rs = [...data.results]

    const toMinsStr = (t: string | undefined): number => {
      if (!t) return 0
      const [h, m] = t.split(':').map(Number)
      return h * 60 + (m || 0)
    }

    if (intent === 'flight') {
      if (selectedStops.length > 0)     rs = rs.filter(r => selectedStops.includes(r.stops as number))
      if (selectedAirlines.length > 0)  rs = rs.filter(r => selectedAirlines.includes(r.airline as string))
      if (depTimeRange[0] > 0 || depTimeRange[1] < 1440)
        rs = rs.filter(r => { const m = toMinsStr(r.departure_time as string); return m >= depTimeRange[0] && m <= depTimeRange[1] })
      if (arrTimeRange[0] > 0 || arrTimeRange[1] < 1440)
        rs = rs.filter(r => { const m = toMinsStr(r.arrival_time as string); return m >= arrTimeRange[0] && m <= arrTimeRange[1] })
      if (maxFlightDuration > 0 && flightDurationRange[1] < maxFlightDuration)
        rs = rs.filter(r => { const m = parseDurMins(r.duration as string); return m >= flightDurationRange[0] && m <= flightDurationRange[1] })
      if (selectedStopoverAirports.length > 0)
        rs = rs.filter(r => { const via = r.via_airport ?? r.stopover_airport ?? r.connecting_airport; return !via || selectedStopoverAirports.includes(via as string) })
    }

    if (intent === 'train') {
      if (selectedClasses.length > 0)     rs = rs.filter(r => selectedClasses.includes(r.class as string))
      if (selectedQuotas.length > 0)      rs = rs.filter(r => selectedQuotas.includes(r.quota as string))
      if (selectedTrainOps.length > 0)    rs = rs.filter(r => selectedTrainOps.includes(r.operator as string))
      if (tatkalOnly)                     rs = rs.filter(r => r.tatkal_available === true)
      if (availableOnly)                  rs = rs.filter(r => (r.seats_available as number) > 0)
      if (selectedTrainTypes.length > 0)
        rs = rs.filter(r => selectedTrainTypes.some(t => (r.train_name as string)?.toLowerCase().includes(t.toLowerCase())))
      if (trainDepTimeRange[0] > 0 || trainDepTimeRange[1] < 1440)
        rs = rs.filter(r => { const m = toMinsStr(r.departure_time as string); return m >= trainDepTimeRange[0] && m <= trainDepTimeRange[1] })
      if (trainArrTimeRange[0] > 0 || trainArrTimeRange[1] < 1440)
        rs = rs.filter(r => { const m = toMinsStr(r.arrival_time as string); return m >= trainArrTimeRange[0] && m <= trainArrTimeRange[1] })
      if (maxTrainDuration > 0 && trainDurationRange[1] < maxTrainDuration)
        rs = rs.filter(r => { const m = parseDurMins(r.duration as string); return m >= trainDurationRange[0] && m <= trainDurationRange[1] })
    }

    if (intent === 'bus') {
      if (selectedBusTypes.length > 0)  rs = rs.filter(r => selectedBusTypes.includes(r.bus_type as string))
      if (selectedBusOps.length > 0)    rs = rs.filter(r => selectedBusOps.includes(r.operator as string))
      if (minRating > 0)                rs = rs.filter(r => (r.rating as number) >= minRating)
      if (busDepTimeRange[0] > 0 || busDepTimeRange[1] < 1440)
        rs = rs.filter(r => { const m = toMinsStr(r.departure_time as string); return m >= busDepTimeRange[0] && m <= busDepTimeRange[1] })
    }

    if (intent === 'car') {
      if (selectedCarCategories.length > 0) rs = rs.filter(r => selectedCarCategories.includes(r.category as string))
      if (selectedFuelTypes.length > 0)     rs = rs.filter(r => selectedFuelTypes.includes(r.fuel_type as string))
      if (selectedCarCompanies.length > 0)  rs = rs.filter(r => selectedCarCompanies.includes(r.rental_company as string))
      if (acOnly)                           rs = rs.filter(r => r.ac === true)
    }

    if (intent === 'hotel') {
      if (selectedStarRatings.length > 0)   rs = rs.filter(r => selectedStarRatings.includes((r.stars ?? r.star_rating) as number))
      if (selectedPropertyTypes.length > 0) rs = rs.filter(r => selectedPropertyTypes.includes((r.category ?? r.property_type) as string))
      if (selectedAmenities.length > 0)     rs = rs.filter(r => selectedAmenities.every(a => (r.amenities as string[] | undefined)?.includes(a)))
      if (selectedMealPlans.length > 0)     rs = rs.filter(r => selectedMealPlans.includes(r.meal_plan as string))
      if (selectedBedTypes.length > 0)      rs = rs.filter(r => selectedBedTypes.includes(r.bed_type as string))
      if (freeCancellationOnly)             rs = rs.filter(r => r.free_cancellation === true)
      if (breakfastOnly)                    rs = rs.filter(r => r.breakfast_included === true)
      if (poolOnly)                         rs = rs.filter(r => (r.amenities as string[] | undefined)?.some(a => /pool/i.test(a)) || r.pool === true)
      if (parkingOnly)                      rs = rs.filter(r => (r.amenities as string[] | undefined)?.some(a => /parking/i.test(a)) || r.free_parking === true)
      if (noPrepaymentOnly)                 rs = rs.filter(r => r.no_prepayment === true)
      if (minHotelReviewScore > 0)          rs = rs.filter(r => (r.rating as number) >= minHotelReviewScore)
    }

    // shared price filter
    if (maxPrice < Number.MAX_SAFE_INTEGER)
      rs = rs.filter(r => ((r.total_price ?? r.price) as number) <= maxPrice)

    // sort
    if (sortBy === 'cheapest') {
      rs = rs.sort((a, b) => ((a.total_price ?? a.price) as number) - ((b.total_price ?? b.price) as number))
    } else if (sortBy === 'best' && intent === 'flight') {
      rs = rs.sort((a, b) => {
        const ds = (a.stops as number) - (b.stops as number)
        return ds !== 0 ? ds : ((a.total_price ?? a.price) as number) - ((b.total_price ?? b.price) as number)
      })
    } else if (sortBy === 'best' && intent === 'hotel') {
      rs = rs.sort((a, b) => (b.rating as number) - (a.rating as number))
    } else if (sortBy === 'quickest' && intent === 'hotel') {
      rs = rs.sort((a, b) => ((b.stars ?? b.star_rating) as number) - ((a.stars ?? a.star_rating) as number))
    } else if (sortBy === 'quickest') {
      rs = rs.sort((a, b) => parseDurMins(a.duration as string) - parseDurMins(b.duration as string))
    }

    return rs
  }, [data, intent, selectedStops, selectedAirlines, maxPrice, sortBy,
      depTimeRange, arrTimeRange, flightDurationRange, selectedStopoverAirports,
      selectedClasses, selectedQuotas, selectedTrainOps,
      trainDepTimeRange, trainArrTimeRange, maxTrainDuration, trainDurationRange,
      tatkalOnly, availableOnly, selectedTrainTypes,
      selectedBusTypes, selectedBusOps, minRating, busDepTimeRange,
      selectedCarCategories, selectedFuelTypes, selectedCarCompanies, acOnly,
      selectedStarRatings, selectedPropertyTypes, selectedAmenities,
      selectedMealPlans, selectedBedTypes,
      freeCancellationOnly, breakfastOnly, poolOnly, parkingOnly, noPrepaymentOnly,
      minHotelReviewScore, maxFlightDuration])

  // ── Toggle handlers ────────────────────────────────────────────────────────
  const toggleStop    = (s: number) => setSelectedStops(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleAirline = (a: string) => setSelectedAirlines(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  const toggleClass       = (c: string) => setSelectedClasses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleQuota       = (q: string) => setSelectedQuotas(prev => prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q])
  const toggleTrainOp     = (o: string) => setSelectedTrainOps(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o])
  const toggleTrainType   = (t: string) => setSelectedTrainTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  const toggleBusType     = (t: string) => setSelectedBusTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  const toggleBusOp       = (o: string) => setSelectedBusOps(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o])
  const toggleCarCategory = (c: string) => setSelectedCarCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleFuelType    = (f: string) => setSelectedFuelTypes(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  const toggleCarCompany  = (c: string) => setSelectedCarCompanies(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const toggleStarRating    = (s: number) => setSelectedStarRatings(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const togglePropertyType  = (t: string) => setSelectedPropertyTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  const toggleAmenity       = (a: string) => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  const toggleMealPlan      = (m: string) => setSelectedMealPlans(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  const toggleBedType       = (b: string) => setSelectedBedTypes(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])

  const hasActiveFilters =
    selectedStops.length > 0 || selectedAirlines.length > 0 || maxPrice < Number.MAX_SAFE_INTEGER ||
    depTimeRange[0] > 0 || depTimeRange[1] < 1440 || arrTimeRange[0] > 0 || arrTimeRange[1] < 1440 ||
    flightDurationRange[1] < maxFlightDuration || selectedStopoverAirports.length > 0 || cabinBags > 0 || checkedBags > 0 ||
    selectedClasses.length > 0 || selectedQuotas.length > 0 || selectedTrainOps.length > 0 ||
    tatkalOnly || availableOnly || selectedTrainTypes.length > 0 ||
    trainDepTimeRange[0] > 0 || trainDepTimeRange[1] < 1440 ||
    trainArrTimeRange[0] > 0 || trainArrTimeRange[1] < 1440 ||
    (maxTrainDuration > 0 && trainDurationRange[1] < maxTrainDuration) ||
    selectedBusTypes.length > 0 || selectedBusOps.length > 0 || minRating > 0 ||
    busDepTimeRange[0] > 0 || busDepTimeRange[1] < 1440 ||
    selectedCarCategories.length > 0 || selectedFuelTypes.length > 0 || selectedCarCompanies.length > 0 || acOnly ||
    selectedStarRatings.length > 0 || selectedPropertyTypes.length > 0 || selectedAmenities.length > 0 ||
    selectedMealPlans.length > 0 || selectedBedTypes.length > 0 ||
    freeCancellationOnly || breakfastOnly || poolOnly || parkingOnly || noPrepaymentOnly ||
    minHotelReviewScore > 0

  // ── Sort label per mode ────────────────────────────────────────────────────
  const sortLabels: Record<TransportTab, [string, string, string]> = {
    flight: ['Cheapest', 'Best', 'Quickest'],
    hotel:  ['Cheapest', 'Top Rated', 'Most Stars'],
    train:  ['Cheapest', 'Earliest', 'Fastest'],
    bus:    ['Cheapest', 'Earliest', 'Top Rated'],
    car:    ['Cheapest', 'Premium', 'Compact'],
  }

  // ── Search bar defaults from current intent ───────────────────────────────
  const intentKey = `${data?.intent?.from_city}-${data?.intent?.to_city}-${data?.intent?.travel_date}-${data?.intent?.travelers}`
  const flightDef = data?.intent ? {
    from:   data.intent.from_city ?? '',
    to:     data.intent.to_city ?? '',
    depart: data.intent.travel_date ?? '',
    ret:    data.intent.return_date ?? '',
    adults: data.intent.travelers ?? 1,
  } : undefined
  const hotelDef = data?.intent ? {
    dest:     data.intent.to_city ?? data.intent.city ?? '',
    checkIn:  data.intent.check_in ?? data.intent.travel_date ?? '',
    checkOut: data.intent.check_out ?? '',
    adults:   data.intent.travelers ?? 2,
  } : undefined
  const busDef = data?.intent ? {
    from:   data.intent.from_city ?? '',
    to:     data.intent.to_city ?? '',
    date:   data.intent.travel_date ?? '',
    adults: data.intent.travelers ?? 1,
  } : undefined
  const carDef = data?.intent ? {
    pickup:     data.intent.from_city ?? '',
    dropoff:    data.intent.to_city ?? '',
    pickupDate: data.intent.travel_date ?? '',
  } : undefined
  const trainDef = data?.intent ? {
    from:   data.intent.from_city ?? '',
    to:     data.intent.to_city ?? '',
    date:   data.intent.travel_date ?? '',
    adults: data.intent.travelers ?? 1,
  } : undefined

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* ── Search banner ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-white/5 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-3">

          {/* Row 1 — query input */}
          <form onSubmit={e => { e.preventDefault(); handleSearch(draftQuery) }} className="flex items-stretch gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-3 rounded-xl text-emerald-300 text-sm font-semibold shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              AI
            </div>
            <input suppressHydrationWarning type="text" value={draftQuery} onChange={e => setDraftQuery(e.target.value)}
              placeholder="Describe your trip… e.g. bus from Pune to Mumbai next weekend"
              className="flex-1 min-w-0 bg-white/10 border border-white/15 focus:border-sky-400/60 focus:bg-white/15 text-white placeholder-white/35 text-sm font-medium rounded-xl px-4 py-2.5 outline-none transition-all"
            />
            <button type="submit" disabled={loading || !draftQuery.trim()}
              className="shrink-0 bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:opacity-40 text-white text-sm font-bold px-5 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-sky-500/25">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SearchIcon className="w-4 h-4" />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Row 2 — mode-specific search bar */}
          <div>
            {activeTab === 'flight' && <FlightSearchBar key={intentKey} defaults={flightDef} />}
            {activeTab === 'hotel'  && <HotelSearchBar  key={intentKey} defaults={hotelDef} />}
            {activeTab === 'bus'    && <BusSearchBar    key={intentKey} defaults={busDef} />}
            {activeTab === 'car'    && <CarSearchBar    key={intentKey} defaults={carDef} />}
            {activeTab === 'train'  && <TrainSearchBar  key={intentKey} defaults={trainDef} />}
          </div>

        </div>
      </div>

      {/* ── Transport Mode Cards ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3">
            {TRANSPORT_TABS.map(({ id, label, Icon: TabIcon }) => {
              const isActive = activeTab === id
              const style = TAB_STYLES[id]
              return (
                <button
                  key={id}
                  suppressHydrationWarning
                  onClick={() => data ? handleTabSwitch(id) : (setActiveTab(id), setSortBy('cheapest'))}
                  disabled={loading}
                  className={`group flex-1 flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 disabled:opacity-40 ${
                    isActive
                      ? style.activeBorderCls + ' scale-[1.03]'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm hover:scale-[1.01]'
                  }`}
                >
                  {/* Icon area — shorter */}
                  <div className={`flex items-center justify-center h-11 ${
                    isActive ? style.iconBgActive : style.iconBgInactive
                  }`}>
                    <TabIcon className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : style.iconCls
                    }`} />
                  </div>
                  {/* Label */}
                  <div className={`py-1.5 text-center ${isActive ? style.labelBgActive : 'bg-white'}`}>
                    <span className={`text-[11px] font-bold tracking-wide uppercase ${
                      isActive ? 'text-white' : 'text-slate-600'
                    }`}>{label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Top quick-filter pills (only when results exist) ── */}
      {data && !loading && (
        <div className="bg-white border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <TopFilters
              tab={activeTab}
              results={data.results}
              availableStops={availableStops}
              cheapestPerStop={cheapestPerStop}
              selectedStops={selectedStops}
              onToggleStop={toggleStop}
              depTimeRange={
                activeTab === 'train' ? trainDepTimeRange :
                activeTab === 'bus'   ? busDepTimeRange   : depTimeRange
              }
              onDepTimeChange={
                activeTab === 'train' ? (f, t) => setTrainDepTimeRange([f, t]) :
                activeTab === 'bus'   ? (f, t) => setBusDepTimeRange([f, t])   :
                                        (f, t) => setDepTimeRange([f, t])
              }
              selectedClasses={selectedClasses}
              onToggleClass={toggleClass}
              selectedBusTypes={selectedBusTypes}
              onToggleBusType={toggleBusType}
              selectedCarCategories={selectedCarCategories}
              onToggleCarCategory={toggleCarCategory}
            />
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-slate-700 font-semibold text-lg">AI is searching…</p>
            <p className="text-slate-400 text-sm">Finding the best {TRANSPORT_TABS.find(t => t.id === activeTab)?.label.toLowerCase()} deals</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 text-sm max-w-2xl">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Could not fetch results</p>
              <p className="mt-1 text-red-600">{error}</p>
              <p className="mt-1 text-red-400 text-xs">Make sure the backend is running: <code>{BACKEND_URL}</code></p>
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="flex gap-6 items-start">

            {/* ── Left sidebar ── */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-4">
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                  <h2 className="font-semibold text-slate-800 text-sm">Filters</h2>
                  {hasActiveFilters && (
                    <span className="ml-auto text-[11px] bg-sky-100 text-sky-600 font-semibold px-2 py-0.5 rounded-full">Active</span>
                  )}
                </div>
                <SearchFilters
                  tab={activeTab}
                  aiMessage={data.ai_message ?? ''}
                  onClearAll={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                  flight={{
                    availableStops, stopCounts, cheapestPerStop, selectedStops, onToggleStop: toggleStop,
                    onClearStops: () => setSelectedStops([]),
                    availableAirlines, selectedAirlines, onToggleAirline: toggleAirline,
                    onSelectAllAirlines: () => setSelectedAirlines([]),
                    priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                    depTimeRange, onDepTimeChange: (f, t) => setDepTimeRange([f, t]),
                    arrTimeRange, onArrTimeChange: (f, t) => setArrTimeRange([f, t]),
                    maxFlightDuration, flightDurationRange, onFlightDurationChange: (f, t) => setFlightDurationRange([f, t]),
                    stopoverDurationRange, onStopoverDurationChange: (f, t) => setStopoverDurationRange([f, t]),
                    availableStopoverAirports, selectedStopoverAirports,
                    onToggleStopoverAirport: a => setSelectedStopoverAirports(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]),
                    cabinBags, onCabinBagsChange: setCabinBags,
                    checkedBags, onCheckedBagsChange: setCheckedBags,
                  }}
                  train={{
                    results: data.results,
                    priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                    selectedClasses, onToggleClass: toggleClass,
                    selectedQuotas, onToggleQuota: toggleQuota,
                    selectedOperators: selectedTrainOps, onToggleOperator: toggleTrainOp,
                    depTimeRange: trainDepTimeRange, onDepTimeChange: (f, t) => setTrainDepTimeRange([f, t]),
                    arrTimeRange: trainArrTimeRange, onArrTimeChange: (f, t) => setTrainArrTimeRange([f, t]),
                    maxTrainDuration, trainDurationRange, onTrainDurationChange: (f, t) => setTrainDurationRange([f, t]),
                    tatkalOnly, onTatkalOnlyChange: setTatkalOnly,
                    availableOnly, onAvailableOnlyChange: setAvailableOnly,
                    selectedTrainTypes, onToggleTrainType: toggleTrainType,
                  }}
                  bus={{
                    results: data.results,
                    priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                    selectedBusTypes, onToggleBusType: toggleBusType,
                    selectedOperators: selectedBusOps, onToggleOperator: toggleBusOp,
                    minRating, onMinRatingChange: setMinRating,
                    depTimeRange: busDepTimeRange, onDepTimeChange: (f, t) => setBusDepTimeRange([f, t]),
                  }}
                  hotel={{
                    results: data.results,
                    priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                    freeCancellationOnly, onFreeCancellationChange: setFreeCancellationOnly,
                    breakfastOnly, onBreakfastOnlyChange: setBreakfastOnly,
                    poolOnly, onPoolOnlyChange: setPoolOnly,
                    parkingOnly, onParkingOnlyChange: setParkingOnly,
                    noPrepaymentOnly, onNoPrepaymentChange: setNoPrepaymentOnly,
                    selectedStarRatings, onToggleStarRating: toggleStarRating,
                    minReviewScore: minHotelReviewScore, onMinReviewScoreChange: setMinHotelReviewScore,
                    selectedPropertyTypes, onTogglePropertyType: togglePropertyType,
                    selectedMealPlans, onToggleMealPlan: toggleMealPlan,
                    selectedAmenities, onToggleAmenity: toggleAmenity,
                    selectedBedTypes, onToggleBedType: toggleBedType,
                  }}
                  car={{
                    results: data.results,
                    priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                    selectedCategories: selectedCarCategories, onToggleCategory: toggleCarCategory,
                    selectedFuelTypes, onToggleFuelType: toggleFuelType,
                    selectedCompanies: selectedCarCompanies, onToggleCompany: toggleCarCompany,
                    acOnly, onAcOnlyChange: setAcOnly,
                  }}
                />
              </div>
            </aside>

            {/* ── Main content ── */}
            <main className="flex-1 min-w-0">

              {/* Sort bar + count + mobile filter button */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-100 shadow-sm p-1">
                  {(['cheapest', 'best', 'quickest'] as SortKey[]).map((s, idx) => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                        sortBy === s ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}>{sortLabels[activeTab][idx]}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setMobileFilters(true)}
                    className={`lg:hidden flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium shadow-sm border transition-all ${
                      hasActiveFilters ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filters {hasActiveFilters && '•'}
                  </button>
                  <span className="bg-white border border-slate-200 text-slate-500 text-xs font-semibold px-3 py-2 rounded-xl shadow-sm">
                    {filteredResults.length} of {data.results.length}
                  </span>
                </div>
              </div>

              {/* Fare trend chart — flights only */}
              {intent === 'flight' && priceRange[0] > 0 && (
                <FareTrendChart minPrice={priceRange[0]} travelDate={data.intent.travel_date ?? null} />
              )}

              {filteredResults.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                  <p className="text-slate-500 font-medium">No results match your filters.</p>
                  <button onClick={resetFilters} className="mt-3 text-sky-500 text-sm hover:underline font-medium">Clear all filters</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredResults.map((r, i) => <ResultCard key={i} intent={intent} r={r} />)}
                </div>
              )}
            </main>
          </div>
        )}

        {!q && !loading && !error && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-700 font-semibold text-lg">Start from the home page</p>
            <p className="text-slate-400 text-sm mt-1">Type a travel query in the search box to get AI-powered results.</p>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && data && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-full bg-white shadow-2xl overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <h2 className="font-bold text-slate-800">Filters</h2>
              </div>
              <button onClick={() => setMobileFilters(false)} className="text-sky-500 text-sm font-semibold">Done</button>
            </div>
            <SearchFilters
              tab={activeTab}
              aiMessage={data.ai_message ?? ''}
              onClearAll={resetFilters}
              hasActiveFilters={hasActiveFilters}
              flight={{
                availableStops, stopCounts, cheapestPerStop, selectedStops, onToggleStop: toggleStop,
                onClearStops: () => setSelectedStops([]),
                availableAirlines, selectedAirlines, onToggleAirline: toggleAirline,
                onSelectAllAirlines: () => setSelectedAirlines([]),
                priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                depTimeRange, onDepTimeChange: (f, t) => setDepTimeRange([f, t]),
                arrTimeRange, onArrTimeChange: (f, t) => setArrTimeRange([f, t]),
                maxFlightDuration, flightDurationRange, onFlightDurationChange: (f, t) => setFlightDurationRange([f, t]),
                stopoverDurationRange, onStopoverDurationChange: (f, t) => setStopoverDurationRange([f, t]),
                availableStopoverAirports, selectedStopoverAirports,
                onToggleStopoverAirport: a => setSelectedStopoverAirports(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]),
                cabinBags, onCabinBagsChange: setCabinBags,
                checkedBags, onCheckedBagsChange: setCheckedBags,
              }}
              train={{
                results: data.results,
                priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                selectedClasses, onToggleClass: toggleClass,
                selectedQuotas, onToggleQuota: toggleQuota,
                selectedOperators: selectedTrainOps, onToggleOperator: toggleTrainOp,
                depTimeRange: trainDepTimeRange, onDepTimeChange: (f, t) => setTrainDepTimeRange([f, t]),
                arrTimeRange: trainArrTimeRange, onArrTimeChange: (f, t) => setTrainArrTimeRange([f, t]),
                maxTrainDuration, trainDurationRange, onTrainDurationChange: (f, t) => setTrainDurationRange([f, t]),
                tatkalOnly, onTatkalOnlyChange: setTatkalOnly,
                availableOnly, onAvailableOnlyChange: setAvailableOnly,
                selectedTrainTypes, onToggleTrainType: toggleTrainType,
              }}
              bus={{
                results: data.results,
                priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                selectedBusTypes, onToggleBusType: toggleBusType,
                selectedOperators: selectedBusOps, onToggleOperator: toggleBusOp,
                minRating, onMinRatingChange: setMinRating,
                depTimeRange: busDepTimeRange, onDepTimeChange: (f, t) => setBusDepTimeRange([f, t]),
              }}
              hotel={{
                results: data.results,
                priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                freeCancellationOnly, onFreeCancellationChange: setFreeCancellationOnly,
                breakfastOnly, onBreakfastOnlyChange: setBreakfastOnly,
                poolOnly, onPoolOnlyChange: setPoolOnly,
                parkingOnly, onParkingOnlyChange: setParkingOnly,
                noPrepaymentOnly, onNoPrepaymentChange: setNoPrepaymentOnly,
                selectedStarRatings, onToggleStarRating: toggleStarRating,
                minReviewScore: minHotelReviewScore, onMinReviewScoreChange: setMinHotelReviewScore,
                selectedPropertyTypes, onTogglePropertyType: togglePropertyType,
                selectedMealPlans, onToggleMealPlan: toggleMealPlan,
                selectedAmenities, onToggleAmenity: toggleAmenity,
                selectedBedTypes, onToggleBedType: toggleBedType,
              }}
              car={{
                results: data.results,
                priceRange, maxPrice, onMaxPriceChange: setMaxPrice,
                selectedCategories: selectedCarCategories, onToggleCategory: toggleCarCategory,
                selectedFuelTypes, onToggleFuelType: toggleFuelType,
                selectedCompanies: selectedCarCompanies, onToggleCompany: toggleCarCompany,
                acOnly, onAcOnlyChange: setAcOnly,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
