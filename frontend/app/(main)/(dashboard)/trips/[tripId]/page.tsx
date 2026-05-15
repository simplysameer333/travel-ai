'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, Plane, Hotel, MapPin, CreditCard, MessageCircle,
  Calendar, Clock, Download, ChevronRight, CheckCircle2,
} from 'lucide-react'
import { getDestinationImage } from '@/lib/destinationImages'

const MOCK_TRIP = {
  id: '1',
  destination: 'Goa',
  subtext: 'Panaji, North Goa · Beach & Culture',
  emoji: '🏖️',
  color: 'from-sky-400 to-blue-500',
  dates: 'Jun 15 – Jun 20, 2025',
  nights: 5,
  status: 'upcoming',
  totalCost: '₹8,499',
  sections: [
    {
      type: 'flight',
      icon: Plane,
      title: 'IndraAir IA-441',
      detail: 'Delhi (DEL) → Goa (GOI)',
      meta: 'Jun 15 · 06:15 – 08:35 · 2h 20m',
      status: 'Confirmed',
      ref: 'TRV-8821',
      cost: '₹4,299',
      color: 'text-sky-500',
      bg: 'bg-sky-50',
    },
    {
      type: 'hotel',
      icon: Hotel,
      title: 'Hotel Sunset Goa',
      detail: 'Calangute Beach, North Goa',
      meta: 'Jun 15 – Jun 20 · 5 nights · Deluxe Room',
      status: 'Confirmed',
      ref: 'TRV-8822',
      cost: '₹4,200',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ],
  itinerary: [
    { day: 1, title: 'Arrival & Calangute Beach',  items: ['Arrive Goa airport 08:35', 'Check in Hotel Sunset', 'Calangute beach evening'] },
    { day: 2, title: 'North Goa Sightseeing',      items: ['Baga Beach', 'Anjuna Flea Market', 'Fort Aguada sunset'] },
    { day: 3, title: 'Old Goa & Culture',          items: ['Basilica of Bom Jesus', 'Se Cathedral', 'Panaji city walk'] },
    { day: 4, title: 'South Goa Day Trip',         items: ['Palolem Beach', 'Dudhsagar Falls detour', 'Beach shack dinner'] },
    { day: 5, title: 'Leisure & Departure',        items: ['Morning market', 'Hotel checkout 11:00', 'Depart Goa airport'] },
  ],
}

const STATUS_STYLE: Record<string, string> = {
  upcoming:  'bg-sky-100 text-sky-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
}

export default function TripDetailPage() {
  const _params = useParams()
  const trip = MOCK_TRIP

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* Back */}
      <Link href="/trips" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Bookings
      </Link>

      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          <Image
            src={getDestinationImage(trip.destination, 900, 400)}
            alt={trip.destination}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative p-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm`}>
                {trip.status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">{trip.emoji} {trip.destination}</h1>
            <p className="text-sm text-white/75 mt-1">{trip.subtext}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {trip.dates}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {trip.nights} nights</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-white/60">Total Cost</p>
            <p className="text-2xl font-black text-white">{trip.totalCost}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Download,      label: 'Invoice', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { icon: MessageCircle, label: 'Support', color: 'text-violet-500',  bg: 'bg-violet-50',  border: 'border-violet-100'  },
          { icon: MapPin,        label: 'Map View', color: 'text-sky-500',    bg: 'bg-sky-50',     border: 'border-sky-100'     },
        ].map(a => (
          <button key={a.label} className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border ${a.border} ${a.bg} hover:brightness-95 transition-all`}>
            <a.icon className={`w-5 h-5 ${a.color}`} />
            <span className={`text-xs font-bold ${a.color}`}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Bookings in this trip */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Your Bookings</h2>
        <div className="space-y-3">
          {trip.sections.map(s => (
            <div key={s.ref} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{s.title}</p>
                <p className="text-xs text-slate-500">{s.detail}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.meta}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-extrabold text-slate-900">{s.cost}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Itinerary</h2>
        <div className="space-y-3">
          {trip.itinerary.map(day => (
            <div key={day.day} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {day.day}
                </div>
                <h3 className="text-sm font-bold text-slate-800">{day.title}</h3>
              </div>
              <ul className="space-y-1.5 pl-11">
                {day.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* AI planning CTA */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-800">Enhance with AI</p>
          <p className="text-xs text-slate-500 mt-0.5">Get restaurant picks, local tips and transport for each day.</p>
        </div>
        <Link href="/chat" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-violet-500/25 shrink-0">
          Ask AI <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  )
}
