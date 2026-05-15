'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CreditCard, Download, TrendingUp, Clock, CheckCircle2, RefreshCw, Search, AlertTriangle, Smartphone, ArrowRight } from 'lucide-react'
import { getDestinationImage } from '@/lib/destinationImages'

const FILTERS = ['All', 'Paid', 'Pending', 'Refunded', 'Failed']

const MOCK_PAYMENTS = [
  {
    id: 'PAY-2291',
    description: 'IndraAir DEL → GOA · Jun 15',
    date: '12 May 2025',
    method: 'UPI · Google Pay',
    status: 'paid',
    amount: '₹4,299',
    bookingRef: 'TRV-8821',
    destination: 'Goa',
  },
  {
    id: 'PAY-2290',
    description: 'Hotel Sunset Goa · 5 nights',
    date: '12 May 2025',
    method: 'HDFC Debit ••4821',
    status: 'paid',
    amount: '₹4,200',
    bookingRef: 'TRV-8822',
    destination: 'Goa',
  },
  {
    id: 'PAY-2188',
    description: 'Rajpath Exp · Refund',
    date: '20 Mar 2025',
    method: 'Original source',
    status: 'refunded',
    amount: '₹890',
    bookingRef: 'TRV-8819',
    destination: 'Jaipur',
  },
]

const STATUS_OVERLAY: Record<string, string> = {
  paid:     'bg-emerald-500/80 text-white',
  pending:  'bg-amber-500/80 text-white',
  refunded: 'bg-violet-500/80 text-white',
  failed:   'bg-red-500/80 text-white',
}

const STATUS_CELL: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; border: string; labelColor: string }> = {
  paid:     { icon: CheckCircle2,  label: 'Paid',     color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', labelColor: 'text-emerald-500' },
  pending:  { icon: Clock,         label: 'Pending',  color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   labelColor: 'text-amber-500'   },
  refunded: { icon: RefreshCw,     label: 'Refunded', color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-100',  labelColor: 'text-violet-500'  },
  failed:   { icon: AlertTriangle, label: 'Failed',   color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-100',     labelColor: 'text-red-500'     },
}

const SUMMARY = [
  { label: 'Total Spent', value: '₹9,389', icon: TrendingUp, color: 'text-amber-600',  bg: 'bg-amber-50'  },
  { label: 'Pending',     value: '₹0',     icon: Clock,      color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Refunded',    value: '₹890',   icon: RefreshCw,  color: 'text-sky-500',    bg: 'bg-sky-50'    },
]

export default function PaymentsPage() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')

  const visible = MOCK_PAYMENTS.filter(p => {
    const matchFilter = active === 'All' || p.status === active.toLowerCase()
    const matchSearch = !search || p.description.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments</h1>
        <p className="text-sm text-slate-500 mt-1">Track all your transactions</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {SUMMARY.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4 text-center">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-sm sm:text-base font-extrabold text-slate-900">{s.value}</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Search payments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm placeholder-slate-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15 transition-all"
        />
      </div>

      {/* Filter tabs — amber/orange theme */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              active === f
                ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'border-slate-200 text-slate-600 bg-white hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Payment cards */}
      {visible.length > 0 ? (
        <div className="space-y-4">
          {visible.map(p => {
            const cfg = STATUS_CELL[p.status] ?? STATUS_CELL.paid
            const StatusIcon = cfg.icon
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">

                {/* Destination image — same height as My Trips */}
                <div className="relative h-36 sm:h-44 overflow-hidden">
                  <Image
                    src={getDestinationImage(p.destination, 800, 350)}
                    alt={p.destination}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${STATUS_OVERLAY[p.status]}`}>
                    {cfg.label}
                  </span>
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow">{p.description}</h3>
                    <p className="text-white/75 text-xs mt-0.5">{p.date}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-4 pt-3 pb-3">
                  <div className="grid grid-cols-3 gap-2 mb-3">

                    {/* Amount */}
                    <div className="rounded-xl px-2 py-2 bg-amber-50 border border-amber-100 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-amber-500">Amount</p>
                        <p className="text-[10px] font-extrabold text-amber-900 leading-tight">{p.amount}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`rounded-xl px-2 py-2 ${cfg.bg} border ${cfg.border} flex items-center gap-2`}>
                      <div className={`w-8 h-8 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                        <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${cfg.labelColor}`}>Status</p>
                        <p className={`text-[10px] font-extrabold ${cfg.color} leading-tight`}>{cfg.label}</p>
                      </div>
                    </div>

                    {/* Method */}
                    <div className="rounded-xl px-2 py-2 bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Method</p>
                        <p className="text-[10px] font-extrabold text-slate-700 leading-tight truncate">{p.method}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions row — buttons match "View Trip" sizing */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 truncate flex-1 min-w-0">
                      {p.id} · {p.bookingRef}
                    </span>
                    <button className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 hover:from-amber-400 hover:to-orange-500 transition-all shrink-0">
                      <Download className="w-3.5 h-3.5" /> Receipt
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600 mb-1">No payments found</p>
          <p className="text-xs text-slate-400">Your transaction history will appear here.</p>
        </div>
      )}
    </div>
  )
}
