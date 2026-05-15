'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Bot, Plus, TrendingDown, TrendingUp, Trash2, Plane,
  ArrowRight, ToggleLeft, ToggleRight, Target, Zap, ScanLine, X,
  Percent, Sparkles, RefreshCw, Activity, Cpu, Radio,
  Mail, BellRing,
} from 'lucide-react'
import { getDestinationImage } from '@/lib/destinationImages'

// -- Types --------------------------------------------------------------------

type AlertCondition = 'below' | 'above' | 'drop_pct' | 'any_change' | 'ai_recommend'
type AiSignal = 'buy_now' | 'wait' | null
type NotifyVia = 'email' | 'push' | 'both'

interface Alert {
  id: string
  from: string; fromCode: string
  to: string; toCode: string
  condition: AlertCondition
  targetPrice: number | null
  thresholdPct: number | null
  currentPrice: number
  startPrice: number
  lowestSeen: number
  trendPct: number
  aiSignal: AiSignal
  aiConfidence: number | null
  active: boolean
  triggered: boolean
  lastChecked: string
  notifyVia: NotifyVia
}

// -- Condition metadata -------------------------------------------------------

const COND: Record<AlertCondition, {
  label: string; shortLabel: string
  icon: React.ElementType
  color: string; bg: string; border: string; ring: string
  desc: string
  hasPrice: boolean; hasPct: boolean
}> = {
  below: {
    label: 'Price Drops Below',    shortLabel: 'Below',
    icon: TrendingDown,
    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-400',
    desc: 'Notify me when fare drops under my target price',
    hasPrice: true, hasPct: false,
  },
  above: {
    label: 'Price Rises Above',    shortLabel: 'Spike Alert',
    icon: TrendingUp,
    color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', ring: 'ring-rose-400',
    desc: "Warn me if price spikes - I'll book before it goes higher",
    hasPrice: true, hasPct: false,
  },
  drop_pct: {
    label: 'Drops by %',           shortLabel: '% Drop',
    icon: Percent,
    color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', ring: 'ring-sky-400',
    desc: "Alert when price falls by a set percentage from today's fare",
    hasPrice: false, hasPct: true,
  },
  any_change: {
    label: 'Any Significant Change', shortLabel: 'Any Change',
    icon: RefreshCw,
    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-400',
    desc: 'Ping me on any price movement greater than 5% either way',
    hasPrice: false, hasPct: false,
  },
  ai_recommend: {
    label: 'AI Recommendation',    shortLabel: 'AI',
    icon: Sparkles,
    color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', ring: 'ring-violet-400',
    desc: 'AI watches the route 24/7 and tells you the best moment to book',
    hasPrice: false, hasPct: false,
  },
}

// -- Demo data ----------------------------------------------------------------

const DEMO_ALERTS: Alert[] = [
  {
    id: '1',
    from: 'Delhi', fromCode: 'DEL', to: 'Goa', toCode: 'GOI',
    condition: 'below', targetPrice: 2500, thresholdPct: null,
    currentPrice: 2890, startPrice: 3100, lowestSeen: 2650, trendPct: -18,
    aiSignal: null, aiConfidence: null,
    active: true, triggered: false, lastChecked: '2 hours ago', notifyVia: 'push',
  },
  {
    id: '2',
    from: 'Mumbai', fromCode: 'BOM', to: 'Bangalore', toCode: 'BLR',
    condition: 'above', targetPrice: 4200, thresholdPct: null,
    currentPrice: 3450, startPrice: 3100, lowestSeen: 2980, trendPct: +8,
    aiSignal: null, aiConfidence: null,
    active: true, triggered: false, lastChecked: '1 hour ago', notifyVia: 'email',
  },
  {
    id: '3',
    from: 'Delhi', fromCode: 'DEL', to: 'Kolkata', toCode: 'CCU',
    condition: 'ai_recommend', targetPrice: null, thresholdPct: null,
    currentPrice: 3780, startPrice: 4100, lowestSeen: 3780, trendPct: -5,
    aiSignal: 'buy_now', aiConfidence: 84,
    active: true, triggered: true, lastChecked: '30 min ago', notifyVia: 'both',
  },
  {
    id: '4',
    from: 'Hyderabad', fromCode: 'HYD', to: 'Delhi', toCode: 'DEL',
    condition: 'drop_pct', targetPrice: null, thresholdPct: 15,
    currentPrice: 4100, startPrice: 4800, lowestSeen: 3900, trendPct: -10,
    aiSignal: null, aiConfidence: null,
    active: true, triggered: false, lastChecked: '3 hours ago', notifyVia: 'push',
  },
  {
    id: '5',
    from: 'Chennai', fromCode: 'MAA', to: 'Mumbai', toCode: 'BOM',
    condition: 'any_change', targetPrice: null, thresholdPct: null,
    currentPrice: 2200, startPrice: 2100, lowestSeen: 1950, trendPct: +6,
    aiSignal: null, aiConfidence: null,
    active: false, triggered: false, lastChecked: '1 day ago', notifyVia: 'email',
  },
]

