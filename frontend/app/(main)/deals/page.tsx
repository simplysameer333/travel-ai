'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Clock, Timer, ArrowRight, Sparkles, Tag, TrendingDown, Calendar, Star } from 'lucide-react'
import { MOCK_DEALS, MOCK_PACKAGES, packageCoverImage, Deal } from '@/lib/packages'

function useCountdown(expiresAt: string) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    function update() {
      const diff = new Date(expiresAt).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('Expired'); return }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    update()
    const interval = setInterval(update, 1_000)
    return () => clearInterval(interval)
  }, [expiresAt])

  return timeLeft
}

const DEAL_TYPE_STYLES: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  flash:        { label: 'Flash Deal',    color: 'bg-rose-500 text-white',    icon: Zap      },
  last_minute:  { label: 'Last Minute',   color: 'bg-amber-500 text-white',   icon: Timer    },
  early_bird:   { label: 'Early Bird',    color: 'bg-sky-500 text-white',     icon: Calendar },
  seasonal:     { label: 'Seasonal',      color: 'bg-emerald-500 text-white', icon: Tag      },
}

function DealCard({ deal }: { deal: Deal }) {
  const countdown = useCountdown(deal.expires_at)
  const pkg = MOCK_PACKAGES.find(p => p.id === deal.package_id)
  const style = DEAL_TYPE_STYLES[deal.deal_type]
  const DealIcon = style.icon
  const isFlash = deal.deal_type === 'flash'

  return (
    <div className={`group bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 ${isFlash ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-100'}`}>

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={packageCoverImage(deal.destination, 600, 300)}
          alt={deal.destination}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Deal type badge */}
        <div className="absolute top-3 left-3">
          <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${style.color}`}>
            <DealIcon className="w-2.5 h-2.5" />
            {style.label}
          </span>
        </div>

        {/* Discount badge */}
        <div className="absolute top-3 right-3 bg-white text-rose-600 font-extrabold text-sm px-2.5 py-1 rounded-full shadow-md">
          -{deal.discount_percent}%
        </div>

        {/* Countdown for flash/last_minute */}
        {(isFlash || deal.deal_type === 'last_minute') && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-xl">
            <Clock className="w-3 h-3 text-rose-400" />
            <span className="text-xs font-mono font-bold text-white">{countdown}</span>
          </div>
        )}

        {deal.seats_left && deal.seats_left <= 10 && (
          <div className="absolute bottom-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            {deal.seats_left} seats left!
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">{deal.package_title}</h3>
        <p className="text-xs text-slate-500 mb-2">{deal.description}</p>

        {/* AI insight */}
        <div className="flex items-start gap-1.5 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 mb-3">
          <Sparkles className="w-3 h-3 text-violet-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-violet-700 italic">{deal.ai_insight}</p>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{deal.deal_price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ₹{deal.original_price.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold">
              Save ₹{deal.discount_amount.toLocaleString('en-IN')}
            </p>
          </div>
          <Link
            href={`/packages/${deal.package_id}`}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] ${
              isFlash
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-500/25'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/25'
            }`}
          >
            Grab Deal
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DealsPage() {
  const flashDeals = useMemo(() => MOCK_DEALS.filter(d => d.deal_type === 'flash'), [])
  const otherDeals = useMemo(() => MOCK_DEALS.filter(d => d.deal_type !== 'flash'), [])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-rose-200 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5" />
            Limited-time deals · Updated daily
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Hottest Travel
            <br />
            <span className="bg-gradient-to-r from-rose-300 to-amber-300 bg-clip-text text-transparent">
              Deals Right Now
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            AI-tracked price drops, flash sales, and exclusive offers. Prices change hourly — book fast.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* Flash Deals */}
        {flashDeals.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">Flash Deals</span>
              </div>
              <span className="text-xs text-slate-400">Hurry — these expire soon!</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {flashDeals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </section>
        )}

        {/* More Deals */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <TrendingDown className="w-5 h-5 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900">More Great Deals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>

        {/* Top rated packages */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Top Rated Packages</h2>
            </div>
            <Link href="/packages" className="text-xs text-violet-600 font-semibold hover:text-violet-800 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOCK_PACKAGES.filter(p => p.rating >= 4.8).slice(0, 3).map(pkg => (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.id}`}
                className="group flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md p-3 transition-all"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={packageCoverImage(pkg.primary_destination, 200, 200)}
                    alt={pkg.primary_destination}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{pkg.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-700">{pkg.rating}</span>
                  </div>
                  <p className="text-xs text-violet-600 font-bold mt-0.5">
                    ₹{pkg.price_per_person.toLocaleString('en-IN')}/person
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-3xl p-8 text-center">
          <Sparkles className="w-8 h-8 text-violet-200 mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-white mb-2">Never miss a deal again</h2>
          <p className="text-violet-200 text-sm mb-6 max-w-md mx-auto">
            Set up AI Scout alerts and get notified the moment prices drop for your dream destination.
          </p>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 transition-all shadow-lg"
          >
            <Zap className="w-4 h-4" />
            Set Price Alert
          </Link>
        </div>
      </div>
    </div>
  )
}
