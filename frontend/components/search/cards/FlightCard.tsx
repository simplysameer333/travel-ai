'use client'

import Image from 'next/image'
import { ArrowRight, Briefcase, ShoppingBag, Heart, Share2 } from 'lucide-react'
import type { ResultRow } from '../types'

const AIRLINE_IATA: Record<string, string> = {
  'IndiGo':         '6E',
  'Air India':      'AI',
  'SpiceJet':       'SG',
  'Vistara':        'UK',
  'Akasa Air':      'QP',
  'Go First':       'G8',
  'Air Asia India': 'I5',
  'Alliance Air':   '9I',
  'Star Air':       'S5',
}

function AirlineLogo({ airline }: { airline: string }) {
  const iata = AIRLINE_IATA[airline]
  const fallbackCls = 'w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-sky-600 font-bold text-xs'
  if (!iata) return <div className={fallbackCls}>{airline.slice(0, 2).toUpperCase()}</div>
  return (
    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1">
      <Image
        src={`https://images.kiwi.com/airlines/64/${iata}.png`}
        alt={airline} width={36} height={36}
        className="object-contain w-full h-full"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement
          el.style.display = 'none'
          const p = el.parentElement
          if (p) { p.textContent = airline.slice(0, 2).toUpperCase(); p.className = fallbackCls }
        }}
      />
    </div>
  )
}

function LegRow({
  airline, depTime, from, to, stops, duration, flightNo, isReturn = false,
}: {
  airline: string; depTime: string; from: string; to: string
  stops: number; duration: string; flightNo: string; isReturn?: boolean
}) {
  const isDirect   = stops === 0
  const stopsLabel = isDirect ? 'Direct' : stops === 1 ? '1 Stop' : `${stops} Stops`
  return (
    <div className={`flex items-center gap-2.5 ${isReturn ? 'pt-2 border-t border-slate-100' : ''}`}>
      <AirlineLogo airline={airline} />
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <div className={`w-2 h-2 rounded-full ${isReturn ? 'bg-orange-400' : 'bg-sky-400'}`} />
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
          {isReturn ? 'RET' : 'DEP'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-slate-900 tabular-nums whitespace-nowrap">{depTime}</span>
          <div className="flex-1 flex items-center gap-1 min-w-0">
            <div className="h-px flex-1 bg-slate-200" />
            <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
              isDirect ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
            }`}>{stopsLabel}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 tabular-nums whitespace-nowrap">{duration}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-[11px]">
          <span className="font-semibold text-slate-600 truncate">{from}</span>
          <ArrowRight className="w-2.5 h-2.5 text-slate-300 shrink-0" />
          <span className="font-semibold text-slate-600 truncate">{to}</span>
          <span className="text-slate-300 ml-1 shrink-0">·</span>
          <span className="text-slate-400 shrink-0">{flightNo}</span>
        </div>
      </div>
    </div>
  )
}

export function FlightCard({ r }: { r: ResultRow }) {
  const isRoundTrip = r.trip_type === 'Round Trip' && !!r.return_departure_time

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-200 transition-all overflow-hidden">
      <div className="flex">

        {/* ══ LEFT ══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col p-3 min-w-0">
          <div className="flex flex-col gap-2.5">
            <LegRow
              airline={r.airline as string}
              depTime={r.departure_time as string}
              from={r.from as string}
              to={r.to as string}
              stops={r.stops as number}
              duration={r.duration as string}
              flightNo={r.flight_number as string}
            />
            {isRoundTrip && (
              <LegRow
                airline={r.airline as string}
                depTime={r.return_departure_time as string}
                from={r.to as string}
                to={r.from as string}
                stops={r.return_stops as number}
                duration={r.return_duration as string}
                flightNo={r.return_flight_number as string}
                isReturn
              />
            )}
          </div>

          {/* Footer meta */}
          <div className="mt-auto pt-2 border-t border-slate-100 flex items-center flex-wrap gap-x-2 gap-y-1">
            <span className="text-[11px] font-bold text-slate-700">{r.airline as string}</span>
            <span className="text-[11px] text-slate-400">{r.class as string}</span>
            {!!r.refundable && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700">Refundable</span>
            )}
            <div className="flex items-center gap-1 ml-auto flex-wrap justify-end">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-full">
                <ShoppingBag className="w-2.5 h-2.5" />
                {r.baggage_cabin_kg as number}kg cabin
              </span>
              {r.baggage_checkin_kg ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full">
                  <Briefcase className="w-2.5 h-2.5" />
                  {r.baggage_checkin_kg as number}kg check-in
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">
                  <Briefcase className="w-2.5 h-2.5" />
                  Carry-on only
                </span>
              )}
              <button className="ml-1 p-1 rounded-md hover:bg-slate-100 text-slate-300 hover:text-red-400 transition-colors" aria-label="Save">
                <Heart className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 rounded-md hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-colors" aria-label="Share">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ══ RIGHT — price + CTA ════════════════════════════════════════════ */}
        <div className="border-l border-slate-200 bg-slate-50/60 flex flex-col items-stretch justify-between p-3 w-36 sm:w-40 shrink-0">

          {/* Class + seats */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] text-slate-400 font-medium">{r.class as string}</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              {r.seats_available as number} seats
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums leading-none">
                {(r.price_per_person as number).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              per person&nbsp;·&nbsp;
              <span className="font-semibold text-slate-600">₹{(r.total_price as number).toLocaleString('en-IN')} total</span>
            </p>
          </div>

          {/* Select */}
          <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white text-xs font-bold py-2 rounded-lg shadow-sm shadow-sky-500/25 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-1">
            Select
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  )
}
