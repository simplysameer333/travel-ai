import { Star, Plane, Utensils, Car, MapPin, Sparkles } from 'lucide-react'
import type { ResultRow } from '../types'

export function PackageResultCard({ r }: { r: ResultRow }) {
  const name         = (r.name ?? r.title ?? r.package_name ?? 'Travel Package') as string
  const destination  = (r.destination ?? r.to_city ?? '') as string
  const origin       = (r.origin ?? r.from_city ?? '') as string
  const durationDays = Number(r.duration_days ?? r.nights ?? 5)
  const durationNights = Number(r.duration_nights ?? durationDays - 1)
  const price        = Number(r.price_per_person ?? r.total_price ?? r.price ?? 0)
  const originalPrice = Number(r.original_price ?? Math.round(price * 1.2))
  const savings      = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0
  const rating       = Number(r.rating ?? 4.2)
  const tripStyle    = (r.trip_style ?? r.type ?? 'Holiday') as string
  const aiSummary    = (r.ai_summary ?? r.description ?? '') as string
  const inclusions   = (r.inclusions ?? {}) as Record<string, unknown>

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-4 flex gap-4">
      {/* Destination badge */}
      <div className="w-24 shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
        <div className="text-center p-2">
          <MapPin className="w-5 h-5 mx-auto mb-1 text-white" />
          <p className="text-[11px] font-bold text-white leading-tight">{destination.split(',')[0]}</p>
          <p className="text-[10px] text-white/75 mt-0.5">{durationNights}N / {durationDays}D</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{name}</h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {origin && <span>{origin} →&nbsp;</span>}
              <span>{destination}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0 whitespace-nowrap">
            {tripStyle}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
        </div>

        {aiSummary && (
          <p className="text-xs text-slate-500 italic mt-1.5 line-clamp-2">
            <Sparkles className="w-3 h-3 inline mr-1 text-violet-400" />
            {aiSummary}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-2">
          {inclusions.flights && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
              <Plane className="w-2.5 h-2.5" /> Flights
            </span>
          )}
          {(inclusions.meals || inclusions.breakfast) && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <Utensils className="w-2.5 h-2.5" /> Meals
            </span>
          )}
          {inclusions.transfers && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
              <Car className="w-2.5 h-2.5" /> Transfers
            </span>
          )}
          {inclusions.hotels && (
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
              Hotel
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">₹{price.toLocaleString('en-IN')}</span>
              {savings > 0 && (
                <span className="text-xs text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400">per person</span>
              {savings > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Save {savings}%</span>
              )}
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all">
            View Package
          </button>
        </div>
      </div>
    </div>
  )
}
