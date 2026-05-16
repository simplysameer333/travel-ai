'use client'

import Link from 'next/link'
import { TrendingUp, ArrowRight } from 'lucide-react'
import PackageCard from './PackageCard'
import { MOCK_PACKAGES } from '@/lib/packages'

interface Props {
  limit?: number
  compact?: boolean
  showHeader?: boolean
  showViewAll?: boolean
}

const trending = MOCK_PACKAGES.filter(p => p.is_trending || p.is_bestseller)

export default function TrendingPackages({
  limit = 6,
  compact = true,
  showHeader = true,
  showViewAll = true,
}: Props) {
  const packages = trending.slice(0, limit)

  return (
    <section>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Trending packages &amp; deals
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Most booked right now — prices updated daily</p>
          </div>
          {showViewAll && (
            <Link href="/packages" className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1 shrink-0">
              Browse all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} compact={compact} />
        ))}
      </div>
    </section>
  )
}
