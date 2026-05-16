'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Train, Users, ChevronDown, ArrowRight, ArrowLeftRight } from 'lucide-react'
import CitySearchInput from './CitySearchInput'
import DatePickerCell   from './DatePickerCell'
import { Stepper }      from '@/components/shared/Stepper'

type TrainClass = 'any' | 'SL' | '3A' | '2A' | '1A' | 'CC' | '2S' | 'EC'
type TrainQuota = 'general' | 'tatkal' | 'ladies' | 'senior'

const CLASS_LABELS: Record<TrainClass, string> = {
  any: 'Any class', SL: 'Sleeper (SL)', '3A': 'AC 3-Tier (3A)',
  '2A': 'AC 2-Tier (2A)', '1A': 'AC First (1A)',
  CC: 'Chair Car (CC)', '2S': '2nd Sitting (2S)', EC: 'Exec Chair (EC)',
}
const QUOTA_LABELS: Record<TrainQuota, string> = {
  general: 'General', tatkal: 'Tatkal', ladies: 'Ladies', senior: 'Senior Citizen',
}

const cellCls = 'px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors cursor-text'
const iconBox = 'bg-emerald-500/25'
const opt     = 'flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/15 text-xs font-semibold text-white/70 hover:text-white hover:border-white/30 transition-all'
const micro   = 'text-white/50 text-[10px] font-semibold uppercase tracking-wider leading-none mb-0.5'

const today = new Date().toISOString().split('T')[0]

interface TrainDefaults {
  from?: string; to?: string; date?: string; returnDate?: string
  trainClass?: TrainClass; quota?: TrainQuota
  adults?: number; young?: number; seniors?: number; infants?: number
}

