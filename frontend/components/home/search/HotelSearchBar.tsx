'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Users, ChevronDown, ArrowRight, Star } from 'lucide-react'
import CitySearchInput from './CitySearchInput'
import DatePickerCell   from './DatePickerCell'
import { Stepper }      from '@/components/shared/Stepper'

type PropType = 'any' | 'hotel' | 'resort' | 'villa' | 'hostel' | 'apartment'
const PROP_LABELS: Record<PropType, string> = {
  any: 'Any property', hotel: 'Hotel', resort: 'Resort', villa: 'Villa', hostel: 'Hostel', apartment: 'Apartment',
}

const micro   = 'text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5'
const cellCls = 'px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors cursor-text'
const iconBox = 'bg-rose-500/25'
const opt     = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-all'

const today    = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0]

interface HotelDefaults {
  dest?: string; checkIn?: string; checkOut?: string
  rooms?: number; adults?: number; young?: number; seniors?: number; infants?: number
  minStars?: number; propType?: PropType
}

export default function HotelSearchBar({ defaults = {} }: { defaults?: HotelDefaults }) {
  const router = useRouter()
  const [dest, setDest]           = useState(defaults.dest ?? '')
  const [checkIn, setCheckIn]     = useState(defaults.checkIn ?? '')
  const [checkOut, setCheckOut]   = useState(defaults.checkOut ?? '')
  const [rooms, setRooms]         = useState(defaults.rooms ?? 1)
  const [adults, setAdults]       = useState(defaults.adults ?? 2)
  const [young, setYoung]         = useState(defaults.young ?? 0)
  const [seniors, setSeniors]     = useState(defaults.seniors ?? 0)
  const [infants, setInfants]     = useState(defaults.infants ?? 0)
  const [minStars, setMinStars]   = useState(defaults.minStars ?? 0)
  const [propType, setPropType]   = useState<PropType>(defaults.propType ?? 'any')
  const [guestOpen, setGuestOpen] = useState(false)
  const [propOpen, setPropOpen]   = useState(false)
  const guestRef = useRef<HTMLDivElement>(null)
  const propRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!guestRef.current?.contains(e.target as Node)) setGuestOpen(false)
      if (!propRef.current?.contains(e.target as Node))  setPropOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const totalGuests = adults + young + seniors + infants
  const guestLabel  = `${rooms} Room${rooms !== 1 ? 's' : ''}, ${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`

  const go = () => {
    const p = new URLSearchParams({ tab: 'hotel', rooms: String(rooms), adults: String(adults), young: String(young), seniors: String(seniors), infants: String(infants), propType, stars: String(minStars) })
    if (dest)     p.set('dest',     dest)
    if (checkIn)  p.set('checkIn',  checkIn)
    if (checkOut) p.set('checkOut', checkOut)
    router.push(`/search?${p}`)
  }

  return (
    <div className="space-y-2 text-left">
      {/* ── Options row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Star rating */}
        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl px-2.5 py-1.5">
          <span className="text-[11px] font-semibold text-white/50 mr-1">Min stars:</span>
          {[0, 1, 2, 3, 4, 5].map(s => (
            <button key={s} onClick={() => setMinStars(s)}
              className={`transition-all ${s === 0 ? 'text-[11px] font-semibold px-1' : ''} ${minStars === s ? 'text-amber-400 scale-110' : 'text-white/30 hover:text-white/60'}`}>
              {s === 0 ? 'Any' : <Star className="w-3 h-3" fill={s <= minStars ? 'currentColor' : 'none'} />}
            </button>
          ))}
        </div>

        {/* Property type */}
        <div className="relative" ref={propRef}>
          <button onClick={() => { setPropOpen(v => !v); setGuestOpen(false) }} className={opt}>
            {PROP_LABELS[propType]} <ChevronDown className="w-3 h-3" />
          </button>
          {propOpen && (
            <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 w-44 z-[60]">
              {(Object.entries(PROP_LABELS) as [PropType, string][]).map(([k, v]) => (
                <button key={k} onClick={() => { setPropType(k); setPropOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${propType === k ? 'bg-rose-50 text-rose-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-stretch bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">

        {/* ── Row 1 (mobile): destination ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <CitySearchInput
            label="Destination" placeholder="City, hotel or area"
            value={dest} onChange={setDest}
            icon={<MapPin className="w-3 h-3 text-rose-300" />}
            iconBg={iconBox} accent="rose"
            className={`flex-1 min-w-0 ${cellCls} rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl`}
          />
        </div>

        {/* ── Row 2 (mobile): dates ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <DatePickerCell
            label="Check-in" value={checkIn} min={today}
            onChange={setCheckIn} iconColor="text-rose-300" accent="rose"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
          <DatePickerCell
            label="Check-out" value={checkOut} min={checkIn || tomorrow}
            onChange={setCheckOut} iconColor="text-rose-300" accent="rose"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
        </div>

        {/* ── Row 3 (mobile): rooms/guests + search ── */}
        <div className="flex items-stretch sm:contents">
          <div className="relative flex-1 sm:flex-none" ref={guestRef}>
            <button onClick={() => { setGuestOpen(v => !v); setPropOpen(false) }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors h-full w-full">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-300 shrink-0" />
              <div>
                <div className={micro}>Rooms &amp; Guests</div>
                <div className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">{guestLabel}</div>
              </div>
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ml-0.5 ${guestOpen ? 'rotate-180' : ''}`} />
            </button>
            {guestOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-60 z-[60]">
                <Stepper label="Rooms"   sub="Max 9"      val={rooms}   min={1} max={9} onChange={setRooms}   accent="rose" />
                <Stepper label="Adults"  sub="13–60 yrs"  val={adults}  min={1} max={9} onChange={setAdults}  accent="rose" />
                <Stepper label="Young"   sub="2–12 yrs"   val={young}   min={0} max={8} onChange={setYoung}   accent="rose" />
                <Stepper label="Seniors" sub="60+ yrs"    val={seniors} min={0} max={8} onChange={setSeniors} accent="rose" />
                <Stepper label="Infants" sub="Under 2"    val={infants} min={0} max={4} onChange={setInfants} accent="rose" />
                <button onClick={() => setGuestOpen(false)}
                  className="w-full mt-3 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors">
                  Done
                </button>
              </div>
            )}
          </div>
          <button onClick={go}
            className="px-3 sm:px-5 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none rounded-b-2xl sm:rounded-bl-none sm:rounded-r-2xl">
            Search <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
