'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  Plane, Train, Hotel, Bus, Search, Moon, Calendar, ArrowRight,
  Bookmark, CheckCircle2, Clock, AlertCircle, CreditCard, Package, Ticket,
} from 'lucide-react'
import { getDestinationImage } from '@/lib/destinationImages'

const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled']

interface Booking {
  id: string
  type: 'flight' | 'hotel' | 'train' | 'bus'
  title: string
  detail: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  amount: string
}

interface Trip {
  id: string
  destination: string
  subtext: string
  dates: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  nights: number
  emoji: string
  totalCost: string
  bookings: Booking[]
}

const DEMO_TRIPS: Trip[] = [
  {
    id: '1',
    destination: 'Goa',
    subtext: 'Panaji, Goa · Beach & Culture',
    dates: 'Jun 15 – Jun 20, 2025',
    status: 'upcoming',
    nights: 5,
    emoji: '🏖️',
    totalCost: '₹8,499',
    bookings: [
      { id: 'TRV-8821', type: 'flight', title: 'IndraAir IA-441',  detail: 'DEL → GOI · Jun 15 · 06:15', status: 'confirmed', amount: '₹4,299' },
      { id: 'TRV-8822', type: 'hotel',  title: 'Hotel Sunset Goa', detail: 'Jun 15 – Jun 20 · 5 nights', status: 'confirmed', amount: '₹4,200' },
    ],
  },
  {
    id: '2',
    destination: 'Manali',
    subtext: 'Himachal Pradesh · Mountains',
    dates: 'Jul 10 – Jul 16, 2025',
    status: 'upcoming',
    nights: 6,
    emoji: '🏔️',
    totalCost: '₹12,200',
    bookings: [
      { id: 'TRV-8830', type: 'train', title: 'Rajpath Express',    detail: 'NDLS → KLR · Jul 10 · 08:30', status: 'confirmed', amount: '₹890'   },
      { id: 'TRV-8831', type: 'hotel', title: 'Snow Valley Resort', detail: 'Jul 11 – Jul 16 · 5 nights',  status: 'pending',   amount: '₹11,310' },
    ],
  },
  {
    id: '3',
    destination: 'Jaipur',
    subtext: 'Rajasthan · Heritage & Culture',
    dates: 'Mar 12, 2025',
    status: 'completed',
    nights: 1,
    emoji: '🏰',
    totalCost: '₹890',
    bookings: [
      { id: 'TRV-8819', type: 'train', title: 'Rajpath Express', detail: 'NDLS → JP · Mar 12 · 16:30', status: 'completed', amount: '₹890' },
    ],
  },
]

const STATUS_OVERLAY: Record<string, string> = {
  upcoming:  'bg-sky-500/80 text-white',
  ongoing:   'bg-emerald-500/80 text-white',
  completed: 'bg-slate-600/70 text-white',
  cancelled: 'bg-red-500/80 text-white',
}

const TYPE_CFG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  flight: { icon: Plane,  color: 'text-sky-600',    bg: 'bg-sky-50'     },
  hotel:  { icon: Hotel,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  train:  { icon: Train,  color: 'text-violet-600',  bg: 'bg-violet-50'  },
  bus:    { icon: Bus,    color: 'text-amber-600',   bg: 'bg-amber-50'   },
}

const BOOKING_STATUS_CFG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  confirmed: { icon: CheckCircle2, label: 'Confirmed', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  pending:   { icon: Clock,        label: 'Pending',   color: 'text-amber-700',   bg: 'bg-amber-100'   },
  cancelled: { icon: AlertCircle,  label: 'Cancelled', color: 'text-red-700',     bg: 'bg-red-100'     },
  completed: { icon: CheckCircle2, label: 'Completed', color: 'text-slate-500',   bg: 'bg-slate-100'   },
}

function packageLabel(bookings: Booking[]): { label: string; icon: React.ElementType; color: string; bg: string } {
  if (bookings.length === 1) return { label: 'Single Ticket', icon: Ticket,  color: 'text-slate-600', bg: 'bg-slate-100' }
  return                        { label: 'Full Package',   icon: Package, color: 'text-violet-700', bg: 'bg-violet-100' }
}