export default function TrainSearchBar({ defaults = {} }: { defaults?: TrainDefaults }) {
  const router = useRouter()
  const [from, setFrom]           = useState(defaults.from ?? '')
  const [to, setTo]               = useState(defaults.to ?? '')
  const [date, setDate]           = useState(defaults.date ?? '')
  const [returnDate, setReturnDate] = useState(defaults.returnDate ?? '')
  const [withReturn, setWithReturn] = useState(!!defaults.returnDate)
  const [trainClass, setTrainClass] = useState<TrainClass>(defaults.trainClass ?? 'any')
  const [quota, setQuota]         = useState<TrainQuota>(defaults.quota ?? 'general')
  const [adults, setAdults]       = useState(defaults.adults ?? 1)
  const [young, setYoung]         = useState(defaults.young ?? 0)
  const [seniors, setSeniors]     = useState(defaults.seniors ?? 0)
  const [infants, setInfants]     = useState(defaults.infants ?? 0)
  const [passOpen, setPassOpen]   = useState(false)
  const [classOpen, setClassOpen] = useState(false)
  const [quotaOpen, setQuotaOpen] = useState(false)
  const passRef  = useRef<HTMLDivElement>(null)
  const classRef = useRef<HTMLDivElement>(null)
  const quotaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!passRef.current?.contains(e.target as Node))  setPassOpen(false)
      if (!classRef.current?.contains(e.target as Node)) setClassOpen(false)
      if (!quotaRef.current?.contains(e.target as Node)) setQuotaOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const swap = () => { setFrom(to); setTo(from) }

  const totalPax = adults + young + seniors + infants
  const paxLabel = `${totalPax} Passenger${totalPax !== 1 ? 's' : ''}`

  const go = () => {
    const p = new URLSearchParams({
      tab: 'train', trainClass, quota,
      adults: String(adults), young: String(young), seniors: String(seniors), infants: String(infants),
    })
    if (from)       p.set('from',       from)
    if (to)         p.set('to',         to)
    if (date)       p.set('date',       date)
    if (withReturn && returnDate) p.set('returnDate', returnDate)
    router.push(`/search?${p}`)
  }

  return (
    <div className="space-y-2 text-left">
      {/* ── Options row ── */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Return toggle */}
        <div className="flex bg-black/30 backdrop-blur-sm border border-white/15 rounded-xl p-0.5">
          <button onClick={() => setWithReturn(false)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${!withReturn ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>
            One-way
          </button>
          <button onClick={() => setWithReturn(true)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${withReturn ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>
            Return
          </button>
        </div>

        {/* Class */}
        <div className="relative" ref={classRef}>
          <button onClick={() => { setClassOpen(v => !v); setQuotaOpen(false) }} className={opt}>
            {CLASS_LABELS[trainClass]} <ChevronDown className="w-3 h-3" />
          </button>
          {classOpen && (
            <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 w-48 z-[60]">
              {(Object.entries(CLASS_LABELS) as [TrainClass, string][]).map(([k, v]) => (
                <button key={k} onClick={() => { setTrainClass(k); setClassOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${trainClass === k ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quota */}
        <div className="relative" ref={quotaRef}>
          <button onClick={() => { setQuotaOpen(v => !v); setClassOpen(false) }} className={opt}>
            {QUOTA_LABELS[quota]} <ChevronDown className="w-3 h-3" />
          </button>
          {quotaOpen && (
            <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-2xl border border-slate-100 p-1.5 w-40 z-[60]">
              {(Object.entries(QUOTA_LABELS) as [TrainQuota, string][]).map(([k, v]) => (
                <button key={k} onClick={() => { setQuota(k); setQuotaOpen(false) }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${quota === k ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-stretch bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">

        {/* ── Row 1 (mobile): stations + swap ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <CitySearchInput
            label="From station" placeholder="City or station"
            value={from} onChange={setFrom}
            icon={<Train className="w-3 h-3 text-emerald-300" />}
            iconBg={iconBox} accent="emerald"
            className={`flex-1 min-w-0 ${cellCls} rounded-tl-2xl sm:rounded-bl-2xl`}
          />
          <button onClick={swap} title="Swap stations"
            className="px-2 border-r border-white/15 text-white/40 hover:text-emerald-300 hover:bg-white/10 transition-all shrink-0">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
          <CitySearchInput
            label="To station" placeholder="City or station"
            value={to} onChange={setTo}
            icon={<Train className="w-3 h-3 text-emerald-300 rotate-180" />}
            iconBg={iconBox} accent="emerald"
            className={`flex-1 min-w-0 ${cellCls} rounded-tr-2xl sm:rounded-tr-none`}
          />
        </div>

        {/* ── Row 2 (mobile): dates ── */}
        <div className="flex items-stretch border-b border-white/10 sm:contents">
          <DatePickerCell
            label="Departure" value={date} min={today}
            onChange={setDate} iconColor="text-emerald-300" accent="emerald"
            className="relative flex-1 min-w-0 border-r border-white/15"
          />
          {withReturn && (
            <DatePickerCell
              label="Return" value={returnDate} min={date || today}
              onChange={setReturnDate} iconColor="text-emerald-300" accent="emerald"
              className="relative flex-1 min-w-0 border-r border-white/15"
            />
          )}
        </div>

        {/* ── Row 3 (mobile): passengers + search ── */}
        <div className="flex items-stretch sm:contents">
          <div className="relative flex-1 sm:flex-none" ref={passRef}>
            <button onClick={() => setPassOpen(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2.5 border-r border-white/15 hover:bg-white/[0.06] transition-colors h-full w-full">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300 shrink-0" />
              <div>
                <div className={micro}>Passengers</div>
                <div className="text-white text-xs sm:text-sm font-semibold whitespace-nowrap">{paxLabel}</div>
              </div>
              <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ml-0.5 ${passOpen ? 'rotate-180' : ''}`} />
            </button>
            {passOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-60 z-[60]">
                <Stepper label="Adults"  sub="13–60 yrs" val={adults}  min={1} max={9} onChange={setAdults}  accent="emerald" />
                <Stepper label="Young"   sub="5–12 yrs"  val={young}   min={0} max={8} onChange={setYoung}   accent="emerald" />
                <Stepper label="Seniors" sub="60+ yrs"   val={seniors} min={0} max={8} onChange={setSeniors} accent="emerald" />
                <Stepper label="Infants" sub="Under 5"   val={infants} min={0} max={4} onChange={setInfants} accent="emerald" />
                <button onClick={() => setPassOpen(false)}
                  className="w-full mt-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors">
                  Done
                </button>
              </div>
            )}
          </div>
          <button onClick={go}
            className="px-3 sm:px-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none rounded-b-2xl sm:rounded-bl-none sm:rounded-r-2xl">
            Search <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
