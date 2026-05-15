'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, Users, ArrowLeftRight, ChevronDown, ArrowRight, Plus, Minus } from 'lucide-react'
import CitySearchInput from './CitySearchInput'
import DatePickerCell   from './DatePickerCell'
import { Stepper }      from '@/components/shared/Stepper'

type TripType = 'return' | 'oneway' | 'multicity'
type Cabin    = 'economy' | 'premium_economy' | 'business' | 'first'

const CABIN_LABELS: Record<Cabin, string> = {
  economy: 'Economy', premium_economy: 'Prem. Economy', business: 'Business', first: 'First Class',
}

const micro   = 'text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5'
const cellCls = 'px-3 py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors cursor-text'
const iconBox = 'bg-sky-500/25'
const opt     = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-all'

const today = new Date().toISOString().split('T')[0]

interface FlightDefaults {
  from?: string; to?: string; depart?: string; ret?: string
  tripType?: TripType; cabin?: Cabin; bags?: number
  adults?: number; young?: number; seniors?: number; infants?: number
}

export default function FlightSearchBar({ defaults = {} }: { defaults?: FlightDefaults }) {
  const router = useRouter()
  const [tripType, setTripType]   = useState<TripType>(defaults.tripType ?? 'return')
  const [from, setFrom]           = useState(defaults.from ?? '')
  const [to, setTo]               = useState(defaults.to ?? '')
  const [depart, setDepart]       = useState(defaults.depart ?? '')
  const [ret, setRet]             = useState(defaults.ret ?? '')
  const [adults, setAdults]       = useState(defaults.adults ?? 1)
  const [young, setYoung]         = useState(defaults.young ?? 0)
  const [seniors, setSeniors]     = useState(defaults.seniors ?? 0)
  const [infants, setInfants]     = useState(defaults.infants ?? 0)
  const [cabin, setCabin]         = useState<Cabin>(defaults.cabin ?? 'economy')
  const [bags, setBags]           = useState(defaults.bags ?? 0)
  const [passOpen, setPassOpen]   = useState(false)
  const [classOpen, setClassOpen] = useState(false)
  const passRef  = useRef<HTMLDivElement>(null)
  const classRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!passRef.current?.contains(e.target as Node))  setPassOpen(false)
      if (!classRef.current?.contains(e.target as Node)) setClassOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const swap = () => { setFrom(to); setTo(from) }

  const totalPax = adults + young + seniors + infants
  const paxLabel = `${totalPax} Passenger${totalPax !== 1 ? 's' : ''}`

  const go = () => {
    const p = new URLSearchParams({ tab: 'flight', tripType, cabin, bags: String(bags), adults: String(adults), young: String(young), seniors: String(seniors), infants: String(infants) })
    if (from)                         p.set('from',   from)
    if (to)                           p.set('to',     to)
    if (depart)                       p.set('depart', depart)
    if (ret && tripType === 'return')  p.set('return', ret)
    router.push(`/search?${p}`)
  }

  return (
    <div className="space-y-2 text-left">
      {/* ── Options row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Trip type */}
        <div className="flex bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl p-0.5">
          {(['return', 'oneway', 'multicity'] as TripType[]).map(t => (
            <button key={t} onClick={() => setTripType(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${tripType === t ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>
              {t === 'oneway' ? 'One-way' : t === 'return' ? 'Return' : 'Multi-city'}
            </button>
          ))}
        </div>

        {/* Cabin class */}
        <div className="relative" ref={classRef}>
          <button onClick={() => { setClassOpen(v => !v); setPassOpen(false) }} className={opt}>
            {CABIN_LABELS[cabin]} <ChevronDown className="w-3 h-3" />
          </button>
          {classOpen && (
            <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 w-44 z-[60]">
              {(Object.entries(CABIN_LABELS) as [Cabin, string][]).map(([k, v]) => (
                <button key={k} onClick={() => { setCabin(k); setClassOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${cabin === k ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bags */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15">
          <button onClick={() => setBags(b => Math.max(0, b - 1))} className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 transition-all">
            <Minus className="w-2.5 h-2.5" />
          </button>
          <span className="text-[11px] font-semibold text-white/70 min-w-[46px] text-center">{bags} bag{bags !== 1 ? 's' : ''}</span>
          <button onClick={() => setBags(b => Math.min(4, b + 1))} className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 transition-all">
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex items-stretch bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">

        {/* From */}
        <CitySearchInput
          label="From" placeholder="City or airport"
          value={from} onChange={setFrom}
          icon={<Plane className="w-3 h-3 text-sky-300 -rotate-45" />}
          iconBg={iconBox}
          accent="sky"
          className={`flex-1 min-w-0 ${cellCls} rounded-l-2xl`}
        />

        {/* Swap */}
        <button onClick={swap} title="Swap cities"
          className="px-2 border-r border-white/15 text-white/40 hover:text-sky-300 hover:bg-white/10 transition-all shrink-0">
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>

        {/* To */}
        <CitySearchInput
          label="To" placeholder="City or airport"
          value={to} onChange={setTo}
          icon={<Plane className="w-3 h-3 text-sky-300 rotate-45" />}
          iconBg={iconBox}
          accent="sky"
          className={`flex-1 min-w-0 ${cellCls}`}
        />

        {/* Departure date */}
        <DatePickerCell
          label="Departure" value={depart} min={today}
          onChange={setDepart}
          iconColor="text-sky-300"
          accent="sky"
        />

        {/* Return date */}
        {tripType === 'return' && (
          <DatePickerCell
            label="Return" value={ret} min={depart || today}
            onChange={setRet}
            iconColor="text-sky-300"
            accent="sky"
          />
        )}

        {/* Passengers */}
        <div className="relative shrink-0" ref={passRef}>
          <button onClick={() => { setPassOpen(v => !v); setClassOpen(false) }}
            className="flex items-center gap-1.5 px-3 py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors h-full">
            <Users className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <div>
              <div className={micro}>Passengers</div>
              <div className="text-white text-sm font-semibold whitespace-nowrap">{paxLabel}</div>
            </div>
            <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ml-0.5 ${passOpen ? 'rotate-180' : ''}`} />
          </button>
          {passOpen && (
            <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-60 z-[60]">
              <Stepper label="Adults"  sub="13–60 yrs" val={adults}  min={1} max={9} onChange={setAdults}  accent="sky" />
              <Stepper label="Young"   sub="2–12 yrs"  val={young}   min={0} max={8} onChange={setYoung}   accent="sky" />
              <Stepper label="Seniors" sub="60+ yrs"   val={seniors} min={0} max={8} onChange={setSeniors} accent="sky" />
              <Stepper label="Infants" sub="Under 2"   val={infants} min={0} max={4} onChange={setInfants} accent="sky" />
              <button onClick={() => setPassOpen(false)}
                className="w-full mt-3 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition-colors">
                Done
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <button onClick={go}
          className="px-5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 shrink-0 rounded-r-2xl">
          Search <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
