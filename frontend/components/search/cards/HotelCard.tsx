'use client'

import Image from 'next/image'
import { MapPin, Wifi, Coffee, Waves, UtensilsCrossed, Heart, ShieldCheck, Star } from 'lucide-react'
import type { ResultRow } from '../types'
import { getDestinationImage } from '@/lib/destinationImages'

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'WiFi':           <Wifi className="w-3 h-3" />,
  'Free WiFi':      <Wifi className="w-3 h-3" />,
  'Pool':           <Waves className="w-3 h-3" />,
  'Swimming Pool':  <Waves className="w-3 h-3" />,
  'Breakfast':      <Coffee className="w-3 h-3" />,
  'Restaurant':     <UtensilsCrossed className="w-3 h-3" />,
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
      ))}
    </div>
  )
}

function ReviewBadge({ score }: { score: number }) {
  const label = score >= 9 ? 'Exceptional' : score >= 8 ? 'Excellent' : score >= 7 ? 'Very Good' : 'Good'
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="w-8 h-8 rounded-lg rounded-tl-none bg-sky-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
        {score.toFixed(1)}
      </div>
      <span className="text-xs font-semibold text-slate-700 hidden sm:block">{label}</span>
    </div>
  )
}

export function HotelCard({ r }: { r: ResultRow }) {
  const name             = r.name as string
  const city             = (r.city ?? r.location ?? 'Goa') as string
  const stars            = (r.stars ?? r.star_rating ?? 3) as number
  const category         = (r.category ?? r.property_type ?? 'Hotel') as string
  const roomType         = (r.room_type ?? 'Standard Room') as string
  const rating           = (r.rating ?? 8.5) as number
  const location         = (r.area ?? r.location ?? city) as string
  const checkIn          = (r.check_in ?? '') as string
  const checkOut         = (r.check_out ?? '') as string
  const nights           = (r.nights ?? 1) as number
  const pricePerNight    = (r.price_per_night ?? r.price) as number
  const totalPrice       = (r.total_price ?? pricePerNight * nights) as number
  const originalPrice    = (r.original_price ?? Math.round(pricePerNight * 1.22)) as number
  const discountPct      = Math.round(((originalPrice - pricePerNight) / originalPrice) * 100)
  const freeCancellation = (r.free_cancellation ?? false) as boolean
  const breakfastIncluded= (r.breakfast_included ?? false) as boolean
  const amenities        = ((r.amenities as string[]) ?? []).slice(0, 4)

  const imageUrl = getDestinationImage(city, 320, 240)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row">

      {/* Image panel */}
      <div className="relative sm:w-56 xl:w-64 h-44 sm:h-auto shrink-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt={`${city}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 256px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Property type badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {category}
          </span>
        </div>

        {/* Save */}
        <button className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
          <Heart className="w-3.5 h-3.5" />
        </button>

        {/* Bottom overlay badges */}
        <div className="absolute bottom-2.5 left-2.5 flex flex-col gap-1">
          {freeCancellation && (
            <span className="flex items-center gap-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-2.5 h-2.5" />
              Free cancel
            </span>
          )}
          {breakfastIncluded && (
            <span className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <Coffee className="w-2.5 h-2.5" />
              Breakfast incl.
            </span>
          )}
        </div>
      </div>

      {/* Details + price */}
      <div className="flex flex-1 min-w-0 flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

        {/* Details */}
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <StarRow count={stars} />
              <h3 className="font-bold text-slate-900 text-base leading-tight mt-1 truncate">{name}</h3>
            </div>
            <ReviewBadge score={rating} />
          </div>

          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
            <MapPin className="w-3 h-3 shrink-0 text-rose-400" />
            <span className="truncate">{location}</span>
          </div>

          <span className="inline-block mt-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            {roomType}
          </span>

          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {amenities.map(a => (
                <span key={a} className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5">
                  {AMENITY_ICONS[a] ?? null}
                  {a}
                </span>
              ))}
            </div>
          )}

          {checkIn && checkOut && (
            <p className="text-xs text-slate-400 mt-2.5 tabular-nums">
              {checkIn} → {checkOut} · {nights} night{nights !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Price panel */}
        <div className="sm:w-40 xl:w-44 p-4 flex flex-row sm:flex-col sm:justify-between items-center sm:items-stretch gap-4 sm:gap-0">
          <div className="flex-1 sm:flex-none">
            {discountPct > 0 && (
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs text-slate-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">-{discountPct}%</span>
              </div>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-extrabold text-slate-900 tabular-nums">₹{pricePerNight.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[11px] text-slate-400">per night</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              ₹{totalPrice.toLocaleString('en-IN')} total
            </p>
            <p className="text-[10px] text-slate-400">incl. taxes & fees</p>
          </div>
          <button className="shrink-0 sm:mt-3 w-auto sm:w-full bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-300 hover:to-pink-300 active:scale-95 text-white text-xs font-bold px-4 sm:px-0 py-2.5 rounded-xl transition-all shadow-sm shadow-rose-100 whitespace-nowrap">
            Select Room
          </button>
        </div>
      </div>
    </div>
  )
}
