'use client'

import { Train, ArrowRight } from 'lucide-react'
import type { ResultRow } from '../types'

export function TrainCard({ r }: { r: ResultRow }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden">
      <div className="flex">

        {/* ══ LEFT ══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col p-3 min-w-0 gap-2">

          {/* Train name + number */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Train className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                {r.train_name as string}
                <span className="font-normal text-slate-400 text-xs ml-1.5">#{r.train_number as string}</span>
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">{r.from as string}</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                <span className="font-semibold text-slate-600">{r.to as string}</span>
                <span className="text-slate-300 mx-0.5">·</span>
                <span>{r.departure_time as string}</span>
                <span className="text-slate-300 mx-0.5">·</span>
                <span>{r.duration as string}</span>
              </div>
            </div>
          </div>

          {/* Footer meta */}
          <div className="mt-auto pt-2 border-t border-slate-100 flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="text-[11px] font-bold text-slate-700">Class: {r.class as string}</span>
            <span className="text-[11px] text-slate-400">·</span>
            <span className="text-[11px] text-slate-500">{r.seats_available as number} seats</span>
            {!!r.tatkal_available && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                Tatkal
              </span>
            )}
            {r.quota != null && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {r.quota as string}
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
          <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-white text-xs font-bold py-2 rounded-lg shadow-sm shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-1">
            Select
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  )
}
