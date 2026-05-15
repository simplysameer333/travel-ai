'use client'
import { Plane, Clock, TrendingDown, Zap } from 'lucide-react'

export interface FlightRouteCardProps {
  from:     string
  fromCode: string
  to:       string
  toCode:   string
  duration: string
  price:    number
  drop:     number   // % price drop vs 30-day avg
  hot?:     boolean
  onClick?: () => void
}

export function FlightRouteCard({ from, fromCode, to, toCode, duration, price, drop, hot, onClick }: FlightRouteCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex-shrink-0 w-56 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-sky-300 transition-all duration-200 hover:-translate-y-1 text-left"
    >
      {/* Sky accent bar */}
      <div className="h-1 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:from-sky-300 group-hover:to-blue-400 transition-colors" />

      {/* Route visualization */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {/* Origin */}
          <div className="text-center shrink-0">
            <div className="text-base font-black text-slate-900 tabular-nums tracking-tight leading-none">{fromCode}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{from}</div>
          </div>

          {/* Connector */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="flex items-center w-full gap-1">
              <div className="flex-1 h-px bg-slate-200 group-hover:bg-sky-200 transition-colors" />
              <div className="w-6 h-6 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                <Plane className="w-3 h-3 text-sky-500" />
              </div>
              <div className="flex-1 h-px bg-slate-200 group-hover:bg-sky-200 transition-colors" />
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-2.5 h-2.5 shrink-0" />
              <span className="text-[10px] font-medium">{duration}</span>
            </div>
          </div>

          {/* Destination */}
          <div className="text-center shrink-0">
            <div className="text-base font-black text-slate-900 tabular-nums tracking-tight leading-none">{toCode}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{to}</div>
          </div>
        </div>
      </div>

      {/* Price + badges */}
      <div className="px-4 pb-3 pt-2 border-t border-slate-100 bg-slate-50/60 flex items-end justify-between gap-2">
        <div>
          <div className="text-xl font-extrabold text-slate-900 tabular-nums leading-tight">
            ₹{price.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">one-way</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {hot && (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5">
              <Zap className="w-2.5 h-2.5 text-rose-500" />
              <span className="text-[9px] font-bold text-rose-600">Hot</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
            <TrendingDown className="w-2.5 h-2.5 text-emerald-600" />
            <span className="text-[10px] font-bold text-emerald-700">-{drop}%</span>
          </div>
        </div>
      </div>
    </button>
  )
}
