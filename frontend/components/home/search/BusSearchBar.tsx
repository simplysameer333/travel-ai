'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Users, ChevronDown, ArrowRight, ArrowLeftRight } from 'lucide-react'
import CitySearchInput from './CitySearchInput'
import DatePickerCell   from './DatePickerCell'
import { Stepper }      from '@/components/shared/Stepper'

type BusClass = 'any' | 'sleeper' | 'ac_sleeper' | 'seater' | 'ac_seater' | 'volvo'
const BUS_CLASS_LABELS: Record<BusClass, string> = {
  any: 'Any type', sleeper: 'Sleeper', ac_sleeper: 'A/C Sleeper', seater: 'Seater', ac_seater: 'A/C Seater', volvo: 'Volvo',
}

const micro   = 'text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5'
const cellCls = 'px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors cursor-text'
const iconBox = 'bg-orange-500/25'
const opt     = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-all'

const today = new Date().toISOString().split('T')[0]

interface BusDefaults {
  from?: string; to?: string; date?: string; busClass?: BusClass
  adults?: number; young?: number; seniors?: number; infants?: number
}

export default function BusSearchBar({ defaults = {} }: { defaults?: BusDefaults }) {
  const router = useRouter()
  const [from, setFrom]       = useState(defaults.from ?? '')
  const [to, setTo]           = useState(defaults.to ?? '')
  const [date, setDate]       = useState(defaults.date ?? '')
  const [adults, setAdults]   = useState(defaults.adults ?? 1)
  const [young, setYoung]     = useState(defaults.young ?? 0)
  const [seniors, setSeniors] = useState(defaults.seniors ?? 0)
  const [infants, setInfants] = useState(defaults.infants ?? 0)
  const [busClass, setBusClass]   = useState<BusClass>(defaults.busClass ?? 'any')
  const [seatOpen, setSeatOpen]   = useState(false)
  const [classOpen, setClassOpen] = useState(false)
  const seatRef  = useRef<HTMLDivElement>(null)
  const classRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!seatRef.current?.contains(e.target as Node))  setSeatOpen(false)
      if (!classRef.current?.contains(e.target as Node)) setClassOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const swap = () => { setFrom(to); setTo(from) }

  const totalSeats = adults + young + seniors + infants
  const seatLabel  = `${totalSeats} Seat${totalSeats !== 1 ? 's' : ''}`

  const go = () => {
    const p = new URLSearchParams({ tab: 'bus', busClass, adults: String(adults), young: String(young), seniors: String(seniors), infants: String(infants) })
    if (from) p.set('from', from)
    if (to)   p.set('to',   to)
    if (date) p.set('date', date)
    router.push(`/search?${p}`)
  }

  return (
    <div className="space-y-2 text-left">
      {/* ── Options row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative" ref={classRef}>
          <button onClick={() => setClassOpen(v => !v)} className={opt}>
            {BUS_CLASS_LABELS[busClass]} <ChevronDown className="w-3 h-3" />
          </button>
          {classOpen && (
            <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 w-44 z-[60]">
              {(Object.entries(BUS_CLASS_LABELS) as [BusClass, string][]).map(([k, v]) => (
                <button key={k} onClick={() => { setBusClass(k); setClassOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${busClass === k ? 'bg-orange-50 text-orange-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl px-3 py-1.5">
          <span className="text-[11px] font-semibold text-white/50">Overnight buses only</span>
          <button className="ml-2 w-8 h-4 rounded-full bg-white/10 border border-white/20 relative" title="Toggle overnight filter">
            <span className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white/40 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-stretch bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">

        {/* ── Row 1 (mobile): cities + swap ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <CitySearchInput
            label="From" placeholder="Departure city"
            value={from} onChange={setFrom}
            icon={<MapPin className="w-3 h-3 text-orange-300" />}
            iconBg={iconBox} accent="orange"
            className={`flex-1 min-w-0 ${cellCls} rounded-tl-2xl sm:rounded-bl-2xl`}
          />
          <button onClick={swap} title="Swap cities"
            className="px-2 border-r border-white/15 text-white/40 hover:text-orange-300 hover:bg-white/10 transition-all shrink-0">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <CitySearchInput
            label="To" placeholder="Destination city"
            value={to} onChange={setTo}
            icon={<MapPin className="w-3 h-3 text-orange-300" />}
            iconBg={iconBox} accent="orange"
            className={`flex-1 min-w-0 ${cellCls} rounded-tr-2xl sm:rounded-tr-none`}
          />
        </div>

        {/* ── Row 2 (mobile): date ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <DatePickerCell
            label="Journey Date" value={date} min={today}
            onChange={setDate} iconColor="text-orange-300" accent="orange"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
        </div>

        {/* ── Row 3 (mobile): passengers + search ── */}
        <div className="flex items-stretch sm:contents">
          <div className="relative flex-1 sm:flex-none" ref={seatRef}>
            <button onClick={() => setSeatOpen(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors h-full w-full">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-300 shrink-0" />
              <div>
                <div className={micro}>Passengers</div>
                <div className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">{seatLabel}</div>
              </div>
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ml-0.5 ${seatOpen ? 'rotate-180' : ''}`} />
            </button>
            {seatOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-60 z-[60]">
                <Stepper label="Adults"  sub="13–60 yrs" val={adults}  min={1} max={9} onChange={setAdults}  accent="orange" />
                <Stepper label="Young"   sub="2–12 yrs"  val={young}   min={0} max={8} onChange={setYoung}   accent="orange" />
                <Stepper label="Seniors" sub="60+ yrs"   val={seniors} min={0} max={8} onChange={setSeniors} accent="orange" />
                <Stepper label="Infants" sub="Under 2"   val={infants} min={0} max={4} onChange={setInfants} accent="orange" />
                <button onClick={() => setSeatOpen(false)}
                  className="w-full mt-3 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors">
                  Done
                </button>
              </div>
            )}
          </div>
          <button onClick={go}
            className="px-3 sm:px-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none rounded-b-2xl sm:rounded-bl-none sm:rounded-r-2xl">
            Search <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
