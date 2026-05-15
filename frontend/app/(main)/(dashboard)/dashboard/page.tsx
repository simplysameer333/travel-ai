'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Plane, CreditCard, Clock, ArrowRight,
  Sparkles, Ticket, Wallet, Bell, ChevronRight, Zap,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getDestinationImage } from '@/lib/destinationImages'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const STATS = [
  { label: 'Upcoming Trips',  value: '0',   icon: Plane,   color: 'text-sky-500',    bg: 'bg-sky-50'     },
  { label: 'Total Bookings',  value: '0',   icon: Ticket,  color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Wallet Credits',  value: '₹0',  icon: Wallet,  color: 'text-violet-500', bg: 'bg-violet-50'  },
  { label: 'Active Alerts',   value: '0',   icon: Bell,    color: 'text-amber-500',  bg: 'bg-amber-50'   },
]

const AI_RECS = [
  {
    destination: 'Goa',
    title: 'Goa Beach Escape',
    subtitle: 'Flights dropped 18% · Best time to book',
    tag: '-18%',
    tagBg: 'bg-rose-500',
    price: 2890,
    originalPrice: 3530,
    savings: 640,
    href: '/search?tab=flight&to=Goa',
  },
  {
    destination: 'Manali',
    title: 'Manali Hill Retreat',
    subtitle: '22°C · Clear skies · AI-picked window',
    tag: 'AI Pick',
    tagBg: 'bg-violet-600',
    price: 8499,
    originalPrice: 11200,
    savings: 2701,
    href: '/packages',
  },
  {
    destination: 'Jaipur',
    title: 'Jaipur Heritage Tour',
    subtitle: 'Rajpath Exp · 5h 30m · AC 3 Tier',
    tag: 'Trending',
    tagBg: 'bg-amber-500',
    price: 890,
    originalPrice: 1100,
    savings: 210,
    href: '/search?tab=train&to=Jaipur',
  },
]

const QUICK_LINKS = [
  { label: 'Book a Flight', href: '/search',   color: 'from-sky-500 to-blue-600'      },
  { label: 'Bookings',       href: '/trips',    color: 'from-emerald-500 to-teal-600'  },
  { label: 'AI Assistant',  href: '/chat',     color: 'from-violet-500 to-purple-600' },
  { label: 'Payments',      href: '/payments', color: 'from-amber-500 to-orange-600'  },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.full_name.split(' ')[0] ?? 'Traveller'
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Welcome header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {greeting()}, {firstName} ✈️
          </h1>
          <p className="text-sm text-slate-500 mt-1">Ready for your next adventure?</p>
        </div>
        <Link href="/profile">
          <div className="w-12 h-12 rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-shadow cursor-pointer overflow-hidden border border-white">
            {user?.full_name ? (
              <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
            ) : (
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="100" height="100" fill="#e2e8f0" />
                <circle cx="50" cy="36" r="22" fill="#94a3b8" />
                <path d="M0 100 Q0 68 50 66 Q100 68 100 100Z" fill="#94a3b8" />
                <rect x="0" y="80" width="100" height="20" fill="rgba(15,23,42,0.45)" />
                <text
                  x="50" y="93"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="system-ui,sans-serif"
                  fontWeight="700"
                  letterSpacing="2.5"
                  fill="white"
                >
                  NO PHOTO
                </text>
              </svg>
            )}
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_LINKS.map(ql => (
          <Link
            key={ql.label}
            href={ql.href}
            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl bg-gradient-to-r ${ql.color} text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all`}
          >
            {ql.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ))}
      </div>

      {/* Upcoming trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Upcoming Trips</h2>
          <Link href="/trips" className="text-xs text-sky-500 font-semibold hover:text-sky-600 flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-2xl">
            ✈️
          </div>
          <h3 className="text-sm font-bold text-slate-700 mb-1">No upcoming trips</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
            Book your next adventure and it will appear here.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
          >
            Search Flights & Trains
          </Link>
        </div>
      </section>

      {/* AI Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <h2 className="text-base font-bold text-slate-900">AI Recommendations</h2>
          </div>
          <Link href="/alerts" className="text-xs text-sky-500 font-semibold hover:text-sky-600 flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {AI_RECS.map(rec => (
            <Link key={rec.title} href={rec.href}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              {/* Image */}
              <div className="relative h-[120px] overflow-hidden">
                <Image
                  src={getDestinationImage(rec.destination, 400, 240)}
                  alt={rec.destination}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Tag badge */}
                <div className={`absolute top-2 right-2 ${rec.tagBg} text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md`}>
                  {rec.tag}
                </div>
                {/* Destination */}
                <div className="absolute bottom-2 left-2.5">
                  <p className="text-white font-extrabold text-sm drop-shadow-sm">{rec.destination}</p>
                </div>
              </div>
              {/* Body */}
              <div className="p-2.5">
                <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-1 mb-1.5">{rec.title}</p>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-sm font-extrabold text-slate-900">₹{rec.price.toLocaleString('en-IN')}</span>
                  <span className="text-[11px] text-slate-400 line-through">₹{rec.originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <Zap className="w-3 h-3 shrink-0" />
                  <span className="text-[10px] font-bold">Save ₹{rec.savings.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Payment overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Payment Overview</h2>
          <Link href="/payments" className="text-xs text-sky-500 font-semibold hover:text-sky-600 flex items-center gap-1">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Pending',   value: '₹0', color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
            { label: 'Completed', value: '₹0', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Refunds',   value: '₹0', color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100'  },
          ].map(p => (
            <div key={p.label} className={`${p.bg} border ${p.border} rounded-2xl p-4 text-center`}>
              <CreditCard className={`w-5 h-5 ${p.color} mx-auto mb-2`} />
              <div className={`text-xl font-extrabold ${p.color}`}>{p.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="text-base font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No recent activity yet.</p>
          <p className="text-xs text-slate-400 mt-1">Your bookings, payments and alerts will appear here.</p>
        </div>
      </section>

    </div>
  )
}
