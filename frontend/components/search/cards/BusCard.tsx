'use client'

import { Bus, ArrowRight, Star } from 'lucide-react'
import type { ResultRow } from '../types'

export function BusCard({ r }: { r: ResultRow }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200 transition-all overflow-hidden">
      <div className="flex">

        {/* ══ LEFT ══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col p-3 min-w-0 gap-2">

          {/* Operator + type */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
              <Bus className="w-5 h-5 text-violet-500" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-900 text-sm leading-tight truncate">{r.operator as string}</p>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                <span>{r.bus_type as string}</span>
                <span className="text-slate-300 mx-0.5">·</span>
                <span>{r.departure_time as string}</span>
                <span className="text-slate-300 mx-0.5">·</span>
                <span>{r.duration as string}</span>
              </div>
            </div>
          </div>

          {/* Footer meta */}
          <div className="mt-auto pt-2 border-t border-slate-100 flex items-center flex-wrap gap-x-2 gap-y-1">
            {r.rating != null && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                {String(r.rating)}
              </span>
            )}
            <span className="text-[11px] text-slate-500">{r.seats_available as number} seats left</span>
            {r.amenities != null && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {r.amenities as string}
              </span>
            )}
          </div>
        </div>

        {/* ══ RIGHT — price + CTA ════════════════════════════════════════════ */}
        <div className="border-l border-slate-200 bg-slate-50/60 flex flex-col items-stretch justify-between p-3 w-36 sm:w-40 shrink-0">
          <div />
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums leading-none">
                {(r.price as number).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">per person</p>
          </div>
          <button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 active:scale-95 text-white text-xs font-bold py-2 rounded-lg shadow-sm shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center justify-center gap-1">
            Select
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  )
}
