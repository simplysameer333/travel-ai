'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, Plane, Utensils, Car, MapPin, Sparkles, Clock } from 'lucide-react'
import {
  TravelPackage,
  TYPE_LABELS,
  TYPE_COLORS,
  MEAL_LABELS,
  packageCoverImage,
} from '@/lib/packages'

interface Props {
  pkg: TravelPackage
  compact?: boolean
}

function StarRow({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-bold text-slate-800">{rating}</span>
      <span className="text-xs text-slate-400">({count.toLocaleString()})</span>
    </div>
  )
}

export default function PackageCard({ pkg, compact = false }: Props) {
  const savings = Math.round((pkg.savings / pkg.original_price) * 100)

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden flex flex-col">

      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ height: compact ? 160 : 220 }}>
        <Image
          src={packageCoverImage(pkg.primary_destination, 800, 520)}
          alt={pkg.primary_destination}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[pkg.type]}`}>
            {TYPE_LABELS[pkg.type]}
          </span>
          {pkg.is_bestseller && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">
              Bestseller
            </span>
          )}
          {pkg.is_trending && !pkg.is_bestseller && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500 text-white">
              Trending
            </span>
          )}
          {pkg.is_ai_recommended && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-600 text-white flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              AI Pick
            </span>
          )}
        </div>

        {/* Top-right: heart */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/40 transition-all">
          <Heart className="w-4 h-4 text-white" />
        </button>

        {/* Bottom: duration + free cancel */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-white/80" />
            <span className="text-xs font-semibold text-white">
              {pkg.duration_nights}N / {pkg.duration_days}D
            </span>
          </div>
          {pkg.cancellation_policy === 'free' && (
            <div className="bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <span className="text-[10px] font-bold text-white">Free Cancel</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Title + destination + rating */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{pkg.title}</h3>
          </div>
          <div className="flex items-center gap-1 mt-1 text-slate-500">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="text-xs truncate">{pkg.destinations.join(' · ')}</span>
          </div>
          <div className="mt-1.5">
            <StarRow rating={pkg.rating} count={pkg.reviews_count} />
          </div>
        </div>

        {/* AI summary */}
        <p className="text-xs italic text-slate-500 leading-relaxed line-clamp-2">
          <Sparkles className="w-3 h-3 inline mr-1 text-violet-400" />
          {pkg.ai_summary}
        </p>

        {/* Inclusion chips */}
        <div className="flex flex-wrap gap-1.5">
          {pkg.inclusions.flights && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
              <Plane className="w-2.5 h-2.5" /> Flights
            </span>
          )}
          {pkg.inclusions.hotel_stars > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5" /> {pkg.inclusions.hotel_stars}★ Hotel
            </span>
          )}
          {pkg.inclusions.meals !== 'none' && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <Utensils className="w-2.5 h-2.5" /> {MEAL_LABELS[pkg.inclusions.meals]}
            </span>
          )}
          {pkg.inclusions.transfers && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
              <Car className="w-2.5 h-2.5" /> Transfers
            </span>
          )}
          {pkg.visa_required === false && pkg.category === 'international' && (
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
              Visa Free
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTAs */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-slate-900">
                  ₹{pkg.price_per_person.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{Math.round(pkg.original_price / 2).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400">per person</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Save {savings}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <Link
                href={`/packages/${pkg.id}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
              >
                View Details
              </Link>
              <Link
                href={`/packages/create-with-ai?base=${pkg.id}`}
                className="flex items-center gap-1 text-[10px] font-semibold text-violet-600 hover:text-violet-800 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Customize with AI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
