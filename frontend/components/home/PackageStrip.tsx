'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react'
import { MOCK_PACKAGES } from '@/lib/packages'
import { PackageStripCard } from '@/components/cards'

const FEATURED = MOCK_PACKAGES.filter(p => p.is_bestseller || p.is_ai_recommended).slice(0, 6)

export default function PackageStrip() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' })
  }

  return (
    <div className="bg-gradient-to-r from-violet-950 via-purple-950 to-indigo-950 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-5">

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span className="text-base font-extrabold text-white">AI-Curated Packages</span>
            </div>
            <div className="bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full">
              <span className="text-base font-extrabold text-emerald-300">Save up to 35%</span>
            </div>
          </div>

          {/* Scroll arrows + link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/packages"
              className="flex items-center gap-1 text-xs font-semibold text-violet-300 hover:text-white transition-colors ml-1"
            >
              All packages <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Scroll container with right-fade */}
        <div className="relative">
          {/* Right gradient fade — visible when more content to scroll */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-1 w-24 bg-gradient-to-l from-purple-950 to-transparent z-10 pointer-events-none rounded-r-2xl" />
          )}
          {/* Left gradient fade */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-1 w-12 bg-gradient-to-r from-violet-950 to-transparent z-10 pointer-events-none rounded-l-2xl" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-1 no-scrollbar"
          >
            {FEATURED.map(pkg => (
              <PackageStripCard key={pkg.id} pkg={pkg} />
            ))}

            {/* "..." See all pill — last item in scroll */}
            <Link
              href="/packages"
              className="flex-shrink-0 w-20 bg-white/5 hover:bg-violet-500/15 border border-white/10 hover:border-violet-400/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all"
            >
              <div className="text-xl font-black text-violet-300 leading-none tracking-widest">•••</div>
              <span className="text-[10px] font-semibold text-violet-400 text-center leading-tight">
                View<br />all
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
