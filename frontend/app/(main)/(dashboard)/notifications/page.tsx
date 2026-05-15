'use client'

import { useState } from 'react'
import { Bell, TrendingDown, Ticket, CreditCard, Plane, Settings, CheckCheck } from 'lucide-react'

const CATEGORIES = ['All', 'Bookings', 'Payments', 'Prices', 'Reminders']

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    category: 'Prices',
    title: 'Price drop alert — Delhi to Goa',
    body: 'Flights dropped 18% this week. Current lowest: ₹2,890.',
    time: '2 hours ago',
    read: false,
    icon: TrendingDown,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    id: '2',
    category: 'Bookings',
    title: 'Booking confirmed — TRV-8821',
    body: 'Your IndraAir flight DEL → GOA on Jun 15 is confirmed.',
    time: '3 days ago',
    read: false,
    icon: Ticket,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
  },
  {
    id: '3',
    category: 'Payments',
    title: 'Payment successful — ₹4,299',
    body: 'Payment for IndraAir booking TRV-8821 was processed.',
    time: '3 days ago',
    read: true,
    icon: CreditCard,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    id: '4',
    category: 'Reminders',
    title: 'Check-in opens in 24 hours',
    body: 'Online check-in for IndraAir IA-441 (Jun 15) opens tomorrow.',
    time: '5 days ago',
    read: true,
    icon: Plane,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
]

export default function NotificationsPage() {
  const [active, setActive] = useState('All')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length

  const visible = notifications.filter(n =>
    active === 'All' || n.category === active
  )

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">{unreadCount}</span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">Stay updated on your travel</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <Settings className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              active === c
                ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/25'
                : 'border-slate-200 text-slate-600 bg-white hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {visible.length > 0 ? (
        <div className="space-y-2">
          {visible.map(n => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm ${
                n.read
                  ? 'bg-white border-slate-100'
                  : `${n.bg} ${n.border}`
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-100' : `${n.bg}`}`}>
                <n.icon className={`w-5 h-5 ${n.read ? 'text-slate-400' : n.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[11px] text-slate-400 mt-1.5">{n.time}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600 mb-1">All caught up!</p>
          <p className="text-xs text-slate-400">No {active !== 'All' ? active.toLowerCase() : ''} notifications right now.</p>
        </div>
      )}
    </div>
  )
}
