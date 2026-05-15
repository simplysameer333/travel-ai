'use client'

import { Wallet, Gift, Users, RefreshCw, Tag, Clock, ArrowRight, Copy } from 'lucide-react'

const CREDITS = [
  { label: 'Cashback Credits', value: '₹0', icon: Gift,      color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Referral Credits', value: '₹0', icon: Users,     color: 'text-sky-500',     bg: 'bg-sky-50',     border: 'border-sky-100'     },
  { label: 'Refund Credits',   value: '₹0', icon: RefreshCw, color: 'text-violet-500',  bg: 'bg-violet-50',  border: 'border-violet-100'  },
  { label: 'Promo Credits',    value: '₹0', icon: Tag,       color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
]

export default function WalletPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Travel Wallet</h1>
        <p className="text-sm text-slate-500 mt-1">Credits, cashback and promo balance</p>
      </div>

      {/* Main balance card */}
      <div className="relative bg-gradient-to-br from-slate-800 via-blue-950 to-slate-900 rounded-2xl p-6 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-500/10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-600/10 translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/70">TravelAI Wallet</span>
          </div>
          <p className="text-xs text-white/50 font-medium uppercase tracking-wider mb-1">Available Balance</p>
          <p className="text-4xl font-black text-white tracking-tight">₹0.00</p>
          <p className="text-xs text-white/40 mt-2">No active credits at the moment</p>
        </div>
      </div>

      {/* Credit breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {CREDITS.map(c => (
          <div key={c.label} className={`bg-white rounded-2xl border ${c.border} shadow-sm p-4`}>
            <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className={`text-lg font-extrabold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Referral section */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl border border-sky-100 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Earn ₹500 per referral</h3>
            <p className="text-xs text-slate-500 mb-3">
              Invite friends to TravelAI. When they book their first trip, you both get ₹500 in wallet credits.
            </p>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-sky-200 px-3 py-2">
              <code className="flex-1 text-xs font-mono font-bold text-sky-600">TRAVELAI-INVITE</code>
              <button className="flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-600 transition-colors">
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Transaction History</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No transactions yet.</p>
          <p className="text-xs text-slate-400 mt-1">Credits earned from cashback, referrals, and refunds will appear here.</p>
        </div>
      </div>

      {/* How to earn */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">How to earn credits</h3>
        <div className="space-y-3">
          {[
            { icon: Gift,  text: 'Get cashback on every booking',      color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: Users, text: 'Invite friends — earn ₹500 each',    color: 'text-sky-500',     bg: 'bg-sky-50'     },
            { icon: Tag,   text: 'Use promo codes for bonus credits',   color: 'text-amber-500',   bg: 'bg-amber-50'   },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className="text-sm text-slate-700">{item.text}</p>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto" />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
