'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, Brain, Star, TrendingUp as Trending } from 'lucide-react'
import PackageCard from './PackageCard'
import { MOCK_PACKAGES, type TravelPackage } from '@/lib/packages'
import { useSearchHistoryStore } from '@/store/searchHistoryStore'

const AI_SIGNALS_NO_HISTORY = [
  { icon: Brain,   label: '847 trips analysed' },
  { icon: Star,    label: '4.8+ rated only' },
  { icon: Trending, label: 'Curated by AI agent' },
]

interface Props {
  limit?: number
  compact?: boolean
  showHeader?: boolean
  showViewAll?: boolean
}

// Packages that are AI-recommended but not mass-popular (trending+bestseller)
// keep this section feeling curated vs. the TrendingPackages crowd-favourite section
const AI_CURATED = MOCK_PACKAGES.filter(
  p => p.is_ai_recommended && !(p.is_trending && p.is_bestseller),
)
const AI_FALLBACK = MOCK_PACKAGES.filter(p => p.is_ai_recommended)

function derivePackages(history: ReturnType<typeof useSearchHistoryStore.getState>['history']): TravelPackage[] {
  if (history.length === 0) {
    // Fill from curated set first, then top-up with any ai_recommended if needed
    const fills = AI_FALLBACK.filter(p => !AI_CURATED.includes(p))
    return [...AI_CURATED, ...fills]
  }

  const dests = [...new Set(
    history
      .map(h => h.to_city ?? '')
      .filter(Boolean)
      .map(d => d.toLowerCase()),
  )]

  const matched = MOCK_PACKAGES.filter(p =>
    dests.some(d =>
      p.primary_destination.toLowerCase().includes(d) ||
      d.includes(p.primary_destination.toLowerCase()) ||
      p.destinations.some(dd => dd.toLowerCase().includes(d) || d.includes(dd.toLowerCase()))
    )
  )

  const fills = AI_CURATED.filter(p => !matched.includes(p))
  const extraFills = AI_FALLBACK.filter(p => !matched.includes(p) && !fills.includes(p))
  return [...matched, ...fills, ...extraFills]
}

export default function PersonalisedPackages({
  limit = 6,
  compact = true,
  showHeader = true,
  showViewAll = true,
}: Props) {
  const router = useRouter()
  const { history } = useSearchHistoryStore()
  const hasHistory = history.length > 0
  const packages = derivePackages(history).slice(0, limit)

  return (
    <section>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              {hasHistory ? 'Recommended for you' : 'Top picks for you'}
              <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                AI-powered
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {hasHistory
                ? 'Based on your recent searches and travel patterns'
                : 'Our agents\' top-rated packages across all destinations'}
            </p>
          </div>
          {showViewAll && (
            <Link href="/packages" className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1 shrink-0">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      {/* AI signals strip */}
      {!hasHistory && (
        <div className="flex flex-wrap gap-2 mb-4">
          {AI_SIGNALS_NO_HISTORY.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-100 text-[11px] font-semibold text-violet-700">
              <Icon className="w-3 h-3" />{label}
            </span>
          ))}
        </div>
      )}
      {hasHistory && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-2 rounded-xl bg-violet-50 border border-violet-100 w-fit">
          <Sparkles className="w-3 h-3 text-violet-500 shrink-0" />
          <span className="text-[11px] font-semibold text-violet-700">
            Matched {packages.length} packages to your recent searches
          </span>
        </div>
      )}

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} compact={compact} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm">No matching packages found.</p>
          <button
            onClick={() => router.push('/search')}
            className="mt-3 text-violet-600 text-xs font-semibold hover:underline"
          >
            Search for a destination
          </button>
        </div>
      )}
    </section>
  )
}
