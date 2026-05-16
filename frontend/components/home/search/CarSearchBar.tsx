'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ArrowRight, Car, MapPin } from 'lucide-react'
import CitySearchInput from './CitySearchInput'
import DatePickerCell   from './DatePickerCell'

type CarType   = 'any' | 'hatchback' | 'sedan' | 'suv' | 'luxury' | 'minivan'
type DriveType = 'self' | 'with_driver'

const CAR_TYPE_LABELS: Record<CarType, string> = {
  any: 'Any car', hatchback: 'Hatchback', sedan: 'Sedan', suv: 'SUV / MUV', luxury: 'Luxury', minivan: 'Minivan',
}

const cellCls = 'px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors cursor-text'
const iconBox = 'bg-orange-500/25'
const opt     = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-all'

const today = new Date().toISOString().split('T')[0]

interface CarDefaults {
  pickup?: string; dropoff?: string; pickupDate?: string; dropDate?: string
  carType?: CarType; driveType?: DriveType
}

export default function CarSearchBar({ defaults = {} }: { defaults?: CarDefaults }) {
  const router = useRouter()
  const [pickup, setPickup]         = useState(defaults.pickup ?? '')
  const [dropoff, setDropoff]       = useState(defaults.dropoff ?? '')
  const [sameDropoff, setSameDropoff] = useState(true)
  const [pickupDate, setPickupDate] = useState(defaults.pickupDate ?? '')
  const [dropDate, setDropDate]     = useState(defaults.dropDate ?? '')
  const [carType, setCarType]       = useState<CarType>(defaults.carType ?? 'any')
  const [driveType, setDriveType]   = useState<DriveType>(defaults.driveType ?? 'self')
  const [carOpen, setCarOpen]       = useState(false)
  const carRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!carRef.current?.contains(e.target as Node)) setCarOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const go = () => {
    const p = new URLSearchParams({ tab: 'car', carType, driveType })
    if (pickup)     p.set('pickup',     pickup)
    if (dropoff)    p.set('dropoff',    sameDropoff ? pickup : dropoff)
    if (pickupDate) p.set('pickupDate', pickupDate)
    if (dropDate)   p.set('dropDate',   dropDate)
    router.push(`/search?${p}`)
  }

  return (
    <div className="space-y-2 text-left">
      {/* ── Options row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Drive type */}
        <div className="flex bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl p-0.5">
          {(['self', 'with_driver'] as DriveType[]).map(t => (
            <button key={t} onClick={() => setDriveType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${driveType === t ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>
              {t === 'self' ? 'Self-drive' : 'With driver'}
            </button>
          ))}
        </div>

        {/* Car type */}
        <div className="relative" ref={carRef}>
          <button onClick={() => setCarOpen(v => !v)} className={opt}>
            {CAR_TYPE_LABELS[carType]} <ChevronDown className="w-3 h-3" />
          </button>
          {carOpen && (
            <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 w-44 z-[60]">
              {(Object.entries(CAR_TYPE_LABELS) as [CarType, string][]).map(([k, v]) => (
                <button key={k} onClick={() => { setCarType(k); setCarOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${carType === k ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Same drop-off toggle */}
        <button onClick={() => setSameDropoff(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${sameDropoff ? 'bg-orange-500/20 border-orange-400/40 text-orange-300' : 'bg-black/30 border-white/15 text-white/50 hover:text-white/80'}`}>
          <Car className="w-3 h-3" />
          Same drop-off
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-stretch bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">

        {/* ── Row 1 (mobile): pickup + optional drop-off ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <CitySearchInput
            label="Pickup location" placeholder="City, airport or address"
            value={pickup} onChange={setPickup}
            icon={<MapPin className="w-3 h-3 text-orange-300" />}
            iconBg={iconBox} accent="orange"
            className={`flex-1 min-w-0 ${cellCls} ${!sameDropoff ? 'rounded-tl-2xl sm:rounded-bl-2xl' : 'rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl'}`}
          />
          {!sameDropoff && (
            <CitySearchInput
              label="Drop-off location" placeholder="City, airport or address"
              value={dropoff} onChange={setDropoff}
              icon={<MapPin className="w-3 h-3 text-orange-300" />}
              iconBg={iconBox} accent="orange"
              className={`flex-1 min-w-0 ${cellCls} rounded-tr-2xl sm:rounded-tr-none`}
            />
          )}
        </div>

        {/* ── Row 2 (mobile): dates ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <DatePickerCell
            label="Pickup date" value={pickupDate} min={today}
            onChange={setPickupDate} iconColor="text-orange-300" accent="orange"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
          <DatePickerCell
            label="Drop-off date" value={dropDate} min={pickupDate || today}
            onChange={setDropDate} iconColor="text-orange-300" accent="orange"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
        </div>

        {/* ── Row 3 (mobile): search button ── */}
        <div className="flex items-stretch sm:contents">
          <button onClick={go}
            className="px-3 sm:px-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none rounded-b-2xl sm:rounded-bl-none sm:rounded-r-2xl">
            Search <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