function TripCard({ trip, past }: { trip: Trip; past: boolean }) {
  const pkg = packageLabel(trip.bookings)
  const PkgIcon = pkg.icon

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-shadow group ${past ? 'opacity-90 hover:opacity-100' : 'hover:shadow-md'}`}>

      {/* Destination image */}
      <div className="relative h-36 sm:h-44 overflow-hidden">
        <Image
          src={getDestinationImage(trip.destination, 800, 350)}
          alt={trip.destination}
          fill
          className={`object-cover transition-transform duration-500 ${past ? '' : 'group-hover:scale-105'}`}
          sizes="(max-width: 768px) 100vw, 700px"
        />
        <div className={`absolute inset-0 ${past ? 'bg-gradient-to-t from-black/80 via-black/40 to-black/10' : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'}`} />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${pkg.bg} ${pkg.color}`}>
            <PkgIcon className="w-3 h-3 inline mr-1" />
            {pkg.label}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${STATUS_OVERLAY[trip.status]}`}>
            {trip.status}
          </span>
        </div>

        <div className="absolute bottom-3 left-4">
          <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow">{trip.emoji} {trip.destination}</h3>
          <p className="text-white/75 text-xs mt-0.5">{trip.subtext}</p>
        </div>
      </div>

      {/* Trip metadata */}
      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl px-2 py-2 bg-sky-50 border border-sky-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-sky-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest">Dates</p>
              <p className="text-[10px] font-extrabold text-sky-900 leading-tight truncate">{trip.dates}</p>
            </div>
          </div>
          <div className="rounded-xl px-2 py-2 bg-emerald-50 border border-emerald-100 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{trip.nights === 1 ? 'Day Trip' : 'Nights'}</p>
              <p className="text-lg font-black text-emerald-800 leading-none">{trip.nights}</p>
            </div>
          </div>
          <div className="rounded-xl px-2 py-2 bg-slate-50 border border-slate-200 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-[11px] font-extrabold text-slate-800 leading-tight">{trip.totalCost}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inline bookings */}
      <div className="mx-4 mt-3 rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
        {trip.bookings.map(b => {
          const typeCfg   = TYPE_CFG[b.type]   ?? TYPE_CFG.flight
          const statusCfg = BOOKING_STATUS_CFG[b.status] ?? BOOKING_STATUS_CFG.confirmed
          const TypeIcon   = typeCfg.icon
          const StatusIcon = statusCfg.icon
          return (
            <div key={b.id} className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-slate-50/60 transition-colors">
              <div className={`w-8 h-8 rounded-xl ${typeCfg.bg} flex items-center justify-center shrink-0`}>
                <TypeIcon className={`w-4 h-4 ${typeCfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{b.title}</p>
                <p className="text-[10px] text-slate-400 truncate">{b.detail}</p>
              </div>
              <span className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${statusCfg.bg} ${statusCfg.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusCfg.label}
              </span>
              <span className="text-xs font-extrabold text-slate-700 shrink-0">{b.amount}</span>
              <Link
                href={`/bookings/${b.id}`}
                className="flex items-center gap-0.5 text-[10px] font-bold text-sky-500 hover:text-sky-600 shrink-0 transition-colors"
              >
                Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-3 flex items-center gap-2">
        {!past && (
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-emerald-200 transition-all group/bm shrink-0">
            <Bookmark className="w-3.5 h-3.5 text-slate-400 group-hover/bm:text-emerald-500 transition-colors" />
          </button>
        )}
        <div className="flex-1" />
        <Link
          href={`/trips/${trip.id}`}
          className={`group flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all shrink-0 ${
            past
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/50'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-500'
          }`}
        >
          {past ? 'View Summary' : 'View Itinerary'}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  )
}

export default function TripsPage() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = DEMO_TRIPS.filter(t => {
    const matchFilter = active === 'All' || t.status === active.toLowerCase()
    const matchSearch = !search || t.destination.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const activeTrips = filtered.filter(t => t.status === 'upcoming' || t.status === 'ongoing')
  const pastTrips   = filtered.filter(t => t.status === 'completed' || t.status === 'cancelled')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">All your journeys and bookings in one place</p>
        </div>
        <Link
          href="/search"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
        >
          <Plane className="w-4 h-4" />
          New Trip
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Search destinations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 transition-all"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              active === f
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : 'border-slate-200 text-slate-600 bg-white hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-2xl">✈️</div>
          <h3 className="text-sm font-bold text-slate-700 mb-1">No trips here</h3>
          <p className="text-xs text-slate-400 mb-4">
            {search ? 'Try a different destination.' : active === 'All' ? "You haven't booked any trips yet." : `No ${active.toLowerCase()} trips found.`}
          </p>
          <Link href="/search" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25">
            Start Exploring
          </Link>
        </div>
      )}

      {/* Upcoming / Ongoing */}
      {activeTrips.length > 0 && (
        <div className="space-y-4">
          {(active === 'All' || active === 'Upcoming' || active === 'Ongoing') && (
            <SectionHeader label="Upcoming & Active" count={activeTrips.length} />
          )}
          {activeTrips.map(trip => <TripCard key={trip.id} trip={trip} past={false} />)}
        </div>
      )}

      {/* Past */}
      {pastTrips.length > 0 && (
        <div className="space-y-4">
          {(active === 'All' || active === 'Completed' || active === 'Cancelled') && (
            <SectionHeader label="Past Trips" count={pastTrips.length} />
          )}
          {pastTrips.map(trip => <TripCard key={trip.id} trip={trip} past={true} />)}
        </div>
      )}
    </div>
  )
}
