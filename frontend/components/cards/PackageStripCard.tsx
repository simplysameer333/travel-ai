'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Plane, Clock } from 'lucide-react'
import type { TravelPackage } from '@/lib/packages'
import { packageCoverImage, TYPE_COLORS, TYPE_LABELS } from '@/lib/packages'

interface PackageStripCardProps {
  pkg: TravelPackage
}

export function PackageStripCard({ pkg }: PackageStripCardProps) {
  const savings = Math.round((pkg.savings / pkg.original_price) * 100)

  return (
    <Link
      href={`/packages/${pkg.id}`}
      className="group flex-shrink-0 w-48 sm:w-52 bg-white/8 hover:bg-white/14 border border-white/10 hover:border-violet-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-28 overflow-hidden">
        <Image
          src={packageCoverImage(pkg.primary_destination, 300, 200)}
          alt={pkg.primary_destination}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="208px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-2 left-2">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[pkg.type]}`}>
            {TYPE_LABELS[pkg.type]}
          </span>
        </div>

        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
          -{savings}%
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Clock className="w-2.5 h-2.5 text-white/70" />
          <span className="text-[10px] text-white font-medium">{pkg.duration_nights}N/{pkg.duration_days}D</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-xs font-bold text-white leading-snug line-clamp-1 mb-1">
          {pkg.primary_destination}
        </p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-semibold text-amber-300">{pkg.rating}</span>
          <span className="text-[10px] text-white/40">({pkg.reviews_count.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-white">
              ₹{pkg.price_per_person.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-white/40">per person</div>
          </div>
          {pkg.inclusions.flights && (
            <Plane className="w-3.5 h-3.5 text-sky-400" />
          )}
        </div>
      </div>
    </Link>
  )
}
