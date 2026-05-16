'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Users, ChevronDown, ArrowRight } from 'lucide-react'
import CitySearchInput from './CitySearchInput'
import DatePickerCell   from './DatePickerCell'
import { Stepper }      from '@/components/shared/Stepper'

const DURATIONS = ['3–5 days', '5–7 days', '7–10 days', '10–14 days', '14+ days']
const BUDGETS   = ['₹10,000', '₹25,000', '₹50,000', '₹75,000', '₹1,00,000', '₹1,50,000', '₹2,00,000+']

const micro   = 'text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5'
const cellCls = 'px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors cursor-text'
const iconBox = 'bg-amber-500/25'
const opt     = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-all'

const today = new Date().toISOString().split('T')[0]

export default function PackageSearchBar() {
  const router = useRouter()
  const [from, setFrom]       = useState('')
  const [dest, setDest]       = useState('')
  const [depart, setDepart]   = useState('')
  const [ret, setRet]         = useState('')
  const [adults, setAdults]   = useState(2)
  const [young, setYoung]     = useState(0)
  const [seniors, setSeniors] = useState(0)
  const [infants, setInfants] = useState(0)
  const [duration, setDuration] = useState('5–7 days')
  const [budget, setBudget]   = useState('₹50,000')
  const [travOpen, setTravOpen] = useState(false)
  const [durOpen, setDurOpen]   = useState(false)
  const [budOpen, setBudOpen]   = useState(false)
  const travRef = useRef<HTMLDivElement>(null)
  const durRef  = useRef<HTMLDivElement>(null)
  const budRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!travRef.current?.contains(e.target as Node)) setTravOpen(false)
      if (!durRef.current?.contains(e.target as Node))  setDurOpen(false)
      if (!budRef.current?.contains(e.target as Node))  setBudOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const totalTrav = adults + young + seniors + infants
  const travLabel = `${totalTrav} Traveller${totalTrav !== 1 ? 's' : ''}`

  const go = () => {
    const p = new URLSearchParams({ adults: String(adults), young: String(young), seniors: String(seniors), infants: String(infants), duration, budget })
    if (from)   p.set('from',   from)
    if (dest)   p.set('q',      dest)
    if (depart) p.set('depart', depart)
    if (ret)    p.set('return', ret)
    router.push(`/packages?${p}`)
  }

  const dropdownBase = 'absolute top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 z-[60]'

  return (
    <div className="space-y-2 text-left">
      {/* ── Options row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Duration */}
        <div className="relative" ref={durRef}>
          <button onClick={() => { setDurOpen(v => !v); setBudOpen(false) }} className={opt}>
            {duration} <ChevronDown className="w-3 h-3" />
          </button>
          {durOpen && (
            <div className={`${dropdownBase} left-0 w-40`}>
              {DURATIONS.map(d => (
                <button key={d} onClick={() => { setDuration(d); setDurOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${duration === d ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Budget */}
        <div className="relative" ref={budRef}>
          <button onClick={() => { setBudOpen(v => !v); setDurOpen(false) }} className={opt}>
            Budget: {budget} <ChevronDown className="w-3 h-3" />
          </button>
          {budOpen && (
            <div className={`${dropdownBase} left-0 w-44`}>
              {BUDGETS.map(b => (
                <button key={b} onClick={() => { setBudget(b); setBudOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${budget === b ? 'bg-amber-50 text-amber-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-stretch bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">

        {/* ── Row 1 (mobile): cities ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <CitySearchInput
            label="From" placeholder="Your city"
            value={from} onChange={setFrom}
            icon={<MapPin className="w-3 h-3 text-amber-300" />}
            iconBg={iconBox} accent="amber"
            className={`flex-1 min-w-0 ${cellCls} rounded-tl-2xl sm:rounded-bl-2xl`}
          />
          <CitySearchInput
            label="Where to?" placeholder="Goa, Bali, Switzerland…"
            value={dest} onChange={setDest}
            icon={<MapPin className="w-3 h-3 text-amber-300" />}
            iconBg={iconBox} accent="amber"
            className={`flex-1 min-w-0 ${cellCls} rounded-tr-2xl sm:rounded-tr-none`}
          />
        </div>

        {/* ── Row 2 (mobile): dates ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <DatePickerCell
            label="Depart" value={depart} min={today}
            onChange={setDepart} iconColor="text-amber-300" accent="amber"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
          <DatePickerCell
            label="Return" value={ret} min={depart || today}
            onChange={setRet} iconColor="text-amber-300" accent="amber"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
        </div>

        {/* ── Row 3 (mobile): travellers + browse ── */}
        <div className="flex items-stretch sm:contents">
          <div className="relative flex-1 sm:flex-none" ref={travRef}>
            <button onClick={() => setTravOpen(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors h-full w-full">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
              <div>
                <div className={micro}>Travellers</div>
                <div className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">{travLabel}</div>
              </div>
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ml-0.5 ${travOpen ? 'rotate-180' : ''}`} />
            </button>
            {travOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-60 z-[60]">
                <Stepper label="Adults"  sub="13–60 yrs" val={adults}  min={1} max={9} onChange={setAdults}  accent="amber" />
                <Stepper label="Young"   sub="2–12 yrs"  val={young}   min={0} max={8} onChange={setYoung}   accent="amber" />
                <Stepper label="Seniors" sub="60+ yrs"   val={seniors} min={0} max={8} onChange={setSeniors} accent="amber" />
                <Stepper label="Infants" sub="Under 2"   val={infants} min={0} max={4} onChange={setInfants} accent="amber" />
                <button onClick={() => setTravOpen(false)}
                  className="w-full mt-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors">
                  Done
                </button>
              </div>
            )}
          </div>
          <button onClick={go}
            className="px-3 sm:px-5 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none rounded-b-2xl sm:rounded-bl-none sm:rounded-r-2xl">
            Browse <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