const CITIES = [
  'Delhi (DEL)', 'Mumbai (BOM)', 'Bangalore (BLR)', 'Chennai (MAA)',
  'Kolkata (CCU)', 'Hyderabad (HYD)', 'Pune (PNQ)', 'Goa (GOI)',
  'Ahmedabad (AMD)', 'Jaipur (JAI)', 'Kochi (COK)', 'Lucknow (LKO)',
]

// -- Helpers ------------------------------------------------------------------

function isTriggered(a: Alert): boolean {
  if (a.condition === 'below')        return a.targetPrice !== null && a.currentPrice <= a.targetPrice
  if (a.condition === 'above')        return a.targetPrice !== null && a.currentPrice >= a.targetPrice
  if (a.condition === 'drop_pct')     return a.thresholdPct !== null && ((a.startPrice - a.currentPrice) / a.startPrice * 100) >= a.thresholdPct
  if (a.condition === 'any_change')   return Math.abs(a.trendPct) >= 5
  if (a.condition === 'ai_recommend') return a.aiSignal === 'buy_now'
  return false
}

// -- Watch Route Modal --------------------------------------------------------

function WatchRouteModal({ onClose, onAdd }: { onClose: () => void; onAdd: (a: Alert) => void }) {
  const [from, setFrom]           = useState('')
  const [to, setTo]               = useState('')
  const [condition, setCondition] = useState<AlertCondition>('below')
  const [price, setPrice]         = useState('')
  const [pct, setPct]             = useState('')
  const [notifyVia, setNotifyVia] = useState<NotifyVia>('push')

  const meta = COND[condition]
  const canSubmit = from && to && (
    (meta.hasPrice && price) ||
    (meta.hasPct && pct) ||
    (!meta.hasPrice && !meta.hasPct)
  )

  const handleAdd = () => {
    if (!canSubmit) return
    const fromMatch = from.match(/\((\w+)\)/)
    const toMatch   = to.match(/\((\w+)\)/)
    const startP = 3000 + Math.round(Math.random() * 2000)
    const currP  = startP - Math.round(Math.random() * 500)
    const newAlert: Alert = {
      id: Date.now().toString(),
      from: from.split(' (')[0], fromCode: fromMatch?.[1] ?? '???',
      to: to.split(' (')[0],    toCode: toMatch?.[1] ?? '???',
      condition,
      targetPrice:  meta.hasPrice ? parseInt(price) : null,
      thresholdPct: meta.hasPct   ? parseInt(pct)   : null,
      currentPrice: currP,
      startPrice:   startP,
      lowestSeen:   currP - Math.round(Math.random() * 200),
      trendPct: Math.round((Math.random() - 0.4) * 20),
      aiSignal: condition === 'ai_recommend' ? 'wait' : null,
      aiConfidence: condition === 'ai_recommend' ? Math.round(65 + Math.random() * 25) : null,
      active: true,
      triggered: false,
      lastChecked: 'Just now',
      notifyVia,
    }
    onAdd(newAlert)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Watch New Route</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <p className="text-xs text-slate-500 -mt-1">
          The AI scout agent will monitor this route and notify you based on your chosen mode.
        </p>

        {/* Route */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Route</label>
          <div className="flex items-center gap-2">
            <select
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all"
            >
              <option value="">From</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
            <select
              value={to}
              onChange={e => setTo(e.target.value)}
              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all"
            >
              <option value="">To</option>
              {CITIES.filter(c => c !== from).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Scout mode picker */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Scout Mode</label>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(COND) as AlertCondition[]).map(key => {
              const m = COND[key]
              const active = condition === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCondition(key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    active
                      ? `${m.bg} ${m.border} ring-2 ${m.ring}/30`
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? m.bg : 'bg-white border border-slate-200'}`}>
                    <m.icon className={`w-4 h-4 ${active ? m.color : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${active ? m.color : 'text-slate-700'}`}>{m.label}</p>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{m.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                    active ? `border-current ${m.color}` : 'border-slate-300'
                  }`}>
                    {active && <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {meta.hasPrice && (
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              {condition === 'below' ? 'Fire when price drops below' : 'Fire when price rises above'}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">&#8377;</span>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder={condition === 'below' ? 'e.g. 2500' : 'e.g. 5000'}
                className="w-full h-11 pl-8 pr-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all"
              />
            </div>
          </div>
        )}

        {meta.hasPct && (
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Scout fires when price drops by at least</label>
            <div className="relative">
              <input
                type="number"
                value={pct}
                onChange={e => setPct(e.target.value)}
                placeholder="e.g. 15"
                min="1" max="80"
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/60 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">%</span>
            </div>
            <p className="text-[11px] text-slate-400">Measured from today's fare on this route</p>
          </div>
        )}

        {condition === 'any_change' && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
            <Activity className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Agent fires whenever the fare moves more than <strong>5% in either direction</strong> from the current price.
            </p>
          </div>
        )}

        {condition === 'ai_recommend' && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-violet-50 border border-violet-100">
            <Sparkles className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
            <p className="text-xs text-violet-700 leading-relaxed">
              AI analyses price trends, seasonality, demand and airline behaviour to surface the <strong>optimal booking moment</strong> with a confidence score.
            </p>
          </div>
        )}

        {/* Notify via */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Notify Me Via</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'push',  label: 'Push',  sub: 'In-app',      icon: BellRing },
              { key: 'email', label: 'Email', sub: 'Inbox',        icon: Mail },
              { key: 'both',  label: 'Both',  sub: 'Push + Email', icon: BellRing },
            ] as { key: NotifyVia; label: string; sub: string; icon: React.ElementType }[]).map(opt => {
              const active = notifyVia === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setNotifyVia(opt.key)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-center transition-all ${
                    active
                      ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300/30'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-amber-100' : 'bg-white border border-slate-200'}`}>
                    <opt.icon className={`w-4 h-4 ${active ? 'text-amber-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-none ${active ? 'text-amber-700' : 'text-slate-700'}`}>{opt.label}</p>
                    <p className={`text-[10px] mt-0.5 ${active ? 'text-amber-500' : 'text-slate-400'}`}>{opt.sub}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!canSubmit}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4" />
            Deploy Scout
          </button>
        </div>
      </div>
    </div>
  )
}

// -- Scout Card ---------------------------------------------------------------

function ScoutCard({ alert, onToggle, onDelete }: {
  alert: Alert
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  const meta          = COND[alert.condition]
  const isDown        = alert.trendPct < 0
  const dropPctActual = Math.round((alert.startPrice - alert.currentPrice) / alert.startPrice * 100)

  const currentTriggered =
    (alert.condition === 'below' && alert.targetPrice !== null && alert.currentPrice <= alert.targetPrice) ||
    (alert.condition === 'above' && alert.targetPrice !== null && alert.currentPrice >= alert.targetPrice) ||
    (alert.condition === 'drop_pct' && alert.thresholdPct !== null && dropPctActual >= alert.thresholdPct) ||
    (alert.condition === 'any_change' && Math.abs(alert.trendPct) >= 5) ||
    (alert.condition === 'ai_recommend' && alert.aiSignal === 'buy_now')

  const targetLabel = () => {
    if (alert.condition === 'below')        return { label: 'Target',    value: `₹${alert.targetPrice?.toLocaleString()}` }
    if (alert.condition === 'above')        return { label: 'Spike at',  value: `₹${alert.targetPrice?.toLocaleString()}` }
    if (alert.condition === 'drop_pct')     return { label: 'Threshold', value: `${alert.thresholdPct}% drop` }
    if (alert.condition === 'any_change')   return { label: 'Mode',      value: 'Any >5%' }
    if (alert.condition === 'ai_recommend') return { label: 'AI Signal', value: alert.aiSignal === 'buy_now' ? 'Book Now' : 'Wait' }
    return { label: '', value: '' }
  }
  const tl = targetLabel()

  const statusText = () => {
    if (alert.condition === 'below' && alert.targetPrice !== null) {
      const diff = alert.currentPrice - alert.targetPrice
      return diff <= 0
        ? <span className="text-emerald-600 font-semibold">{'₹'}{Math.abs(diff).toLocaleString()} below target</span>
        : <span className="text-amber-600 font-semibold">{'₹'}{diff.toLocaleString()} above target</span>
    }
    if (alert.condition === 'above' && alert.targetPrice !== null) {
      const diff = alert.targetPrice - alert.currentPrice
      return diff > 0
        ? <span className="text-emerald-600 font-semibold">{'₹'}{diff.toLocaleString()} below spike</span>
        : <span className="text-rose-600 font-semibold">Spike! {'₹'}{Math.abs(diff).toLocaleString()} over</span>
    }
    if (alert.condition === 'drop_pct') {
      return dropPctActual >= (alert.thresholdPct ?? 999)
        ? <span className="text-emerald-600 font-semibold">{dropPctActual}% reached - fired</span>
        : <span className="text-sky-600 font-semibold">{dropPctActual}% / {alert.thresholdPct}% threshold</span>
    }
    if (alert.condition === 'any_change') {
      return Math.abs(alert.trendPct) >= 5
        ? <span className="text-amber-600 font-semibold">{Math.abs(alert.trendPct)}% change detected</span>
        : <span className="text-slate-500">No major movement yet</span>
    }
    if (alert.condition === 'ai_recommend') {
      return alert.aiSignal === 'buy_now'
        ? <span className="text-emerald-600 font-semibold">AI: Book now &middot; {alert.aiConfidence}% confidence</span>
        : <span className="text-violet-600 font-semibold">AI: Wait for better price</span>
    }
    return null
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow group ${
      currentTriggered ? 'border-emerald-200' : 'border-slate-100'
    }`}>

      {/* Destination image */}
      <div className="relative h-28 sm:h-32 overflow-hidden">
        <Image
          src={getDestinationImage(alert.to, 800, 300)}
          alt={alert.to}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 672px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

        {/* Top-right badges */}
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
          {currentTriggered ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
              <Zap className="w-2.5 h-2.5" /> Fired
            </span>
          ) : alert.active ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-amber-400/50">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
              </span>
              <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wide">Live</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-[9px] font-bold text-slate-300 uppercase tracking-wide">Paused</span>
          )}
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-sm border ${meta.bg} ${meta.border} ${meta.color}`}>
            <meta.icon className="w-2.5 h-2.5" />
            {meta.shortLabel}
          </span>
        </div>

        {/* Bottom-left: route */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
          <Plane className="w-3 h-3 text-white/70" />
          <span className="text-white font-extrabold text-sm drop-shadow">{alert.fromCode}</span>
          <ArrowRight className="w-3 h-3 text-white/60" />
          <span className="text-white font-extrabold text-sm drop-shadow">{alert.toCode}</span>
          <span className="text-white/60 text-xs font-medium">&middot; {alert.from} &rarr; {alert.to}</span>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 pt-3 pb-3">
        {/* 3 compact info cells */}
        <div className="grid grid-cols-3 gap-2 mb-3">

          {/* Target / mode cell */}
          <div className={`rounded-xl px-2 py-2 flex items-center gap-2 ${meta.bg} border ${meta.border}`}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white/60">
              <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-[9px] font-bold uppercase tracking-widest ${meta.color}`}>{tl.label}</p>
              <p className={`text-[11px] font-extrabold leading-tight ${meta.color}`}>{tl.value}</p>
            </div>
          </div>

          {/* Current price + trend */}
          <div className={`rounded-xl px-2 py-2 flex items-center gap-2 ${currentTriggered ? 'bg-emerald-50 border border-emerald-100' : isDown ? 'bg-slate-50 border border-slate-100' : 'bg-rose-50/60 border border-rose-100'}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${currentTriggered ? 'bg-emerald-100' : isDown ? 'bg-slate-100' : 'bg-rose-100'}`}>
              {isDown
                ? <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                : <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              }
            </div>
            <div>
              <p className={`text-[9px] font-bold uppercase tracking-widest ${isDown ? 'text-emerald-600' : 'text-rose-500'}`}>
                {isDown ? `${alert.trendPct}%` : `+${alert.trendPct}%`}
              </p>
              <p className="text-[13px] font-black text-slate-900 leading-none">&#8377;{alert.currentPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Lowest seen */}
          <div className="rounded-xl px-2 py-2 bg-slate-50 border border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Target className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lowest</p>
              <p className="text-[11px] font-extrabold text-slate-700 leading-tight">&#8377;{alert.lowestSeen.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Status + notify channel + scan time + controls */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 text-[11px]">
            {statusText()}
          </div>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-medium shrink-0">
            {alert.notifyVia === 'email' && <><Mail className="w-3 h-3" /> Email</>}
            {alert.notifyVia === 'push'  && <><BellRing className="w-3 h-3" /> Push</>}
            {alert.notifyVia === 'both'  && <><BellRing className="w-3 h-3" /> Both</>}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
            <ScanLine className="w-3 h-3" />
            <span>{alert.lastChecked}</span>
          </div>
          <button
            onClick={() => onToggle(alert.id)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50 transition-all shrink-0"
            title={alert.active ? 'Pause scout' : 'Resume scout'}
          >
            {alert.active
              ? <ToggleRight className="w-5 h-5 text-amber-500" />
              : <ToggleLeft className="w-5 h-5 text-slate-400" />
            }
          </button>
          <button
            onClick={() => onDelete(alert.id)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:border-red-300 hover:bg-red-50 transition-all shrink-0"
          >
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
}

// -- Page ---------------------------------------------------------------------

export default function AiScoutPage() {
  const [alerts, setAlerts]             = useState<Alert[]>(DEMO_ALERTS)
  const [showNew, setShowNew]           = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'watching' | 'triggered' | 'paused'>('all')

  const activeCount    = alerts.filter(a => a.active).length
  const triggeredCount = alerts.filter(a => isTriggered(a)).length

  const visible = alerts.filter(a => {
    if (activeFilter === 'watching')  return a.active && !isTriggered(a)
    if (activeFilter === 'triggered') return isTriggered(a)
    if (activeFilter === 'paused')    return !a.active
    return true
  })

  const toggleAlert = (id: string) =>
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  const deleteAlert = (id: string) =>
    setAlerts(prev => prev.filter(a => a.id !== id))
  const addAlert = (alert: Alert) =>
    setAlerts(prev => [alert, ...prev])

  const FILTERS = [
    { key: 'all',       label: 'All' },
    { key: 'watching',  label: 'Watching' },
    { key: 'triggered', label: 'Fired' },
    { key: 'paused',    label: 'Paused' },
  ] as const

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {showNew && <WatchRouteModal onClose={() => setShowNew(false)} onAdd={addAlert} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">AI Scout</h1>
              <p className="text-xs text-slate-500 mt-0.5">Your agent scanning fares 24/7</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Watch Route
        </button>
      </div>

      {/* Agent status bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 px-5 py-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/8 to-transparent animate-[scan_3s_linear_infinite]" />
        </div>
        <style>{`@keyframes scan { from { left: -33%; } to { left: 133%; } }`}</style>

        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-bold text-white">Agent Online</p>
              <p className="text-[11px] text-slate-400">Monitoring {activeCount} route{activeCount !== 1 ? 's' : ''} &middot; Scanned 2 min ago</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-base font-black text-white">{activeCount}</p>
              <p className="text-[10px] text-slate-400 font-medium">Watching</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-base font-black text-emerald-400">{triggeredCount}</p>
              <p className="text-[10px] text-slate-400 font-medium">Fired</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-[11px] text-amber-400 font-semibold">Next scan: 28 min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scout modes legend */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="w-3.5 h-3.5 text-amber-500" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Scout Modes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.keys(COND) as AlertCondition[]).map(key => {
            const m = COND[key]
            return (
              <div key={key} title={m.desc} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${m.bg} border ${m.border}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white/70 border ${m.border}`}>
                  <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${m.color} leading-tight`}>{m.label}</p>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">{m.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeFilter === f.key
                ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'border-slate-200 text-slate-600 bg-white hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Scout cards */}
      {visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map(alert => (
            <ScoutCard key={alert.id} alert={alert} onToggle={toggleAlert} onDelete={deleteAlert} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-3">
            <Bot className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Scout is ready</p>
          <p className="text-xs text-slate-400 mb-4">
            {activeFilter === 'triggered' ? 'No scouts have fired yet - keep watching.' : 'Add a route and the agent will start monitoring immediately.'}
          </p>
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-500/25"
          >
            <Plus className="w-4 h-4" /> Watch Route
          </button>
        </div>
      )}

      {/* Scout intel */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-bold text-slate-800">Scout Intelligence</p>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&bull;</span> Use <strong>Below Price</strong> for a fixed budget - most predictable scout mode</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&bull;</span> Use <strong>AI Mode</strong> when flexible - the agent picks the optimal booking day automatically</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&bull;</span> Use <strong>Spike Alert</strong> on routes that frequently see last-minute price jumps</li>
            <li className="flex items-start gap-2"><span className="text-amber-500 font-bold shrink-0">&bull;</span> Prices on Tue &amp; Wed are typically 10-15% cheaper - scout data confirms this on most Indian routes</li>
          </ul>
        </div>
      )}
    </div>
  )
}
