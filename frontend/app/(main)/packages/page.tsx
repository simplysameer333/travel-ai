'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Sparkles, Package, Filter, Globe, MapPin, Sliders } from 'lucide-react'
import PackageCard from '@/components/packages/PackageCard'
import { MOCK_PACKAGES, PackageType, PackageCategory } from '@/lib/packages'

const TYPE_FILTERS: { label: string; value: PackageType | 'all' }[] = [
  { label: 'All Packages', value: 'all' },
  { label: 'Basic', value: 'basic' },
  { label: 'Standard', value: 'standard' },
  { label: 'Premium', value: 'premium' },
  { label: 'Luxury', value: 'luxury' },
]

const TAG_FILTERS = ['All', 'Beach', 'Mountains', 'Heritage', 'Adventure', 'Honeymoon', 'Family', 'Solo', 'Wellness', 'International']

export default function PackagesPage() {
  const [selectedType, setSelectedType] = useState<PackageType | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory | 'all'>('all')
  const [selectedTag, setSelectedTag] = useState('All')
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular')

  const filtered = useMemo(() => {
    let pkgs = [...MOCK_PACKAGES]

    if (selectedType !== 'all') {
      pkgs = pkgs.filter(p => p.type === selectedType)
    }
    if (selectedCategory !== 'all') {
      pkgs = pkgs.filter(p => p.category === selectedCategory)
    }
    if (selectedTag !== 'All') {
      pkgs = pkgs.filter(p => p.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()))
    }

    switch (sortBy) {
      case 'price_asc':  pkgs.sort((a, b) => a.price_per_person - b.price_per_person); break
      case 'price_desc': pkgs.sort((a, b) => b.price_per_person - a.price_per_person); break
      case 'rating':     pkgs.sort((a, b) => b.rating - a.rating); break
      default:
        pkgs.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0) || b.reviews_count - a.reviews_count)
    }

    return pkgs
  }, [selectedType, selectedCategory, selectedTag, sortBy])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-violet-200 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-curated packages with real savings
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Ready-to-Book
            <br />
            <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
              Travel Packages
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Flights + hotels + transfers bundled by AI. Save up to 35% vs booking separately.
          </p>
          <Link
            href="/packages/create-with-ai"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Create Custom Package with AI
          </Link>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[84px] z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto py-3 no-scrollbar">

            {/* Category toggle */}
            <div className="flex items-center gap-1 shrink-0 bg-slate-100 rounded-xl p-1">
              {(['all', 'domestic', 'international'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {cat === 'all' ? <Package className="w-3.5 h-3.5" /> : cat === 'domestic' ? <MapPin className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 shrink-0" />

            {/* Type filters */}
            <div className="flex items-center gap-2 shrink-0">
              {TYPE_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setSelectedType(f.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedType === f.value
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 shrink-0" />

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Tag pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            {TAG_FILTERS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-violet-100 text-violet-700 border border-violet-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Package Grid ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{filtered.length}</span> packages found
          </p>
          {filtered.length === 0 && (
            <button
              onClick={() => { setSelectedType('all'); setSelectedCategory('all'); setSelectedTag('All') }}
              className="text-xs text-violet-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-600 font-semibold mb-2">No packages found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}

        {/* AI Builder CTA */}
        <div className="mt-12 bg-gradient-to-r from-violet-600 to-purple-700 rounded-3xl p-8 text-center">
          <Sparkles className="w-8 h-8 text-violet-200 mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-white mb-2">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-violet-200 text-sm mb-6 max-w-md mx-auto">
            Tell our AI exactly what you want — budget, dates, vibe — and it will build a custom package just for you.
          </p>
          <Link
            href="/packages/create-with-ai"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 transition-all shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            Build My Custom Package
          </Link>
        </div>
      </div>
    </div>
  )
}
