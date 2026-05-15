'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Clock } from 'lucide-react'
import type { Deal } from '@/lib/packages'
import { packageCoverImage } from '@/lib/packages'

interface DealCardProps {
  deal: Deal
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <Link
      href={`/packages/${deal.package_id}`}
      className="group block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src={packageCoverImage(deal.destination, 400, 250)}
          alt={deal.destination}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Discount badge */}
        <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
          -{deal.discount_percent}%
        </div>

        <div className="absolute bottom-3 left-3">
          <p className="text-white font-bold text-sm">{deal.destination}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-xs text-slate-600 mb-2 line-clamp-1">{deal.package_title}</p>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-extrabold text-slate-900">
            ₹{deal.deal_price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 line-through">
            ₹{deal.original_price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-emerald-600">
            <Zap className="w-3 h-3" />
            <span className="text-[11px] font-bold">Save ₹{deal.discount_amount.toLocaleString('en-IN')}</span>
          </div>
          {deal.seats_left != null && (
            <div className="flex items-center gap-1 text-amber-600">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-semibold">{deal.seats_left} left</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
