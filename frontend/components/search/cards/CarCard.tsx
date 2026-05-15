import { Car, Fuel, Users, ArrowRight, Gauge } from 'lucide-react'
import type { ResultRow } from '../types'

export function CarCard({ r }: { r: ResultRow }) {
  const category = r.category as string
  const model     = r.car_model as string
  const company   = r.rental_company as string
  const priceDay  = r.price_per_day as number
  const fuel      = r.fuel_type as string
  const seats     = r.seats as number
  const ac        = r.ac as boolean
  const kmLimit   = r.km_limit as string | undefined
  const pickup    = r.pickup_location as string | undefined

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all overflow-hidden">
      <div className="flex">
        {/* Left */}
        <div className="flex-1 flex flex-col p-3 min-w-0 gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-900 text-sm leading-tight truncate">{model}</p>
              <p className="text-xs text-slate-400 truncate">{company}</p>
            </div>
            <span className="ml-auto shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
              {category}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <Fuel className="w-3 h-3 text-slate-400" />
              {fuel}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <Users className="w-3 h-3 text-slate-400" />
              {seats} seats
            </span>
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${ac ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
              {ac ? 'AC' : 'Non-AC'}
            </span>
            {kmLimit && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Gauge className="w-3 h-3 text-slate-400" />
                {kmLimit}
              </span>
            )}
          </div>

          {pickup && (
            <p className="text-[10px] text-slate-400 truncate">Pickup: {pickup}</p>
          )}
        </div>

        {/* Right — price + CTA */}
        <div className="border-l border-slate-200 bg-slate-50/60 flex flex-col items-stretch justify-between p-3 w-36 sm:w-40 shrink-0">
          <div />
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums leading-none">
                {priceDay.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">per day</p>
          </div>
          <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 active:scale-95 text-white text-xs font-bold py-2 rounded-lg shadow-sm shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-1">
            Select
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
