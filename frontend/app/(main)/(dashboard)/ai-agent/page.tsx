'use client'

import Link from 'next/link'
import { Sparkles, Clock, Plane, Train, Package, ArrowRight, RotateCcw } from 'lucide-react'
import { useSearchHistoryStore, type SearchHistoryRecord } from '@/store/searchHistoryStore'
import PersonalisedPackages from '@/components/packages/PersonalisedPackages'
import TrendingPackages     from '@/components/packages/TrendingPackages'

// ---------------------------------------------------------------------------
// Trending routes — quick-access transport shortcuts
// ---------------------------------------------------------------------------

const TRENDING_ROUTES = [
  { from: 'Delhi',   to: 'Goa',       mode: 'flight', price: 3499  },
  { from: 'Mumbai',  to: 'Bangalore', mode: 'flight', price: 2899  },
  { from: 'Delhi',   to: 'Mumbai',    mode: 'train',  price: 1250  },
  { from: 'Kolkata', to: 'Puri',      mode: 'train',  price: 580   },
  { from: 'Mumbai',  to: 'Shirdi',    mode: 'bus',    price: 320   },
  { from: 'Delhi',   to: 'Agra',      mode: 'bus',    price: 350   },
]

const ROUTE_ICON: Record<string, React.ElementType> = { flight: Plane, train: Train, bus: Package }
const ROUTE_COLOR: Record<string, string> = {
  flight: 'bg-sky-100 text-sky-600',
  train:  'bg-emerald-100 text-emerald-600',
  bus:    'bg-amber-100 text-amber-600',
}

const INTENT_ICON: Record<string, React.ElementType> = {
  flight: Plane, train: Train, bus: Package, car: Package, package: Package,
}

// ---------------------------------------------------------------------------
// Recent search chip
// ---------------------------------------------------------------------------

function RecentChip({ record }: { record: SearchHistoryRecord }) {
  const Icon = INTENT_ICON[record.intent ?? 'flight'] ?? Plane
  const label = record.from_city && record.to_city
    ? `${record.from_city} → ${record.to_city}`
    : (record.to_city ?? record.query.slice(0, 28))

  const mins = Math.round((Date.now() - record.timestamp) / 60000)
  const ago = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins / 60)}h ago` : `${Math.round(mins / 1440)}d ago`

  return (
    <Link
      href={`/search?q=${encodeURIComponent(record.query)}`}
      className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50 transition-all group"
    >
      <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
        <Icon className="w-3 h-3 text-violet-600" />
      </div>
      <div className="min-w-0">
        <p className="text-slate-800 font-semibold text-xs leading-none truncate max-w-[140px]">{label}</p>
        <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />{ago}
        </p>
      </div>
      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-violet-500 shrink-0 transition-colors" />
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Trending route row
// ---------------------------------------------------------------------------

function TrendingRouteRow({ from, to, mode, price }: { from: string; to: string; mode: string; price: number }) {
  const Icon = ROUTE_ICON[mode] ?? Plane
  return (
    <Link
      href={`/search?q=${encodeURIComponent(`${mode} from ${from} to ${to}`)}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${ROUTE_COLOR[mode] ?? 'bg-slate-100 text-slate-500'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{from} → {to}</p>
        <p className="text-[11px] text-slate-400 capitalize">{mode}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-slate-900">₹{price.toLocaleString('en-IN')}</p>
        <p className="text-[10px] text-emerald-600 font-semibold">from</p>
      </div>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AIScoutPage() {
  const { history, clear } = useSearchHistoryStore()
  const hasHistory = history.length > 0

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500 border-2 border-white" />
            </span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">AI Scout</h1>
            <p className="text-xs text-slate-400">
              {hasHistory
                ? `${history.length} searches analysed · personalised for you`
                : 'Discover packages, deals & trending routes'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-200">
            <span className="text-[10px] font-semibold text-violet-600 uppercase tracking-wide">10 agents active</span>
          </div>
          {hasHistory && (
            <button onClick={clear} title="Clear history"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Recent searches — only when history exists ── */}
      {hasHistory && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-500" />
              Recent searches
            </h2>
            <Link href="/search" className="text-xs text-violet-600 font-semibold hover:underline">
              New search
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {history.slice(0, 8).map(r => <RecentChip key={r.id} record={r} />)}
          </div>
        </section>
      )}

      {/* ── Section 1: Personalised recommendations (independent component) ── */}
      <PersonalisedPackages limit={6} compact />

      {/* ── Section 2: Trending packages & deals (independent component) ── */}
      <TrendingPackages limit={6} compact />

      {/* ── Quick transport routes ── */}
      <section>
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
          <Plane className="w-4 h-4 text-sky-500" />
          Trending routes right now
        </h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {TRENDING_ROUTES.map((r, i) => (
            <TrendingRouteRow key={i} {...r} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-3xl p-8 text-center">
        <Sparkles className="w-8 h-8 text-violet-200 mx-auto mb-3" />
        <h2 className="text-xl font-extrabold text-white mb-2">Can&apos;t find what you&apos;re looking for?</h2>
        <p className="text-violet-200 text-sm mb-6 max-w-md mx-auto">
          Tell our AI exactly what you want — budget, dates, vibe — and it will build a custom package just for you.
        </p>
        <Link href="/packages/create-with-ai"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 transition-all shadow-lg">
          <Sparkles className="w-4 h-4" />
          Build My Custom Package
        </Link>
      </div>

    </div>
  )
}
